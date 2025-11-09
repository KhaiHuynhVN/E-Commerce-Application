import { useMemo, useRef, useState, useEffect, useCallback } from "react";

import { useScrollbarDetection } from "./utils";
import type {
  UseVirtualTableProps,
  UseVirtualTableReturn,
  ScrollBehavior,
} from "./VirtualTable.types";

/**
 * Hook này đóng gói toàn bộ logic cho component VirtualTable
 *
 * @param params - Tham số của hook
 * @param params.data - Mảng các object dữ liệu đại diện cho các dòng trong bảng
 * @param params.height - Chiều cao container bảng (number: pixels, "auto": detect parent)
 * @param params.rowHeight - Chiều cao cố định của mỗi dòng tính bằng pixels
 * @param params.overscanCount - Số rows buffer render thêm ở mỗi phía (trên và dưới) viewport
 * @param params.parentRef - Optional ref của parent element cho auto height detection
 * @param params.visibleRows - Fixed số rows visible trong body (body height không đổi)
 * @param params.minVisibleRows - Min số rows visible trong body (dynamic mode)
 * @param params.maxVisibleRows - Max số rows visible trong body (dynamic mode)
 * @param params.cellComponents - Object ánh xạ từ data keys sang body cell components
 * @param params.cellOrder - Thứ tự các cột. Mặc định sử dụng Object.keys(cellComponents)
 * @param params.visibleCells - Keys của các cột hiển thị. Mặc định hiển thị tất cả cells
 * @param params.headerCells - Object ánh xạ từ data keys sang header cell components
 * @param params.footerCells - Object ánh xạ từ data keys sang footer cell components
 * @param params.scrollbarConfig - Cấu hình cho scrollbars (vertical và horizontal)
 * @param params.borderConfig - Cấu hình cho borders
 * @param params.autoHideScrollbars - Enable auto-hide scrollbars khi không activity
 * @param params.scrollbarFadeDelay - Thời gian delay trước khi fade scrollbars (ms)
 * @param params.scrollbarHiddenOpacity - Opacity khi scrollbars hidden
 * @param params.scrollbarVisibleOpacity - Opacity khi scrollbars visible
 * @param params.onRowClick - Callback được gọi khi click vào dòng
 * @param params.onCellClick - Callback được gọi khi click vào cell
 * @param params.onHeaderCellClick - Callback được gọi khi click vào header cell
 * @param params.onFooterCellClick - Callback được gọi khi click vào footer cell
 * @returns Object chứa tất cả state và handlers cần thiết cho VirtualTable
 */
