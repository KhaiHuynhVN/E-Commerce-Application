import classNames from "classnames/bind";

import { Header, Sidebar } from "../components";

import styles from "./HeaderWithSidebarLayout.module.scss";

const cx = classNames.bind(styles);

type HeaderWithSidebarLayoutProps = {
  children: React.ReactNode;
};

const HeaderWithSidebarLayout = ({
  children,
}: HeaderWithSidebarLayoutProps) => {
  return (
    <div className={cx("wrapper", "bg-octonary-color min-h-screen")}>
      <Header />
      <div className={cx("container", "flex")}>
        <Sidebar />
        <main className={cx("content", "flex-1")}>{children}</main>
      </div>
    </div>
  );
};

export default HeaderWithSidebarLayout;
