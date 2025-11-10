import type { CSSProperties } from "react";

export interface InlineLoaderProps {
  className?: string;
  style?: CSSProperties;
  duration?: string;
  containerSize?: string;
  boxSize?: string;
  boxBorderRadius?: string;
}

export interface InlineLoaderStyle extends CSSProperties {
  "--duration"?: string;
  "--container-size"?: string;
  "--box-size"?: string;
  "--box-border-radius"?: string;
}
