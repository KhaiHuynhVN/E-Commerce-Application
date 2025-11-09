import React from "react";

// =====================================================
// IMPORTS - Import types từ classnames/bind
// =====================================================

/**
 * Type cho classNames.bind() function
 * Compatible với classnames/bind library
 */
type Argument =
  | string
  | number
  | Record<string, unknown>
  | null
  | boolean
  | undefined;
type ArgumentArray = Array<Argument>;
type ClassNameBindingFunction = (...args: ArgumentArray) => string;

/**
 * Scroll behavior cho scrollTo()
 * Compatible với DOM ScrollBehavior
 */
type ScrollBehavior = "auto" | "smooth";

// =====================================================
// CELL EXTRA PROPS TYPES - Các type cho extra props mappers
// =====================================================

/**
 * Mapper function cho body cell extra props
 * @param row - Dữ liệu của dòng
 * @param rowIndex - Index của dòng trong bảng
 * @returns Object chứa extra props cho cell
 */
type BodyCellExtraPropsMapper = (
  row: Record<string, unknown>,
  rowIndex: number
) => Record<string, unknown>;

/**
 * Mapper function cho header cell extra props
 * @returns Object chứa extra props cho header cell
 */
type HeaderCellExtraPropsMapper = () => Record<string, unknown>;

/**
 * Mapper function cho footer cell extra props
 * @param totalRecords - Tổng số records
 * @param visibleRecords - Số records đang hiển thị
 * @returns Object chứa extra props cho footer cell
 */
type FooterCellExtraPropsMapper = (
  totalRecords: number,
  visibleRecords: number
) => Record<string, unknown>;

/**
 * Cấu hình extra props cho các cells (generic với cell keys)
 */
interface CellExtraPropsConfig<TCellKeys extends string = string> {
  /** Body cell extra props mappers indexed by cell key */
  body?: Partial<Record<TCellKeys, BodyCellExtraPropsMapper>>;
  /** Header cell extra props mappers indexed by cell key */
  header?: Partial<Record<TCellKeys, HeaderCellExtraPropsMapper>>;
  /** Footer cell extra props mappers indexed by cell key */
  footer?: Partial<Record<TCellKeys, FooterCellExtraPropsMapper>>;
}

// =====================================================
// SCROLLBAR CONFIG TYPES - Cấu hình thanh cuộn
// =====================================================

/**
 * Cấu hình cho thanh cuộn dọc
 */
interface VerticalScrollbarConfig {
  /** Chiều rộng track thanh cuộn dọc (pixels) */
  trackWidth: number;
  /** Chiều cao tối thiểu thumb thanh cuộn dọc (pixels) */
  thumbMinHeight: number;
  /** Màu track thanh cuộn dọc (CSS color) */
  trackColor: string;
  /** Màu track thanh cuộn dọc khi hover (CSS color) */
  trackHoverColor: string;
  /** Màu thumb thanh cuộn dọc (CSS color) */
  thumbColor: string;
  /** Màu thumb thanh cuộn dọc khi hover (CSS color) */
  thumbHoverColor: string;
  /** Màu thumb thanh cuộn dọc khi đang kéo (CSS color) */
  thumbDraggingColor: string;
}

/**
 * Cấu hình cho thanh cuộn ngang
 */
interface HorizontalScrollbarConfig {
  /** Chiều cao track thanh cuộn ngang (pixels) */
  trackHeight: number;
  /** Chiều rộng tối thiểu thumb thanh cuộn ngang (pixels) */
  thumbMinWidth: number;
  /** Màu track thanh cuộn ngang (CSS color) */
  trackColor: string;
  /** Màu track thanh cuộn ngang khi hover (CSS color) */
  trackHoverColor: string;
  /** Màu thumb thanh cuộn ngang (CSS color) */
  thumbColor: string;
  /** Màu thumb thanh cuộn ngang khi hover (CSS color) */
  thumbHoverColor: string;
  /** Màu thumb thanh cuộn ngang khi đang kéo (CSS color) */
  thumbDraggingColor: string;
}

