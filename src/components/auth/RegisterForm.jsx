import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Register.css";

export default function RegisterForm({ onSuccess }) {
  const { register } = useContext(AuthContext);

  const [role, setRole] = useState("influencer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!name || !email || !password || !confirmPassword)
      return "Completa todos los campos.";

    if (!/^\S+@\S+\.\S+$/.test(email))
      return "Correo inválido.";

    if (password.length < 8)
      return "Mínimo 8 caracteres.";

    if (password !== confirmPassword)
      return "No coinciden las contraseñas.";

    if (!acceptTerms)
      return "Debes aceptar términos.";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setLoading(true);

      const res = await register(email, password, name, role);

      // 🔥 DEBUG REAL (importante para no perder flujo otra vez)
      console.log("📦 REGISTER RESPONSE:", res);

      const user = res?.user || res;

      // 🔐 MFA DETECTION REAL (solo backend manda esto bien)
      const mfaRequired =
        res?.mfaRequired === true;

      console.log("🔐 MFA REQUIRED:", mfaRequired);

      // =========================
      // CASO 1: MFA SETUP
      // =========================
      if (mfaRequired || user?.otpauth_url) {
        onSuccess?.(res);
        return;
      }

      // =========================
      // CASO 2: CLIENT
      // =========================
      if (user?.role === "client") {
        onSuccess?.(user);
        return;
      }

      // =========================
      // CASO 3: INFLUENCER
      // =========================
      onSuccess?.(user);

    } catch (err) {
      console.error("REGISTER ERROR:", err);
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
          <h2 className="auth-title">Crea tu cuenta</h2>
        </header>

        {/* ROLE */}
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

          {/* NAME */}
          <div className="form-field">
            <label>Nombre</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* EMAIL */}
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

          {/* PASSWORD */}
          <div className="form-field">
            <label>Contraseña</label>
            <input
              type={showPwd ? "text" : "password"}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)}>
              {showPwd ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {/* CONFIRM */}
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

          {/* TERMS */}
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

          {/* ERROR */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* SUBMIT */}
          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Continuar"}
          </button>

        </form>
      </div>
    </div>
  );
}