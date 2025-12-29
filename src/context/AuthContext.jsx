import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, getIdTokenResult } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Firebase user
  const [role, setRole] = useState("EMPLOYEE"); // default until claims exist
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (!currentUser) {
        setRole("EMPLOYEE");
        setLoading(false);
        return;
      }

      try {
        // Reads custom claims from ID token result (role, officeId etc.)
        const tokenResult = await getIdTokenResult(currentUser);
        const claimRole = tokenResult?.claims?.role;

        setRole(typeof claimRole === "string" ? claimRole : "EMPLOYEE");
      } catch (e) {
        setRole("EMPLOYEE");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
