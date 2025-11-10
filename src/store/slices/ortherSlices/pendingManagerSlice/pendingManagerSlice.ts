import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PendingManagerState {
  // Auth services
  isLoginPending: boolean;
  isGetCurrentUserPending: boolean;
  isRefreshTokenPending: boolean;

  // Products services
  isGetProductsPending: boolean;
  isSearchProductsPending: boolean;
  isGetProductByIdPending: boolean;
  isGetCategoriesPending: boolean;

  // Cart services
  addToCartPendingProductIds: number[]; // Track pending product IDs
  updateCartPendingProductIds: number[]; // Track pending product IDs
  isGetCartPending: boolean;
  isDeleteCartPending: boolean;
}

const initialState: PendingManagerState = {
  // Auth services
  isLoginPending: false,
  isGetCurrentUserPending: false,
  isRefreshTokenPending: false,

  // Products services
  isGetProductsPending: false,
  isSearchProductsPending: false,
  isGetProductByIdPending: false,
  isGetCategoriesPending: false,

  // Cart services
  addToCartPendingProductIds: [],
  updateCartPendingProductIds: [],
  isGetCartPending: false,
  isDeleteCartPending: false,
};

const pendingManagerSlice = createSlice({
  name: "pendingManager",
  initialState,
  reducers: {
    // Auth services
    setIsLoginPending: (state, action: PayloadAction<boolean>) => {
      state.isLoginPending = action.payload;
    },
    setIsGetCurrentUserPending: (state, action: PayloadAction<boolean>) => {
      state.isGetCurrentUserPending = action.payload;
    },
    setIsRefreshTokenPending: (state, action: PayloadAction<boolean>) => {
      state.isRefreshTokenPending = action.payload;
    },

    // Products services
    setIsGetProductsPending: (state, action: PayloadAction<boolean>) => {
      state.isGetProductsPending = action.payload;
    },
    setIsSearchProductsPending: (state, action: PayloadAction<boolean>) => {
      state.isSearchProductsPending = action.payload;
    },
    setIsGetProductByIdPending: (state, action: PayloadAction<boolean>) => {
      state.isGetProductByIdPending = action.payload;
    },
    setIsGetCategoriesPending: (state, action: PayloadAction<boolean>) => {
      state.isGetCategoriesPending = action.payload;
    },

    // Cart services
    addAddToCartPendingProductId: (state, action: PayloadAction<number>) => {
      if (!state.addToCartPendingProductIds.includes(action.payload)) {
        state.addToCartPendingProductIds.push(action.payload);
      }
    },
    removeAddToCartPendingProductId: (state, action: PayloadAction<number>) => {
      state.addToCartPendingProductIds =
        state.addToCartPendingProductIds.filter((id) => id !== action.payload);
    },
    addUpdateCartPendingProductId: (state, action: PayloadAction<number>) => {
      if (!state.updateCartPendingProductIds.includes(action.payload)) {
        state.updateCartPendingProductIds.push(action.payload);
      }
    },
    removeUpdateCartPendingProductId: (
      state,
      action: PayloadAction<number>
    ) => {
      state.updateCartPendingProductIds =
        state.updateCartPendingProductIds.filter((id) => id !== action.payload);
    },
    setIsGetCartPending: (state, action: PayloadAction<boolean>) => {
      state.isGetCartPending = action.payload;
    },
    setIsDeleteCartPending: (state, action: PayloadAction<boolean>) => {
      state.isDeleteCartPending = action.payload;
    },
  },
});

export const {
  // Auth
  setIsLoginPending,
  setIsGetCurrentUserPending,
  setIsRefreshTokenPending,
  // Products
  setIsGetProductsPending,
  setIsSearchProductsPending,
  setIsGetProductByIdPending,
  setIsGetCategoriesPending,
  // Cart
  addAddToCartPendingProductId,
  removeAddToCartPendingProductId,
  addUpdateCartPendingProductId,
  removeUpdateCartPendingProductId,
  setIsGetCartPending,
  setIsDeleteCartPending,
} = pendingManagerSlice.actions;

export default pendingManagerSlice;
