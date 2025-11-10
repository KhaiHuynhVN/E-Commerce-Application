import Draggable from "react-draggable";
import classNames from "classnames/bind";
import { Modal as AntdModal } from "antd";
import { memo, useCallback, useRef, useState, type ReactElement } from "react";

import type {
  GlobalModalProps,
  Position,
  Bounds,
  DraggableData,
  DraggableEvent,
} from "./GlobalModal.types";

import styles from "./GlobalModal.module.scss";

const cx = classNames.bind(styles);

const GlobalModal = ({
  children,
  className,
  rootClassName,
  showModal = false,
  closeOutside = false,
  centered = false,
  handleOk = () => {},
  handleCancel = () => {},
  handleAfterClose = () => {},
  handleAfterOpen = () => {},
  footer = null,
  closeIcon = null,
  draggableTarget = `.${cx("modal-wrapper")}`,
  disableDrag = false,
  resetPositionWhenClose = false,
  style,
  mask = true,
}: GlobalModalProps): ReactElement => {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [bounds, setBounds] = useState<Bounds>({
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  });

  const draggleRef = useRef<HTMLDivElement>(null);

  const onStart = useCallback(
    (_event: DraggableEvent, uiData: DraggableData): void => {
      if (!draggleRef.current) return;

      const documentElement = window.document.documentElement;
      const { clientWidth, clientHeight } = documentElement;
      const targetRect = draggleRef.current.getBoundingClientRect();

      setBounds({
        left: -targetRect.left + uiData.x,
        right: clientWidth - (targetRect.right - uiData.x),
        top: -targetRect.top + uiData.y,
        bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
    },
    []
  );

  const onStop = useCallback(
    (_e: DraggableEvent, data: DraggableData): void => {
      const { x, y } = data;
      setPosition({ x, y });
    },
    []
  );

  const afterCloseHandle = useCallback((): void => {
    void (!showModal && resetPositionWhenClose && setPosition({ x: 0, y: 0 }));
    void (handleAfterClose && handleAfterClose());
  }, [showModal, resetPositionWhenClose, handleAfterClose]);

  const afterOpenChangeHandle = useCallback(
    (isOpen: boolean): void => {
      document.body.classList.toggle("modal-open", isOpen);
      document.body.classList.toggle("mask-modal-visible", isOpen);
      void (handleAfterOpen && handleAfterOpen(isOpen));
    },
    [handleAfterOpen]
  );

  return (
    <AntdModal
      className={cx("wrapper", className)}
      rootClassName={cx("root-wrapper", rootClassName)}
      closeIcon={closeIcon}
      open={showModal}
      style={style}
      centered={centered}
      modalRender={(modal) => (
        <Draggable
          disabled={disableDrag}
          position={position}
          bounds={bounds}
          onStart={(event: DraggableEvent, uiData: DraggableData) =>
            onStart(event, uiData)
          }
          onStop={(e: DraggableEvent, data: DraggableData) => onStop(e, data)}
          nodeRef={draggleRef}
          handle={draggableTarget}
        >
          <div className={cx("modal-wrapper")} ref={draggleRef}>
            {modal}
          </div>
        </Draggable>
      )}
      footer={footer}
      mask={mask}
      maskClosable={closeOutside}
      destroyOnHidden
      afterClose={afterCloseHandle}
      afterOpenChange={afterOpenChangeHandle}
      onOk={() => !footer && handleOk()}
      onCancel={handleCancel}
    >
      {children}
    </AntdModal>
  );
};

export default memo(GlobalModal);
