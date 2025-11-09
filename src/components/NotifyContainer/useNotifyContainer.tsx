/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from "react";

import { notifyService } from "../../utils";

const useNotifyContainer = () => {
   const [notifications, setNotifications] = useState({
      "top-left": [],
      "top-right": [],
      "bottom-left": [],
      "bottom-right": [],
      "top-center": [],
      "bottom-center": [],
   });
   const [frozenPlacements, setFrozenPlacements] = useState({
      "top-left": false,
      "top-right": false,
      "bottom-left": false,
      "bottom-right": false,
      "top-center": false,
      "bottom-center": false,
   });
   const [isStacked, setIsStacked] = useState({
      "top-left": false,
      "top-right": false,
      "bottom-left": false,
      "bottom-right": false,
      "top-center": false,
      "bottom-center": false,
   });
   const [hoveredPlacements, setHoveredPlacements] = useState({
      "top-left": false,
      "top-right": false,
      "bottom-left": false,
      "bottom-right": false,
      "top-center": false,
      "bottom-center": false,
   });
   const [promiseStates, setPromiseStates] = useState({
      "top-left": {},
      "top-right": {},
      "bottom-left": {},
      "bottom-right": {},
      "top-center": {},
      "bottom-center": {},
   });
   const [hoverTransitions, setHoverTransitions] = useState({
      "top-left": 300,
      "top-right": 300,
      "bottom-left": 300,
      "bottom-right": 300,
      "top-center": 300,
      "bottom-center": 300,
   });
   const [notificationDimensions, setNotificationDimensions] = useState({});
   const [resetProgressId, setResetProgressId] = useState(null);

   const stackedRef = useRef({
      "top-left": false,
      "top-right": false,
      "bottom-left": false,
      "bottom-right": false,
      "top-center": false,
      "bottom-center": false,
   });

   useEffect(() => {
      const unsubscribe = notifyService.subscribe(
         ({
            notifications,
            frozenPlacements,
            notificationDimensions,
            promiseStates,
            hoverTransitions,
            updatedId,
            resetProgress,
         }) => {
            setNotifications(notifications);
            setFrozenPlacements(frozenPlacements);
            setNotificationDimensions(notificationDimensions);
            setPromiseStates(promiseStates);
            setHoverTransitions(hoverTransitions);
            if (resetProgress) {
               setResetProgressId(updatedId);
            }
         },
      );

      return () => unsubscribe();
   }, []);

   const hasStackedToasts = useCallback((placementNotifications) => {
      return placementNotifications.some((notification) => notification.stack);
   }, []);

   useEffect(() => {
      Object.entries(notifications).forEach(([placement, placementNotifications]) => {
         if (placementNotifications.length === 0) {
            // Reset hover và stacked state khi không có toast
            setHoveredPlacements((prev) => ({ ...prev, [placement]: false }));
            setIsStacked((prev) => ({ ...prev, [placement]: false }));
            stackedRef.current[placement] = false;
         } else if (placementNotifications.length > 0 && !hasStackedToasts(placementNotifications)) {
            // Reset stacked state khi không có toast được stack
            setIsStacked((prev) => ({ ...prev, [placement]: false }));
            stackedRef.current[placement] = false;
         }
      });
   }, [notifications, hasStackedToasts]);

   const determineStackedState = useCallback((placementNotifications) => {
      const stackedNotifications = placementNotifications.filter((item) => item.stack);
      return stackedNotifications.length > notifyService.maxStack;
   }, []);

   useEffect(() => {
      let needUpdate = false;
      const newIsStacked = { ...isStacked };
      const newHoveredPlacements = { ...hoveredPlacements };

      Object.entries(notifications).forEach(([placement, placementNotifications]) => {
         const hasStacked = hasStackedToasts(placementNotifications);
         const shouldBeStacked = hasStacked && determineStackedState(placementNotifications);

         if (!hasStacked || !shouldBeStacked) {
            if (newIsStacked[placement] || newHoveredPlacements[placement]) {
               newIsStacked[placement] = false;
               newHoveredPlacements[placement] = false;
               stackedRef.current[placement] = false;
               needUpdate = true;
            }
         } else {
            const newStackedState = shouldBeStacked && !hoveredPlacements[placement];
            if (newIsStacked[placement] !== newStackedState) {
               newIsStacked[placement] = newStackedState;
               stackedRef.current[placement] = shouldBeStacked;
               needUpdate = true;
            }
         }
      });

      if (needUpdate) {
         setIsStacked(newIsStacked);
         setHoveredPlacements(newHoveredPlacements);
      }
   }, [notifications, hoveredPlacements, isStacked, hasStackedToasts, determineStackedState]);

   const handleClose = useCallback((id) => {
      notifyService.removeNotification(id);
   }, []);

   const calculateStyle = useCallback(
      (index, placement, stack, newItemOnTop) => {
         if (!stackedRef.current[placement] || !stack) {
            return { opacity: 1, scale: 1, pointerEvents: "auto" };
         }

         const placementNotifications = notifications[placement];
         const stackedNotifications = placementNotifications.filter((item) => item.stack);

         if (stackedNotifications.length <= 3) {
            return { opacity: 1, scale: 1, pointerEvents: "auto" };
         }

         const position = newItemOnTop ? index : stackedNotifications.length - index - 1;

         // Từ vị trí thứ 5 trở đi
         if (position >= 4) {
            return { opacity: 0, scale: 0.7, pointerEvents: "none" };
         }

         // Tính toán opacity
         const minOpacity = 0;
         const maxOpacity = 1;
         const opacityStep = (maxOpacity - minOpacity) / 5;
         const opacity = maxOpacity - position * opacityStep;

         // Tính toán scale
         const minScale = 0.8;
         const maxScale = 1;
         const scaleStep = (maxScale - minScale) / 3;
         const scale = maxScale - position * scaleStep;

         return { opacity, scale, pointerEvents: "auto" };
      },
      [notifications, isStacked],
   );

   const calculateTop = useCallback(
      (index, newItemOnTop, placement, itemSpacing, spacingY, isStackItem = false) => {
         let top = isStackItem ? 0 : spacingY;
         const placementNotifications = notifications[placement];
         const itemsToConsider = newItemOnTop
            ? placementNotifications.slice(0, index)
            : placementNotifications.slice(0, placementNotifications.length - index - 1);

         for (let item of itemsToConsider) {
            top += isStacked[placement] ? itemSpacing : (notificationDimensions[item.id]?.height || 0) + itemSpacing;
         }

         return top;
      },
      [notifications, isStacked, notificationDimensions],
   );

   const updateDimensions = useCallback((id, width, height) => {
      notifyService.updateNotificationDimensions(id, width, height);
   }, []);

   const calculateHoverAreaDimensions = useCallback(
      (placement, placementNotifications, isHovered) => {
         if (placementNotifications.length === 0 || !hasStackedToasts(placementNotifications)) return null;

         const firstToast = placementNotifications[0];
         const { newItemOnTop, itemSpacing, spacingY, spacingX } = firstToast;

         const topPosition = calculateTop(0, newItemOnTop, placement, itemSpacing, spacingY);

         const maxWidth = Math.max(
            ...placementNotifications.map((toast) => {
               const dimensions = notificationDimensions[toast.id];
               return dimensions ? dimensions.width : toast.width || toast.maxWidth || 0;
            }),
         );

         let top, height;
         if (newItemOnTop) {
            top = topPosition;

            if (isHovered) {
               // Khi đang hover, tính chiều cao dựa trên chiều cao thực tế của tất cả toast
               let totalHeight = 0;
               for (let i = 0; i < placementNotifications.length; i++) {
                  const toastHeight = notificationDimensions[placementNotifications[i].id]?.height || 0;
                  totalHeight += toastHeight + (i < placementNotifications.length - 1 ? itemSpacing : 0);
               }
               height = totalHeight;
            } else {
               // Khi chưa hover, tính chiều cao cho tối đa 4 toast trong trạng thái stack
               const stackedToastHeight = itemSpacing; // Chiều cao của một toast khi stack
               const maxVisibleToasts = Math.min(placementNotifications.length, 4);
               height = stackedToastHeight * maxVisibleToasts;

               // Thêm chiều cao của toast đầu tiên (không bị stack)
               const firstToastHeight = notificationDimensions[placementNotifications[0].id]?.height || 0;
               height += firstToastHeight - stackedToastHeight; // Trừ đi stackedToastHeight vì đã tính ở trên
            }
         } else {
            // Khi newItemOnTop là false
            if (isHovered) {
               // Khi đang hover, tính chiều cao dựa trên chiều cao thực tế của tất cả toast
               let totalHeight = 0;
               for (let i = 0; i < placementNotifications.length; i++) {
                  const toastHeight = notificationDimensions[placementNotifications[i].id]?.height || 0;
                  totalHeight += toastHeight + (i < placementNotifications.length - 1 ? itemSpacing : 0);
               }
               height = totalHeight;
               top = spacingY;
            } else {
               // Khi chưa hover, tính chiều cao cho tối đa 4 toast trong trạng thái stack
               const stackedToastHeight = itemSpacing; // Chiều cao của một toast khi stack
               const maxVisibleToasts = Math.min(placementNotifications.length, 4);
               height = stackedToastHeight * maxVisibleToasts;

               // Thêm chiều cao của toast cuối cùng (không bị stack)
               const lastToastHeight =
                  notificationDimensions[placementNotifications[placementNotifications.length - 1].id]?.height || 0;
               height += lastToastHeight - stackedToastHeight;

               // Tính toán top dựa trên vị trí của toast cuối cùng
               top = spacingY;
            }
         }

         return {
            top,
            height,
            width: maxWidth + 0 * spacingX, // tắng 0 lên nếu muốn thêm padding
            spacingX,
            spacingY,
         };
      },
      [calculateTop, hasStackedToasts],
   );

   const handleMouseEnter = useCallback(
      (placement, placementNotifications) => {
         if (hasStackedToasts(placementNotifications) && determineStackedState(placementNotifications)) {
            setHoveredPlacements((prev) => ({ ...prev, [placement]: true }));
            setIsStacked((prev) => ({ ...prev, [placement]: false }));
         }
         // Đóng băng tất cả các notifications trong placement này
         placementNotifications.forEach((notification) => {
            notifyService.setPlacementFrozen(placement, true, notification.id);
         });
      },
      [determineStackedState, hasStackedToasts],
   );

   const handleMouseLeave = useCallback(
      (placement, placementNotifications) => {
         if (hasStackedToasts(placementNotifications) && determineStackedState(placementNotifications)) {
            setHoveredPlacements((prev) => ({ ...prev, [placement]: false }));
            setIsStacked((prev) => ({ ...prev, [placement]: true }));
         }
         // Giải đóng băng tất cả các notifications trong placement này
         placementNotifications.forEach((notification) => {
            notifyService.setPlacementFrozen(placement, false, notification.id);
         });
      },
      [determineStackedState, hasStackedToasts],
   );

   const handleFreeze = useCallback((placement, notificationId) => {
      notifyService.setPlacementFrozen(placement, true, notificationId);
   }, []);

   const handleUnfreeze = useCallback((placement, notificationId) => {
      notifyService.setPlacementFrozen(placement, false, notificationId);
   }, []);

   return {
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
   };
};

export default useNotifyContainer;
