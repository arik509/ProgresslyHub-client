import { createBrowserRouter } from "react-router-dom";

import HomeLayout from "./layouts/HomeLayout";
import AuthLayout from "./layouts/AuthLayout";
import AppLayout from "./layouts/AppLayout";

import PrivateOutlet from "./components/PrivateOutlet";
import ManagerAreaOutlet from "./components/ManagerAreaOutlet";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Members from "./pages/Members";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [{ index: true, Component: Home }],
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
    Component: PrivateOutlet, // must render <Outlet />
    children: [
      {
        Component: AppLayout, // must render <Outlet />
        children: [
          { index: true, Component: Dashboard }, // /app
          { path: "projects", Component: Projects }, // /app/projects
          { path: "tasks", Component: Tasks }, // /app/tasks

          // Only CEO/ADMIN/MANAGER can access /app/members
          {
            Component: ManagerAreaOutlet, // must render <Outlet />
            children: [{ path: "members", Component: Members }],
          },
        ],
      },
    ],
  },

  { path: "*", Component: NotFound },
]);
