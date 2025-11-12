class PendingManager {
  // Auth services
  #isLoginPending: boolean = false;
  #isGetCurrentUserPending: boolean = false;
  #isRefreshTokenPending: boolean = false;

  // Products services
  #isGetProductsPending: boolean = false;
  #isSearchProductsPending: boolean = false;
  #isGetProductByIdPending: boolean = false;
  #isGetCategoriesPending: boolean = false;

  // Cart services
  #addToCartPendingProductIds: Set<number> = new Set();
  #updateCartPendingProductIds: Set<number> = new Set();
  #isGetCartPending: boolean = false;
  #isDeleteCartPending: boolean = false;

  // User services
  #isUpdateUserPending: boolean = false;

  // Auth - Login
  setLoginPending(isPending: boolean): void {
    this.#isLoginPending = isPending;
  }

  get isLoginPending(): boolean {
    return this.#isLoginPending;
  }

  // Auth - Get Current User
  setGetCurrentUserPending(isPending: boolean): void {
    this.#isGetCurrentUserPending = isPending;
  }

  get isGetCurrentUserPending(): boolean {
    return this.#isGetCurrentUserPending;
  }

  // Auth - Refresh Token
  setRefreshTokenPending(isPending: boolean): void {
    this.#isRefreshTokenPending = isPending;
  }

  get isRefreshTokenPending(): boolean {
    return this.#isRefreshTokenPending;
  }

  // Products - Get Products
  setGetProductsPending(isPending: boolean): void {
    this.#isGetProductsPending = isPending;
  }

  get isGetProductsPending(): boolean {
    return this.#isGetProductsPending;
  }

  // Products - Search Products
  setSearchProductsPending(isPending: boolean): void {
    this.#isSearchProductsPending = isPending;
  }

  get isSearchProductsPending(): boolean {
    return this.#isSearchProductsPending;
  }

  // Products - Get Product By Id
  setGetProductByIdPending(isPending: boolean): void {
    this.#isGetProductByIdPending = isPending;
  }

  get isGetProductByIdPending(): boolean {
    return this.#isGetProductByIdPending;
  }

  // Products - Get Categories
  setGetCategoriesPending(isPending: boolean): void {
    this.#isGetCategoriesPending = isPending;
  }

  get isGetCategoriesPending(): boolean {
    return this.#isGetCategoriesPending;
  }

  // Cart - Add To Cart (per product ID)
  addAddToCartPendingProductId(productId: number): void {
    this.#addToCartPendingProductIds.add(productId);
  }

  removeAddToCartPendingProductId(productId: number): void {
    this.#addToCartPendingProductIds.delete(productId);
  }

  hasAddToCartPendingProductId(productId: number): boolean {
    return this.#addToCartPendingProductIds.has(productId);
  }

  // Cart - Update Cart (per product ID)
  addUpdateCartPendingProductId(productId: number): void {
    this.#updateCartPendingProductIds.add(productId);
  }

  removeUpdateCartPendingProductId(productId: number): void {
    this.#updateCartPendingProductIds.delete(productId);
  }

  hasUpdateCartPendingProductId(productId: number): boolean {
    return this.#updateCartPendingProductIds.has(productId);
  }

  // Cart - Get Cart
  setGetCartPending(isPending: boolean): void {
    this.#isGetCartPending = isPending;
  }

  get isGetCartPending(): boolean {
    return this.#isGetCartPending;
  }

  // Cart - Delete Cart
  setDeleteCartPending(isPending: boolean): void {
    this.#isDeleteCartPending = isPending;
  }

  get isDeleteCartPending(): boolean {
    return this.#isDeleteCartPending;
  }

  // User - Update User
  setUpdateUserPending(isPending: boolean): void {
    this.#isUpdateUserPending = isPending;
  }

  get isUpdateUserPending(): boolean {
    return this.#isUpdateUserPending;
  }
}

const pendingManager = new PendingManager();

export default pendingManager;
