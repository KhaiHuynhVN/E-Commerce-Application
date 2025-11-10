import { lazy } from "react";

import routeConfigs from "../routeConfigs";

// import pages
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ProductListPage = lazy(() => import("../pages/ProductListPage"));
const CartPage = lazy(() => import("../pages/CartPage"));

// import layouts
const NoHeaderAndFooterLayout = lazy(
  () => import("../layouts/NoHeaderAndFooterLayout")
);
const HeaderOnlyLayout = lazy(() => import("../layouts/HeaderOnlyLayout"));

const routes = [
  {
    path: routeConfigs.login.path,
    component: LoginPage,
    layout: NoHeaderAndFooterLayout,
  },
  {
    path: routeConfigs.products.path,
    component: ProductListPage,
    layout: HeaderOnlyLayout,
  },
  {
    path: routeConfigs.cart.path,
    component: CartPage,
    layout: HeaderOnlyLayout,
  },
];

export default routes;
