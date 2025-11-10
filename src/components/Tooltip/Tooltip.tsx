import { cloneElement, memo } from "react";
import { createPortal } from "react-dom";
import classNames from "classnames/bind";

import { ANIMATIONS, getArrowPosition } from "./tooltipHelpers";
import useTooltip from "./useTooltip";
import type { TooltipProps, AnimationType } from "./Tooltip.types";

import styles from "./Tooltip.module.scss";

const cx = classNames.bind(styles);

/**
 * Component Tooltip hiển thị nội dung tooltip khi hover hoặc điều khiển thông qua prop open
 * @component
 *
 * @param {Object} props - Props của component
 * @param {React.ReactNode} props.children - Element con sẽ được wrap bởi tooltip
 * @param {React.ReactNode} props.content - Nội dung hiển thị trong tooltip
 * @param {Object} [props.container] - Ref của container element. Nếu được cung cấp, tooltip sẽ được render bên trong container với position absolute
 * @param {('top'|'topLeft'|'topRight'|'bottom'|'bottomLeft'|'bottomRight'|'left'|'leftTop'|'leftBottom'|'right'|'rightTop'|'rightBottom')} [props.placement='top'] - Vị trí hiển thị của tooltip
 * @param {boolean} [props.open] - Điều khiển việc hiển thị tooltip (controlled mode)
 * @param {boolean} [props.arrow=false] - Hiển thị mũi tên chỉ hướng của tooltip
 * @param {string} [props.className] - Custom className cho tooltip
 * @param {boolean} [props.keepPlacement=false] - Giữ nguyên placement mới sau khi đã tự động thay đổi
 * @param {number} [props.spacing=4] - Khoảng cách giữa tooltip và element
 * @param {number} [props.margin=8] - Khoảng cách giữa tooltip và màn hình
 * @param {boolean} [props.allowAnimation=true] - Cho phép animation
 * @param {('show-fade_hide-fade'|'show-slide_hide-slide'|'show-scale_hide-scale')} [props.animation="show-fade_hide-fade"] - Animation của tooltip
 * @param {number} [props.showDelay=0] - Thời gian delay hiển thị tooltip
 * @param {number} [props.hideDelay=0] - Thời gian delay ẩn tooltip
 * @param {boolean} [props.interactive=false] - Cho phép hover vào tooltip
 * @param {string} [props.tooltipKey] - Key để định danh tooltip
 * @param {string[]} [props.relatedTooltipKeys=[]] - Array chứa các tooltipKey được phép tương tác (sẽ không đóng tooltip hiện tại khi click vào các tooltip này)
 * @param {boolean} [props.showOnMouseMove=false] - Cho phép hiển thị tooltip khi di chuyển chuột trong element gốc
 * @param {React.RefObject} [props.tooltipRef] - Ref của Tooltip component
 * @param {boolean} [props.closeOnClickOutside=false] - Cho phép đóng tooltip khi click outside trong controlled mode
 * @param {function} [props.setOpen] - Hàm để điều khiển việc hiển thị tooltip trong controlled mode
 * @param {function} [props.onClose] - Hàm để xử lý khi tooltip đóng
 * @param {any} [props.recalculateKey=null] - Key để trigger lại việc tính toán vị trí của tooltip
 * @param {boolean} [props.calculatePositionBasedOnWindow=false] - Cho phép tính toán vị trí dựa trên cửa sổ
 * @param {boolean} [props.disabled=false] - Cho phép disable tooltip
 * @param {{x: number, y: number}} [props.offsetPosition] - Vị trí offset của tooltip, x: offset theo chiều ngang, y: offset theo chiều dọc
 *
 * @example
 * // Uncontrolled mode (hover) với container
 * const containerRef = useRef(null);
 * <div ref={containerRef} className="relative">
 *   <Tooltip
 *     content="Basic tooltip"
 *     placement="topLeft"
 *     container={containerRef}
 *     arrow={true}
 *   >
 *     <button>Hover me</button>
 *   </Tooltip>
 * </div>
 *
 * @example
 * // Controlled mode không có container (render vào body)
 * <Tooltip
 *   content="Controlled tooltip"
 *   open={isOpen}
 *   placement="rightTop"
 * >
 *   <button>Click me</button>
 * </Tooltip>
 *
 * @example
 * // Với arrow và container
 * const containerRef = useRef(null);
 * <div ref={containerRef} className="relative">
 *   <Tooltip
 *     content="Tooltip with arrow"
 *     placement="bottomRight"
 *     container={containerRef}
 *     arrow={true}
 *   >
 *     <button>Hover me</button>
 *   </Tooltip>
 * </div>
 */
const Tooltip = ({
  children,
  content,
  placement = "top",
  open,
  container,
  arrow = false,
  className,
  arrowClassName,
  keepPlacement = false,
  spacing = 4,
  margin = 8,
  allowAnimation = true,
  animation = ANIMATIONS.FADE as AnimationType,
  showDelay = 0,
  hideDelay = 0,
  interactive = false,
  tooltipKey = null,
  relatedTooltipKeys = [],
  showOnMouseMove = false,
  tooltipRef,
  closeOnClickOutside = false,
  setOpen,
  onClose,
  recalculateKey = null,
  calculatePositionBasedOnWindow = false,
  disabled = false,
  offsetPosition = { x: 0, y: 0 },
}: TooltipProps): React.ReactElement => {
  const {
    isVisible,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    childRef,
    innerTooltipRef,
    tooltipStyle,
    currentPlacement,
    shouldRender,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave,
    handleAnimationEnd,
    isPositionCalculated,
  } = useTooltip({
    open,
    setOpen,
    onClose,
    placement,
    allowAnimation,
    showDelay,
    hideDelay,
    interactive,
    tooltipKey,
    relatedTooltipKeys,
    showOnMouseMove,
    tooltipRef,
    closeOnClickOutside,
    recalculateKey,
    calculatePositionBasedOnWindow,
    disabled,
    offsetPosition,
    keepPlacement,
    spacing,
    margin,
    container,
    arrow,
  });

  const childElement = cloneElement(
    children as React.ReactElement<Record<string, unknown>>,
    {
      ref: childRef,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseMove: handleMouseMove,
    }
  );

  const tooltipContent =
    shouldRender &&
    createPortal(
      <div
        ref={innerTooltipRef}
        className={cx("wrapper")}
        style={{
          position: tooltipStyle.position.position,
          left: tooltipStyle.position.left,
          top: tooltipStyle.position.top,
          visibility: isPositionCalculated ? "visible" : "hidden",
        }}
        onMouseEnter={handleTooltipMouseEnter}
        onMouseLeave={handleTooltipMouseLeave}
        data-tooltip-key={tooltipKey}
      >
        <div
          className={cx("inner", {
            [animation]: allowAnimation && animation,
            hide: !isVisible && allowAnimation,
          })}
          data-placement={currentPlacement}
          onAnimationEnd={handleAnimationEnd}
          data-tooltip-key={tooltipKey}
        >
          <div
            className={cx("content", className)}
            data-tooltip-key={tooltipKey}
          >
            {content}
          </div>
          {arrow && (
            <div
              className={cx("arrow", arrowClassName)}
              style={{
                ...getArrowPosition(
                  currentPlacement,
                  innerTooltipRef.current?.getBoundingClientRect(),
                  childRef.current?.getBoundingClientRect()
                ),
              }}
              data-tooltip-key={tooltipKey}
            />
          )}
        </div>
      </div>,
      (container && "current" in container ? container.current : container) ||
        document.body
    );

  return (
    <>
      {childElement}
      {tooltipContent}
    </>
  );
};

export default memo(Tooltip);
