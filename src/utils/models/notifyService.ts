import type {
  NotifyType,
  NotifyPlacement,
  PromiseState,
  NotificationResult,
  CustomIcons,
  NotifyOptions,
  Notification,
  NotificationDimensions,
  NotificationsMap,
  FrozenPlacementsMap,
  NotificationDimensionsMap,
  PromiseStatesMap,
  HoverTransitionsMap,
  MaxSizeMap,
  NotificationQueueMap,
  NotifyListenerData,
  NotifyListener,
  EmitAdditionalInfo,
} from "./notifyService.types";

// Export lại các types để có thể import từ file này
export type {
  NotifyType,
  NotifyPlacement,
  PromiseState,
  NotificationResult,
  CustomIcons,
  NotifyOptions,
  Notification,
  NotificationDimensions,
  NotificationsMap,
  FrozenPlacementsMap,
  NotificationDimensionsMap,
  PromiseStatesMap,
  HoverTransitionsMap,
  MaxSizeMap,
  NotificationQueueMap,
  NotifyListenerData,
  NotifyListener,
  EmitAdditionalInfo,
};

// =====================================================
// NOTIFY SERVICE CLASS - Lớp quản lý thông báo
// =====================================================

/**
 * Lớp quản lý các thông báo
 * @class
 */
class NotifyService {
  /** Set chứa các listener functions */
  private listeners: Set<NotifyListener>;

  /** Map chứa danh sách notifications theo từng vị trí */
  private notifications: NotificationsMap;

  /** ID counter cho notifications */
  private id: number;

  /** Số lượng tối đa notifications có thể stack */
  private maxStack: number;

  /** Map chứa trạng thái frozen theo từng vị trí */
  private frozenPlacements: FrozenPlacementsMap;

  /** Map chứa kích thước của các notifications */
  private notificationDimensions: NotificationDimensionsMap;

  /** Map chứa số lượng tối đa notifications theo từng vị trí */
  private maxSize: MaxSizeMap;

  /** Map chứa hàng đợi notifications theo từng vị trí */
  private notificationQueue: NotificationQueueMap;

  /** Map chứa trạng thái promise theo vị trí và ID */
  private promiseStates: PromiseStatesMap;

  /** Map chứa thời gian transition khi hover theo vị trí */
  private hoverTransitions: HoverTransitionsMap;

  /** Map để tra cứu ID từ key */
  private keyToIdMap: Map<string, number>;
  /**
   * Khởi tạo service quản lý thông báo
   * @constructor
   */
  constructor() {
    this.listeners = new Set();
    this.notifications = {
      "top-left": [],
      "top-right": [],
      "bottom-left": [],
      "bottom-right": [],
      "top-center": [],
      "bottom-center": [],
    };
    this.id = 0;
    this.maxStack = 3;
    this.frozenPlacements = {
      "top-left": false,
      "top-right": false,
      "bottom-left": false,
      "bottom-right": false,
      "top-center": false,
      "bottom-center": false,
    };
    this.notificationDimensions = {};
    this.maxSize = {
      "top-left": Infinity,
      "top-right": Infinity,
      "bottom-left": Infinity,
      "bottom-right": Infinity,
      "top-center": Infinity,
      "bottom-center": Infinity,
    };
    this.notificationQueue = {
      "top-left": [],
      "top-right": [],
      "bottom-left": [],
      "bottom-right": [],
      "top-center": [],
      "bottom-center": [],
    };
    this.promiseStates = {
      "top-left": {},
      "top-right": {},
      "bottom-left": {},
      "bottom-right": {},
      "top-center": {},
      "bottom-center": {},
    };
    this.hoverTransitions = {
      "top-left": 300,
      "top-right": 300,
      "bottom-left": 300,
      "bottom-right": 300,
      "top-center": 300,
      "bottom-center": 300,
    };
    this.keyToIdMap = new Map();
  }

