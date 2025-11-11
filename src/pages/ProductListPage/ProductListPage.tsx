/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

import { productsService, cartsService } from "@/services";
import { cartActions, cartSelectors, authSelectors } from "@/store/slices";
import { InlineLoader } from "@/components";
import { notifyService, pendingManager } from "@/utils";
import {
  ProductCard,
  ProductCardSkeleton,
  SearchBar,
  type Product,
} from "./components";

import styles from "./ProductListPage.module.scss";

const cx = classNames.bind(styles);

// Số sản phẩm mỗi lần load
const LIMIT = 20;

const ProductListPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const user = useSelector(authSelectors.user);
  const cart = useSelector(cartSelectors.cart);

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const skipRef = useRef(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const hasMore = products.length < total;

  // Fetch products từ API
  const fetchProducts = async (currentSkip: number, isAppend = false) => {
    if (pendingManager.isGetProductsPending) return;

    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      setIsLoading(true);
      setError(null);

      let response;
      if (searchQuery.trim()) {
        // Search mode
        response = await productsService.searchProducts({
          q: searchQuery,
          limit: LIMIT,
          skip: currentSkip,
        });
      } else {
        // Normal mode
        response = await productsService.getProducts({
          limit: LIMIT,
          skip: currentSkip,
        });
      }

      // Check if aborted
      if (abortController.signal.aborted) return;

      if (isAppend) {
        setProducts((prev) => [...prev, ...response.products]);
      } else {
        setProducts(response.products);
      }

      setTotal(response.total);
    } catch (err) {
      // Ignore aborted requests
      if (err instanceof Error && err.name === "AbortError") return;

      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch products khi component mount
  useEffect(() => {
    fetchProducts(0, false);
  }, []);

  // Cleanup: Abort all pending requests on unmount
  useEffect(() => {
    return () => {
      // Abort any pending API requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Disconnect observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Debounced search
  useEffect(() => {
    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      // Reset và fetch lại khi search query thay đổi
      skipRef.current = 0;
      fetchProducts(0, false);
    }, 500);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery]);

  // Infinite scroll với IntersectionObserver
  useEffect(() => {
    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Callback khi last product xuất hiện trong viewport
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        // Load more products
        const newSkip = skipRef.current + LIMIT;
        skipRef.current = newSkip;
        fetchProducts(newSkip, true);
      }
    };

    // Create new observer
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      // Trigger 100px trước khi đến bottom
      rootMargin: "100px",
      threshold: 0.1,
    });

    // Observe last product element
    if (lastProductRef.current) {
      observerRef.current.observe(lastProductRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [products, hasMore, isLoading]);

  // Handle search query change
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Handle add to cart
  const handleAddToCart = useCallback(
    async (product: Product) => {
      if (!user) {
        notifyService.addNotification(
          <div>
            <strong>{t("serverErrors.error")}:</strong>{" "}
            {t("serverErrors.unknownError")}
          </div>,
          {
            type: "error",
            duration: 3000,
            showProgressBar: true,
            freezeOnHover: true,
            stack: true,
            newItemOnTop: true,
            placement: "top-right",
            width: 350,
            maxWidth: 350,
          }
        );
        return;
      }

      // Kiểm tra xem đã pending chưa (để tránh spam clicks cho cùng sản phẩm)
      if (pendingManager.hasAddToCartPendingProductId(product.id)) {
        return;
      }

      // Show pending notification ngay lập tức
      const { id: notificationId, placement } = notifyService.addNotification(
        <div>
          <strong>{product.title}</strong> -{" "}
          {t("pendingMessages.addToCartInProgress")}
        </div>,
        {
          promise: true,
          type: "info",
          duration: 3000,
          showProgressBar: true,
          freezeOnHover: true,
          stack: true,
          newItemOnTop: true,
          placement: "top-right",
          width: 350,
          maxWidth: 350,
        }
      );

      try {
        // Gọi API trực tiếp (không optimistic update)
        let response;
        if (!cart) {
          // Nếu chưa có cart, tạo mới
          response = await cartsService.addToCart(
            {
              userId: user.id,
              products: [{ id: product.id, quantity: 1 }],
            },
            product.id
          );
        } else {
          // Check xem product đã có trong cart chưa
          const existingProduct = cart.products.find(
            (p) => p.id === product.id
          );
          const newQuantity = existingProduct
            ? existingProduct.quantity + 1
            : 1;

          // Xây dựng danh sách products cho update
          const updatedProducts = [
            ...cart.products
              .filter((p) => p.id !== product.id)
              .map((p) => ({ id: p.id, quantity: p.quantity })),
            { id: product.id, quantity: newQuantity },
          ];

          response = await cartsService.updateCart(
            cart.id,
            {
              merge: false,
              products: updatedProducts,
            },
            product.id
          );
        }

        // Update Redux state với API response
        dispatch(cartActions.setCart(response));

        // Cập nhật notification thành công
        notifyService.updatePromiseState({
          id: notificationId,
          placement,
          state: "fulfilled",
        });
        notifyService.updateNotification(notificationId, {
          message: (
            <div>
              <strong>{product.title}</strong> {t("products.addedToCart")}
            </div>
          ),
          type: "success",
        });
      } catch (err) {
        // Cập nhật notification thành lỗi
        notifyService.updatePromiseState({
          id: notificationId,
          placement,
          state: "rejected",
        });

        // Chỉ cập nhật notification nếu không phải lỗi duplicate request
        if (
          err instanceof Error &&
          !err.message.includes("already in progress")
        ) {
          const errorMessage =
            err instanceof Error ? err.message : t("serverErrors.unknownError");
          notifyService.updateNotification(notificationId, {
            message: (
              <div>
                <strong>{t("serverErrors.error")}:</strong> {errorMessage}
              </div>
            ),
            type: "error",
          });
        } else {
          // Nếu là duplicate request, xóa notification đang pending đi
          notifyService.removeNotification(notificationId);
        }
      }
    },
    [user, cart, t]
  );

  return (
    <div className={cx("wrapper", "min-h-screen p-6")}>
      <div className={cx("container", "mx-auto")}>
        {/* Header */}
        <h1 className={cx("title", "text-5xl font-bold text-center mb-8")}>
          {t("products.title")}
        </h1>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder={t("common.search")}
        />

        {/* Error Message */}
        {error && (
          <div className={cx("error", "text-center mb-6 p-4 rounded-lg")}>
            {error}
          </div>
        )}

        {/* Products Count */}
        {!error && products.length > 0 && (
          <p className={cx("count", "text-center mb-6")}>
            {products.length === 1
              ? t("products.productFound", { count: products.length })
              : t("products.productsFound", { count: products.length })}
          </p>
        )}

        {/* Skeleton Loading - Initial Load */}
        {isLoading && products.length === 0 && !error && (
          <div className={cx("productGrid")}>
            {Array.from({ length: LIMIT }).map((_, index) => (
              <ProductCardSkeleton key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!error && products.length > 0 && (
          <div className={cx("productGrid")}>
            {products.map((product, index) => (
              <div
                key={product.id}
                ref={index === products.length - 1 ? lastProductRef : null}
              >
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </div>
            ))}
          </div>
        )}

        {/* Inline Loader - Load More */}
        {isLoading && products.length > 0 && (
          <InlineLoader
            className="mt-[24px]"
            boxSize="30px"
            containerSize="calc(30*6px)"
          />
        )}

        {/* No Results */}
        {!isLoading && !error && products.length === 0 && searchQuery && (
          <p className={cx("noResults", "text-center")}>
            {t("products.noResults", { query: searchQuery })}
          </p>
        )}

        {/* No More Products */}
        {!hasMore && products.length > 0 && (
          <p className={cx("noMore", "text-center py-8")}>
            {t("products.noMoreProducts")}
          </p>
        )}
      </div>
    </div>
  );
};

export default memo(ProductListPage);
