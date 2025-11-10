import {
  cloneElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type React from "react";

import { Icons } from "../../../../assets";
import type {
  UseNotifyProps,
  UseNotifyReturn,
} from "../../NotifyContainer.types";

const useNotify = ({
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
}: UseNotifyProps): UseNotifyReturn => {
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleLoadIcon, setIsVisibleLoadIcon] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (rootRef.current) {
      const { offsetWidth, offsetHeight } = rootRef.current;

      updateDimensions(id, offsetWidth, offsetHeight);
    }
  }, [id, updateDimensions, promiseState]);

  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.style.setProperty(
        "--timer-progress-bar",
        `${duration}ms`
      );
    }
    if (resetProgress && progressBarRef.current && !promise) {
      // Chỉ reset animation nếu không phải là promise
      progressBarRef.current.style.animation = "none";
      void progressBarRef.current.offsetHeight; // Trigger reflow
      progressBarRef.current.style.animation = "";
    }
  }, [duration, resetProgress, promise]);

  const handleAnimationStart = (
    e: React.AnimationEvent<HTMLDivElement>
  ): void => {
    e.currentTarget.classList.add(cx("disable-pointer-events"));
  };

  const handleAnimationEnd = (
    e: React.AnimationEvent<HTMLDivElement>
  ): void => {
    e.currentTarget.classList.remove(cx("disable-pointer-events"));

    if (!e.currentTarget.classList.contains(cx("hide")) && stack) {
      e.currentTarget.classList.add("stacked");
    }

    if (e.currentTarget.classList.contains(cx("hide"))) {
      setIsVisible(false);
      onClose(id);
    }
  };

  const handleClose = (): void => {
    if (!rootRef.current) return;

    rootRef.current.classList.add(cx("disable-pointer-events"));
    rootRef.current.style.animationPlayState = "running";

    if (promise && promiseState === "pending") {
      // Không cho phép đóng khi promise đang pending
      return;
    }
    rootRef.current.classList.add(cx("hide"));
    rootRef.current.classList.remove("stacked");
  };

  const handleProgressBarAnimationEnd = (): void => {
    handleClose();
  };

  const handleMouseEnter = (): void => {
    if (freezeOnHover && onFreeze) {
      onFreeze(placement, id);
    }
  };

  const handleMouseLeave = (): void => {
    if (freezeOnHover && onUnfreeze) {
      onUnfreeze(placement, id);
    }
  };

  const handleLoadIconTransitionEnd = (
    e: React.TransitionEvent<HTMLDivElement>
  ): void => {
    if (e.currentTarget.classList.contains(cx("hide-load-icon"))) {
      setIsVisibleLoadIcon(false);
    }
  };

  const renderIcon = (): React.ReactNode => {
    const CustomIcon = customIcons && customIcons[type];

    if (CustomIcon && typeof CustomIcon === "object" && "props" in CustomIcon) {
      const iconElement = CustomIcon as React.ReactElement<{
        className?: string;
        width?: string;
        height?: string;
        fill?: string;
      }>;

      // Lấy màu dựa trên type
      const getColorVar = () => {
        switch (type) {
          case "info":
            return "var(--notify-info-color)";
          case "success":
            return "var(--notify-success-color)";
          case "error":
            return "var(--notify-error-color)";
          case "reject":
            return "var(--notify-reject-color)";
          case "warning":
            return "var(--notify-warning-color)";
          default:
            return "var(--notify-info-color)";
        }
      };

      return cloneElement(iconElement, {
        className: cx(iconElement.props.className, "icon", {
          "show-icon": promise && promiseState !== "pending",
          "not-promise": !promise,
        }),
        fill: getColorVar(),
        width: iconElement.props.width || "30",
        height: iconElement.props.height || "30",
      });
    }

    switch (type) {
      case "info":
        return (
          <Icons.NotifyIcon
            className={cx("icon", {
              "show-icon": promise && promiseState !== "pending",
              "not-promise": !promise,
            })}
            fill="var(--notify-info-color)"
            width="30"
            height="30"
          />
        );
      case "success":
        return (
          <Icons.CheckedIcon
            className={cx("icon", {
              "show-icon": promise && promiseState === "fulfilled",
              "not-promise": !promise,
            })}
            fill="var(--notify-success-color)"
            width="30"
            height="30"
          />
        );
      case "reject":
        return (
          <Icons.RejectIcon
            className={cx("icon", {
              "show-icon": promise && promiseState === "rejected",
              "not-promise": !promise,
            })}
            fill="var(--notify-reject-color)"
            width="30"
            height="30"
          />
        );
      case "warning":
        return (
          <Icons.WarningIcon
            className={cx("icon", {
              "show-icon": promise && promiseState !== "pending",
              "not-promise": !promise,
            })}
            fill="var(--notify-warning-color)"
            width="30"
            height="30"
          />
        );
      case "error":
        return (
          <Icons.ErrorIcon
            className={cx("icon", {
              "show-icon": promise && promiseState !== "pending",
              "not-promise": !promise,
            })}
            fill="var(--notify-error-color)"
            width="30"
            height="30"
          />
        );
      default:
        return null;
    }
  };

  return {
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
  };
};

export default useNotify;
