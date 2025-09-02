import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedLocal = localStorage.getItem('user');
      const savedSession = sessionStorage.getItem('user');
      const source = savedLocal || savedSession;
      if (source) setUser(JSON.parse(source));
    } catch {
      // ignore malformed storage
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData, remember = true) => {
    setUser(userData);
    const serialized = JSON.stringify(userData);
    if (remember) {
      localStorage.setItem('user', serialized);
      sessionStorage.removeItem('user');
    } else {
      sessionStorage.setItem('user', serialized);
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    setUser(null);
    try { localStorage.removeItem('user'); } catch {}
    try { sessionStorage.removeItem('user'); } catch {}
  };

  return (
  <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
