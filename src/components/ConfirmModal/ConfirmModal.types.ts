import type { ButtonStyleType } from "@/utils";

type ConfirmModalType = "info" | "warning" | "error" | "success";

type ConfirmModalProps = {
  // Control modal visibility
  isOpen: boolean;

  // Content
  title?: string;
  message?: string;
  type?: ConfirmModalType; // Determines icon to display

  // Button texts (optional, defaults to translations)
  confirmText?: string;
  cancelText?: string;

  // Callbacks
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;

  // Loading state (for async operations)
  isLoading?: boolean;

  // Styling
  confirmButtonType?: ButtonStyleType;
  cancelButtonType?: ButtonStyleType;
  isDangerous?: boolean; // Red styling for dangerous actions
};

export type { ConfirmModalProps, ConfirmModalType };
