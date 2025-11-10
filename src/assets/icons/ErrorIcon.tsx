import type { SvgIconProps } from "@/utils/types";

const ErrorIcon = ({
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
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 512 512"
    xmlSpace="preserve"
  >
    <g>
      <path
        d="M249.848 271h12.304l12.541-150h-37.386zM256 361c-8.244 0-14.95 6.707-14.95 14.95v.1c0 8.244 6.707 14.95 14.95 14.95s14.95-6.707 14.95-14.95c0-8.343-6.706-15.05-14.95-15.05z"
        fill={fill}
      ></path>
      <path
        d="M507.606 145.568 366.432 4.394A15 15 0 0 0 355.826 0H156.174a15 15 0 0 0-10.606 4.394L4.394 145.568A15 15 0 0 0 0 156.174v199.651a15 15 0 0 0 4.394 10.606l141.174 141.174a15 15 0 0 0 10.606 4.394h199.651a15 15 0 0 0 10.606-4.394l141.174-141.174a15 15 0 0 0 4.394-10.606V156.174a14.995 14.995 0 0 0-4.393-10.606zM256 421c-24.786 0-44.95-20.165-44.95-44.95v-.1c0-24.786 20.165-44.95 44.95-44.95s44.95 20.165 44.95 44.95c0 24.885-20.164 45.05-44.95 45.05zm49.948-313.75-15.05 180c-.65 7.772-7.148 13.75-14.948 13.75h-39.9c-7.8 0-14.298-5.978-14.948-13.75l-15.05-180C205.321 98.51 212.224 91 221 91h70c8.771 0 15.679 7.505 14.948 16.25z"
        fill={fill}
      ></path>
    </g>
  </svg>
);

export default ErrorIcon;
