import classNames from "classnames/bind";
import type { ReactElement } from "react";
import { memo } from "react";

import styles from "./InnerLoader.module.scss";
import type { InnerLoaderProps, InnerLoaderStyle } from "./InnerLoader.types";

const cx = classNames.bind(styles);

const InnerLoader = ({
  className,
  circleClassName,
  size = "30px",
  onTransitionEnd,
}: InnerLoaderProps): ReactElement => {
  return (
    <div
      style={{ "--size": size } as InnerLoaderStyle}
      className={cx(className, "wrapper", "relative")}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={cx("showbox")}>
        <div className={cx("loader")}>
          <svg className={cx("circular")} viewBox="25 25 50 50">
            <circle
              className={cx(circleClassName, "path")}
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="2"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default memo(InnerLoader);
