// Hàm định dạng số theo locale của trình duyệt
// Hàm này sẽ dùng dấu "." hay dấu "," phụ thuộc vào setting languages trong trình duyệt của user (mặc định nếu không có
// setting thì dấu "." sẽ được sử dụng)

type CustomDisplayValue = `custom:${string}`;
type InvalidDisplayType =
  | "0"
  | "-"
  | "N/A"
  | "empty"
  | "null"
  | "undefined"
  | "NaN"
  | "blank"
  | CustomDisplayValue;
type InfinityDisplayType = "0" | "-" | "N/A" | "max" | CustomDisplayValue;
type AbbreviationType =
  | "none"
  | "hundred"
  | "thousand"
  | "tenThousand"
  | "hundredThousand"
  | "million"
  | "tenMillion"
  | "hundredMillion"
  | "thousandMillion"
  | "tenThousandMillion"
  | "hundredThousandMillion"
  | "billion"
  | "tenBillion"
  | "hundredBillion"
  | "thousandBillion"
  | "tenThousandBillion"
  | "hundredThousandBillion"
  | "thousandMillionBillion"
  | "tenThousandMillionBillion"
  | "hundredThousandMillionBillion";

interface FormatOptions {
  /** Cho phép số thập phân */
  allowDecimal?: boolean;
  /** Số chữ số thập phân */
  decimalPlaces?: number;
  /** Phương pháp làm tròn */
  roundingMethod?: "fixed" | "ceil" | "floor";
  /** Bắt buộc sử dụng dấu phân cách cụ thể */
  forceSeparator?: "." | ",";
  /** Cách hiển thị giá trị Infinity. Để sử dụng giá trị tùy chỉnh, thêm prefix 'custom:' (ví dụ: 'custom:Vô cực') */
  infinityDisplay?: InfinityDisplayType;
  /** Cách hiển thị khi giá trị không hợp lệ. Để sử dụng giá trị tùy chỉnh, thêm prefix 'custom:' (ví dụ: 'custom:Giá trị không hợp lệ') */
  invalidDisplay?: InvalidDisplayType;
  /** Giá trị tùy chỉnh để hiển thị khi giá trị không hợp lệ (ưu tiên cao hơn invalidDisplay) */
  customInvalidDisplay?: string;
  /** Giá trị tùy chỉnh để hiển thị khi giá trị là Infinity (ưu tiên cao hơn infinityDisplay) */
  customInfinityDisplay?: string;
  /**
   * Kiểu rút gọn số:
   * - none: Không rút gọn (1234567 -> "1,234,567")
   * - hundred: Rút gọn theo trăm (123 -> "1.23H")
   * - thousand: Rút gọn theo nghìn (1,234 -> "1.23K")
   * - tenThousand: Rút gọn theo chục nghìn (12,345 -> "1.23XK")
   * - hundredThousand: Rút gọn theo trăm nghìn (123,456 -> "1.23CK")
   * - million: Rút gọn theo triệu (1,234,567 -> "1.23M")
   * - tenMillion: Rút gọn theo chục triệu (12,345,678 -> "1.23XM")
   * - hundredMillion: Rút gọn theo trăm triệu (123,456,789 -> "1.23CM")
   * - thousandMillion: Rút gọn theo nghìn triệu (1,234,567,890 -> "1.23KM")
   * - tenThousandMillion: Rút gọn theo chục nghìn triệu (12,345,678,901 -> "1.23XKM")
   * - hundredThousandMillion: Rút gọn theo trăm nghìn triệu (123,456,789,012 -> "1.23CKM")
   * - billion: Rút gọn theo tỷ (1,234,567,890,123 -> "1.23B")
   * - tenBillion: Rút gọn theo chục tỷ (12,345,678,901,234 -> "1.23XB")
   * - hundredBillion: Rút gọn theo trăm tỷ (123,456,789,012,345 -> "1.23CB")
   * - thousandBillion: Rút gọn theo nghìn tỷ (1,234,567,890,123,456 -> "1.23KB")
   * - tenThousandBillion: Rút gọn theo chục nghìn tỷ (12,345,678,901,234,567 -> "1.23XKB")
   * - hundredThousandBillion: Rút gọn theo trăm nghìn tỷ (123,456,789,012,345,678 -> "1.23CKB")
   * - thousandMillionBillion: Rút gọn theo nghìn triệu tỷ (1,234,567,890,123,456,789 -> "1.23KMB")
   * - tenThousandMillionBillion: Rút gọn theo chục nghìn triệu tỷ (12,345,678,901,234,567,890 -> "1.23XKMB")
   * - hundredThousandMillionBillion: Rút gọn theo trăm nghìn triệu tỷ (123,456,789,012,345,678,901 -> "1.23CKMB")
   * @property {boolean} [showAbbreviationUnit=true] - Hiển thị đơn vị rút gọn:
   * - H: Hundred (trăm)
   * - K: Kilo (nghìn)
   * - X: Ten (chục)
   * - C: Centi (trăm)
   * - M: Million (triệu)
   * - B: Billion (tỷ)
   * Ví dụ kết hợp:
   * - XK: Ten Kilo (chục nghìn)
   * - CK: Centi Kilo (trăm nghìn)
   * - XM: Ten Million (chục triệu)
   * - CM: Centi Million (trăm triệu)
   * - KM: Kilo Million (nghìn triệu)
   * - XKM: Ten Kilo Million (chục nghìn triệu)
   * - CKM: Centi Kilo Million (trăm nghìn triệu)
   * - XB: Ten Billion (chục tỷ)
   * - CB: Centi Billion (trăm tỷ)
   * - KB: Kilo Billion (nghìn tỷ)
   * - XKB: Ten Kilo Billion (chục nghìn tỷ)
   * - CKB: Centi Kilo Billion (trăm nghìn tỷ)
   * - KMB: Kilo Million Billion (nghìn triệu tỷ)
   * - XKMB: Ten Kilo Million Billion (chục nghìn triệu tỷ)
   * - CKMB: Centi Kilo Million Billion (trăm nghìn triệu tỷ)
   */
  abbreviationType?: AbbreviationType;
  /** Hiển thị đơn vị rút gọn */
  showAbbreviationUnit?: boolean;
}

