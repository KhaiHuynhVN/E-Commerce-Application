/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useLanguage } from "./hooks";
import { authSelectors, authActions, cartActions } from "./store/slices";
import { authService, cartsService } from "./services";

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

          // Fetch cart của user và lưu vào Redux
          try {
            const cartResponse = await cartsService.getUserCarts(userData.id);
            // Lấy cart đầu tiên của user (active cart)
            if (cartResponse.carts.length > 0) {
              dispatch(cartActions.setCart(cartResponse.carts[0]));
            }
          } catch (cartError) {
            // Không fail nếu fetch cart lỗi, chỉ log
            console.error("Failed to fetch cart on restore:", cartError);
          }
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
