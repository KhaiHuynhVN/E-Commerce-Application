// Cách này tối ưu hơn về hiệu suất.
// *****************************************************

// import { escapeRegExp } from "../../utils";

// const escapeHtml = (text: string): string => {
//   return text
//     .replace(/&/g, "&amp;") // Thay thế & thành &amp; (phải đặt TRƯỚC các thay thế khác)
//     .replace(/</g, "&lt;") // Thay thế < thành &lt;
//     .replace(/>/g, "&gt;"); // Thay thế > thành &gt;
// };

// const fuzzySearchHighlighter = (
//   text: string,
//   highlight: string,
//   highlightClassName: string = ""
// ): string => {
//   if (typeof text !== "string" || typeof highlight !== "string") return "";

//   if (!highlight.trim()) return escapeHtml(text);

//   const escapedText = escapeHtml(text); // Escape text trước

//   // Tạo Set chứa các từ khóa tìm kiếm:
//   // 1. Split theo khoảng trắng để lấy các từ
//   // 2. Split theo từng ký tự để tìm kiếm từng ký tự riêng lẻ
//   // 3. Sử dụng Set để loại bỏ trùng lặp
//   const searchSet = new Set(
//     highlight
//       .trim()
//       .split(/\s+/)
//       .concat(highlight.replace(/\s+/g, "").split(""))
//   );

//   // Tạo pattern cho regex:
//   // 1. Chuyển Set thành Array
//   // 2. Escape các ký tự đặc biệt trong regex
//   // 3. Join các pattern bằng | (OR)
//   const regexPattern = Array.from(searchSet, escapeRegExp).join("|");
//   // Tạo regex với flags: g (global) và i (case-insensitive)
//   const regex = new RegExp(`(${regexPattern})`, "gi");

//   // Tạo map để lưu trữ vị trí tương ứng giữa text gốc và text đã escape
//   const positionMap = new Map();
//   let escapedIndex = 0;
//   for (let i = 0; i < text.length; i++) {
//     positionMap.set(i, escapedIndex);
//     // Tính toán vị trí mới:
//     // & sẽ thành &amp; (5 ký tự)
//     // < sẽ thành &lt; (4 ký tự)
//     // > sẽ thành &gt; (4 ký tự)
//     // Các ký tự khác giữ nguyên (1 ký tự)
//     escapedIndex +=
//       text[i] === "&" ? 5 : text[i] === "<" ? 4 : text[i] === ">" ? 4 : 1;
//   }
//   // Thêm vị trí cuối cùng vào map
//   positionMap.set(text.length, escapedIndex);

//   // Tìm tất cả các matches trong text gốc
//   const matches = Array.from(text.matchAll(regex));
//   const parts = []; // Mảng chứa các phần của text sau khi xử lý
//   let lastIndex = 0; // Vị trí cuối cùng đã xử lý

//   // Xử lý từng match
//   for (const match of matches) {
//     // Lấy vị trí bắt đầu và kết thúc trong text gốc
//     const originalStart = match.index;
//     const originalEnd = originalStart + match[0].length;

//     // Chuyển đổi vị trí sang text đã escape
//     const escapedStart = positionMap.get(originalStart);
//     const escapedEnd = positionMap.get(originalEnd);

//     // Thêm phần text không match (nếu có)
//     if (escapedStart > lastIndex) {
//       parts.push(escapedText.slice(lastIndex, escapedStart));
//     }

//     // Thêm phần text match với highlighting
//     parts.push(
//       `<span class="${highlightClassName}" style="${
//         !highlightClassName &&
//         "display: inline-block; font-weight: var(--fw-septenary); color: var(--septenary-color); filter: drop-shadow(0.1px 0.1px 0.1px var(--twenty-ninth-color))"
//       }">${escapedText.slice(escapedStart, escapedEnd)}</span>`
//     );

//     lastIndex = escapedEnd;
//   }

//   // Thêm phần text còn lại sau match cuối cùng (nếu có)
//   if (lastIndex < escapedText.length) {
//     parts.push(escapedText.slice(lastIndex));
//   }

//   // Ghép tất cả các phần lại thành chuỗi HTML
//   return parts.join("");
// };

// export default fuzzySearchHighlighter;

