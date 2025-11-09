import { configureStore } from "@reduxjs/toolkit";

import {
  globalLoaderSlice,
  authSlice,
  globalSlice,
  pendingManagerSlice,
} from "./slices";

const store = configureStore({
  reducer: {
    globalLoader: globalLoaderSlice.reducer,
    auth: authSlice.reducer,
    global: globalSlice.reducer,
    pendingManager: pendingManagerSlice.reducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
