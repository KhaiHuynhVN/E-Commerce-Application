import { memo, useEffect } from "react";
import { useForm, type Control, type FieldValues } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import classNames from "classnames/bind";

import { Input } from "@/commonComponents";
import { createShippingSchema } from "@/utils";
import type { ShippingFormProps, ShippingFormData } from "./ShippingForm.types";

import styles from "./ShippingForm.module.scss";

const cx = classNames.bind(styles);

const ShippingForm = ({
  onSubmit,
  defaultValues,
  className,
  onValidityChange,
}: ShippingFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ShippingFormData>({
    mode: "onChange",
    resolver: yupResolver(createShippingSchema(t)),
    defaultValues: defaultValues || {
      name: "",
      phone: "",
      email: "",
      postalCode: "",
      street: "",
      detailAddress: "",
      deliveryNotes: "",
    },
  });

  // Notify parent component về validity changes
  useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cx("wrapper", className)}
    >
      <h2 className="text-[2rem] font-bold mb-6">
        {t("checkout.shippingInfo")}
      </h2>

      <div className="space-y-4">
        {/* Họ và Tên */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.name")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="name"
            placeholder={t("checkout.name")}
          />
          {errors.name && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Số Điện Thoại */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.phone")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="phone"
            placeholder={t("checkout.phone")}
          />
          {errors.phone && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.email")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="email"
            type="email"
            placeholder={t("checkout.email")}
          />
          {errors.email && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Mã Bưu Điện */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.postalCode")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="postalCode"
            placeholder={t("checkout.postalCode")}
          />
          {errors.postalCode && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.postalCode.message}
            </p>
          )}
        </div>

        {/* Địa Chỉ Đường */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.street")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="street"
            placeholder={t("checkout.street")}
          />
          {errors.street && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.street.message}
            </p>
          )}
        </div>

        {/* Địa Chỉ Chi Tiết */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.detailAddress")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="detailAddress"
            placeholder={t("checkout.detailAddress")}
          />
          {errors.detailAddress && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.detailAddress.message}
            </p>
          )}
        </div>

        {/* Ghi Chú Giao Hàng */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.deliveryNotes")}
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="deliveryNotes"
            placeholder={t("checkout.deliveryNotes")}
          />
          {errors.deliveryNotes && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.deliveryNotes.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default memo(ShippingForm);
