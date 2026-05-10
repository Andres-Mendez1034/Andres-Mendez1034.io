import React, { createContext, useState, useEffect } from "react";
import {
  login as loginService,
  register as registerService,
  verifyMFA as verifyMFAService,
} from "../services/auth.service";

export const AuthContext = createContext();

const USER_KEY = "bc_user";
const TOKEN_KEY = "bc_token";

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
        const parsedUser = JSON.parse(storedUser);

        setUser(parsedUser);
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
     🔥 UPDATE USER GLOBAL (ONBOARDING + EDIT PROFILE)
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
        role, // 🔥 FIX IMPORTANTE: garantizar rol consistente
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
        role: data?.user?.role || "client", // 🔥 fallback seguro
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

        // 🔥 CLAVE DEL SISTEMA (ONBOARDING + PROFILE SYNC)
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};