interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

interface AuthError {
  message: string;
}

export type { LoginRequest, LoginResponse, AuthError };