const defaultOptions: FormatOptions = {
  allowDecimal: false,
  decimalPlaces: 2,
  roundingMethod: "fixed",
  forceSeparator: undefined,
  infinityDisplay: "0",
  invalidDisplay: "0",
  customInvalidDisplay: undefined,
  customInfinityDisplay: undefined,
  abbreviationType: "none",
  showAbbreviationUnit: true,
};

interface AbbreviationConfig {
  divisor: bigint;
  unit: string;
}

const ABBREVIATION_CONFIGS: Record<AbbreviationType, AbbreviationConfig> = {
  none: { divisor: 1n, unit: "" },
  hundred: { divisor: 100n, unit: "H" }, // Hundred
  thousand: { divisor: 1000n, unit: "K" }, // Kilo (1,000)
  tenThousand: { divisor: 10000n, unit: "XK" }, // 10 Kilo
  hundredThousand: { divisor: 100000n, unit: "CK" }, // Centi Kilo
  million: { divisor: 1000000n, unit: "M" }, // Million
  tenMillion: { divisor: 10000000n, unit: "XM" }, // 10 Million
  hundredMillion: { divisor: 100000000n, unit: "CM" }, // Centi Million
  thousandMillion: { divisor: 1000000000n, unit: "KM" }, // Kilo Million
  tenThousandMillion: { divisor: 10000000000n, unit: "XKM" }, // 10 Kilo Million
  hundredThousandMillion: { divisor: 100000000000n, unit: "CKM" }, // Centi Kilo Million
  billion: { divisor: 1000000000000n, unit: "B" }, // Billion
  tenBillion: { divisor: 10000000000000n, unit: "XB" }, // 10 Billion
  hundredBillion: { divisor: 100000000000000n, unit: "CB" }, // Centi Billion
  thousandBillion: { divisor: 1000000000000000n, unit: "KB" }, // Kilo Billion
  tenThousandBillion: { divisor: 10000000000000000n, unit: "XKB" }, // 10 Kilo Billion
  hundredThousandBillion: { divisor: 100000000000000000n, unit: "CKB" }, // Centi Kilo Billion
  thousandMillionBillion: { divisor: 1000000000000000000n, unit: "KMB" }, // Kilo Million Billion
  tenThousandMillionBillion: { divisor: 10000000000000000000n, unit: "XKMB" }, // 10 Kilo Million Billion
  hundredThousandMillionBillion: {
    divisor: 100000000000000000000n,
    unit: "CKMB",
  }, // Centi Kilo Million Billion
};

/**
 * Xử lý giá trị không hợp lệ
 * @param invalidDisplay - Cách hiển thị giá trị không hợp lệ
 * @param customInvalidDisplay - Giá trị tùy chỉnh
 * @returns Giá trị được xử lý
 */
const handleInvalidValue = (
  invalidDisplay: InvalidDisplayType,
  customInvalidDisplay?: string
): string | null | undefined | number => {
  // Ưu tiên sử dụng customInvalidDisplay nếu có
  if (customInvalidDisplay !== undefined) {
    return customInvalidDisplay;
  }

  switch (invalidDisplay) {
    case "-":
      return "-";
    case "N/A":
      return "N/A";
    case "empty":
      return "";
    case "null":
      return null;
    case "undefined":
      return undefined;
    case "NaN":
      return NaN;
    case "blank":
      return " ";
    case "0":
      return "0";
    default:
      return invalidDisplay;
  }
};

