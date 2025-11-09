import Draggable from "react-draggable";
import propTypes from "prop-types";
import classNames from "classnames/bind";
import { Modal as AntdModal } from "antd";
import { memo, useCallback, useRef, useState } from "react";

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
}) => {
   const [position, setPosition] = useState({ x: 0, y: 0 });
   const [bounds, setBounds] = useState({
      left: 0,
      top: 0,
      bottom: 0,
      right: 0,
   });

   const draggleRef = useRef(null);
   const draggableRef = useRef(null);

   const onStart = useCallback((event, uiData) => {
      const documentElement = window.document.documentElement;
      const { clientWidth, clientHeight } = documentElement;
      const targetRect = draggleRef.current.getBoundingClientRect();

      setBounds({
         left: -targetRect.left + uiData.x,
         right: clientWidth - (targetRect.right - uiData.x),
         top: -targetRect.top + uiData.y,
         bottom: clientHeight - (targetRect.bottom - uiData.y),
      });
   }, []);

   const onStop = useCallback((e, data) => {
      const { x, y } = data;
      setPosition({ x, y });
   }, []);

   const afterCloseHandle = useCallback(() => {
      !showModal && resetPositionWhenClose && setPosition({ x: 0, y: 0 });
      handleAfterClose && handleAfterClose();
   }, [showModal, resetPositionWhenClose, handleAfterClose]);

   const afterOpenChangeHandle = useCallback(
      (isOpen) => {
         document.body.classList.toggle("modal-open", isOpen);
         document.body.classList.toggle("mask-modal-visible", isOpen);
         handleAfterOpen && handleAfterOpen(isOpen);
      },
      [handleAfterOpen],
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
               ref={draggableRef}
               position={position}
               bounds={bounds}
               onStart={(event, uiData) => onStart(event, uiData)}
               onStop={(e, data) => onStop(e, data)}
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

GlobalModal.propTypes = {
   children: propTypes.node.isRequired,
   className: propTypes.string,
   rootClassName: propTypes.string,
   showModal: propTypes.bool,
   closeOutside: propTypes.bool,
   centered: propTypes.bool,
   handleOk: propTypes.func,
   handleCancel: propTypes.func,
   handleAfterClose: propTypes.func,
   handleAfterOpen: propTypes.func,
   footer: propTypes.object,
   closeIcon: propTypes.node,
   draggableTarget: propTypes.string,
   disableDrag: propTypes.bool,
   resetPositionWhenClose: propTypes.bool,
   style: propTypes.object,
   mask: propTypes.bool,
};

export default memo(GlobalModal);
