import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navLinkClass = ({ isActive }) =>
    `rounded-lg ${isActive ? "bg-primary text-primary-content" : ""}`;

  return (
    <div className="navbar bg-base-200 shadow-sm sticky top-0 z-50">
      <div className="navbar-start">
        {/* Mobile menu */}
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </div>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-52 p-2 shadow z-1"
          >
            <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
            {user && (
              <>
                <li><NavLink to="/projects" className={navLinkClass}>Projects</NavLink></li>
                <li><NavLink to="/tasks" className={navLinkClass}>Tasks</NavLink></li>
              </>
            )}
            {user && ["CEO", "ADMIN", "MANAGER"].includes(user.role) && (
              <li><NavLink to="/members" className={navLinkClass}>Members</NavLink></li>
            )}
          </ul>
        </div>

        <Link to="/" className="btn btn-ghost text-xl font-bold">
          ProgresslyHub
        </Link>
      </div>

      {/* Desktop menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><NavLink to="/" className={navLinkClass}>Home</NavLink></li>
          {user && (
            <>
              <li><NavLink to="/projects" className={navLinkClass}>Projects</NavLink></li>
              <li><NavLink to="/tasks" className={navLinkClass}>Tasks</NavLink></li>
            </>
          )}
          {user && ["CEO", "ADMIN", "MANAGER"].includes(user.role) && (
            <li><NavLink to="/members" className={navLinkClass}>Members</NavLink></li>
          )}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {!user ? (
          <>
            <Link to="/auth/login" className="btn btn-ghost">Login</Link>
            <Link to="/auth/register" className="btn btn-primary">Get started</Link>
          </>
        ) : (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-lg">{user.email?.[0]?.toUpperCase()}</span>
              </div>
            </div>

            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box mt-3 w-60 p-2 shadow z-1">
              <li className="menu-title">
                <span className="truncate">{user.email}</span>
                <span className="badge badge-primary badge-sm mt-1">{user.role}</span>
              </li>
              <li><NavLink to="/profile" className={navLinkClass}>Profile</NavLink></li>
              <li><NavLink to="/settings" className={navLinkClass}>Settings</NavLink></li>
              <li><button onClick={logout} className="text-error">Logout</button></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
