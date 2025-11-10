import type { CSSProperties, ReactNode } from "react";

// =====================================================
// GLOBAL MODAL TYPES - Tất cả types cho GlobalModal component
// =====================================================

/** Props cho GlobalModal component */
interface GlobalModalProps {
  /** React children */
  children?: ReactNode;
  /** Custom className cho modal */
  className?: string;
  /** Custom className cho root */
  rootClassName?: string;
  /** Hiển thị modal hay không */
  showModal?: boolean;
  /** Cho phép đóng khi click outside */
  closeOutside?: boolean;
  /** Center modal */
  centered?: boolean;
  /** Handler khi OK */
  handleOk?: () => void;
  /** Handler khi Cancel */
  handleCancel?: () => void;
  /** Handler sau khi đóng */
  handleAfterClose?: () => void;
  /** Handler sau khi mở */
  handleAfterOpen?: (isOpen: boolean) => void;
  /** Footer content */
  footer?: ReactNode;
  /** Close icon */
  closeIcon?: ReactNode;
  /** Target element để drag */
  draggableTarget?: string;
  /** Disable drag */
  disableDrag?: boolean;
  /** Reset position khi đóng */
  resetPositionWhenClose?: boolean;
  /** Custom style */
  style?: CSSProperties;
  /** Hiển thị mask */
  mask?: boolean;
}

/** Position state */
interface Position {
  x: number;
  y: number;
}

/** Bounds state */
interface Bounds {
  left: number;
  top: number;
  bottom: number;
  right: number;
}

/** UI Data từ react-draggable */
interface DraggableData {
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  lastX: number;
  lastY: number;
  node: HTMLElement;
}

/** Event từ react-draggable */
interface DraggableEvent {
  type: string;
  target: EventTarget | null;
  currentTarget: EventTarget | null;
}

export type {
  GlobalModalProps,
  Position,
  Bounds,
  DraggableData,
  DraggableEvent,
};
