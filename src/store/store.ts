import { configureStore } from "@reduxjs/toolkit";

import {
  globalLoaderSlice,
  authSlice,
  globalSlice,
  pendingManagerSlice,
  cartSlice,
} from "./slices";

const store = configureStore({
  reducer: {
    globalLoader: globalLoaderSlice.reducer,
    auth: authSlice.reducer,
    global: globalSlice.reducer,
    pendingManager: pendingManagerSlice.reducer,
    cart: cartSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export default store;
export type { RootState, AppDispatch };
