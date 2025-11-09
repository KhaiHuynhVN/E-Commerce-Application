/**
 * Cell base props configuration
 *
 * Định nghĩa các props chuẩn mà VirtualRow truyền cho TẤT CẢ cell components.
 * Các props này được coi là "stable" (không đổi) và bị bỏ qua trong custom comparison.
 *
 * ⚠️ QUAN TRỌNG: Nếu thêm/xóa props ở đây:
 * -> Update VirtualRow.jsx: BASE_CELL_PROPS_TEMPLATE
 */
const CELL_BASE_PROP_KEYS = [
  // ID duy nhất của row
  "rowId",
  // Index của row trong table
  "rowIndex",
  // Key định danh cell column
  "cellKey",
  // CSS class từ CSS Modules
  "className",
  // Click handler function
  "onClick",
] as const;

/**
 * Build base cell props object từ CELL_BASE_PROP_KEYS
 *
 * Helper function để construct base props object với values theo đúng order.
 *
 * ⚠️ QUAN TRỌNG: Order của arguments phải khớp với CELL_BASE_PROP_KEYS!
 *
 * Current order: rowId, rowIndex, cellKey, className, onClick
 *
 * @param values - Values cho các props theo order của CELL_BASE_PROP_KEYS
 *
 * @example
 * const props = buildBaseCellProps(
 *    row.id,              // rowId
 *    rowIndex,            // rowIndex
 *    cell.key,            // cellKey
 *    cx("table-cell"),    // className
 *    handleCellClick      // onClick
 * );
 * // Result: { rowId: 1, rowIndex: 0, cellKey: "name", className: "...", onClick: fn }
 */
const buildBaseCellProps = (...values: unknown[]): Record<string, unknown> => {
  return CELL_BASE_PROP_KEYS.reduce((obj, key, index) => {
    obj[key] = values[index];
    return obj;
  }, {} as Record<string, unknown>);
};

/**
 * Custom comparison function cho React.memo của cell components
 *
 * So sánh:
 * - rowId và cellKey (core identity)
 * - Extra props (shallow comparison)
 *
 * Bỏ qua (stable props từ CELL_BASE_PROP_KEYS)
 *
 * ⚠️ QUAN TRỌNG: Extra props sử dụng SHALLOW comparison!
 *
 * Cho nested objects/arrays:
 * ✅ NÊN: Memoize với useMemo/useCallback
 * ❌ TRÁNH: Tạo new objects/arrays mỗi lần render
 *
 * @example
 * // ❌ SAI
 * cellExtraProps.body.name = (row) => ({ config: { nested: 'x' } });
 *
 * // ✅ ĐÚNG
 * const config = useMemo(() => ({ nested: 'x' }), [deps]);
 * cellExtraProps.body.name = (row) => ({ config });
 *
 * @param prevProps - Props trước đó
 * @param nextProps - Props mới
 */
