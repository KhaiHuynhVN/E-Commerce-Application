/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useCallback, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import classNames from "classnames/bind";
import { useTranslation } from "react-i18next";

import { productsService, cartsService } from "@/services";
import { cartActions, cartSelectors, authSelectors } from "@/store/slices";
import { InnerLoader } from "@/components";
import { notifyService, pendingManager } from "@/utils";
import { ProductCard, SearchBar, type Product } from "./components";

import styles from "./ProductListPage.module.scss";

const cx = classNames.bind(styles);

const LIMIT = 20; // Số sản phẩm mỗi lần load

const ProductListPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Redux selectors (chỉ cho global state)
  const user = useSelector(authSelectors.user);
  const cart = useSelector(cartSelectors.cart);

  // Local state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState(0);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // Computed state
  const hasMore = products.length < total;

  // Refs
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch products từ API
  const fetchProducts = useCallback(
    async (currentSkip: number, isAppend = false) => {
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

        // Chỉ log error, không show notification (service đã show rồi)
        const errorMessage =
          err instanceof Error ? err.message : t("serverErrors.unknownError");
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [searchQuery, t]
  );

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
      setSkip(0);
      fetchProducts(0, false);
    }, 500); // 500ms debounce

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, fetchProducts]);

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
        const newSkip = skip + LIMIT;
        setSkip(newSkip);
        fetchProducts(newSkip, true);
      }
    };

    // Create new observer
    observerRef.current = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px", // Trigger 100px trước khi đến bottom
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
  }, [products, hasMore, isLoading, skip, fetchProducts]);

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

      // Check if already pending (prevent spam clicks for same product)
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
        // Tạo CartProduct từ Product
        const cartProduct = {
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1,
          total: product.price,
          discountPercentage: product.discountPercentage,
          discountedTotal:
            product.price * (1 - product.discountPercentage / 100),
          thumbnail: product.thumbnail,
        };

        // Optimistic update
        dispatch(cartActions.addProduct(cartProduct));

        // Nếu chưa có cart, tạo mới; nếu có rồi thì update (services tự handle pending)
        if (!cart) {
          await cartsService.addToCart(
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

          // Build products list for update
          const updatedProducts = [
            ...cart.products
              .filter((p) => p.id !== product.id)
              .map((p) => ({ id: p.id, quantity: p.quantity })),
            { id: product.id, quantity: newQuantity },
          ];

          await cartsService.updateCart(
            cart.id,
            {
              merge: false,
              products: updatedProducts,
            },
            product.id
          );
        }

        // Update notification to success
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
        // Update notification to error
        notifyService.updatePromiseState({
          id: notificationId,
          placement,
          state: "rejected",
        });

        // Chỉ update notification nếu không phải duplicate request error
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
          // Nếu là duplicate request, xóa pending notification đi
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

        {/* Loading Spinner */}
        {isLoading && (
          <div
            className={cx("loading", "flex justify-center items-center py-8")}
          >
            <InnerLoader size="40px" />
          </div>
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
