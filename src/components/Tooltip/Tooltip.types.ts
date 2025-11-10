import React from "react";

// =====================================================
// TOOLTIP TYPES - Tất cả types cho Tooltip component system
// =====================================================

// ----- Placement & Animation Types -----
/** Các vị trí có thể có của tooltip */
type PlacementType =
  | "top"
  | "topLeft"
  | "topRight"
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "left"
  | "leftTop"
  | "leftBottom"
  | "right"
  | "rightTop"
  | "rightBottom";

/** Các kiểu animation có thể áp dụng */
type AnimationType =
  | "show-fade_hide-fade"
  | "show-slide_hide-slide"
  | "show-scale_hide-scale";

// ----- Helper Types -----
/** Position result từ getTooltipPosition */
interface TooltipPositionResult {
  position: {
    position: "fixed" | "absolute";
    left: string;
    top: string;
  };
  shift: number;
}

/** Offset position cho tooltip */
interface OffsetPosition {
  x: number;
  y: number;
}

// ----- Tooltip Component Props -----
/** Props cho Tooltip component */
interface TooltipProps {
  /** Element con sẽ được wrap bởi tooltip */
  children: React.ReactElement;
  /** Nội dung hiển thị trong tooltip */
  content: React.ReactNode;
  /** Ref của container element */
  container?: React.RefObject<HTMLElement> | HTMLElement | null;
  /** Vị trí hiển thị của tooltip */
  placement?: PlacementType;
  /** Điều khiển việc hiển thị tooltip (controlled mode) */
  open?: boolean;
  /** Hiển thị mũi tên chỉ hướng */
  arrow?: boolean;
  /** Custom className cho tooltip */
  className?: string;
  /** Custom className cho arrow */
  arrowClassName?: string;
  /** Giữ nguyên placement mới sau khi tự động thay đổi */
  keepPlacement?: boolean;
  /** Khoảng cách giữa tooltip và element */
  spacing?: number;
  /** Khoảng cách giữa tooltip và màn hình */
  margin?: number;
  /** Cho phép animation */
  allowAnimation?: boolean;
  /** Animation của tooltip */
  animation?: AnimationType;
  /** Thời gian delay hiển thị tooltip */
  showDelay?: number;
  /** Thời gian delay ẩn tooltip */
  hideDelay?: number;
  /** Cho phép hover vào tooltip */
  interactive?: boolean;
  /** Key để định danh tooltip */
  tooltipKey?: string | null;
  /** Array chứa các tooltipKey được phép tương tác */
  relatedTooltipKeys?: string[];
  /** Cho phép hiển thị tooltip khi di chuyển chuột trong element gốc */
  showOnMouseMove?: boolean;
  /** Ref của Tooltip component */
  tooltipRef?: React.RefObject<{
    innerTooltipRef: HTMLDivElement | null;
    childRef: HTMLElement | null;
    updatePosition: () => void;
  }>;
  /** Cho phép đóng tooltip khi click outside trong controlled mode */
  closeOnClickOutside?: boolean;
  /** Hàm để điều khiển việc hiển thị tooltip trong controlled mode */
  setOpen?: (open: boolean) => void;
  /** Hàm để xử lý khi tooltip đóng */
  onClose?: () => void;
  /** Key để trigger lại việc tính toán vị trí */
  recalculateKey?: unknown;
  /** Cho phép tính toán vị trí dựa trên cửa sổ */
  calculatePositionBasedOnWindow?: boolean;
  /** Cho phép disable tooltip */
  disabled?: boolean;
  /** Vị trí offset của tooltip */
  offsetPosition?: OffsetPosition;
}

// ----- useTooltip Hook Props -----
/** Props cho useTooltip hook */
interface UseTooltipProps {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onClose?: () => void;
  placement: PlacementType;
  allowAnimation: boolean;
  showDelay: number;
  hideDelay: number;
  interactive: boolean;
  tooltipKey?: string | null;
  relatedTooltipKeys: string[];
  showOnMouseMove: boolean;
  tooltipRef?: React.RefObject<{
    innerTooltipRef: HTMLDivElement | null;
    childRef: HTMLElement | null;
    updatePosition: () => void;
  }>;
  closeOnClickOutside: boolean;
  recalculateKey?: unknown;
  calculatePositionBasedOnWindow: boolean;
  disabled: boolean;
  offsetPosition: OffsetPosition;
  keepPlacement: boolean;
  spacing: number;
  margin: number;
  container?: React.RefObject<HTMLElement> | HTMLElement | null;
  arrow: boolean;
}

/** Return value của useTooltip hook */
interface UseTooltipReturn {
  isVisible: boolean;
  handleMouseEnter: (e: React.MouseEvent) => void;
  handleMouseLeave: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  childRef: React.RefObject<HTMLElement>;
  innerTooltipRef: React.RefObject<HTMLDivElement>;
  tooltipStyle: TooltipPositionResult;
  currentPlacement: PlacementType;
  shouldRender: boolean;
  handleTooltipMouseEnter: () => void;
  handleTooltipMouseLeave: (e: React.MouseEvent) => void;
  handleAnimationEnd: (e: React.AnimationEvent) => void;
  isPositionCalculated: boolean;
}

// ----- tooltipHelpers Functions -----
/** Parameters cho getTooltipPosition function */
interface GetTooltipPositionParams {
  element: HTMLElement | null;
  container: HTMLElement | null;
  placement: PlacementType;
  spacing: number;
  tooltipElement: HTMLElement | null;
  offset: OffsetPosition;
}

/** Parameters cho getArrowPosition function */
interface GetArrowPositionParams {
  placement: PlacementType;
  tooltipRect: DOMRect | null;
  elementRect: DOMRect | null;
}

/** Return type của getArrowPosition */
interface ArrowPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  transform?: string;
}

/** Parameters cho getOptimalPlacement function */
interface GetOptimalPlacementParams {
  element: HTMLElement | null;
  tooltipElement: HTMLElement | null;
  placement: PlacementType;
  spacing: number;
  container: HTMLElement | null;
  margin: number;
}

// ----- tooltipManager Types -----
/** Tooltip key type */
type TooltipKey = string | null | undefined;

/** Event type cho getTooltipKeyFromEvent */
interface TooltipEvent {
  target: EventTarget | null;
}

export type {
  // Placement & Animation
  PlacementType,
  AnimationType,
  // Helper types
  TooltipPositionResult,
  OffsetPosition,
  // Component props
  TooltipProps,
  UseTooltipProps,
  UseTooltipReturn,
  // Helper function types
  GetTooltipPositionParams,
  GetArrowPositionParams,
  ArrowPosition,
  GetOptimalPlacementParams,
  // Manager types
  TooltipKey,
  TooltipEvent,
};