/**
 * Cấu hình tổng cho scrollbars (vertical và horizontal)
 */
interface ScrollbarConfig {
  /** Cấu hình thanh cuộn dọc */
  vertical: VerticalScrollbarConfig;
  /** Cấu hình thanh cuộn ngang */
  horizontal: HorizontalScrollbarConfig;
}

// =====================================================
// BORDER CONFIG TYPES - Cấu hình viền
// =====================================================

/**
 * Cấu hình viền cho một phần của bảng
 */
interface BorderStyle {
  /** Độ rộng viền (pixels) */
  width: number;
  /** Màu viền (CSS color) */
  color: string;
}

/**
 * Cấu hình viền cho header
 */
interface HeaderBorderConfig {
  /** Viền bottom của header */
  bottom: BorderStyle;
  /** Viền giữa các cells trong header */
  cell: BorderStyle;
}

/**
 * Cấu hình viền cho body
 */
interface BodyBorderConfig {
  /** Viền giữa các rows trong body */
  row: BorderStyle;
  /** Viền giữa các cells trong body */
  cell: BorderStyle;
}

/**
 * Cấu hình viền cho footer
 */
interface FooterBorderConfig {
  /** Viền top của footer */
  top: BorderStyle;
  /** Viền giữa các cells trong footer */
  cell: BorderStyle;
}

/**
 * Cấu hình tổng cho borders
 */
interface BorderConfig {
  /** Cấu hình viền cho header */
  header: HeaderBorderConfig;
  /** Cấu hình viền cho body */
  body: BodyBorderConfig;
  /** Cấu hình viền cho footer */
  footer: FooterBorderConfig;
}

// =====================================================
// PROCESSED CELL TYPE - Cell đã được xử lý
// =====================================================

/**
 * Cell đã được xử lý với component và visibility
 */
interface ProcessedCell<TCellKeys extends string = string> {
  /** Key của cell (tên cột) */
  key: TCellKeys;
  /** React component cho cell */
  component: React.ComponentType<unknown>;
  /** Cell có đang hiển thị hay không */
  isVisible: boolean;
}

// =====================================================
// VISIBLE RANGE TYPE - Phạm vi hiển thị
// =====================================================

/**
 * Phạm vi các dòng đang hiển thị
 */
interface VisibleRange {
  /** Index bắt đầu */
  startIndex: number;
  /** Index kết thúc */
  endIndex: number;
}

// =====================================================
// BORDER STYLES TYPE - Inline CSS styles cho borders
// =====================================================

/**
 * CSS variables cho border configuration
 */
interface BorderStyles {
  "--border-header-bottom-width": string;
  "--border-header-bottom-color": string;
  "--border-header-cell-width": string;
  "--border-header-cell-color": string;
  "--border-body-row-width": string;
  "--border-body-row-color": string;
  "--border-body-cell-width": string;
  "--border-body-cell-color": string;
  "--border-footer-top-width": string;
  "--border-footer-top-color": string;
  "--border-footer-cell-width": string;
  "--border-footer-cell-color": string;
}

// =====================================================
// HOOK PROPS & RETURN TYPES - Props và return value của useVirtualTable
// =====================================================

/**
 * Props cho useVirtualTable hook (generic với cell keys)
 */
