// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { CREDENTIALS, USERS } from '../data/mockData';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const login = (identifier, password) => {
    const key = identifier.trim().toLowerCase();
    const cred = CREDENTIALS[key];
    if (!cred) return { success: false, error: 'Identifiant introuvable.' };
    if (cred.password !== password) return { success: false, error: 'Mot de passe incorrect.' };
    const user = USERS.find((u) => u.id === cred.userId);
    if (!user) return { success: false, error: 'Compte non configuré.' };
    if (user.status === 'Disabled') return { success: false, error: 'Ce compte est désactivé. Contactez votre administrateur.' };
    setCurrentUser({ ...user, role: cred.role });
    return { success: true, role: cred.role };
  };

  const logout = () => setCurrentUser(null);
  const updateUser = (updates) => setCurrentUser((u) => ({ ...u, ...updates }));

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