  /**
   * Thêm một thông báo mới
   * @param message - Nội dung thông báo
   * @param options - Các tùy chọn cho thông báo
   * @returns Một object chứa id và placement của thông báo mới
   */
  addNotification(
    message: string | React.ReactNode,
    options: NotifyOptions = {
      key: null,
      isRecall: false,
      type: "info",
      duration: 3000,
      newItemOnTop: false,
      pauseOnHover: false,
      showProgressBar: false,
      maxWidth: 300,
      width: "max-content",
      maxHeight: "none",
      showDuration: 0.6,
      hideDuration: 0.6,
      transitionDuration: 0.3,
      transitionTimingFunction: "ease",
      placement: "top-right",
      itemSpacing: 12,
      spacingX: 12,
      spacingY: 12,
      stack: false,
      maxStack: 3,
      freezeOnHover: false,
      immortal: false,
      maxSize: Infinity,
      promise: false,
      customIcons: null,
    }
  ): NotificationResult {
    // Định nghĩa các giá trị mặc định cho options
    const defaultOptions: Required<NotifyOptions> = {
      key: null,
      isRecall: false,
      type: "info" as NotifyType,
      duration: 3000,
      newItemOnTop: false,
      pauseOnHover: false,
      showProgressBar: false,
      maxWidth: 300,
      width: "max-content",
      maxHeight: "none",
      showDuration: 0.6,
      hideDuration: 0.6,
      transitionDuration: 0.3,
      transitionTimingFunction: "ease",
      transitionDelay: 0,
      placement: "top-right" as NotifyPlacement,
      itemSpacing: 12,
      spacingX: 12,
      spacingY: 12,
      stack: false,
      maxStack: 3,
      freezeOnHover: false,
      immortal: false,
      maxSize: Infinity,
      promise: false,
      customIcons: null,
    };
    // Merge options với default options
    const mergedOptions = { ...defaultOptions, ...options };
    const { key, isRecall } = mergedOptions;

    // Kiểm tra nếu đã có notification với key này
    if (key && isRecall && this.keyToIdMap.has(key)) {
      const existingId = this.keyToIdMap.get(key)!;
      const exists = Object.values(this.notifications).some((notifications) =>
        notifications.some((n) => n.id === existingId)
      );
      if (exists) {
        return {
          id: existingId,
          placement: this.getNotificationPlacement(existingId)!,
        };
      } else {
        this.keyToIdMap.delete(key);
      }
    }

    // Tạo ID mới cho notification
    const id = ++this.id;

    // Lưu key để track notification nếu có
    if (key) {
      this.keyToIdMap.set(key, id);
    }

    const {
      type,
      duration,
      newItemOnTop,
      pauseOnHover,
      showProgressBar,
      maxWidth,
      width,
      maxHeight,
      showDuration,
      hideDuration,
      transitionDuration,
      transitionTimingFunction,
      transitionDelay,
      placement,
      itemSpacing,
      spacingX,
      spacingY,
      stack,
      maxStack,
      freezeOnHover,
      immortal,
      maxSize,
      promise,
      customIcons,
    } = mergedOptions;

    // Cập nhật maxStack toàn cục nếu được chỉ định
    if (maxStack !== undefined) {
      this.maxStack = maxStack;
    }

    // Cập nhật maxSize cho placement nếu được chỉ định
    if (typeof maxSize === "number" && maxSize > 0) {
      this.maxSize[placement] = maxSize;
    }

    // Tạo notification object mới
    const newNotification: Notification = {
      id,
      message,
      type,
      duration,
      pauseOnHover,
      showProgressBar,
      newItemOnTop,
      maxWidth,
      width,
      maxHeight,
      showDuration,
      hideDuration,
      transitionDuration,
      transitionTimingFunction,
      transitionDelay,
      placement,
      itemSpacing,
      spacingX,
      spacingY,
      stack,
      maxStack: this.maxStack,
      freezeOnHover,
      immortal,
      maxSize: this.maxSize[placement],
      promise,
      promiseState: promise ? "pending" : null,
      customIcons,
    };

    const placementNotifications = this.notifications[placement];

    if (placementNotifications.length >= this.maxSize[placement]) {
      // Nếu đã đạt đến maxSize, thêm vào hàng đợi
      this.queueNotification(newNotification);
    } else {
      this.addNotificationToPlacement(newNotification);
    }

    if (promise) {
      this.promiseStates[placement][id] = "pending";
    }

    this.emit();

    return { id, placement };
  }

  /**
   * Thêm thông báo vào vị trí cụ thể
   * @private
   * @param notification - Thông báo cần thêm
   * @returns void
   */
  private addNotificationToPlacement(notification: Notification): void {
    const { placement, newItemOnTop } = notification;
    // Thêm vào đầu danh sách nếu newItemOnTop = true, ngược lại thêm vào cuối
    if (newItemOnTop) {
      this.notifications[placement].unshift(notification);
    } else {
      this.notifications[placement].push(notification);
    }
  }

