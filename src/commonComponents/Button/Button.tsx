import {
  useRef,
  useEffect,
  type ButtonHTMLAttributes,
  type ReactNode,
  type Ref,
  type MouseEvent,
  memo,
} from "react";
import classNames from "classnames/bind";

import type { ButtonStyleType } from "../../utils";

import styles from "./Button.module.scss";

const cx = classNames.bind(styles);

interface ButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "disabled" | "onClick" | "onMouseDown"
  > {
  /** Loại button HTML */
  type?: "button" | "submit" | "reset";

  /** Vô hiệu hóa button */
  disabled?: boolean;

  /** Kiểu style của button */
  styleType?: ButtonStyleType;

  /** Khoảng cách giữa icon và text */
  iconSpacing?: string;

  /** Bo góc */
  rounded?: string;

  /** Icon bên trái */
  leftIcon?: ReactNode;

  /** Fallback icon bên trái */
  fallbackLeftIcon?: ReactNode;

  /** Icon bên phải */
  rightIcon?: ReactNode;

  /** Fallback icon bên phải */
  fallbackRightIcon?: ReactNode;

  /** CSS class bổ sung */
  className?: string;

  /** CSS class cho text wrapper */
  textClassName?: string;

  /** Nội dung button */
  children: ReactNode;

  /** Xử lý sự kiện click */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /** Xử lý sự kiện mouse down */
  onMouseDown?: (event: MouseEvent<HTMLButtonElement>) => void;

  /** Ref từ bên ngoài cho button element */
  buttonRef?: Ref<HTMLButtonElement>;
}

const Button = ({
  type = "button",
  disabled = false,
  styleType = "primary",
  iconSpacing = "8px",
  rounded = "4px",
  leftIcon,
  fallbackLeftIcon,
  rightIcon,
  fallbackRightIcon,
  className,
  textClassName,
  children,
  onClick,
  onMouseDown,
  buttonRef,
  ...props
}: ButtonProps) => {
  const internalRef = useRef<HTMLButtonElement>(null);

  // Nếu có buttonRef được truyền từ bên ngoài, gán ref cho button
  useEffect(() => {
    if (buttonRef) {
      if (typeof buttonRef === "function") {
        buttonRef(internalRef.current);
      } else if (buttonRef) {
        buttonRef.current = internalRef.current;
      }
    }
  }, [buttonRef]);

  const classes = cx("wrapper", {
    disabled,
    [styleType]: styleType,
    ...(className && { [className]: true }),
  });

  // Lọc bỏ tất cả event handlers (props bắt đầu bằng "on") khi disabled
  const filteredProps = disabled
    ? Object.keys(props).reduce((acc, key) => {
        if (!key.startsWith("on")) {
          acc[key as keyof typeof props] = props[key as keyof typeof props];
        }
        return acc;
      }, {} as Partial<ButtonProps>)
    : props;

  const _props = disabled
    ? {
        style: {
          "--iconSpacing": iconSpacing,
          "--rounded": rounded,
        } as React.CSSProperties,
        "aria-disabled": true,
        tabIndex: -1, // Ngăn focus khi disabled
        ...filteredProps,
      }
    : {
        onClick,
        onMouseDown,
        style: {
          "--iconSpacing": iconSpacing,
          "--rounded": rounded,
        } as React.CSSProperties,
        ...props,
      };

  return (
    <button ref={internalRef} type={type} className={classes} {..._props}>
      {leftIcon && <span className={cx("left-icon", `flex`)}>{leftIcon}</span>}
      {fallbackLeftIcon && (
        <span className={cx("fallback-left-icon")}>{fallbackLeftIcon}</span>
      )}
      <div className={cx("children", textClassName)}>{children}</div>
      {rightIcon && (
        <span className={cx("right-icon", `flex`)}>{rightIcon}</span>
      )}
      {fallbackRightIcon && (
        <span className={cx("fallback-right-icon")}>{fallbackRightIcon}</span>
      )}
    </button>
  );
};

export default memo(Button);
