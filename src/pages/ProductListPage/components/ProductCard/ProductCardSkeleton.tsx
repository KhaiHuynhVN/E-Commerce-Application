import { memo } from "react";
import classNames from "classnames/bind";

import styles from "./ProductCard.module.scss";

const cx = classNames.bind(styles);

const ProductCardSkeleton = () => {
  return (
    <div
      className={cx("wrapper", "bg-white rounded-xl shadow-lg flex flex-col")}
    >
      {/* Image Placeholder */}
      <div className={cx("imageContainer", "relative")}>
        <div className="placeholder w-full h-48" />
      </div>

      {/* Product Info Placeholder */}
      <div className={cx("info", "p-4 flex flex-col flex-1")}>
        <div className="flex flex-col gap-2">
          {/* Title Placeholder */}
          <div className="placeholder h-6 w-3/4 mb-2" />

          {/* Rating Placeholder */}
          <div className={cx("rating", "flex items-center gap-1 mb-2")}>
            <div className="placeholder h-4 w-16" />
          </div>

          {/* Price Placeholder */}
          <div className={cx("priceContainer", "flex items-center gap-2")}>
            <div className="placeholder h-8 w-20" />
            <div className="placeholder h-6 w-16" />
          </div>
        </div>

        {/* Button Placeholder */}
        <div className="placeholder h-10 w-full mt-auto rounded" />
      </div>
    </div>
  );
};

export default memo(ProductCardSkeleton);

