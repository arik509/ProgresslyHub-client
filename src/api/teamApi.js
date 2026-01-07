import { getIdToken } from "firebase/auth";
import { auth } from "../firebase/firebase";

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

export async function initializeTeamMode() {
  return authFetch("/api/team/initialize", { method: "POST" });
}
