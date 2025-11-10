import * as yup from "yup";
import type { TFunction } from "i18next";

// Factory function để tạo schema với translation
const createLoginSchema = (t: TFunction) => {
  return yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(t("validationErrors.usernameRequired"))
      .default(""),
    password: yup
      .string()
      .required(t("validationErrors.passwordRequired"))
      .min(6, t("validationErrors.passwordMinLength", { min: 6 }))
      .default(""),
  });
};

export { createLoginSchema };
