// src/components/auth/RegisterForm.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import MFASetup from "./MFASetup.jsx"; // Componente MFA
import "./Register.css";

export default function RegisterForm() {
  const { register, mfaRequired, user } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------
  // Validación de contraseña
  // ----------------------
  const getPasswordScore = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return Math.min(score, 4);
  };
  const score = getPasswordScore(password);
  const strengthLabel = ["Muy débil", "Débil", "Media", "Fuerte", "Muy fuerte"][score] || "Muy débil";

  // ----------------------
  // Validaciones del formulario
  // ----------------------
  const validate = () => {
    if (!email || !password || !confirmPassword) return "Completa todos los campos.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Ingresa un correo válido.";
    if (password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (password !== confirmPassword) return "Las contraseñas no coinciden.";
    if (!acceptTerms) return "Debes aceptar los términos y condiciones.";
    return "";
  };

  // ----------------------
  // Enviar registro
  // ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validate();
    if (msg) return setError(msg);

    try {
      setLoading(true);
      await register(email, password); // ✅ solo registro
      // Si mfaRequired es true, MFASetup se mostrará automáticamente
    } catch (err) {
      setError(err.response?.data?.message || "No pudimos crear tu cuenta. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // Mostrar MFA si es necesario
  // ----------------------
  if (mfaRequired && user) {
    return <MFASetup email={user.username} />;
  }

  // ----------------------
  // Formulario de registro
  // ----------------------
  return (
    <div className="register-page">
      <div className="auth-card" role="region" aria-labelledby="register-title">
        <header className="auth-header">
          <span className="auth-badge">Registro</span>
          <h2 id="register-title" className="auth-title">Crea tu cuenta</h2>
          <p className="auth-subtitle">Introduce tus datos para registrarte</p>
        </header>

        {!!error && (
          <div className="form-error" role="alert" aria-live="assertive">{error}</div>
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
              aria-invalid={!!error && !/^\S+@\S+\.\S+$/.test(email)}
            />
          </div>

          {/* Contraseña */}
          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPwd ? "text" : "password"}
                className="input"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPwd((v) => !v)}
                aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPwd ? "Ocultar" : "Mostrar"}
              </button>
            </div>
            <div className={`pwd-strength level-${score}`} aria-live="polite">
              <span className="label">{strengthLabel}</span>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              type={showPwd ? "text" : "password"}
              className={`input${password && confirmPassword && password !== confirmPassword ? " error" : ""}`}
              placeholder="Repite tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            {password && confirmPassword && password !== confirmPassword && (
              <small className="hint error-hint" role="alert">Las contraseñas no coinciden.</small>
            )}
          </div>

          {/* Términos */}
          <div className="form-field terms-field">
            <label className="terms-label">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                aria-checked={acceptTerms}
                required
              />
              <span>Acepto los <a href="/terms">Términos y Condiciones</a> y la <a href="/privacy">Política de Privacidad</a>.</span>
            </label>
          </div>

          {/* Botones */}
          <div className="auth-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              aria-busy={loading ? "true" : "false"}
            >
              {loading ? "Creando..." : "Registrarse"}
            </button>
            <a className="btn btn-ghost" href="/login">Ya tengo cuenta</a>
          </div>
        </form>
      </div>
    </div>
  );
}