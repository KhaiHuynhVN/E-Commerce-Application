import type { CSSProperties, TransitionEventHandler } from "react";

// =====================================================
// INNER LOADER TYPES - Tất cả types cho InnerLoader component
// =====================================================

/** Props cho InnerLoader component */
interface InnerLoaderProps {
  /** Custom className cho wrapper */
  className?: string;
  /** Custom className cho circle */
  circleClassName?: string;
  /** Kích thước loader */
  size?: string;
  /** Callback khi transition end */
  onTransitionEnd?: TransitionEventHandler<HTMLDivElement>;
}

/** Style với CSS variables */
interface InnerLoaderStyle extends CSSProperties {
  "--size"?: string;
}

export type { InnerLoaderProps, InnerLoaderStyle };
