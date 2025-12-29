import { auth } from "../firebase/firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function apiFetch(path, options = {}) {
  const user = auth.currentUser;

  // Standard: get token for backend; Firebase tokens refresh automatically when needed [web:409]
  const token = user ? await user.getIdToken() : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "API error");
  return data;
}
