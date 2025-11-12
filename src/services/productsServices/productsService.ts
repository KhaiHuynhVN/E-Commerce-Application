import store from "@/store";
import {
  axiosInstance,
  pendingManager,
  notifyService,
  translationConfig as i18n,
} from "@/utils";
import { pendingManagerActions } from "@/store/slices";

import type {
  ProductsResponse,
  GetProductsParams,
  SearchProductsParams,
  Product,
} from "./productsService.types";

const productsService = {
  /**
   * Lấy danh sách products với pagination
   * @param params - limit và skip cho pagination
   * @param signal - AbortSignal để cancel request
   * @returns Danh sách products
   */
  getProducts: async (
    params: GetProductsParams = {},
    signal?: AbortSignal
  ): Promise<ProductsResponse> => {
    // Check và notify nếu đang pending
    if (pendingManager.isGetProductsPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.getProductsInProgress"),
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
        new Error(i18n.t("pendingErrors.getProductsInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsGetProductsPending(true));
    pendingManager.setGetProductsPending(true);

    try {
      const { limit = 20, skip = 0 } = params;
      const response = await axiosInstance.get<ProductsResponse>("/products", {
        params: { limit, skip },
        signal,
      });
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsGetProductsPending(false));
      pendingManager.setGetProductsPending(false);
    }
  },

  /**
   * Tìm kiếm products theo tên
   * @param params - query string và pagination params
   * @param signal - AbortSignal để cancel request
   * @returns Danh sách products matching query
   */
  searchProducts: async (
    params: SearchProductsParams,
    signal?: AbortSignal
  ): Promise<ProductsResponse> => {
    // Check và notify nếu đang pending
    if (pendingManager.isSearchProductsPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.searchProductsInProgress"),
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
        new Error(i18n.t("pendingErrors.searchProductsInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsSearchProductsPending(true));
    pendingManager.setSearchProductsPending(true);

    try {
      const { q, limit = 20, skip = 0 } = params;
      const response = await axiosInstance.get<ProductsResponse>(
        "/products/search",
        {
          params: { q, limit, skip },
          signal,
        }
      );
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsSearchProductsPending(false));
      pendingManager.setSearchProductsPending(false);
    }
  },

  /**
   * Lấy chi tiết 1 product
   * @param id - Product ID
   * @returns Thông tin chi tiết product
   */
  getProductById: async (id: number): Promise<Product> => {
    // Check và notify nếu đang pending
    if (pendingManager.isGetProductByIdPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.getProductByIdInProgress"),
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
        new Error(i18n.t("pendingErrors.getProductByIdInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsGetProductByIdPending(true));
    pendingManager.setGetProductByIdPending(true);

    try {
      const response = await axiosInstance.get<Product>(`/products/${id}`);
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsGetProductByIdPending(false));
      pendingManager.setGetProductByIdPending(false);
    }
  },

  /**
   * Lấy tất cả categories
   * @returns Danh sách categories
   */
  getCategories: async (): Promise<string[]> => {
    // Check và notify nếu đang pending
    if (pendingManager.isGetCategoriesPending) {
      notifyService.addNotification(
        i18n.t("pendingMessages.getCategoriesInProgress"),
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
        new Error(i18n.t("pendingErrors.getCategoriesInProgress"))
      );
    }

    // Set pending state
    store.dispatch(pendingManagerActions.setIsGetCategoriesPending(true));
    pendingManager.setGetCategoriesPending(true);

    try {
      const response = await axiosInstance.get<string[]>(
        "/products/categories"
      );
      return response.data;
    } finally {
      // Clear pending state
      store.dispatch(pendingManagerActions.setIsGetCategoriesPending(false));
      pendingManager.setGetCategoriesPending(false);
    }
  },
};

export { productsService };
