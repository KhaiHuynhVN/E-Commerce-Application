import classNames from "classnames/bind";

import styles from "./Input.module.scss";
import useInput from "./useInput";
import type { InputProps } from "./Input.types";

const cx = classNames.bind(styles);

/**
 * Input component với các tính năng format số, custom password và tích hợp react-hook-form
 */
const Input = ({
  id,
  className,
  inputClassName,
  placeholder,
  value = "",
  externalValue = "",
  type = "text",
  styleType = "primary",
  name,
  control,
  isCommon = false,
  isTrimStart = false,
  spellCheck = false,
  isCustomPassword = false,
  toggleButtonRef,
  autoComplete = "on",
  formatValue = (value: string) => value,
  isFormatNumberWithSeparator = "",
  onChange = () => {},
  onPaste = () => {},
  onError = () => {},
  upperCase = false,
  lowerCase = false,
  maxLength,
  allowWhitespace = true,
  inputErrClassName = "error",
  inputValidClassName = "",
  disabled = false,
  onFocus = () => {},
  onBlur = () => {},
  externalRef = null,
  ...props
}: InputProps) => {
  const {
    classes,
    finalValue,
    field,
    fieldState,
    inputRef,
    handleInputChange,
    handleSelect,
    handleKeyUp,
    handleFocus,
  } = useInput({
    value,
    isCommon,
    control,
    formatValue,
    isTrimStart,
    onChange,
    isCustomPassword,
    className,
    externalValue,
    styleType,
    name,
    toggleButtonRef,
    isFormatNumberWithSeparator,
    upperCase,
    lowerCase,
    maxLength,
    allowWhitespace,
    cx,
    disabled,
    onError,
    externalRef,
  });

  return (
    <div className={classes}>
      <input
        id={id}
        className={cx("input", inputClassName, {
          [inputErrClassName]:
            !isCommon && fieldState.error && inputErrClassName,
          [inputValidClassName]:
            !isCommon && !fieldState.error && inputValidClassName,
        })}
        type={isCustomPassword ? "text" : type}
        placeholder={placeholder}
        value={finalValue}
        autoComplete={autoComplete}
        spellCheck={spellCheck}
        disabled={disabled}
        readOnly={disabled}
        tabIndex={disabled ? -1 : undefined}
        ref={(e) => {
          if (!isCommon) {
            field.ref(e);
          }
          inputRef.current = e;
        }}
        onChange={(e) => {
          handleInputChange(e, formatValue);
        }}
        onPaste={(e) => {
          handleInputChange(e, formatValue, true);
          onPaste?.(e);
        }}
        onSelect={handleSelect}
        onMouseUp={handleSelect}
        onFocus={(e) => {
          handleFocus(e);
          onFocus?.(e);
        }}
        onKeyUp={handleKeyUp}
        onBlur={(e) => {
          onBlur?.(e);
        }}
        maxLength={maxLength}
        {...props}
      />
    </div>
  );
};

export default Input;
