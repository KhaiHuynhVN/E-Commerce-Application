import type React from "react";
import type { Argument as ClassNamesArgument } from "classnames";

import type {
  Notification,
  NotifyType,
  NotifyPlacement,
  CustomIcons,
  PromiseState,
  NotificationsMap,
  FrozenPlacementsMap,
  NotificationDimensionsMap,
  PromiseStatesMap,
  HoverTransitionsMap,
} from "../../utils/models/notifyService.types";

// =====================================================
// NOTIFY CONTAINER TYPES - Tất cả types cho NotifyContainer component system
// =====================================================

// ----- Helper Types -----
/** ClassNames binding function type */
type ClassNameBindingFunction = (...args: ClassNamesArgument[]) => string;

/** Placement state map cho các state boolean theo vị trí */
type PlacementBooleanMap = Record<NotifyPlacement, boolean>;

/** Hover area dimensions */
interface HoverAreaDimensions {
  top: number;
  height: number;
  width: number;
  spacingX: number;
  spacingY: number;
}

/** Style object cho notification */
interface NotificationStyle {
  opacity: number;
  scale: number;
  pointerEvents: "auto" | "none";
}

// ----- NotifyContainer Component Props -----
/** Props cho NotifyContainer component */
interface NotifyContainerProps {
  /** Custom className */
  className?: string;
}

// ----- Notify Component Props -----
/** Props cho Notify component */
interface NotifyProps {
  /** Custom className */
  className?: string;
  /** ID unique của notification */
  id: number;
  /** Nội dung thông báo */
  message: string | React.ReactNode;
  /** Loại thông báo */
  type: NotifyType;
  /** Thời gian hiển thị (ms) */
  duration: number;
  /** Tạm dừng khi hover */
  pauseOnHover: boolean;
  /** Hiển thị progress bar */
  showProgressBar: boolean;
  /** Chiều rộng tối đa */
  maxWidth: number;
  /** Chiều rộng */
  width: number | string | null;
  /** Chiều cao tối đa */
  maxHeight: number | string;
  /** Vị trí top */
  position: number;
  /** Thời gian hiển thị animation (s) */
  showDuration: number;
  /** Thời gian ẩn animation (s) */
  hideDuration: number;
  /** Thời gian transition (s) */
  transitionDuration: number;
  /** Hàm thời gian transition */
  transitionTimingFunction: string;
  /** Thời gian delay transition (s) */
  transitionDelay: number;
  /** Callback khi update dimensions */
  updateDimensions: (id: number, width: number, height: number) => void;
  /** Vị trí hiển thị */
  placement: NotifyPlacement;
  /** Có stack hay không */
  stack: boolean;
  /** Khoảng cách ngang */
  spacingX: number;
  /** Z-index */
  zIndex: number;
  /** Opacity */
  opacity: number;
  /** Scale */
  scale: number;
  /** Pointer events */
  pointerEvents: string;
  /** Đóng băng khi hover */
  freezeOnHover: boolean;
  /** Trạng thái frozen */
  isFrozen: boolean;
  /** Immortal flag */
  immortal: boolean;
  /** Promise flag */
  promise: boolean;
  /** Trạng thái promise */
  promiseState: PromiseState | undefined;
  /** Reset progress flag */
  resetProgress: boolean;
  /** Custom icons */
  customIcons: CustomIcons | null;
  /** Callback khi freeze */
  onFreeze?: (placement: NotifyPlacement, id: number) => void;
  /** Callback khi unfreeze */
  onUnfreeze?: (placement: NotifyPlacement, id: number) => void;
  /** Callback khi close */
  onClose: (id: number) => void;
}

// ----- useNotify Hook Types -----
/** Props cho useNotify hook */
interface UseNotifyProps {
  /** ClassNames binding function */
  cx: ClassNameBindingFunction;
  /** ID của notification */
  id: number;
  /** Thời gian hiển thị (ms) */
  duration: number;
  /** Reset progress flag */
  resetProgress: boolean;
  /** Promise flag */
  promise: boolean;
  /** Callback update dimensions */
  updateDimensions: (id: number, width: number, height: number) => void;
  /** Trạng thái promise */
  promiseState: PromiseState | undefined;
  /** Callback khi close */
  onClose: (id: number) => void;
  /** Callback khi freeze */
  onFreeze?: (placement: NotifyPlacement, id: number) => void;
  /** Callback khi unfreeze */
  onUnfreeze?: (placement: NotifyPlacement, id: number) => void;
  /** Custom icons */
  customIcons: CustomIcons | null;
  /** Loại notification */
  type: NotifyType;
  /** Stack flag */
  stack: boolean;
  /** Vị trí hiển thị */
  placement: NotifyPlacement;
  /** Freeze on hover flag */
  freezeOnHover: boolean;
  /** Màu icon */
  iconColor?: string;
  /** Màu progress bar */
  progressBarColor?: string;
}

