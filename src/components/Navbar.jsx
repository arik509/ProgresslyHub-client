import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="navbar bg-base-200 shadow-lg">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          ProgresslyHub
        </Link>
      </div>
      
      {user && (
        <>
          <div className="flex-none hidden md:flex">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/">Dashboard</Link></li>
              <li><Link to="/projects">Projects</Link></li>
              <li><Link to="/tasks">Tasks</Link></li>
              {['CEO', 'ADMIN', 'MANAGER'].includes(user.role) && (
                <li><Link to="/members">Members</Link></li>
              )}
            </ul>
          </div>
          
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span className="text-xl">{user.email?.[0]?.toUpperCase()}</span>
                </div>
              </div>
              <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                <li className="menu-title">
                  <span>{user.email}</span>
                  <span className="badge badge-sm badge-primary mt-1">{user.role}</span>
                </li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/settings">Settings</Link></li>
                <li><a onClick={logout}>Logout</a></li>
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
