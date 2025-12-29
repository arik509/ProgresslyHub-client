import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        <div role="alert" className="alert alert-warning shadow border border-base-300">
          <div>
            <h3 className="font-bold text-lg">Unauthorized</h3>
            <div className="text-sm text-base-content/70">
              You don’t have permission to access this page.
            </div>
          </div>

          <Link to="/" className="btn btn-sm btn-ghost">
            Go Home
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link to="/login" className="link link-primary link-hover">
            Sign in with another account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
