interface RouteConfig {
  pageName: string;
  path: string;
}

interface RouteConfigs {
  login: RouteConfig;
  // Thêm các routes khác ở đây khi cần
  // home: RouteConfig;
  // dashboard: RouteConfig;
}

const routeConfigs: RouteConfigs = {
  login: {
    pageName: "Login",
    path: "/login",
  },
} as const;

export default routeConfigs;
export type { RouteConfig, RouteConfigs };
