import type { SvgIconProps } from "@/utils/types";

const ChervonLeftIcon = ({
  className,
  width = "30",
  height = "30",
  fill = "currentColor",
  stroke = "",
  strokeWidth = "",
}: SvgIconProps) => (
  <svg
    className={className}
    width={width}
    height={height}
    fill={fill}
    stroke={stroke}
    strokeWidth={strokeWidth}
    viewBox="0 0 16 16"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.06 12L11 11.06L7.94667 8L11 4.94L10.06 4L6.06 8L10.06 12Z"
      fill="#EDEDED"
    />
  </svg>
);

export default ChervonLeftIcon;
