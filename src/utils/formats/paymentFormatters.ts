/**
 * Format card number to XXXX-XXXX-XXXX-XXXX format
 * @param value - Raw input value
 * @returns Formatted card number
 */
const formatCardNumber = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  // Add dash every 4 digits
  const formatted = digits.match(/.{1,4}/g)?.join("-") || digits;
  return formatted;
};

/**
 * Format expiry date to MM/YY format
 * @param value - Raw input value
 * @returns Formatted expiry date
 */
const formatExpiryDate = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, "");
  // Add "/" after MM (first 2 digits)
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}`;
  }
  return digits;
};

export { formatCardNumber, formatExpiryDate };

