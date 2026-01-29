import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { listPersonalProjects, createPersonalProject } from "../api/personalProjectsApi";
import { listPersonalTasks, createPersonalTask, updatePersonalTask } from "../api/personalTasksApi";
import { listProjects, createProject } from "../api/projectsApi";
import { listTasks, createTask, updateTask } from "../api/tasksApi";
import { createOffice, joinOffice, myOffices } from "../api/officesApi"; // Import myOffices
import { refreshClaims } from "../api/refreshClaims";

const Dashboard = () => {
  const { user, officeId, role, mode, loading: authLoading, refreshClaims } = useAuth();
  const navigate = useNavigate();

  // Retry mode fetch if missing
  useEffect(() => {
    if (user && !mode && !authLoading) {
      console.log("Mode missing in Dashboard, retrying fetch...");
      refreshClaims(user);
    }
  }, [user, mode, authLoading, refreshClaims]);

  // Quick create states
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [quickProjectName, setQuickProjectName] = useState("");
  const [creating, setCreating] = useState(false);

  // Office creation/joining
  const [showCreateOffice, setShowCreateOffice] = useState(false);
  const [showJoinOffice, setShowJoinOffice] = useState(false);
  const [officeName, setOfficeName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [currentOffice, setCurrentOffice] = useState(null); // Store current office details
  const [error, setError] = useState("");

  // Stats and data
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalTasks: 0,
    todoTasks: 0,
    inProgressTasks: 0,
    completedTasks: 0,
    loading: true,
  });

  const [recentTasks, setRecentTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  // Load dashboard data
  const loadDashboardData = async () => {
    if (!mode) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    setStats(prev => ({ ...prev, loading: true }));
    setError("");

    try {
      let projectsData, tasksData, officesData;

      if (mode === "PERSONAL") {
        [projectsData, tasksData] = await Promise.all([
          listPersonalProjects(),
          listPersonalTasks(),
        ]);
      } else if (mode === "TEAM" && officeId) {
        [projectsData, tasksData, officesData] = await Promise.all([
          listProjects(officeId),
          listTasks(officeId),
          myOffices(),
        ]);
        
        // Find current office details (including invite code)
        if (officesData?.offices) {
          const office = officesData.offices.find(o => o._id === officeId);
          setCurrentOffice(office || null);
        }
      } else {
        setStats(prev => ({ ...prev, loading: false }));
        return;
      }

      const projects = projectsData?.projects || [];
      const tasks = tasksData?.tasks || [];

      setStats({
        totalProjects: projects.length,
        activeProjects: projects.filter(p => p.status === "ACTIVE" || p.status === "PLANNING").length,
        totalTasks: tasks.length,
        todoTasks: tasks.filter(t => t.status === "TODO").length,
        inProgressTasks: tasks.filter(t => t.status === "IN_PROGRESS").length,
        completedTasks: tasks.filter(t => t.status === "DONE" || t.status === "COMPLETED").length,
        loading: false,
      });

      // Get recent tasks (incomplete ones)
      setRecentTasks(
        tasks
          .filter(t => t.status !== "DONE" && t.status !== "COMPLETED")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      );

      // Get recent projects
      setRecentProjects(
        projects
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 3)
      );
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadDashboardData();
    }
  }, [mode, officeId, authLoading]);

  // Quick create task
  const handleQuickCreateTask = async (e) => {
    e.preventDefault();
    if (!quickTaskTitle.trim()) return;

    setCreating(true);
    setError("");

    try {
      const taskData = {
        title: quickTaskTitle.trim(),
        description: "",
        status: "TODO",
        priority: "MEDIUM",
      };

      if (mode === "PERSONAL") {
        await createPersonalTask(taskData);
      } else if (mode === "TEAM" && officeId) {
        await createTask(officeId, taskData);
      }

      setQuickTaskTitle("");
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setCreating(false);
    }
  };

  // Quick create project
  const handleQuickCreateProject = async (e) => {
    e.preventDefault();
    if (!quickProjectName.trim()) return;

    setCreating(true);
    setError("");

    try {
      const projectData = {
        name: quickProjectName.trim(),
        description: "",
        status: "ACTIVE",
      };

      if (mode === "PERSONAL") {
        await createPersonalProject(projectData);
      } else if (mode === "TEAM" && officeId) {
        await createProject(officeId, projectData);
      }

      setQuickProjectName("");
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  // Mark task as complete
  const handleMarkTaskComplete = async (task) => {
    setCreating(true);
    try {
      if (mode === "PERSONAL") {
        await updatePersonalTask(task._id, { status: "DONE" });
      } else if (mode === "TEAM" && officeId) {
        await updateTask(officeId, task._id, { status: "DONE" });
      }
      await loadDashboardData();
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setCreating(false);
    }
  };

  // Create office
  const handleCreateOffice = async (e) => {
    e.preventDefault();
    if (!officeName.trim()) return;

    setCreating(true);
    setError("");

    try {
      await createOffice(officeName.trim());
      await refreshClaims(user); // Pass user to refreshClaims
      window.location.reload();
    } catch (err) {
      setError(err.message || "Failed to create office");
    } finally {
      setCreating(false);
    }
  };

  // Join office
  const handleJoinOffice = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setCreating(true);
    setError("");

    try {
      await joinOffice(inviteCode.trim());
      await refreshClaims(user); // Pass user to refreshClaims
      window.location.reload();
    } catch (err) {
      setError(err.message || "Failed to join office");
    } finally {
      setCreating(false);
    }
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "badge-error";
      case "MEDIUM": return "badge-warning";
      case "LOW": return "badge-info";
      default: return "badge-ghost";
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-base-content/70 mt-2 text-lg">
            Welcome back, <span className="font-semibold">{user?.email?.split('@')[0] || "User"}</span>! 👋
          </p>
          {mode && (
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <span className={`badge badge-lg ${mode === "PERSONAL" ? "badge-primary" : "badge-secondary"}`}>
                  {mode === "PERSONAL" ? "🧑 Personal Mode" : "👥 Team Mode"}
                </span>
                {mode === "TEAM" && role && (
                  <span className="badge badge-lg badge-outline">{role}</span>
                )}
              </div>
              
              {/* Show Office Invite Code for Team Members */}
              {mode === "TEAM" && currentOffice && currentOffice.inviteCode && (
                <div className="flex items-center gap-2 text-sm bg-base-200 p-2 rounded-lg w-fit">
                  <span className="font-semibold text-base-content/70">📢 Invite Code:</span>
                  <code className="font-mono bg-base-300 px-2 py-0.5 rounded text-primary font-bold tracking-wider">
                    {currentOffice.inviteCode}
                  </code>
                  <span className="text-xs text-base-content/50">(Share this to invite members)</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Missing Mode Recovery UI */}
      {!mode && !authLoading && (
        <div className="card bg-base-100 shadow-xl border border-warning">
          <div className="card-body items-center text-center">
            <h2 className="card-title text-warning text-2xl">Setup Required</h2>
            <p>We couldn't detect your dashboard mode automatically. Please select one to continue:</p>
            
            <div className="flex gap-4 mt-4 flex-wrap justify-center">
              <button 
                className="btn btn-primary btn-lg"
                onClick={async () => {
                   try {
                     const token = await user.getIdToken();
                     const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://progressly-hub-server.vercel.app'}/api/personal/initialize`, {
                       method: 'POST',
                       headers: { 'Authorization': `Bearer ${token}` }
                     });
                     if (!res.ok) throw new Error("Failed to initialize personal mode");
                     
                     localStorage.setItem("app_mode", "PERSONAL");
                     window.location.reload();
                   } catch (e) {
                     console.error(e);
                     alert("Failed to set mode: " + e.message);
                   }
                }}
              >
                Use Personal Mode
              </button>
              <button 
                className="btn btn-secondary btn-lg"
                 onClick={async () => {
                   try {
                     const token = await user.getIdToken();
                     const res = await fetch(`${import.meta.env.VITE_API_URL || 'https://progressly-hub-server.vercel.app'}/api/team/initialize`, {
                       method: 'POST',
                       headers: { 'Authorization': `Bearer ${token}` }
                     });
                     
                     if (!res.ok) {
                        const txt = await res.text();
                        console.error("Team init failed:", res.status, txt);
                        throw new Error(`Server returned ${res.status}: ${txt}`);
                     }
                     
                     localStorage.setItem("app_mode", "TEAM");
                     window.location.reload();
                   } catch (e) {
                     console.error(e);
                     alert("Failed: " + e.message);
                   }
                }}
              >
                Use Team Mode
              </button>
            </div>
            <p className="text-sm text-base-content/60 mt-4">
              Don't worry, this won't delete any existing data.
            </p>
          </div>
        </div>
      )}

      {/* Team mode - No office */}
      {mode === "TEAM" && !officeId && (
        <div className="alert alert-info flex flex-col sm:flex-row items-center cursor-default">
          <div className="flex gap-2 w-full flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div className="flex-1">
              <h3 className="font-bold">No office found</h3>
              <div className="text-sm">Create an office or join one to start collaborating.</div>
            </div>
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0 w-full sm:w-auto justify-end">
            <button className="btn btn-sm btn-outline" onClick={() => setShowJoinOffice(true)}>
              Join Office
            </button>
            <button className="btn btn-sm btn-primary" onClick={() => setShowCreateOffice(true)}>
              Create Office
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>}
          color="bg-primary"
          loading={stats.loading}
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>}
          color="bg-secondary"
          loading={stats.loading}
        />
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>}
          color="bg-accent"
          loading={stats.loading}
        />
        <StatsCard
          title="Pending Tasks"
          value={stats.todoTasks + stats.inProgressTasks}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          color="bg-info"
          loading={stats.loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg flex justify-between">
              Recent Projects
              <button 
                className="btn btn-xs btn-ghost"
                onClick={() => navigate('/app/projects')}
              >
                View All
              </button>
            </h2>
            {recentProjects.length > 0 ? (
              <div className="space-y-3 mt-2">
                {recentProjects.map(p => (
                  <div key={p._id} className="flex items-center justify-between p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors cursor-pointer" onClick={() => navigate('/app/projects')}>
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-xs text-base-content/60 line-clamp-1">{p.description}</div>
                    </div>
                    <span className={`badge badge-sm ${p.status === 'ACTIVE' ? 'badge-success' : 'badge-ghost'}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/60 text-sm italic py-4 text-center">No recent projects</p>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card bg-base-100 shadow-lg border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg flex justify-between">
              Recent Tasks
              <button 
                className="btn btn-xs btn-ghost"
                onClick={() => navigate('/app/tasks')}
              >
                View All
              </button>
            </h2>
            
            {/* Quick Add Task */}
            <form onSubmit={handleQuickCreateTask} className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Add a quick task..." 
                className="input input-bordered input-sm w-full" 
                value={quickTaskTitle}
                onChange={(e) => setQuickTaskTitle(e.target.value)}
                disabled={creating}
              />
              <button type="submit" className="btn btn-sm btn-primary" disabled={creating || !quickTaskTitle.trim()}>
                {creating ? <span className="loading loading-spinner loading-xs"></span> : "+"}
              </button>
            </form>

            {recentTasks.length > 0 ? (
              <div className="space-y-2">
                {recentTasks.map(t => (
                  <div key={t._id} className="flex items-center gap-3 p-2 hover:bg-base-200 rounded-lg group">
                    <input 
                      type="checkbox" 
                      className="checkbox checkbox-sm checkbox-primary"
                      checked={t.status === 'DONE'}
                      onChange={() => handleMarkTaskComplete(t)}
                      disabled={creating}
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${t.status === 'DONE' ? 'line-through text-base-content/50' : ''}`}>
                        {t.title}
                      </div>
                      <div className="text-xs text-base-content/50 flex gap-2">
                        <span className={`badge badge-xs ${priorityColor(t.priority)}`}>{t.priority}</span>
                        {t.assignedTo && <span>Assess: {t.assignedTo.split('@')[0]}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-base-content/60 text-sm italic py-4 text-center">No active tasks</p>
            )}
          </div>
        </div>
      </div>

      {/* Create Office Modal */}
      {showCreateOffice && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Create Your Office
            </h3>
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
                  <span className="label-text font-semibold">Office Name</span>
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
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
                  disabled={creating}
                >
                  {creating ? <span className="loading loading-spinner loading-sm"></span> : "Create Office"}
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

      {/* Join Office Modal */}
      {showJoinOffice && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Join an Office
            </h3>
            <p className="py-2 text-sm text-base-content/70">
              Enter the invite code shared by your office administrator.
            </p>

            {error && (
              <div className="alert alert-error mt-3">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleJoinOffice} className="mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Invite Code</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full uppercase"
                  placeholder="e.g., X8K2P9"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  required
                  minLength={6}
                  maxLength={6}
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowJoinOffice(false)}
                  disabled={creating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0"
                  disabled={creating}
                >
                  {creating ? <span className="loading loading-spinner loading-sm"></span> : "Join Office"}
                </button>
              </div>
            </form>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setShowJoinOffice(false)}
          >
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default Dashboard;

const StatsCard = ({ title, value, icon, color, loading }) => (
  <div className="card bg-base-100 shadow-xl border-l-4 border-base-300 transform transition-all hover:scale-105">
    <div className={`card-body p-4 border-l-4 ${color.replace('bg-', 'border-')}`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-base-content/60 text-sm font-medium uppercase tracking-wide">{title}</p>
          {loading ? (
            <div className="h-8 w-16 bg-base-300 animate-pulse rounded mt-1"></div>
          ) : (
            <h3 className="text-3xl font-extrabold mt-1">{value}</h3>
          )}
        </div>
        <div className={`p-3 rounded-xl ${color} text-white shadow-lg`}>
          {icon}
        </div>
      </div>
    </div>
  </div>
);
