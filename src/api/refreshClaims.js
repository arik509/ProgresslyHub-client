import { auth } from "../firebase/firebase";

export async function refreshClaims() {
  if (!auth.currentUser) return null;
  return auth.currentUser.getIdToken(true); // force refresh to pick up new claims [web:409]
}
