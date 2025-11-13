import type { SVGProps } from "react";

/**
 * Props interface chung cho tất cả SVG Icon components
 * Sử dụng cho tất cả các icon components trong dự án
 * Extends React.SVGProps để hỗ trợ tất cả HTML/SVG attributes (onClick, style, etc.)
 */
interface SvgIconProps extends SVGProps<SVGSVGElement> {
  /** CSS class name để tùy chỉnh styling */
  className?: string;

  /** Chiều rộng của icon (mặc định: "30") */
  width?: string | number;

  /** Chiều cao của icon (mặc định: "30") */
  height?: string | number;

  /** Màu fill cho SVG paths (mặc định: "currentColor") */
  fill?: string;

  /** Màu stroke cho SVG paths (mặc định: "") */
  stroke?: string;

  /** Độ dày của stroke (mặc định: "") */
  strokeWidth?: string | number;
}

export type { SvgIconProps };
