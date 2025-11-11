import { memo } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { Icons } from "@/assets";
import { Button } from "@/commonComponents";
import routeConfigs from "@/routeConfigs";
import useSidebar from "./useSidebar";

import styles from "./Sidebar.module.scss";

const cx = classNames.bind(styles);

type SidebarProps = {
  className?: string;
};

const Sidebar = ({ className }: SidebarProps) => {
  const { t } = useTranslation();
  const { isCollapsed, toggleSidebar } = useSidebar();

  // Navigation menu items
  const menuItems = [
    {
      key: "products",
      label: t("sidebar.products"),
      icon: <Icons.PackageIcon width="20" height="20" />,
      path: routeConfigs.products.path,
    },
    {
      key: "cart",
      label: t("sidebar.cart"),
      icon: <Icons.CartIcon width="20" height="20" />,
      path: routeConfigs.cart.path,
    },
  ];

  return (
    <aside
      className={cx(
        "wrapper",
        {
          collapsed: isCollapsed,
        },
        className,
        "bg-white shadow-lg transition-all duration-300"
      )}
    >
      {/* Toggle Button */}
      <Button
        className={cx("toggle-button")}
        onClick={toggleSidebar}
        styleType="tertiary"
        aria-label={isCollapsed ? t("sidebar.expand") : t("sidebar.collapse")}
      >
        {isCollapsed ? "›" : "‹"}
      </Button>
      <div className={cx("sidebar-content")}>
        {/* Menu Items */}
        <nav className={cx("nav", "flex flex-col gap-2")}>
          {menuItems.map((item) => (
            <NavLink
              key={item.key}
              to={item.path}
              className={({ isActive }) => cx("nav-link", { active: isActive })}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={cx("icon")}>{item.icon}</span>
              {!isCollapsed && (
                <span className={cx("label")}>{item.label}</span>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default memo(Sidebar);
