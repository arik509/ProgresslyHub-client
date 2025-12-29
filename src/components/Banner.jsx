import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Banner = () => {
  const { user } = useAuth();

  return (
    <section className="hero min-h-[70vh] bg-base-200">
      <div className="hero-content flex-col lg:flex-row gap-10">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Run your office work from one place.
          </h1>

          <p className="py-6 text-base-content/70 text-lg">
            Projects, tasks, and progress entries—built for CEO → Manager → Employee workflows.
            Keep every office separate and secure.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
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

          <div className="mt-6 flex flex-wrap gap-2">
            <div className="badge badge-outline">Multi-office</div>
            <div className="badge badge-outline">Role-based</div>
            <div className="badge badge-outline">Hierarchy</div>
            <div className="badge badge-outline">Progress tracking</div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="card bg-base-100 shadow-xl border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Quick preview</h2>

              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-base-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Project: Website Revamp</span>
                    <span className="badge badge-success">72%</span>
                  </div>
                  <progress className="progress progress-success w-full mt-2" value="72" max="100"></progress>
                </div>

                <div className="p-3 rounded-lg bg-base-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Task: Prepare report</span>
                    <span className="badge badge-warning">TODO</span>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">
                    Assigned by Manager • Due tomorrow
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-base-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Progress entry</span>
                    <span className="badge badge-info">Email</span>
                  </div>
                  <p className="text-sm text-base-content/70 mt-1">
                    “Sent client update email”
                  </p>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <Link to="/register" className="btn btn-primary btn-sm">
                  Try it
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