interface UseVirtualTableProps<TCellKeys extends string = string> {
  /** Mảng các object dữ liệu đại diện cho các dòng trong bảng */
  data: Array<Record<string, unknown>>;
  /** Chiều cao container bảng (number: pixels, "auto": detect parent) */
  height: number | "auto";
  /** Chiều cao cố định của mỗi dòng tính bằng pixels */
  rowHeight: number;
  /** Số rows buffer render thêm ở mỗi phía (trên và dưới) viewport */
  overscanCount?: number;
  /** Optional ref của parent element cho auto height detection */
  parentRef?: React.RefObject<HTMLElement> | HTMLElement | null;
  /** Fixed số rows visible trong body (body height không đổi) */
  visibleRows?: number;
  /** Min số rows visible trong body (dynamic mode) */
  minVisibleRows?: number;
  /** Max số rows visible trong body (dynamic mode) */
  maxVisibleRows?: number;
  /** Object ánh xạ từ data keys sang body cell components */
  cellComponents?: Record<TCellKeys, React.ComponentType<unknown>>;
  /** Thứ tự các cột */
  cellOrder?: TCellKeys[];
  /** Keys của các cột hiển thị */
  visibleCells?: TCellKeys[];
  /** Object ánh xạ từ data keys sang header cell components */
  headerCells?: Record<TCellKeys, React.ComponentType<unknown>>;
  /** Object ánh xạ từ data keys sang footer cell components */
  footerCells?: Record<TCellKeys, React.ComponentType<unknown>>;
  /** Cấu hình cho scrollbars (vertical và horizontal) */
  scrollbarConfig?: ScrollbarConfig;
  /** Cấu hình cho borders */
  borderConfig?: BorderConfig;
  /** Enable auto-hide scrollbars khi không activity */
  autoHideScrollbars?: boolean;
  /** Thời gian delay trước khi fade scrollbars (ms) */
  scrollbarFadeDelay?: number;
  /** Opacity khi scrollbars hidden */
  scrollbarHiddenOpacity?: number;
  /** Opacity khi scrollbars visible */
  scrollbarVisibleOpacity?: number;
  /** Callback được gọi khi click vào dòng */
  onRowClick?:
    | ((rowData: Record<string, unknown>, rowIndex: number) => void)
    | null;
  /** Callback được gọi khi click vào cell */
  onCellClick?:
    | ((
        cellKey: string,
        cellData: unknown,
        rowData: Record<string, unknown>,
        rowIndex: number,
        ...extraParams: unknown[]
      ) => void)
    | null;
  /** Callback được gọi khi click vào header cell */
  onHeaderCellClick?:
    | ((cellKey: string, ...extraParams: unknown[]) => void)
    | null;
  /** Callback được gọi khi click vào footer cell */
  onFooterCellClick?:
    | ((cellKey: string, ...extraParams: unknown[]) => void)
    | null;
}

/**
 * Return value của useVirtualTable hook
 */
