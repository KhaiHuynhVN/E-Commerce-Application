import { memo } from "react";
import classNames from "classnames/bind";

import styles from "./CartItemSkeleton.module.scss";

const cx = classNames.bind(styles);

const CartItemSkeleton = () => {
  return (
    <div
      className={cx(
        "wrapper",
        "flex gap-4 p-4 mb-4 bg-white rounded-lg shadow"
      )}
    >
      {/* Image Placeholder */}
      <div className="placeholder w-24 h-24 rounded" />

      {/* Product Info Placeholder */}
      <div className={cx("productInfo", "flex-1")}>
        {/* Title */}
        <div className="placeholder h-6 w-3/4 mb-2" />

        {/* Price */}
        <div className="placeholder h-5 w-20 mb-4" />

        {/* Quantity Controls */}
        <div className={cx("quantityControls", "flex items-center gap-2")}>
          <div className="placeholder w-8 h-8 rounded" />
          <div className="placeholder w-8 h-6" />
          <div className="placeholder w-8 h-8 rounded" />
        </div>
      </div>

      {/* Product Actions Placeholder */}
      <div
        className={cx(
          "productActions",
          "flex flex-col items-end justify-between"
        )}
      >
        <div className="placeholder h-6 w-20 mb-2" />
        <div className="placeholder h-8 w-16 rounded" />
      </div>
    </div>
  );
};

export default memo(CartItemSkeleton);

