import classNames from "classnames/bind";
import propTypes from "prop-types";

import { Header } from "../components";

import styles from "./HeaderOnlyLayout.module.scss";

const cx = classNames.bind(styles);

const HeaderOnlyLayout = ({ children }) => {
   return (
      <div className={cx("wrapper", "bg-octonary-color")}>
         <Header />
         <div className={cx("content", "mt-[16px] min-h-[calc(100vh-var(--header-height)-var(--sidebar-modal-gutter-top))]")}>
            {children}
         </div>
      </div>
   );
};

HeaderOnlyLayout.propTypes = {
   children: propTypes.node.isRequired,
};

export default HeaderOnlyLayout;
