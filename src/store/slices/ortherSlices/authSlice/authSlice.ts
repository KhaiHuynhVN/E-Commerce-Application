import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { commonConstants } from "../../../../utils";
import type { LoginResponse } from "../../../../services";

interface AuthState {
  user: LoginResponse | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem(commonConstants.TOKEN) || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Lưu thông tin user và token sau khi login thành công
    setAuth: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload;
      state.token = action.payload.accessToken;
      localStorage.setItem(commonConstants.TOKEN, action.payload.accessToken);
    },
    // Chỉ set user info, không touch token (dùng khi restore user từ token)
    setUser: (state, action: PayloadAction<LoginResponse>) => {
      state.user = action.payload;
    },
    // Xóa thông tin user và token khi logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem(commonConstants.TOKEN);
    },
  },
});

const { setAuth, setUser, logout } = authSlice.actions;

export { setAuth, setUser, logout };
export default authSlice;
