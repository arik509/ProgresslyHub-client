import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* You can also create a simpler AuthNavbar if you want */}
      <Navbar />

      <main className="flex-1 bg-base-100">
        {/* Nice subtle background for auth pages */}
        <div className="bg-gradient-to-b from-base-200/80 to-base-100">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthLayout;
