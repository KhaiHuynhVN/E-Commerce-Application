import { memo } from "react";
import type { CSSProperties } from "react";
import classNames from "classnames/bind";

import type { HorizontalScrollbarProps } from "../../VirtualTable.types";
import useHorizontalScrollbar from "./useHorizontalScrollbar";

import styles from "./HorizontalScrollbar.module.scss";

const cx = classNames.bind(styles);

/**
 * HorizontalScrollbar
 *
 * Component thanh cuộn ngang ảo cho VirtualTable.
 *
 * @component
 * @example
 * // Sử dụng cơ bản
 * <HorizontalScrollbar
 *    scrollLeft={0}
 *    scrollWidth={2000}
 *    clientWidth={1000}
 *    onScroll={(newScrollLeft) => { containerRef.current.scrollLeft = newScrollLeft }}
 *    trackHeight={8}
 *    thumbMinWidth={20}
 * />
 *
 * @example
 * // Với custom colors và hover colors
 * <HorizontalScrollbar
 *    scrollLeft={0}
 *    scrollWidth={2000}
 *    clientWidth={1000}
 *    onScroll={handleScroll}
 *    trackColor="#e0e7ff"
 *    trackHoverColor="#d0d7ef"
 *    thumbColor="#8b5cf6"
 *    thumbHoverColor="#7c3aed"
 *    thumbDraggingColor="#6d28d9"
 * />
 *
 * @param {Object} props - Các props của component
 * @param {number} props.scrollLeft - Vị trí scroll ngang hiện tại tính bằng pixels
 * @param {number} props.scrollWidth - Tổng chiều rộng có thể cuộn tính bằng pixels
 * @param {number} props.clientWidth - Chiều rộng viewport (visible area) tính bằng pixels
 * @param {Function} props.onScroll - Callback được gọi khi scroll thay đổi. Signature: (newScrollLeft: number) => void
 * @param {number} [props.trackHeight=8] - Chiều cao của track thanh cuộn tính bằng pixels
 * @param {number} [props.trackWidth] - Chiều rộng của track. Mặc định 100% nếu không set
 * @param {number} [props.thumbMinWidth=20] - Chiều rộng tối thiểu của thumb để đảm bảo usability
 * @param {string} [props.trackColor] - Màu của track thanh cuộn (CSS color)
 * @param {string} [props.trackHoverColor] - Màu của track khi hover (CSS color)
 * @param {string} [props.thumbColor] - Màu của thumb thanh cuộn (CSS color)
 * @param {string} [props.thumbHoverColor] - Màu của thumb khi hover (CSS color)
 * @param {string} [props.thumbDraggingColor] - Màu của thumb khi đang kéo (CSS color)
 * @param {string} [props.className] - CSS class name bổ sung
 * @param {Object} [props.style] - Inline styles bổ sung
 * @param {number} [props.opacity=1] - Opacity của scrollbar (auto-hide feature)
 *
 * @returns HorizontalScrollbar component hoặc null nếu không cần scrollbar
 */
const HorizontalScrollbar = ({
  scrollLeft,
  scrollWidth,
  clientWidth,
  onScroll,
  trackHeight = 8,
  trackWidth,
  thumbMinWidth = 20,
  trackColor,
  trackHoverColor,
  thumbColor,
  thumbHoverColor,
  thumbDraggingColor,
  className,
  style,
  opacity = 1,
}: HorizontalScrollbarProps): React.ReactElement | null => {
  const {
    trackRef,
    thumbRef,
    isDragging,
    handleThumbMouseDown,
    handleTrackClick,
    thumbWidth,
    thumbLeft,
    showScrollbar,
  } = useHorizontalScrollbar({
    scrollLeft,
    scrollWidth,
    clientWidth,
    onScroll,
    thumbMinWidth,
    trackWidth,
  });

  // Không render nếu content vừa trong view
  if (!showScrollbar) {
    return null;
  }

  return (
    <div
      className={cx("horizontal-scrollbar", className)}
      style={
        {
          "--track-height": `${trackHeight}px`,
          "--track-width": trackWidth ? `${trackWidth}px` : "100%",
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
              "--thumb-width": `${thumbWidth}px`,
              "--thumb-left": `${thumbLeft}px`,
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

export default memo(HorizontalScrollbar);
