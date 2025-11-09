import classNames from "classnames/bind";

import useHeader from "./useHeader";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

const Header = () => {
  const { wrapperRef } = useHeader({ cx });

  return (
    <header
      ref={wrapperRef}
      className={cx("wrapper", "bg-nonary-color text-white-color z-[10]")}
    ></header>
  );
};

export default Header;
