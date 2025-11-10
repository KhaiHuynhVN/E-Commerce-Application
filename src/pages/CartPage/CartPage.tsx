import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { authSelectors, cartActions, cartSelectors } from "@/store/slices";
import { cartsService } from "@/services";
import { InnerLoader } from "@/components";

import styles from "./CartPage.module.scss";

const cx = classNames.bind(styles);

const CartPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(authSelectors.user);
  const cart = useSelector(cartSelectors.cart);
  const cartProducts = useSelector(cartSelectors.cartProducts);
  const cartTotal = useSelector(cartSelectors.cartTotal);
  const cartDiscountedTotal = useSelector(cartSelectors.cartDiscountedTotal);
  const isLoading = useSelector(cartSelectors.isLoading);
  const error = useSelector(cartSelectors.error);

  // Fetch user's cart khi component mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        dispatch(cartActions.setLoading(true));
        const response = await cartsService.getUserCarts(user.id);

        // Lấy cart đầu tiên của user (active cart)
        if (response.carts.length > 0) {
          dispatch(cartActions.setCart(response.carts[0]));
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : t("serverErrors.unknownError");
        dispatch(cartActions.setError(errorMessage));
      } finally {
        dispatch(cartActions.setLoading(false));
      }
    };

    fetchCart();
  }, [user, dispatch, t]);

  // Handle quantity change
  const handleQuantityChange = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1 || !cart) return;

    try {
      // Optimistic update
      dispatch(
        cartActions.updateProductQuantity({
          productId,
          quantity: newQuantity,
        })
      );

      // Update trên server
      await cartsService.updateCart(cart.id, {
        merge: false,
        products: cart.products.map((p) => ({
          id: p.id,
          quantity: p.id === productId ? newQuantity : p.quantity,
        })),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("serverErrors.unknownError");
      dispatch(cartActions.setError(errorMessage));

      // Rollback nếu API fail (có thể fetch lại cart)
    }
  };

  // Handle remove product
  const handleRemoveProduct = async (productId: number) => {
    if (!cart) return;

    try {
      // Optimistic update
      dispatch(cartActions.removeProduct(productId));

      // Update trên server
      await cartsService.updateCart(cart.id, {
        merge: false,
        products: cart.products
          .filter((p) => p.id !== productId)
          .map((p) => ({
            id: p.id,
            quantity: p.quantity,
          })),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("serverErrors.unknownError");
      dispatch(cartActions.setError(errorMessage));
    }
  };

  return (
    <div className={cx("wrapper", "min-h-screen p-6")}>
      <div className={cx("container", "max-w-7xl mx-auto")}>
        {/* Header */}
        <h1 className={cx("title", "text-5xl font-bold mb-8")}>
          {t("cart.title")}
        </h1>

        {/* Loading State */}
        {isLoading && (
          <div className={cx("loading", "flex justify-center items-center py-8")}>
            <InnerLoader size="40px" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={cx("error", "text-center mb-6 p-4 rounded-lg")}>
            {error}
          </div>
        )}

        {/* Empty Cart */}
        {!isLoading && !error && cartProducts.length === 0 && (
          <div className={cx("empty", "text-center py-16")}>
            <p className={cx("emptyText", "text-2xl mb-4")}>
              {t("cart.emptyCart")}
            </p>
            <p className={cx("emptyHint")}>{t("cart.emptyCartHint")}</p>
          </div>
        )}

        {/* Cart Content */}
        {!isLoading && !error && cartProducts.length > 0 && (
          <div className={cx("content", "grid grid-cols-1 lg:grid-cols-3 gap-8")}>
            {/* Products List */}
            <div className={cx("productsList", "lg:col-span-2")}>
              {cartProducts.map((product) => (
                <div
                  key={product.id}
                  className={cx("productItem", "flex gap-4 p-4 mb-4 bg-white rounded-lg shadow")}
                >
                  {/* Product Image */}
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className={cx("productImage", "w-24 h-24 object-cover rounded")}
                  />

                  {/* Product Info */}
                  <div className={cx("productInfo", "flex-1")}>
                    <h3 className={cx("productTitle", "text-lg font-semibold mb-2")}>
                      {product.title}
                    </h3>
                    <p className={cx("productPrice", "text-gray-600")}>
                      ${product.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className={cx("quantityControls", "flex items-center gap-2 mt-4")}>
                      <button
                        onClick={() => handleQuantityChange(product.id, product.quantity - 1)}
                        className={cx("quantityButton")}
                        disabled={product.quantity <= 1}
                      >
                        −
                      </button>
                      <span className={cx("quantity")}>{product.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                        className={cx("quantityButton")}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Product Total & Remove */}
                  <div className={cx("productActions", "flex flex-col items-end justify-between")}>
                    <p className={cx("productTotal", "text-lg font-bold")}>
                      ${product.discountedTotal.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleRemoveProduct(product.id)}
                      className={cx("removeButton")}
                    >
                      {t("cart.remove")}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className={cx("summary", "lg:col-span-1")}>
              <div className={cx("summaryCard", "bg-white rounded-lg shadow p-6 sticky top-24")}>
                <h2 className={cx("summaryTitle", "text-2xl font-bold mb-4")}>
                  {t("cart.summary")}
                </h2>

                <div className={cx("summaryRow", "flex justify-between mb-2")}>
                  <span>{t("cart.subtotal")}:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                <div className={cx("summaryRow", "flex justify-between mb-2 text-green-600")}>
                  <span>{t("cart.discount")}:</span>
                  <span>-${(cartTotal - cartDiscountedTotal).toFixed(2)}</span>
                </div>

                <hr className="my-4" />

                <div className={cx("summaryRow", "flex justify-between text-xl font-bold mb-6")}>
                  <span>{t("cart.total")}:</span>
                  <span>${cartDiscountedTotal.toFixed(2)}</span>
                </div>

                <button className={cx("checkoutButton", "w-full py-3 rounded-lg")}>
                  {t("cart.proceedToCheckout")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;

