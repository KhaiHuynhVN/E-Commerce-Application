import type { ReactNode, MouseEvent } from "react";

// =====================================================
// PAGINATION TYPES - Tất cả types cho Pagination component system
// =====================================================

/** Page có thể là number hoặc dấu "..." */
type PageItem = number | "...";

/** Props cho Pagination component */
interface PaginationProps {
  /** Style type cho pagination */
  styleType?: "primary";
  /** Custom className */
  className?: string;
  /** ClassName cho item list */
  itemListClassName?: string;
  /** ClassName cho item */
  itemClassName?: string;
  /** ClassName cho item inner */
  itemInnerClassName?: string;
  /** ClassName cho next icon */
  nextIconClassName?: string;
  /** ClassName cho prev icon */
  preIconClassName?: string;
  /** ClassName cho next icon inner */
  nextIconInnerClassName?: string;
  /** ClassName cho prev icon inner */
  preIconInnerClassName?: string;
  /** ClassName cho active item */
  activeItemClassName?: string;
  /** ClassName cho disabled item */
  disabledItemClassName?: string;
  /** ClassName cho disabled icon */
  disabledIconClassName?: string;
  /** Trang hiện tại */
  currentPage: number;
  /** Tổng số trang */
  totalPage: number;
  /** Callback khi thay đổi trang */
  onPageChange?: (page: number) => void;
  /** Query param name */
  query?: string;
  /** Base path */
  path?: string;
  /** Icon cho prev button */
  preIcon?: ReactNode;
  /** Icon cho next button */
  nextIcon?: ReactNode;
  /** Trạng thái đã load data hay chưa */
  isDataLoaded?: boolean;
  /** Search params hiện tại */
  currentSearchParams?: URLSearchParams;
  /** Sử dụng navigation hay không */
  useNavigation?: boolean;
}

/** Props cho usePagination hook */
interface UsePaginationProps {
  /** Trang hiện tại */
  currentPage: number;
  /** Callback khi thay đổi trang */
  onPageChange?: (page: number) => void;
  /** Query param name */
  query?: string;
  /** Base path */
  path?: string;
  /** Tổng số trang */
  totalPage: number;
  /** Trạng thái đã load data hay chưa */
  isDataLoaded?: boolean;
  /** Search params hiện tại */
  currentSearchParams?: URLSearchParams;
  /** Sử dụng navigation hay không */
  useNavigation?: boolean;
}

/** Return value từ usePagination hook */
interface UsePaginationReturn {
  /** Danh sách các trang hiển thị */
  displayedPages: PageItem[];
  /** Handler cho page change */
  handlePageChange: (
    e: MouseEvent<HTMLAnchorElement> | null,
    page: PageItem
  ) => void;
}

export type {
  PageItem,
  PaginationProps,
  UsePaginationProps,
  UsePaginationReturn,
};
