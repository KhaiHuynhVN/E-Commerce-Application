// Hàm này chỉ dùng được khi dự án sử dụng react-hook-form và trường hợp của code không thể sử dụng hàm reset() của useForm()

import type {
  UseFormSetValue,
  UseFormGetValues,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

/**
 * Reset các giá trị trong form về giá trị mặc định của schema
 * @param setValue - Function setValue từ react-hook-form
 * @param schema - Schema validation (Yup/Zod) có chứa default values
 * @param getValues - Function getValues từ react-hook-form
 * @example
 * resetFormValues(setValue, userSchema, getValues);
 */
const resetFormValues = <TFieldValues extends FieldValues = FieldValues>(
  setValue: UseFormSetValue<TFieldValues>,
  schema: { cast: () => Record<string, unknown> },
  getValues: UseFormGetValues<TFieldValues>
): void => {
  const defaultValues = schema.cast();
  Object.keys(defaultValues).forEach((key) => {
    const fieldName = key as Path<TFieldValues>;
    const defaultValue = defaultValues[key] as PathValue<
      TFieldValues,
      Path<TFieldValues>
    >;

    // Chỉ setValue nếu giá trị thay đổi so với giá trị mặc định
    if (getValues(fieldName) !== defaultValue) {
      setValue(fieldName, defaultValue, { shouldValidate: false });
    }
  });
};

export default resetFormValues;
