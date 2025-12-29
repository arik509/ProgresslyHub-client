import { apiFetch } from "./apiFetch";

export const listProjects = (officeId) => apiFetch(`/api/offices/${officeId}/projects`);

export const createProject = (officeId, data) =>
  apiFetch(`/api/offices/${officeId}/projects`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateProject = (officeId, projectId, data) =>
  apiFetch(`/api/offices/${officeId}/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteProject = (officeId, projectId) =>
  apiFetch(`/api/offices/${officeId}/projects/${projectId}`, {
    method: "DELETE",
  });
