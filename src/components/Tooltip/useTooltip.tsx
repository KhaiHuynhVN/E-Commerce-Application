/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { getOptimalPlacement, getTooltipPosition } from "./tooltipHelpers";
import TooltipManager from "./tooltipManager";
import type {
  UseTooltipProps,
  UseTooltipReturn,
  TooltipPositionResult,
} from "./Tooltip.types";

const useTooltip = ({
  open,
  setOpen,
  onClose,
  placement,
  allowAnimation,
  showDelay,
  hideDelay,
  interactive,
  tooltipKey,
  relatedTooltipKeys,
  showOnMouseMove,
  tooltipRef,
  closeOnClickOutside,
  recalculateKey,
  calculatePositionBasedOnWindow,
  disabled,
  offsetPosition,
  keepPlacement,
  spacing,
  margin,
  container,
  arrow,
}: UseTooltipProps): UseTooltipReturn => {
  const [isVisible, setIsVisible] = useState(open || false);
  const [shouldRender, setShouldRender] = useState(open || false);
  const [tooltipStyle, setTooltipStyle] = useState<TooltipPositionResult>({
    position: { position: "fixed", left: "0px", top: "0px" },
    shift: 0,
  });
  const [currentPlacement, setCurrentPlacement] = useState(placement);
  const [initialPlacement] = useState(placement);
  const [isPositionCalculated, setIsPositionCalculated] = useState(false);

  const mousePositionRef = useRef({ x: 0, y: 0 });
  const childRef = useRef<HTMLElement>(null);
  const innerTooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  const isControlled = open !== undefined;
  const shouldShow = isControlled ? open : isVisible;

  const arrowSize = 6; // Định nghĩa kích thước arrow

  // Tính toán spacing thực tế
  const actualOffset = arrow
    ? spacing + arrowSize // Khi có arrow: spacing + khoảng cách cho arrow
    : spacing; // Khi không có arrow: giữ nguyên spacing

  // useEffect để theo dõi recalculateKey
  const recalculateKeyString = Array.isArray(recalculateKey)
    ? JSON.stringify(recalculateKey)
    : recalculateKey;

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (recalculateKey === null || recalculateKey === undefined) return;

    if (shouldShow && childRef.current && innerTooltipRef.current) {
      const containerElement =
        (container && "current" in container ? container.current : container) ||
        null;
      const nextPlacement = getOptimalPlacement(
        childRef.current,
        innerTooltipRef.current,
        keepPlacement ? currentPlacement : initialPlacement,
        actualOffset,
        containerElement,
        margin
      );

      if (nextPlacement !== currentPlacement) {
        setCurrentPlacement(nextPlacement as typeof placement);
      }

      const { position, shift } = getTooltipPosition(
        childRef.current,
        containerElement,
        nextPlacement,
        actualOffset,
        innerTooltipRef.current,
        offsetPosition
      );

      setTooltipStyle({ position, shift });
    }
  }, [recalculateKeyString]);

  // useEffect để cập nhật vị trí khi tooltip được hiển thị
  useLayoutEffect(() => {
    if (shouldShow) {
      if (childRef.current && innerTooltipRef.current) {
        const containerElement =
          (container && "current" in container
            ? container.current
            : container) || null;
        const nextPlacement = getOptimalPlacement(
          childRef.current,
          innerTooltipRef.current,
          keepPlacement ? currentPlacement : initialPlacement,
          actualOffset,
          containerElement,
          margin
        );

        if (nextPlacement !== currentPlacement) {
          setCurrentPlacement(nextPlacement as typeof placement);
        }

        const { position, shift } = getTooltipPosition(
          childRef.current,
          containerElement,
          nextPlacement,
          actualOffset,
          innerTooltipRef.current,
          offsetPosition
        );

        setTooltipStyle({ position, shift });
      }
    }
  }, [shouldShow, shouldRender]);

  useEffect(() => {
    if (tooltipRef) {
      tooltipRef.current = {
        innerTooltipRef: innerTooltipRef.current,
        childRef: childRef.current,
        updatePosition,
      };
    }
  }, [tooltipRef, shouldRender]);

  // useEffect để handle click outside
  useEffect(() => {
    if (isControlled && closeOnClickOutside && shouldShow) {
      const handleClickOutside = (event: MouseEvent): void => {
        // Kiểm tra xem click có nằm trong tooltip hiện tại không
        const isClickInsideCurrentTooltip =
          childRef.current?.contains(event.target as Node) ||
          innerTooltipRef.current?.contains(event.target as Node);

        // Nếu click inside tooltip hiện tại, không làm gì cả
        if (isClickInsideCurrentTooltip) return;

        // Chỉ kiểm tra relatedTooltipKeys khi có tooltipKey
        if (tooltipKey) {
          // Lấy tooltip key từ nơi được click
          const clickedTooltipKey =
            TooltipManager.getTooltipKeyFromEvent(event);

          // Nếu click không được phép cho tooltip này
          if (
            !TooltipManager.isClickAllowedForTooltip(
              tooltipKey,
              clickedTooltipKey
            )
          ) {
            setOpen?.(false);
          }
        } else {
          // Nếu không có tooltipKey, luôn đóng khi click outside
          setOpen?.(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isControlled, closeOnClickOutside, shouldShow, setOpen, tooltipKey]);

  // cleanup effect
  useEffect(() => {
    return () => {
      if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Đăng ký tooltip khi nó được mount
  useEffect(() => {
    if (tooltipKey) {
      TooltipManager.registerTooltip(tooltipKey, relatedTooltipKeys);
    }

    // Cleanup khi component unmount
    return () => {
      if (tooltipKey) {
        TooltipManager.unregisterTooltip(tooltipKey);
      }
    };
  }, [tooltipKey, relatedTooltipKeys]);

  // Controlled mode
  useEffect(() => {
    if (isControlled) {
      handleVisibilityChange(open);
    }
  }, [open, isControlled]);

  // useEffect để cập nhật currentPlacement khi placement thay đổi
  useEffect(() => {
    setCurrentPlacement(placement);
  }, [placement]);

  // Cập nhật vị trí khi placement thay đổi
  useLayoutEffect(() => {
    if (shouldShow && childRef.current && innerTooltipRef.current) {
      updatePosition();
    }
  }, [placement, currentPlacement, spacing, arrow]); // currentPlacement vào dependencies

  // useEffect để cập nhật vị trí sau khi tooltip được render
  useLayoutEffect(() => {
    if (shouldShow && innerTooltipRef.current) {
      // Đợi một frame để đảm bảo tooltip đã render xong và có kích thước thực tế
      requestAnimationFrame(() => {
        updatePosition();
      });
    }
  }, [shouldShow, innerTooltipRef.current]);

  // useEffect mới để theo dõi kích thước của tooltip
  useLayoutEffect(() => {
    if (shouldShow && innerTooltipRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        // Khi kích thước thay đổi, cập nhật lại vị trí
        updatePosition();
      });

      resizeObserver.observe(innerTooltipRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [shouldShow]);

  // Tách riêng effect để lắng nghe mousemove
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent): void => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // useEffect xử lý scroll và resize
  useEffect(() => {
    if (shouldRender) {
      let rafId: number | undefined;
      let lastScrollTime = 0;
      const scrollThreshold = 16; // ~60fps

      const handleUpdate = () => {
        if (childRef.current && innerTooltipRef.current) {
          // Sử dụng requestAnimationFrame để đồng bộ với frame tiếp theo
          requestAnimationFrame(() => {
            const containerElement =
              (container && "current" in container
                ? container.current
                : container) || null;
            // Chỉ áp dụng calculatePositionBasedOnWindow khi có container
            const targetContainer =
              containerElement && calculatePositionBasedOnWindow
                ? null
                : containerElement;

            // Cập nhật vị trí tooltip
            const nextPlacement = getOptimalPlacement(
              childRef.current,
              innerTooltipRef.current,
              keepPlacement ? currentPlacement : initialPlacement,
              actualOffset,
              targetContainer,
              margin
            );

            if (nextPlacement !== currentPlacement) {
              setCurrentPlacement(nextPlacement as typeof placement);
            }

            const { position, shift } = getTooltipPosition(
              childRef.current,
              targetContainer,
              nextPlacement,
              actualOffset,
              innerTooltipRef.current,
              offsetPosition
            );

            setTooltipStyle({ position, shift });

            // Kiểm tra ngay lập tức nếu chuột không còn trên elements
            const isOver = isMouseOverElements();
            if (!isControlled && !isOver) {
              // Clear timeout hiện tại nếu có
              if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
              }
              if (showTimeoutRef.current) {
                clearTimeout(showTimeoutRef.current);
              }
              // Ẩn tooltip ngay lập tức không cần delay
              setIsVisible(false);
              if (!allowAnimation) {
                setShouldRender(false);
              }
            }
          });
        }
      };

      const throttledUpdate = () => {
        const now = Date.now();

        if (now - lastScrollTime >= scrollThreshold) {
          lastScrollTime = now;
          if (rafId) {
            cancelAnimationFrame(rafId);
          }
          rafId = requestAnimationFrame(handleUpdate);
        }
      };

      window.addEventListener("scroll", throttledUpdate, true);
      window.addEventListener("resize", throttledUpdate);

      return () => {
        window.removeEventListener("scroll", throttledUpdate, true);
        window.removeEventListener("resize", throttledUpdate);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      };
    }
  }, [
    shouldRender,
    keepPlacement,
    currentPlacement,
    initialPlacement,
    spacing,
    arrow,
    interactive,
    isControlled,
    calculatePositionBasedOnWindow,
    container,
  ]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !isControlled) {
        // Nếu document bị ẩn (chuyển tab), force hide tất cả tooltip
        hideTooltip();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isControlled]);

  // Hàm cập nhật vị trí
  const updatePosition = (): void => {
    if (childRef.current && innerTooltipRef.current) {
      const containerElement =
        (container && "current" in container ? container.current : container) ||
        null;
      // Chỉ áp dụng calculatePositionBasedOnWindow khi có container
      const targetContainer =
        containerElement && calculatePositionBasedOnWindow
          ? null
          : containerElement;

      const nextPlacement = getOptimalPlacement(
        childRef.current,
        innerTooltipRef.current,
        keepPlacement ? currentPlacement : initialPlacement,
        actualOffset,
        targetContainer,
        margin
      );

      if (nextPlacement !== currentPlacement) {
        setCurrentPlacement(nextPlacement as typeof placement);
      }

      const { position, shift } = getTooltipPosition(
        childRef.current,
        targetContainer,
        nextPlacement,
        actualOffset,
        innerTooltipRef.current,
        offsetPosition
      );

      setTooltipStyle({ position, shift });
      setIsPositionCalculated(true);
    }
  };

  // Cập nhật handleVisibilityChange
  const handleVisibilityChange = (show: boolean): void => {
    // biến để theo dõi trạng thái trước đó
    const wasVisible = isVisible;

    // Clear cả hai timeout để tránh race condition
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Nếu đang show và tooltip đã visible thì không làm gì cả
    if (show && isVisible) {
      return;
    }

    const delay = show ? showDelay : hideDelay;

    if (delay > 0) {
      if (show) {
        showTimeoutRef.current = setTimeout(() => {
          setShouldRender(true);
          setIsVisible(true);
          showTimeoutRef.current = null;
        }, delay);
      } else {
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
          // Chỉ reset isPositionCalculated khi không có animation
          if (!allowAnimation) {
            setIsPositionCalculated(false);
            setShouldRender(false);
          }
          // Chỉ gọi onClose khi tooltip thực sự đang được hiển thị trước đó
          if (wasVisible) {
            onClose?.();
          }
          hideTimeoutRef.current = null;
        }, delay);
      }
    } else {
      if (show) {
        setShouldRender(true);
        setIsVisible(true);
      } else {
        setIsVisible(false);
        // Chỉ reset isPositionCalculated khi không có animation
        if (!allowAnimation) {
          setIsPositionCalculated(false);
          setShouldRender(false);
        }
        // Chỉ gọi onClose khi tooltip thực sự đang được hiển thị trước đó
        if (wasVisible) {
          onClose?.();
        }
      }
    }
  };

  // hàm kiểm tra chuột có đang hover trên elements hay không
  const isMouseOverElements = () => {
    const mousePosition = mousePositionRef.current;
    const elementAtPoint = document.elementFromPoint(
      mousePosition.x,
      mousePosition.y
    );

    // Nếu không tìm thấy element nào tại vị trí chuột, coi như chuột không hover
    if (!elementAtPoint) {
      return false;
    }

    // Kiểm tra xem element tại vị trí chuột có phải là con của element gốc không
    const isOverChild = childRef.current?.contains(elementAtPoint);

    // Kiểm tra xem element tại vị trí chuột có phải là con của tooltip không
    const isOverTooltip =
      interactive && innerTooltipRef.current?.contains(elementAtPoint);

    // Chỉ kiểm tra relatedTooltipKeys khi có tooltipKey
    let isOverRelated = false;
    if (tooltipKey) {
      const hoveredTooltipKey = TooltipManager.getTooltipKeyFromEvent({
        target: elementAtPoint,
      });
      isOverRelated = TooltipManager.isClickAllowedForTooltip(
        tooltipKey,
        hoveredTooltipKey
      );
    }

    return isOverChild || isOverTooltip || isOverRelated;
  };

  const handleAnimationEnd = (e: React.AnimationEvent): void => {
    if (e.animationName.includes("show") && !isControlled) {
      // Kiểm tra ngay lập tức sau khi animation show hoàn thành
      if (!isMouseOverElements()) {
        hideTooltip();
      }
    }
    // Khi animation hide kết thúc
    else if (e.animationName.includes("hide") && !isVisible && allowAnimation) {
      setShouldRender(false);
      setIsPositionCalculated(false);
    }
  };

  const showTooltip = () => {
    if (!isControlled && !disabled) {
      handleVisibilityChange(true);
    }
  };

  const hideTooltip = () => {
    if (!isControlled) {
      handleVisibilityChange(false);
    }
  };

  const handleTooltipMouseEnter = () => {
    if (interactive && !isControlled) {
      // Clear hide timeout nếu đang có
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      handleVisibilityChange(true);
    }
  };

  const handleTooltipMouseLeave = (e: React.MouseEvent): void => {
    if (interactive && !isControlled) {
      // Kiểm tra xem chuột có đang hover vào element gốc không
      const elementAtPoint = document.elementFromPoint(e.clientX, e.clientY);
      const isHoveringChild =
        elementAtPoint && childRef.current?.contains(elementAtPoint);

      if (!isHoveringChild) {
        handleVisibilityChange(false);
      }
    }
  };

  const handleMouseEnter = (e: React.MouseEvent): void => {
    if (!e.currentTarget.contains(e.target as Node)) return;
    showTooltip();
  };

  const handleMouseLeave = (e: React.MouseEvent): void => {
    if (!e.currentTarget.contains(e.target as Node)) return;
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current);
      showTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    hideTooltip();
  };

  const handleMouseMove = (e: React.MouseEvent): void => {
    if (!e.currentTarget.contains(e.target as Node)) return;
    if (showOnMouseMove) {
      if (!isVisible && !isControlled && !showTimeoutRef.current) {
        handleVisibilityChange(true);
      }
    } else {
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      showTooltip();
    }
  };

  return {
    isVisible,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseMove,
    childRef: childRef as React.RefObject<HTMLElement>,
    innerTooltipRef: innerTooltipRef as React.RefObject<HTMLDivElement>,
    tooltipStyle,
    currentPlacement,
    shouldRender,
    handleTooltipMouseEnter,
    handleTooltipMouseLeave,
    handleAnimationEnd,
    isPositionCalculated,
  };
};

export default useTooltip;
