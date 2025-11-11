import { lazy } from "react";

import routeConfigs from "../routeConfigs";

// import pages
const LoginPage = lazy(() => import("../pages/LoginPage"));
const ProductListPage = lazy(() => import("../pages/ProductListPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));

// import layouts
const NoHeaderAndFooterLayout = lazy(
  () => import("../layouts/NoHeaderAndFooterLayout")
);
const HeaderWithSidebarLayout = lazy(
  () => import("../layouts/HeaderWithSidebarLayout")
);

const routes = [
  {
    path: routeConfigs.login.path,
    component: LoginPage,
    layout: NoHeaderAndFooterLayout,
  },
  {
    path: routeConfigs.products.path,
    component: ProductListPage,
    layout: HeaderWithSidebarLayout,
  },
  {
    path: routeConfigs.cart.path,
    component: CartPage,
    layout: HeaderWithSidebarLayout,
  },
  {
    path: routeConfigs.checkout.path,
    component: CheckoutPage,
    layout: HeaderWithSidebarLayout,
  },
];

export default routes;
