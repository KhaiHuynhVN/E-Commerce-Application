import { memo } from "react";
import classNames from "classnames/bind";
import propTypes from "prop-types";

import { Icons } from "../../../../assets";
import { Button } from "../../../../commonComponents";
import { BUTTON_STYLE } from "../../../../utils";
import InnerLoader from "../../../InnerLoader";
import useNotify from "./useNotify";

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
}) => {
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
            "center-not-stack": (placement === "top-center" || placement === "bottom-center") && !stack,
         })}
         style={{
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
         }}
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
               circleClassName={cx("stroke-primary-color stroke-[4px]")}
               onTransitionEnd={handleLoadIconTransitionEnd}
            />
         )}

         <div
            style={{
               "--max-height": `${maxHeight}px`,
               overflowY: maxHeight !== "none" && "auto",
            }}
            className={cx("message")}
         >
            {message}
         </div>

         <Button
            styleType={BUTTON_STYLE.QUATERNARY}
            className={cx("close-button")}
            disabled={promise && promiseState === "pending"}
            onClick={handleClose}
         >
            <Icons.CloseIcon width="16" height="16" strokeWidth="2.5" className={cx("close-icon")} />
         </Button>

         {!immortal && (
            <div
               ref={progressBarRef}
               className={cx("progress-bar", {
                  "progress-bar--hidden": !showProgressBar || (promise && promiseState === "pending"),
                  "progress-bar--paused": isFrozen || (promise && promiseState === "pending"),
                  "progress-bar--running": !isFrozen && (!promise || promiseState !== "pending"),
                  "bg-primary-color": type === "info",
                  "bg-fortieth-color": type === "success",
                  "bg-thirty-ninth-color": type === "reject" || type === "error",
                  "bg-thirty-fifth-color": type === "warning",
               })}
               onAnimationEnd={handleProgressBarAnimationEnd}
            ></div>
         )}
      </div>
   );
};

Notify.propTypes = {
   className: propTypes.string,
   id: propTypes.number.isRequired,
   message: propTypes.node.isRequired,
   type: propTypes.oneOf(["info", "success", "error", "reject", "warning"]),
   duration: propTypes.number,
   pauseOnHover: propTypes.bool,
   showProgressBar: propTypes.bool,
   maxWidth: propTypes.number,
   width: propTypes.oneOfType([propTypes.string, propTypes.number]),
   maxHeight: propTypes.oneOfType([propTypes.string, propTypes.number]),
   position: propTypes.number,
   showDuration: propTypes.number,
   hideDuration: propTypes.number,
   transitionDuration: propTypes.number,
   transitionTimingFunction: propTypes.string,
   transitionDelay: propTypes.number,
   updateDimensions: propTypes.func.isRequired,
   placement: propTypes.oneOf(["top-left", "top-right", "bottom-left", "bottom-right", "top-center", "bottom-center"]),
   stack: propTypes.bool,
   spacingX: propTypes.number,
   zIndex: propTypes.number,
   opacity: propTypes.number,
   scale: propTypes.number,
   pointerEvents: propTypes.string,
   freezeOnHover: propTypes.bool,
   isFrozen: propTypes.bool,
   immortal: propTypes.bool,
   promise: propTypes.bool,
   promiseState: propTypes.string,
   resetProgress: propTypes.bool,
   customIcons: propTypes.shape({
      info: propTypes.node,
      success: propTypes.node,
      reject: propTypes.node,
      warning: propTypes.node,
      error: propTypes.node,
   }),
   onFreeze: propTypes.func,
   onUnfreeze: propTypes.func,
   onClose: propTypes.func.isRequired,
};

export default memo(Notify);
