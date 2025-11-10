interface RouteConfig {
  pageName: string;
  path: string;
}

interface RouteConfigs {
  login: RouteConfig;
  products: RouteConfig;
  cart: RouteConfig;
  // Thêm các routes khác ở đây khi cần
  // profile: RouteConfig;
}

const routeConfigs: RouteConfigs = {
  login: {
    pageName: "Login",
    path: "/login",
  },
  products: {
    pageName: "Products",
    path: "/",
  },
  cart: {
    pageName: "Cart",
    path: "/cart",
  },
} as const;

export default routeConfigs;
export type { RouteConfig, RouteConfigs };
