import React, { memo } from "react";
import classNames from "classnames/bind";

import useVirtualTable from "./useVirtualTable";
import {
  HorizontalScrollbar,
  VirtualScrollbar,
  ScrollbarCorner,
  VirtualRow,
  VirtualHeader,
  VirtualFooter,
} from "./components";
import { DEFAULT_SCROLLBAR_CONFIG, DEFAULT_BORDER_CONFIG } from "./utils";
import type {
  VirtualTableProps,
  ClassNameBindingFunction,
  CellExtraPropsConfig,
} from "./VirtualTable.types";

import styles from "./VirtualTable.module.scss";

const cx = classNames.bind(styles) as ClassNameBindingFunction;

/**
 * VirtualTable
 *
 * @component
 * @example
 * // Sử dụng với chiều cao cố định
 * <VirtualTable
 *    data={sampleData}
 *    cellComponents={{
 *       id: IdCell,
 *       name: NameCell,
 *       email: EmailCell,
 *    }}
 *    cellOrder={["id", "name", "email"]}
 *    height={600}
 *    rowHeight={60}
 * />
 *
 * @example
 * // Auto-detect chiều cao từ parent (không cần truyền height hoặc height="auto")
 * <div style={{ height: '100vh' }}>
 *    <VirtualTable
 *       data={sampleData}
 *       cellComponents={cellComponents}
 *       cellOrder={["id", "name", "email"]}
 *       rowHeight={60}
 *    />
 * </div>
 *
 * @example
 * // Sử dụng đầy đủ tính năng với custom scrollbar
 * const scrollbarConfig = useMemo(() => ({
 *    vertical: {
 *       trackWidth: 10,
 *       thumbMinHeight: 30,
 *       trackColor: "#f3f4f6",
 *       trackHoverColor: "#e5e7eb",
 *       thumbColor: "#6366f1",
 *       thumbHoverColor: "#4f46e5",
 *       thumbDraggingColor: "#4338ca"
 *    },
 *    horizontal: {
 *       trackHeight: 10,
 *       thumbMinWidth: 30,
 *       trackColor: "#f3f4f6",
 *       trackHoverColor: "#e5e7eb",
 *       thumbColor: "#6366f1",
 *       thumbHoverColor: "#4f46e5",
 *       thumbDraggingColor: "#4338ca"
 *    }
 * }), []);
 *
 * <VirtualTable
 *    data={sampleData}
 *    cellComponents={cellComponents}
 *    cellOrder={["id", "name", "email", "status", "salary", "actions"]}
 *    visibleCells={["id", "name", "email", "status", "salary", "actions"]}
 *    headerCells={headerCells}
 *    footerCells={footerCells}
 *    height={600}
 *    rowHeight={60}
 *    showDebug={true}
 *    scrollbarConfig={scrollbarConfig}
 *    onRowClick={(rowData, rowIndex) => console.log("Clicked row:", rowData)}
 *    onCellClick={(cellKey, cellData, rowData, rowIndex) => console.log("Clicked cell:", cellKey)}
 * />
 *
 * @param props - Các props của component
 * @returns VirtualTable component
 */
