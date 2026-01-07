import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createOffice } from "../api/officesApi";
import { listProjects } from "../api/projectsApi";
import { listTasks } from "../api/tasksApi";
import { listPersonalProjects } from "../api/personalProjectsApi";
import { listPersonalTasks } from "../api/personalTasksApi";
import { refreshClaims } from "../api/refreshClaims";
import { useNavigate } from "react-router-dom";
import { initializeTeamMode } from "../api/teamApi";
import { initializePersonalMode } from "../api/personalProjectsApi";

const Dashboard = () => {
  const { user, officeId, role, mode, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [showCreateOffice, setShowCreateOffice] = useState(false);
  const [officeName, setOfficeName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  // Stats state
  const [stats, setStats] = useState({
    activeProjects: 0,
    openTasks: 0,
    myTasks: 0,
    loading: true,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  // Redirect to mode selection if no mode is set
  useEffect(() => {
    if (!authLoading && !mode) {
      navigate("/mode-selection", { replace: true });
    }
  }, [mode, authLoading, navigate]);

  // Load stats when mode/officeId changes
  useEffect(() => {
    if (mode === "PERSONAL") {
      loadPersonalStats();
    } else if (mode === "TEAM" && officeId) {
      loadTeamStats();
    }
  }, [mode, officeId]);

  // Personal Mode Stats
  const loadPersonalStats = async () => {
    setStats((prev) => ({ ...prev, loading: true }));

    try {
      const [projectsData, tasksData] = await Promise.all([
        listPersonalProjects(),
        listPersonalTasks(),
      ]);

      const projects = projectsData?.projects || [];
      const tasks = tasksData?.tasks || [];

      const activeProjects = projects.filter(
        (p) => p.status === "ACTIVE" || p.status === "PLANNING"
      ).length;

      const openTasks = tasks.filter(
        (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
      ).length;

      setStats({
        activeProjects,
        openTasks,
        myTasks: openTasks, // In personal mode, all tasks are "my tasks"
        loading: false,
      });

      // Build recent activity
      const activity = [
        ...projects.map((p) => ({ ...p, type: "Project" })),
        ...tasks.map((t) => ({ ...t, type: "Task", name: t.title })),
      ]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

      setRecentActivity(activity);
    } catch (err) {
      console.error("Failed to load personal stats:", err);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  // Team Mode Stats
  const loadTeamStats = async () => {
    if (!officeId) return;

    setStats((prev) => ({ ...prev, loading: true }));

    try {
      const [projectsData, tasksData] = await Promise.all([
        listProjects(officeId),
        listTasks(officeId),
      ]);

      const projects = projectsData?.projects || [];
      const tasks = tasksData?.tasks || [];

      const activeProjects = projects.filter(
        (p) => p.status === "ACTIVE" || p.status === "PLANNING"
      ).length;

      const openTasks = tasks.filter(
        (t) => t.status === "TODO" || t.status === "IN_PROGRESS"
      ).length;

      const myTasks = tasks.filter(
        (t) =>
          (t.assignedTo === user?.email || t.assignedTo === user?.uid) &&
          (t.status === "TODO" || t.status === "IN_PROGRESS")
      ).length;

      setStats({
        activeProjects,
        openTasks,
        myTasks,
        loading: false,
      });

      // Build recent activity
      const activity = [
        ...projects.map((p) => ({ ...p, type: "Project" })),
        ...tasks.map((t) => ({ ...t, type: "Task", name: t.title })),
      ]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5);

      setRecentActivity(activity);
    } catch (err) {
      console.error("Failed to load team stats:", err);
      setStats((prev) => ({ ...prev, loading: false }));
    }
  };

  const handleCreateOffice = async (e) => {
    e.preventDefault();
    if (!officeName.trim()) return;

    setCreating(true);
    setError("");

    try {
      await createOffice(officeName.trim());
      await refreshClaims();
      window.location.reload();
    } catch (err) {
      setError(err.message || "Failed to create office");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleSwitchMode = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "PERSONAL") {
        // Switch to Team mode
        await initializeTeamMode();
      } else {
        // Switch to Personal mode
        await initializePersonalMode();
      }
      await refreshClaims(user);
      window.location.reload(); // Force full reload to update everything
    } catch (e) {
      setError(e.message);
      // If switching to team and no office found, navigate to mode selection
      if (e.message.includes("No office membership")) {
        navigate("/mode-selection");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="text-base-content/70 mt-1">
            Welcome back, {user?.email || "User"}
          </p>
          {mode && (
            <div className="mt-2">
              <span className={`badge ${mode === "PERSONAL" ? "badge-primary" : "badge-secondary"}`}>
                {mode === "PERSONAL" ? "🧑 Personal Mode" : "👥 Team Mode"}
              </span>
              {mode === "TEAM" && role && (
                <span className="badge badge-outline ml-2">{role}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-ghost" onClick={handleSwitchMode}>
            Switch Mode
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/app/projects")}>
            Projects
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/app/tasks")}>
            Tasks
          </button>
        </div>
      </div>

      {/* Show create office prompt if in TEAM mode but no officeId */}
      {mode === "TEAM" && !officeId && (
        <div className="alert alert-warning">
          <div className="flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <h3 className="font-bold">No office found</h3>
              <div className="text-sm">You need to create an office to use Team mode.</div>
            </div>
          </div>
          <button className="btn btn-sm btn-primary" onClick={() => setShowCreateOffice(true)}>
            Create Office
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h3 className="text-sm text-base-content/70">Active Projects</h3>
            {stats.loading ? (
              <span className="loading loading-spinner loading-md text-primary"></span>
            ) : (
              <p className="text-4xl font-bold text-primary">{stats.activeProjects}</p>
            )}
            <p className="text-xs text-base-content/60">ACTIVE or PLANNING status</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h3 className="text-sm text-base-content/70">Open Tasks</h3>
            {stats.loading ? (
              <span className="loading loading-spinner loading-md text-secondary"></span>
            ) : (
              <p className="text-4xl font-bold text-secondary">{stats.openTasks}</p>
            )}
            <p className="text-xs text-base-content/60">TODO or IN_PROGRESS</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h3 className="text-sm text-base-content/70">
              {mode === "PERSONAL" ? "My Tasks" : "Assigned to Me"}
            </h3>
            {stats.loading ? (
              <span className="loading loading-spinner loading-md text-accent"></span>
            ) : (
              <p className="text-4xl font-bold text-accent">{stats.myTasks}</p>
            )}
            <p className="text-xs text-base-content/60">
              {mode === "PERSONAL" ? "All your tasks" : "Assigned to you"}
            </p>
          </div>
        </div>
      </div>

      {/* My Focus Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="card-title">My Focus</h2>
            <p className="text-base-content/70">
              You have <strong>{stats.myTasks}</strong> open task{stats.myTasks !== 1 ? "s" : ""}{" "}
              {mode === "PERSONAL" ? "to complete" : "assigned to you"}.
            </p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary btn-sm" onClick={() => navigate("/app/tasks")}>
                View my tasks
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow border border-base-300">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <p className="text-base-content/70">Manage your workspace efficiently.</p>
            <div className="card-actions justify-end mt-4 gap-2">
              <button
                className="btn btn-outline btn-sm"
                onClick={() => navigate("/app/projects")}
              >
                New Project
              </button>
              <button className="btn btn-outline btn-sm" onClick={() => navigate("/app/tasks")}>
                New Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">Recent activity</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={mode === "PERSONAL" ? loadPersonalStats : loadTeamStats}
              disabled={stats.loading}
            >
              {stats.loading ? (
                <span className="loading loading-spinner loading-xs"></span>
              ) : (
                "Refresh"
              )}
            </button>
          </div>
          <div className="overflow-x-auto">
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
                {stats.loading ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <span className="loading loading-spinner loading-sm"></span>
                    </td>
                  </tr>
                ) : recentActivity.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-base-content/60">
                      No recent activity
                    </td>
                  </tr>
                ) : (
                  recentActivity.map((item, idx) => (
                    <tr key={`${item.type}-${item._id}`}>
                      <td>{idx + 1}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            item.type === "Project" ? "badge-primary" : "badge-secondary"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td>{item.name || item.title || "—"}</td>
                      <td>
                        <span className="badge badge-outline badge-sm">{item.status}</span>
                      </td>
                      <td className="text-xs text-base-content/60">
                        {formatDate(item.updatedAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Office Modal */}
      {showCreateOffice && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create your office</h3>
            <p className="py-2 text-sm text-base-content/70">
              You'll become the CEO of this office and can invite team members.
            </p>

            {error && (
              <div className="alert alert-error mt-3">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateOffice} className="mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Office name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  placeholder="e.g., Acme Inc."
                  value={officeName}
                  onChange={(e) => setOfficeName(e.target.value)}
                  required
                  minLength={2}
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowCreateOffice(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={creating}>
                  {creating ? "Creating..." : "Create Office"}
                </button>
              </div>
            </form>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setShowCreateOffice(false)}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default Dashboard;
