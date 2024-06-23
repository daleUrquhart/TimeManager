import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [access, setAccess] = useState(null);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null);

  const login = (user) => { 
    setAccess(user.access)
    setIsAdmin(user.access===0)
    setIsAuthenticated(true);
    setUser(user);
  };

  const logout = () => {
    setAccess(null)
    setIsAdmin(null)
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, access, user, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
