import classNames from "classnames/bind";
import propTypes from "prop-types";
import { memo } from "react";

import styles from "./InnerLoader.module.scss";

const cx = classNames.bind(styles);

const InnerLoader = ({ className, circleClassName, size = "30px", onTransitionEnd }) => {
   return (
      <div style={{ "--size": size }} className={cx(className, "wrapper", "relative")} onTransitionEnd={onTransitionEnd}>
         <div className={cx("showbox")}>
            <div className={cx("loader")}>
               <svg className={cx("circular")} viewBox="25 25 50 50">
                  <circle
                     className={cx(circleClassName, "path")}
                     cx="50"
                     cy="50"
                     r="20"
                     fill="none"
                     strokeWidth="2"
                     strokeMiterlimit="10"
                  />
               </svg>
            </div>
         </div>
      </div>
   );
};

InnerLoader.propTypes = {
   className: propTypes.string,
   circleClassName: propTypes.string,
   size: propTypes.string,
   strokeWidth: propTypes.string,
   fill: propTypes.string,
   stroke: propTypes.string,
   onTransitionEnd: propTypes.func,
};

export default memo(InnerLoader);