const VirtualTable = <TCellKeys extends string = string>({
  data = [],
  cellComponents = {} as Record<TCellKeys, React.ComponentType<unknown>>,
  cellOrder = [] as TCellKeys[],
  visibleCells = [] as TCellKeys[],
  cellExtraProps = {} as CellExtraPropsConfig<TCellKeys>,
  headerCells = {} as Record<TCellKeys, React.ComponentType<unknown>>,
  footerCells = {} as Record<TCellKeys, React.ComponentType<unknown>>,
  height = "auto",
  parentRef,
  visibleRows,
  minVisibleRows,
  maxVisibleRows,
  rowHeight = 40,
  overscanCount = 2,
  className,
  style,
  scrollbarConfig = DEFAULT_SCROLLBAR_CONFIG,
  borderConfig = DEFAULT_BORDER_CONFIG,
  autoHideScrollbars = false,
  scrollbarFadeDelay = 1500,
  scrollbarHiddenOpacity = 0.3,
  scrollbarVisibleOpacity = 1,
  onRowClick = null,
  onCellClick = null,
  onHeaderCellClick = null,
  onFooterCellClick = null,
}: VirtualTableProps<TCellKeys>): React.ReactElement => {
  const {
    containerRef,
    tableContainerRef,
    wrapperRef,
    visibleRange,
    totalHeight,
    visibleData,
    handleScroll,
    processedCells,
    scrollTop,
    headerRef,
    footerRef,
    footerHeight,
    bodyHeight,
    effectiveHeight,
    handleRowClickEvent,
    handleCellClickEvent,
    handleHeaderCellClick,
    handleFooterCellClick,
    handleVirtualScroll,
    handleHorizontalScroll,
    verticalConfig,
    horizontalConfig,
    scrollbarOpacity,
    triggerActivity,
    verticalScrollbarStyle,
    horizontalScrollbarStyle,
    horizontalScrollbarHeight,
    finalVerticalScrollbarHeight,
    finalHorizontalScrollbarWidth,
    scrollbarInfo,
    borderStyles,
  } = useVirtualTable({
    data,
    height,
    rowHeight,
    overscanCount,
    parentRef,
    visibleRows,
    minVisibleRows,
    maxVisibleRows,
    cellComponents,
    cellOrder,
    visibleCells,
    headerCells,
    footerCells,
    scrollbarConfig,
    borderConfig,
    autoHideScrollbars,
    scrollbarFadeDelay,
    scrollbarHiddenOpacity,
    scrollbarVisibleOpacity,
    onRowClick,
    onCellClick,
    onHeaderCellClick,
    onFooterCellClick,
  });

  return (
    <div
      ref={wrapperRef}
      className={cx("wrapper", className)}
      style={style}
      onMouseMove={triggerActivity}
    >
      <div
        ref={tableContainerRef}
        className={cx("table-container")}
        style={{ height: effectiveHeight, ...borderStyles }}
        onScroll={handleScroll}
      >
        {/* Header của bảng */}
        {Object.keys(headerCells).length > 0 && (
          <div ref={headerRef} className={cx("table-header")}>
            <VirtualHeader
              processedCells={processedCells}
              headerCells={headerCells}
              cellExtraProps={cellExtraProps}
              totalRecords={data.length}
              visibleRecords={visibleData.length}
              visibleStartIndex={visibleRange.startIndex}
              visibleEndIndex={visibleRange.endIndex}
              handleHeaderCellClick={handleHeaderCellClick}
              cx={cx}
            />
          </div>
        )}

        {/* Nội dung bảng với thanh cuộn ảo */}
        {/* Vùng cuộn ảo */}
        <div
          ref={containerRef}
          className={cx("table-body")}
          style={{
            // Chiều cao động dựa trên header/footer
            height: bodyHeight,
          }}
        >
          {/* Spacer ảo cho tổng chiều cao (include footer + horizontal scrollbar space for last row visibility) */}
          <div
            className={cx("body-spacer")}
            style={{
              height: totalHeight + footerHeight + horizontalScrollbarHeight,
            }}
          >
            {/* Các dòng đang hiển thị */}
            <div
              className={cx("body-rows-container")}
              style={{
                transform: `translateY(${
                  visibleRange.startIndex * rowHeight
                }px)`,
              }}
            >
              {visibleData.map((row, index) => {
                const globalRowIndex = visibleRange.startIndex + index;
                return (
                  <VirtualRow
                    key={(row.id as React.Key) || globalRowIndex}
                    row={row}
                    rowIndex={globalRowIndex}
                    rowHeight={rowHeight}
                    processedCells={processedCells}
                    cellExtraProps={cellExtraProps}
                    totalRecords={data.length}
                    visibleRecords={visibleData.length}
                    visibleStartIndex={visibleRange.startIndex}
                    visibleEndIndex={visibleRange.endIndex}
                    handleRowClickEvent={handleRowClickEvent}
                    handleCellClickEvent={handleCellClickEvent}
                    cx={cx}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Footer của bảng - Absolute positioned to wrapper (like scrollbars) */}
      {Object.keys(footerCells).length > 0 && (
        <div
          ref={footerRef}
          className={cx("table-footer")}
          style={{ top: effectiveHeight - footerHeight, ...borderStyles }}
        >
          <VirtualFooter
            processedCells={processedCells}
            footerCells={footerCells}
            cellExtraProps={cellExtraProps}
            totalRecords={data.length}
            visibleRecords={visibleData.length}
            visibleStartIndex={visibleRange.startIndex}
            visibleEndIndex={visibleRange.endIndex}
            handleFooterCellClick={handleFooterCellClick}
            cx={cx}
          />
        </div>
      )}

      {/* Thanh cuộn dọc ảo */}
      {scrollbarInfo.hasVerticalScrollbar && (
        <VirtualScrollbar
          // Chiều cao động dựa trên header/footer và horizontal scrollbar
          height={bodyHeight}
          trackHeight={finalVerticalScrollbarHeight}
          totalHeight={totalHeight}
          scrollTop={scrollTop}
          onScroll={handleVirtualScroll}
          trackWidth={verticalConfig.trackWidth}
          thumbMinHeight={verticalConfig.thumbMinHeight}
          trackColor={verticalConfig.trackColor}
          trackHoverColor={verticalConfig.trackHoverColor}
          thumbColor={verticalConfig.thumbColor}
          thumbHoverColor={verticalConfig.thumbHoverColor}
          thumbDraggingColor={verticalConfig.thumbDraggingColor}
          opacity={scrollbarOpacity}
          style={verticalScrollbarStyle}
        />
      )}

      {/* Thanh cuộn ngang ảo */}
      {scrollbarInfo.hasHorizontalScrollbar && (
        <HorizontalScrollbar
          scrollLeft={scrollbarInfo.scrollLeft}
          scrollWidth={scrollbarInfo.scrollWidth}
          clientWidth={scrollbarInfo.clientWidth}
          onScroll={handleHorizontalScroll}
          trackHeight={horizontalConfig.trackHeight}
          trackWidth={finalHorizontalScrollbarWidth}
          thumbMinWidth={horizontalConfig.thumbMinWidth}
          trackColor={horizontalConfig.trackColor}
          trackHoverColor={horizontalConfig.trackHoverColor}
          thumbColor={horizontalConfig.thumbColor}
          thumbHoverColor={horizontalConfig.thumbHoverColor}
          thumbDraggingColor={horizontalConfig.thumbDraggingColor}
          opacity={scrollbarOpacity}
          style={horizontalScrollbarStyle}
        />
      )}

      {/* Scrollbar corner - chỉ hiển thị khi có CẢ 2 scrollbars */}
      {scrollbarInfo.hasVerticalScrollbar &&
        scrollbarInfo.hasHorizontalScrollbar && (
          <ScrollbarCorner
            width={verticalConfig.trackWidth}
            height={horizontalConfig.trackHeight}
            backgroundColor={verticalConfig.trackColor}
            bottom={footerHeight}
            opacity={scrollbarOpacity}
          />
        )}
    </div>
  );
};

export default memo(VirtualTable);
