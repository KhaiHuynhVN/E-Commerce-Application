import classNames from "classnames/bind";
import { createPortal } from "react-dom";

import useGlobalLoader from "./useGlobalLoader";

import styles from "./GlobalLoader.module.scss";

const cx = classNames.bind(styles);

type GlobalLoaderProps = {
  isSuspenseFallBack?: boolean;
};

const GlobalLoader = ({ isSuspenseFallBack = false }: GlobalLoaderProps) => {
  const { isRender, wrapperRef, isLoading, handleHideLoader } = useGlobalLoader(
    {
      isSuspenseFallBack,
      cx,
    }
  );

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
          }
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
      document.body
    )
  );
};

export default GlobalLoader;
