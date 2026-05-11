import React, { createContext, useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
  verifyMFA as verifyMFAService,
} from "../services/auth.service";

import axios from "axios";

export const AuthContext = createContext();

const USER_KEY = "bc_user";
const TOKEN_KEY = "bc_token";

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);

  /* =========================================================
     🔁 REHIDRATACIÓN
  ========================================================= */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("❌ Error rehidratando auth:", err);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  /* =========================================================
     💾 SESSION HELPERS
  ========================================================= */
  const saveSession = (userData, token) => {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  };

  const clearSession = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  /* =========================================================
     🔥 REFRESH USER (PAYMENTS / STRIPE SYNC)
  ========================================================= */
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) return;

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = response.data.user;

      setUser(updatedUser);
      saveSession(updatedUser, token);

      return updatedUser;
    } catch (err) {
      console.error("❌ Error refreshing user:", err);
    }
  };

  /* =========================================================
     🔥 UPDATE USER LOCAL (PROFILE / ONBOARDING)
  ========================================================= */
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedData };
      saveSession(merged, localStorage.getItem(TOKEN_KEY));
      return merged;
    });
  };

  /* =========================================================
     REGISTER
  ========================================================= */
  const register = async (email, password, name, role) => {
    try {
      const data = await registerService({
        email,
        password,
        name,
        role,
      });

      const safeUser = {
        ...data?.user,
        role,
        otpauth_url: data?.otpauth_url,
      };

      setUser(safeUser);

      if (data?.mfaRequired) {
        setMfaRequired(true);
        setIsAuthenticated(false);

        return {
          success: true,
          mfaRequired: true,
          user: safeUser,
        };
      }

      setMfaRequired(false);
      setIsAuthenticated(true);
      saveSession(safeUser, data?.token);

      return {
        success: true,
        mfaRequired: false,
        user: safeUser,
      };
    } catch (err) {
      console.error("❌ REGISTER ERROR:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     LOGIN
  ========================================================= */
  const handleLogin = async (email, password) => {
    try {
      const data = await loginService({ email, password });

      const safeUser = {
        ...data?.user,
        role: data?.user?.role || "client",
      };

      setUser(safeUser);

      if (data?.mfaRequired) {
        setMfaRequired(true);
        setIsAuthenticated(false);

        return {
          success: true,
          mfaRequired: true,
          user: safeUser,
        };
      }

      setMfaRequired(false);
      setIsAuthenticated(true);
      saveSession(safeUser, data?.token);

      return {
        success: true,
        mfaRequired: false,
        user: safeUser,
      };
    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     VERIFY MFA
  ========================================================= */
  const verifyMFA = async ({ email, token }) => {
    if (!email) throw new Error("Email requerido");

    try {
      const data = await verifyMFAService({
        email,
        token: token.toString().trim(),
      });

      if (data?.success) {
        const safeUser = {
          ...data.user,
          role: data.user?.role || user?.role,
        };

        setUser(safeUser);
        setIsAuthenticated(true);
        setMfaRequired(false);

        saveSession(safeUser, data?.token);
      }

      return data;
    } catch (err) {
      console.error("❌ MFA ERROR:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     LOGOUT
  ========================================================= */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setMfaRequired(false);
    clearSession();
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

        updateUser,

        // 🔥 NUEVO: SYNC DESPUÉS DE STRIPE
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};