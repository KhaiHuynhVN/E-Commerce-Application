import { memo } from "react";
import type { CSSProperties, ReactElement } from "react";
import classNames from "classnames/bind";

import { Icons } from "../../../../assets";
import { Button } from "../../../../commonComponents";
import InnerLoader from "../../../InnerLoader";
import useNotify from "./useNotify";
import type { NotifyProps } from "../../NotifyContainer.types";

import styles from "./Notify.module.scss";

const cx = classNames.bind(styles);

const Notify = ({
  className,
  id,
  message,
  type,
  duration,
  pauseOnHover,
  showProgressBar,
  maxWidth,
  width,
  maxHeight,
  position,
  showDuration,
  hideDuration,
  transitionDuration,
  transitionTimingFunction,
  transitionDelay,
  updateDimensions,
  placement,
  stack,
  spacingX,
  zIndex,
  opacity,
  scale,
  pointerEvents,
  freezeOnHover,
  isFrozen,
  immortal,
  promise,
  promiseState,
  resetProgress,
  customIcons,
  onFreeze = () => {},
  onUnfreeze = () => {},
  onClose = () => {},
}: NotifyProps): ReactElement | null => {
  const {
    isVisible,
    rootRef,
    progressBarRef,
    handleAnimationStart,
    handleAnimationEnd,
    handleMouseEnter,
    handleMouseLeave,
    handleLoadIconTransitionEnd,
    handleProgressBarAnimationEnd,
    handleClose,
    renderIcon,
    isVisibleLoadIcon,
  } = useNotify({
    cx,
    id,
    duration,
    resetProgress,
    promise,
    updateDimensions,
    promiseState,
    onClose,
    onFreeze,
    onUnfreeze,
    customIcons,
    type,
    stack,
    placement,
    freezeOnHover,
  });

  if (!isVisible) return null;

  return (
    <div
      ref={rootRef}
      className={cx("wrapper", className, placement, {
        "pause-on-hover": pauseOnHover,
        "center-not-stack":
          (placement === "top-center" || placement === "bottom-center") &&
          !stack,
      })}
      style={
        {
          "--timer-progress-bar": `${duration}ms`,
          "--max-width": `${maxWidth}px`,
          "--width": width ? `${width}px` : "max-content",
          "--show-duration": `${showDuration}s`,
          "--hide-duration": `${hideDuration}s`,
          "--transition-duration": `${transitionDuration}s`,
          "--transition-timing-function": `${transitionTimingFunction}`,
          "--transition-delay": `${transitionDelay}s`,
          "--position": `${position}px`,
          "--spacing-x": `${spacingX}px`,
          "--z-index": zIndex,
          "--opacity": opacity,
          "--scale": scale,
          "--pointer-events": pointerEvents,
        } as CSSProperties
      }
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderIcon()}

      {isVisibleLoadIcon && promiseState === "pending" && (
        <InnerLoader
          className={cx("load-icon", {
            "hide-load-icon": promiseState !== "pending",
          })}
          circleClassName={cx("stroke-(--notify-info-color) stroke-[5px]")}
          onTransitionEnd={handleLoadIconTransitionEnd}
        />
      )}

      <div
        style={
          {
            "--max-height": `${maxHeight}px`,
            overflowY: maxHeight !== "none" ? "auto" : undefined,
          } as CSSProperties
        }
        className={cx("message")}
      >
        {message}
      </div>

      <Button
        styleType={"secondary"}
        className={cx("close-button")}
        disabled={promise && promiseState === "pending"}
        onClick={handleClose}
      >
        <Icons.CloseIcon
          width="16"
          height="16"
          strokeWidth="2.5"
          className={cx("close-icon")}
        />
      </Button>

      {!immortal && (
        <div
          ref={progressBarRef}
          className={cx("progress-bar", {
            "progress-bar--hidden":
              !showProgressBar || (promise && promiseState === "pending"),
            "progress-bar--paused":
              isFrozen || (promise && promiseState === "pending"),
            "progress-bar--running":
              !isFrozen && (!promise || promiseState !== "pending"),
          })}
          style={{
            backgroundColor:
              type === "info"
                ? "var(--notify-info-color)"
                : type === "success"
                ? "var(--notify-success-color)"
                : type === "reject" || type === "error"
                ? "var(--notify-error-color)"
                : type === "warning"
                ? "var(--notify-warning-color)"
                : "var(--notify-info-color)",
          }}
          onAnimationEnd={(e) => {
            e.stopPropagation();
            handleProgressBarAnimationEnd();
          }}
        ></div>
      )}
    </div>
  );
};

export default memo(Notify);
