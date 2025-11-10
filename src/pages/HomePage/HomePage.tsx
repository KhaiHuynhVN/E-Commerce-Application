import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import classNames from "classnames/bind";

import { authActions, authSelectors } from "@/store/slices";
import { Button } from "@/commonComponents";
import routeConfigs from "@/routeConfigs";

import styles from "./HomePage.module.scss";

const cx = classNames.bind(styles);

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(authSelectors.user);

  // Xử lý logout
  const handleLogout = () => {
    dispatch(authActions.logout());
    navigate(routeConfigs.login.path);
  };

  return (
    <div className={cx("wrapper", "min-h-screen flex items-center justify-center p-4")}>
      <div
        className={cx(
          "card",
          "bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl text-center"
        )}
      >
        {/* Welcome Section */}
        <div className={cx("header", "mb-8")}>
          <h1 className={cx("title", "text-5xl font-bold mb-4")}>
            🎉 Welcome to E-Commerce App! 🎉
          </h1>
          <p className={cx("subtitle", "text-xl mb-4")}>
            You have successfully logged in!
          </p>
        </div>

        {/* User Info */}
        {user && (
          <div className={cx("userInfo", "mb-8 p-6 rounded-xl")}>
            <h2 className={cx("userTitle", "text-2xl font-bold mb-4")}>User Information</h2>
            <div className={cx("infoGrid", "grid grid-cols-2 gap-4 text-left")}>
              <div>
                <strong>Username:</strong> {user.username}
              </div>
              <div>
                <strong>Email:</strong> {user.email}
              </div>
              <div>
                <strong>First Name:</strong> {user.firstName}
              </div>
              <div>
                <strong>Last Name:</strong> {user.lastName}
              </div>
              <div>
                <strong>Gender:</strong> {user.gender}
              </div>
              <div>
                <strong>ID:</strong> {user.id}
              </div>
            </div>
            {user.image && (
              <div className={cx("userImage", "mt-6")}>
                <img
                  src={user.image}
                  alt={user.username}
                  className="w-32 h-32 rounded-full mx-auto object-cover"
                />
              </div>
            )}
          </div>
        )}

        {/* Logout Button */}
        <Button onClick={handleLogout} styleType="primary" className="px-8 py-3">
          Logout
        </Button>
      </div>
    </div>
  );
};

export default HomePage;

