import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("transactions", "routes/transactions.tsx"),
  route("transactions/new", "routes/transaction-new.tsx"),
  route("stats", "routes/stats.tsx"),
] satisfies RouteConfig;
