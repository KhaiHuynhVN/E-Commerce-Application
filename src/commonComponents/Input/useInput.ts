/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
  type ClipboardEvent,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { useController, type FieldError } from "react-hook-form";
import type {
  UseInputParams,
  UseInputReturn,
  ProcessedValue,
} from "./Input.types";

const useInput = ({
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
  cx,
  maxLength,
  allowWhitespace,
  disabled,
  onError,
  externalRef,
}: UseInputParams): UseInputReturn => {
  const [valueState, setValueState] = useState(value);
  const [isVisible, setIsVisible] = useState(false);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [shouldUpdateSelection, setShouldUpdateSelection] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const previousValueRef = useRef("");
  const selectedLengthRef = useRef(0);
  const isExternalValueInitialized = useRef(false);

  // Helper: Check if input type supports text selection
  // setSelectionRange() không hỗ trợ input type: email, number, date, time, etc.
  const supportsTextSelection = (inputElement: HTMLInputElement): boolean => {
    return ["text", "search", "url", "tel", "password"].includes(
      inputElement.type
    );
  };
  const prevErrorRef = useRef<FieldError | null | undefined>(null);

  let field: UseInputReturn["field"] = {
    ref: () => {},
    value: "",
    onChange: () => {},
  };
  let fieldState: UseInputReturn["fieldState"] = { error: null };

  if (!isCommon && control && name) {
    const controller = useController({ name, control });
    field = controller.field;
    fieldState = controller.fieldState;
  }

  useEffect(() => {
    if (isCommon) {
      setValueState(value);
    }
  }, [value, isCommon]);

  useEffect(() => {
    if (
      !isCommon &&
      control &&
      name &&
      fieldState.error?.message !== prevErrorRef.current?.message
    ) {
      onError(name, fieldState.error);
      prevErrorRef.current = fieldState.error;
    }
  }, [fieldState.error, isCommon, control, name, onError]);

  useEffect(() => {
    // Chỉ set giá trị từ externalValue một lần khi component mount
    // hoặc khi externalValue thay đổi và chưa được khởi tạo
    if (
      !isCommon &&
      control &&
      externalValue &&
      !isExternalValueInitialized.current
    ) {
      const formattedValue = formatValue(externalValue);
      field.onChange(isTrimStart ? formattedValue.trimStart() : formattedValue);
      isExternalValueInitialized.current = true;
    }
  }, [externalValue, control, isCommon, formatValue, isTrimStart, field]);

  // Reset flag khi externalValue thay đổi
  useEffect(() => {
    if (externalValue) {
      isExternalValueInitialized.current = false;
    }
  }, [externalValue]);

  useEffect(() => {
    if (isCustomPassword && inputRef.current && shouldUpdateSelection) {
      if (supportsTextSelection(inputRef.current)) {
        inputRef.current.setSelectionRange(selection.start, selection.end);
      }
    }
  }, [isCustomPassword, selection, shouldUpdateSelection]);

  const togglePasswordVisibility = useCallback(() => {
    if (disabled || !isCustomPassword) return;
    setIsVisible((prev) => !prev);
  }, [isCustomPassword, disabled]);

  useEffect(() => {
    if (toggleButtonRef && toggleButtonRef.current) {
      toggleButtonRef.current.onclick = togglePasswordVisibility;
    }
  }, [toggleButtonRef, togglePasswordVisibility]);

  useEffect(() => {
    if (disabled && inputRef.current) {
      // Ngăn chặn việc focus vào input khi disabled
      inputRef.current.blur();
    }
  }, [disabled]);

  // Thêm effect để đồng bộ inputRef với externalRef
  useEffect(() => {
    if (externalRef && inputRef.current) {
      if (typeof externalRef === "function") {
        externalRef(inputRef.current);
      } else if (typeof externalRef === "object") {
        externalRef.current = inputRef.current;
      }
    }
  }, [externalRef]);

  const classes = cx("wrapper", className, { [styleType]: styleType });

  const transformCase = (value: string): string => {
    if (upperCase) return value.toUpperCase();
    if (lowerCase) return value.toLowerCase();
    return value;
  };

  const processValue = (
    value: string,
    cursorPosition: number
  ): ProcessedValue => {
    let processedValue = value;
    let newCursorPosition = cursorPosition;

    // Xử lý khoảng trắng nếu không cho phép
    if (!allowWhitespace) {
      const beforeCursor = value.slice(0, cursorPosition);
      const whitespaceBeforeCursor = beforeCursor.match(/\s/g)?.length || 0;
      processedValue = processedValue.replace(/\s/g, "");
      newCursorPosition = cursorPosition - whitespaceBeforeCursor;
    }

    // Xử lý case transform (không ảnh hưởng đến vị trí con trỏ)
    processedValue = transformCase(processedValue);

    // Xử lý maxLength
    if (maxLength && processedValue.length > maxLength) {
      processedValue = processedValue.slice(0, maxLength);
      newCursorPosition = Math.min(newCursorPosition, maxLength);
    }

    return {
      value: processedValue,
      cursorPosition: newCursorPosition,
    };
  };

  const handleCustomPasswordInput = (
    e: SyntheticEvent<HTMLInputElement> | ClipboardEvent<HTMLInputElement>,
    dataProcessor: (value: string) => string,
    isPaste: boolean = false
  ): void => {
    const target = e.target as HTMLInputElement;
    const { value, selectionStart, selectionEnd } = target;
    const start = selectionStart ?? 0;
    const end = selectionEnd ?? 0;
    const currentValue = isCommon ? valueState : field.value;
    let newValue;
    let newCursorPosition;

    if (!isVisible) {
      if (isPaste) {
        e.preventDefault();
        const clipboardEvent = e as ClipboardEvent<HTMLInputElement>;
        const pastedData = clipboardEvent.clipboardData.getData("text");
        const tempValue =
          currentValue.slice(0, start) + pastedData + currentValue.slice(end);
        newValue = processValue(tempValue, start + pastedData.length);
        newCursorPosition = Math.min(
          start + pastedData.length,
          newValue.value.length
        );
      } else {
        const diff = value.length - currentValue.length;
        if (diff > 0) {
          newValue =
            currentValue.slice(0, start - 1) +
            value.slice(start - 1, start) +
            currentValue.slice(start - 1);
          newCursorPosition = start;
        } else if (diff < 0) {
          const valueReplace = value.replace(/•/g, "");
          const valueIndex = value.indexOf(valueReplace);
          if (valueReplace) {
            newValue =
              currentValue.slice(0, valueIndex) +
              valueReplace +
              currentValue.slice(valueIndex + selectedLengthRef.current);
            newCursorPosition = valueIndex + valueReplace.length;
          } else {
            const deleteStart = start;
            const deleteEnd = start - diff;
            newValue =
              currentValue.slice(0, deleteStart) +
              currentValue.slice(deleteEnd);
            newCursorPosition = deleteStart;
          }
        } else {
          newValue =
            currentValue.slice(0, start - 1) +
            value.slice(start - 1, start) +
            currentValue.slice(start);
          newCursorPosition = start;
        }
      }
    } else {
      newValue = processValue(value, start);
      newCursorPosition = Math.min(start, newValue.value.length);
    }

    if (newValue) {
      if (typeof newValue === "string") {
        newValue = processValue(newValue, newCursorPosition);
      }
      const finalValue =
        typeof newValue === "string" ? newValue : newValue.value;
      newCursorPosition = Math.min(newCursorPosition, finalValue.length);
    }

    const finalNewValue =
      typeof newValue === "string" ? newValue : newValue.value;
    const processedValue = isTrimStart
      ? dataProcessor(finalNewValue).trimStart()
      : dataProcessor(finalNewValue);

    if (isCommon) {
      setValueState(processedValue);
      onChange(processedValue);
    } else {
      field.onChange(processedValue);
    }

    requestAnimationFrame(() => {
      setSelection({ start: newCursorPosition, end: newCursorPosition });
      if (inputRef.current && supportsTextSelection(inputRef.current)) {
        inputRef.current.setSelectionRange(
          newCursorPosition,
          newCursorPosition
        );
      }
    });

    previousValueRef.current = isVisible
      ? processedValue
      : "•".repeat(processedValue.length);
  };

  const handleNormalInput = (
    e: SyntheticEvent<HTMLInputElement> | ClipboardEvent<HTMLInputElement>,
    dataProcessor: (value: string) => string,
    isPaste: boolean = false
  ): void => {
    if (isFormatNumberWithSeparator) {
      const target = e.target as HTMLInputElement;
      let { value } = target;
      const { selectionStart } = target;
      let start = selectionStart ?? 0;

      if (isPaste) {
        e.preventDefault();
        const clipboardEvent = e as ClipboardEvent<HTMLInputElement>;
        const pastedData = clipboardEvent.clipboardData.getData("text");
        const { selectionStart: pasteStart, selectionEnd } = target;
        const newValue =
          target.value.slice(0, pasteStart ?? 0) +
          pastedData +
          target.value.slice(selectionEnd ?? 0);

        const processed = processValue(
          newValue,
          (pasteStart ?? 0) + pastedData.length
        );
        value = processed.value;
        start = processed.cursorPosition;
      } else {
        const processed = processValue(value, start);
        value = processed.value;
        start = processed.cursorPosition;
      }

      const processedValue = isTrimStart
        ? dataProcessor(value).trimStart()
        : dataProcessor(value);

      // Logic xử lý đặc biệt cho format số
      const beforeSeparatorCount =
        target.value.slice(0, start).split(isFormatNumberWithSeparator).length -
        1;
      const afterSeparatorCount =
        processedValue.slice(0, start).split(isFormatNumberWithSeparator)
          .length - 1;
      const newCursorPosition =
        start + (afterSeparatorCount - beforeSeparatorCount);

      if (isCommon) {
        setValueState(processedValue);
        onChange(processedValue);
      } else {
        field.onChange(processedValue);
      }

      requestAnimationFrame(() => {
        if (inputRef.current && supportsTextSelection(inputRef.current)) {
          inputRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition
          );
        }
      });
    } else {
      const target = e.target as HTMLInputElement;
      const { selectionStart } = target;
      const processed = processValue(target.value, selectionStart ?? 0);
      const beforeDataProcessor = processed.value;
      const processedValue = isTrimStart
        ? dataProcessor(processed.value).trimStart()
        : dataProcessor(processed.value);

      // Tính toán lại vị trí con trỏ nếu dataProcessor thay đổi độ dài chuỗi
      let newCursorPosition = processed.cursorPosition;
      if (beforeDataProcessor !== processedValue) {
        // dataProcessor đã thay đổi giá trị, cần điều chỉnh vị trí con trỏ
        // Đếm số ký tự không phải chữ/số trước con trỏ trong cả 2 giá trị
        const beforeCount = beforeDataProcessor
          .slice(0, processed.cursorPosition)
          .replace(/[a-zA-Z0-9]/g, "").length;
        const afterCount = processedValue
          .slice(
            0,
            processed.cursorPosition +
              (processedValue.length - beforeDataProcessor.length)
          )
          .replace(/[a-zA-Z0-9]/g, "").length;
        newCursorPosition =
          processed.cursorPosition + (afterCount - beforeCount);
      }

      if (isCommon) {
        setValueState(processedValue);
        onChange(processedValue);
      } else {
        field.onChange(processedValue);
      }

      requestAnimationFrame(() => {
        if (inputRef.current && supportsTextSelection(inputRef.current)) {
          inputRef.current.setSelectionRange(
            newCursorPosition,
            newCursorPosition
          );
        }
      });
    }
  };

  const handleInputChange = (
    e: SyntheticEvent<HTMLInputElement> | ClipboardEvent<HTMLInputElement>,
    dataProcessor: (value: string) => string,
    isPaste: boolean = false
  ): void => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (isCustomPassword) {
      handleCustomPasswordInput(e, dataProcessor, isPaste);
    } else {
      handleNormalInput(e, dataProcessor, isPaste);
    }
  };

  const handleSelect = (e: SyntheticEvent<HTMLInputElement>): void => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      if (inputRef.current) {
        if (supportsTextSelection(inputRef.current)) {
          inputRef.current.setSelectionRange(0, 0);
        }
        inputRef.current.blur();
      }
      return;
    }

    if (isCustomPassword) {
      const target = e.target as HTMLInputElement;
      const start = target.selectionStart ?? 0;
      const end = target.selectionEnd ?? 0;
      const selectedText = target.value.substring(start, end);
      const selectedLength = selectedText.length;

      selectedLengthRef.current = selectedLength;
      setSelection({ start, end });
      setShouldUpdateSelection(false);
    }
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (isCustomPassword) {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        setShouldUpdateSelection(true); // Cho phép cập nhật sau khi phím được thả ra
      }
    }
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
      if (inputRef.current) {
        inputRef.current.blur();
      }
      return;
    }
  };

  const finalValue =
    isCustomPassword && !isVisible
      ? "•".repeat((isCommon ? valueState : field.value).length)
      : isCommon
      ? valueState
      : field.value;

  return {
    classes,
    finalValue,
    field,
    fieldState,
    inputRef,
    handleInputChange,
    handleSelect,
    handleKeyUp,
    handleFocus,
  };
};

export default useInput;
