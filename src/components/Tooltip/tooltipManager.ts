// Map để lưu trữ mối quan hệ giữa các tooltip (tooltip nào được phép tương tác với tooltip nào)
const tooltipRelations = new Map();

const TooltipManager = {
  // Đăng ký một tooltip và các tooltip liên quan được phép tương tác
  registerTooltip(tooltipKey, relatedTooltipKeys = []) {
    if (!tooltipKey) return;
    tooltipRelations.set(tooltipKey, relatedTooltipKeys);
  },

  // Hủy đăng ký một tooltip
  unregisterTooltip(tooltipKey) {
    if (!tooltipKey) return;
    tooltipRelations.delete(tooltipKey);
  },

  // Kiểm tra xem click có được phép cho tooltip không
  isClickAllowedForTooltip(currentTooltipKey, clickedTooltipKey) {
    if (!currentTooltipKey || !clickedTooltipKey) return false;

    // Nếu click vào chính tooltip đó
    if (currentTooltipKey === clickedTooltipKey) return true;

    // Nếu click vào một trong các tooltip được phép tương tác
    const allowedKeys = tooltipRelations.get(currentTooltipKey) || [];
    return allowedKeys.includes(clickedTooltipKey);
  },

  // Lấy tooltip key từ event target
  getTooltipKeyFromEvent(event) {
    const tooltipElement = event.target.closest("[data-tooltip-key]");
    return tooltipElement?.dataset.tooltipKey;
  },
};

export default TooltipManager;
