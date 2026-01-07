import { getIdToken } from "firebase/auth";
import { auth } from "../firebase";

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

export async function initializePersonalMode() {
  return authFetch("/api/personal/initialize", { method: "POST" });
}

export async function listPersonalProjects() {
  return authFetch("/api/personal/projects");
}

export async function createPersonalProject(body) {
  return authFetch("/api/personal/projects", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updatePersonalProject(projectId, body) {
  return authFetch(`/api/personal/projects/${projectId}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deletePersonalProject(projectId) {
  return authFetch(`/api/personal/projects/${projectId}`, {
    method: "DELETE",
  });
}
