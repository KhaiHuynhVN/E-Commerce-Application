class PendingManager {
  #isLoginPending: boolean = false;

  // Login
  setLoginPending(isPending: boolean): void {
    this.#isLoginPending = isPending;
  }

  get isLoginPending(): boolean {
    return this.#isLoginPending;
  }
}

const pendingManager = new PendingManager();
export default pendingManager;
