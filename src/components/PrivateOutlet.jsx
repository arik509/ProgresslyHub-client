import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateOutlet = () => {
  const { user, loading, mode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // If user is trying to access /app routes but hasn't selected a mode yet
  // (Allow /mode-selection itself to be accessed)
  if (!mode && !location.pathname.includes("/mode-selection") && location.pathname.startsWith("/app")) {
    return <Navigate to="/mode-selection" replace />;
  }

  return <Outlet />;
};

export default PrivateOutlet;
