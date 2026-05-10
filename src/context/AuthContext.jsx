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
     🔁 REHIDRATACIÓN (cuando carga la app)
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
     💾 HELPERS
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

      console.log("🧠 REGISTER RESPONSE:", data);

      const safeUser = data?.user || null;

      const userWithQR = {
        ...safeUser,
        otpauth_url: data?.otpauth_url,
      };

      setUser(userWithQR);

      if (data?.mfaRequired) {
        setMfaRequired(true);
        setIsAuthenticated(false);

        return {
          success: true,
          mfaRequired: true,
          user: userWithQR,
        };
      }

      setMfaRequired(false);
      setIsAuthenticated(true);

      saveSession(userWithQR, data?.token);

      return {
        success: true,
        mfaRequired: false,
        user: userWithQR,
      };

    } catch (err) {
      console.error("❌ REGISTER ERROR FULL:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     LOGIN
  ========================================================= */
  const handleLogin = async (email, password) => {
    try {
      const data = await loginService({ email, password });

      console.log("🧠 LOGIN RESPONSE:", data);

      const safeUser = data?.user || null;

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
      console.error("❌ LOGIN ERROR FULL:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     VERIFY MFA
  ========================================================= */
  const verifyMFA = async ({ email, token }) => {
    if (!email) throw new Error("Email requerido");

    try {
      console.log("📤 VERIFY MFA (CONTEXT):", {
        email,
        token,
        type: typeof token,
      });

      const data = await verifyMFAService({
        email,
        token: token.toString().trim(),
      });

      console.log("🧠 MFA RESPONSE:", data);

      if (data?.success) {
        const safeUser = data.user || user;

        setUser(safeUser);
        setIsAuthenticated(true);
        setMfaRequired(false);

        saveSession(safeUser, data?.token);
      }

      return data;

    } catch (err) {
      console.error("❌ MFA ERROR FULL:", err);
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};