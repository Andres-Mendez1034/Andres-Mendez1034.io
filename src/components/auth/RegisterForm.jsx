import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Register.css";

export default function RegisterForm({ onSuccess }) {
  const { register } = useContext(AuthContext);

  const [role, setRole] = useState("influencer"); // 👈 NUEVO
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------
  // password score
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

  // ----------------------
  // validate
  // ----------------------
  const validate = () => {
    if (!email || !password || !confirmPassword)
      return "Completa todos los campos.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Correo inválido.";
    if (password.length < 8)
      return "Mínimo 8 caracteres.";
    if (password !== confirmPassword)
      return "No coinciden las contraseñas.";
    if (!acceptTerms)
      return "Debes aceptar términos.";
    return "";
  };

  // ----------------------
  // submit
  // ----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) return setError(msg);

    try {
      setLoading(true);

      await register(email, password);

      // 👉 DECISIÓN DE FLUJO SEGÚN ROL
      onSuccess?.(role);

    } catch (err) {
      setError("Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="auth-card">

        <header className="auth-header">
          <span className="auth-badge">Registro</span>
          <h2 className="auth-title">Elige tu tipo de cuenta</h2>
          <p className="auth-subtitle">
            Influencer o Cliente
          </p>
        </header>

        {/* 🔥 SELECT ROL */}
        <div className="form-field">
          <label>Tipo de cuenta</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input"
          >
            <option value="influencer">Influencer</option>
            <option value="client">Cliente (Negocio)</option>
          </select>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>

          {/* Email */}
          <div className="form-field">
            <label>Correo electrónico</label>
            <input
              type="email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="form-field">
            <label>Contraseña</label>

            <input
              type={showPwd ? "text" : "password"}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="button"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {/* Confirm */}
          <div className="form-field">
            <label>Confirmar contraseña</label>

            <input
              type={showPwd ? "text" : "password"}
              className="input"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Terms */}
          <div className="form-field">
            <label>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              Acepto términos
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? "Creando..." : "Continuar"}
          </button>

        </form>
      </div>
    </div>
  );
}