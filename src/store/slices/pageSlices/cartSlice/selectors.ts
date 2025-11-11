import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../../store";

const cart = (state: RootState) => state.cart.cart;

// Derived selectors
const cartItemsCount = (state: RootState) =>
  state.cart.cart?.totalQuantity || 0;

const cartTotal = (state: RootState) => state.cart.cart?.total || 0;

const cartDiscountedTotal = (state: RootState) =>
  state.cart.cart?.discountedTotal || 0;

// Memoized selector để tránh unnecessary rerenders
const cartProducts = createSelector([cart], (cart) => cart?.products || []);

export { cart, cartItemsCount, cartTotal, cartDiscountedTotal, cartProducts };
