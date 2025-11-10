import store from "@/store";
import {
  axiosInstance,
  pendingManager,
  notifyService,
  translationConfig as i18n,
} from "@/utils";
import { pendingManagerActions } from "@/store/slices";

import type {
  Cart,
  UserCartsResponse,
  AddToCartRequest,
  UpdateCartRequest,
} from "./cartsService.types";

const cartsService = {
  /**
   * Lấy tất cả carts của user hiện tại
   * @param userId - ID của user
   * @returns Danh sách carts
   */
  getUserCarts: async (userId: number): Promise<UserCartsResponse> => {
    // Check và notify nếu đang pending
    if (pendingManager.isGetCartPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.getCartInProgress"),
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
        new Error(i18n.t("pendingErrors.getCartInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsGetCartPending(true));
    pendingManager.setGetCartPending(true);

    try {
      const response = await axiosInstance.get<UserCartsResponse>(
        `/carts/user/${userId}`
      );
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsGetCartPending(false));
      pendingManager.setGetCartPending(false);
    }
  },

  /**
   * Lấy 1 cart cụ thể
   * @param cartId - ID của cart
   * @returns Cart detail
   */
  getCartById: async (cartId: number): Promise<Cart> => {
    // Check và notify nếu đang pending
    if (pendingManager.isGetCartPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.getCartInProgress"),
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
        new Error(i18n.t("pendingErrors.getCartInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsGetCartPending(true));
    pendingManager.setGetCartPending(true);

    try {
      const response = await axiosInstance.get<Cart>(`/carts/${cartId}`);
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsGetCartPending(false));
      pendingManager.setGetCartPending(false);
    }
  },

  /**
   * Thêm sản phẩm vào cart (tạo cart mới)
   * @param data - userId và products
   * @param productId - ID sản phẩm để track pending (optional)
   * @returns Cart mới được tạo
   */
  addToCart: async (
    data: AddToCartRequest,
    productId?: number
  ): Promise<Cart> => {
    // Check pending per product ID (nếu có productId)
    if (
      productId !== undefined &&
      pendingManager.hasAddToCartPendingProductId(productId)
    ) {
      notifyService.addNotification(
        i18n.t("pendingMessages.addToCartInProgress"),
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
        new Error(i18n.t("pendingErrors.addToCartInProgress"))
      );
    }

    // Add product ID to pending set
    if (productId !== undefined) {
      store.dispatch(
        pendingManagerActions.addAddToCartPendingProductId(productId)
      );
      pendingManager.addAddToCartPendingProductId(productId);
    }

    try {
      const response = await axiosInstance.post<Cart>("/carts/add", data);
      return response.data;
    } finally {
      // Remove product ID from pending set
      if (productId !== undefined) {
        store.dispatch(
          pendingManagerActions.removeAddToCartPendingProductId(productId)
        );
        pendingManager.removeAddToCartPendingProductId(productId);
      }
    }
  },

  /**
   * Update cart hiện tại
   * @param cartId - ID của cart cần update
   * @param data - Products và merge option
   * @param productId - ID sản phẩm để track pending (optional)
   * @returns Cart sau khi update
   */
  updateCart: async (
    cartId: number,
    data: UpdateCartRequest,
    productId?: number
  ): Promise<Cart> => {
    // Check pending per product ID (nếu có productId)
    if (
      productId !== undefined &&
      pendingManager.hasUpdateCartPendingProductId(productId)
    ) {
      notifyService.addNotification(
        i18n.t("pendingMessages.updateCartInProgress"),
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
        new Error(i18n.t("pendingErrors.updateCartInProgress"))
      );
    }

    // Add product ID to pending set
    if (productId !== undefined) {
      store.dispatch(
        pendingManagerActions.addUpdateCartPendingProductId(productId)
      );
      pendingManager.addUpdateCartPendingProductId(productId);
    }

    try {
      const response = await axiosInstance.put<Cart>(`/carts/${cartId}`, data);
      return response.data;
    } finally {
      // Remove product ID from pending set
      if (productId !== undefined) {
        store.dispatch(
          pendingManagerActions.removeUpdateCartPendingProductId(productId)
        );
        pendingManager.removeUpdateCartPendingProductId(productId);
      }
    }
  },

  /**
   * Xóa cart
   * @param cartId - ID của cart cần xóa
   * @returns Cart đã xóa (với isDeleted flag)
   */
  deleteCart: async (cartId: number): Promise<Cart> => {
    // Check và notify nếu đang pending
    if (pendingManager.isDeleteCartPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.deleteCartInProgress"),
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
        new Error(i18n.t("pendingErrors.deleteCartInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsDeleteCartPending(true));
    pendingManager.setDeleteCartPending(true);

    try {
      const response = await axiosInstance.delete<Cart>(`/carts/${cartId}`);
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsDeleteCartPending(false));
      pendingManager.setDeleteCartPending(false);
    }
  },
};

export { cartsService };
