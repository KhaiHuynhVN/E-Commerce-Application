import classNames from "classnames/bind";
import { memo } from "react";

import type {
  InlineLoaderProps,
  InlineLoaderStyle,
} from "./InlineLoader.types";

import styles from "./InlineLoader.module.scss";

const cx = classNames.bind(styles);

const InlineLoader = ({
  className,
  style,
  duration = "1.4s",
  containerSize = "120px",
  boxSize = "20px",
  boxBorderRadius = "15%",
}: InlineLoaderProps) => {
  const inlineStyle: InlineLoaderStyle = {
    "--duration": duration,
    "--container-size": containerSize,
    "--box-size": boxSize,
    "--box-border-radius": boxBorderRadius,
    ...style,
  };

  return (
    <div
      className={cx(
        className,
        "wrapper",
        "flex items-center justify-center py-8"
      )}
      style={inlineStyle}
    >
      <div className={cx("container")}>
        <div className={cx("item")}></div>
        <div className={cx("item")}></div>
        <div className={cx("item")}></div>
        <div className={cx("item")}></div>
        <div className={cx("item")}></div>
      </div>
    </div>
  );
};

export default memo(InlineLoader);
