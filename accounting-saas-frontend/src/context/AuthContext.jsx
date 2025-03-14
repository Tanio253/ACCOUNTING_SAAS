// utils/auth.js - You can remove this file if you're using the context approach

// context/AuthContext.js
import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if there's a token on mount
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);
  
  const login = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
  };
  
  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);