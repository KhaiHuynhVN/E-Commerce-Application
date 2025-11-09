/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { globalLoaderSelectors } from "../../store/slices";

const useLoader = ({ isSuspenseFallBack, cx }) => {
   const isLoading = useSelector(globalLoaderSelectors.isLoading);
   const [isRender, setIsRender] = useState(false);

   const wrapperRef = useRef(null);

   useEffect(() => {
      if (!isLoading && !isSuspenseFallBack) return;
      setIsRender(true);
   }, [isLoading]);

   const handleHideLoader = (e) => {
      if (e.animationName === cx("hideLoader")) {
         setIsRender(false);
      }
   };

   return { isRender, wrapperRef, isLoading, handleHideLoader };
};

export default useLoader;
