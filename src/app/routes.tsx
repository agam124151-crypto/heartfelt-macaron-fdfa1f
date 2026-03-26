import { createBrowserRouter } from "react-router";
import { Home } from "./pages/Home";
import { ArticleDetail } from "./pages/ArticleDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/article/:id",
    Component: ArticleDetail,
  },
]);
