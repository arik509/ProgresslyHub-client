import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [role, setRole] = useState("EMPLOYEE");     // from custom claims
  const [officeId, setOfficeId] = useState(null);   // from custom claims (string)
  const [mode, setMode] = useState(null);           // NEW: "PERSONAL" or "TEAM"

  const [loading, setLoading] = useState(true);

  // Helper function to refresh and extract claims
  const refreshClaims = async (currentUser) => {
    if (!currentUser) {
      setRole("EMPLOYEE");
      setOfficeId(null);
      setMode(null);
      return;
    }

    try {
      // Force refresh token to get latest custom claims
      await currentUser.getIdToken(true);
      const tokenResult = await getIdTokenResult(currentUser);

      const claimRole = tokenResult?.claims?.role;
      const claimOfficeId = tokenResult?.claims?.officeId;
      const claimMode = tokenResult?.claims?.mode;

      setRole(typeof claimRole === "string" ? claimRole : "EMPLOYEE");
      setOfficeId(typeof claimOfficeId === "string" ? claimOfficeId : null);
      setMode(typeof claimMode === "string" ? claimMode : null);
    } catch (e) {
      console.error("Error refreshing claims:", e);
      setRole("EMPLOYEE");
      setOfficeId(null);
      setMode(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (!currentUser) {
        setRole("EMPLOYEE");
        setOfficeId(null);
        setMode(null);
        setLoading(false);
        return;
      }

      try {
        // Custom claims are available via ID token result
        const tokenResult = await getIdTokenResult(currentUser);

        const claimRole = tokenResult?.claims?.role;
        const claimOfficeId = tokenResult?.claims?.officeId;
        const claimMode = tokenResult?.claims?.mode;

        setRole(typeof claimRole === "string" ? claimRole : "EMPLOYEE");
        setOfficeId(typeof claimOfficeId === "string" ? claimOfficeId : null);
        setMode(typeof claimMode === "string" ? claimMode : null);
      } catch (e) {
        console.error("Error getting claims:", e);
        setRole("EMPLOYEE");
        setOfficeId(null);
        setMode(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role, 
        officeId, 
        mode,           // NEW: Export mode
        loading, 
        logout, 
        refreshClaims   // NEW: Export refresh function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