interface UseVirtualTableReturn {
  /** Ref cho container element */
  containerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref cho table container element */
  tableContainerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref cho wrapper element */
  wrapperRef: React.RefObject<HTMLDivElement | null>;
  /** Phạm vi các dòng đang hiển thị */
  visibleRange: VisibleRange;
  /** Tổng chiều cao của tất cả rows */
  totalHeight: number;
  /** Dữ liệu của các dòng đang hiển thị */
  visibleData: Array<Record<string, unknown>>;
  /** Handler cho scroll event */
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  /** Processed cells với component và visibility */
  processedCells: ProcessedCell[];
  /** Scroll position hiện tại */
  scrollTop: number;
  /** Ref cho header element */
  headerRef: React.RefObject<HTMLDivElement | null>;
  /** Ref cho footer element */
  footerRef: React.RefObject<HTMLDivElement | null>;
  /** Chiều cao của header */
  headerHeight: number;
  /** Chiều cao của footer */
  footerHeight: number;
  /** Chiều cao của body */
  bodyHeight: number;
  /** Chiều cao effective của toàn bộ table */
  effectiveHeight: number;
  /** Handler cho row click */
  handleRowClick: (rowData: Record<string, unknown>, rowIndex: number) => void;
  /** Handler cho row click event từ VirtualRow */
  handleRowClickEvent: (row: Record<string, unknown>, rowIndex: number) => void;
  /** Handler cho cell click */
  handleCellClick: (
    cellKey: string,
    cellData: unknown,
    rowData: Record<string, unknown>,
    rowIndex: number,
    ...extraParams: unknown[]
  ) => void;
  /** Handler cho cell click event từ VirtualRow */
  handleCellClickEvent: (
    cellKey: string,
    cellData: unknown,
    row: Record<string, unknown>,
    rowIndex: number,
    ...extraParams: unknown[]
  ) => void;
  /** Handler cho header cell click */
  handleHeaderCellClick: (cellKey: string, ...extraParams: unknown[]) => void;
  /** Handler cho footer cell click */
  handleFooterCellClick: (cellKey: string, ...extraParams: unknown[]) => void;
  /** Handler cho virtual scroll (vertical) */
  handleVirtualScroll: (
    newScrollTop: number,
    behavior?: ScrollBehavior
  ) => void;
  /** Handler cho horizontal scroll */
  handleHorizontalScroll: (
    newScrollLeft: number,
    behavior?: ScrollBehavior
  ) => void;
  /** Vertical scrollbar config */
  verticalConfig: VerticalScrollbarConfig;
  /** Horizontal scrollbar config */
  horizontalConfig: HorizontalScrollbarConfig;
  /** Scrollbar opacity (dựa trên auto-hide setting) */
  scrollbarOpacity: number;
  /** Trigger activity cho auto-hide scrollbars */
  triggerActivity: () => void;
  /** Style cho vertical scrollbar */
  verticalScrollbarStyle: { top: number };
  /** Style cho horizontal scrollbar */
  horizontalScrollbarStyle: { bottom: number };
  /** Chiều rộng của vertical scrollbar */
  verticalScrollbarWidth: number;
  /** Chiều cao của horizontal scrollbar */
  horizontalScrollbarHeight: number;
  /** Adjusted vertical scrollbar height */
  adjustedVerticalScrollbarHeight: number;
  /** Final vertical scrollbar height (sau khi adjust cho corner) */
  finalVerticalScrollbarHeight: number;
  /** Final horizontal scrollbar width (sau khi adjust cho corner) */
  finalHorizontalScrollbarWidth: number;
  /** Scrollbar info từ useScrollbarDetection */
  scrollbarInfo: {
    hasVerticalScrollbar: boolean;
    hasHorizontalScrollbar: boolean;
    verticalScrollbarWidth: number;
    horizontalScrollbarHeight: number;
    scrollLeft: number;
    scrollTop: number;
    scrollWidth: number;
    scrollHeight: number;
    clientWidth: number;
    clientHeight: number;
  };
  /** Border styles (CSS variables) */
  borderStyles: BorderStyles;
}

// =====================================================
// COMPONENT PROPS - Props cho VirtualTable component
// =====================================================

/**
 * Props cho VirtualTable component (generic với cell keys)
 */
interface VirtualTableProps<TCellKeys extends string = string> {
  /** Mảng các object dữ liệu để hiển thị */
  data?: Array<Record<string, unknown>>;
  /** Object ánh xạ từ data keys sang các React component cho body cells */
  cellComponents?: Record<TCellKeys, React.ComponentType<unknown>>;
  /** Mảng định nghĩa thứ tự hiển thị các cột */
  cellOrder?: TCellKeys[];
  /** Mảng các keys của cells cần hiển thị */
  visibleCells?: TCellKeys[];
  /** Extra props configuration for body/header/footer cells */
  cellExtraProps?: CellExtraPropsConfig<TCellKeys>;
  /** Object ánh xạ từ data keys sang các React component cho header cells */
  headerCells?: Record<TCellKeys, React.ComponentType<unknown>>;
  /** Object ánh xạ từ data keys sang các React component cho footer cells */
  footerCells?: Record<TCellKeys, React.ComponentType<unknown>>;
  /** Chiều cao của container bảng (number: pixels, "auto": detect parent) */
  height?: number | "auto";
  /** Optional ref của parent element cho auto height detection */
  parentRef?: React.RefObject<HTMLElement> | HTMLElement | null;
  /** Fixed số rows visible trong body */
  visibleRows?: number;
  /** Min số rows visible trong body (dynamic mode) */
  minVisibleRows?: number;
  /** Max số rows visible trong body (dynamic mode) */
  maxVisibleRows?: number;
  /** Chiều cao cố định của mỗi dòng tính bằng pixels */
  rowHeight?: number;
  /** Số rows buffer render thêm ở trên và dưới viewport */
  overscanCount?: number;
  /** CSS class name bổ sung cho wrapper element */
  className?: string;
  /** Inline styles bổ sung cho wrapper element */
  style?: React.CSSProperties;
  /** Cấu hình cho thanh cuộn ảo (vertical và horizontal) */
  scrollbarConfig?: ScrollbarConfig;
  /** Cấu hình cho borders */
  borderConfig?: BorderConfig;
  /** Enable auto-hide scrollbars khi không có activity */
  autoHideScrollbars?: boolean;
  /** Thời gian delay trước khi fade scrollbars (milliseconds) */
  scrollbarFadeDelay?: number;
  /** Opacity khi scrollbars ở trạng thái hidden */
  scrollbarHiddenOpacity?: number;
  /** Opacity khi scrollbars ở trạng thái visible */
  scrollbarVisibleOpacity?: number;
  /** Callback được gọi khi click vào dòng */
  onRowClick?:
    | ((rowData: Record<string, unknown>, rowIndex: number) => void)
    | null;
  /** Callback được gọi khi click vào body cell */
  onCellClick?:
    | ((
        cellKey: string,
        cellData: unknown,
        rowData: Record<string, unknown>,
        rowIndex: number,
        ...extraParams: unknown[]
      ) => void)
    | null;
  /** Callback được gọi khi click vào header cell */
  onHeaderCellClick?:
    | ((cellKey: string, ...extraParams: unknown[]) => void)
    | null;
  /** Callback được gọi khi click vào footer cell */
  onFooterCellClick?:
    | ((cellKey: string, ...extraParams: unknown[]) => void)
    | null;
}

