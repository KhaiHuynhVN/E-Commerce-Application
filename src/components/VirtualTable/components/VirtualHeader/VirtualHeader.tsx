import { memo } from "react";

import type { VirtualHeaderProps } from "../../VirtualTable.types";

/**
 * Custom comparison function cho VirtualHeader memo
 *
 * So sánh props để quyết định có cần re-render không.
 * Auto-detect tất cả props thay đổi.
 */
function virtualHeaderPropsAreEqual<TCellKeys extends string = string>(
  prevProps: Readonly<VirtualHeaderProps<TCellKeys>>,
  nextProps: Readonly<VirtualHeaderProps<TCellKeys>>
): boolean {
  // Auto-detect và so sánh TẤT CẢ props
  const propsToCheck = Object.keys(
    nextProps
  ) as (keyof VirtualHeaderProps<TCellKeys>)[];

  for (const propKey of propsToCheck) {
    if (prevProps[propKey] !== nextProps[propKey]) {
      // console.log(`🔴 Header ${String(propKey)} thay đổi`);
      return false;
    }
  }

  return true;
}

/**
 * VirtualHeader - Memoized header component cho VirtualTable
 *
 * Component này wrap tất cả header cells.
 * React.memo với custom comparison ngăn re-render không cần thiết.
 *
 * @param props - VirtualHeaderProps
 */
function VirtualHeaderInner<TCellKeys extends string = string>({
  processedCells,
  headerCells,
  cellExtraProps,
  totalRecords,
  visibleRecords,
  visibleStartIndex,
  visibleEndIndex,
  handleHeaderCellClick,
  cx,
}: VirtualHeaderProps<TCellKeys>): React.ReactElement {
  return (
    <>
      {processedCells.map((cell) => {
        const HeaderComponent:
          | React.ComponentType<Record<string, unknown>>
          | undefined = headerCells[cell.key];

        // Header extra props
        const headerExtraPropsMapper = cellExtraProps.header?.[cell.key];
        const headerExtraProps =
          headerExtraPropsMapper && typeof headerExtraPropsMapper === "function"
            ? headerExtraPropsMapper() || {}
            : {};

        return HeaderComponent ? (
          <HeaderComponent
            key={cell.key}
            {...headerExtraProps}
            // Essentials - CANNOT be overridden (props order protection)
            cellKey={cell.key}
            totalRecords={totalRecords}
            visibleRecords={visibleRecords}
            visibleStartIndex={visibleStartIndex}
            visibleEndIndex={visibleEndIndex}
            className={cx("table-header-cell")}
            onClick={handleHeaderCellClick}
          />
        ) : (
          <div key={cell.key} className={cx("table-header-cell")}>
            {cell.key.charAt(0).toUpperCase() + cell.key.slice(1)}
          </div>
        );
      })}
    </>
  );
}

// Type assertion để preserve generic trong memo
const VirtualHeader = memo(
  VirtualHeaderInner,
  virtualHeaderPropsAreEqual as <TCellKeys extends string>(
    prevProps: Readonly<VirtualHeaderProps<TCellKeys>>,
    nextProps: Readonly<VirtualHeaderProps<TCellKeys>>
  ) => boolean
) as typeof VirtualHeaderInner & { displayName?: string };

VirtualHeader.displayName = "VirtualHeader";

export default VirtualHeader;
