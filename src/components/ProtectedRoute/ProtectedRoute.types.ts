import type { ReactNode } from "react";

// =====================================================
// PROTECTED ROUTE TYPES - Tất cả types cho ProtectedRoute component
// =====================================================

/** Props cho ProtectedRoute component */
interface ProtectedRouteProps {
  /** React children */
  children: ReactNode;
  /** Đường dẫn hiện tại */
  path: string;
  /** Token xác thực */
  token: string | null | undefined;
}

export type { ProtectedRouteProps };
