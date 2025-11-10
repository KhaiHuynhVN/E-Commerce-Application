import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { authActions, authSelectors, cartSelectors } from "@/store/slices";
import { Button } from "@/commonComponents";
import { Icons } from "@/assets";
import { languageConstants } from "@/utils";
import routeConfigs from "@/routeConfigs";
import useHeader from "./useHeader";

import styles from "./Header.module.scss";

const cx = classNames.bind(styles);

const Header = () => {
  const { t, i18n } = useTranslation();
  const { wrapperRef } = useHeader({ cx });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector(authSelectors.user);
  const token = useSelector(authSelectors.token);
  const cartItemsCount = useSelector(cartSelectors.cartItemsCount);

  // Xử lý logout
  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate(routeConfigs.login.path);
  };

  // Navigate to cart page
  const handleGoToCart = () => {
    navigate(routeConfigs.cart.path);
  };

  // Navigate to products page
  const handleGoToProducts = () => {
    navigate(routeConfigs.products.path);
  };

  // Thay đổi ngôn ngữ
  const handleChangeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <header
      ref={wrapperRef}
      className={cx(
        "wrapper",
        "bg-white shadow-md z-10 min-h-(--header-height)"
      )}
    >
      <div
        className={cx(
          "container",
          "mx-auto px-6 h-full flex items-center justify-between"
        )}
      >
        {/* Logo/Brand */}
        <div
          className={cx("logo", "flex items-center gap-2 cursor-pointer")}
          onClick={handleGoToProducts}
        >
          <Icons.CartIcon width="32" height="32" className={cx("logoIcon")} />
          <h1 className={cx("brandName", "text-2xl font-bold")}>
            {t("header.brandName")}
          </h1>
        </div>

        {/* Navigation */}
        <nav className={cx("nav", "flex items-center gap-6")}>
          {/* Cart Button */}
          <button
            onClick={handleGoToCart}
            className={cx("cartButton", "relative")}
            aria-label={t("header.cart")}
          >
            <Icons.CartIcon width="24" height="24" />
            {cartItemsCount > 0 && (
              <span className={cx("badge", "absolute")}>
                {cartItemsCount > 99 ? "99+" : cartItemsCount}
              </span>
            )}
          </button>

          {/* Language Selector */}
          <div className={cx("languageSelector", "flex items-center gap-2")}>
            <Button
              onClick={() => handleChangeLanguage(languageConstants.EN)}
              styleType="quaternary"
              className={i18n.language === languageConstants.EN ? "active" : ""}
              aria-label={t("languages.english")}
            >
              {t("languages.english")}
            </Button>
            <span className={cx("separator")}>|</span>
            <Button
              onClick={() => handleChangeLanguage(languageConstants.VI)}
              styleType="quaternary"
              className={i18n.language === languageConstants.VI ? "active" : ""}
              aria-label={t("languages.vietnamese")}
            >
              {t("languages.vietnamese")}
            </Button>
          </div>

          {/* User Info */}
          {user ? (
            <div className={cx("userInfo", "flex items-center gap-3")}>
              {user.image && (
                <img
                  src={user.image}
                  alt={user.username}
                  className={cx(
                    "avatar",
                    "w-10 h-10 rounded-full object-cover"
                  )}
                />
              )}
              <span className={cx("username")}>
                {user.firstName} {user.lastName}
              </span>
            </div>
          ) : token ? (
            // Skeleton loading khi đang restore user
            <div className={cx("userInfo", "flex items-center gap-3")}>
              <div
                className={cx("placeholder", "w-[30px] h-[30px] rounded-full!")}
              />
              <div className={cx("placeholder", "w-[50px] h-[20px]")} />
            </div>
          ) : null}

          {/* Logout Button */}
          <Button
            styleType="primary"
            onClick={handleLogout}
            className="px-6 py-2"
          >
            {t("header.logout")}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
