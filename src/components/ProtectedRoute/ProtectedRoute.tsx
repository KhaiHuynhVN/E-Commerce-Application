import propTypes from "prop-types";
import { Navigate } from "react-router-dom";

import routeConfigs from "../../routeConfigs";

const ProtectedRoute = ({ children, path, token }) => {
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

ProtectedRoute.propTypes = {
   children: propTypes.node.isRequired,
   path: propTypes.string.isRequired,
   token: propTypes.any.isRequired,
};

export default ProtectedRoute;
