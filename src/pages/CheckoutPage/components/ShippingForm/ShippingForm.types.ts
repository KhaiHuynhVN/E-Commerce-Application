type ShippingFormData = {
  name: string;
  phone: string;
  email: string;
  postalCode: string;
  street: string;
  detailAddress: string;
  deliveryNotes: string;
};

type ShippingFormProps = {
  onSubmit?: (data: ShippingFormData) => void;
  defaultValues?: Partial<ShippingFormData>;
  className?: string;
  onValidityChange?: (isValid: boolean) => void;
};

export type { ShippingFormData, ShippingFormProps };
