import { useEffect, useState, type RefObject } from "react";

/** Thông tin về scrollbars của container */
interface ScrollbarInfo {
  /** Có vertical scrollbar không */
  hasVerticalScrollbar: boolean;
  /** Có horizontal scrollbar không */
  hasHorizontalScrollbar: boolean;
  /** Chiều rộng của vertical scrollbar (pixels) */
  verticalScrollbarWidth: number;
  /** Chiều cao của horizontal scrollbar (pixels) */
  horizontalScrollbarHeight: number;
  /** Vị trí scroll ngang hiện tại */
  scrollLeft: number;
  /** Vị trí scroll dọc hiện tại */
  scrollTop: number;
  /** Tổng chiều rộng có thể scroll */
  scrollWidth: number;
  /** Tổng chiều cao có thể scroll */
  scrollHeight: number;
  /** Chiều rộng visible area */
  clientWidth: number;
  /** Chiều cao visible area */
  clientHeight: number;
}

/**
 * useScrollbarDetection
 *
 * Hook để detect và track thông tin scrollbar của container element.
 * Sử dụng ResizeObserver + MutationObserver để đảm bảo updates real-time.
 *
 * @param containerRef - Ref đến container element cần detect scrollbar
 * @returns Thông tin về scrollbars của container
 *
 * @example
 * const containerRef = useRef(null);
 * const scrollbarInfo = useScrollbarDetection(containerRef);
 *
 * if (scrollbarInfo.hasVerticalScrollbar) {
 *    console.log("Has vertical scrollbar!");
 * }
 */
const useScrollbarDetection = (
  containerRef: RefObject<HTMLDivElement>
): ScrollbarInfo => {
  const [scrollbarInfo, setScrollbarInfo] = useState<ScrollbarInfo>({
    hasVerticalScrollbar: false,
    hasHorizontalScrollbar: false,
    verticalScrollbarWidth: 0,
    horizontalScrollbarHeight: 0,
    scrollLeft: 0,
    scrollTop: 0,
    scrollWidth: 0,
    scrollHeight: 0,
    clientWidth: 0,
    clientHeight: 0,
  });

  // Sử dụng ResizeObserver + MutationObserver cho detection hiện đại
  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;

    // Tính toán thông tin scrollbar dimensions
    const calculateScrollbarInfo = (): void => {
      if (!containerRef.current) return;

      const el = containerRef.current;
      const {
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
        scrollLeft,
        scrollTop,
        offsetWidth,
        offsetHeight,
      } = el;

      // Detect sự hiện diện của scrollbars
      const hasVerticalScrollbar = scrollHeight > clientHeight;
      const hasHorizontalScrollbar = scrollWidth > clientWidth;

      // Tính toán kích thước scrollbars (nếu visible)
      const verticalScrollbarWidth = hasVerticalScrollbar
        ? offsetWidth - clientWidth
        : 0;
      const horizontalScrollbarHeight = hasHorizontalScrollbar
        ? offsetHeight - clientHeight
        : 0;

      setScrollbarInfo({
        hasVerticalScrollbar,
        hasHorizontalScrollbar,
        verticalScrollbarWidth,
        horizontalScrollbarHeight,
        scrollLeft,
        scrollTop,
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
      });
    };

    // Tính toán ban đầu
    calculateScrollbarInfo();

    // ResizeObserver để detect thay đổi kích thước container
    const resizeObserver = new ResizeObserver(() => {
      calculateScrollbarInfo();
    });

    // Scroll listener để detect thay đổi scroll position
    const handleScroll = (): void => {
      calculateScrollbarInfo();
    };

    // MutationObserver để detect thay đổi content
    const mutationObserver = new MutationObserver(() => {
      // Debounce để tránh calculations quá nhiều
      setTimeout(calculateScrollbarInfo, 10);
    });

    // Bắt đầu observe
    resizeObserver.observe(element);
    element.addEventListener("scroll", handleScroll, { passive: true });
    mutationObserver.observe(element, {
      childList: true,
      subtree: true,
      // Không observe attribute changes để tối ưu performance
      attributes: false,
    });

    // Cleanup khi unmount
    return () => {
      resizeObserver.disconnect();
      element.removeEventListener("scroll", handleScroll);
      mutationObserver.disconnect();
    };
  }, [containerRef]);

  return scrollbarInfo;
};

export default useScrollbarDetection;
export type { ScrollbarInfo };
