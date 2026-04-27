// src/components/auth/LoginForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MFAVerify from "./MFAVerify";
import "./Login.css";

export default function LoginForm() {
  const { handleLogin, mfaRequired, user } = useContext(AuthContext) || {};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("CLICK LOGIN"); // 👈 debug

    setError("");

    try {
      setLoading(true);

      if (!handleLogin) {
        throw new Error("AuthContext no está conectado");
      }

      await handleLogin({ email, password });

    } catch (err) {
      console.log("LOGIN ERROR:", err); // 👈 debug real
      setError(err?.message || "Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Si MFA es requerido, mostramos verificación
  if (mfaRequired && user) {
    return <MFAVerify user={user} />;
  }

  return (
    <div className="auth">
      <div className="auth-card" role="region" aria-labelledby="login-title">
        <header className="auth-header">
          <span className="auth-badge">Inicia sesión</span>
          <h2 id="login-title" className="auth-title">Bienvenido de nuevo</h2>
          <p className="auth-subtitle">Introduce tus credenciales</p>
        </header>

        {error && (
          <div className="form-error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          
          {/* Email */}
          <div className="form-field">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="input"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {/* Botón */}
          <div className="auth-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}