import type { SvgIconProps } from "@/utils/types";

const CheckedIcon = ({
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
    viewBox="0 0 408.576 408.576"
    xmlSpace="preserve"
  >
    <g>
      <path
        d="M204.288 0C91.648 0 0 91.648 0 204.288s91.648 204.288 204.288 204.288 204.288-91.648 204.288-204.288S316.928 0 204.288 0zm114.176 150.528-130.56 129.536c-7.68 7.68-19.968 8.192-28.16.512L90.624 217.6c-8.192-7.68-8.704-20.48-1.536-28.672 7.68-8.192 20.48-8.704 28.672-1.024l54.784 50.176L289.28 121.344c8.192-8.192 20.992-8.192 29.184 0s8.192 20.992 0 29.184z"
        fill={fill}
      ></path>
    </g>
  </svg>
);

export default CheckedIcon;
