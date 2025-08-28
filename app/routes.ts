import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("expenses", "routes/expenses.tsx"),
  route("expenses/new", "routes/expenses-new.tsx"),
  route("stats", "routes/stats.tsx"),
] satisfies RouteConfig;
