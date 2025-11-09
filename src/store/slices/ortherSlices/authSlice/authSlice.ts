import { createSlice } from "@reduxjs/toolkit";

import { commonConstants } from "../../../../utils";

const initialState = {
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      Object.assign(state, initialState);
      localStorage.removeItem(commonConstants.TOKEN);
    },
  },
});

export const { setToken, logout } = authSlice.actions;
export default authSlice;
