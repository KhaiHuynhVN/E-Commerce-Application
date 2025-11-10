/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { ArgumentArray } from "classnames";

import { globalLoaderSelectors } from "../../store/slices";

const useGlobalLoader = ({
  isSuspenseFallBack,
  cx,
}: {
  isSuspenseFallBack: boolean;
  cx: (...args: ArgumentArray) => string;
}) => {
  const isLoading = useSelector(globalLoaderSelectors.isLoading);
  const [isRender, setIsRender] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isLoading && !isSuspenseFallBack) return;
    setIsRender(true);
  }, [isLoading]);

  const handleHideLoader = (e: React.AnimationEvent<HTMLDivElement>) => {
    if (e.animationName === cx("hideLoader")) {
      setIsRender(false);
    }
  };

  return { isRender, wrapperRef, isLoading, handleHideLoader };
};

export default useGlobalLoader;
