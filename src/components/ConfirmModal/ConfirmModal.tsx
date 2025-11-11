import { memo } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { GlobalModal, InnerLoader } from "@/components";
import { Button } from "@/commonComponents";
import { Icons } from "@/assets";
import type { ConfirmModalProps } from "./ConfirmModal.types";

import styles from "./ConfirmModal.module.scss";

const cx = classNames.bind(styles);

const ConfirmModal = ({
  isOpen,
  title,
  message,
  type = "info",
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  isLoading = false,
  confirmButtonType = "primary",
  cancelButtonType = "tertiary",
  isDangerous = false,
}: ConfirmModalProps) => {
  const { t } = useTranslation();

  // Icon map với className inline
  const iconMap = {
    info: (
      <Icons.InfoIcon
        width="48"
        height="48"
        className="text-(--notify-info-color)"
      />
    ),
    warning: (
      <Icons.WarningIcon
        width="48"
        height="48"
        className="text-(--notify-warning-color)"
      />
    ),
    error: (
      <Icons.ErrorIcon
        width="48"
        height="48"
        className="text-(--notify-error-color)"
      />
    ),
    success: (
      <Icons.CheckedIcon
        width="48"
        height="48"
        className="text-(--notify-success-color)"
      />
    ),
  };

  // Tailwind classes cho background
  const iconBgClasses = {
    info: "bg-[var(--notify-info-color)]/10",
    warning: "bg-[var(--notify-warning-color)]/10",
    error: "bg-[var(--notify-error-color)]/10",
    success: "bg-[var(--notify-success-color)]/10",
  };

  return (
    <GlobalModal
      showModal={isOpen}
      handleCancel={onCancel}
      closeOutside={false}
      centered
      disableDrag
      footer={null}
      className={cx("confirm-modal")}
    >
      <div className="p-6 flex flex-col gap-4 items-center">
        {/* Icon */}
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-full mb-2 ${iconBgClasses[type]}`}
        >
          {iconMap[type]}
        </div>

        {/* Title */}
        {title && (
          <h3
            className={`text-[2rem] font-bold m-0 text-center ${
              isDangerous
                ? "text-(--notify-error-color)"
                : "text-(--fifteenth-color)"
            }`}
          >
            {title}
          </h3>
        )}

        {/* Message */}
        {message && (
          <p className="text-[1.6rem] text-(--tertiary-color) leading-relaxed m-0 text-center">
            {message}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-center mt-2 w-full">
          <Button
            styleType={cancelButtonType}
            onClick={onCancel}
            disabled={isLoading}
            className="min-w-[100px] flex-1"
          >
            {cancelText || t("common.cancel")}
          </Button>
          <Button
            styleType={isDangerous ? "septenary" : confirmButtonType}
            onClick={onConfirm}
            disabled={isLoading}
            className="min-w-[100px] flex-1"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <InnerLoader
                  size="20px"
                  circleClassName="stroke-current stroke-[6px]"
                />
                {t("common.loading")}
              </span>
            ) : (
              confirmText || t("common.confirm")
            )}
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
};

export default memo(ConfirmModal);