  /**
   * Đặt thời gian chuyển đổi khi hover cho một vị trí cụ thể
   * @param placement - Vị trí cần đặt
   * @param duration - Thời gian chuyển đổi (ms)
   */
  setHoverTransition(placement: NotifyPlacement, duration: number): void {
    this.hoverTransitions[placement] = duration;
    this.emit({ updatedHoverTransition: { placement, duration } });
  }

  /**
   * Cập nhật các thuộc tính của một thông báo
   * @param id - ID của thông báo cần cập nhật
   * @param updates - Các thuộc tính cần cập nhật
   * @returns Trả về true nếu cập nhật thành công, ngược lại trả về false
   */
  updateNotification(id: number, updates: Partial<Notification>): boolean {
    let updated = false;
    let resetProgress = false;
    let updatedNotification: Notification | null = null;

    // Duyệt qua tất cả các vị trí để tìm notification cần cập nhật
    (Object.keys(this.notifications) as NotifyPlacement[]).forEach(
      (placement) => {
        const index = this.notifications[placement].findIndex(
          (notification) => notification.id === id
        );
        if (index !== -1) {
          updatedNotification = { ...this.notifications[placement][index] };

          // Cập nhật các thuộc tính
          for (const [key, value] of Object.entries(updates) as Array<
            [keyof Notification, Notification[keyof Notification]]
          >) {
            if (value !== undefined) {
              if (key === "promise") {
                // Nếu đang cập nhật từ promise sang promise, giữ nguyên trạng thái
                if (updatedNotification.promise && value) {
                  continue;
                }
                // Nếu chuyển từ non-promise sang promise, đặt trạng thái là 'pending'
                if (value && !updatedNotification.promise) {
                  updatedNotification.promiseState = "pending";
                }
              }
              // Cập nhật property một cách type-safe
              (updatedNotification[key] as typeof value) = value;
              updated = true;

              if (key === "duration" && !updatedNotification.promise) {
                resetProgress = true;
              }
            }
          }

          this.notifications[placement][index] = updatedNotification;
        }
      }
    );

    if (updated) {
      this.emit({ updatedId: id, resetProgress });
    }

    return updated;
  }

  /**
   * Cập nhật trạng thái promise của một thông báo
   * @param params - Các tham số để cập nhật trạng thái promise
   */
  updatePromiseState({
    id,
    state,
    placement,
  }: {
    id: number;
    state: PromiseState;
    placement: NotifyPlacement;
  }): void {
    // Kiểm tra và cập nhật trạng thái promise
    if (this.promiseStates[placement] && this.promiseStates[placement][id]) {
      this.promiseStates[placement][id] = state;
      const notificationIndex = this.notifications[placement].findIndex(
        (n) => n.id === id
      );
      if (notificationIndex !== -1) {
        this.notifications[placement][notificationIndex].promiseState = state;
      }
      this.emit();
    }
  }

  /**
   * Thêm thông báo vào hàng đợi
   * @private
   * @param notification - Thông báo cần thêm vào hàng đợi
   * @returns void
   */
  private queueNotification(notification: Notification): void {
    const { placement } = notification;
    // Thêm notification vào hàng đợi của vị trí tương ứng
    this.notificationQueue[placement].push(notification);
  }

  /**
   * Đặt trạng thái đóng băng cho một vị trí thông báo cụ thể
   * @param placement - Vị trí thông báo
   * @param isFrozen - Trạng thái đóng băng
   * @param notificationId - ID của thông báo
   */
  setPlacementFrozen(
    placement: NotifyPlacement,
    isFrozen: boolean,
    notificationId: number
  ): void {
    // Chỉ đóng băng nếu notification có freezeOnHover = true
    if (
      this.notifications[placement].some(
        (notification) =>
          notification.id === notificationId && notification.freezeOnHover
      )
    ) {
      this.frozenPlacements[placement] = isFrozen;
      this.emit();
    }
  }

