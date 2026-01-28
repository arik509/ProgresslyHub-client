import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listProjects, createProject, updateProject, deleteProject } from "../api/projectsApi";
import { listPersonalProjects, createPersonalProject, updatePersonalProject, deletePersonalProject } from "../api/personalProjectsApi";
import { listMembers } from "../api/officesApi";

const Projects = () => {
  const { role, officeId, user, mode } = useAuth(); // Added user to destructuring

  const canManageProjects = useMemo(
    () => mode === "PERSONAL" || ["CEO", "ADMIN", "MANAGER"].includes(role),
    [role, mode]
  );

  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  // Create modal
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    lead: "",
  });
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit modal
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", status: "", lead: "" });
  const [editError, setEditError] = useState("");

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch members when in Team mode
  useEffect(() => {
    if (mode === "TEAM" && officeId) {
      listMembers(officeId)
        .then((data) => setMembers(data.members || []))
        .catch((err) => console.error("Failed to load members:", err));
    }
  }, [mode, officeId]);

  const loadProjects = async () => {
    setPageError("");
    setLoading(true);
    try {
      let data;
      if (mode === "PERSONAL") {
        data = await listPersonalProjects();
      } else if (mode === "TEAM" && officeId) {
        data = await listProjects(officeId);
      } else {
        setProjects([]);
        setLoading(false);
        return;
      }
      setProjects(data?.projects || []);
    } catch (e) {
      setPageError(e.message || "Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeId, mode]);

  const onCreateProject = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!createForm.name) return setCreateError("Project name is required.");

    setSaving(true);
    try {
      if (mode === "PERSONAL") {
        const { lead, ...personalData } = createForm;
        await createPersonalProject(personalData);
      } else if (mode === "TEAM" && officeId) {
        await createProject(officeId, createForm);
      } else {
        setCreateError("No mode or office selected.");
        setSaving(false);
        return;
      }
      setOpenCreate(false);
      setCreateForm({ name: "", description: "", status: "PLANNING", lead: "" });
      await loadProjects();
    } catch (e2) {
      setCreateError(e2.message || "Failed to create project.");
    } finally {
      setSaving(false);
    }
  };

  const onEditProject = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editingProject) return;
    if (!editForm.name) return setEditError("Project name is required.");

    setSaving(true);
    try {
      if (mode === "PERSONAL") {
        const { lead, ...personalData } = editForm;
        await updatePersonalProject(editingProject._id, personalData);
      } else if (mode === "TEAM" && officeId) {
        await updateProject(officeId, editingProject._id, editForm);
      }
      setEditingProject(null);
      await loadProjects();
    } catch (e2) {
      setEditError(e2.message || "Failed to update project.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteProject = async () => {
    if (!deleteConfirm) return;

    setSaving(true);
    try {
      if (mode === "PERSONAL") {
        await deletePersonalProject(deleteConfirm._id);
      } else if (mode === "TEAM" && officeId) {
        await deleteProject(officeId, deleteConfirm._id);
      }
      setDeleteConfirm(null);
      await loadProjects();
    } catch (e) {
      setPageError(e.message || "Failed to delete project.");
    } finally {
      setSaving(false);
    }
  };

  const statusBadgeColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "badge-success";
      case "COMPLETED":
        return "badge-info";
      case "ON_HOLD":
        return "badge-warning";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Projects
          </h1>
          <p className="text-base-content/70 mt-1">
            {mode === "PERSONAL" ? (
              "Manage your personal projects"
            ) : (
              <>
                Your role: <span className="font-semibold">{role || "—"}</span>
              </>
            )}
          </p>
        </div>

        {canManageProjects && (
          <button 
            className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0" 
            onClick={() => setOpenCreate(true)}
          >
            + Create project
          </button>
        )}
      </div>

      {/* ... Alert Sections ... */}

      {/* Projects Grid */}
      <div className="card bg-base-100 shadow-lg border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">
              {mode === "PERSONAL" ? "My Projects" : "All Projects"}
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={loadProjects}
              disabled={loading || (!mode)}
            >
              {loading ? <span className="loading loading-spinner loading-sm"></span> : "Refresh"}
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : projects.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-6xl mb-4">📁</div>
              <p className="text-base-content/70 text-lg">No projects yet.</p>
              <p className="text-base-content/50 text-sm">Create your first project to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
              {projects.map((p) => (
                <div key={p._id} className="card bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-900/10 dark:to-purple-900/10 shadow-md border border-pink-200 dark:border-pink-800 hover:shadow-xl transition-shadow">
                  <div className="card-body p-5">
                    <h3 className="card-title text-lg font-bold text-gray-800 dark:text-gray-100">
                      {p.name}
                    </h3>
                    <p className="text-sm text-base-content/70 line-clamp-2 min-h-[2.5rem]">
                      {p.description || "No description"}
                    </p>

                    <div className="flex items-center gap-2 mt-3 flex-wrap">
                      <span className={`badge badge-sm ${statusBadgeColor(p.status)}`}>
                        {p.status}
                      </span>
                      {mode === "TEAM" && p.lead && (
                        <span className="badge badge-sm badge-outline">Lead: {p.lead}</span>
                      )}
                    </div>

                    {canManageProjects && (
                      <div className="card-actions justify-end mt-4 gap-2">
                        <button
                          className="btn btn-xs btn-outline btn-primary"
                          onClick={() => {
                            setEditingProject(p);
                            setEditForm({
                              name: p.name,
                              description: p.description || "",
                              status: p.status,
                              lead: p.lead || "",
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-outline btn-error"
                          onClick={() => setDeleteConfirm(p)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {mode === "TEAM" && !canManageProjects && (
            <div className="alert alert-info mt-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <span>Only CEO/ADMIN/MANAGER can create/edit/delete projects.</span>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <dialog className="modal modal-open">
          <div className="modal-box">
             {/* ... header ... */}
            <h3 className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Create New Project
            </h3>
            
             {/* ... error ... */}
             {createError && (
              <div className="alert alert-error mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{createError}</span>
              </div>
            )}

            <form className="mt-4 space-y-4" onSubmit={onCreateProject}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Project Name</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Enter project name"
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

              {/* ... description/status ... */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Enter project description (optional)"
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

             <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={createForm.status}
                  onChange={(e) => setCreateForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="PLANNING">PLANNING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

               {/* Lead Assignment */}
              {mode === "TEAM" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Project Lead</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={createForm.lead}
                    onChange={(e) => setCreateForm((p) => ({ ...p, lead: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.userUid} value={m.userEmail || m.userUid}>
                         {m.userEmail || "Unknown User"} ({m.role}) {m.userEmail === user?.email ? "(You)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setOpenCreate(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0" 
                  type="submit" 
                  disabled={saving}
                >
                  {saving ? <span className="loading loading-spinner loading-sm"></span> : "Create"}
                </button>
              </div>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop" onClick={() => setOpenCreate(false)}>
            <button>close</button>
          </form>
        </dialog>
      )}

      {/* Edit Modal */}
      {editingProject && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Edit Project
            </h3>

             {/* ... error ... */}
               {editError && (
              <div className="alert alert-error mt-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{editError}</span>
              </div>
            )}


            <form className="mt-4 space-y-4" onSubmit={onEditProject}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Project Name</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  placeholder="Project name"
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>

               {/* ... description/status ... */}
               <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full"
                  placeholder="Description"
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Status</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={editForm.status}
                  onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}
                >
                  <option value="PLANNING">PLANNING</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="ON_HOLD">ON_HOLD</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              {/* Lead Assignment */}
              {mode === "TEAM" && (
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-semibold">Project Lead</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={editForm.lead}
                    onChange={(e) => setEditForm((p) => ({ ...p, lead: e.target.value }))}
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.userUid} value={m.userEmail || m.userUid}>
                         {m.userEmail || "Unknown User"} ({m.role}) {m.userEmail === user?.email ? "(You)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setEditingProject(null)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  className="btn bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white border-0" 
                  type="submit" 
                  disabled={saving}
                >
                  {saving ? <span className="loading loading-spinner loading-sm"></span> : "Save"}
                </button>
              </div>
            </form>
          </div>
          <form
            method="dialog"
            className="modal-backdrop"
            onClick={() => setEditingProject(null)}
          >
            <button>close</button>
          </form>
        </dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-error">Delete Project?</h3>
            <p className="py-4">
              Are you sure you want to delete <strong className="text-error">{deleteConfirm.name}</strong>? This action
              cannot be undone.
            </p>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)} disabled={saving}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={onDeleteProject} disabled={saving}>
                {saving ? <span className="loading loading-spinner loading-sm"></span> : "Delete"}
              </button>
            </div>
          </div>

          <form method="dialog" className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default Projects;
