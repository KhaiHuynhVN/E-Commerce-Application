import classNames from "classnames/bind";
import styles from "./LoginPage.module.scss";

const cx = classNames.bind(styles);

const LoginPage = () => {
  return (
    <div className={cx("container")}>
      <div className={cx("loginBox")}>
        <h1 className={cx("title")}>Welcome Back</h1>

        <form className={cx("form")}>
          <div className={cx("formGroup")}>
            <input type="email" placeholder="Email" className={cx("input")} />
          </div>

          <div className={cx("formGroup")}>
            <input
              type="password"
              placeholder="Password"
              className={cx("input")}
            />
          </div>

          <button type="submit" className={cx("submitButton")}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
