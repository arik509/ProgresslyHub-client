import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listProjects, createProject, updateProject, deleteProject } from "../api/projectsApi";

const Projects = () => {
  const { role, officeId } = useAuth();

  const canManageProjects = useMemo(
    () => ["CEO", "ADMIN", "MANAGER"].includes(role),
    [role]
  );

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  // Create modal
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    status: "PLANNING",
  });
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit modal
  const [editingProject, setEditingProject] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", description: "", status: "" });
  const [editError, setEditError] = useState("");

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadProjects = async () => {
    if (!officeId) return;
    setPageError("");
    setLoading(true);
    try {
      const data = await listProjects(officeId);
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
  }, [officeId]);

  const onCreateProject = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!officeId) return setCreateError("No officeId found.");
    if (!createForm.name) return setCreateError("Project name is required.");

    setSaving(true);
    try {
      await createProject(officeId, createForm);
      setOpenCreate(false);
      setCreateForm({ name: "", description: "", status: "PLANNING" });
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
      await updateProject(officeId, editingProject._id, editForm);
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
      await deleteProject(officeId, deleteConfirm._id);
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
          <h1 className="text-3xl font-extrabold">Projects</h1>
          <p className="text-base-content/70">
            Your role: <span className="font-semibold">{role || "—"}</span> | Office:{" "}
            <span className="font-semibold">{officeId || "—"}</span>
          </p>
        </div>

        {canManageProjects && (
          <button className="btn btn-primary" onClick={() => setOpenCreate(true)}>
            + Create project
          </button>
        )}
      </div>

      {!officeId && (
        <div className="alert alert-warning">
          <span>No officeId found in your account claims. Create an office first.</span>
        </div>
      )}

      {pageError && (
        <div className="alert alert-error">
          <span>{pageError}</span>
        </div>
      )}

      <div className="card bg-base-100 shadow border border-base-300">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title">All projects</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={loadProjects}
              disabled={!officeId || loading}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : projects.length === 0 ? (
            <p className="text-base-content/70">No projects yet. Create one to get started.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <div key={p._id} className="card bg-base-200 shadow-sm border border-base-300">
                  <div className="card-body p-4">
                    <h3 className="card-title text-lg">{p.name}</h3>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {p.description || "No description"}
                    </p>

                    <div className="flex items-center gap-2 mt-2">
                      <span className={`badge badge-sm ${statusBadgeColor(p.status)}`}>
                        {p.status}
                      </span>
                    </div>

                    {canManageProjects && (
                      <div className="card-actions justify-end mt-3">
                        <button
                          className="btn btn-xs btn-ghost"
                          onClick={() => {
                            setEditingProject(p);
                            setEditForm({
                              name: p.name,
                              description: p.description || "",
                              status: p.status,
                            });
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-xs btn-error btn-ghost"
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

          {!canManageProjects && (
            <div className="alert alert-info mt-4">
              <span>Only CEO/ADMIN/MANAGER can create/edit/delete projects.</span>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create project</h3>

            {createError && (
              <div className="alert alert-error mt-3">
                <span>{createError}</span>
              </div>
            )}

            <form className="mt-4 space-y-3" onSubmit={onCreateProject}>
              <input
                className="input input-bordered w-full"
                placeholder="Project name"
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
              />

              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Description (optional)"
                rows={3}
                value={createForm.description}
                onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
              />

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

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setOpenCreate(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Creating..." : "Create"}
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
            <h3 className="font-bold text-lg">Edit project</h3>

            {editError && (
              <div className="alert alert-error mt-3">
                <span>{editError}</span>
              </div>
            )}

            <form className="mt-4 space-y-3" onSubmit={onEditProject}>
              <input
                className="input input-bordered w-full"
                placeholder="Project name"
                value={editForm.name}
                onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
              />

              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Description"
                rows={3}
                value={editForm.description}
                onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}
              />

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

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setEditingProject(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
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
            <h3 className="font-bold text-lg">Delete project?</h3>
            <p className="py-4">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action
              cannot be undone.
            </p>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={onDeleteProject} disabled={saving}>
                {saving ? "Deleting..." : "Delete"}
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
