import { createSlice } from "@reduxjs/toolkit";

const globalLoaderSlice = createSlice({
   name: "globalLoader",
   initialState: {
      isLoading: false,
   },
   reducers: {
      showLoader: (state) => {
         state.isLoading = true;
      },
      hideLoader: (state) => {
         state.isLoading = false;
      },
   },
});

export const { showLoader, hideLoader } = globalLoaderSlice.actions;
export default globalLoaderSlice;