const cellPropsAreEqual = (
  prevProps: Record<string, unknown>,
  nextProps: Record<string, unknown>
): boolean => {
  // Kiểm tra core identity
  if (
    prevProps.rowId !== nextProps.rowId ||
    prevProps.cellKey !== nextProps.cellKey
  ) {
    return false;
  }

  // Auto-detect và so sánh extra props
  const extraKeys = Object.keys(nextProps).filter(
    (k) => !(CELL_BASE_PROP_KEYS as readonly string[]).includes(k)
  );

  for (const key of extraKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Header cell base props configuration
 *
 * Định nghĩa các props chuẩn mà VirtualHeader truyền cho TẤT CẢ header cell components.
 * Các props này được coi là "stable" và bị bỏ qua trong custom comparison.
 */
const HEADER_BASE_PROP_KEYS = [
  "cellKey",
  "className",
  "onClick",
  "totalRecords",
  "visibleRecords",
  "visibleStartIndex",
  "visibleEndIndex",
] as const;

/**
 * Custom comparison function cho React.memo của header cell components
 *
 * So sánh:
 * - cellKey (core identity)
 * - Extra props (shallow comparison)
 *
 * Bỏ qua (stable props từ HEADER_BASE_PROP_KEYS)
 *
 * @param prevProps - Props trước đó
 * @param nextProps - Props mới
 */
const headerCellPropsAreEqual = (
  prevProps: Record<string, unknown>,
  nextProps: Record<string, unknown>
): boolean => {
  // Kiểm tra core identity
  if (prevProps.cellKey !== nextProps.cellKey) {
    return false;
  }

  // Auto-detect và so sánh extra props
  const extraKeys = Object.keys(nextProps).filter(
    (k) => !(HEADER_BASE_PROP_KEYS as readonly string[]).includes(k)
  );

  for (const key of extraKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Footer cell base props configuration
 *
 * Định nghĩa các props chuẩn mà VirtualFooter truyền cho TẤT CẢ footer cell components.
 * Các props này được coi là "stable" và bị bỏ qua trong custom comparison.
 */
const FOOTER_BASE_PROP_KEYS = [
  "cellKey",
  "className",
  "onClick",
  "totalRecords",
  "visibleRecords",
  "visibleStartIndex",
  "visibleEndIndex",
] as const;

/**
 * Custom comparison function cho React.memo của footer cell components
 *
 * So sánh:
 * - cellKey (core identity)
 * - Extra props (shallow comparison)
 *
 * Bỏ qua (stable props từ FOOTER_BASE_PROP_KEYS)
 *
 * @param prevProps - Props trước đó
 * @param nextProps - Props mới
 */
const footerCellPropsAreEqual = (
  prevProps: Record<string, unknown>,
  nextProps: Record<string, unknown>
): boolean => {
  // Kiểm tra core identity
  if (prevProps.cellKey !== nextProps.cellKey) {
    return false;
  }

  // Auto-detect và so sánh extra props
  const extraKeys = Object.keys(nextProps).filter(
    (k) => !(FOOTER_BASE_PROP_KEYS as readonly string[]).includes(k)
  );

  for (const key of extraKeys) {
    if (prevProps[key] !== nextProps[key]) {
      return false;
    }
  }

  return true;
};

/**
 * Default scrollbar configuration
 *
 * Định nghĩa default values cho scrollbar configs của VirtualTable.
 * Matches default values từ VirtualScrollbar và HorizontalScrollbar components.
 *
 * Benefits:
 * - Single source of truth cho defaults
 * - Stable reference (created once)
 * - No object re-creation mỗi render
 * - Safe for dependency arrays
 *
 * @type {Object}
 * @property {Object} vertical - Vertical scrollbar config
 * @property {number} vertical.trackWidth - Track width (default: 8px)
 * @property {number} vertical.thumbMinHeight - Minimum thumb height (default: 20px)
 * @property {string} vertical.trackColor - Track color (default: #f3f4f6)
 * @property {string} vertical.trackHoverColor - Track hover color (default: #e5e7eb)
 * @property {string} vertical.thumbColor - Thumb color (default: #9ca3af)
 * @property {string} vertical.thumbHoverColor - Thumb hover color (default: #6b7280)
 * @property {string} vertical.thumbDraggingColor - Thumb dragging color (default: #4b5563)
 * @property {Object} horizontal - Horizontal scrollbar config
 * @property {number} horizontal.trackHeight - Track height (default: 8px)
 * @property {number} horizontal.thumbMinWidth - Minimum thumb width (default: 20px)
 * @property {string} horizontal.trackColor - Track color (default: #f3f4f6)
 * @property {string} horizontal.trackHoverColor - Track hover color (default: #e5e7eb)
 * @property {string} horizontal.thumbColor - Thumb color (default: #9ca3af)
 * @property {string} horizontal.thumbHoverColor - Thumb hover color (default: #6b7280)
 * @property {string} horizontal.thumbDraggingColor - Thumb dragging color (default: #4b5563)
 */
const DEFAULT_SCROLLBAR_CONFIG = {
  vertical: {
    trackWidth: 8,
    thumbMinHeight: 20,
    trackColor: "#f3f4f6",
    trackHoverColor: "#e5e7eb",
    thumbColor: "#9ca3af",
    thumbHoverColor: "#6b7280",
    thumbDraggingColor: "#4b5563",
  },
  horizontal: {
    trackHeight: 8,
    thumbMinWidth: 20,
    trackColor: "#f3f4f6",
    trackHoverColor: "#e5e7eb",
    thumbColor: "#9ca3af",
    thumbHoverColor: "#6b7280",
    thumbDraggingColor: "#4b5563",
  },
} as const;

/**
 * Default border configuration
 *
 * Định nghĩa default values cho border configs của VirtualTable.
 * Cho phép customize border width và color cho từng phần: header, body, footer.
 *
 * @type {Object}
 * @property {Object} header - Header borders
 * @property {Object} header.bottom - Border dưới header
 * @property {number} header.bottom.width - Border width (default: 1px)
 * @property {string} header.bottom.color - Border color (default: #e1e5e9)
 * @property {Object} header.cell - Border giữa các header cells
 * @property {number} header.cell.width - Border width (default: 1px)
 * @property {string} header.cell.color - Border color (default: #e1e5e9)
 * @property {Object} body - Body borders
 * @property {Object} body.row - Border giữa các rows
 * @property {number} body.row.width - Border width (default: 1px)
 * @property {string} body.row.color - Border color (default: #e1e5e9)
 * @property {Object} body.cell - Border giữa các body cells
 * @property {number} body.cell.width - Border width (default: 1px)
 * @property {string} body.cell.color - Border color (default: #e1e5e9)
 * @property {Object} footer - Footer borders
 * @property {Object} footer.top - Border trên footer
 * @property {number} footer.top.width - Border width (default: 1px)
 * @property {string} footer.top.color - Border color (default: #e1e5e9)
 * @property {Object} footer.cell - Border giữa các footer cells
 * @property {number} footer.cell.width - Border width (default: 1px)
 * @property {string} footer.cell.color - Border color (default: #e1e5e9)
 */
const DEFAULT_BORDER_CONFIG = {
  header: {
    bottom: {
      width: 1,
      color: "#e1e5e9",
    },
    cell: {
      width: 1,
      color: "#e1e5e9",
    },
  },
  body: {
    row: {
      width: 1,
      color: "#e1e5e9",
    },
    cell: {
      width: 1,
      color: "#e1e5e9",
    },
  },
  footer: {
    top: {
      width: 1,
      color: "#e1e5e9",
    },
    cell: {
      width: 1,
      color: "#e1e5e9",
    },
  },
} as const;

export {
  CELL_BASE_PROP_KEYS,
  buildBaseCellProps,
  cellPropsAreEqual,
  HEADER_BASE_PROP_KEYS,
  headerCellPropsAreEqual,
  FOOTER_BASE_PROP_KEYS,
  footerCellPropsAreEqual,
  DEFAULT_SCROLLBAR_CONFIG,
  DEFAULT_BORDER_CONFIG,
};
