import { memo, useCallback } from "react";

import type { VirtualRowProps, RowData } from "../../VirtualTable.types";
import { buildBaseCellProps } from "../../utils";

/**
 * Custom comparison function cho VirtualRow memo
 *
 * So sánh row by identity (row.id) thay vì reference (row object).
 * Cells tự handle re-render khi data thay đổi (qua Redux selectors).
 * VirtualRow chỉ cần re-render khi row identity hoặc position thay đổi.
 *
 * @param prevProps - Props trước đó
 * @param nextProps - Props mới
 */
function virtualRowPropsAreEqual<TCellKeys extends string = string>(
  prevProps: Readonly<VirtualRowProps<TCellKeys>>,
  nextProps: Readonly<VirtualRowProps<TCellKeys>>
): boolean {
  // Debug logging chỉ cho row 0
  const isShouldLog = false;
  const index = 0;
  const rowIndex = nextProps.rowIndex === index;

  // So sánh row identity (không phải row object reference!)
  if (prevProps.row.id !== nextProps.row.id) {
    void (
      isShouldLog &&
      rowIndex &&
      console.log(
        "🔴 Row ID thay đổi:",
        prevProps.row.id,
        "→",
        nextProps.row.id
      )
    );
    return false;
  }
  if (prevProps.rowIndex !== nextProps.rowIndex) {
    void (
      isShouldLog &&
      rowIndex &&
      console.log(
        "🔴 Row Index thay đổi:",
        prevProps.rowIndex,
        "→",
        nextProps.rowIndex
      )
    );
    return false;
  }

  // Auto-detect và so sánh TẤT CẢ props khác (skip props đã handle ở trên)
  const skipProps: (keyof VirtualRowProps<TCellKeys>)[] = ["row", "rowIndex"];
  const propsToCheck = (
    Object.keys(nextProps) as (keyof VirtualRowProps<TCellKeys>)[]
  ).filter((key) => !skipProps.includes(key));

  for (const propKey of propsToCheck) {
    if (prevProps[propKey] !== nextProps[propKey]) {
      void (
        isShouldLog &&
        rowIndex &&
        console.log(`🔴 ${String(propKey)} thay đổi`)
      );
      return false;
    }
  }

  // Kiểm tra row object reference (cho debugging)
  if (prevProps.row !== nextProps.row) {
    void (
      isShouldLog &&
      rowIndex &&
      console.log(
        "⚠️ Row object reference thay đổi (nhưng ID giống nhau - expected behavior)"
      )
    );
  }

  return true;
}

/**
 * VirtualRow - Memoized row component cho VirtualTable
 *
 * Component này wrap một row và tất cả cells của nó.
 * React.memo với custom comparison ngăn re-render khi row identity không đổi.
 *
 * @param props - VirtualRowProps
 */
function VirtualRowInner<TCellKeys extends string = string>({
  row,
  rowIndex,
  rowHeight,
  processedCells,
  cellExtraProps,
  totalRecords,
  visibleRecords,
  visibleStartIndex,
  visibleEndIndex,
  handleRowClickEvent,
  handleCellClickEvent,
  cx,
}: VirtualRowProps<TCellKeys>): React.ReactElement {
  // Handler cấp row với closure - Hỗ trợ truyền thêm params tùy chọn từ cell
  const handleCellClick = useCallback(
    (cellKey: TCellKeys, ...extraParams: unknown[]): void => {
      const cellData = row[cellKey];
      handleCellClickEvent(cellKey, cellData, row, rowIndex, ...extraParams);
    },
    [handleCellClickEvent, row, rowIndex]
  );

  return (
    <div
      className={cx("table-row")}
      data-index={rowIndex}
      data-visible-index={rowIndex}
      style={{ height: rowHeight }}
      onClick={() => handleRowClickEvent(row, rowIndex)}
    >
      {processedCells.map((cell) => {
        const CellComponent: React.ComponentType<Record<string, unknown>> =
          cell.component;

        // Extra props từ configuration
        const bodyExtraPropsMapper = cellExtraProps.body?.[cell.key];
        const extraProps =
          bodyExtraPropsMapper && typeof bodyExtraPropsMapper === "function"
            ? bodyExtraPropsMapper(row as RowData, rowIndex) || {}
            : {};

        return CellComponent ? (
          (() => {
            // Build base cell props từ CELL_BASE_PROP_KEYS
            // Order: rowId, rowIndex, cellKey, className, onClick
            const baseCellProps = buildBaseCellProps(
              // rowId
              row.id,
              // rowIndex
              rowIndex,
              // cellKey
              cell.key,
              // className
              cx("table-cell"),
              // onClick
              handleCellClick
            );

            return (
              <CellComponent
                key={`${rowIndex}-${cell.key}`}
                {...extraProps}
                // Base props override extraProps (đảm bảo không bị ghi đè)
                {...baseCellProps}
                // Visible data props (optional, for advanced use cases)
                totalRecords={totalRecords}
                visibleRecords={visibleRecords}
                visibleStartIndex={visibleStartIndex}
                visibleEndIndex={visibleEndIndex}
              />
            );
          })()
        ) : (
          <div
            key={`${rowIndex}-${cell.key}`}
            className={cx("table-cell")}
            onClick={() => handleCellClick(cell.key)}
          >
            <span>{(row[cell.key] as string) || ""}</span>
          </div>
        );
      })}
    </div>
  );
}

// Type assertion để preserve generic trong memo
const VirtualRow = memo(
  VirtualRowInner,
  virtualRowPropsAreEqual as <TCellKeys extends string>(
    prevProps: Readonly<VirtualRowProps<TCellKeys>>,
    nextProps: Readonly<VirtualRowProps<TCellKeys>>
  ) => boolean
) as typeof VirtualRowInner & { displayName?: string };

VirtualRow.displayName = "VirtualRow";

export default VirtualRow;
