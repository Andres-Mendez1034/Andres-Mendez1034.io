import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";
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
const USER_KEY  = "bc_user";
const TOKEN_KEY = "bc_token";

/* =========================================================
   AUTH STATES
========================================================= */
const AUTH_STATES = {
  UNAUTHENTICATED: "UNAUTHENTICATED",
  PENDING_EMAIL:   "PENDING_EMAIL",   // ← esperando verificación de correo
  MFA_SETUP:       "MFA_SETUP",       // ← correo verificado, configurando TOTP
  MFA_CHALLENGE:   "MFA_CHALLENGE",   // ← login existente, pidiendo código
  AUTHENTICATED:   "AUTHENTICATED",
};

/* =========================================================
   LOG HELPER
========================================================= */
const log = (msg, data) => {
  console.log(`🟢 [AUTH] ${msg}`, data ?? "");
};

/* =========================================================
   PROVIDER
========================================================= */
export const AuthProvider = ({ children }) => {
  const [user,      setUser]      = useState(null);
  const [token,     setToken]     = useState(null);
  const [authState, setAuthState] = useState(AUTH_STATES.UNAUTHENTICATED);

  const API_URL = import.meta.env.VITE_API_URL || "https://api.brandconnect.social/api";

  /* =========================================================
     STATE TRACKING
  ========================================================= */
  useEffect(() => {
    log("STATE CHANGE", { user, token, authState });
  }, [user, token, authState]);

  /* =========================================================
     REHIDRATACIÓN
  ========================================================= */
  useEffect(() => {
    log("REHYDRATION START");

    try {
      const storedUser  = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);

      log("LOCALSTORAGE RAW", { storedUser, storedToken });

      if (storedUser && storedToken) {
        const parsed = JSON.parse(storedUser);

        log("REHYDRATED USER", parsed);

        setUser(parsed);
        setToken(storedToken);
        setAuthState(AUTH_STATES.AUTHENTICATED);

        log("AUTH STATE SET → AUTHENTICATED");
      } else {
        log("NO SESSION FOUND");
      }
    } catch (err) {
      console.error("❌ AUTH REHYDRATE ERROR:", err);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  /* =========================================================
     SESSION HELPERS
  ========================================================= */
  const saveSession = (userData, tokenValue) => {
    log("SAVE SESSION", { userData, tokenValue });
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    if (tokenValue) localStorage.setItem(TOKEN_KEY, tokenValue);
  };

  const clearSession = () => {
    log("CLEAR SESSION");
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  /* =========================================================
     UPDATE USER
  ========================================================= */
  const updateUser = (data) => {
    log("UPDATE USER", data);

    setUser((prev) => {
      const updated = { ...prev, ...data };
      log("USER UPDATED", updated);
      saveSession(updated, token);
      return updated;
    });
  };

  /* =========================================================
     REGISTER
     → Crea la cuenta en el backend
     → Backend envía email de verificación
     → Aquí solo cambiamos a PENDING_EMAIL
     → NO hay JWT ni MFA todavía
  ========================================================= */
  const register = async (email, password, name, role) => {
    log("REGISTER START", { email, name, role });

    try {
      const data = await registerService({ email, password, name, role });

      log("REGISTER RESPONSE", data);

      // Guardamos solo lo mínimo para mostrar el email en la pantalla
      // de "revisa tu correo". Sin JWT, sin MFA secret aún.
      setUser({ email, name, role });
      setToken(null);
      setAuthState(AUTH_STATES.PENDING_EMAIL);

      log("REGISTER → PENDING_EMAIL");

      return { success: true, pendingEmail: true };

    } catch (err) {
      console.error("❌ REGISTER ERROR:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     CONFIRM EMAIL
     → Llamado desde <VerifyEmail /> después de que el backend
       valida el token del link y devuelve:
       { verified, email, name, otpauth_url }
     → Cambia estado a MFA_SETUP para que MFASetup muestre el QR
  ========================================================= */
  const confirmEmail = (verifyData) => {
    log("CONFIRM EMAIL", verifyData);

    const safeUser = {
      email:       verifyData.email,
      name:        verifyData.name,
      role:        user?.role || "client",   // conservamos el rol del registro
      otpauth_url: verifyData.otpauth_url,
    };

    setUser(safeUser);
    setToken(null);
    setAuthState(AUTH_STATES.MFA_SETUP);

    log("CONFIRM EMAIL → MFA_SETUP", safeUser);
  };

  /* =========================================================
     LOGIN
  ========================================================= */
  const handleLogin = async (email, password) => {
    log("LOGIN START", { email });

    try {
      const data = await loginService({ email, password });

      log("LOGIN RESPONSE", data);

      const safeUser = {
        ...data?.user,
        role: data?.user?.role || "client",
      };

      setUser(safeUser);

      if (data?.mfaRequired) {
        log("LOGIN → MFA_CHALLENGE");

        setAuthState(AUTH_STATES.MFA_CHALLENGE);
        setToken(null);

        return { success: true, mfaRequired: true, user: safeUser };
      }

      log("LOGIN → AUTHENTICATED");

      setAuthState(AUTH_STATES.AUTHENTICATED);
      setToken(data?.token);
      saveSession(safeUser, data?.token);

      return { success: true, mfaRequired: false, user: safeUser };

    } catch (err) {
      console.error("❌ LOGIN ERROR:", err);
      throw err?.response?.data || err;
    }
  };

  /* =========================================================
     MFA VERIFY
     → Usado tanto en MFA_SETUP (primer registro)
       como en MFA_CHALLENGE (login posterior)
  ========================================================= */
  const verifyMFA = async ({ email, token: mfaToken }) => {
    log("MFA VERIFY START", { email });

    try {
      const data = await verifyMFAService({
        email,
        token: mfaToken?.toString().trim(),
      });

      log("MFA RESPONSE", data);

      if (data?.success) {
        const safeUser = {
          ...data.user,
          role: data.user?.role || user?.role || "client",
        };

        log("MFA SUCCESS → AUTHENTICATED", safeUser);

        setUser(safeUser);
        setToken(data?.token);
        setAuthState(AUTH_STATES.AUTHENTICATED);
        saveSession(safeUser, data?.token);
      } else {
        log("MFA FAILED");
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
    log("LOGOUT");

    setUser(null);
    setToken(null);
    setAuthState(AUTH_STATES.UNAUTHENTICATED);
    clearSession();
  };

  /* =========================================================
     REFRESH USER
  ========================================================= */
  const refreshUser = async () => {
    log("REFRESH USER START");

    try {
      if (!token) {
        log("NO TOKEN → SKIP REFRESH");
        return null;
      }

      const res = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      log("REFRESH RESPONSE", res.data);

      const updated = res.data?.user;

      if (updated) {
        setUser(updated);
        saveSession(updated, token);
        log("USER REFRESHED");
      }

      return updated;

    } catch (err) {
      console.error("❌ REFRESH ERROR:", err);
      return null;
    }
  };

  /* =========================================================
     PROVIDER VALUE
  ========================================================= */
  const value = {
    user,
    token,
    authState,

    // Flags derivados del estado
    isAuthenticated: authState === AUTH_STATES.AUTHENTICATED,
    isPendingEmail:  authState === AUTH_STATES.PENDING_EMAIL,
    isMfaSetup:      authState === AUTH_STATES.MFA_SETUP,
    isMfaChallenge:  authState === AUTH_STATES.MFA_CHALLENGE,

    // Acciones
    register,
    confirmEmail,   // ← NUEVO
    handleLogin,
    verifyMFA,
    logout,
    refreshUser,
    updateUser,
  };

  log("PROVIDER RENDER", value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/* =========================================================
   HOOK
========================================================= */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