// =====================================================
// CHILD COMPONENT TYPES - Types cho các child components
// =====================================================

// ----- VirtualRow Types -----
/** Row data object */
interface RowData {
  /** ID của row (optional) */
  id?: string | number;
  /** Dynamic properties */
  [key: string]: unknown;
}

/** Props cho VirtualRow component */
interface VirtualRowProps<TCellKeys extends string = string> {
  /** Row data object */
  row: RowData;
  /** Global row index trong table */
  rowIndex: number;
  /** Fixed height cho row này (pixels) */
  rowHeight: number;
  /** Array của cell configurations { key, component } */
  processedCells: ProcessedCell<TCellKeys>[];
  /** Extra props configuration { body: {...} } */
  cellExtraProps: CellExtraPropsConfig<TCellKeys>;
  /** Tổng số records (optional) */
  totalRecords?: number;
  /** Số records đang hiển thị (optional) */
  visibleRecords?: number;
  /** Start index của visible range (optional) */
  visibleStartIndex?: number;
  /** End index của visible range (optional) */
  visibleEndIndex?: number;
  /** Row click handler (memoized) */
  handleRowClickEvent: (row: RowData, rowIndex: number) => void;
  /** Cell click handler (memoized) */
  handleCellClickEvent: (
    cellKey: TCellKeys,
    cellData: unknown,
    row: RowData,
    rowIndex: number,
    ...extraParams: unknown[]
  ) => void;
  /** ClassNames binding function từ parent */
  cx: ClassNameBindingFunction;
}

// ----- VirtualHeader Types -----
/** Header cells mapping */
type HeaderCellsMap<TCellKeys extends string = string> = Record<
  TCellKeys,
  React.ComponentType<Record<string, unknown>>
>;

/** Props cho VirtualHeader component */
interface VirtualHeaderProps<TCellKeys extends string = string> {
  /** Array của cell configurations { key, component } */
  processedCells: ProcessedCell<TCellKeys>[];
  /** Object ánh xạ cellKey → HeaderComponent */
  headerCells: HeaderCellsMap<TCellKeys>;
  /** Extra props configuration */
  cellExtraProps: CellExtraPropsConfig<TCellKeys>;
  /** Tổng số records (optional) */
  totalRecords?: number;
  /** Số records đang hiển thị (optional) */
  visibleRecords?: number;
  /** Start index của visible range (optional) */
  visibleStartIndex?: number;
  /** End index của visible range (optional) */
  visibleEndIndex?: number;
  /** Header click handler (memoized) */
  handleHeaderCellClick: (cellKey: TCellKeys) => void;
  /** ClassNames binding function từ parent */
  cx: ClassNameBindingFunction;
}

