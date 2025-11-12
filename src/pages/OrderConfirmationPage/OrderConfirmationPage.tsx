import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import classNames from "classnames/bind";

import {
  orderConfirmationSelectors,
  orderConfirmationActions,
} from "@/store/slices";
import { Button } from "@/commonComponents";
import { Icons } from "@/assets";
import routeConfigs from "@/routeConfigs";

import styles from "./OrderConfirmationPage.module.scss";

const cx = classNames.bind(styles);

const OrderConfirmationPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderInfo = useSelector(orderConfirmationSelectors.orderInfo);

  const discount = orderInfo ? orderInfo.total - orderInfo.discountedTotal : 0;

  // Redirect nếu không có orderInfo (user vào trực tiếp URL)
  useEffect(() => {
    if (!orderInfo) {
      navigate(routeConfigs.products.path);
    }
  }, [orderInfo, navigate]);

  // Cleanup: Clear order info khi rời trang
  useEffect(() => {
    return () => {
      dispatch(orderConfirmationActions.clearOrderInfo());
    };
  }, [dispatch]);

  const handleBackToShopping = () => {
    navigate(routeConfigs.products.path);
  };

  if (!orderInfo) {
    return null; // Hoặc loading state
  }

  return (
    <div
      className={cx(
        "wrapper",
        "min-h-[calc(100vh-var(--header-height))] flex items-center justify-center p-6"
      )}
    >
      <div
        className={cx(
          "container",
          "bg-(--white-color) rounded-lg shadow-lg p-8 max-w-2xl w-full"
        )}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="bg-(--primary-color) rounded-full p-6">
            <Icons.CheckedIcon className="text-(--white-color) w-16 h-16" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-[3rem] font-bold text-center text-(--primary-color) mb-4">
          {t("orderConfirmation.confirmationTitle")}
        </h1>

        {/* Thank You Message */}
        <p className="text-[1.6rem] text-center text-(--secondary-color) mb-8">
          {t("orderConfirmation.thankYou")}
        </p>

        {/* Order Number */}
        <div className="bg-(--tertiary-color) p-4 rounded-lg mb-6">
          <div className="flex justify-between items-center">
            <span className="text-[1.6rem] font-semibold text-(--secondary-color)">
              {t("orderConfirmation.orderNumber")}:
            </span>
            <span className="text-[1.8rem] font-bold text-(--primary-color)">
              {orderInfo.orderNumber}
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-(--border-color) pt-6">
          <h2 className="text-[2rem] font-bold mb-4 text-(--secondary-color)">
            {t("orderConfirmation.orderSummary")}
          </h2>

          <div className="space-y-3">
            {/* Items Count */}
            <div className="flex justify-between text-[1.6rem]">
              <span className="text-(--secondary-color)">
                {t("orderConfirmation.items")}:
              </span>
              <span className="font-semibold text-(--secondary-color)">
                {orderInfo.totalProducts} {t("orderConfirmation.products")} (
                {orderInfo.totalQuantity} {t("orderConfirmation.quantity")})
              </span>
            </div>

            {/* Subtotal */}
            <div className="flex justify-between text-[1.6rem]">
              <span className="text-(--secondary-color)">
                {t("orderConfirmation.subtotal")}:
              </span>
              <span className="font-semibold text-(--secondary-color)">
                ${orderInfo.total.toFixed(2)}
              </span>
            </div>

            {/* Discount */}
            {discount > 0 && (
              <div className="flex justify-between text-[1.6rem]">
                <span className="text-(--secondary-color)">
                  {t("orderConfirmation.discount")}:
                </span>
                <span className="font-semibold text-(--error-color)">
                  -${discount.toFixed(2)}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between text-[2rem] font-bold pt-3 border-t border-(--border-color)">
              <span className="text-(--secondary-color)">
                {t("orderConfirmation.total")}:
              </span>
              <span className="text-(--primary-color)">
                ${orderInfo.discountedTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Back to Shopping Button */}
        <div className="mt-8">
          <Button
            styleType="primary"
            className="w-full"
            onClick={handleBackToShopping}
          >
            {t("orderConfirmation.backToShopping")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
