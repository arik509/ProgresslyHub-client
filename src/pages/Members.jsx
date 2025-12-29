import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

import { addMember, listMembers } from "../api/officesApi";
import { refreshClaims } from "../api/refreshClaims";

const Members = () => {
  const { role, officeId } = useAuth();

  const canManageMembers = useMemo(
    () => ["CEO", "ADMIN", "MANAGER"].includes(role),
    [role]
  );

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [form, setForm] = useState({ email: "", role: "EMPLOYEE" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadMembers = async () => {
    if (!officeId) return;
    setPageError("");
    setLoading(true);
    try {
      const data = await listMembers(officeId);
      setMembers(data?.members || []);
    } catch (e) {
      setPageError(e.message || "Failed to load members.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [officeId]);

  const onAddMember = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!officeId) {
      setFormError("No office selected/found for your account.");
      return;
    }
    if (!form.email) {
      setFormError("Email is required.");
      return;
    }

    setSaving(true);
    try {
      await addMember(officeId, form.email.trim(), form.role);

      // Optional but recommended so the newly-added user (or you) can see new claims quickly
      await refreshClaims(); // uses currentUser.getIdToken(true) [web:373]

      setOpenAdd(false);
      setForm({ email: "", role: "EMPLOYEE" });
      await loadMembers();
    } catch (e2) {
      setFormError(e2.message || "Failed to add member.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold">Members</h1>
          <p className="text-base-content/70">
            Your role: <span className="font-semibold">{role || "—"}</span> | Office:{" "}
            <span className="font-semibold">{officeId || "—"}</span>
          </p>
        </div>

        {canManageMembers && (
          <button className="btn btn-primary" onClick={() => setOpenAdd(true)}>
            + Add member
          </button>
        )}
      </div>

      {!officeId && (
        <div className="alert alert-warning">
          <span>
            No officeId found in your account claims. Create an office first (POST /api/offices),
            then refresh token (logout/login or force refresh).
          </span>
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
            <h2 className="card-title">Office members</h2>
            <button className="btn btn-ghost btn-sm" onClick={loadMembers} disabled={!officeId || loading}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : members.length === 0 ? (
            <p className="text-base-content/70">No members found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>UID</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={`${m.officeId}-${m.userUid}`}>
                      <td>{m.userEmail || "—"}</td>
                      <td>
                        <span className="badge badge-outline">{m.role}</span>
                      </td>
                      <td className="font-mono text-xs">{m.userUid}</td>
                      <td className="text-xs">
                        {m.createdAt ? new Date(m.createdAt).toLocaleString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!canManageMembers && (
            <div className="alert alert-info mt-4">
              <span>Only CEO/ADMIN/MANAGER can add members.</span>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {openAdd && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add member</h3>
            <p className="text-base-content/70 mt-1">
              Adds/updates membership in MongoDB and sets Firebase custom claims on that user. [web:373]
            </p>

            {formError && (
              <div className="alert alert-error mt-3">
                <span>{formError}</span>
              </div>
            )}

            <form className="mt-4 space-y-3" onSubmit={onAddMember}>
              <input
                className="input input-bordered w-full"
                placeholder="User email (must exist in Firebase Auth)"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              />

              <select
                className="select select-bordered w-full"
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              >
                <option value="EMPLOYEE">EMPLOYEE</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>

              <div className="modal-action">
                <button type="button" className="btn btn-ghost" onClick={() => setOpenAdd(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Add"}
                </button>
              </div>
            </form>
          </div>

          <form method="dialog" className="modal-backdrop" onClick={() => setOpenAdd(false)}>
            <button>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default Members;
