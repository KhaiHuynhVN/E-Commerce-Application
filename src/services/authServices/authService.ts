import store from "@/store";
import {
  axiosInstance,
  pendingManager,
  notifyService,
  translationConfig as i18n,
} from "@/utils";
import { pendingManagerActions } from "@/store/slices";

import type { LoginRequest, LoginResponse } from "./authService.types";

const authService = {
  /**
   * Đăng nhập với DummyJSON API
   * @param credentials - username và password
   * @returns Thông tin user kèm access token
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    // Check và notify nếu đang pending
    if (pendingManager.isLoginPending) {
      notifyService.addNotification(i18n.t("pendingMessages.loginInProgress"), {
        type: "warning",
        duration: 3000,
        showProgressBar: true,
        freezeOnHover: true,
        stack: true,
        newItemOnTop: true,
        placement: "top-right",
        width: 350,
        maxWidth: 350,
      });
      return Promise.reject(new Error(i18n.t("pendingErrors.loginInProgress")));
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsLoginPending(true));
    pendingManager.setLoginPending(true);

    try {
      const response = await axiosInstance.post<LoginResponse>("/auth/login", {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: credentials.expiresInMins || 30,
      });
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsLoginPending(false));
      pendingManager.setLoginPending(false);
    }
  },

  /**
   * Lấy thông tin user hiện tại đang đăng nhập
   * @returns Thông tin user
   */
  getCurrentUser: async (): Promise<LoginResponse> => {
    // Check và notify nếu đang pending
    if (pendingManager.isGetCurrentUserPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.getCurrentUserInProgress"),
        {
          type: "warning",
          duration: 3000,
          showProgressBar: true,
          freezeOnHover: true,
          stack: true,
          newItemOnTop: true,
          placement: "top-right",
          width: 350,
          maxWidth: 350,
        }
      );
      return Promise.reject(
        new Error(i18n.t("pendingErrors.getCurrentUserInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsGetCurrentUserPending(true));
    pendingManager.setGetCurrentUserPending(true);

    try {
      const response = await axiosInstance.get<LoginResponse>("/auth/me");
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsGetCurrentUserPending(false));
      pendingManager.setGetCurrentUserPending(false);
    }
  },

  /**
   * Làm mới access token
   * @param refreshToken - Refresh token
   * @returns Access token mới
   */
  refreshToken: async (
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken: string }> => {
    // Check và notify nếu đang pending
    if (pendingManager.isRefreshTokenPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.refreshTokenInProgress"),
        {
          type: "warning",
          duration: 3000,
          showProgressBar: true,
          freezeOnHover: true,
          stack: true,
          newItemOnTop: true,
          placement: "top-right",
          width: 350,
          maxWidth: 350,
        }
      );
      return Promise.reject(
        new Error(i18n.t("pendingErrors.refreshTokenInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsRefreshTokenPending(true));
    pendingManager.setRefreshTokenPending(true);

    try {
      const response = await axiosInstance.post("/auth/refresh", {
        refreshToken,
        expiresInMins: 30,
      });
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsRefreshTokenPending(false));
      pendingManager.setRefreshTokenPending(false);
    }
  },
};

export { authService };
