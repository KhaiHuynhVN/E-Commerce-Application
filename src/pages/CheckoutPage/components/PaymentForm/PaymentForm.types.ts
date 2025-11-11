type PaymentFormData = {
  paymentMethod: "creditCard" | "debitCard";
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

type PaymentFormProps = {
  onSubmit: (data: PaymentFormData) => void;
  defaultValues?: Partial<PaymentFormData>;
  className?: string;
  onValidityChange?: (isValid: boolean) => void;
};

export type { PaymentFormData, PaymentFormProps };
