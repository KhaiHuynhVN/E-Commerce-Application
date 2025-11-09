import { useEffect, useRef, useState } from "react";

import type {
  UseVirtualScrollbarProps,
  UseVirtualScrollbarReturn,
} from "../../VirtualTable.types";

/**
 * Custom hook để quản lý logic cho vertical scrollbar
 * @param props - Props cho hook
 * @returns Object chứa refs, states và handlers cho scrollbar
 */
const useVirtualScrollbar = ({
  height,
  totalHeight,
  thumbMinHeight,
  scrollTop,
  onScroll,
  trackHeight,
}: UseVirtualScrollbarProps): UseVirtualScrollbarReturn => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartScrollTop, setDragStartScrollTop] = useState(0);

  /**
   * Tính toán kích thước và vị trí thumb
   *
   * Logic:
   *   1. Tính tỷ lệ scroll dựa trên height/totalHeight
   *   2. Áp dụng thumbMinHeight để đảm bảo thumb đủ lớn để tương tác
   *   3. Dùng trackHeight (nếu có) để calculate thumb size, height cho scroll ratios
   *   4. Tính vị trí thumb dựa trên scrollTop hiện tại
   */
  // Tính toán xem có cần hiển thị scrollbar không
  const showScrollbar = totalHeight > height;

  const availableHeight = trackHeight || height; // Use trackHeight if provided (when horizontal scrollbar exists)
  const scrollRatio = height / totalHeight;
  const thumbHeight = Math.max(availableHeight * scrollRatio, thumbMinHeight);
  const trackSpace = availableHeight - thumbHeight;
  // Clamp thumbTop để thumb không bao giờ vượt quá track bounds
  const thumbTop =
    totalHeight > height
      ? Math.max(
          0,
          Math.min(
            (scrollTop / (totalHeight - height)) * trackSpace,
            trackSpace
          )
        )
      : 0;

  // Xử lý khi nhấn chuột vào thumb để bắt đầu kéo
  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDragStartY(e.clientY);
    setDragStartScrollTop(scrollTop);

    // Ngăn text selection và thay đổi cursor trong khi drag
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  // Xử lý khi click vào track để jump đến vị trí đó
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Ignore nếu click vào thumb
    if (e.target === thumbRef.current) return;

    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const clickY = e.clientY - rect.top;

    // Tính toán vị trí scroll mới dựa trên click position
    const clickRatio = clickY / height;
    const newScrollTop = clickRatio * (totalHeight - height);

    // Click track → smooth scrolling
    onScroll(
      Math.max(0, Math.min(newScrollTop, totalHeight - height)),
      "smooth"
    );
  };

  // Xử lý di chuyển chuột trong quá trình kéo thumb
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const deltaY = e.clientY - dragStartY;
      const deltaScrollTop = (deltaY / trackSpace) * (totalHeight - height);
      const newScrollTop = dragStartScrollTop + deltaScrollTop;

      // Drag thumb → instant scrolling
      onScroll(
        Math.max(0, Math.min(newScrollTop, totalHeight - height)),
        "auto"
      );
    };

    const handleMouseUp = (): void => {
      setIsDragging(false);
      // Restore cursor và text selection
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };

    // Sử dụng document listeners để drag không bị gián đoạn
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    isDragging,
    dragStartY,
    dragStartScrollTop,
    trackSpace,
    totalHeight,
    height,
    onScroll,
  ]);

  return {
    trackRef,
    handleTrackClick,
    thumbRef,
    isDragging,
    thumbHeight,
    thumbTop,
    handleThumbMouseDown,
    showScrollbar,
  };
};

export default useVirtualScrollbar;
