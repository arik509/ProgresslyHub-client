import { getIdToken } from "firebase/auth";
import { auth } from "../firebase/firebase"; // ✅ Fixed import path

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function authFetch(url, opts = {}) {
  const token = await getIdToken(auth.currentUser);
  const res = await fetch(`${BASE}${url}`, {
    ...opts,
    headers: {
      ...opts.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function listPersonalTasks() {
  return authFetch("/api/personal/tasks");
}

export async function createPersonalTask(body) {
  return authFetch("/api/personal/tasks", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updatePersonalTask(taskId, body) {
  return authFetch(`/api/personal/tasks/${taskId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deletePersonalTask(taskId) {
  return authFetch(`/api/personal/tasks/${taskId}`, {
    method: "DELETE",
  });
}
