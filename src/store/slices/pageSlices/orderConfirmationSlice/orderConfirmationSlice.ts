import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface OrderInfo {
  orderNumber: string;
  total: number;
  discountedTotal: number;
  totalProducts: number;
  totalQuantity: number;
}

interface OrderState {
  orderInfo: OrderInfo | null;
}

const initialState: OrderState = {
  orderInfo: null,
};

const orderConfirmationSlice = createSlice({
  name: "orderConfirmation",
  initialState,
  reducers: {
    // Set order info sau khi place order thành công
    setOrderInfo: (state, action: PayloadAction<OrderInfo>) => {
      state.orderInfo = action.payload;
    },

    // Clear order info (sau khi user rời trang confirmation)
    clearOrderInfo: (state) => {
      state.orderInfo = null;
    },
  },
});

const { setOrderInfo, clearOrderInfo } = orderConfirmationSlice.actions;

export { setOrderInfo, clearOrderInfo };
export default orderConfirmationSlice;
