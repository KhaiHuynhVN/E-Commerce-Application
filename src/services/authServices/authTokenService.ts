/**
 * Auth Token Service
 * Quản lý access token và refresh token với expiration tracking
 */

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const TOKEN_EXPIRES_AT_KEY = "tokenExpiresAt";

// Simulated access token expiration: 15 minutes
const ACCESS_TOKEN_EXPIRY_TIME = 15 * 60 * 1000;
// Buffer time trước khi token expire để refresh (1 minute)
const REFRESH_BUFFER_TIME = 60 * 1000;

class AuthTokenService {
  /**
   * Lưu tokens sau khi login
   */
  setTokens(accessToken: string, refreshToken: string): void {
    const expiresAt = Date.now() + ACCESS_TOKEN_EXPIRY_TIME;

    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
  }

  /**
   * Lấy access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Lấy refresh token
   */
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Check xem access token có sắp hết hạn không
   * (trong vòng REFRESH_BUFFER_TIME)
   */
  isTokenExpiringSoon(): boolean {
    const expiresAt = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
    if (!expiresAt) return true;

    const expiryTime = parseInt(expiresAt, 10);
    const now = Date.now();

    // Token expired hoặc sắp expired (trong buffer time)
    return now >= expiryTime - REFRESH_BUFFER_TIME;
  }

  /**
   * Check xem token đã hết hạn hoàn toàn chưa
   */
  isTokenExpired(): boolean {
    const expiresAt = localStorage.getItem(TOKEN_EXPIRES_AT_KEY);
    if (!expiresAt) return true;

    return Date.now() >= parseInt(expiresAt, 10);
  }

  /**
   * Update access token sau khi refresh
   */
  updateAccessToken(newAccessToken: string, newRefreshToken?: string): void {
    const expiresAt = Date.now() + ACCESS_TOKEN_EXPIRY_TIME;

    localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
    localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());

    // Nếu có refresh token mới (token rotation)
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    }
  }

  /**
   * Clear tất cả tokens (logout)
   */
  clearTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
  }

  /**
   * Check xem user có authenticated không
   */
  isAuthenticated(): boolean {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    // Có cả 2 tokens và ít nhất refresh token còn valid
    return !!(accessToken && refreshToken);
  }
}

export const authTokenService = new AuthTokenService();
export default authTokenService;
