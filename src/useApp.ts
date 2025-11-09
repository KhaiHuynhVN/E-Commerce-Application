/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useSelector } from "react-redux";

import { useLanguage } from "./hooks";
import { authSelectors } from "./store/slices";

const useApp = () => {
  const { initLanguage } = useLanguage();

  const token = useSelector(authSelectors.token);

  useEffect(() => {
    initLanguage();
  }, []);

  return { token };
};

export default useApp;
