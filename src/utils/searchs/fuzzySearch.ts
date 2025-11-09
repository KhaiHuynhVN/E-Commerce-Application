import { escapeRegExp, removeDiacritics } from "../../utils";

/** Cache để lưu trữ kết quả tìm kiếm, tránh tính toán lại */
const cache = new Map<string, boolean>();

/**
 * Tìm kiếm mờ (fuzzy search) với hỗ trợ tiếng Việt không dấu
 * @param keyword - Từ khóa tìm kiếm
 * @param text - Văn bản cần tìm kiếm
 * @returns true nếu tìm thấy, false nếu không tìm thấy
 * @example
 * fuzzySearch("dien thoai", "Điện thoại Samsung") // true
 * fuzzySearch("samung", "Samsung Galaxy") // true (fuzzy match)
 */
const fuzzySearch = (keyword: string, text: string): boolean => {
  // Kiểm tra input hợp lệ
  if (!keyword || !text) return false;

  try {
    // Tạo cache key duy nhất cho mỗi cặp keyword-text
    const cacheKey = `${keyword}|${text}`;

    // Trả về kết quả từ cache nếu có
    if (cache.has(cacheKey)) return cache.get(cacheKey)!;

    // Normalize: bỏ dấu tiếng Việt để so sánh
    const normalizedKeyword = removeDiacritics(keyword);
    const normalizedText = removeDiacritics(text);

    // Tìm kiếm chính xác: tất cả từ phải xuất hiện đúng thứ tự
    const words = normalizedKeyword.split(/\s+/);
    const exactMatch =
      words.every((word) =>
        new RegExp(`\\b${escapeRegExp(word)}\\b`, "i").test(normalizedText)
      ) &&
      new RegExp(
        words.map((word) => `\\b${escapeRegExp(word)}\\b`).join(".*"),
        "i"
      ).test(normalizedText);

    // Nếu có kết quả khớp chính xác, cache và trả về true
    if (exactMatch) {
      cache.set(cacheKey, true);
      return true;
    }

    // Tìm kiếm mờ: các ký tự xuất hiện theo thứ tự nhưng không nhất thiết liền nhau
    const escapedChars = normalizedKeyword
      .split("")
      .map((char) => escapeRegExp(char));
    const fuzzyPattern = escapedChars.join(".*");
    const fuzzyRegex = new RegExp(fuzzyPattern, "i");

    // Kiểm tra pattern và cache kết quả
    const result = fuzzyRegex.test(normalizedText);
    cache.set(cacheKey, result);

    return result;
  } catch (error) {
    console.error("Lỗi trong quá trình tìm kiếm:", error);
    return false;
  }
};

export default fuzzySearch;

/**
 * NOTE: Hàm này sử dụng Map để cache kết quả tìm kiếm.
 * Nếu cùng một yêu cầu được thực hiện lại, hàm sẽ trả về kết quả
 * từ bộ nhớ cache thay vì tính toán lại, giúp cải thiện performance.
 */
