import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

import { commonConstants } from "../constants";
import store from "../../store";
import { authActions } from "../../store/slices";

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

// Request interceptor - Tự động thêm JWT token vào headers
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(commonConstants.TOKEN);

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Xử lý lỗi global
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Xử lý 401 Unauthorized - Token hết hạn hoặc không hợp lệ
    if (error.response?.status === 401) {
      // Dispatch logout action thay vì force redirect
      // Điều này cho phép React Router xử lý redirect một cách graceful
      store.dispatch(authActions.logout());

      // Chỉ redirect nếu không phải đang ở trang login
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