  /**
   * Cập nhật kích thước của một thông báo
   * @param id - ID của thông báo cần cập nhật
   * @param width - Chiều rộng mới của thông báo
   * @param height - Chiều cao mới của thông báo
   */
  updateNotificationDimensions(
    id: number,
    width: number,
    height: number
  ): void {
    // Lưu kích thước vào map
    this.notificationDimensions[id] = { width, height };
    // Cập nhật kích thước trong notification objects
    (Object.keys(this.notifications) as NotifyPlacement[]).forEach(
      (placement) => {
        const notificationIndex = this.notifications[placement].findIndex(
          (notification) => notification.id === id
        );
        if (notificationIndex !== -1) {
          this.notifications[placement][notificationIndex].width = width;
          this.notifications[placement][notificationIndex].height = height;
        }
      }
    );
    this.emit();
  }

  /**
   * Xóa một thông báo theo ID
   * @param id - ID của thông báo cần xóa
   */
  removeNotification(id: number): void {
    let removedPlacement: NotifyPlacement | null = null;
    // Tìm và xóa notification khỏi vị trí của nó
    (Object.keys(this.notifications) as NotifyPlacement[]).forEach(
      (placement) => {
        const index = this.notifications[placement].findIndex(
          (notification) => notification.id === id
        );
        if (index !== -1) {
          this.notifications[placement].splice(index, 1);
          removedPlacement = placement;

          // Xóa trạng thái promise của thông báo này
          if (
            this.promiseStates[placement] &&
            this.promiseStates[placement][id]
          ) {
            delete this.promiseStates[placement][id];
          }
        }
      }
    );

    // Nếu đã xóa, kiểm tra và thêm notification từ hàng đợi
    if (removedPlacement) {
      this.checkAndAddFromQueue(removedPlacement);
    }

    // Xóa kích thước của notification
    delete this.notificationDimensions[id];
    this.emit();

    // Xóa key mapping nếu có
    for (const [key, value] of this.keyToIdMap.entries()) {
      if (value === id) {
        this.keyToIdMap.delete(key);
        break;
      }
    }
  }

  /**
   * Kiểm tra và thêm thông báo từ hàng đợi vào một vị trí cụ thể
   * @private
   * @param placement - Vị trí cần kiểm tra
   * @returns void
   */
  private checkAndAddFromQueue(placement: NotifyPlacement): void {
    // Nếu còn chỗ trống và có notification trong queue, thêm vào
    if (
      this.notificationQueue[placement].length > 0 &&
      this.notifications[placement].length < this.maxSize[placement]
    ) {
      const nextNotification = this.notificationQueue[placement].shift();
      if (nextNotification) {
        this.addNotificationToPlacement(nextNotification);
      }
    }
  }

  /**
   * Đăng ký một listener để nhận cập nhật về thông báo
   * @param listener - Hàm listener nhận một đối tượng chứa thông tin về notifications và frozenPlacements
   * @returns Hàm để hủy đăng ký listener
   */
  subscribe(listener: NotifyListener): () => void {
    this.listeners.add(listener);
    // Trả về function để unsubscribe
    return () => this.listeners.delete(listener);
  }

  /**
   * Gửi cập nhật đến tất cả các listener đã đăng ký
   * @private
   * @param additionalInfo - Thông tin bổ sung để gửi đến listeners
   * @returns void
   */
  private emit(additionalInfo: EmitAdditionalInfo = {}): void {
    // Gửi thông tin cập nhật đến tất cả listeners
    this.listeners.forEach((listener) =>
      listener({
        notifications: { ...this.notifications },
        frozenPlacements: { ...this.frozenPlacements },
        notificationDimensions: { ...this.notificationDimensions },
        promiseStates: { ...this.promiseStates },
        hoverTransitions: { ...this.hoverTransitions },
        ...additionalInfo,
      })
    );
  }

  /**
   * Lấy vị trí hiển thị của một thông báo dựa trên ID
   * @param id - ID của thông báo cần tìm vị trí
   * @returns Vị trí hiển thị của thông báo, hoặc null nếu không tìm thấy
   */
  getNotificationPlacement(id: number): NotifyPlacement | null {
    // Duyệt qua tất cả các vị trí để tìm notification
    for (const [placement, notifications] of Object.entries(
      this.notifications
    )) {
      if (notifications.some((n) => n.id === id)) {
        return placement as NotifyPlacement;
      }
    }
    return null;
  }
}

// =====================================================
// EXPORT - Xuất instance singleton
// =====================================================

/** Instance singleton của NotifyService */
const notifyService = new NotifyService();
export default notifyService;