/**
 * Định dạng số theo locale
 * @param inputValue - Giá trị đầu vào cần định dạng
 * @param options - Các tùy chọn định dạng
 * @returns Số đã được định dạng
 */
const formatNumber = (
  inputValue: number | string,
  options: FormatOptions = {}
): string | null | undefined | number => {
  const {
    allowDecimal = false,
    decimalPlaces = 2,
    roundingMethod = "fixed",
    forceSeparator,
    infinityDisplay = "0",
    invalidDisplay = "0",
    customInvalidDisplay,
    customInfinityDisplay,
    abbreviationType = "none",
    showAbbreviationUnit = true,
  } = { ...defaultOptions, ...options };

  // Kiểm tra giá trị đầu vào
  if (inputValue === null || inputValue === undefined || inputValue === "") {
    return handleInvalidValue(invalidDisplay, customInvalidDisplay);
  }

  // Check if string is a valid number
  if (
    typeof inputValue === "string" &&
    isNaN(Number(inputValue.replace(",", ".")))
  ) {
    return handleInvalidValue(invalidDisplay, customInvalidDisplay);
  }

  // Check if number is NaN
  if (typeof inputValue === "number" && isNaN(inputValue)) {
    return handleInvalidValue(invalidDisplay, customInvalidDisplay);
  }

  // Chuyển đổi inputValue thành số
  let numericValue =
    typeof inputValue === "string"
      ? parseFloat(inputValue.replace(",", "."))
      : inputValue;

  // Kiểm tra lại sau khi parse
  if (isNaN(numericValue)) {
    return handleInvalidValue(invalidDisplay, customInvalidDisplay);
  }

  // Xử lý giá trị Infinity
  if (!isFinite(numericValue)) {
    // Ưu tiên sử dụng customInfinityDisplay nếu có
    if (customInfinityDisplay !== undefined) {
      return customInfinityDisplay;
    }

    switch (infinityDisplay) {
      case "-":
        return "-";
      case "N/A":
        return "N/A";
      case "max":
        return "999999999";
      case "0":
        return "0";
      default:
        return infinityDisplay;
    }
  }

  // Xử lý rút gọn số
  const abbreviationConfig = ABBREVIATION_CONFIGS[abbreviationType];
  if (abbreviationConfig && abbreviationConfig.divisor > 1n) {
    // Chuyển đổi numericValue thành BigInt và thực hiện phép chia
    const bigIntValue = BigInt(Math.round(numericValue));
    const bigIntResult = bigIntValue / abbreviationConfig.divisor;

    // Xử lý phần thập phân nếu cần
    if (allowDecimal || abbreviationConfig.divisor > 1n) {
      const remainder = bigIntValue % abbreviationConfig.divisor;
      const decimalPart =
        Number(remainder) / Number(abbreviationConfig.divisor);
      numericValue = Number(bigIntResult) + decimalPart;
    } else {
      numericValue = Number(bigIntResult);
    }
  }

  // Xác định dấu thập phân và dấu phân cách hàng nghìn
  let decimalSeparator, thousandSeparator;
  if (forceSeparator === "," || forceSeparator === ".") {
    decimalSeparator = forceSeparator === "," ? "." : ",";
    thousandSeparator = forceSeparator;
  } else {
    decimalSeparator = (1.1).toLocaleString().substring(1, 2);
    thousandSeparator = decimalSeparator === "." ? "," : ".";
  }

  // Xử lý số thập phân
  if (allowDecimal || abbreviationConfig?.divisor > 1n) {
    switch (roundingMethod) {
      case "ceil":
        numericValue =
          Math.ceil(numericValue * Math.pow(10, decimalPlaces)) /
          Math.pow(10, decimalPlaces);
        break;
      case "floor":
        numericValue =
          Math.floor(numericValue * Math.pow(10, decimalPlaces)) /
          Math.pow(10, decimalPlaces);
        break;
      default: // 'fixed'
        numericValue = Number(numericValue.toFixed(decimalPlaces));
    }
  } else {
    numericValue = Math.round(numericValue);
  }

  // Định dạng số
  const parts = numericValue.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  let result = parts.join(decimalSeparator);

  // Thêm đơn vị rút gọn nếu cần
  if (abbreviationConfig && abbreviationConfig.unit && showAbbreviationUnit) {
    result += abbreviationConfig.unit;
  }

  return result;
};

export default formatNumber;
