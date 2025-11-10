/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import type {
  UsePaginationProps,
  UsePaginationReturn,
  PageItem,
} from "./Pagination.types";

const usePagination = ({
  currentPage,
  onPageChange,
  query,
  path,
  totalPage,
  isDataLoaded,
  currentSearchParams,
  useNavigation = true,
}: UsePaginationProps): UsePaginationReturn => {
  const navigate = useNavigate();
  const [, setSearchParams] = useSearchParams({});
  const [displayedPages, setDisplayedPages] = useState<PageItem[]>([]);

  useLayoutEffect(() => {
    if (!isDataLoaded) {
      setDisplayedPages([]);
      return;
    }

    if (currentPage < 1 || Number.isNaN(currentPage)) {
      onPageChange?.(1);
      void (
        useNavigation &&
        setSearchParams(updateSearchParams(1), { replace: true })
      );
    } else if (currentPage > totalPage && totalPage !== 0) {
      onPageChange?.(totalPage);
      void (
        useNavigation &&
        setSearchParams(updateSearchParams(totalPage), { replace: true })
      );
    } else {
      updateDisplayedPages(currentPage);
    }
  }, [currentPage, totalPage, isDataLoaded]);

  function updateSearchParams(page: number): URLSearchParams {
    const encodedPage = encodeURIComponent(page);
    currentSearchParams?.set(query as string, encodedPage);
    return currentSearchParams as URLSearchParams;
  }

  const handlePageChange = (
    e: React.MouseEvent<HTMLAnchorElement> | null,
    page: PageItem
  ): void => {
    if (useNavigation) {
      e?.preventDefault();
      if (
        (page as number) < 1 ||
        (page as number) > totalPage ||
        page === "..."
      ) {
        return;
      }
      void (query
        ? setSearchParams(updateSearchParams(page as number))
        : navigate(`${path}/${page}`));
    } else {
      if (
        (page as number) < 1 ||
        (page as number) > totalPage ||
        page === "..."
      ) {
        return;
      }
    }

    updateDisplayedPages(page as number);
    onPageChange?.(page as number);
  };

  const updateDisplayedPages = (page: number): void => {
    let pages: PageItem[] = [];

    if (totalPage <= 7) {
      for (let i = 1; i <= totalPage; i++) {
        pages.push(i);
      }
    } else {
      switch (true) {
        case page <= 2:
          pages = [1, 2, 3, "...", totalPage];
          break;
        case page >= totalPage - 1:
          pages = [1, "...", totalPage - 2, totalPage - 1, totalPage];
          break;
        case page - 2 === 1:
          pages = [1, page - 1, page, page + 1, page + 2, "...", totalPage];
          break;
        case page + 2 === totalPage:
          pages = [1, "...", page - 2, page - 1, page, page + 1, totalPage];
          break;
        case page - 3 === 1 && page + 3 !== totalPage:
          pages = [
            1,
            page - 2,
            page - 1,
            page,
            page + 1,
            page + 2,
            "...",
            totalPage,
          ];
          break;
        case page - 3 !== 1 && page + 3 === totalPage:
          pages = [
            1,
            "...",
            page - 2,
            page - 1,
            page,
            page + 1,
            page + 2,
            totalPage,
          ];
          break;
        case page - 3 === 1 && page + 3 === totalPage:
          pages = [1, page - 2, page - 1, page, page + 1, page + 2, totalPage];
          break;
        default:
          pages = [
            1,
            "...",
            page - 2,
            page - 1,
            page,
            page + 1,
            page + 2,
            "...",
            totalPage,
          ];
          break;
      }
    }
    setDisplayedPages(pages);
  };

  return { handlePageChange, displayedPages };
};

export default usePagination;
