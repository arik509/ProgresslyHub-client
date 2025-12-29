import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Banner = () => {
  const { user } = useAuth();

  return (
    <section className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Office tasks, projects, and progress—organized in one hub.
          </h1>

          <p className="py-6 text-base-content/70 text-lg">
            ProgresslyHub helps CEOs, managers, and employees collaborate with clear hierarchy,
            task assignment, and progress tracking.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {!user ? (
              <>
                <Link to="/register" className="btn btn-primary">
                  Create account
                </Link>
                <Link to="/login" className="btn btn-ghost">
                  Sign in
                </Link>
              </>
            ) : (
              <>
                <Link to="/projects" className="btn btn-primary">
                  Go to projects
                </Link>
                <Link to="/tasks" className="btn btn-ghost">
                  View tasks
                </Link>
              </>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-2 justify-center">
            <div className="badge badge-outline">Multi-office</div>
            <div className="badge badge-outline">Role-based</div>
            <div className="badge badge-outline">Progress entries</div>
            <div className="badge badge-outline">Project %</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
