/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useLanguage } from "./hooks";
import { authSelectors, authActions } from "./store/slices";
import { authService } from "./services";

const useApp = () => {
  const { initLanguage } = useLanguage();
  const dispatch = useDispatch();

  const token = useSelector(authSelectors.token);
  const user = useSelector(authSelectors.user);

  useEffect(() => {
    initLanguage();
  }, []);

  // Restore user info từ token khi app mount
  useEffect(() => {
    const restoreUser = async () => {
      // Chỉ restore nếu có token nhưng chưa có user info
      if (token && !user) {
        try {
          const userData = await authService.getCurrentUser();
          // Dùng setUser thay vì setAuth để không overwrite token
          dispatch(authActions.setUser(userData));
        } catch {
          // Nếu fail (token hết hạn), clear token và let ProtectedRoute redirect
          dispatch(authActions.logout());
        }
      }
    };

    restoreUser();
  }, [token, user, dispatch]);

  return { token };
};

export default useApp;
