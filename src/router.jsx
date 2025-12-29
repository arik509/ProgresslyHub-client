import { createBrowserRouter } from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, Component: Home },
    ],
  },

  // Public routes (outside layout for now)
  { path: "/login", Component: Login },
  { path: "/register", Component: Register },
  { path: "/unauthorized", Component: Unauthorized },

  // 404
  { path: "*", Component: NotFound },
]);
