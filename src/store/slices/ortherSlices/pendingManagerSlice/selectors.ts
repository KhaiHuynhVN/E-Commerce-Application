import type { RootState } from "../../../store";

// Auth services
const isLoginPending = (state: RootState) =>
  state.pendingManager.isLoginPending;
const isGetCurrentUserPending = (state: RootState) =>
  state.pendingManager.isGetCurrentUserPending;
const isRefreshTokenPending = (state: RootState) =>
  state.pendingManager.isRefreshTokenPending;

// Products services
const isGetProductsPending = (state: RootState) =>
  state.pendingManager.isGetProductsPending;
const isSearchProductsPending = (state: RootState) =>
  state.pendingManager.isSearchProductsPending;
const isGetProductByIdPending = (state: RootState) =>
  state.pendingManager.isGetProductByIdPending;
const isGetCategoriesPending = (state: RootState) =>
  state.pendingManager.isGetCategoriesPending;

// Cart services
const addToCartPendingProductIds = (state: RootState) =>
  state.pendingManager.addToCartPendingProductIds;
const updateCartPendingProductIds = (state: RootState) =>
  state.pendingManager.updateCartPendingProductIds;
// Helper to check if specific product is pending
const hasAddToCartPendingProductId = (state: RootState, productId: number) =>
  state.pendingManager.addToCartPendingProductIds.includes(productId);
const hasUpdateCartPendingProductId = (state: RootState, productId: number) =>
  state.pendingManager.updateCartPendingProductIds.includes(productId);
const isGetCartPending = (state: RootState) =>
  state.pendingManager.isGetCartPending;
const isDeleteCartPending = (state: RootState) =>
  state.pendingManager.isDeleteCartPending;

const pendingManagerSelectors = {
  // Auth
  isLoginPending,
  isGetCurrentUserPending,
  isRefreshTokenPending,
  // Products
  isGetProductsPending,
  isSearchProductsPending,
  isGetProductByIdPending,
  isGetCategoriesPending,
  // Cart
  addToCartPendingProductIds,
  updateCartPendingProductIds,
  hasAddToCartPendingProductId,
  hasUpdateCartPendingProductId,
  isGetCartPending,
  isDeleteCartPending,
};

export default pendingManagerSelectors;
