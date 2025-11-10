import classNames from "classnames/bind";

import { Header } from "../components";

import styles from "./HeaderOnlyLayout.module.scss";

const cx = classNames.bind(styles);

type HeaderOnlyLayoutProps = {
  children: React.ReactNode;
};

const HeaderOnlyLayout = ({ children }: HeaderOnlyLayoutProps) => {
  return (
    <div className={cx("wrapper", "bg-octonary-color")}>
      <Header />
      <div
        className={cx(
          "content",
          "mt-[16px] min-h-[calc(100vh-var(--header-height)-var(--sidebar-modal-gutter-top))]"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default HeaderOnlyLayout;
