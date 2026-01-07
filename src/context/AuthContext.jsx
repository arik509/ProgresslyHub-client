import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("EMPLOYEE");     // from custom claims
  const [officeId, setOfficeId] = useState(null);   // from custom claims (string)
  const [mode, setMode] = useState(null);           // "personal" or "team"
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

      setRole(typeof claimRole === "string" ? claimRole : "EMPLOYEE");
      setOfficeId(typeof claimOfficeId === "string" ? claimOfficeId : null);

      // Fetch mode from Firestore (not from custom claims)
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setMode(userData.mode || "personal");
      } else {
        setMode("personal"); // Default fallback
      }
    } catch (e) {
      console.error("Error refreshing claims:", e);
      setRole("EMPLOYEE");
      setOfficeId(null);
      setMode("personal");
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
        // Get custom claims from token
        const tokenResult = await getIdTokenResult(currentUser);

        const claimRole = tokenResult?.claims?.role;
        const claimOfficeId = tokenResult?.claims?.officeId;

        setRole(typeof claimRole === "string" ? claimRole : "EMPLOYEE");
        setOfficeId(typeof claimOfficeId === "string" ? claimOfficeId : null);

        // Fetch mode from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setMode(userData.mode || "personal");
        } else {
          // If no document exists, default to personal
          setMode("personal");
        }
      } catch (e) {
        console.error("Error getting user data:", e);
        setRole("EMPLOYEE");
        setOfficeId(null);
        setMode("personal");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    setMode(null);
    return signOut(auth);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        role, 
        officeId, 
        mode,           // "personal" or "team"
        loading, 
        logout, 
        refreshClaims   // Refresh function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
