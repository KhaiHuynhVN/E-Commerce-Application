import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface PendingManagerState {
  isLoginPending: boolean;
}

const initialState: PendingManagerState = {
  isLoginPending: false,
};

const pendingManagerSlice = createSlice({
  name: "pendingManager",
  initialState,
  reducers: {
    setIsLoginPending: (
      state: PendingManagerState,
      action: PayloadAction<boolean>
    ) => {
      state.isLoginPending = action.payload;
    },
  },
});

export const { setIsLoginPending } = pendingManagerSlice.actions;

export default pendingManagerSlice;
