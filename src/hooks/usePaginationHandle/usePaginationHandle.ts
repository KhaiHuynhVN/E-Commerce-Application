/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

const usePaginationHandle = ({ param, onPageChange, query, validQueries = [] }) => {
   const [searchParams, setSearchParams] = useSearchParams();
   const params = useParams();
   const currentSearchParams = new URLSearchParams(searchParams);

   useEffect(() => {
      if (validQueries.length === 0) return;

      let hasInvalidQuery = false;
      for (const key of currentSearchParams.keys()) {
         if (!validQueries.includes(key)) {
            currentSearchParams.delete(key);
            hasInvalidQuery = true;
         }
      }

      if (hasInvalidQuery) {
         setSearchParams(currentSearchParams, { replace: true });
      }
   }, [validQueries]);

   const page = useMemo(() => (query ? searchParams.get(query) : params[param]), [query, params, param]);

   const [currentPage, setCurrentPage] = useState(page || 1);

   const handlePageChange = useCallback(
      (page) => {
         const encodedPage = encodeURIComponent(page);
         setCurrentPage(encodedPage);
         onPageChange && onPageChange(encodedPage);
      },
      [onPageChange],
   );

   return { currentPage: +currentPage, handlePageChange, query, currentSearchParams, setCurrentPage };
};

export default usePaginationHandle;
