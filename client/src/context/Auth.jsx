import React, { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ user: null, token: null, expiresAt: null });
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        const parsedAuth = JSON.parse(stored);
        if (parsedAuth.expiresAt && new Date().getTime() > parsedAuth.expiresAt) {
          localStorage.removeItem("auth");
          setAuth({ user: null, token: null, expiresAt: null });
        } else {
          setAuth(parsedAuth);
        }
      } catch (err) {
        console.error("Failed to parse auth from localStorage", err);
        localStorage.removeItem("auth");
      }
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!auth.user) {
      return;
    }
    const interval = setInterval(() => {
      if (auth.user && auth.expiresAt && new Date().getTime() > auth.expiresAt) {
        setAuth({ user: null, token: null, expiresAt: null });
        localStorage.removeItem("auth");
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [auth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth, initialized }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
