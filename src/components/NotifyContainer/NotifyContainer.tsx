import { memo } from "react";
import type { ReactElement } from "react";
import classNames from "classnames/bind";
import { createPortal } from "react-dom";

import { Notify } from "./components";
import useNotifyContainer from "./useNotifyContainer";
import type {
  NotifyContainerProps,
  Notification,
  NotifyPlacement,
  PromiseState,
} from "./NotifyContainer.types";

import styles from "./NotifyContainer.module.scss";

const cx = classNames.bind(styles);

const NotifyContainer = ({ className }: NotifyContainerProps): ReactElement => {
  const {
    notifications,
    hoveredPlacements,
    hasStackedToasts,
    calculateHoverAreaDimensions,
    calculateTop,
    calculateStyle,
    updateDimensions,
    handleMouseEnter,
    handleMouseLeave,
    handleClose,
    handleFreeze,
    handleUnfreeze,
    hoverTransitions,
    frozenPlacements,
    promiseStates,
    resetProgressId,
  } = useNotifyContainer();

  return createPortal(
    <div className={cx(className, "wrapper")}>
      {(
        Object.entries(notifications) as [NotifyPlacement, Notification[]][]
      ).map(([placement, placementNotifications]) => {
        const hoverAreaDimensions = calculateHoverAreaDimensions(
          placement,
          placementNotifications,
          hoveredPlacements[placement]
        );
        const hasStacked = hasStackedToasts(placementNotifications);

        return (
          <div key={placement} className={cx(placement)}>
            {hoverAreaDimensions && hasStacked ? (
              <div
                className={cx("hover-area", placement)}
                style={{
                  position: "fixed",
                  top: placement.includes("top")
                    ? hoverAreaDimensions.top
                    : "auto",
                  bottom: placement.includes("bottom")
                    ? hoverAreaDimensions.top
                    : "auto",
                  left:
                    placement.includes("left") ||
                    placement === "top-center" ||
                    placement === "bottom-center"
                      ? placement === "top-center" ||
                        placement === "bottom-center"
                        ? "50%"
                        : hoverAreaDimensions.spacingX
                      : "auto",
                  right: placement.includes("right")
                    ? hoverAreaDimensions.spacingX
                    : "auto",
                  width: hoverAreaDimensions.width
                    ? `${hoverAreaDimensions.width}px`
                    : "auto",
                  height: hoverAreaDimensions.height
                    ? `${hoverAreaDimensions.height}px`
                    : "auto",
                  transform:
                    placement === "top-center" || placement === "bottom-center"
                      ? `translateX(-50%)`
                      : "none",
                  transition: `all ${hoverTransitions[placement]}ms`,
                  pointerEvents: "auto",
                }}
                onMouseEnter={() =>
                  handleMouseEnter(placement, placementNotifications)
                }
                onMouseLeave={() =>
                  handleMouseLeave(placement, placementNotifications)
                }
              >
                {placementNotifications.map((notification, index) => {
                  const {
                    id,
                    message,
                    type,
                    duration,
                    pauseOnHover,
                    showProgressBar,
                    newItemOnTop,
                    maxWidth,
                    width,
                    maxHeight,
                    showDuration,
                    hideDuration,
                    transitionDuration,
                    transitionTimingFunction,
                    transitionDelay,
                    itemSpacing,
                    spacingY,
                    stack,
                    freezeOnHover,
                    immortal,
                    promise,
                    customIcons,
                  } = notification;

                  const position = calculateTop(
                    newItemOnTop
                      ? index
                      : placementNotifications.length - index - 1,
                    newItemOnTop,
                    placement,
                    itemSpacing,
                    spacingY,
                    true
                  );

                  const { opacity, scale, pointerEvents } = calculateStyle(
                    index,
                    placement,
                    stack,
                    newItemOnTop
                  );

                  return (
                    <Notify
                      className={cx("notify-item")}
                      key={id}
                      id={id}
                      message={message}
                      type={type}
                      duration={duration}
                      pauseOnHover={pauseOnHover}
                      showProgressBar={showProgressBar}
                      maxWidth={maxWidth}
                      width={typeof width === "number" ? width : null}
                      maxHeight={maxHeight}
                      position={position}
                      showDuration={showDuration}
                      hideDuration={hideDuration}
                      transitionDuration={transitionDuration}
                      transitionTimingFunction={transitionTimingFunction}
                      transitionDelay={
                        transitionDelay *
                        (newItemOnTop
                          ? placementNotifications.length - index - 1
                          : index)
                      }
                      updateDimensions={updateDimensions}
                      placement={placement}
                      spacingX={0}
                      stack={stack}
                      zIndex={
                        stack && newItemOnTop
                          ? placementNotifications.length - index - 1
                          : index
                      }
                      opacity={opacity}
                      scale={scale}
                      pointerEvents={pointerEvents}
                      freezeOnHover={freezeOnHover}
                      isFrozen={frozenPlacements[placement]}
                      immortal={immortal}
                      promise={promise}
                      promiseState={
                        (
                          promiseStates[placement] as Record<
                            number,
                            PromiseState
                          >
                        )?.[id]
                      }
                      resetProgress={id === resetProgressId}
                      customIcons={customIcons}
                      onClose={handleClose}
                    />
                  );
                })}
              </div>
            ) : (
              placementNotifications.map((notification, index) => {
                const {
                  id,
                  message,
                  type,
                  duration,
                  pauseOnHover,
                  showProgressBar,
                  newItemOnTop,
                  maxWidth,
                  width,
                  maxHeight,
                  showDuration,
                  hideDuration,
                  transitionDuration,
                  transitionTimingFunction,
                  transitionDelay,
                  itemSpacing,
                  spacingX,
                  spacingY,
                  stack,
                  freezeOnHover,
                  immortal,
                  promise,
                  customIcons,
                } = notification;

                const position = calculateTop(
                  newItemOnTop
                    ? index
                    : placementNotifications.length - index - 1,
                  newItemOnTop,
                  placement,
                  itemSpacing,
                  spacingY,
                  false
                );

                const { opacity, scale, pointerEvents } = calculateStyle(
                  index,
                  placement,
                  stack,
                  newItemOnTop
                );

                return (
                  <Notify
                    key={id}
                    id={id}
                    message={message}
                    type={type}
                    duration={duration}
                    pauseOnHover={pauseOnHover}
                    showProgressBar={showProgressBar}
                    maxWidth={maxWidth}
                    width={width}
                    maxHeight={maxHeight}
                    position={position}
                    showDuration={showDuration}
                    hideDuration={hideDuration}
                    transitionDuration={transitionDuration}
                    transitionTimingFunction={transitionTimingFunction}
                    transitionDelay={
                      transitionDelay *
                      (newItemOnTop
                        ? placementNotifications.length - index - 1
                        : index)
                    }
                    updateDimensions={updateDimensions}
                    placement={placement}
                    stack={stack}
                    spacingX={spacingX}
                    zIndex={
                      stack && newItemOnTop
                        ? placementNotifications.length - index - 1
                        : index
                    }
                    opacity={opacity}
                    scale={scale}
                    pointerEvents={pointerEvents}
                    freezeOnHover={freezeOnHover}
                    isFrozen={frozenPlacements[placement]}
                    immortal={immortal}
                    promise={promise}
                    promiseState={
                      (
                        promiseStates[placement] as Record<number, PromiseState>
                      )?.[id]
                    }
                    resetProgress={id === resetProgressId}
                    customIcons={customIcons}
                    onFreeze={handleFreeze}
                    onUnfreeze={handleUnfreeze}
                    onClose={handleClose}
                  />
                );
              })
            )}
          </div>
        );
      })}
    </div>,
    document.body
  );
};

export default memo(NotifyContainer);
