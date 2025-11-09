import classNames from "classnames/bind";
import { createPortal } from "react-dom";
import propTypes from "prop-types";

import useLoader from "./useGlobalLoader";

import styles from "./GlobalLoader.module.scss";

const cx = classNames.bind(styles);

const GlobalLoader = ({ isSuspenseFallBack = false }) => {
   const { isRender, wrapperRef, isLoading, handleHideLoader } = useLoader({ isSuspenseFallBack, cx });

   return (
      isRender &&
      createPortal(
         <div
            ref={wrapperRef}
            className={cx(
               "wrapper",
               "fixed inset-0 z-[1] flex flex-col items-center justify-center backdrop-blur-[2px] bg-eleventh-color",
               {
                  hide: !isLoading,
               },
            )}
            onAnimationEnd={handleHideLoader}
         >
            <div className={cx("container")}>
               <div className={cx("item")}></div>
               <div className={cx("item")}></div>
               <div className={cx("item")}></div>
               <div className={cx("item")}></div>
               <div className={cx("item")}></div>
            </div>
         </div>,
         document.body,
      )
   );
};

GlobalLoader.propTypes = {
   isSuspenseFallBack: propTypes.bool,
};

export default GlobalLoader;
