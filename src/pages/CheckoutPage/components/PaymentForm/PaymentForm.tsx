import { memo, useEffect } from "react";
import {
  useForm,
  Controller,
  type Control,
  type FieldValues,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { yupResolver } from "@hookform/resolvers/yup";
import { Radio } from "antd";
import classNames from "classnames/bind";

import { Input } from "@/commonComponents";
import {
  createPaymentSchema,
  formatCardNumber,
  formatExpiryDate,
} from "@/utils";
import type { PaymentFormProps, PaymentFormData } from "./PaymentForm.types";

import styles from "./PaymentForm.module.scss";

const cx = classNames.bind(styles);

const PaymentForm = ({
  onSubmit,
  defaultValues,
  className,
  onValidityChange,
}: PaymentFormProps) => {
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    mode: "onChange",
    resolver: yupResolver(createPaymentSchema(t)),
    defaultValues: defaultValues || {
      paymentMethod: "creditCard",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
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
        {t("checkout.paymentInfo")}
      </h2>

      <div className="space-y-4">
        {/* Phương Thức Thanh Toán */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.paymentMethod")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Controller
            name="paymentMethod"
            control={control as unknown as Control<FieldValues>}
            render={({ field }) => (
              <Radio.Group {...field} className="flex gap-4">
                <Radio value="creditCard" className="text-[1.4rem]">
                  {t("checkout.creditCard")}
                </Radio>
                <Radio value="debitCard" className="text-[1.4rem]">
                  {t("checkout.debitCard")}
                </Radio>
              </Radio.Group>
            )}
          />
          {errors.paymentMethod && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.paymentMethod.message}
            </p>
          )}
        </div>

        {/* Số Thẻ */}
        <div>
          <label className="flex items-center text-[1.4rem] font-semibold mb-2">
            {t("checkout.cardNumber")}
            <span className="text-(--twentieth-color) ml-[4px]">*</span>
          </label>
          <Input
            control={control as unknown as Control<FieldValues>}
            name="cardNumber"
            placeholder="1234-5678-9012-3456"
            maxLength={19}
            formatValue={formatCardNumber}
          />
          {errors.cardNumber && (
            <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
              {errors.cardNumber.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Ngày Hết Hạn */}
          <div>
            <label className="flex items-center text-[1.4rem] font-semibold mb-2">
              {t("checkout.expiryDate")}
              <span className="text-(--twentieth-color) ml-[4px]">*</span>
            </label>
            <Input
              control={control as unknown as Control<FieldValues>}
              name="expiryDate"
              placeholder="MM/YY"
              maxLength={5}
              formatValue={formatExpiryDate}
            />
            {errors.expiryDate && (
              <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
                {errors.expiryDate.message}
              </p>
            )}
          </div>

          {/* CVV */}
          <div>
            <label className="flex items-center text-[1.4rem] font-semibold mb-2">
              {t("checkout.cvv")}
              <span className="text-(--twentieth-color) ml-[4px]">*</span>
            </label>
            <Input
              control={control as unknown as Control<FieldValues>}
              name="cvv"
              placeholder="123"
              maxLength={4}
            />
            {errors.cvv && (
              <p className="text-(--twentieth-color) text-[1.2rem] mt-1">
                {errors.cvv.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default memo(PaymentForm);
