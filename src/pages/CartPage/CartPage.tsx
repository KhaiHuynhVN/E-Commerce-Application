/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import {
  authSelectors,
  cartActions,
  cartSelectors,
  pendingManagerSelectors,
} from "@/store/slices";
import type { RootState } from "@/store";
import { cartsService } from "@/services";
import { Button } from "@/commonComponents";
import { ConfirmModal } from "@/components";
import { pendingManager, notifyService } from "@/utils";
import { CartItemSkeleton } from "./components";
import routeConfigs from "@/routeConfigs";

import styles from "./CartPage.module.scss";

const cx = classNames.bind(styles);

const CartPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(authSelectors.user);
  const cart = useSelector(cartSelectors.cart);
  const cartId = useSelector(cartSelectors.cartId);
  const cartProducts = useSelector(cartSelectors.cartProducts);
  const cartTotal = useSelector(cartSelectors.cartTotal);
  const cartDiscountedTotal = useSelector(cartSelectors.cartDiscountedTotal);
  const isGetCartPending = useSelector(
    pendingManagerSelectors.isGetCartPending
  );
  const updateCartPendingProductIds = useSelector(
    pendingManagerSelectors.updateCartPendingProductIds
  );

  // Check nếu có bất kỳ update cart operation nào đang pending
  const hasAnyUpdateCartPending = updateCartPendingProductIds.length > 0;

  const [error, setError] = useState<string | null>(null);
  const [isDebouncingQuantityChange, setIsDebouncingQuantityChange] =
    useState(false);
  const [editingQuantities, setEditingQuantities] = useState<
    Record<number, number>
  >({});
  const [productToRemove, setProductToRemove] = useState<number | null>(null);

  // Check pending state cho product đang remove
  const isRemovingProduct = useSelector((state: RootState) =>
    productToRemove !== null
      ? pendingManagerSelectors.hasUpdateCartPendingProductId(
          state,
          productToRemove
        )
      : false
  );

  // Debounce timers cho mỗi product quantity change
  const debounceTimersRef = useRef<
    Record<number, ReturnType<typeof setTimeout>>
  >({});

  // AbortControllers for request cancellation
  const fetchCartControllerRef = useRef<AbortController | null>(null);
  const updateCartControllersRef = useRef<Map<number, AbortController>>(
    new Map()
  );

  // Lấy giỏ hàng của user
  const fetchCart = async () => {
    if (!user) return;

    // Nếu đang pending, skip để tránh duplicate call
    if (isGetCartPending) return;

    // Create new AbortController for this request
    const controller = new AbortController();
    fetchCartControllerRef.current = controller;

    try {
      const response = await cartsService.getUserCarts(
        user.id,
        controller.signal
      );

      // Lấy cart đầu tiên của user (active cart)
      if (response.carts.length > 0) {
        dispatch(cartActions.setCart(response.carts[0]));
      }
    } catch (err) {
      // Ignore AbortError
      if (err instanceof Error && err.name === "CanceledError") {
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : t("serverErrors.unknownError");
      setError(errorMessage);
    } finally {
      // Clear ref
      if (fetchCartControllerRef.current === controller) {
        fetchCartControllerRef.current = null;
      }
    }
  };

  // Gọi fetchCart khi component mount
  useEffect(() => {
    fetchCart();

    // Cleanup: Clear all timers and abort controllers
    return () => {
      // Clear debounce timers
      Object.values(debounceTimersRef.current).forEach((timer) => {
        clearTimeout(timer);
      });

      // Abort fetch cart request
      if (fetchCartControllerRef.current) {
        fetchCartControllerRef.current.abort();
      }

      // Abort all update cart operations
      updateCartControllersRef.current.forEach((controller) => {
        controller.abort();
      });
      updateCartControllersRef.current.clear();
    };
  }, [user]);

  // Xử lý thay đổi số lượng sản phẩm với debounce
  const handleQuantityChange = async (
    productId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1 || !cart || !cartId) return;

    // Check xem có request nào đang pending cho product này không
    // Nếu đang có request chạy, chặn luôn không cho thay đổi
    if (pendingManager.hasUpdateCartPendingProductId(productId)) {
      notifyService.addNotification(t("cart.pleaseSlowDown"), {
        type: "warning",
        duration: 3000,
        showProgressBar: true,
        freezeOnHover: true,
        stack: true,
        newItemOnTop: true,
        placement: "top-right",
        width: 350,
        maxWidth: 350,
      });
      return;
    }

    setEditingQuantities((prev) => ({ ...prev, [productId]: newQuantity }));

    // Clear existing timer cho product này
    if (debounceTimersRef.current[productId]) {
      clearTimeout(debounceTimersRef.current[productId]);
    }

    // Set debouncing state
    setIsDebouncingQuantityChange(true);

    // Create AbortController for this update operation
    const updateController = new AbortController();
    updateCartControllersRef.current.set(productId, updateController);

    // Set new debounce timer
    debounceTimersRef.current[productId] = setTimeout(async () => {
      try {
        // Lấy products với quantity từ local editing state hoặc Redux
        const currentProducts = cartProducts.map((p) => ({
          id: p.id,
          quantity: p.id === productId ? newQuantity : p.quantity,
        }));

        // Gửi request lên server
        const response = await cartsService.updateCart(
          cartId,
          {
            merge: false,
            products: currentProducts,
          },
          productId,
          updateController.signal
        );

        // Update Redux state với server response
        dispatch(cartActions.setCart(response));

        // Clear local editing state sau khi sync xong
        setEditingQuantities((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });

        // Clear timer sau khi hoàn thành
        delete debounceTimersRef.current[productId];

        // Clear debouncing state nếu không còn timer nào
        if (Object.keys(debounceTimersRef.current).length === 0) {
          setIsDebouncingQuantityChange(false);
        }
      } catch (err) {
        // Ignore AbortError
        if (err instanceof Error && err.name === "CanceledError") {
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : t("serverErrors.unknownError");
        setError(errorMessage);

        // Clear local editing state khi error
        setEditingQuantities((prev) => {
          const updated = { ...prev };
          delete updated[productId];
          return updated;
        });

        // Clear timer
        delete debounceTimersRef.current[productId];

        // Clear debouncing state nếu không còn timer nào
        if (Object.keys(debounceTimersRef.current).length === 0) {
          setIsDebouncingQuantityChange(false);
        }
      } finally {
        // Cleanup: Remove controller from Map
        updateCartControllersRef.current.delete(productId);
      }
    }, 500);
  };

  // Mở confirm modal
  const handleRemoveClick = (productId: number) => {
    setProductToRemove(productId);
  };

  // Xử lý xóa sản phẩm khỏi giỏ hàng
  const handleConfirmRemove = async () => {
    if (!productToRemove || !cart || !cartId) {
      setProductToRemove(null);
      return;
    }

    // Check xem product có tồn tại không
    const productExists = cart.products.some((p) => p.id === productToRemove);
    if (!productExists) {
      setProductToRemove(null);
      return;
    }

    // Create AbortController for this remove operation
    const removeController = new AbortController();
    updateCartControllersRef.current.set(productToRemove, removeController);

    try {
      // Lấy products sau khi remove product này
      const currentProducts = cartProducts
        .filter((p) => p.id !== productToRemove)
        .map((p) => ({
          id: p.id,
          quantity: p.quantity,
        }));

      // Gửi request lên server
      const response = await cartsService.updateCart(
        cartId,
        {
          merge: false,
          products: currentProducts,
        },
        productToRemove,
        removeController.signal
      );

      // Update state với server response
      dispatch(cartActions.setCart(response));

      // Đóng modal (chỉ khi API success)
      setProductToRemove(null);
    } catch (err) {
      // Ignore AbortError
      if (err instanceof Error && err.name === "CanceledError") {
        setProductToRemove(null);
        return;
      }

      const errorMessage =
        err instanceof Error ? err.message : t("serverErrors.unknownError");
      setError(errorMessage);

      // Đóng modal khi có lỗi
      setProductToRemove(null);
    } finally {
      // Cleanup: Remove controller from Map
      updateCartControllersRef.current.delete(productToRemove);
    }
  };

  // Đóng confirm modal
  const handleCancelRemove = () => {
    setProductToRemove(null);
  };

  // Xử lý click checkout button
  const handleCheckoutClick = () => {
    // Chặn navigation nếu có pending operations hoặc đang debounce
    if (hasAnyUpdateCartPending || isDebouncingQuantityChange) return;

    navigate(routeConfigs.checkout.path);
  };

  return (
    <div
      className={cx("wrapper", "p-6 max-h-[calc(100vh-var(--header-height))]")}
    >
      <div className={cx("container", "mx-auto")}>
        {/* Header */}
        <h1 className={cx("title", "text-5xl font-bold mb-8")}>
          {t("cart.title")}
        </h1>

        {/* Loading State */}
        {isGetCartPending && (
          <div
            className={cx("content", "grid grid-cols-1 lg:grid-cols-3 gap-8")}
          >
            <div className={cx("productsList", "lg:col-span-2")}>
              {Array.from({ length: 10 }).map((_, index) => (
                <CartItemSkeleton key={`skeleton-${index}`} />
              ))}
            </div>

            {/* Summary Skeleton */}
            <div className={cx("summary", "lg:col-span-1")}>
              <div
                className={cx(
                  "summaryCard",
                  "bg-white p-6 rounded-lg shadow-md sticky top-24"
                )}
              >
                <div className="placeholder h-8 w-40 mb-6" />
                <div className="placeholder h-5 w-full mb-3" />
                <div className="placeholder h-5 w-full mb-3" />
                <div className="placeholder h-6 w-full mb-6" />
                <div className="placeholder h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={cx("error", "text-center mb-6 p-4 rounded-lg")}>
            {error}
          </div>
        )}

        {/* Empty Cart */}
        {!isGetCartPending && !error && cartProducts.length === 0 && (
          <div className={cx("empty", "text-center py-16")}>
            <p className={cx("emptyText", "text-2xl mb-4")}>
              {t("cart.emptyCart")}
            </p>
            <p className={cx("emptyHint")}>{t("cart.emptyCartHint")}</p>
          </div>
        )}

        {/* Cart Content */}
        {!isGetCartPending && !error && cartProducts.length > 0 && (
          <div
            className={cx("content", "grid grid-cols-1 lg:grid-cols-3 gap-8")}
          >
            {/* Products List */}
            <div
              className={cx("productsList", "lg:col-span-2 overflow-y-auto")}
            >
              {cartProducts.map((product) => (
                <div
                  key={product.id}
                  className={cx(
                    "productItem",
                    "flex gap-4 p-4 mb-4 bg-white rounded-lg shadow"
                  )}
                >
                  {/* Product Image */}
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className={cx(
                      "productImage",
                      "w-24 h-24 object-cover rounded"
                    )}
                  />

                  {/* Product Info */}
                  <div className={cx("productInfo", "flex-1")}>
                    <h3
                      className={cx(
                        "productTitle",
                        "text-lg font-semibold mb-2"
                      )}
                    >
                      {product.title}
                    </h3>
                    <p className={cx("productPrice", "text-gray-600")}>
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div
                      className={cx(
                        "quantityControls",
                        "flex items-center gap-2 mt-4"
                      )}
                    >
                      <Button
                        styleType="senary"
                        onClick={() => {
                          const currentQuantity =
                            editingQuantities[product.id] ?? product.quantity;
                          handleQuantityChange(product.id, currentQuantity - 1);
                        }}
                        disabled={
                          (editingQuantities[product.id] ?? product.quantity) <=
                          1
                        }
                      >
                        −
                      </Button>
                      <span className={cx("quantity")}>
                        {editingQuantities[product.id] ?? product.quantity}
                      </span>
                      <Button
                        styleType="senary"
                        onClick={() => {
                          const currentQuantity =
                            editingQuantities[product.id] ?? product.quantity;
                          handleQuantityChange(product.id, currentQuantity + 1);
                        }}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Product Total & Remove */}
                  <div
                    className={cx(
                      "productActions",
                      "flex flex-col items-end justify-between"
                    )}
                  >
                    <p className={cx("productTotal", "text-lg font-bold")}>
                      ${product.discountedPrice.toFixed(2)}
                    </p>
                    <Button
                      styleType="septenary"
                      onClick={() => handleRemoveClick(product.id)}
                    >
                      {t("cart.remove")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className={cx("summary", "lg:col-span-1")}>
              <div
                className={cx(
                  "summaryCard",
                  "bg-white rounded-lg shadow p-6 sticky top-[65px]"
                )}
              >
                <h2 className={cx("summaryTitle", "text-2xl font-bold mb-4")}>
                  {t("cart.summary")}
                </h2>

                <div className={cx("summaryRow", "flex justify-between mb-2")}>
                  <span>{t("cart.subtotal")}:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div
                  className={cx(
                    "summaryRow",
                    "flex justify-between mb-2 text-green-600"
                  )}
                >
                  <span>{t("cart.discount")}:</span>
                  <span>-${(cartTotal - cartDiscountedTotal).toFixed(2)}</span>
                </div>

                <hr className="my-4" />

                <div
                  className={cx(
                    "summaryRow",
                    "flex justify-between text-xl font-bold mb-6"
                  )}
                >
                  <span>{t("cart.total")}:</span>
                  <span>${cartDiscountedTotal.toFixed(2)}</span>
                </div>

                <Button
                  styleType="primary"
                  className="w-full"
                  onClick={handleCheckoutClick}
                  disabled={
                    hasAnyUpdateCartPending || isDebouncingQuantityChange
                  }
                >
                  {t("cart.proceedToCheckout")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Remove Modal */}
        <ConfirmModal
          isOpen={productToRemove !== null}
          type="warning"
          title={t("cart.confirmRemoveTitle")}
          message={t("cart.confirmRemoveMessage")}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
          isLoading={isRemovingProduct}
          isDangerous
        />
      </div>
    </div>
  );
};

export default CartPage;
