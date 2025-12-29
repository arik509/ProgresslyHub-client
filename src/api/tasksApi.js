import { apiFetch } from "./apiFetch";

export const listTasks = (officeId) => apiFetch(`/api/offices/${officeId}/tasks`);

export const createTask = (officeId, data) =>
  apiFetch(`/api/offices/${officeId}/tasks`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateTask = (officeId, taskId, data) =>
  apiFetch(`/api/offices/${officeId}/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteTask = (officeId, taskId) =>
  apiFetch(`/api/offices/${officeId}/tasks/${taskId}`, {
    method: "DELETE",
  });
