import { auth } from "../firebase/firebase";

export async function refreshClaims() {
  if (!auth.currentUser) return null;
  
  // Force refresh to pick up new claims
  await auth.currentUser.getIdToken(true);
  
  // Return the full token result with claims
  const tokenResult = await auth.currentUser.getIdTokenResult();
  return tokenResult.claims;
}
