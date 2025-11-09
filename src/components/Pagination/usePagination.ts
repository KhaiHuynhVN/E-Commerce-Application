/* eslint-disable react-hooks/exhaustive-deps */
import { useLayoutEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const usePagination = ({
   currentPage,
   onPageChange,
   query,
   path,
   totalPage,
   isDataLoaded,
   currentSearchParams,
   useNavigation = true,
}) => {
   const navigate = useNavigate();
   const [, setSearchParams] = useSearchParams({});
   const [displayedPages, setDisplayedPages] = useState([]);

   useLayoutEffect(() => {
      if (!isDataLoaded) {
         setDisplayedPages([]);
         return;
      }

      if (currentPage < 1 || Number.isNaN(currentPage)) {
         onPageChange(1);
         useNavigation && setSearchParams(updateSearchParams(1), { replace: true });
      } else if (currentPage > totalPage && totalPage !== 0) {
         onPageChange(totalPage);
         useNavigation && setSearchParams(updateSearchParams(totalPage), { replace: true });
      } else {
         updateDisplayedPages(currentPage);
      }
   }, [currentPage, totalPage, isDataLoaded]);

   function updateSearchParams(page) {
      const encodedPage = encodeURIComponent(page);
      currentSearchParams.set(query, encodedPage);
      return currentSearchParams;
   }

   const handlePageChange = (e, page) => {
      if (useNavigation) {
         e?.preventDefault();
         if (page < 1 || page > totalPage || page === "...") {
            return;
         }
         query ? setSearchParams(updateSearchParams(page)) : navigate(`${path}/${page}`);
      } else {
         if (page < 1 || page > totalPage || page === "...") {
            return;
         }
      }

      updateDisplayedPages(page);
      onPageChange(page);
   };

   const updateDisplayedPages = (page) => {
      let pages = [];

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
               pages = [1, page - 2, page - 1, page, page + 1, page + 2, "...", totalPage];
               break;
            case page - 3 !== 1 && page + 3 === totalPage:
               pages = [1, "...", page - 2, page - 1, page, page + 1, page + 2, totalPage];
               break;
            case page - 3 === 1 && page + 3 === totalPage:
               pages = [1, page - 2, page - 1, page, page + 1, page + 2, totalPage];
               break;
            default:
               pages = [1, "...", page - 2, page - 1, page, page + 1, page + 2, "...", totalPage];
               break;
         }
      }
      setDisplayedPages(pages);
   };

   return { handlePageChange, displayedPages };
};

export default usePagination;
