import { cloneElement, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Icons } from "../../../../assets";

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
}) => {
   const [isVisible, setIsVisible] = useState(true);
   const [isVisibleLoadIcon, setIsVisibleLoadIcon] = useState(true);

   const rootRef = useRef(null);
   const progressBarRef = useRef(null);

   useLayoutEffect(() => {
      if (rootRef.current) {
         const { offsetWidth, offsetHeight } = rootRef.current;

         updateDimensions(id, offsetWidth, offsetHeight);
      }
   }, [id, updateDimensions, promiseState]);

   useEffect(() => {
      if (rootRef.current) {
         rootRef.current.style.setProperty("--timer-progress-bar", `${duration}ms`);
      }
      if (resetProgress && progressBarRef.current && !promise) {
         // Chỉ reset animation nếu không phải là promise
         progressBarRef.current.style.animation = "none";
         progressBarRef.current.offsetHeight; // Trigger reflow
         progressBarRef.current.style.animation = null;
      }
   }, [duration, resetProgress, promise]);

   const handleAnimationStart = (e) => {
      e.target.classList.add(cx("disable-pointer-events"));
   };

   const handleAnimationEnd = (e) => {
      e.target.classList.remove(cx("disable-pointer-events"));

      if (!e.target.classList.contains(cx("hide")) && stack) {
         e.target.classList.add("stacked");
      }

      if (e.target.classList.contains(cx("hide"))) {
         setIsVisible(false);
         onClose(id);
      }
   };

   const handleClose = () => {
      rootRef.current.classList.add(cx("disable-pointer-events"));
      rootRef.current.style.animationPlayState = "running";

      if (promise && promiseState === "pending") {
         // Không cho phép đóng khi promise đang pending
         return;
      }
      rootRef.current.classList.add(cx("hide"));
      rootRef.current.classList.remove("stacked");
   };

   const handleProgressBarAnimationEnd = () => {
      handleClose();
   };

   const handleMouseEnter = () => {
      if (freezeOnHover && onFreeze) {
         onFreeze(placement, id);
      }
   };

   const handleMouseLeave = () => {
      if (freezeOnHover && onUnfreeze) {
         onUnfreeze(placement, id);
      }
   };

   const handleLoadIconTransitionEnd = (e) => {
      if (e.target.classList.contains(cx("hide-load-icon"))) {
         setIsVisibleLoadIcon(false);
      }
   };

   const renderIcon = () => {
      const CustomIcon = customIcons && customIcons[type];

      if (CustomIcon) {
         return cloneElement(CustomIcon, {
            className: cx(CustomIcon.props.className, "icon", {
               "text-primary-color": type === "info",
               "text-fortieth-color": type === "success",
               "text-thirty-ninth-color": type === "reject" || type === "error",
               "text-thirty-fifth-color": type === "warning",
               "show-icon": promise && promiseState !== "pending",
               "not-promise": !promise,
            }),
            width: CustomIcon.props.width || "30",
            height: CustomIcon.props.height || "30",
         });
      }

      switch (type) {
         case "info":
            return (
               <Icons.NotifyIcon
                  className={cx("icon", "text-primary-color", {
                     "show-icon": promise && promiseState !== "pending",
                     "not-promise": !promise,
                  })}
                  width="30"
                  height="30"
               />
            );
         case "success":
            return (
               <Icons.CheckedIcon
                  className={cx("icon", "text-fortieth-color", {
                     "show-icon": promise && promiseState === "fulfilled",
                     "not-promise": !promise,
                  })}
                  width="30"
                  height="30"
               />
            );
         case "reject":
            return (
               <Icons.RejectIcon
                  className={cx("icon", "text-thirty-ninth-color", {
                     "show-icon": promise && promiseState === "rejected",
                     "not-promise": !promise,
                  })}
                  width="30"
                  height="30"
               />
            );
         case "warning":
            return (
               <Icons.WarningIcon
                  className={cx("icon", "text-thirty-fifth-color", {
                     "show-icon": promise && promiseState !== "pending",
                     "not-promise": !promise,
                  })}
                  width="30"
                  height="30"
               />
            );
         case "error":
            return (
               <Icons.ErrorIcon
                  className={cx("icon", "text-thirty-ninth-color", {
                     "show-icon": promise && promiseState !== "pending",
                     "not-promise": !promise,
                  })}
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
