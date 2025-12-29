import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-base-200 text-base-content">
      {/* Top footer */}
      <div className="footer p-10 sm:footer-horizontal">
        <aside>
          <Link to="/" className="btn btn-ghost text-xl font-bold px-0">
            ProgresslyHub
          </Link>
          <p className="max-w-xs text-base-content/70">
            Hierarchy-based office management for projects, tasks, and progress tracking.
          </p>
        </aside>

        <nav>
          <h6 className="footer-title">Product</h6>
          {!user ? (
            <>
              <Link className="link link-hover" to="/login">Login</Link>
              <Link className="link link-hover" to="/register">Create account</Link>
            </>
          ) : (
            <>
              <Link className="link link-hover" to="/projects">Projects</Link>
              <Link className="link link-hover" to="/tasks">Tasks</Link>
              <Link className="link link-hover" to="/members">Members</Link>
            </>
          )}
        </nav>

        <nav>
          <h6 className="footer-title">Company</h6>
          {/* Replace these with real routes later */}
          <a className="link link-hover">About</a>
          <a className="link link-hover">Contact</a>
          <a className="link link-hover">Privacy</a>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="footer items-center p-4 border-t border-base-300 sm:footer-horizontal">
        <aside className="grid-flow-row sm:grid-flow-col items-center gap-2">
          <p className="text-sm text-base-content/70">
            © {year} ProgresslyHub. All rights reserved.
          </p>
        </aside>

        <nav className="justify-self-start sm:justify-self-end">
          <div className="grid grid-flow-col gap-3">
            {/* Social icons placeholders; add your links */}
            <a className="link link-hover text-sm">Facebook</a>
            <a className="link link-hover text-sm">LinkedIn</a>
            <a className="link link-hover text-sm">GitHub</a>
          </div>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
