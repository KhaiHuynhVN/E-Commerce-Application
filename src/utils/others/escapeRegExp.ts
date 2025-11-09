/**
 * Escape các ký tự đặc biệt trong regex
 * @param string - Chuỗi cần escape
 * @returns Chuỗi đã được escape, an toàn để sử dụng trong RegExp
 * @example
 * escapeRegExp("hello.world") // "hello\\.world"
 * escapeRegExp("price: $99") // "price: \\$99"
 */
const escapeRegExp = (string: string): string =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default escapeRegExp;