// ----- VirtualFooter Types -----
/** Footer cells mapping */
type FooterCellsMap<TCellKeys extends string = string> = Record<
  TCellKeys,
  React.ComponentType<Record<string, unknown>>
>;

/** Props cho VirtualFooter component */
interface VirtualFooterProps<TCellKeys extends string = string> {
  /** Array của cell configurations { key, component } */
  processedCells: ProcessedCell<TCellKeys>[];
  /** Object ánh xạ cellKey → FooterComponent */
  footerCells: FooterCellsMap<TCellKeys>;
  /** Extra props configuration */
  cellExtraProps: CellExtraPropsConfig<TCellKeys>;
  /** Tổng số records (primitive) */
  totalRecords: number;
  /** Số records đang hiển thị (primitive) */
  visibleRecords: number;
  /** Start index của visible range (optional) */
  visibleStartIndex?: number;
  /** End index của visible range (optional) */
  visibleEndIndex?: number;
  /** Footer click handler (memoized) */
  handleFooterCellClick: (cellKey: TCellKeys) => void;
  /** ClassNames binding function từ parent */
  cx: ClassNameBindingFunction;
}

// ----- VirtualScrollbar Types -----
/** Props cho useVirtualScrollbar hook */
interface UseVirtualScrollbarProps {
  /** Chiều cao của viewport (vùng hiển thị) */
  height: number;
  /** Tổng chiều cao của content có thể cuộn */
  totalHeight: number;
  /** Chiều cao tối thiểu của thumb */
  thumbMinHeight: number;
  /** Vị trí scroll dọc hiện tại */
  scrollTop: number;
  /** Callback khi scroll thay đổi */
  onScroll: (newScrollTop: number, behavior?: ScrollBehavior) => void;
  /** Chiều cao thực tế của track */
  trackHeight?: number;
}

/** Return value của useVirtualScrollbar hook */
interface UseVirtualScrollbarReturn {
  /** Ref cho track element */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Handler khi click vào track */
  handleTrackClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Ref cho thumb element */
  thumbRef: React.RefObject<HTMLDivElement | null>;
  /** Trạng thái đang kéo thumb */
  isDragging: boolean;
  /** Chiều cao tính toán của thumb */
  thumbHeight: number;
  /** Vị trí top của thumb */
  thumbTop: number;
  /** Handler khi nhấn chuột vào thumb */
  handleThumbMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Có cần hiển thị scrollbar không */
  showScrollbar: boolean;
}

/** Props cho VirtualScrollbar component */
interface VirtualScrollbarProps {
  /** Chiều cao của viewport */
  height: number;
  /** Tổng chiều cao của content */
  totalHeight: number;
  /** Vị trí scroll dọc hiện tại */
  scrollTop: number;
  /** Callback được gọi khi scroll thay đổi */
  onScroll: (newScrollTop: number, behavior?: ScrollBehavior) => void;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Chiều rộng của track */
  trackWidth?: number;
  /** Chiều cao thực tế của track */
  trackHeight?: number;
  /** Chiều cao tối thiểu của thumb */
  thumbMinHeight?: number;
  /** Màu của track */
  trackColor?: string;
  /** Màu của track khi hover */
  trackHoverColor?: string;
  /** Màu của thumb */
  thumbColor?: string;
  /** Màu của thumb khi hover */
  thumbHoverColor?: string;
  /** Màu của thumb khi đang kéo */
  thumbDraggingColor?: string;
  /** Opacity của scrollbar */
  opacity?: number;
}

// ----- HorizontalScrollbar Types -----
/** Props cho useHorizontalScrollbar hook */
interface UseHorizontalScrollbarProps {
  /** Vị trí scroll ngang hiện tại */
  scrollLeft: number;
  /** Tổng chiều rộng có thể cuộn */
  scrollWidth: number;
  /** Chiều rộng viewport */
  clientWidth: number;
  /** Callback khi scroll thay đổi */
  onScroll: (newScrollLeft: number, behavior?: ScrollBehavior) => void;
  /** Chiều rộng tối thiểu của thumb */
  thumbMinWidth: number;
  /** Chiều rộng tùy chỉnh cho track */
  trackWidth?: number;
}

