import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Cart, CartProduct } from "../../../../services";

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
    // Set toàn bộ cart
    setCart: (state, action: PayloadAction<Cart>) => {
      state.cart = action.payload;
    },

    // Clear cart (sau khi checkout hoặc logout)
    clearCart: (state) => {
      state.cart = null;
    },

    // Update quantity của 1 product trong cart (optimistic update)
    updateProductQuantity: (
      state,
      action: PayloadAction<{ productId: number; quantity: number }>
    ) => {
      if (state.cart) {
        const product = state.cart.products.find(
          (p) => p.id === action.payload.productId
        );
        if (product) {
          product.quantity = action.payload.quantity;
          product.total = product.price * action.payload.quantity;
          product.discountedTotal =
            product.total * (1 - product.discountPercentage / 100);

          // Recalculate cart totals
          state.cart.totalQuantity = state.cart.products.reduce(
            (sum, p) => sum + p.quantity,
            0
          );
          state.cart.total = state.cart.products.reduce(
            (sum, p) => sum + p.total,
            0
          );
          state.cart.discountedTotal = state.cart.products.reduce(
            (sum, p) => sum + p.discountedTotal,
            0
          );
        }
      }
    },

    // Remove product khỏi cart (optimistic update)
    removeProduct: (state, action: PayloadAction<number>) => {
      if (state.cart) {
        state.cart.products = state.cart.products.filter(
          (p) => p.id !== action.payload
        );
        state.cart.totalProducts = state.cart.products.length;
        state.cart.totalQuantity = state.cart.products.reduce(
          (sum, p) => sum + p.quantity,
          0
        );
        state.cart.total = state.cart.products.reduce(
          (sum, p) => sum + p.total,
          0
        );
        state.cart.discountedTotal = state.cart.products.reduce(
          (sum, p) => sum + p.discountedTotal,
          0
        );
      }
    },

    // Add product vào cart (optimistic update)
    addProduct: (state, action: PayloadAction<CartProduct>) => {
      if (state.cart) {
        const existingProduct = state.cart.products.find(
          (p) => p.id === action.payload.id
        );

        if (existingProduct) {
          // Nếu product đã có, tăng quantity
          existingProduct.quantity += action.payload.quantity;
          existingProduct.total = existingProduct.price * existingProduct.quantity;
          existingProduct.discountedTotal =
            existingProduct.total * (1 - existingProduct.discountPercentage / 100);
        } else {
          // Nếu chưa có, thêm mới
          state.cart.products.push(action.payload);
          state.cart.totalProducts += 1;
        }

        // Recalculate cart totals
        state.cart.totalQuantity = state.cart.products.reduce(
          (sum, p) => sum + p.quantity,
          0
        );
        state.cart.total = state.cart.products.reduce(
          (sum, p) => sum + p.total,
          0
        );
        state.cart.discountedTotal = state.cart.products.reduce(
          (sum, p) => sum + p.discountedTotal,
          0
        );
      }
    },
  },
});

const {
  setCart,
  clearCart,
  updateProductQuantity,
  removeProduct,
  addProduct,
} = cartSlice.actions;

export {
  setCart,
  clearCart,
  updateProductQuantity,
  removeProduct,
  addProduct,
};
export default cartSlice;