/** Return value từ useNotify hook */
interface UseNotifyReturn {
  /** Trạng thái hiển thị */
  isVisible: boolean;
  /** Ref đến root element */
  rootRef: React.RefObject<HTMLDivElement | null>;
  /** Ref đến progress bar */
  progressBarRef: React.RefObject<HTMLDivElement | null>;
  /** Handler cho animation start */
  handleAnimationStart: (e: React.AnimationEvent<HTMLDivElement>) => void;
  /** Handler cho animation end */
  handleAnimationEnd: (e: React.AnimationEvent<HTMLDivElement>) => void;
  /** Handler cho mouse enter */
  handleMouseEnter: () => void;
  /** Handler cho mouse leave */
  handleMouseLeave: () => void;
  /** Handler cho load icon transition end */
  handleLoadIconTransitionEnd: (
    e: React.TransitionEvent<HTMLDivElement>
  ) => void;
  /** Handler cho progress bar animation end */
  handleProgressBarAnimationEnd: () => void;
  /** Handler cho close */
  handleClose: () => void;
  /** Function render icon */
  renderIcon: () => React.ReactNode;
  /** Trạng thái hiển thị load icon */
  isVisibleLoadIcon: boolean;
}

// ----- useNotifyContainer Hook Types -----
/** Return value từ useNotifyContainer hook */
interface UseNotifyContainerReturn {
  /** Notifications map */
  notifications: NotificationsMap;
  /** Hovered placements map */
  hoveredPlacements: PlacementBooleanMap;
  /** Function check có stacked toasts không */
  hasStackedToasts: (placementNotifications: Notification[]) => boolean;
  /** Function tính hover area dimensions */
  calculateHoverAreaDimensions: (
    placement: NotifyPlacement,
    placementNotifications: Notification[],
    isHovered: boolean
  ) => HoverAreaDimensions | null;
  /** Function tính top position */
  calculateTop: (
    index: number,
    newItemOnTop: boolean,
    placement: NotifyPlacement,
    itemSpacing: number,
    spacingY: number,
    isStackItem?: boolean
  ) => number;
  /** Function tính style */
  calculateStyle: (
    index: number,
    placement: NotifyPlacement,
    stack: boolean,
    newItemOnTop: boolean
  ) => NotificationStyle;
  /** Function update dimensions */
  updateDimensions: (id: number, width: number, height: number) => void;
  /** Handler cho mouse enter */
  handleMouseEnter: (
    placement: NotifyPlacement,
    placementNotifications: Notification[]
  ) => void;
  /** Handler cho mouse leave */
  handleMouseLeave: (
    placement: NotifyPlacement,
    placementNotifications: Notification[]
  ) => void;
  /** Handler cho close */
  handleClose: (id: number) => void;
  /** Handler cho freeze */
  handleFreeze: (placement: NotifyPlacement, notificationId: number) => void;
  /** Handler cho unfreeze */
  handleUnfreeze: (placement: NotifyPlacement, notificationId: number) => void;
  /** Hover transitions map */
  hoverTransitions: HoverTransitionsMap;
  /** Frozen placements map */
  frozenPlacements: FrozenPlacementsMap;
  /** Promise states map */
  promiseStates: PromiseStatesMap;
  /** Reset progress ID */
  resetProgressId: number | null;
}

// =====================================================
// EXPORTS - Xuất tất cả các types
// =====================================================

export type {
  // Helper types
  ClassNameBindingFunction,
  PlacementBooleanMap,
  HoverAreaDimensions,
  NotificationStyle,
  // Component props
  NotifyContainerProps,
  NotifyProps,
  // Hook types
  UseNotifyProps,
  UseNotifyReturn,
  UseNotifyContainerReturn,
  // Re-export từ notifyService.types
  Notification,
  NotifyType,
  NotifyPlacement,
  CustomIcons,
  PromiseState,
  NotificationsMap,
  FrozenPlacementsMap,
  NotificationDimensionsMap,
  PromiseStatesMap,
  HoverTransitionsMap,
};