const useVirtualTable = <TCellKeys extends string = string>({
  data,
  height,
  rowHeight,
  overscanCount = 2,
  parentRef,
  visibleRows,
  minVisibleRows,
  maxVisibleRows,
  cellComponents = {} as Record<TCellKeys, React.ComponentType<unknown>>,
  cellOrder = [] as TCellKeys[],
  visibleCells = [] as TCellKeys[],
  headerCells = {} as Record<TCellKeys, React.ComponentType<unknown>>,
  footerCells = {} as Record<TCellKeys, React.ComponentType<unknown>>,
  scrollbarConfig = {} as UseVirtualTableProps<TCellKeys>["scrollbarConfig"],
  borderConfig = {} as UseVirtualTableProps<TCellKeys>["borderConfig"],
  autoHideScrollbars = false,
  scrollbarFadeDelay = 1500,
  scrollbarHiddenOpacity = 0.3,
  scrollbarVisibleOpacity = 1,
  onRowClick = null,
  onCellClick = null,
  onHeaderCellClick = null,
  onFooterCellClick = null,
}: UseVirtualTableProps<TCellKeys>): UseVirtualTableReturn => {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [autoDetectedHeight, setAutoDetectedHeight] = useState<number>(400);
  // State cho chiều cao header/footer động
  const [headerHeight, setHeaderHeight] = useState<number>(0);
  const [footerHeight, setFooterHeight] = useState<number>(0);
  // State cho auto-hide scrollbars
  const [isActive, setIsActive] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Detect scroll info from table-container (entire table scrolls together)
  const scrollbarInfo = useScrollbarDetection(
    tableContainerRef as React.RefObject<HTMLDivElement>
  );

  // Ref cho wrapper element (để detect parent height khi auto)
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Refs cho chiều cao header/footer động
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  // Ref cho inactivity timer
  const inactivityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tính toán effective height và body height với các modes mới
  const { effectiveHeight, bodyHeight } = useMemo(() => {
    let calculatedEffectiveHeight;
    let calculatedBodyHeight;

    // Ưu tiên 1: visibleRows mode (body height cố định)
    if (visibleRows !== undefined) {
      calculatedBodyHeight = visibleRows * rowHeight;
    }
    // Ưu tiên 2: minVisibleRows/maxVisibleRows mode (body height động)
    else if (minVisibleRows !== undefined || maxVisibleRows !== undefined) {
      const actualRows = data.length;
      let effectiveRows = actualRows;

      // Áp dụng min trước
      if (minVisibleRows !== undefined && actualRows < minVisibleRows) {
        effectiveRows = minVisibleRows;
      }

      // Sau đó áp dụng max
      if (maxVisibleRows !== undefined && effectiveRows > maxVisibleRows) {
        effectiveRows = maxVisibleRows;
      }

      calculatedBodyHeight = effectiveRows * rowHeight;
    }
    // Ưu tiên 3: Existing height prop (number hoặc "auto")
    else {
      calculatedEffectiveHeight =
        typeof height === "number" ? height : autoDetectedHeight;
      calculatedBodyHeight =
        calculatedEffectiveHeight - headerHeight - footerHeight;

      return {
        effectiveHeight: calculatedEffectiveHeight,
        bodyHeight: calculatedBodyHeight,
      };
    }

    // Áp dụng constraint: Nếu height="auto", cap body height tại parent available height
    if (height === "auto" && autoDetectedHeight > 0) {
      const parentAvailableBodyHeight =
        autoDetectedHeight - headerHeight - footerHeight;
      calculatedBodyHeight = Math.min(
        calculatedBodyHeight,
        parentAvailableBodyHeight
      );
    }

    calculatedEffectiveHeight =
      calculatedBodyHeight + headerHeight + footerHeight;
    return {
      effectiveHeight: calculatedEffectiveHeight,
      bodyHeight: calculatedBodyHeight,
    };
  }, [
    height,
    autoDetectedHeight,
    headerHeight,
    footerHeight,
    visibleRows,
    minVisibleRows,
    maxVisibleRows,
    data.length,
    rowHeight,
  ]);

  // Tính toán tổng chiều cao
  const totalHeight = useMemo(
    () => data.length * rowHeight,
    [data.length, rowHeight]
  );

  // Auto-detect parent height khi height="auto"
  useEffect(() => {
    if (height !== "auto") return;

    // Priority 1: parentRef là ref object → dùng .current
    // Priority 2: parentRef là element trực tiếp → dùng luôn
    // Priority 3: Fallback tự động detect parent element
    const targetElement =
      (parentRef && "current" in parentRef ? parentRef.current : null) ||
      (parentRef instanceof Element ? parentRef : null) ||
      wrapperRef.current?.parentElement;

    if (!targetElement) return;

    // Helper function để calculate available height
    const calculateAvailableHeight = (element: HTMLElement | null): number => {
      if (!element) return 0;

      const clientHeight = element.clientHeight;
      const computedStyle = window.getComputedStyle(element);
      const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
      const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;

      return clientHeight - paddingTop - paddingBottom;
    };

    const observer = new ResizeObserver(() => {
      const availableHeight = calculateAvailableHeight(targetElement);
      if (availableHeight > 0) {
        setAutoDetectedHeight(availableHeight);
      }
    });

    observer.observe(targetElement);

    // Initial measurement
    const initialHeight = calculateAvailableHeight(targetElement);
    if (initialHeight > 0) {
      setAutoDetectedHeight(initialHeight);
    }

    return () => observer.disconnect();
  }, [height, parentRef]);

  // Đo chiều cao header bằng ResizeObserver
  useEffect(() => {
    if (!headerRef.current) {
      setHeaderHeight(0);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setHeaderHeight(entry.contentRect.height);
      }
    });

    observer.observe(headerRef.current);
    return () => observer.disconnect();
  }, [headerCells, data]);

  // Đo chiều cao footer bằng ResizeObserver
  useEffect(() => {
    if (!footerRef.current) {
      setFooterHeight(0);
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setFooterHeight(entry.contentRect.height);
      }
    });

    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [footerCells, data]);

  // Cleanup inactivity timer on unmount
  useEffect(() => {
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Tính toán visible range với overscan (buffer rows phía trên và dưới)
  const visibleRange = useMemo(() => {
    const containerHeight = bodyHeight;
    const totalRows = data.length;

    // Tính số rows cần thiết để fill viewport
    const visibleRowsCount = Math.ceil(containerHeight / rowHeight);

    // Raw start index (không có overscan)
    const rawStartIndex = Math.floor(scrollTop / rowHeight);

    // Apply overscan: thêm buffer rows ở cả 2 phía (trên và dưới)
    const startIndex = Math.max(0, rawStartIndex - overscanCount);
    const endIndex = Math.min(
      rawStartIndex + visibleRowsCount + overscanCount,
      totalRows
    );

    return { startIndex, endIndex };
  }, [scrollTop, bodyHeight, rowHeight, data.length, overscanCount]);

  // Tính toán dữ liệu hiển thị
  const visibleData = useMemo(
    () => data.slice(visibleRange.startIndex, visibleRange.endIndex),
    [data, visibleRange.startIndex, visibleRange.endIndex]
  );

  // Trigger activity khi có mouse move hoặc scroll
  const triggerActivity = useCallback(() => {
    if (!autoHideScrollbars) return;

    setIsActive(true);

    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Set new timer để hide sau delay
    inactivityTimerRef.current = setTimeout(() => {
      setIsActive(false);
    }, scrollbarFadeDelay);
  }, [autoHideScrollbars, scrollbarFadeDelay]);

  // Xử lý sự kiện scroll (from table-container, not body)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    setScrollTop(e.currentTarget.scrollTop);
    // Sync footer horizontal scroll
    if (footerRef.current) {
      footerRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
    // Trigger activity on scroll
    triggerActivity();
  };

  // Xử lý cấu hình cell
  const processedCells = useMemo(() => {
    // Nếu có cellOrder thì sử dụng, nếu không thì dùng keys của cellComponents
    const orderedCellKeys =
      cellOrder.length > 0
        ? cellOrder
        : (Object.keys(cellComponents) as TCellKeys[]);

    // Lọc theo visibleCells nếu được cung cấp
    const finalCellKeys =
      visibleCells.length > 0
        ? orderedCellKeys.filter((key) => visibleCells.includes(key))
        : orderedCellKeys;

    return finalCellKeys.map((key) => ({
      key,
      component: cellComponents[key],
      isVisible: true,
    }));
  }, [cellComponents, cellOrder, visibleCells]);

  // Handler cho sự kiện click vào dòng
  const handleRowClick = useCallback(
    (rowData: Record<string, unknown>, rowIndex: number): void => {
      if (onRowClick && typeof onRowClick === "function") {
        onRowClick(rowData, rowIndex);
      }
    },
    [onRowClick]
  );

  // VirtualRow truyền row data trực tiếp
  const handleRowClickEvent = useCallback(
    (row: Record<string, unknown>, rowIndex: number): void => {
      handleRowClick(row, rowIndex);
    },
    [handleRowClick]
  );

  // Handler cho sự kiện click vào cell
  const handleCellClick = useCallback(
    (
      cellKey: string,
      cellData: unknown,
      rowData: Record<string, unknown>,
      rowIndex: number,
      ...extraParams: unknown[]
    ): void => {
      if (onCellClick && typeof onCellClick === "function") {
        onCellClick(cellKey, cellData, rowData, rowIndex, ...extraParams);
      }
    },
    [onCellClick]
  );

  // Handler này được gọi BỞI row handler với đầy đủ data cần thiết
  // Hỗ trợ nhận thêm params tùy chọn từ cell components
  const handleCellClickEvent = useCallback(
    (
      cellKey: string,
      cellData: unknown,
      row: Record<string, unknown>,
      rowIndex: number,
      ...extraParams: unknown[]
    ): void => {
      // Tất cả data được truyền từ VirtualRow closure
      handleCellClick(cellKey, cellData, row, rowIndex, ...extraParams);
    },
    [handleCellClick]
  );

  // Handler cho header cell click - Hỗ trợ rest params
  const handleHeaderCellClick = useCallback(
    (cellKey: string, ...extraParams: unknown[]): void => {
      if (onHeaderCellClick) {
        onHeaderCellClick(cellKey, ...extraParams);
      }
    },
    [onHeaderCellClick]
  );

  // Handler cho footer cell click - Hỗ trợ rest params
  const handleFooterCellClick = useCallback(
    (cellKey: string, ...extraParams: unknown[]): void => {
      if (onFooterCellClick) {
        onFooterCellClick(cellKey, ...extraParams);
      }
    },
    [onFooterCellClick]
  );

  // Handler cho scroll từ thanh cuộn ảo (pass vào VirtualScrollbar - memoized component)
  // Hỗ trợ cả smooth (click track) và auto/instant (drag thumb) scrolling
  const handleVirtualScroll = useCallback(
    (newScrollTop: number, behavior?: ScrollBehavior): void => {
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTo({
          top: newScrollTop,
          behavior: behavior || "smooth",
        });
      }
    },
    []
  );

  // Handler cho scroll từ thanh cuộn ảo ngang (pass vào HorizontalScrollbar - memoized component)
  // Hỗ trợ cả smooth (click track) và auto/instant (drag thumb) scrolling
  const handleHorizontalScroll = useCallback(
    (newScrollLeft: number, behavior?: ScrollBehavior): void => {
      if (tableContainerRef.current) {
        tableContainerRef.current.scrollTo({
          left: newScrollLeft,
          behavior: behavior || "smooth",
        });
      }
    },
    []
  );

  // Scrollbar config đã được merged với defaults trong VirtualTable
  const verticalConfig = scrollbarConfig!.vertical;
  const horizontalConfig = scrollbarConfig!.horizontal;

  // Dimensions của scrollbars (để reserve space và calculate adjusted sizes)
  const verticalScrollbarWidth = verticalConfig.trackWidth;
  const horizontalScrollbarHeight = horizontalConfig.trackHeight;

  // Adjusted dimensions để tránh overlap giữa scrollbars tại corner
  const adjustedVerticalScrollbarHeight = useMemo(() => {
    // Vertical scrollbar height = bodyHeight (sẽ được adjust trong VirtualTable khi có horizontal scrollbar)
    return bodyHeight;
  }, [bodyHeight]);

  // Calculate adjusted scrollbar dimensions để tránh overlap tại corner
  const finalVerticalScrollbarHeight = scrollbarInfo.hasHorizontalScrollbar
    ? adjustedVerticalScrollbarHeight - horizontalScrollbarHeight
    : adjustedVerticalScrollbarHeight;

  const finalHorizontalScrollbarWidth = scrollbarInfo.hasVerticalScrollbar
    ? scrollbarInfo.clientWidth - verticalScrollbarWidth
    : scrollbarInfo.clientWidth;

  // Tính toán opacity dựa trên auto-hide setting và activity state
  const scrollbarOpacity = autoHideScrollbars
    ? isActive
      ? scrollbarVisibleOpacity
      : scrollbarHiddenOpacity
    : scrollbarVisibleOpacity;

  const verticalScrollbarStyle = useMemo(
    () => ({ top: headerHeight }),
    [headerHeight]
  );

  // Style cho horizontal scrollbar - position phía trên footer
  const horizontalScrollbarStyle = useMemo(
    () => ({ bottom: footerHeight }),
    [footerHeight]
  );

  // Generate CSS variables từ borderConfig
  const borderStyles = useMemo(() => {
    return {
      "--border-header-bottom-width": `${borderConfig!.header.bottom.width}px`,
      "--border-header-bottom-color": borderConfig!.header.bottom.color,
      "--border-header-cell-width": `${borderConfig!.header.cell.width}px`,
      "--border-header-cell-color": borderConfig!.header.cell.color,
      "--border-body-row-width": `${borderConfig!.body.row.width}px`,
      "--border-body-row-color": borderConfig!.body.row.color,
      "--border-body-cell-width": `${borderConfig!.body.cell.width}px`,
      "--border-body-cell-color": borderConfig!.body.cell.color,
      "--border-footer-top-width": `${borderConfig!.footer.top.width}px`,
      "--border-footer-top-color": borderConfig!.footer.top.color,
      "--border-footer-cell-width": `${borderConfig!.footer.cell.width}px`,
      "--border-footer-cell-color": borderConfig!.footer.cell.color,
    };
  }, [borderConfig]);

  return {
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
    headerHeight,
    footerHeight,
    bodyHeight,
    effectiveHeight,
    handleRowClick,
    handleRowClickEvent,
    handleCellClick,
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
    verticalScrollbarWidth,
    horizontalScrollbarHeight,
    adjustedVerticalScrollbarHeight,
    finalVerticalScrollbarHeight,
    finalHorizontalScrollbarWidth,
    scrollbarInfo,
    borderStyles,
  };
};

export default useVirtualTable;
