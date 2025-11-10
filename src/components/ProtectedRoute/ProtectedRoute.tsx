import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import routeConfigs from "../../routeConfigs";
import type { ProtectedRouteProps } from "./ProtectedRoute.types";

const ProtectedRoute = ({
  children,
  path,
  token,
}: ProtectedRouteProps): ReactNode => {
  // Nếu đường dẫn là login thì không cần kiểm tra token
  if (path === routeConfigs.login.path) {
    return children;
  }

  // Nếu không phải login và không có token thì chuyển hướng đến trang login
  if (!token) {
    return <Navigate to={routeConfigs.login.path} replace />;
  }

  return children;
};

export default ProtectedRoute;
