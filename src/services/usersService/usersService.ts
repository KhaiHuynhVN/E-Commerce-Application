import store from "@/store";
import {
  axiosInstance,
  pendingManager,
  notifyService,
  translationConfig as i18n,
} from "@/utils";
import { pendingManagerActions } from "@/store/slices";

import type { User, UpdateUserRequest } from "./usersService.types";

const usersService = {
  /**
   * Update user information
   * @param userId - ID của user
   * @param data - Thông tin cần update
   * @param signal - AbortSignal để cancel request
   * @returns Updated user data
   */
  updateUser: async (
    userId: number,
    data: UpdateUserRequest,
    signal?: AbortSignal
  ): Promise<User> => {
    // Check và notify nếu đang pending
    if (pendingManager.isUpdateUserPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.updateUserInProgress"),
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
        new Error(i18n.t("pendingErrors.updateUserInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsUpdateUserPending(true));
    pendingManager.setUpdateUserPending(true);

    try {
      const response = await axiosInstance.put<User>(`/users/${userId}`, data, {
        signal,
      });
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsUpdateUserPending(false));
      pendingManager.setUpdateUserPending(false);
    }
  },
};

export { usersService };
