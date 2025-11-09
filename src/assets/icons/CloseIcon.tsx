import type { SvgIconProps } from "@/utils/types";

const CloseIcon = ({
  className,
  width = "30",
  height = "30",
  fill = "currentColor",
  stroke = "currentColor",
  strokeWidth = "1.5",
}: SvgIconProps) => (
  <svg
    className={className}
    width={width}
    height={height}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    viewBox="-0.5 0 25 25"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 21.32L21 3.32001"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 3.32001L21 21.32"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CloseIcon;
