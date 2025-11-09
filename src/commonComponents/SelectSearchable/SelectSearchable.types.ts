import type { ReactNode } from "react";

/**
 * Extra data structure trong mỗi option
 */
export interface SelectOptionData {
  custom?: boolean;
  [key: string]: unknown;
}

/**
 * Option item interface cho Select
 */
export interface SelectOption {
  label: string | ReactNode;
  value: string | number;
  data?: SelectOptionData;
}

/**
 * Props interface cho SelectSearchable component
 */
export interface SelectSearchableProps {
  /** CSS class cho container */
  className?: string;

  /** Danh sách các options */
  options: SelectOption[];

  /** Trạng thái đã tải dữ liệu hay chưa */
  dataLoaded: boolean;

  /** Giá trị đã chọn (string/number hoặc array nếu multiple=true) */
  value?: string | number | (string | number)[];

  /** Callback khi giá trị thay đổi */
  onChange?: (
    value: string | number | (string | number)[],
    option: SelectOption | SelectOption[]
  ) => void;

  /** Callback khi bỏ chọn một giá trị (chỉ áp dụng khi multiple=true) */
  onDeselect?: (value: string | number, option: SelectOption) => void;

  /** Trạng thái lỗi - khi true sẽ hiển thị border màu đỏ */
  error?: boolean;

  /** Hiển thị placeholder options khi dataLoaded=false */
  showOptionsPlaceholder?: boolean;

  /** Placeholder cho select */
  placeholder?: string;

  /** Số lượng options placeholder khi dataLoaded=false */
  placeholderLength?: number;

  /** Cho phép chọn nhiều giá trị */
  multiple?: boolean;

  /** Chiều rộng cố định của dropdown (px) */
  dropdownWidth?: number;

  /** Cho phép tìm kiếm */
  searchable?: boolean;

  /** Cho phép tạo option tùy chỉnh từ giá trị nhập vào */
  allowCustomValue?: boolean;

  /** Dữ liệu bổ sung khi tạo custom option */
  customDataValue?: Record<string, unknown>;

  /** Danh sách các giá trị bị loại trừ khỏi kết quả tìm kiếm */
  excludeValues?: (string | number)[];

  /** Các className tùy chỉnh cho từng option */
  customOptionClassNames?: Record<string | number, string>;

  /** Các giá trị luôn hiển thị ngay cả khi dataLoaded=false */
  alwaysShowValues?: (string | number)[];

  /** Hàm tùy chỉnh render cho item đã chọn */
  selectedItemRender?: ((option: SelectOption) => ReactNode) | null;

  /** Hàm tùy chỉnh render cho options trong dropdown */
  /** Custom renderer cho mỗi option (nhận option và giá trị search hiện tại) */
  optionRenderer?:
    | ((option: SelectOption, searchValue: string) => ReactNode)
    | null;

  /** Tự động điều chỉnh chiều rộng dropdown theo nội dung */
  autoWidth?: boolean;

  /** Chiều rộng tối thiểu khi autoWidth=true (px) */
  minDropdownWidth?: number;

  /** Chiều rộng tối đa khi autoWidth=true (px) */
  maxDropdownWidth?: number;

  /** Vị trí hiển thị dropdown */
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

  /** Điều chỉnh vị trí dropdown */
  dropdownAlign?: { offset: [number, number] };

  /** Class cho dropdown */
  dropdownClassName?: string;

  /** Key cho tooltip data */
  dataTooltipKey?: string;

  /** Class khi không có lỗi */
  validClassName?: string;

  /** Class khi có lỗi */
  invalidClassName?: string;

  /** Class cho select */
  selectClassName?: string;

  /** Kích thước font cho select item */
  selectItemFontSize?: string;

  /** Font weight cho select item */
  selectItemFontWeight?: string;

  /** Trạng thái disabled */
  disabled?: boolean;

  /** Icon cho item đã chọn */
  selectedIcon?: ReactNode;
}
