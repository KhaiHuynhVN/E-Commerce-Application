import type { RootState } from "../../../store";

const cart = (state: RootState) => state.cart.cart;
const isLoading = (state: RootState) => state.cart.isLoading;
const error = (state: RootState) => state.cart.error;

// Derived selectors
const cartItemsCount = (state: RootState) =>
  state.cart.cart?.totalQuantity || 0;

const cartTotal = (state: RootState) => state.cart.cart?.total || 0;

const cartDiscountedTotal = (state: RootState) =>
  state.cart.cart?.discountedTotal || 0;

const cartProducts = (state: RootState) => state.cart.cart?.products || [];

export {
  cart,
  isLoading,
  error,
  cartItemsCount,
  cartTotal,
  cartDiscountedTotal,
  cartProducts,
};
