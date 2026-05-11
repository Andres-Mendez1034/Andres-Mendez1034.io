import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

import {
  login as loginService,
  register as registerService,
  verifyMFA as verifyMFAService,
} from "../services/auth.service";

/* =========================================================
   CONTEXT
========================================================= */
export const AuthContext = createContext(null);

/* =========================================================
   STORAGE KEYS
========================================================= */
const USER_KEY = "bc_user";
const TOKEN_KEY = "bc_token";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/* =========================================================
   PROVIDER
========================================================= */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);

  /* =========================================================
     REHIDRATACIÓN
  ========================================================= */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);

      if (storedUser && storedToken) {
        const parsed = JSON.parse(storedUser);

        setUser({
          ...parsed,
          role: parsed?.role || "client",
          has_profile: parsed?.has_profile ?? false,
          profile_status: parsed?.profile_status ?? "none",
        });

        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Auth rehydrate error:", err);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  /* =========================================================
     SESSION HELPERS
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
     REFRESH USER
  ========================================================= */
  const refreshUser = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) return null;

      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedUser = res.data?.user;

      if (updatedUser) {
        const normalized = {
          ...updatedUser,
          role: updatedUser?.role || "client",
          has_profile: updatedUser?.has_profile ?? false,
          profile_status: updatedUser?.profile_status ?? "none",
        };

        setUser(normalized);
        saveSession(normalized, token);
      }

      return updatedUser;
    } catch (err) {
      console.error("Refresh user error:", err);
      return null;
    }
  };

  /* =========================================================
     UPDATE USER LOCAL
  ========================================================= */
  const updateUser = (updatedData) => {
    setUser((prev) => {
      const merged = {
        ...prev,
        ...updatedData,
        has_profile: updatedData?.has_profile ?? prev?.has_profile ?? false,
        profile_status:
          updatedData?.profile_status ?? prev?.profile_status ?? "none",
      };

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
        role: data?.user?.role || role || "client",
        has_profile: data?.user?.has_profile ?? false,
        profile_status: data?.user?.profile_status ?? "none",
        otpauth_url: data?.otpauth_url || null,
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
      console.error("REGISTER ERROR:", err);
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
        has_profile: data?.user?.has_profile ?? false,
        profile_status: data?.user?.profile_status ?? "none",
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
      console.error("LOGIN ERROR:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     MFA VERIFY
  ========================================================= */
  const verifyMFA = async ({ email, token }) => {
    try {
      const data = await verifyMFAService({
        email,
        token: token?.toString().trim(),
      });

      if (data?.success) {
        const safeUser = {
          ...data.user,
          role: data.user?.role || user?.role || "client",
          has_profile: data.user?.has_profile ?? user?.has_profile ?? false,
          profile_status:
            data.user?.profile_status ?? user?.profile_status ?? "none",
        };

        setUser(safeUser);
        setIsAuthenticated(true);
        setMfaRequired(false);

        saveSession(safeUser, data?.token);
      }

      return data;
    } catch (err) {
      console.error("MFA ERROR:", err);
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

  /* =========================================================
     CONTEXT VALUE
  ========================================================= */
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   HOOK
========================================================= */
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};