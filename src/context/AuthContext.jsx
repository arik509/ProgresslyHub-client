import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Store token and decode user info (or fetch from /me endpoint)
  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setToken(token);
    setUser(userData); // { id, email, role, officeId, ... }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // On mount, check if token exists and fetch user
  useEffect(() => {
    if (token) {
      // Call backend /auth/me to get current user
      // For now, just set loading false
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
