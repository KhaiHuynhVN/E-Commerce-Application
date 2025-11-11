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

// Schema cho Shipping Information
const createShippingSchema = (t: TFunction) => {
  return yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(t("validationErrors.nameRequired"))
      .default(""),
    phone: yup
      .string()
      .trim()
      .required(t("validationErrors.phoneRequired"))
      .matches(/^[0-9]{10,11}$/, t("validationErrors.phoneInvalid"))
      .default(""),
    email: yup
      .string()
      .trim()
      .required(t("validationErrors.emailRequired"))
      .email(t("validationErrors.emailInvalid"))
      .default(""),
    postalCode: yup
      .string()
      .trim()
      .required(t("validationErrors.postalCodeRequired"))
      .default(""),
    street: yup
      .string()
      .trim()
      .required(t("validationErrors.streetRequired"))
      .default(""),
    detailAddress: yup
      .string()
      .trim()
      .required(t("validationErrors.detailAddressRequired"))
      .default(""),
    deliveryNotes: yup.string().trim().default(""),
  });
};

// Schema cho Payment Information
const createPaymentSchema = (t: TFunction) => {
  return yup.object().shape({
    paymentMethod: yup
      .string()
      .oneOf(["creditCard", "debitCard"] as const)
      .required(t("validationErrors.paymentMethodRequired"))
      .default("creditCard"),
    cardNumber: yup
      .string()
      .trim()
      .required(t("validationErrors.cardNumberRequired"))
      .matches(
        /^[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/,
        t("validationErrors.cardNumberInvalid")
      )
      .default(""),
    expiryDate: yup
      .string()
      .trim()
      .required(t("validationErrors.expiryDateRequired"))
      .matches(
        /^(0[1-9]|1[0-2])\/[0-9]{2}$/,
        t("validationErrors.expiryDateInvalid")
      )
      .default(""),
    cvv: yup
      .string()
      .trim()
      .required(t("validationErrors.cvvRequired"))
      .matches(/^[0-9]{3,4}$/, t("validationErrors.cvvInvalid"))
      .default(""),
  });
};

export { createLoginSchema, createShippingSchema, createPaymentSchema };
