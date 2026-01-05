import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, role, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? "bg-black text-white"
        : "text-base-content/70 hover:text-base-content"
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20">
      <div className="navbar max-w-6xl mx-auto px-4 lg:px-0">
        {/* Left: logo */}
        <div className="navbar-start gap-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-purple-300 text-white px-4 py-2 text-sm font-semibold shadow-md"
          >
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-black font-bold">
              P
            </span>
            <span>ProgresslyHub</span>
          </Link>

          {/* Desktop center nav */}
          <nav className="hidden lg:flex ml-6">
            <ul className="flex items-center gap-2 bg-white/40 backdrop-blur rounded-full px-2 py-1 shadow-sm">
              <li>
                <NavLink to="/" className={navLinkClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/personal" className={navLinkClass}>
                  Personal
                </NavLink>
              </li>
              <li>
                <NavLink to="/business" className={navLinkClass}>
                  Business
                </NavLink>
              </li>
              {user && ["CEO", "ADMIN", "MANAGER"].includes(role) && (
                <li>
                  <NavLink to="/app/members" className={navLinkClass}>
                    Employer
                  </NavLink>
                </li>
              )}
              {user && (
                <li>
                  <NavLink to="/app" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Right: auth buttons */}
        <div className="navbar-end gap-3">
          {!user ? (
            <>
              <Link
                to="/auth/login"
                className="text-sm font-medium text-base-content/80 hover:text-base-content"
              >
                Sign in
              </Link>
              <Link
                to="/auth/register"
                className="inline-flex items-center rounded-full bg-black text-white px-5 py-2 text-sm font-semibold shadow-md hover:bg-neutral-900 transition-colors"
              >
                Sign up free
              </Link>
            </>
          ) : (
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar placeholder border border-base-300"
              >
                <div className="bg-black text-white rounded-full w-9">
                  <span className="text-sm">
                    {user.email?.[0]?.toUpperCase()}
                  </span>
                </div>
              </button>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-60 p-2 shadow z-[1]"
              >
                <li className="menu-title">
                  <span className="truncate">{user.email}</span>
                  <span className="badge badge-neutral badge-sm mt-1">
                    {role || "EMPLOYEE"}
                  </span>
                </li>
                <li>
                  <NavLink to="/app">Dashboard</NavLink>
                </li>
                <li>
                  <NavLink to="/profile">Profile</NavLink>
                </li>
                <li>
                  <NavLink to="/settings">Settings</NavLink>
                </li>
                <li>
                  <button onClick={logout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </label>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-[1]"
              >
                <li>
                  <NavLink to="/">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/personal">Personal</NavLink>
                </li>
                <li>
                  <NavLink to="/business">Business</NavLink>
                </li>
                {user && (
                  <li>
                    <NavLink to="/app">Dashboard</NavLink>
                  </li>
                )}
                {user && ["CEO", "ADMIN", "MANAGER"].includes(role) && (
                  <li>
                    <NavLink to="/app/members">Employer</NavLink>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
