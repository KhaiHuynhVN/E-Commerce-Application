/**
 * tooltipHelpers.js
 * File này chứa các hàm helper và constant để xử lý việc hiển thị tooltip
 * Bao gồm:
 * - Các constant định nghĩa vị trí và animation của tooltip
 * - Các hàm tính toán vị trí tooltip và arrow
 * - Hàm tối ưu vị trí tooltip khi bị tràn viewport
 */

/**
 * PLACEMENTS: Định nghĩa các vị trí có thể có của tooltip
 * Có 12 vị trí khác nhau được chia thành 4 nhóm chính:
 * 1. Top (top, topLeft, topRight): Tooltip hiển thị phía trên element
 * 2. Bottom (bottom, bottomLeft, bottomRight): Tooltip hiển thị phía dưới element
 * 3. Left (left, leftTop, leftBottom): Tooltip hiển thị bên trái element
 * 4. Right (right, rightTop, rightBottom): Tooltip hiển thị bên phải element
 *
 * Mỗi nhóm có 3 kiểu căn chỉnh:
 * - Center: Căn giữa tooltip với element (top, bottom, left, right)
 * - Start: Căn đầu tooltip với element (topLeft, bottomLeft, leftTop, rightTop)
 * - End: Căn cuối tooltip với element (topRight, bottomRight, leftBottom, rightBottom)
 */
const PLACEMENTS = {
  top: "top",
  topLeft: "topLeft",
  topRight: "topRight",
  bottom: "bottom",
  bottomLeft: "bottomLeft",
  bottomRight: "bottomRight",
  left: "left",
  leftTop: "leftTop",
  leftBottom: "leftBottom",
  right: "right",
  rightTop: "rightTop",
  rightBottom: "rightBottom",
};

/**
 * ANIMATIONS: Định nghĩa các kiểu animation có thể áp dụng cho tooltip
 * Mỗi animation là một chuỗi kết hợp giữa show và hide effect
 * Format: "show-{effect}_hide-{effect}"
 *
 * Các loại animation hiện có:
 * - FADE: Hiệu ứng mờ dần khi show/hide tooltip
 * - SLIDE: Hiệu ứng trượt vào/ra khi show/hide tooltip
 * - SCALE: Hiệu ứng phóng to/thu nhỏ khi show/hide tooltip
 */
const ANIMATIONS = {
  /**
   * Hiệu ứng mờ dần khi show/hide tooltip
   */
  FADE: "show-fade_hide-fade",

  /**
   * Hiệu ứng trượt vào/ra khi show/hide tooltip
   */
  SLIDE: "show-slide_hide-slide",

  /**
   * Hiệu ứng phóng to/thu nhỏ khi show/hide tooltip
   */
  SCALE: "show-scale_hide-scale",
  // Thêm các animation khác ở đây
};

/**
 * Helper function để tính toán vị trí tooltip
 *
 * Quy trình tính toán:
 * 1. Lấy kích thước và vị trí của element gốc và tooltip
 * 2. Khởi tạo viewport để kiểm tra tràn màn hình
 * 3. Tính toán vị trí cơ bản dựa trên placement:
 *    - Top: tooltip nằm trên, cách element một khoảng spacing
 *    - Bottom: tooltip nằm dưới, cách element một khoảng spacing
 *    - Left: tooltip nằm trái, cách element một khoảng spacing
 *    - Right: tooltip nằm phải, cách element một khoảng spacing
 * 4. Xử lý shift nếu tooltip bị tràn:
 *    - Chỉ shift với các placement center
 *    - Giới hạn shift không quá 1/2 kích thước element
 * 5. Xử lý riêng cho trường hợp có container:
 *    - Tính toán vị trí tương đối với container
 *    - Xử lý scroll của container
 */