/** Return value của useHorizontalScrollbar hook */
interface UseHorizontalScrollbarReturn {
  /** Ref cho track element */
  trackRef: React.RefObject<HTMLDivElement | null>;
  /** Ref cho thumb element */
  thumbRef: React.RefObject<HTMLDivElement | null>;
  /** Trạng thái đang kéo thumb */
  isDragging: boolean;
  /** Handler khi nhấn chuột vào thumb */
  handleThumbMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Handler khi click vào track */
  handleTrackClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  /** Chiều rộng tính toán của thumb */
  thumbWidth: number;
  /** Vị trí left của thumb */
  thumbLeft: number;
  /** Có cần hiển thị scrollbar không */
  showScrollbar: boolean;
}

/** Props cho HorizontalScrollbar component */
interface HorizontalScrollbarProps {
  /** Vị trí scroll ngang hiện tại */
  scrollLeft: number;
  /** Tổng chiều rộng có thể cuộn */
  scrollWidth: number;
  /** Chiều rộng viewport */
  clientWidth: number;
  /** Callback được gọi khi scroll thay đổi */
  onScroll: (newScrollLeft: number, behavior?: ScrollBehavior) => void;
  /** Chiều cao của track */
  trackHeight?: number;
  /** Chiều rộng của track */
  trackWidth?: number;
  /** Chiều rộng tối thiểu của thumb */
  thumbMinWidth?: number;
  /** Màu của track */
  trackColor?: string;
  /** Màu của track khi hover */
  trackHoverColor?: string;
  /** Màu của thumb */
  thumbColor?: string;
  /** Màu của thumb khi hover */
  thumbHoverColor?: string;
  /** Màu của thumb khi đang kéo */
  thumbDraggingColor?: string;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Opacity của scrollbar */
  opacity?: number;
}

// ----- ScrollbarCorner Types -----
/** Props cho ScrollbarCorner component */
interface ScrollbarCornerProps {
  /** Chiều rộng của corner */
  width?: number;
  /** Chiều cao của corner */
  height?: number;
  /** Màu nền của corner */
  backgroundColor?: string;
  /** Khoảng cách từ bottom */
  bottom?: number;
  /** Opacity của corner */
  opacity?: number;
  /** CSS class name */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
}

// =====================================================
// EXPORTS - Xuất tất cả các types
// =====================================================

export type {
  // Shared types
  ClassNameBindingFunction,
  ScrollBehavior,
  ProcessedCell,
  // Cell extra props mappers
  BodyCellExtraPropsMapper,
  HeaderCellExtraPropsMapper,
  FooterCellExtraPropsMapper,
  CellExtraPropsConfig,
  // Scrollbar config
  VerticalScrollbarConfig,
  HorizontalScrollbarConfig,
  ScrollbarConfig,
  // Border config
  BorderStyle,
  HeaderBorderConfig,
  BodyBorderConfig,
  FooterBorderConfig,
  BorderConfig,
  // Helper types
  VisibleRange,
  BorderStyles,
  // Main table types
  UseVirtualTableProps,
  UseVirtualTableReturn,
  VirtualTableProps,
  // Child component types - VirtualRow
  RowData,
  VirtualRowProps,
  // Child component types - VirtualHeader
  HeaderCellsMap,
  VirtualHeaderProps,
  // Child component types - VirtualFooter
  FooterCellsMap,
  VirtualFooterProps,
  // Child component types - VirtualScrollbar
  UseVirtualScrollbarProps,
  UseVirtualScrollbarReturn,
  VirtualScrollbarProps,
  // Child component types - HorizontalScrollbar
  UseHorizontalScrollbarProps,
  UseHorizontalScrollbarReturn,
  HorizontalScrollbarProps,
  // Child component types - ScrollbarCorner
  ScrollbarCornerProps,
};
