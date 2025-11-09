import { lazy } from "react";

import routeConfigs from "../routeConfigs";

// import pages
const LoginPage = lazy(() => import("../pages/LoginPage"));

// import layouts
const NoHeaderAndFooterLayout = lazy(
  () => import("../layouts/NoHeaderAndFooterLayout")
);
// const HeaderOnlyLayout = lazy(() => import("../layouts/HeaderOnlyLayout"));

const routes = [
  {
    path: routeConfigs.login.path,
    component: LoginPage,
    layout: NoHeaderAndFooterLayout,
  },
  // { path: routeConfigs.order.path, component: OrderPage, layout: HeaderOnlyLayout },
];

export default routes;
