import { apiFetch } from "./apiFetch";

export const createOffice = (name) =>
  apiFetch("/api/offices", {
    method: "POST",
    body: JSON.stringify({ name }),
  });

export const myOffices = () => apiFetch("/api/offices/my");

export const addMember = (officeId, email, role) =>
  apiFetch(`/api/offices/${officeId}/members`, {
    method: "POST",
    body: JSON.stringify({ email, role }),
  });

export const listMembers = (officeId) =>
  apiFetch(`/api/offices/${officeId}/members`);
