import React, { createContext, useState } from "react";
import {
  login as loginService,
  register as registerService,
  verifyMFA as verifyMFAService,
} from "../services/auth.service";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mfaRequired, setMfaRequired] = useState(false);

  /* =========================================================
     REGISTER (🔥 GUARDA EL QR)
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

      // 🔥 CLAVE: guardar también el otpauth_url
      const userWithQR = {
        ...safeUser,
        otpauth_url: data?.otpauth_url,
      };

      setUser(userWithQR);
      setIsAuthenticated(false);

      if (data?.mfaRequired) {
        setMfaRequired(true);

        return {
          success: true,
          mfaRequired: true,
          user: userWithQR,
        };
      }

      setMfaRequired(false);
      setIsAuthenticated(true);

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
        token: token.toString().trim(), // ✅ SIEMPRE STRING LIMPIO
      });

      console.log("🧠 MFA RESPONSE:", data);

      if (data?.success) {
        setIsAuthenticated(true);
        setMfaRequired(false);
        setUser(data.user || user);
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