import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";

import { commonConstants } from "@/utils/constants";
import store from "@/store";
import { authActions } from "@/store/slices";
import { authTokenService } from "@/services";

// Base URL của DummyJSON API
const BASE_URL = "https://dummyjson.com";

// Tạo axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag để tránh multiple refresh calls cùng lúc
let isRefreshing = false;
// Queue các requests đang chờ token refresh
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Refresh access token
 */
const refreshAccessToken = async (): Promise<string> => {
  const refreshToken = authTokenService.getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  try {
    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
      refreshToken,
      expiresInMins: 15,
    });

    const { token: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    // Update tokens
    authTokenService.updateAccessToken(newAccessToken, newRefreshToken);
    // Also update legacy localStorage for backwards compatibility
    localStorage.setItem(commonConstants.TOKEN, newAccessToken);

    return newAccessToken;
  } catch (error) {
    // Refresh failed → logout
    authTokenService.clearTokens();
    localStorage.removeItem(commonConstants.TOKEN);
    store.dispatch(authActions.logout());
    throw error;
  }
};

// Request interceptor - Auto refresh token if needed
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Skip cho auth endpoints
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/refresh")
    ) {
      return config;
    }

    // Check nếu token sắp hết hạn
    if (authTokenService.isTokenExpiringSoon()) {
      // Nếu đang refresh, queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const token = authTokenService.getAccessToken();
            if (config.headers && token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Start refresh
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        // Update current request
        if (config.headers) {
          config.headers.Authorization = `Bearer ${newToken}`;
        }
      } catch (error) {
        processQueue(error as AxiosError, null);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else {
      // Token còn valid, add vào header
      const token =
        authTokenService.getAccessToken() ||
        localStorage.getItem(commonConstants.TOKEN);
      if (config.headers && token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 và retry with refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Xử lý 401 Unauthorized
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      // Skip cho auth endpoints
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        store.dispatch(authActions.logout());
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      // Nếu đang refresh, queue request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            const token = authTokenService.getAccessToken();
            if (originalRequest.headers && token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        processQueue(null, newToken);

        // Retry original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError, null);

        // Logout nếu refresh fails
        store.dispatch(authActions.logout());
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