// -----> Logic của hàm này sẽ highlight các ký tự mà không quan tâm đến dấu trong tiếng Việt hoặc các ký tự latinh mở rộng khác
// ví dụ: search "dien thoai" sẽ highlight được "điện thoại". Thậm chí nó hoạt động tốt hơn cả mong đợi.
// Hàm trên tối ưu hơn về hiệu suất nhưng không làm được như vậy. Ví dụ search "điện thoại" thì mới có thể highlight được "điện thoại"
// nhưng đối với dự án chỉ có tiếng Việt và tiếng Anh là các ký tự latin thì không cần dùng đến hàm này, trừ khi khác hàng muốn cơ chế
// này phải hoạt động tốt với rất nhiều các ký tự latinh mở rộng khác.
// *****************************************************

import { removeDiacritics, escapeRegExp } from "../../utils";

const escapeHtml = (text: string): string => {
  return text
    .replace(/&/g, "&amp;") // Thay thế & thành &amp; (phải đặt TRƯỚC các thay thế khác)
    .replace(/</g, "&lt;") // Thay thế < thành &lt;
    .replace(/>/g, "&gt;"); // Thay thế > thành &gt;
};

const fuzzySearchHighlighter = (
  text: string,
  highlight: string,
  highlightClassName: string = ""
): string => {
  if (!highlight.trim()) return escapeHtml(text); // Nếu không có từ khóa tìm kiếm, trả về text đã escape

  const escapedText = escapeHtml(text); // Escape html cho text gốc

  // Normalize cả text gốc và highlight để so sánh
  const normalizedHighlight = removeDiacritics(highlight); // Bỏ dấu trong từ khóa tìm kiếm
  const normalizedText = removeDiacritics(text); // Bỏ dấu text gốc

  // Tạo set các từ và ký tự tìm kiếm (loại bỏ trùng lặp)
  const searchSet: Set<string> = new Set(
    normalizedHighlight
      .trim()
      .split(/\s+/)
      .concat(normalizedHighlight.replace(/\s+/g, "").split(""))
  );

  // Tạo regex pattern và regex object
  const regexPattern = Array.from(searchSet, escapeRegExp).join("|");
  const regex = new RegExp(`(${regexPattern})`, "gi");

  // Tìm tất cả các matches trong text đã được normalize
  const matches: RegExpMatchArray[] = Array.from(
    normalizedText.matchAll(regex)
  );

  // Tạo mảng các phần của text (đã highlight và chưa highlight)
  const parts = [];
  let lastIndex = 0;

  // Tạo map để lưu trữ vị trí tương ứng giữa text gốc và text đã escape
  const positionMap = new Map();
  let escapedIndex = 0;
  for (let i = 0; i < text.length; i++) {
    positionMap.set(i, escapedIndex);
    escapedIndex +=
      text[i] === "<"
        ? 4 // &lt;
        : text[i] === ">"
        ? 4 // &gt;
        : text[i] === "&"
        ? 5 // &amp;
        : text[i] === '"'
        ? 6 // &quot;
        : text[i] === "'"
        ? 6 // &#039;
        : 1;
  }
  positionMap.set(text.length, escapedIndex);

  for (const match of matches) {
    // Bỏ qua nếu không có index
    if (match.index === undefined) continue;
    const originalStart = match.index;
    const originalEnd = originalStart + match[0].length;

    // Chuyển đổi vị trí trong text gốc sang vị trí trong text đã escape
    const escapedStart = positionMap.get(originalStart);
    const escapedEnd = positionMap.get(originalEnd);

    if (escapedStart > lastIndex) {
      parts.push(escapedText.slice(lastIndex, escapedStart));
    }

    parts.push(
      `<span class="${highlightClassName}" style="${
        !highlightClassName &&
        "display: inline-block; font-weight: var(--fw-septenary); color: var(--septenary-color); filter: drop-shadow(0.1px 0.1px 0.1px var(--twenty-ninth-color))"
      }">${escapedText.slice(escapedStart, escapedEnd)}</span>`
    );

    lastIndex = escapedEnd;
  }

  if (lastIndex < escapedText.length) {
    parts.push(escapedText.slice(lastIndex));
  }

  return parts.join("");
};

export default fuzzySearchHighlighter;
