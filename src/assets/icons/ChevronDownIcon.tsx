import type { SvgIconProps } from "@/utils/types";

const ChevronDownIcon = ({
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
    viewBox="0 0 14 14"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.2071 4.79289C10.8166 4.40237 10.1834 4.40237 9.79289 4.79289L7 7.58579L4.20711 4.79289C3.81658 4.40237 3.18342 4.40237 2.79289 4.79289C2.40237 5.18342 2.40237 5.81658 2.79289 6.20711L6.29289 9.70711C6.68342 10.0976 7.31658 10.0976 7.70711 9.70711L11.2071 6.20711C11.5976 5.81658 11.5976 5.18342 11.2071 4.79289Z"
      fill={fill}
    />
  </svg>
);

export default ChevronDownIcon;
