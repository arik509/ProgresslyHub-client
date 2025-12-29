import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  const role = user?.role || "EMPLOYEE";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-base-content/70">
            Welcome back, <span className="font-semibold">{user?.name || user?.email}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link to="/app/projects" className="btn btn-primary btn-sm">
            Projects
          </Link>
          <Link to="/app/tasks" className="btn btn-ghost btn-sm">
            Tasks
          </Link>

          {(role === "CEO" || role === "ADMIN" || role === "MANAGER") && (
            <Link to="/app/members" className="btn btn-secondary btn-sm">
              Members
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats stats-vertical lg:stats-horizontal shadow border border-base-300 bg-base-100 w-full">
        <div className="stat">
          <div className="stat-title">Active Projects</div>
          <div className="stat-value text-primary">0</div>
          <div className="stat-desc">This will come from API</div>
        </div>

        <div className="stat">
          <div className="stat-title">Open Tasks</div>
          <div className="stat-value text-secondary">0</div>
          <div className="stat-desc">Assigned to you / your team</div>
        </div>

        <div className="stat">
          <div className="stat-title">Progress Entries</div>
          <div className="stat-value text-accent">0</div>
          <div className="stat-desc">Logged this week</div>
        </div>
      </div>

      {/* Role-based highlight cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="card-title">My Focus</h2>
            <p className="text-base-content/70">
              View your assigned tasks and update status quickly.
            </p>
            <div className="card-actions justify-end">
              <Link to="/app/tasks" className="btn btn-primary btn-sm">
                View my tasks
              </Link>
            </div>
          </div>
        </div>

        {(role === "MANAGER" || role === "CEO" || role === "ADMIN") && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Team Control</h2>
              <p className="text-base-content/70">
                Assign tasks to your team and track progress entries.
              </p>
              <div className="card-actions justify-end">
                <Link to="/app/tasks" className="btn btn-secondary btn-sm">
                  Assign / review
                </Link>
              </div>
            </div>
          </div>
        )}

        {role === "CEO" && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h2 className="card-title">CEO Overview</h2>
              <p className="text-base-content/70">
                Monitor all projects across departments and control roles.
              </p>
              <div className="card-actions justify-end">
                <Link to="/app/projects" className="btn btn-accent btn-sm">
                  View all projects
                </Link>
              </div>
            </div>
          </div>
        )}

        {(role !== "CEO" && role !== "MANAGER" && role !== "ADMIN") && (
          <div className="card bg-base-100 shadow border border-base-300">
            <div className="card-body">
              <h2 className="card-title">Progress Log</h2>
              <p className="text-base-content/70">
                Keep your work visible by logging progress entries.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-accent btn-sm" disabled>
                  Add progress (next)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent activity table (UI only for now) */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between gap-3">
            <h2 className="card-title">Recent activity</h2>
            <button className="btn btn-ghost btn-sm" disabled>
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto mt-3">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>1</th>
                  <td><span className="badge badge-outline">Task</span></td>
                  <td className="font-medium">Example: Prepare monthly report</td>
                  <td><span className="badge badge-warning">TODO</span></td>
                  <td className="text-base-content/70">—</td>
                </tr>
                <tr>
                  <th>2</th>
                  <td><span className="badge badge-outline">Project</span></td>
                  <td className="font-medium">Example: Website revamp</td>
                  <td><span className="badge badge-success">72%</span></td>
                  <td className="text-base-content/70">—</td>
                </tr>
                <tr>
                  <th>3</th>
                  <td><span className="badge badge-outline">Progress</span></td>
                  <td className="font-medium">Example: Sent client email update</td>
                  <td><span className="badge badge-info">Logged</span></td>
                  <td className="text-base-content/70">—</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-base-content/60">
            Next step: connect these sections to real API endpoints.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
