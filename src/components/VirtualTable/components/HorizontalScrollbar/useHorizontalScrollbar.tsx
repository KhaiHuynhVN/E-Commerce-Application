import { useEffect, useRef, useState } from "react";

import type {
  UseHorizontalScrollbarProps,
  UseHorizontalScrollbarReturn,
} from "../../VirtualTable.types";

/**
 * Custom hook để quản lý logic cho horizontal scrollbar
 * @param props - Props cho hook
 * @returns Object chứa refs, states và handlers cho scrollbar
 */
const useHorizontalScrollbar = ({
  scrollLeft,
  scrollWidth,
  clientWidth,
  onScroll,
  thumbMinWidth,
  trackWidth,
}: UseHorizontalScrollbarProps): UseHorizontalScrollbarReturn => {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragStartScrollLeft, setDragStartScrollLeft] = useState(0);

  // Xử lý khi nhấn chuột vào thumb để bắt đầu kéo
  const handleThumbMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    setDragStartX(e.clientX);
    setDragStartScrollLeft(scrollLeft);

    // Ngăn text selection và thay đổi cursor trong khi drag
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
  };

  // Xử lý khi click vào track để jump đến vị trí đó
  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    // Ignore nếu click vào thumb
    if (e.target === thumbRef.current) return;
    if (!trackRef.current) return;

    const rect = trackRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickRatio = clickX / rect.width;
    const newScrollLeft = clickRatio * (scrollWidth - clientWidth);

    // Click track → smooth scrolling
    onScroll(
      Math.max(0, Math.min(newScrollLeft, scrollWidth - clientWidth)),
      "smooth"
    );
  };

  // Tính toán xem có cần hiển thị scrollbar không
  const showScrollbar = scrollWidth > clientWidth;

  /**
   * Tính toán kích thước và vị trí thumb
   *
   * Logic:
   *   1. Tính tỷ lệ scroll dựa trên clientWidth/scrollWidth
   *   2. Áp dụng thumbMinWidth để đảm bảo thumb đủ lớn để tương tác
   *   3. Tính vị trí thumb dựa trên scrollLeft hiện tại
   */
  const availableWidth = trackWidth || clientWidth;
  const scrollRatio = clientWidth / scrollWidth;
  const thumbWidth = Math.max(availableWidth * scrollRatio, thumbMinWidth);
  const trackSpace = availableWidth - thumbWidth;
  // Clamp thumbLeft để thumb không bao giờ vượt quá track bounds
  const thumbLeft = showScrollbar
    ? Math.max(
        0,
        Math.min(
          (scrollLeft / (scrollWidth - clientWidth)) * trackSpace,
          trackSpace
        )
      )
    : 0;

  // Xử lý di chuyển chuột trong quá trình kéo thumb
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent): void => {
      const deltaX = e.clientX - dragStartX;
      const deltaScrollLeft =
        (deltaX / trackSpace) * (scrollWidth - clientWidth);
      const newScrollLeft = dragStartScrollLeft + deltaScrollLeft;

      // Drag thumb → instant scrolling
      onScroll(
        Math.max(0, Math.min(newScrollLeft, scrollWidth - clientWidth)),
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
    dragStartX,
    dragStartScrollLeft,
    trackSpace,
    scrollWidth,
    clientWidth,
    onScroll,
  ]);

  return {
    trackRef,
    thumbRef,
    isDragging,
    handleThumbMouseDown,
    handleTrackClick,
    thumbWidth,
    thumbLeft,
    showScrollbar,
  };
};

export default useHorizontalScrollbar;
