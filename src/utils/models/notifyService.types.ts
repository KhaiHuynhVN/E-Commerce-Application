// =====================================================
// TYPE DEFINITIONS - Định nghĩa các kiểu dữ liệu cho NotifyService
// =====================================================

/** Các loại thông báo có thể hiển thị */
type NotifyType = "info" | "success" | "warning" | "error" | "reject";

/** Các vị trí có thể hiển thị thông báo */
type NotifyPlacement =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

/** Trạng thái của promise notification */
type PromiseState = "pending" | "fulfilled" | "rejected";

/** Kết quả trả về khi tạo một notification mới */
interface NotificationResult {
  /** ID của thông báo */
  id: number;
  /** Vị trí của thông báo */
  placement: NotifyPlacement;
}

/** Icon tùy chỉnh cho từng loại thông báo */
interface CustomIcons {
  /** Icon tùy chỉnh cho thông báo kiểu info */
  info?: React.ReactNode;
  /** Icon tùy chỉnh cho thông báo kiểu success */
  success?: React.ReactNode;
  /** Icon tùy chỉnh cho thông báo kiểu warning */
  warning?: React.ReactNode;
  /** Icon tùy chỉnh cho thông báo kiểu error */
  error?: React.ReactNode;
  /** Icon tùy chỉnh cho thông báo kiểu reject */
  reject?: React.ReactNode;
}

/** Các tùy chọn khi tạo một notification */
interface NotifyOptions {
  /** Key unique để track notification */
  key?: string | null;
  /** Flag để đánh dấu là recall do timeout */
  isRecall?: boolean;
  /** Loại thông báo */
  type?: NotifyType;
  /** Thời gian hiển thị thông báo (ms) */
  duration?: number;
  /** Thêm thông báo mới lên trên cùng */
  newItemOnTop?: boolean;
  /** Tạm dừng khi hover */
  pauseOnHover?: boolean;
  /** Hiển thị thanh tiến trình */
  showProgressBar?: boolean;
  /** Chiều rộng tối đa của thông báo */
  maxWidth?: number;
  /** Chiều rộng của thông báo */
  width?: string | number;
  /** Chiều cao tối đa của thông báo */
  maxHeight?: number | string;
  /** Thời gian hiển thị animation (s) */
  showDuration?: number;
  /** Thời gian ẩn animation (s) */
  hideDuration?: number;
  /** Thời gian transition (s) */
  transitionDuration?: number;
  /** Hàm thời gian transition */
  transitionTimingFunction?: string;
  /** Thời gian delay transition (s) */
  transitionDelay?: number;
  /** Vị trí hiển thị thông báo */
  placement?: NotifyPlacement;
  /** Có stack thông báo hay không */
  stack?: boolean;
  /** Khoảng cách giữa các thông báo (px) */
  itemSpacing?: number;
  /** Khoảng cách ngang của các thông báo (px) */
  spacingX?: number;
  /** Khoảng cách dọc của các thông báo (px) */
  spacingY?: number;
  /** Số lượng thông báo tối thiểu để stack */
  maxStack?: number;
  /** Đóng băng khi hover */
  freezeOnHover?: boolean;
  /** Không đóng toast cho đến khi user click vào close button */
  immortal?: boolean;
  /** Số lượng thông báo tối đa */
  maxSize?: number;
  /** Có promise hay không */
  promise?: boolean;
  /** Icon custom */
  customIcons?: CustomIcons | null;
}

/** Thông tin đầy đủ của một notification */
interface Notification {
  /** ID unique của notification */
  id: number;
  /** Nội dung thông báo */
  message: string | React.ReactNode;
  /** Loại thông báo */
  type: NotifyType;
  /** Thời gian hiển thị thông báo (ms) */
  duration: number;
  /** Thêm thông báo mới lên trên cùng */
  newItemOnTop: boolean;
  /** Tạm dừng khi hover */
  pauseOnHover: boolean;
  /** Hiển thị thanh tiến trình */
  showProgressBar: boolean;
  /** Chiều rộng tối đa của thông báo */
  maxWidth: number;
  /** Chiều rộng của thông báo */
  width: string | number;
  /** Chiều cao tối đa của thông báo */
  maxHeight: number | string;
  /** Thời gian hiển thị animation (s) */
  showDuration: number;
  /** Thời gian ẩn animation (s) */
  hideDuration: number;
  /** Thời gian transition (s) */
  transitionDuration: number;
  /** Hàm thời gian transition */
  transitionTimingFunction: string;
  /** Thời gian delay transition (s) */
  transitionDelay: number;
  /** Vị trí hiển thị thông báo */
  placement: NotifyPlacement;
  /** Có stack thông báo hay không */
  stack: boolean;
  /** Khoảng cách giữa các thông báo (px) */
  itemSpacing: number;
  /** Khoảng cách ngang của các thông báo (px) */
  spacingX: number;
  /** Khoảng cách dọc của các thông báo (px) */
  spacingY: number;
  /** Số lượng thông báo tối thiểu để stack */
  maxStack: number;
  /** Đóng băng khi hover */
  freezeOnHover: boolean;
  /** Không đóng toast cho đến khi user click vào close button */
  immortal: boolean;
  /** Số lượng thông báo tối đa */
  maxSize: number;
  /** Có promise hay không */
  promise: boolean;
  /** Trạng thái promise (nếu là promise notification) */
  promiseState: PromiseState | null;
  /** Icon custom */
  customIcons: CustomIcons | null;
  /** Chiều cao thực tế sau khi render */
  height?: number;
}

/** Kích thước của một notification */
interface NotificationDimensions {
  /** Chiều rộng */
  width: number;
  /** Chiều cao */
  height: number;
}

/** Map chứa notifications theo từng vị trí */
type NotificationsMap = Record<NotifyPlacement, Notification[]>;

/** Map chứa trạng thái frozen theo từng vị trí */
type FrozenPlacementsMap = Record<NotifyPlacement, boolean>;

/** Map chứa kích thước của các notifications */
type NotificationDimensionsMap = Record<number, NotificationDimensions>;

/** Map chứa promise states theo vị trí và ID */
type PromiseStatesMap = Record<NotifyPlacement, Record<number, PromiseState>>;

/** Map chứa thời gian transition khi hover theo vị trí */
type HoverTransitionsMap = Record<NotifyPlacement, number>;

/** Map chứa maxSize theo vị trí */
type MaxSizeMap = Record<NotifyPlacement, number>;

/** Map chứa queue notifications theo vị trí */
type NotificationQueueMap = Record<NotifyPlacement, Notification[]>;

/** Data được gửi đến listeners */
interface NotifyListenerData {
  notifications: NotificationsMap;
  frozenPlacements: FrozenPlacementsMap;
  notificationDimensions: NotificationDimensionsMap;
  promiseStates: PromiseStatesMap;
  hoverTransitions: HoverTransitionsMap;
  updatedId?: number;
  resetProgress?: boolean;
  updatedHoverTransition?: {
    placement: NotifyPlacement;
    duration: number;
  };
}

/** Function listener để nhận updates */
type NotifyListener = (data: NotifyListenerData) => void;

/** Thông tin bổ sung khi emit events */
interface EmitAdditionalInfo {
  updatedId?: number;
  resetProgress?: boolean;
  updatedHoverTransition?: {
    placement: NotifyPlacement;
    duration: number;
  };
}

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
