import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import HomeLayout from "./layouts/HomeLayout";

// Pages
import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Unauthorized from "./pages/Unauthorized";
// import NotFound from "./pages/NotFound";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      {/* <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} /> */}

      {/* Home routes with layout */}
      <Route element={<HomeLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* 404 */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

export default App;
