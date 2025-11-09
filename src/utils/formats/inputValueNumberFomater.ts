// Hàm định dạng số theo locale của trình duyệt
// Hàm này sẽ dùng dấu "." hay dấu "," phụ thuộc vào setting languages trong trình duyệt của user

interface FormatOptions {
  allowDecimal?: boolean;
  decimalPlaces?: number;
  forceSeparator?: "." | ",";
  defaultZero?: boolean;
  max?: number;
  min?: number;
}

const defaultOptions: FormatOptions = {
  allowDecimal: false,
  decimalPlaces: 2,
  forceSeparator: undefined,
  defaultZero: false,
  max: undefined,
  min: undefined,
};

const inputValueNumberFomater = (
  inputValue: number | string,
  options: FormatOptions = {}
): string => {
  const {
    allowDecimal,
    decimalPlaces = 2,
    forceSeparator,
    defaultZero,
    max,
    min,
  } = { ...defaultOptions, ...options };

  if (typeof inputValue !== "string") {
    inputValue = String(inputValue);
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

  // Biểu thức chính quy để lọc số, chấp nhận cả dấu phẩy và dấu chấm nếu cho phép số thập phân
  const regex = new RegExp(
    `[^0-9${allowDecimal ? `\\${decimalSeparator}` : ""}]`,
    "g"
  );
  const numericValue = inputValue.replace(regex, "");

  // Tách phần nguyên và phần thập phân
  let [integerPart, fractionalPart]: [string, string | undefined] =
    numericValue.split(decimalSeparator) as [string, string | undefined];

  // Xử lý số 0 đứng đầu
  integerPart = integerPart.replace(/^0+(?=\d)/, "");
  if (integerPart === "") {
    integerPart = numericValue === "0" || defaultZero ? "0" : "";
  }

  // Kiểm tra giới hạn max và min
  let currentValue = parseFloat(
    integerPart + (fractionalPart ? `.${fractionalPart}` : "")
  );
  if (!isNaN(currentValue)) {
    if (max !== undefined && currentValue > max) {
      currentValue = max;
      [integerPart, fractionalPart] = String(currentValue).split(".");
    }
    if (min !== undefined && currentValue < min) {
      currentValue = min;
      [integerPart, fractionalPart] = String(currentValue).split(".");
    }
  }

  if (allowDecimal) {
    // Giới hạn số chữ số thập phân
    if (fractionalPart && fractionalPart.length > decimalPlaces) {
      fractionalPart = fractionalPart.slice(0, decimalPlaces);
    }
  } else {
    // Nếu không cho phép số thập phân, loại bỏ phần thập phân
    fractionalPart = undefined;
  }

  // Định dạng phần nguyên với dấu phân cách hàng nghìn
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

  // Kết hợp phần nguyên đã định dạng với phần thập phân (nếu có)
  let formattedNumber = integerPart;
  if (allowDecimal && fractionalPart !== undefined) {
    formattedNumber += decimalSeparator + fractionalPart;
  } else if (allowDecimal && inputValue.endsWith(decimalSeparator)) {
    // Cho phép người dùng nhập dấu thập phân mà không cần số sau nó
    formattedNumber += decimalSeparator;
  }

  return formattedNumber;
};

export default inputValueNumberFomater;
