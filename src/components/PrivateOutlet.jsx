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

  // Mode is now selected during login, so we don't need to redirect
  // Users without mode will see helpful messages in the dashboard

  return <Outlet />;
};

export default PrivateOutlet;
