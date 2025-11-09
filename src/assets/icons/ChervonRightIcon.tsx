import type { SvgIconProps } from "@/utils/types";

const ChervonRightIcon = ({
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
      d="M6.94 4L6 4.94L9.05333 8L6 11.06L6.94 12L10.94 8L6.94 4Z"
      fill="#EDEDED"
    />
  </svg>
);

export default ChervonRightIcon;
