import { memo } from "react";
import type { CSSProperties } from "react";
import classNames from "classnames/bind";

import type { VirtualScrollbarProps } from "../../VirtualTable.types";
import useVirtualScrollbar from "./useVirtualScrollbar";

import styles from "./VirtualScrollbar.module.scss";

const cx = classNames.bind(styles);

/**
 * VirtualScrollbar
 *
 * Component thanh cuộn dọc ảo cho VirtualTable.
 *
 * @component
 * @example
 * // Sử dụng cơ bản
 * <VirtualScrollbar
 *    height={500}
 *    totalHeight={5000}
 *    scrollTop={scrollTop}
 *    onScroll={handleScroll}
 *    trackWidth={8}
 *    thumbMinHeight={20}
 * />
 *
 * @example
 * // Với custom colors và hover colors
 * <VirtualScrollbar
 *    height={500}
 *    totalHeight={5000}
 *    scrollTop={scrollTop}
 *    onScroll={handleScroll}
 *    trackColor="#e0e7ff"
 *    trackHoverColor="#d0d7ef"
 *    thumbColor="#8b5cf6"
 *    thumbHoverColor="#7c3aed"
 *    thumbDraggingColor="#6d28d9"
 * />
 *
 * @param {Object} props - Các props của component
 * @param {number} props.height - Chiều cao của viewport (vùng hiển thị) tính bằng pixels - dùng cho scroll ratio calculations
 * @param {number} props.totalHeight - Tổng chiều cao của content có thể cuộn tính bằng pixels
 * @param {number} props.scrollTop - Vị trí scroll dọc hiện tại tính bằng pixels
 * @param {Function} props.onScroll - Callback được gọi khi scroll. Signature: (newScrollTop: number) => void
 * @param {string} [props.className] - CSS class name bổ sung
 * @param {Object} [props.style] - Inline styles bổ sung
 * @param {number} [props.trackWidth=8] - Chiều rộng của track thanh cuộn tính bằng pixels
 * @param {number} [props.trackHeight] - Chiều cao thực tế của track (khi có horizontal scrollbar). Nếu không set, dùng height
 * @param {number} [props.thumbMinHeight=20] - Chiều cao tối thiểu của thumb để đảm bảo usability
 * @param {string} [props.trackColor] - Màu của track thanh cuộn (CSS color)
 * @param {string} [props.trackHoverColor] - Màu của track khi hover (CSS color)
 * @param {string} [props.thumbColor] - Màu của thumb thanh cuộn (CSS color)
 * @param {string} [props.thumbHoverColor] - Màu của thumb khi hover (CSS color)
 * @param {string} [props.thumbDraggingColor] - Màu của thumb khi đang kéo (CSS color)
 * @param {number} [props.opacity=1] - Opacity của scrollbar (auto-hide feature)
 *
 * @returns VirtualScrollbar component hoặc null nếu không cần scrollbar
 */
const VirtualScrollbar = ({
  height,
  totalHeight,
  scrollTop,
  onScroll,
  className,
  style,
  trackWidth = 8,
  trackHeight,
  thumbMinHeight = 20,
  trackColor,
  trackHoverColor,
  thumbColor,
  thumbHoverColor,
  thumbDraggingColor,
  opacity = 1,
}: VirtualScrollbarProps): React.ReactElement | null => {
  const {
    trackRef,
    handleTrackClick,
    thumbRef,
    isDragging,
    thumbHeight,
    thumbTop,
    handleThumbMouseDown,
    showScrollbar,
  } = useVirtualScrollbar({
    height,
    totalHeight,
    thumbMinHeight,
    scrollTop,
    onScroll,
    trackHeight,
  });

  // Không render nếu content vừa trong view
  if (!showScrollbar) {
    return null;
  }

  return (
    <div
      className={cx("virtual-scrollbar", className)}
      style={
        {
          "--track-width": `${trackWidth}px`,
          "--height": `${height}px`,
          "--scrollbar-opacity": opacity,
          ...style,
        } as CSSProperties
      }
    >
      <div
        ref={trackRef}
        className={cx("scrollbar-track")}
        style={
          {
            "--track-height": `${height}px`,
            "--track-color": trackColor,
            "--track-hover-color": trackHoverColor,
          } as CSSProperties
        }
        onClick={handleTrackClick}
      >
        <div
          ref={thumbRef}
          className={cx("scrollbar-thumb", {
            "is-dragging": isDragging,
          })}
          style={
            {
              "--thumb-height": `${thumbHeight}px`,
              "--thumb-top": `${thumbTop}px`,
              "--thumb-color": thumbColor,
              "--thumb-hover-color": thumbHoverColor,
              "--thumb-dragging-color": thumbDraggingColor,
            } as CSSProperties
          }
          onMouseDown={handleThumbMouseDown}
        />
      </div>
    </div>
  );
};

VirtualScrollbar.displayName = "VirtualScrollbar";

export default memo(VirtualScrollbar);
