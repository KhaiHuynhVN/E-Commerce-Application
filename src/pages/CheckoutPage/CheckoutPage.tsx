/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";

import {
  authSelectors,
  cartSelectors,
  cartActions,
  orderConfirmationActions,
  pendingManagerSelectors,
} from "@/store/slices";
import { Button } from "@/commonComponents";
import { InnerLoader } from "@/components";
import { usersService, cartsService } from "@/services";
import { useGlobalLoaderHandle } from "@/hooks";
import {
  ShippingForm,
  PaymentForm,
  type ShippingFormData,
  type PaymentFormData,
} from "./components";
import routeConfigs from "@/routeConfigs";

import styles from "./CheckoutPage.module.scss";

const cx = classNames.bind(styles);

const CheckoutPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { show: showGlobalLoader, hide: hideGlobalLoader } =
    useGlobalLoaderHandle();

  const user = useSelector(authSelectors.user);
  const cart = useSelector(cartSelectors.cart);
  const cartId = useSelector(cartSelectors.cartId);
  const cartProducts = useSelector(cartSelectors.cartProducts);
  const cartTotal = useSelector(cartSelectors.cartTotal);
  const cartDiscountedTotal = useSelector(cartSelectors.cartDiscountedTotal);
  const isUpdateUserPending = useSelector(
    pendingManagerSelectors.isUpdateUserPending
  );
  const isDeleteCartPending = useSelector(
    pendingManagerSelectors.isDeleteCartPending
  );

  // Refs for form data
  const shippingFormRef = useRef<{ getData: () => ShippingFormData | null }>(
    null
  );
  const paymentFormRef = useRef<{ getData: () => PaymentFormData | null }>(
    null
  );
  // Ref for AbortController để cancel requests khi unmount
  const abortControllerRef = useRef<AbortController | null>(null);

  // Local state
  const [isShippingValid, setIsShippingValid] = useState(false);
  const [isPaymentValid, setIsPaymentValid] = useState(false);

  // Redirect nếu cart trống (chỉ khi cart đã được initialized và thực sự trống)
  // cart !== null nghĩa là đã fetch xong (dù trống hay không)
  // cart === null nghĩa là chưa fetch, chờ data load
  useEffect(() => {
    if (cart !== null && cartProducts.length === 0) {
      navigate(routeConfigs.cart.path);
    }
  }, [cart, cartProducts.length]);

  // Cleanup: Cancel requests khi unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle validity changes
  const handleShippingValidityChange = (isValid: boolean) => {
    setIsShippingValid(isValid);
  };

  const handlePaymentValidityChange = (isValid: boolean) => {
    setIsPaymentValid(isValid);
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Guard checks
    if (!user || !cartId || !cart) return;
    if (isUpdateUserPending || isDeleteCartPending) return;

    // Get data from forms via refs
    const shippingData = shippingFormRef.current?.getData();
    const paymentData = paymentFormRef.current?.getData();

    if (!shippingData || !paymentData) {
      console.error("Form data is invalid or incomplete");
      return;
    }

    // Show global loader
    showGlobalLoader();

    // Tạo AbortController mới cho request này
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Step 1: Update user information with shipping address
      await usersService.updateUser(
        user.id,
        {
          firstName: shippingData.name.split(" ")[0],
          lastName: shippingData.name.split(" ").slice(1).join(" ") || "",
          email: shippingData.email,
          phone: shippingData.phone,
          address: {
            address: shippingData.street,
            postalCode: shippingData.postalCode,
          },
        },
        signal
      );

      // Step 2: Delete cart
      await cartsService.deleteCart(cartId, signal);

      // Step 3: Save order info before clearing cart
      const orderInfo = {
        orderNumber: `ORD-${Date.now()}`,
        total: cart.total,
        discountedTotal: cart.discountedTotal,
        totalProducts: cart.totalProducts,
        totalQuantity: cart.totalQuantity,
      };
      dispatch(orderConfirmationActions.setOrderInfo(orderInfo));

      // Step 4: Clear cart in Redux
      dispatch(cartActions.clearCart());

      // Step 5: Navigate to order confirmation page
      navigate(routeConfigs.orderConfirmation.path);
    } catch (err) {
      // Ignore AbortError (request đã bị cancel)
      if (err instanceof Error && err.name === "CanceledError") {
        console.log("Place order request was cancelled");
        return;
      }
      console.error("Place order error:", err);
      // Error handling already done in services
    } finally {
      // Hide global loader
      hideGlobalLoader();
      // Clear ref sau khi hoàn thành
      abortControllerRef.current = null;
    }
  };

  return (
    <div
      className={cx(
        "wrapper",
        "max-h-[calc(100vh-var(--header-height))] h-full p-6"
      )}
    >
      <div className={cx("container", "mx-auto")}>
        {/* Header */}
        <h1 className={cx("title", "text-[3.2rem] font-bold mb-8")}>
          {t("checkout.title")}
        </h1>

        <div className={cx("content", "grid grid-cols-1 lg:grid-cols-3 gap-8")}>
          {/* Forms Section */}
          <div className={cx("forms", "lg:col-span-2 space-y-6")}>
            {/* Shipping Form */}
            <div className="bg-(--white-color) p-6 rounded-lg shadow">
              <ShippingForm
                ref={shippingFormRef}
                onValidityChange={handleShippingValidityChange}
              />
            </div>

            {/* Payment Form */}
            <div className="bg-(--white-color) p-6 rounded-lg shadow">
              <PaymentForm
                ref={paymentFormRef}
                onValidityChange={handlePaymentValidityChange}
              />
            </div>

            {/* Place Order Button */}
            <div className="flex justify-end">
              <Button
                styleType="primary"
                className="min-w-[200px]"
                onClick={handlePlaceOrder}
                disabled={
                  !isShippingValid ||
                  !isPaymentValid ||
                  isUpdateUserPending ||
                  isDeleteCartPending
                }
              >
                {isUpdateUserPending || isDeleteCartPending ? (
                  <div className="flex items-center gap-2">
                    <InnerLoader
                      size="20px"
                      className="mr-2"
                      circleClassName="stroke-white stroke-[8px]"
                    />
                    {t("checkout.placingOrder")}
                  </div>
                ) : (
                  t("checkout.placeOrder")
                )}
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className={cx("summary", "lg:col-span-1")}>
            <div className="bg-(--white-color) p-6 rounded-lg shadow sticky top-[60px]">
              <h2 className="text-[2rem] font-bold mb-4">
                {t("checkout.orderSummary")}
              </h2>

              {/* Loading Skeleton */}
              {cart === null ? (
                <>
                  {/* Cart Items Skeleton */}
                  <div className="space-y-3 mb-6">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`skeleton-${index}`}
                        className="flex gap-3 pb-3 border-b border-(--senary-color)"
                      >
                        <div className="placeholder w-16 h-16 rounded" />
                        <div className="flex-1 space-y-2">
                          <div className="placeholder h-5 w-3/4" />
                          <div className="placeholder h-4 w-1/2" />
                          <div className="placeholder h-4 w-1/3" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total Skeleton */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="placeholder h-5 w-full mb-2" />
                    <div className="placeholder h-5 w-full mb-2" />
                    <div className="placeholder h-6 w-full" />
                  </div>
                </>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cartProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-3 pb-3 border-b border-(--senary-color) last:border-b-0"
                      >
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-[1.4rem] mb-1">
                            {product.title}
                          </h3>
                          <p className="text-[1.4rem] text-(--tertiary-color)">
                            {t("checkout.quantity")}: {product.quantity}
                          </p>
                          <p className="text-[1.4rem] font-bold">
                            ${product.discountedPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="space-y-2 border-t pt-4">
                    <div className="flex justify-between">
                      <span>{t("cart.subtotal")}:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("cart.discount")}:</span>
                      <span>
                        -${(cartTotal - cartDiscountedTotal).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-[1.8rem] font-bold">
                      <span>{t("cart.total")}:</span>
                      <span>${cartDiscountedTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
