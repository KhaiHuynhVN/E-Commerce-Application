// =====================================================
// USE PAGINATION HANDLE TYPES - Tất cả types cho usePaginationHandle hook
// =====================================================

/** Props cho usePaginationHandle hook */
interface UsePaginationHandleProps {
  /** Tên param trong URL (dùng với useParams) */
  param: string;
  /** Callback khi thay đổi trang */
  onPageChange?: (page: string | number) => void;
  /** Query param name (dùng với useSearchParams) */
  query?: string;
  /** Danh sách các query keys hợp lệ */
  validQueries?: string[];
}

/** Return value từ usePaginationHandle hook */
interface UsePaginationHandleReturn {
  /** Trang hiện tại (number) */
  currentPage: number;
  /** Handler cho page change */
  handlePageChange: (page: string | number) => void;
  /** Query param name */
  query?: string;
  /** Search params hiện tại */
  currentSearchParams: URLSearchParams;
  /** Set current page */
  setCurrentPage: (page: string | number) => void;
}

export type { UsePaginationHandleProps, UsePaginationHandleReturn };
