import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content">
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
        <Link className="link link-hover" to="/projects">Projects</Link>
        <Link className="link link-hover" to="/tasks">Tasks</Link>
        <Link className="link link-hover" to="/members">Members</Link>
      </nav>

      <nav>
        <h6 className="footer-title">Company</h6>
        <a className="link link-hover">About</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Privacy</a>
      </nav>
    </footer>
  );
};

export default Footer;
