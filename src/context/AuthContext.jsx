import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("EMPLOYEE");
  const [officeId, setOfficeId] = useState(null);
  const [mode, setMode] = useState(() => localStorage.getItem("app_mode") || null); // Initialize from localStorage
  const [loading, setLoading] = useState(true);

  // Helper to fetch and sync user data
  const fetchUserData = async (currentUser) => {
    if (!currentUser) {
      setRole("EMPLOYEE");
      setOfficeId(null);
      setMode(null);
      localStorage.removeItem("app_mode");
      return;
    }

    try {
      // 1. Get Custom Claims (Fastest)
      const tokenResult = await getIdTokenResult(currentUser, true); // Force refresh
      const Crole = tokenResult?.claims?.role;
      const CofficeId = tokenResult?.claims?.officeId;
      const Cmode = tokenResult?.claims?.mode;

      setRole(typeof Crole === "string" ? Crole : "EMPLOYEE");
      setOfficeId(typeof CofficeId === "string" ? CofficeId : null);

      // 2. Fetch from MongoDB (Source of Truth) because claims might be stale
      try {
        const token = await currentUser.getIdToken();
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://progressly-hub-server.vercel.app'}/api/user/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        
        if (response.ok) {
          const userData = await response.json();
          const dbMode = userData.mode;
          if (dbMode) {
            setMode(dbMode);
            localStorage.setItem("app_mode", dbMode);
          } else {
            // If DB has no mode, fallback to claim or null
            const finalMode = typeof Cmode === "string" ? Cmode : null;
            setMode(finalMode);
            if(finalMode) localStorage.setItem("app_mode", finalMode);
          }
        } else {
           // API failed, fallback to claims
           const finalMode = typeof Cmode === "string" ? Cmode : null;
           setMode(finalMode);
           if(finalMode) localStorage.setItem("app_mode", finalMode);
        }
      } catch (apiError) {
        console.error("API Error:", apiError);
        const finalMode = typeof Cmode === "string" ? Cmode : null;
        setMode(finalMode);
        if(finalMode) localStorage.setItem("app_mode", finalMode);
      }
    } catch (e) {
      console.error("Auth Error:", e);
      // Don't clear state on transient errors, just log
    }
  };

  const refreshClaims = async (currentUser) => {
    // Wrapper for manual refresh
    await fetchUserData(currentUser || user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        await fetchUserData(currentUser);
      } else {
        setRole("EMPLOYEE");
        setOfficeId(null);
        setMode(null);
        localStorage.removeItem("app_mode");
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = () => {
    setMode(null);
    localStorage.removeItem("app_mode");
    return signOut(auth);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, role, officeId, mode, loading, logout, refreshClaims 
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
