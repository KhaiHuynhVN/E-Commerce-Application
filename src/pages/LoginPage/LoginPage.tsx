import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import classNames from "classnames/bind";

import { createLoginSchema } from "@/utils";
import { authService, authTokenService, cartsService } from "@/services";
import {
  authActions,
  authSelectors,
  pendingManagerSelectors,
  cartActions,
} from "@/store/slices";
import { Input, Button } from "@/commonComponents";
import { InnerLoader } from "@/components";
import { Icons } from "@/assets";
import routeConfigs from "@/routeConfigs";

import styles from "./LoginPage.module.scss";

const cx = classNames.bind(styles);

interface LoginFormData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const token = useSelector(authSelectors.token);
  const isLoading = useSelector(pendingManagerSelectors.isLoginPending);

  // Local state để quản lý error
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Tạo schema với translation
  const loginSchema = createLoginSchema(t);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Redirect về products nếu đã đăng nhập
  useEffect(() => {
    if (token) {
      navigate(routeConfigs.products.path);
    }
  }, [token, navigate]);

  // Xử lý submit form
  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) return;

    try {
      setError(null);

      // Gọi API login
      const response = await authService.login(data);

      // Store access token và refresh token
      const { accessToken, refreshToken } = response;
      authTokenService.setTokens(accessToken, refreshToken);

      // Lưu thông tin user vào Redux
      dispatch(authActions.setAuth(response));

      // Fetch cart của user và lưu vào Redux
      try {
        const cartResponse = await cartsService.getUserCarts(response.id);
        // Lấy cart đầu tiên của user (active cart)
        if (cartResponse.carts.length > 0) {
          dispatch(cartActions.setCart(cartResponse.carts[0]));
        }
      } catch (cartError) {
        // Không fail login nếu fetch cart lỗi, chỉ log
        console.error("Failed to fetch cart:", cartError);
      }

      // Chuyển hướng về trang products
      navigate(routeConfigs.products.path);
    } catch (err: unknown) {
      // Lấy message từ server response
      let errorMessage = t("serverErrors.unknownError");

      // Type guard để check axios error
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };

        if (axiosError.response?.data?.message) {
          // Server trả về message - dịch nếu có key
          const serverMsg = axiosError.response.data.message.replace(/\./g, ""); // Remove dots
          const translationKey = `serverErrors.${serverMsg}`;
          errorMessage = t(translationKey, {
            defaultValue: axiosError.response.data.message,
          });
        } else if (axiosError.message) {
          errorMessage = axiosError.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={cx(
        "wrapper",
        "min-h-screen flex items-center justify-center p-4"
      )}
    >
      <div
        className={cx(
          "loginCard",
          "bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-1 min-w-[400px]"
        )}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={cx("title", "mb-2")}>{t("login.title")}</h1>
          <p className={cx("subtitle")}>{t("login.subtitle")}</p>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {/* Username Field */}
          <div>
            <label className={cx("label", "block mb-2")} htmlFor="username">
              {t("login.usernameLabel")}
            </label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder={t("login.username")}
              control={control as unknown as Control<FieldValues>}
              disabled={isLoading}
              styleType="primary"
            />
            {errors.username && (
              <span className={cx("errorText", "mt-1 block")}>
                {errors.username.message}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className={cx("label", "block mb-2")} htmlFor="password">
              {t("login.passwordLabel")}
            </label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                inputClassName="pr-[36px]!"
                placeholder={t("login.password")}
                control={control as unknown as Control<FieldValues>}
                disabled={isLoading}
                styleType="primary"
              />
              <Icons.EyeCloseIcon
                width="20"
                height="20"
                className={cx(
                  "absolute right-[12px] top-1/2 -translate-y-1/2",
                  {
                    hidden: showPassword,
                  }
                )}
                onClick={handleTogglePasswordVisibility}
              />
              <Icons.EyeOpenIcon
                width="20"
                height="20"
                className={cx(
                  "absolute right-[12px] top-1/2 -translate-y-1/2",
                  {
                    hidden: !showPassword,
                  }
                )}
                onClick={handleTogglePasswordVisibility}
              />
            </div>
            {errors.password && (
              <span className={cx("errorText", "mt-1 block")}>
                {errors.password.message}
              </span>
            )}
          </div>

          {/* API Error */}
          {error && (
            <div
              className={cx(
                "apiError",
                "flex items-center gap-2 p-3 rounded-lg"
              )}
            >
              <Icons.ErrorIcon width="20" height="20" className="shrink-0" />
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            styleType="primary"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <InnerLoader
                  size="20px"
                  className="mr-2"
                  circleClassName="stroke-white stroke-[8px]"
                />
                {t("login.loggingIn")}
              </div>
            ) : (
              t("login.loginButton")
            )}
          </Button>
        </form>

        {/* Test Account Hint */}
        <div className={cx("hint", "mt-6 p-4 rounded-lg")}>
          <p className={cx("hintTitle", "mb-2")}>{t("login.testAccount")}:</p>
          <div className={cx("hintContent", "space-y-1")}>
            <p>
              {t("login.usernameLabel")}: <strong>noramx</strong>
            </p>
            <p>
              {t("login.passwordLabel")}: <strong>noramxpass</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
