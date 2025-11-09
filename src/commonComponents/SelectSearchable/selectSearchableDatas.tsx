import classNames from "classnames/bind";

import styles from "./SelectSearchable.module.scss";

const cx = classNames.bind(styles);

const createPlaceholderOptions = (length = 8) => {
   return Array.from({ length }, (_, i) => ({
      label: <div className={cx("placeholder-skeleton")}></div>,
      value: i.toString(),
   }));
};

export { createPlaceholderOptions };
