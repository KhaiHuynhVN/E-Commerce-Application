import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Cart } from "@/services";

interface CartState {
  cart: Cart | null;
}

const initialState: CartState = {
  cart: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Set toàn bộ cart từ API response
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },

    // Clear cart (sau khi checkout hoặc logout)
    clearCart: (state) => {
      state.cart = null;
    },
  },
});

const { setCart, clearCart } = cartSlice.actions;

export { setCart, clearCart };
export default cartSlice;