function getTooltipPosition(
  element: HTMLElement | null,
  container: HTMLElement | null,
  placement: string,
  spacing: number = 8,
  tooltipElement: HTMLElement | null,
  offset: { x: number; y: number } = { x: 0, y: 0 }
): {
  position: { position: "fixed" | "absolute"; left: string; top: string };
  shift: number;
} {
  if (!element || !tooltipElement)
    return {
      position: { position: "fixed" as const, left: "0px", top: "0px" },
      shift: 0,
    };

  const elementRect = element.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();
  const containerRect = container?.getBoundingClientRect();

  /**
   * Viewport dùng để kiểm tra tooltip có bị tràn ra ngoài màn hình không
   * Nếu tràn thì sẽ tính toán shift để đẩy tooltip vào trong
   */
  const viewport = {
    top: 0,
    left: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
  };

  const calculatePosition = () => {
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    // Khởi tạo x, y với giá trị từ getBoundingClientRect()
    let x = elementRect.left;
    let y = elementRect.top;

    let shift = 0;

    /**
     * Tính toán vị trí cơ bản của tooltip theo placement:
     * - Top: tooltip nằm trên, cách element một khoảng spacing
     * - Bottom: tooltip nằm dưới, cách element một khoảng spacing
     * - Left: tooltip nằm trái, cách element một khoảng spacing
     * - Right: tooltip nằm phải, cách element một khoảng spacing
     *
     * Với mỗi hướng, có 3 cách căn chỉnh:
     * - Center: căn giữa tooltip với element (top, bottom, left, right)
     * - Start: căn đầu tooltip với element (topLeft, bottomLeft, leftTop, rightTop)
     * - End: căn cuối tooltip với element (topRight, bottomRight, leftBottom, rightBottom)
     */
    switch (placement) {
      case PLACEMENTS.top:
      case PLACEMENTS.topLeft:
      case PLACEMENTS.topRight:
        y -= tooltipHeight + spacing;
        if (placement === PLACEMENTS.top) {
          x += (elementRect.width - tooltipWidth) / 2;
        } else if (placement === PLACEMENTS.topRight) {
          x += elementRect.width - tooltipWidth;
        }
        // Thêm offset
        x += offset.x;
        y += offset.y;
        break;

      case PLACEMENTS.bottom:
      case PLACEMENTS.bottomLeft:
      case PLACEMENTS.bottomRight:
        y += elementRect.height + spacing;
        if (placement === PLACEMENTS.bottom) {
          x += (elementRect.width - tooltipWidth) / 2;
        } else if (placement === PLACEMENTS.bottomRight) {
          x += elementRect.width - tooltipWidth;
        }
        // Thêm offset
        x += offset.x;
        y += offset.y;
        break;

      case PLACEMENTS.left:
      case PLACEMENTS.leftTop:
      case PLACEMENTS.leftBottom:
        x -= tooltipWidth + spacing;
        if (placement === PLACEMENTS.left) {
          y += (elementRect.height - tooltipHeight) / 2;
        } else if (placement === PLACEMENTS.leftBottom) {
          y += elementRect.height - tooltipHeight;
        }
        // Thêm offset
        x += offset.x;
        y += offset.y;
        break;

      case PLACEMENTS.right:
      case PLACEMENTS.rightTop:
      case PLACEMENTS.rightBottom:
        x += elementRect.width + spacing;
        if (placement === PLACEMENTS.right) {
          y += (elementRect.height - tooltipHeight) / 2;
        } else if (placement === PLACEMENTS.rightBottom) {
          y += elementRect.height - tooltipHeight;
        }
        // Thêm offset
        x += offset.x;
        y += offset.y;
        break;
    }

    /**
     * Chỉ cho phép shift với các placement center
     * Vì các placement không center đã được căn sẵn theo element
     */
    const allowShift =
      placement === PLACEMENTS.top ||
      placement === PLACEMENTS.bottom ||
      placement === PLACEMENTS.left ||
      placement === PLACEMENTS.right;

    if (container && containerRect) {
      // Tính toán vị trí tương đối với container
      x = x - containerRect.left + container.scrollLeft;
      y = y - containerRect.top + container.scrollTop;

      // Logic shift cho container
      if (
        (placement.includes("bottom") || placement.includes("top")) &&
        allowShift
      ) {
        const maxShift = elementRect.width / 2;
        const tooltipLeft = x;
        const tooltipRight = tooltipLeft + tooltipWidth;

        if (tooltipLeft < container.scrollLeft) {
          const requiredShift = container.scrollLeft - tooltipLeft;
          shift = Math.min(requiredShift, maxShift);
        } else if (
          tooltipRight >
          container.scrollLeft + container.clientWidth
        ) {
          const requiredShift =
            container.scrollLeft + container.clientWidth - tooltipRight;
          shift = Math.max(requiredShift, -maxShift);
        }

        x += shift;
      } else if (
        (placement.includes("left") || placement.includes("right")) &&
        allowShift
      ) {
        const maxShift = elementRect.height / 2;
        const tooltipTop = y;
        const tooltipBottom = tooltipTop + tooltipHeight;

        if (tooltipTop < container.scrollTop) {
          const requiredShift = container.scrollTop - tooltipTop;
          shift = Math.min(requiredShift, maxShift);
        } else if (
          tooltipBottom >
          container.scrollTop + container.clientHeight
        ) {
          const requiredShift =
            container.scrollTop + container.clientHeight - tooltipBottom;
          shift = Math.max(requiredShift, -maxShift);
        }

        y += shift;
      }

      return {
        position: {
          position: "absolute" as const,
          left: `${Math.round(x)}px`,
          top: `${Math.round(y)}px`,
        },
        shift,
      };
    } else {
      // Logic shift cho window
      if (
        (placement.includes("bottom") || placement.includes("top")) &&
        allowShift
      ) {
        const maxShift = elementRect.width / 2;
        const tooltipCenter = x + tooltipWidth / 2;
        const elementCenter = elementRect.left + elementRect.width / 2;
        const currentShift = tooltipCenter - elementCenter;

        if (x < viewport.left) {
          const requiredShift = viewport.left - x;
          shift = Math.min(requiredShift, maxShift - currentShift);
        } else if (x + tooltipWidth > viewport.right) {
          const requiredShift = viewport.right - (x + tooltipWidth);
          shift = Math.max(requiredShift, -maxShift - currentShift);
        }

        x += shift;
      } else if (
        (placement.includes("left") || placement.includes("right")) &&
        allowShift
      ) {
        const maxShift = elementRect.height / 2;
        const tooltipMiddle = y + tooltipHeight / 2;
        const elementMiddle = elementRect.top + elementRect.height / 2;
        const currentShift = tooltipMiddle - elementMiddle;

        if (y < viewport.top) {
          const requiredShift = viewport.top - y;
          shift = Math.min(requiredShift, maxShift - currentShift);
        } else if (y + tooltipHeight > viewport.bottom) {
          const requiredShift = viewport.bottom - (y + tooltipHeight);
          shift = Math.max(requiredShift, -maxShift - currentShift);
        }

        y += shift;
      }

      return {
        position: {
          position: "fixed" as const,
          left: `${Math.round(x)}px`,
          top: `${Math.round(y)}px`,
        },
        shift,
      };
    }
  };

  return calculatePosition();
}

