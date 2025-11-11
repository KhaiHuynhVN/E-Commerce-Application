import { memo } from "react";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { Button } from "@/commonComponents";
import { InnerLoader } from "@/components";
import { Icons } from "@/assets";
import { pendingManagerSelectors } from "@/store/slices";
import type { RootState } from "@/store";
import type { ProductCardProps } from "./ProductCard.types";

import styles from "./ProductCard.module.scss";

const cx = classNames.bind(styles);

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { t } = useTranslation();

  // Check if this specific product is pending
  // Check cả addToCart (khi chưa có cart) và updateCart (khi đã có cart)
  const isAddToCartPendingProductId = useSelector((state: RootState) =>
    pendingManagerSelectors.hasAddToCartPendingProductId(state, product.id)
  );
  const isUpdateCartPendingProductId = useSelector((state: RootState) =>
    pendingManagerSelectors.hasUpdateCartPendingProductId(state, product.id)
  );
  const isPending = isAddToCartPendingProductId || isUpdateCartPendingProductId;

  const { title, thumbnail, price, rating, discountPercentage, stock } =
    product;

  // Calculate discounted price
  const discountedPrice = price - (price * discountPercentage) / 100;

  return (
    <div
      className={cx(
        "wrapper",
        "bg-white rounded-xl shadow-lg flex flex-col h-full"
      )}
    >
      {/* Product Image */}
      <div className={cx("imageContainer", "relative")}>
        <img
          src={thumbnail}
          alt={title}
          className={cx("image", "w-full h-48 object-cover")}
          loading="lazy"
        />
        {discountPercentage > 0 && (
          <div className={cx("discount", "absolute top-2 right-2")}>
            -{Math.round(discountPercentage)}%
          </div>
        )}
        {stock === 0 && (
          <div className={cx("outOfStock", "absolute inset-0")}>
            <span>{t("products.outOfStock")}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className={cx("info", "p-4 flex flex-col flex-1")}>
        <div className="flex flex-col gap-2">
          <h3
            className={cx("title", "text-lg font-semibold mb-2")}
            title={title}
          >
            {title}
          </h3>

          {/* Rating */}
          <div className={cx("rating", "flex items-center gap-1 mb-2")}>
            <Icons.StarIcon width="16" height="16" className={cx("starIcon")} />
            <span className={cx("ratingValue")}>{rating.toFixed(1)}</span>
          </div>

          {/* Stock Indicator */}
          {stock > 0 && (
            <div
              className={cx("stockBadge", {
                "stockBadge--low": stock <= 5,
                "stockBadge--medium": stock > 5 && stock <= 20,
                "stockBadge--high": stock > 20,
              })}
            >
              {stock <= 5 ? (
                <Icons.WarningIcon
                  width="14"
                  height="14"
                  className={cx("stockIcon")}
                />
              ) : stock <= 20 ? (
                <Icons.PackageIcon
                  width="14"
                  height="14"
                  className={cx("stockIcon")}
                />
              ) : (
                <Icons.CheckedIcon
                  width="14"
                  height="14"
                  className={cx("stockIcon")}
                />
              )}
              <span className={cx("stockText")}>
                {stock <= 5 ? `Only ${stock} left!` : `${stock} in stock`}
              </span>
            </div>
          )}

          {/* Price */}
          <div className={cx("priceContainer")}>
            {discountPercentage > 0 ? (
              <>
                <span className={cx("price", "text-2xl font-bold")}>
                  ${discountedPrice.toFixed(2)}
                </span>
                <span className={cx("originalPrice", "ml-2")}>
                  ${price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className={cx("price", "text-2xl font-bold")}>
                ${price.toFixed(2)}
              </span>
            )}
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          styleType="primary"
          onClick={() => onAddToCart(product)}
          disabled={stock === 0 || isPending}
          className="w-full mt-auto"
        >
          {stock === 0 ? (
            t("products.outOfStock")
          ) : isPending ? (
            <span className="flex items-center justify-center gap-2">
              <InnerLoader
                size="20px"
                circleClassName="stroke-white stroke-[8px]"
              />
              {t("products.addingToCart")}
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icons.CartIcon width="20" height="20" />
              {t("products.addToCart")}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default memo(ProductCard);
