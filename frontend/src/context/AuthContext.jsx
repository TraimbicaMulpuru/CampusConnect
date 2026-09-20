import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("campusUser");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (userData) => {
    localStorage.setItem("campusUser", JSON.stringify(userData));
    localStorage.setItem("token", userData.token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("campusUser");
    localStorage.removeItem("token");
    setUser(null);
  };

  useEffect(() => {
    const saved = localStorage.getItem("campusUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
