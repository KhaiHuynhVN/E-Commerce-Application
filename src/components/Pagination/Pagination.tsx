import { memo } from "react";
import classNames from "classnames/bind";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

import styles from "./Pagination.module.scss";
import usePagination from "./usePagination";

const cx = classNames.bind(styles);

const Pagination = ({
   styleType,
   className,
   itemListClassName,
   itemClassName,
   itemInnerClassName,
   nextIconClassName,
   preIconClassName,
   nextIconInnerClassName,
   preIconInnerClassName,
   activeItemClassName,
   disabledItemClassName,
   disabledIconClassName,
   currentPage,
   totalPage,
   onPageChange = () => {},
   query,
   path,
   preIcon,
   nextIcon,
   isDataLoaded,
   currentSearchParams,
   useNavigation = true,
}) => {
   const { displayedPages, handlePageChange } = usePagination({
      currentPage,
      onPageChange,
      query,
      path,
      totalPage,
      isDataLoaded,
      currentSearchParams,
      useNavigation,
   });

   return (
      <div
         className={cx("wrapper", className, {
            [styleType]: styleType,
         })}
      >
         <ul className={cx("item-list", itemListClassName)}>
            <li className={cx("item", itemClassName, preIconClassName)}>
               {useNavigation ? (
                  <Link
                     to={`${path}${
                        query
                           ? `?${query}=${currentPage <= 1 ? 1 : currentPage - 1}`
                           : `/${currentPage <= 1 ? 1 : currentPage - 1}`
                     }`}
                     className={cx("item-link", itemInnerClassName, preIconInnerClassName, {
                        "item-icon-link": preIcon,
                        disabled: !disabledIconClassName && currentPage <= 1,
                        [disabledIconClassName]: disabledIconClassName && currentPage <= 1,
                     })}
                     onClick={(e) => handlePageChange(e, currentPage - 1)}
                  >
                     {preIcon || "Prev"}
                  </Link>
               ) : (
                  <button
                     className={cx("item-link", itemInnerClassName, preIconInnerClassName, {
                        "item-icon-link": preIcon,
                        disabled: !disabledIconClassName && currentPage <= 1,
                        [disabledIconClassName]: disabledIconClassName && currentPage <= 1,
                     })}
                     onClick={() => handlePageChange(null, currentPage - 1)}
                     disabled={currentPage <= 1}
                  >
                     {preIcon || "Prev"}
                  </button>
               )}
            </li>
            {displayedPages.map((page, index) => (
               <li key={index} className={cx("item", itemClassName)}>
                  {useNavigation ? (
                     <Link
                        to={`${path}${query ? `?${query}=${page}` : `/${page}`}`}
                        className={cx("item-link", itemInnerClassName, {
                           active: !activeItemClassName && currentPage === page,
                           disabled: !disabledItemClassName && page === "...",
                           [activeItemClassName]: activeItemClassName && currentPage === page,
                           [disabledItemClassName]: disabledItemClassName && page === "...",
                        })}
                        onClick={(e) => handlePageChange(e, page)}
                     >
                        {page}
                     </Link>
                  ) : (
                     <button
                        className={cx("item-link", itemInnerClassName, {
                           active: !activeItemClassName && currentPage === page,
                           disabled: !disabledItemClassName && page === "...",
                           [activeItemClassName]: activeItemClassName && currentPage === page,
                           [disabledItemClassName]: disabledItemClassName && page === "...",
                        })}
                        onClick={() => handlePageChange(null, page)}
                        disabled={page === "..."}
                     >
                        {page}
                     </button>
                  )}
               </li>
            ))}
            <li className={cx("item", itemClassName, nextIconClassName)}>
               {useNavigation ? (
                  <Link
                     to={`${path}${
                        query
                           ? `?${query}=${currentPage >= totalPage ? totalPage : currentPage + 1}`
                           : `/${currentPage >= totalPage ? totalPage : currentPage + 1}`
                     }`}
                     className={cx("item-link", itemInnerClassName, nextIconInnerClassName, {
                        "item-icon-link": nextIcon,
                        disabled: !disabledIconClassName && currentPage >= totalPage,
                        [disabledIconClassName]: disabledIconClassName && currentPage >= totalPage,
                     })}
                     onClick={(e) => handlePageChange(e, currentPage + 1)}
                  >
                     {nextIcon || "Next"}
                  </Link>
               ) : (
                  <button
                     className={cx("item-link", itemInnerClassName, nextIconInnerClassName, {
                        "item-icon-link": nextIcon,
                        disabled: !disabledIconClassName && currentPage >= totalPage,
                        [disabledIconClassName]: disabledIconClassName && currentPage >= totalPage,
                     })}
                     onClick={() => handlePageChange(null, currentPage + 1)}
                     disabled={currentPage >= totalPage}
                  >
                     {nextIcon || "Next"}
                  </button>
               )}
            </li>
         </ul>
      </div>
   );
};

Pagination.propTypes = {
   styleType: propTypes.string,
   className: propTypes.string,
   itemListClassName: propTypes.string,
   itemClassName: propTypes.string,
   itemInnerClassName: propTypes.string,
   nextIconClassName: propTypes.string,
   preIconClassName: propTypes.string,
   nextIconInnerClassName: propTypes.string,
   preIconInnerClassName: propTypes.string,
   activeItemClassName: propTypes.string,
   disabledItemClassName: propTypes.string,
   disabledIconClassName: propTypes.string,
   currentPage: propTypes.number.isRequired,
   totalPage: propTypes.number.isRequired,
   onPageChange: propTypes.func.isRequired,
   query: propTypes.string,
   path: propTypes.string,
   preIcon: propTypes.node,
   nextIcon: propTypes.node,
   isDataLoaded: propTypes.bool,
   currentSearchParams: propTypes.object,
   useNavigation: propTypes.bool,
};

export default memo(Pagination);
