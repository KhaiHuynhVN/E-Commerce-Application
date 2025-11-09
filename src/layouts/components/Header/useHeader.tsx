/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";
import type classNames from "classnames";

interface UseHeaderProps {
  /** ClassNames bind function từ classnames/bind */
  cx: (...args: classNames.ArgumentArray) => string;
}

const useHeader = ({ cx }: UseHeaderProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stickypoint = (wrapperRef.current?.offsetTop ?? 0) - 1;

    const stickyHandle = () => {
      if (window.scrollY > stickypoint) {
        wrapperRef.current?.classList.add(cx("sticky"));
      } else {
        wrapperRef.current?.classList.remove(cx("sticky"));
      }
    };

    window.document.addEventListener("scroll", stickyHandle);

    return () => {
      window.document.body.removeEventListener("scroll", stickyHandle);
    };
  }, []);

  return {
    wrapperRef,
  };
};

export default useHeader;
