import { memo } from "react";
import type { CSSProperties } from "react";
import classNames from "classnames/bind";

import type { ScrollbarCornerProps } from "../../VirtualTable.types";

import styles from "./ScrollbarCorner.module.scss";

const cx = classNames.bind(styles);

/**
 * ScrollbarCorner
 *
 * Component cho góc giao nhau giữa vertical và horizontal scrollbars.
 * Prevents overlap và tạo visual consistency.
 *
 * @component
 * @example
 * <ScrollbarCorner
 *    width={10}
 *    height={10}
 *    backgroundColor="#e0e7ff"
 *    bottom={52}
 * />
 */
const ScrollbarCorner = ({
  width = 10,
  height = 10,
  backgroundColor = "#f1f3f4",
  bottom = 0,
  opacity = 1,
  className,
  style,
}: ScrollbarCornerProps): React.ReactElement => {
  return (
    <div
      className={cx("scrollbar-corner", className)}
      style={
        {
          "--corner-width": `${width}px`,
          "--corner-height": `${height}px`,
          "--corner-bg": backgroundColor,
          "--corner-opacity": opacity,
          bottom: bottom,
          ...style,
        } as CSSProperties
      }
    />
  );
};

export default memo(ScrollbarCorner);
