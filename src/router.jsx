import { createBrowserRouter } from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import PrivateOutlet from "./components/PrivateOutlet";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";


export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      { index: true, Component: Home },
      // later: dashboard, projects, tasks etc. will also go here
    ],
  },

  {
    path: "/auth",
    Component: AuthLayout,
    children: [
      { path: "login", Component: Login },
      { path: "register", Component: Register },
      { path: "unauthorized", Component: Unauthorized },
    ],
  },
  {
    path: "/app",
    Component: PrivateOutlet, // protects everything under /app
    children: [
      {
        Component: AppLayout,  // layout for logged-in area
        children: [
          { index: true, Component: Dashboard },
        ],
      },
    ],
  },
  { path: "*", Component: NotFound },
]);
