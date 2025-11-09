import type { SvgIconProps } from "@/utils/types";

const CaretRightIcon = ({
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
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g>
      <path
        d="m190.06 414 163.12-139.78a24 24 0 0 0 0-36.44L190.06 98c-15.57-13.34-39.62-2.28-39.62 18.22v279.6c0 20.5 24.05 31.56 39.62 18.18z"
        fill={fill}
      ></path>
    </g>
  </svg>
);

export default CaretRightIcon;
