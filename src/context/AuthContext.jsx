// src/context/AuthContext.jsx
import React, { createContext, useState } from "react";
import {
  login as loginService,
  register as registerService,
  verifyMFA as verifyMFAService,
} from "../services/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);          // Datos del usuario parcial o completo
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Usuario fully logged in
  const [mfaRequired, setMfaRequired] = useState(false);         // Paso MFA pendiente

  // =========================
  // Registrar usuario
  // =========================
  const register = async (email, password) => {
    try {
      const res = await registerService({ email, password });

      if (res.mfaRequired) {
        // Usuario parcialmente registrado → MFA pendiente
        setUser(res.user);
        setMfaRequired(true);
        setIsAuthenticated(false);
      } else {
        // Registro completo (sin MFA)
        setUser(res.user);
        setMfaRequired(false);
        setIsAuthenticated(true);
      }

      return res;
    } catch (err) {
      console.error("Error register:", err.response?.data || err.message);
      throw err;
    }
  };

  // =========================
  // Login usuario
  // =========================
  const handleLogin = async (email, password) => {
    try {
      const res = await loginService({ email, password });

      if (res.mfaRequired) {
        setUser(res.user);
        setMfaRequired(true);
        setIsAuthenticated(false);
      } else {
        setUser(res.user);
        setMfaRequired(false);
        setIsAuthenticated(true);
      }

      return res;
    } catch (err) {
      console.error("Error login:", err.response?.data || err.message);
      throw err;
    }
  };

  // =========================
  // Verificar MFA
  // =========================
  const verifyMFA = async (token) => {
    if (!user?.username) throw new Error("Usuario no definido");

    try {
      const res = await verifyMFAService({ email: user.username, token });

      if (res.success) {
        setIsAuthenticated(true);
        setMfaRequired(false);
      }

      return res;
    } catch (err) {
      console.error("Error verifying MFA:", err.response?.data || err.message);
      throw err;
    }
  };

  // =========================
  // Logout
  // =========================
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setMfaRequired(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        mfaRequired,
        register,
        handleLogin,
        verifyMFA,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};