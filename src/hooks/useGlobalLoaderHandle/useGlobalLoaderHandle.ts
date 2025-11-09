import { useDispatch } from "react-redux";

import { globalLoaderActions } from "../../store/slices";

const useGlobalLoaderHandle = () => {
   const dispatch = useDispatch();

   const show = () => {
      dispatch(globalLoaderActions.showLoader());
      document.body.classList.add("overflow-hidden");
   };

   const hide = () => {
      dispatch(globalLoaderActions.hideLoader());
      document.body.classList.remove("overflow-hidden");
   };

   return { show, hide };
};

export default useGlobalLoaderHandle;
