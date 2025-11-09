import { memo } from "react";

import type { VirtualFooterProps } from "../../VirtualTable.types";

/**
 * Custom comparison function cho VirtualFooter memo
 *
 * So sánh props để quyết định có cần re-render không.
 * Auto-detect tất cả props thay đổi.
 */
function virtualFooterPropsAreEqual<TCellKeys extends string = string>(
  prevProps: Readonly<VirtualFooterProps<TCellKeys>>,
  nextProps: Readonly<VirtualFooterProps<TCellKeys>>
): boolean {
  // Auto-detect và so sánh TẤT CẢ props
  const propsToCheck = Object.keys(
    nextProps
  ) as (keyof VirtualFooterProps<TCellKeys>)[];

  for (const propKey of propsToCheck) {
    if (prevProps[propKey] !== nextProps[propKey]) {
      // console.log(`🔴 Footer ${String(propKey)} thay đổi`);
      return false;
    }
  }

  return true;
}

/**
 * VirtualFooter - Memoized footer component cho VirtualTable
 *
 * Component này wrap tất cả footer cells.
 * React.memo với custom comparison ngăn re-render không cần thiết.
 *
 * ⚠️ Footer cells nên fetch data từ Redux thay vì depend vào data prop
 *
 * @param props - VirtualFooterProps
 */
function VirtualFooterInner<TCellKeys extends string = string>({
  processedCells,
  footerCells,
  cellExtraProps,
  totalRecords,
  visibleRecords,
  visibleStartIndex,
  visibleEndIndex,
  handleFooterCellClick,
  cx,
}: VirtualFooterProps<TCellKeys>): React.ReactElement {
  return (
    <>
      {processedCells.map((cell) => {
        const FooterComponent:
          | React.ComponentType<Record<string, unknown>>
          | undefined = footerCells[cell.key];

        // Footer extra props
        const footerExtraPropsMapper = cellExtraProps.footer?.[cell.key];
        const footerExtraProps =
          footerExtraPropsMapper && typeof footerExtraPropsMapper === "function"
            ? footerExtraPropsMapper(totalRecords, visibleRecords) || {}
            : {};

        return FooterComponent ? (
          <FooterComponent
            key={cell.key}
            {...footerExtraProps}
            // Essentials - CANNOT be overridden (props order protection)
            cellKey={cell.key}
            totalRecords={totalRecords}
            visibleRecords={visibleRecords}
            visibleStartIndex={visibleStartIndex}
            visibleEndIndex={visibleEndIndex}
            className={cx("table-footer-cell")}
            onClick={handleFooterCellClick}
          />
        ) : (
          <div key={cell.key} className={cx("table-footer-cell")}>
            <span></span>
          </div>
        );
      })}
    </>
  );
}

// Type assertion để preserve generic trong memo
const VirtualFooter = memo(
  VirtualFooterInner,
  virtualFooterPropsAreEqual as <TCellKeys extends string>(
    prevProps: Readonly<VirtualFooterProps<TCellKeys>>,
    nextProps: Readonly<VirtualFooterProps<TCellKeys>>
  ) => boolean
) as typeof VirtualFooterInner & { displayName?: string };

VirtualFooter.displayName = "VirtualFooter";

export default VirtualFooter;
