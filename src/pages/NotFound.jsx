import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="text-center max-w-xl">
        <div className="text-7xl md:text-8xl font-extrabold text-primary">404</div>
        <h1 className="mt-3 text-2xl md:text-3xl font-bold">Page not found</h1>
        <p className="mt-2 text-base-content/70">
          The page you’re looking for doesn’t exist or was moved.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