/**
 * Helper function để tính toán vị trí arrow
 *
 * Quy tắc tính toán:
 * 1. Với placement center (top, bottom, left, right):
 *    - Arrow luôn nằm giữa tooltip (50%)
 *
 * 2. Với placement không center:
 *    - So sánh kích thước tooltip và element
 *    - Nếu tooltip nhỏ hơn/bằng element: arrow nằm giữa tooltip
 *    - Nếu tooltip lớn hơn element: arrow căn theo element
 *
 * 3. Xử lý transform để xoay arrow:
 *    - Sử dụng rotate(45deg) để tạo hình mũi tên
 *    - Điều chỉnh vị trí dựa trên placement
 */
function getArrowPosition(
  placement: string,
  tooltipRect: DOMRect | null,
  elementRect: DOMRect | null
): Record<string, string | number> {
  if (!tooltipRect || !elementRect) return {};

  const arrowSize = 4;

  /**
   * Tính toán vị trí arrow cho từng placement:
   * 1. Với placement center (top, bottom, left, right):
   *    - Arrow luôn nằm giữa tooltip (50%)
   *
   * 2. Với placement không phải center:
   *    - So sánh kích thước tooltip và element
   *    - Nếu tooltip nhỏ hơn hoặc bằng element: arrow nằm giữa tooltip (50%)
   *    - Nếu tooltip lớn hơn element: arrow nằm giữa element (tính bằng px)
   */
  const positions = {
    // Top positions
    [PLACEMENTS.top]: {
      bottom: -arrowSize,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
    [PLACEMENTS.topLeft]: {
      bottom: -arrowSize,
      left:
        tooltipRect.width <= elementRect.width ? "50%" : elementRect.width / 2,
      transform: "translateX(-50%) rotate(45deg)",
    },
    [PLACEMENTS.topRight]: {
      bottom: -arrowSize,
      left:
        tooltipRect.width <= elementRect.width
          ? "50%"
          : tooltipRect.width - elementRect.width / 2,
      transform: "translateX(-50%) rotate(45deg)",
    },

    // Bottom positions
    [PLACEMENTS.bottom]: {
      top: -arrowSize,
      left: "50%",
      transform: "translateX(-50%) rotate(45deg)",
    },
    [PLACEMENTS.bottomLeft]: {
      top: -arrowSize,
      left:
        tooltipRect.width <= elementRect.width ? "50%" : elementRect.width / 2,
      transform: "translateX(-50%) rotate(45deg)",
    },
    [PLACEMENTS.bottomRight]: {
      top: -arrowSize,
      left:
        tooltipRect.width <= elementRect.width
          ? "50%"
          : tooltipRect.width - elementRect.width / 2,
      transform: "translateX(-50%) rotate(45deg)",
    },

    // Left positions
    [PLACEMENTS.left]: {
      right: -arrowSize,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
    [PLACEMENTS.leftTop]: {
      right: -arrowSize,
      top:
        tooltipRect.height <= elementRect.height
          ? "50%"
          : elementRect.height / 2,
      transform: "translateY(-50%) rotate(45deg)",
    },
    [PLACEMENTS.leftBottom]: {
      right: -arrowSize,
      top:
        tooltipRect.height <= elementRect.height
          ? "50%"
          : tooltipRect.height - elementRect.height / 2,
      transform: "translateY(-50%) rotate(45deg)",
    },

    // Right positions
    [PLACEMENTS.right]: {
      left: -arrowSize,
      top: "50%",
      transform: "translateY(-50%) rotate(45deg)",
    },
    [PLACEMENTS.rightTop]: {
      left: -arrowSize,
      top:
        tooltipRect.height <= elementRect.height
          ? "50%"
          : elementRect.height / 2,
      transform: "translateY(-50%) rotate(45deg)",
    },
    [PLACEMENTS.rightBottom]: {
      left: -arrowSize,
      top:
        tooltipRect.height <= elementRect.height
          ? "50%"
          : tooltipRect.height - elementRect.height / 2,
      transform: "translateY(-50%) rotate(45deg)",
    },
  };

  const position = positions[placement];

  // Chuyển đổi các giá trị số thành chuỗi px
  const result: Record<string, string> = {};
  Object.keys(position).forEach((key: string) => {
    const value = position[key as keyof typeof position];
    if (typeof value === "number") {
      result[key] = `${value}px`;
    } else if (value !== undefined) {
      result[key] = value;
    }
  });

  return result;
}

/**
 * Helper function để tìm vị trí thay thế tối ưu khi tooltip bị tràn
 *
 * Quy trình xử lý:
 * 1. Xác định viewport:
 *    - Nếu có container: dùng kích thước container
 *    - Nếu không: dùng kích thước window
 *
 * 2. Kiểm tra tooltip có bị tràn các cạnh không:
 *    - Tính toán với cả spacing và margin
 *    - Xét các trường hợp: top, bottom, left, right
 *
 * 3. Áp dụng quy tắc fallback:
 *    - Tràn trên -> Chuyển xuống dưới
 *    - Tràn dưới -> Chuyển lên trên
 *    - Tràn trái -> Chuyển sang phải
 *    - Tràn phải -> Chuyển sang trái
 *
 * 4. Giữ nguyên căn chỉnh:
 *    - Nếu là topLeft -> bottomLeft
 *    - Nếu là leftTop -> rightTop
 *    - Tương tự cho các trường hợp khác
 */
function getOptimalPlacement(
  element: HTMLElement | null,
  tooltipElement: HTMLElement | null,
  placement: string,
  spacing: number = 8,
  container: HTMLElement | null,
  margin: number = 8
): string {
  if (!element || !tooltipElement) return placement;

  const elementRect = element.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();

  // Nếu có container thì dùng viewport của container, không thì dùng viewport của window
  const viewport = container
    ? {
        top: container.getBoundingClientRect().top,
        left: container.getBoundingClientRect().left,
        right: container.getBoundingClientRect().left + container.clientWidth,
        bottom: container.getBoundingClientRect().top + container.clientHeight,
      }
    : {
        top: 0,
        left: 0,
        right: document.documentElement.clientWidth,
        bottom: document.documentElement.clientHeight,
      };

  // Kiểm tra với cả spacing
  const isBlocked = {
    top: elementRect.top - tooltipRect.height - spacing - margin < viewport.top,
    bottom:
      elementRect.bottom + tooltipRect.height + spacing + margin >
      viewport.bottom,
    left:
      elementRect.left - tooltipRect.width - spacing - margin < viewport.left,
    right:
      elementRect.right + tooltipRect.width + spacing + margin > viewport.right,
  };

  /**
   * Map các placement thay thế khi tooltip bị tràn viewport
   * Nguyên tắc:
   * 1. Nếu tràn trên -> chuyển xuống dưới
   * 2. Nếu tràn dưới -> chuyển lên trên
   * 3. Nếu tràn trái -> chuyển sang phải
   * 4. Nếu tràn phải -> chuyển sang trái
   */
  const fallbackMap = {
    // Top placements
    top: "bottom",
    topLeft: "bottomLeft",
    topRight: "bottomRight",

    // Bottom placements
    bottom: "top",
    bottomLeft: "topLeft",
    bottomRight: "topRight",

    // Left placements
    left: "right",
    leftTop: "rightTop",
    leftBottom: "rightBottom",

    // Right placements
    right: "left",
    rightTop: "leftTop",
    rightBottom: "leftBottom",
  };

  // Kiểm tra và trả về placement thay thế nếu cần
  if (placement.includes("top") && isBlocked.top)
    return fallbackMap[placement as keyof typeof fallbackMap];
  if (placement.includes("bottom") && isBlocked.bottom)
    return fallbackMap[placement as keyof typeof fallbackMap];
  if (placement.includes("left") && isBlocked.left)
    return fallbackMap[placement as keyof typeof fallbackMap];
  if (placement.includes("right") && isBlocked.right)
    return fallbackMap[placement as keyof typeof fallbackMap];

  return placement;
}

export {
  getTooltipPosition,
  getArrowPosition,
  getOptimalPlacement,
  PLACEMENTS,
  ANIMATIONS,
};
