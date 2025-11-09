import type {
  InputHTMLAttributes,
  RefObject,
  SyntheticEvent,
  FocusEvent,
  ClipboardEvent,
  KeyboardEvent,
} from "react";
import type {
  Control,
  FieldError,
  ControllerRenderProps,
  ControllerFieldState,
  FieldValues,
} from "react-hook-form";
import type classNames from "classnames";
import type { InputStyleType } from "../../utils";

/**
 * Props interface cho Input component
 */
interface InputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onPaste" | "onFocus" | "onBlur" | "type" | "onError"
  > {
  /** HTML input ID */
  id?: string;

  /** CSS class cho wrapper */
  className?: string;

  /** CSS class cho input element */
  inputClassName?: string;

  /** Placeholder text */
  placeholder?: string;

  /** Giá trị input (cho mode common) */
  value?: string;

  /** Giá trị từ bên ngoài để khởi tạo */
  externalValue?: string;

  /** Loại input */
  type?: "text" | "password" | "number" | "email" | "tel" | "url";

  /** Kiểu style của input */
  styleType?: InputStyleType;

  /** Tên field (cho react-hook-form) */
  name?: string;

  /** Control object từ react-hook-form */
  control?: Control;

  /** Chế độ common (không dùng react-hook-form) */
  isCommon?: boolean;

  /** Tự động trim khoảng trắng đầu */
  isTrimStart?: boolean;

  /** Kiểm tra chính tả */
  spellCheck?: boolean;

  /** Chế độ password tùy chỉnh (mask với •) */
  isCustomPassword?: boolean;

  /** Ref cho button toggle password visibility */
  toggleButtonRef?: RefObject<HTMLElement>;

  /** Tự động điền */
  autoComplete?: "on" | "off";

  /** Hàm format giá trị */
  formatValue?: (value: string) => string;

  /** Dấu phân cách cho format số (. hoặc ,) */
  isFormatNumberWithSeparator?: string;

  /** Chuyển sang chữ hoa */
  upperCase?: boolean;

  /** Chuyển sang chữ thường */
  lowerCase?: boolean;

  /** Số ký tự tối đa */
  maxLength?: number;

  /** Cho phép khoảng trắng */
  allowWhitespace?: boolean;

  /** CSS class khi có lỗi */
  inputErrClassName?: string;

  /** CSS class khi hợp lệ */
  inputValidClassName?: string;

  /** Vô hiệu hóa input */
  disabled?: boolean;

  /** Ref từ bên ngoài */
  externalRef?:
    | RefObject<HTMLInputElement>
    | ((instance: HTMLInputElement | null) => void)
    | null;

  /** Callback khi giá trị thay đổi */
  onChange?: (value: string) => void;

  /** Callback khi paste */
  onPaste?: (e: ClipboardEvent<HTMLInputElement>) => void;

  /** Callback khi có lỗi validation */
  onError?: (name: string, error: FieldError | null | undefined) => void;

  /** Callback khi focus */
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;

  /** Callback khi blur */
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

/**
 * Params cho useInput hook
 */
interface UseInputParams {
  value: string;
  isCommon: boolean;
  control?: Control;
  formatValue: (value: string) => string;
  isTrimStart: boolean;
  onChange: (value: string) => void;
  isCustomPassword: boolean;
  className?: string;
  externalValue: string;
  styleType: InputStyleType;
  name?: string;
  toggleButtonRef?: RefObject<HTMLElement>;
  isFormatNumberWithSeparator: string;
  upperCase: boolean;
  lowerCase: boolean;
  cx: (...args: classNames.ArgumentArray) => string;
  maxLength?: number;
  allowWhitespace: boolean;
  disabled: boolean;
  onError: (name: string, error: FieldError | null | undefined) => void;
  externalRef?:
    | RefObject<HTMLInputElement>
    | ((instance: HTMLInputElement | null) => void)
    | null;
}

/**
 * Return type của useInput hook
 */
interface UseInputReturn {
  classes: string;
  finalValue: string;
  field:
    | ControllerRenderProps<FieldValues, string>
    | {
        ref: () => void;
        value: string;
        onChange: () => void;
      };
  fieldState:
    | ControllerFieldState
    | {
        error?: FieldError | null | undefined;
      };
  inputRef: RefObject<HTMLInputElement | null>;
  handleInputChange: (
    e: SyntheticEvent<HTMLInputElement> | ClipboardEvent<HTMLInputElement>,
    dataProcessor: (value: string) => string,
    isPaste?: boolean
  ) => void;
  handleSelect: (e: SyntheticEvent<HTMLInputElement>) => void;
  handleKeyUp: (e: KeyboardEvent<HTMLInputElement>) => void;
  handleFocus: (e: FocusEvent<HTMLInputElement>) => void;
}

/**
 * Selection state interface
 */
interface SelectionState {
  start: number;
  end: number;
}

/**
 * Processed value result
 */
interface ProcessedValue {
  value: string;
  cursorPosition: number;
}

export type {
  InputProps,
  UseInputParams,
  UseInputReturn,
  SelectionState,
  ProcessedValue,
};
