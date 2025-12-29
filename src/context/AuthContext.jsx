import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [role, setRole] = useState("EMPLOYEE");     // from custom claims
  const [officeId, setOfficeId] = useState(null);   // from custom claims (string)

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (!currentUser) {
        setRole("EMPLOYEE");
        setOfficeId(null);
        setLoading(false);
        return;
      }

      try {
        // Custom claims are available via ID token result [web:373]
        const tokenResult = await getIdTokenResult(currentUser);

        const claimRole = tokenResult?.claims?.role;
        const claimOfficeId = tokenResult?.claims?.officeId;

        setRole(typeof claimRole === "string" ? claimRole : "EMPLOYEE");
        setOfficeId(typeof claimOfficeId === "string" ? claimOfficeId : null);
      } catch (e) {
        setRole("EMPLOYEE");
        setOfficeId(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, officeId, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
