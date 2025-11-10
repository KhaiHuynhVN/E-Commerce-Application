import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
  type MouseEvent,
  type ReactNode,
  type ComponentRef,
} from "react";
import { Select } from "antd";
import classNames from "classnames/bind";

import { fuzzySearch, fuzzySearchHighlighter } from "../../utils";
import { Icons } from "../../assets";
import { createPlaceholderOptions } from "./selectSearchableDatas";
import type {
  SelectSearchableProps,
  SelectOption,
  SelectOptionData,
} from "./SelectSearchable.types";

import styles from "./SelectSearchable.module.scss";

const cx = classNames.bind(styles);

/**
 * Component select có khả năng tìm kiếm với nhiều tính năng nâng cao
 */
const SelectSearchable = ({
  className,
  options,
  dataLoaded,
  value,
  onChange = () => {},
  onDeselect = () => {},
  error,
  showOptionsPlaceholder = true,
  placeholder = "Select...",
  placeholderLength = 8,
  multiple = false,
  dropdownWidth = 200,
  searchable = true,
  allowCustomValue = false,
  customDataValue = {},
  excludeValues = [],
  customOptionClassNames = {},
  alwaysShowValues = [],
  selectedItemRender = null,
  optionRenderer = null,
  autoWidth = false,
  minDropdownWidth = 150,
  maxDropdownWidth = 500,
  placement = "bottomRight",
  dropdownAlign = { offset: [9, 5] },
  dropdownClassName = "",
  dataTooltipKey = "",
  validClassName = "!border-thirteenth-color",
  invalidClassName = "!border-forty-second-color",
  selectClassName = "",
  selectItemFontSize = "var(--fs-quaternary)",
  selectItemFontWeight = "var(--fw-quaternary)",
  disabled = false,
  selectedIcon = (
    <Icons.CheckedIcon
      className={cx("text-white-color")}
      width="14"
      height="14"
    />
  ),
}: SelectSearchableProps) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectSearchValue, setSelectSearchValue] = useState("");
  const [customOptions, setCustomOptions] = useState<SelectOption[]>(options);
  const [dynamicOption, setDynamicOption] = useState<SelectOption | null>(null);
  const [calculatedDropdownWidth, setCalculatedDropdownWidth] =
    useState(dropdownWidth);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectRef = useRef<ComponentRef<typeof Select>>(null);
  const selectWrapperRef = useRef<HTMLDivElement>(null);
  const optionsMeasureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomOptions(options);
  }, [options]);

  useEffect(() => {
    if (dataTooltipKey && dropdownRef.current) {
      dropdownRef.current.setAttribute("data-tooltip-key", dataTooltipKey);

      const children = dropdownRef.current.querySelectorAll("*");
      children.forEach((child) => {
        child.setAttribute("data-tooltip-key", dataTooltipKey);
      });

      if (dropdownRef.current.parentElement) {
        dropdownRef.current.parentElement.setAttribute(
          "data-tooltip-key",
          dataTooltipKey
        );
      }
    }
  }, [dataTooltipKey, isSelectOpen]);

  const finalOptions = useMemo(() => {
    if (!dataLoaded && showOptionsPlaceholder) {
      // Tạo options placeholder
      const placeholderOptions = createPlaceholderOptions(placeholderLength);

      // Lọc các tùy chọn luôn hiển thị từ customOptions
      const priorityOptions = customOptions.filter((opt) =>
        alwaysShowValues.includes(opt.value)
      );

      return [...priorityOptions, ...placeholderOptions];
    }

    // Nếu có dynamicOption, thêm vào cuối danh sách
    if (dynamicOption) {
      return [...customOptions, dynamicOption];
    }

    // Nếu không có dynamicOption, trả về customOptions
    return customOptions;
  }, [
    customOptions,
    dynamicOption,
    dataLoaded,
    showOptionsPlaceholder,
    placeholderLength,
    alwaysShowValues,
  ]);

  // Đo lường chiều rộng của options và cập nhật calculatedDropdownWidth
  const measureOptionsWidth = useCallback(() => {
    if (!autoWidth || !isSelectOpen) return;

    // Tạo một div tạm thời để đo lường chiều rộng tối đa của các tùy chọn
    const measureContainer = document.createElement("div");
    measureContainer.style.position = "absolute";
    measureContainer.style.visibility = "hidden";
    measureContainer.style.whiteSpace = "nowrap";
    document.body.appendChild(measureContainer);

    // Đo lường chiều rộng tối đa của các tùy chọn
    let maxWidth = minDropdownWidth;
    finalOptions.forEach((option) => {
      // Chuyển đổi label thành string để đo lường, bỏ qua nếu không thể chuyển đổi
      if (
        typeof option.label === "string" ||
        typeof option.label === "number"
      ) {
        measureContainer.textContent = String(option.label);
        const optionWidth = measureContainer.offsetWidth;
        maxWidth = Math.max(maxWidth, optionWidth);
      }
    });

    // Giới hạn chiều rộng tối đa
    maxWidth = Math.min(maxWidth, maxDropdownWidth);

    // Cập nhật calculatedDropdownWidth
    setCalculatedDropdownWidth(maxWidth);

    // Xóa div tạm thời
    document.body.removeChild(measureContainer);
  }, [
    autoWidth,
    isSelectOpen,
    finalOptions,
    minDropdownWidth,
    maxDropdownWidth,
  ]);

  useEffect(() => {
    if (isSelectOpen && autoWidth) {
      measureOptionsWidth();
    }
  }, [isSelectOpen, autoWidth, customOptions, measureOptionsWidth]);

  const handleVisibilityChange = (visible: boolean): void => {
    if (disabled) return;

    setIsSelectOpen(visible);
    if (!visible) {
      setSelectSearchValue("");
      setDynamicOption(null);
    }
  };

  const filterOption = (input: string, option: SelectOption): boolean => {
    if (input && excludeValues.includes(option.value)) {
      return false;
    }
    // Cho phép các giá trị trong alwaysShowValues hiển thị ngay cả khi dataLoaded=false
    return dataLoaded
      ? fuzzySearch(input, String(option.label ?? ""))
      : alwaysShowValues.includes(option.value);
  };

  const fuzzySortOptions = useMemo(() => {
    // Hàm tính điểm phù hợp cho một nhãn dựa trên các từ tìm kiếm
    const getMatchScore = (label: string, words: Set<string>): number => {
      let score = 0;
      for (const word of words) {
        // Nếu nhãn bắt đầu bằng từ tìm kiếm, cộng 3 điểm
        if (label.startsWith(word)) {
          score += 3;
          // Nếu nhãn chứa từ tìm kiếm, cộng 2 điểm
        } else if (label.includes(word)) {
          score += 2;
        } else {
          // Kiểm tra điều kiện độ dài và thực hiện tìm kiếm mờ
          const fuzzyMatch = word.length > 2 && fuzzySearch(word, label);

          // Nếu có khớp mờ, cộng 1 điểm
          if (fuzzyMatch) {
            score += 1;
          }
        }
      }
      return score;
    };

    // Trả về hàm so sánh để sắp xếp các tùy chọn
    return (
      optionA: SelectOption,
      optionB: SelectOption,
      inputValue: string
    ): number => {
      // Nếu không có giá trị nhập vào hoặc data chưa tải xong, không sắp xếp
      if (!inputValue.trim() || !dataLoaded) return 0;

      // Chuẩn bị dữ liệu cho so sánh
      const input = inputValue.toLowerCase();
      const words = new Set(input.split(/\s+/));
      const labelA = String(optionA.label ?? "").toLowerCase();
      const labelB = String(optionB.label ?? "").toLowerCase();

      // Tính điểm cho mỗi tùy chọn
      const scoreA = getMatchScore(labelA, words);
      const scoreB = getMatchScore(labelB, words);

      // So sánh điểm, ưu tiên điểm cao hơn
      if (scoreA !== scoreB) return scoreB - scoreA;

      // Nếu điểm bằng nhau, so sánh vị trí xuất hiện của từ tìm kiếm trong nhãn
      for (const word of words) {
        const indexA = labelA.indexOf(word);
        const indexB = labelB.indexOf(word);
        if (indexA !== indexB) {
          return indexA - indexB;
        }
      }

      // Nếu vẫn bằng nhau, ưu tiên nhãn ngắn hơn hoặc sắp xếp theo bảng chữ cái
      return labelA.length - labelB.length || labelA.localeCompare(labelB);
    };
  }, [dataLoaded]);

  const handleToggleStockSelect = (e: MouseEvent<HTMLDivElement>): void => {
    if (disabled) return;

    if (
      selectWrapperRef.current &&
      selectWrapperRef.current.contains(e.target as Node)
    ) {
      selectRef.current?.focus();
      setIsSelectOpen(true);
    }
  };

  const optionRender = (option: SelectOption): ReactNode => {
    // Cho phép các giá trị trong alwaysShowValues hiển thị bình thường ngay cả khi dataLoaded=false
    if (!dataLoaded && !alwaysShowValues.includes(option.value))
      return option.label;

    // Sử dụng hàm render tùy chỉnh nếu được cung cấp
    if (optionRenderer) {
      return optionRenderer(option, selectSearchValue);
    }

    // Kiểm tra xem option có cần className tùy chỉnh không
    const customClassName = customOptionClassNames[option.value] || "";

    return (
      <div
        className={cx(
          "text-ellipsis whitespace-nowrap overflow-hidden",
          customClassName
        )}
        dangerouslySetInnerHTML={{
          __html: fuzzySearchHighlighter(
            String(option.label ?? ""),
            selectSearchValue
          ),
        }}
      />
    );
  };

  const onBlurHandle = () => {
    if (disabled) return;

    if (selectSearchValue.trim() && allowCustomValue) {
      // Tìm option đã tồn tại (match chính xác cả chữ hoa/thường)
      const existingOption = customOptions.find(
        (opt) => opt.label === selectSearchValue.trim()
      );

      if (existingOption) {
        // Nếu đã tồn tại và match chính xác, chọn option đó
        onChange(existingOption.value, existingOption);
      } else if (dynamicOption) {
        // Nếu có dynamicOption, thêm vào options và chọn
        setCustomOptions((prev) => [...prev, dynamicOption]);
        onChange(dynamicOption.value, dynamicOption);
      }
    }

    setDynamicOption(null);
    setSelectSearchValue("");
  };

  const onSearchHandle = (value: string): void => {
    if (disabled) return;

    const trimmedValue = value.trimStart();
    setSelectSearchValue(trimmedValue);

    if (trimmedValue && allowCustomValue) {
      const exactMatch = customOptions.find(
        (opt) => opt.label === trimmedValue
      );

      if (!exactMatch) {
        // Nếu không trùng, tạo option mới với giá trị nguyên gốc
        const newOption = {
          label: trimmedValue,
          value: trimmedValue,
          data: { custom: true, ...customDataValue },
        };
        setDynamicOption(newOption);
      } else {
        setDynamicOption(null);
      }
    } else {
      setDynamicOption(null);
    }

    if (value.trim()) setIsSelectOpen(true);
  };

  const onSelectHandle = (
    value: string | number | (string | number)[],
    option: SelectOption | SelectOption[]
  ): void => {
    if (disabled) return;

    // Cho phép các giá trị trong alwaysShowValues được chọn ngay cả khi dataLoaded=false
    if (!dataLoaded && !alwaysShowValues.includes(value as string | number))
      return;

    // Xử lý khi chọn tùy chọn tùy chỉnh
    if (allowCustomValue && dynamicOption && value === dynamicOption.value) {
      // Thêm dynamicOption vào customOptions
      setCustomOptions((prev) => [...prev, dynamicOption]);
      onChange?.(value, dynamicOption);
      setDynamicOption(null);
    } else {
      onChange?.(value, option);
    }

    // Chỉ đóng dropdown và reset search value khi không phải chế độ multiple
    if (!multiple) {
      setIsSelectOpen(false);
      setSelectSearchValue("");
      selectRef.current?.blur();
    } else {
      // Trong chế độ multiple, chỉ reset search value
      setSelectSearchValue("");
    }
  };

  const onDeselectHandle = (value: string | number): void => {
    if (disabled) return;

    // Cho phép bỏ chọn giá trị trong alwaysShowValues ngay cả khi dataLoaded=false
    if (!dataLoaded && !alwaysShowValues.includes(value)) return;

    // Tìm option tương ứng với value để truyền đủ thông tin cho callback
    const option = finalOptions.find((opt) => opt.value === value);
    if (option && onDeselect) {
      onDeselect(value, option);
    }
  };

  const getSelectValue = (
    fieldValue: string | number | (string | number)[] | undefined
  ): string | number | (string | number)[] | null => {
    // Kiểm tra các trường hợp null, undefined, chuỗi rỗng
    if (fieldValue === null || fieldValue === undefined || fieldValue === "") {
      return multiple ? [] : null;
    }

    // Kiểm tra trường hợp là mảng rỗng
    if (Array.isArray(fieldValue) && fieldValue.length === 0) {
      return multiple ? [] : null;
    }

    if (multiple) {
      // Đảm bảo giá trị luôn là mảng
      const value = Array.isArray(fieldValue) ? fieldValue : [fieldValue];

      // Lọc các giá trị null, undefined hoặc chuỗi rỗng
      const filteredValue = value.filter(
        (item) => item !== null && item !== undefined && item !== ""
      );

      return filteredValue.length > 0 ? filteredValue : [];
    }

    return fieldValue;
  };

  // Tạo options với thuộc tính labelRender để hiển thị giá trị đã chọn
  const optionsWithLabelRender = useMemo(() => {
    return finalOptions.map((option) => ({
      ...option,
      labelRender: selectedItemRender ? (
        // Sử dụng hàm render tùy chỉnh nếu được cung cấp
        selectedItemRender(option)
      ) : (
        // Mặc định sử dụng label với className tùy chỉnh nếu có
        <div
          className={cx(
            "text-ellipsis whitespace-nowrap overflow-hidden",
            customOptionClassNames[option.value] || ""
          )}
        >
          {option.label}
        </div>
      ),
    }));
  }, [finalOptions, selectedItemRender, customOptionClassNames]);

  // Xác định dropdownStyle dựa trên cấu hình và kích thước đã tính toán
  const getDropdownStyle = useMemo(() => {
    if (autoWidth) {
      return {
        minWidth: minDropdownWidth,
        maxWidth: maxDropdownWidth,
        width: calculatedDropdownWidth,
      };
    } else if (dropdownWidth) {
      return { width: dropdownWidth };
    }
    return {};
  }, [
    autoWidth,
    minDropdownWidth,
    maxDropdownWidth,
    dropdownWidth,
    calculatedDropdownWidth,
  ]);

  // >>>>>>>>>>Không được xóa hàm này!<<<<<<<<<<
  // Hàm này dùng trong trường hợp làm việc với Big Data, khi mỗi value search đều trả về hàng trăm kết quả khớp mờ, khi đó ta sẽ
  // giới hạn kết quả trả về sau khi đã tìm kiếm và sắp xếp.
  //
  // const limitOptions = useMemo(() => {
  //    return (options, inputValue, limit = 100) => {
  //       if (!inputValue.trim() || !dataLoaded) return options;
  //
  //       const filteredOptions = options.filter((option) => filterOption(inputValue, option));
  //       filteredOptions.sort((a, b) => fuzzySortOptions(a, b, inputValue));
  //       return filteredOptions.slice(0, limit);
  //    };
  // }, [dataLoaded, filterOption, fuzzySortOptions, selectSearchValue]);

  return (
    <div
      ref={selectWrapperRef}
      className={cx(
        className,
        "wrapper",
        "bg-quinary-color duration-primary cursor-text flex flex-[50%] items-center border border-solid rounded-[4px] px-[8px] gap-[11px]",
        {
          [validClassName]: !error,
          [invalidClassName]: error,
        }
      )}
      onClick={handleToggleStockSelect}
    >
      <Select
        ref={selectRef}
        value={getSelectValue(value)}
        searchValue={selectSearchValue}
        rootClassName={cx("select-common-component", selectClassName, {
          "select-loading": !dataLoaded,
          "multiple-select": multiple,
        })}
        style={
          {
            "--select-item-fs": selectItemFontSize,
            "--select-item-fw": selectItemFontWeight,
          } as React.CSSProperties
        }
        showSearch={searchable}
        mode={multiple ? "multiple" : undefined}
        popupRender={(menu) => (
          <div ref={dropdownRef} data-tooltip-key={dataTooltipKey || null}>
            {menu}
          </div>
        )}
        classNames={{ popup: { root: dropdownClassName } }}
        placeholder={placeholder}
        suffixIcon={
          <Icons.ChevronDownIcon
            className={cx("text-white-color")}
            width="14"
            height="14"
          />
        }
        menuItemSelectedIcon={selectedIcon}
        options={optionsWithLabelRender}
        optionLabelProp="labelRender"
        filterOption={(input, option) => {
          if (!option) return false;
          // Chuyển đổi antd option sang định dạng SelectOption
          const selectOption: SelectOption = {
            label: option.label ?? "",
            value: option.value ?? "",
            data:
              "data" in option
                ? (option.data as SelectOptionData | undefined)
                : undefined,
          };
          return filterOption(input, selectOption);
        }}
        filterSort={(optionA, optionB) =>
          fuzzySortOptions(optionA, optionB, selectSearchValue)
        }
        optionRender={(option) => {
          // Chuyển đổi antd option sang định dạng SelectOption
          const selectOption: SelectOption = {
            label: option.label ?? "",
            value: option.value ?? "",
            data:
              "data" in option
                ? (option.data as SelectOptionData | undefined)
                : undefined,
          };
          return optionRender(selectOption);
        }}
        open={isSelectOpen && !disabled}
        virtual
        placement={placement || "bottomRight"}
        styles={{ popup: { root: getDropdownStyle } }}
        dropdownAlign={dropdownAlign}
        onSearch={
          searchable && !disabled ? (value) => onSearchHandle(value) : undefined
        }
        onSelect={(value, option) => {
          // Chuyển đổi antd option sang định dạng SelectOption
          const selectOption: SelectOption = {
            label: option.label ?? "",
            value: option.value ?? "",
            data:
              "data" in option
                ? (option.data as SelectOptionData | undefined)
                : undefined,
          };
          onSelectHandle(
            value as string | number | (string | number)[],
            selectOption
          );
        }}
        onDeselect={(value) => onDeselectHandle(value as string | number)}
        onBlur={onBlurHandle}
        onOpenChange={handleVisibilityChange}
        disabled={disabled}
      />
      {/* Hidden div for measuring option width */}
      <div ref={optionsMeasureRef} className="hidden absolute invisible" />
    </div>
  );
};

export default memo(SelectSearchable);
