import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense } from "react";

import routes from "./routes";
import { GlobalLoader, NotifyContainer, ProtectedRoute } from "./components";
import useApp from "./useApp";
import routeConfigs from "./routeConfigs";

function App() {
  const { token } = useApp();

  return (
    <>
      <Router>
        <Suspense fallback={<GlobalLoader isSuspenseFallBack />}>
          <Routes>
            {routes.map((route, index) => {
              const { path, component: Page, layout: Layout } = route;

              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <ProtectedRoute path={path} token={token}>
                      <Layout>
                        <Page />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              );
            })}
            {/* Thêm route mặc định để xử lý các đường dẫn không tồn tại */}
            <Route
              path="*"
              element={<Navigate replace to={routeConfigs.login.path} />}
            />
          </Routes>
        </Suspense>
      </Router>
      <GlobalLoader />
      <NotifyContainer className={"z-[2]"} />
    </>
  );
}

export default App;
