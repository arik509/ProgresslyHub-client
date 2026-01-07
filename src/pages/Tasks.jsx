import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { listTasks, createTask, updateTask, deleteTask } from "../api/tasksApi";
import {
  listPersonalTasks,
  createPersonalTask,
  updatePersonalTask,
  deletePersonalTask,
} from "../api/personalTasksApi";

const Tasks = () => {
  const { role, officeId, user, mode } = useAuth();

  // In PERSONAL mode, user can always manage tasks
  // In TEAM mode, only CEO/ADMIN/MANAGER can create/delete tasks
  const canManageTasks = useMemo(() => {
    if (mode === "PERSONAL") return true;
    return ["CEO", "ADMIN", "MANAGER"].includes(role);
  }, [role, mode]);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  // Create modal
  const [openCreate, setOpenCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assignedTo: "",
  });
  const [saving, setSaving] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit modal
  const [editingTask, setEditingTask] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    status: "",
    priority: "",
    assignedTo: "",
  });
  const [editError, setEditError] = useState("");

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const loadTasks = async () => {
    setPageError("");
    setLoading(true);
    try {
      let data;
      if (mode === "PERSONAL") {
        data = await listPersonalTasks();
      } else if (mode === "TEAM" && officeId) {
        data = await listTasks(officeId);
      } else {
        setTasks([]);
        setLoading(false);
        return;
      }
      setTasks(data?.tasks || []);
    } catch (e) {
      setPageError(e.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode) {
      loadTasks();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, officeId]);

  const onCreateTask = async (e) => {
    e.preventDefault();
    setCreateError("");

    if (!createForm.title) return setCreateError("Task title is required.");

    if (mode === "TEAM" && !officeId) {
      return setCreateError("No officeId found.");
    }

    setSaving(true);
    try {
      if (mode === "PERSONAL") {
        // In personal mode, ignore assignedTo field
        const { assignedTo, ...personalTaskData } = createForm;
        await createPersonalTask(personalTaskData);
      } else {
        await createTask(officeId, createForm);
      }
      setOpenCreate(false);
      setCreateForm({
        title: "",
        description: "",
        status: "TODO",
        priority: "MEDIUM",
        assignedTo: "",
      });
      await loadTasks();
    } catch (e2) {
      setCreateError(e2.message || "Failed to create task.");
    } finally {
      setSaving(false);
    }
  };

  const onEditTask = async (e) => {
    e.preventDefault();
    setEditError("");

    if (!editingTask) return;
    if (!editForm.title && canManageTasks) return setEditError("Task title is required.");

    setSaving(true);
    try {
      if (mode === "PERSONAL") {
        const { assignedTo, ...personalTaskData } = editForm;
        await updatePersonalTask(editingTask._id, personalTaskData);
      } else {
        await updateTask(officeId, editingTask._id, editForm);
      }
      setEditingTask(null);
      await loadTasks();
    } catch (e2) {
      setEditError(e2.message || "Failed to update task.");
    } finally {
      setSaving(false);
    }
  };

  const onDeleteTask = async () => {
    if (!deleteConfirm) return;

    setSaving(true);
    try {
      if (mode === "PERSONAL") {
        await deletePersonalTask(deleteConfirm._id);
      } else {
        await deleteTask(officeId, deleteConfirm._id);
      }
      setDeleteConfirm(null);
      await loadTasks();
    } catch (e) {
      setPageError(e.message || "Failed to delete task.");
    } finally {
      setSaving(false);
    }
  };

  // Quick status update
  const onQuickStatusUpdate = async (task, newStatus) => {
    setSaving(true);
    try {
      if (mode === "PERSONAL") {
        await updatePersonalTask(task._id, { status: newStatus });
      } else {
        await updateTask(officeId, task._id, { status: newStatus });
      }
      await loadTasks();
    } catch (e) {
      setPageError(e.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  const statusBadgeColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "badge-info";
      case "DONE":
        return "badge-success";
      case "BLOCKED":
        return "badge-error";
      default:
        return "badge-ghost";
    }
  };

  const priorityBadgeColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "badge-error";
      case "MEDIUM":
        return "badge-warning";
      case "LOW":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  // Check if task is assigned to current user (only in TEAM mode)
  const isMyTask = (task) => {
    if (mode === "PERSONAL") return true; // All personal tasks are "my tasks"
    return task.assignedTo === user?.email || task.assignedTo === user?.uid;
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Tasks</h1>
          <p className="text-base-content/70">
            {mode === "PERSONAL" ? (
              <>
                <span className="badge badge-primary badge-sm mr-2">🧑 Personal</span>
                Your personal tasks
              </>
            ) : (
              <>
                Your role: <span className="font-semibold">{role || "—"}</span> | Office:{" "}
                <span className="font-semibold">{officeId || "—"}</span>
              </>
            )}
          </p>
        </div>

        {canManageTasks && (
          <button className="btn btn-primary" onClick={() => setOpenCreate(true)}>
            + Create task
          </button>
        )}
      </div>

      {mode === "TEAM" && !officeId && (
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
            <h2 className="card-title">
              {mode === "PERSONAL" ? "My Tasks" : "All tasks"}
            </h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={loadTasks}
              disabled={loading || (mode === "TEAM" && !officeId)}
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : tasks.length === 0 ? (
            <p className="text-base-content/70">No tasks yet. Create one to get started.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((t) => (
                <div key={t._id} className="card bg-base-200 shadow-sm border border-base-300">
                  <div className="card-body p-4">
                    <h3 className="card-title text-lg">{t.title}</h3>
                    <p className="text-sm text-base-content/70 line-clamp-2">
                      {t.description || "No description"}
                    </p>

                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`badge badge-sm ${statusBadgeColor(t.status)}`}>
                        {t.status}
                      </span>
                      <span className={`badge badge-sm ${priorityBadgeColor(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>

                    {mode === "TEAM" && t.assignedTo && (
                      <p className="text-xs text-base-content/60 mt-2">
                        Assigned: {t.assignedTo}
                        {isMyTask(t) && (
                          <span className="ml-1 badge badge-xs badge-primary">You</span>
                        )}
                      </p>
                    )}

                    {/* Action buttons */}
                    <div className="card-actions justify-end mt-3 gap-1">
                      {/* Quick status update (for own tasks or all tasks in personal mode) */}
                      {((mode === "PERSONAL") || (!canManageTasks && isMyTask(t))) && t.status !== "DONE" && (
                        <div className="dropdown dropdown-end">
                          <button className="btn btn-xs btn-primary" disabled={saving}>
                            Update Status
                          </button>
                          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 z-[1]">
                            {t.status !== "IN_PROGRESS" && (
                              <li>
                                <button onClick={() => onQuickStatusUpdate(t, "IN_PROGRESS")}>
                                  In Progress
                                </button>
                              </li>
                            )}
                            {t.status !== "DONE" && (
                              <li>
                                <button onClick={() => onQuickStatusUpdate(t, "DONE")}>
                                  Mark Done
                                </button>
                              </li>
                            )}
                            {t.status !== "BLOCKED" && (
                              <li>
                                <button onClick={() => onQuickStatusUpdate(t, "BLOCKED")}>
                                  Blocked
                                </button>
                              </li>
                            )}
                          </ul>
                        </div>
                      )}

                      {/* Edit/Delete (managers in TEAM mode or all in PERSONAL mode) */}
                      {canManageTasks && (
                        <>
                          <button
                            className="btn btn-xs btn-ghost"
                            onClick={() => {
                              setEditingTask(t);
                              setEditForm({
                                title: t.title,
                                description: t.description || "",
                                status: t.status,
                                priority: t.priority,
                                assignedTo: t.assignedTo || "",
                              });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-xs btn-error btn-ghost"
                            onClick={() => setDeleteConfirm(t)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!canManageTasks && mode === "TEAM" && (
            <div className="alert alert-info mt-4">
              <span>Only CEO/ADMIN/MANAGER can create/edit/delete tasks.</span>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {openCreate && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Create task</h3>

            {createError && (
              <div className="alert alert-error mt-3">
                <span>{createError}</span>
              </div>
            )}

            <form className="mt-4 space-y-3" onSubmit={onCreateTask}>
              <input
                className="input input-bordered w-full"
                placeholder="Task title"
                value={createForm.title}
                onChange={(e) => setCreateForm((p) => ({ ...p, title: e.target.value }))}
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
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>

              <select
                className="select select-bordered w-full"
                value={createForm.priority}
                onChange={(e) => setCreateForm((p) => ({ ...p, priority: e.target.value }))}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

              {/* Only show assignedTo in TEAM mode */}
              {mode === "TEAM" && (
                <input
                  className="input input-bordered w-full"
                  placeholder="Assigned to (email or UID)"
                  value={createForm.assignedTo}
                  onChange={(e) => setCreateForm((p) => ({ ...p, assignedTo: e.target.value }))}
                />
              )}

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
      {editingTask && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Edit task</h3>

            {editError && (
              <div className="alert alert-error mt-3">
                <span>{editError}</span>
              </div>
            )}

            <form className="mt-4 space-y-3" onSubmit={onEditTask}>
              <input
                className="input input-bordered w-full"
                placeholder="Task title"
                value={editForm.title}
                onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
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
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="DONE">DONE</option>
                <option value="BLOCKED">BLOCKED</option>
              </select>

              <select
                className="select select-bordered w-full"
                value={editForm.priority}
                onChange={(e) => setEditForm((p) => ({ ...p, priority: e.target.value }))}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>

              {/* Only show assignedTo in TEAM mode */}
              {mode === "TEAM" && (
                <input
                  className="input input-bordered w-full"
                  placeholder="Assigned to (email or UID)"
                  value={editForm.assignedTo}
                  onChange={(e) => setEditForm((p) => ({ ...p, assignedTo: e.target.value }))}
                />
              )}

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>

          <form method="dialog" className="modal-backdrop" onClick={() => setEditingTask(null)}>
            <button>close</button>
          </form>
        </dialog>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Delete task?</h3>
            <p className="py-4">
              Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action
              cannot be undone.
            </p>

            <div className="modal-action">
              <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>
                Cancel
              </button>
              <button className="btn btn-error" onClick={onDeleteTask} disabled={saving}>
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

export default Tasks;
