import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Register.css";

export default function RegisterForm({ onSuccess }) {
  const { register, user, isPendingEmail } = useContext(AuthContext);

  const [role,            setRole]            = useState("influencer");
  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms,     setAcceptTerms]     = useState(false);
  const [showPwd,         setShowPwd]         = useState(false);
  const [loading,         setLoading]         = useState(false);
  const [error,           setError]           = useState("");

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
    if (msg) { setError(msg); return; }

    try {
      setLoading(true);
      await register(email, password, name, role);
      // AuthContext cambia a PENDING_EMAIL → el componente
      // renderiza la pantalla de "revisa tu correo" automáticamente
    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setError(err?.error || err?.message || "Error al crear cuenta");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     PANTALLA: REVISA TU CORREO
  ========================================================= */
  if (isPendingEmail) {
    return (
      <div className="register-page">
        <div className="auth-card">

          <header className="auth-header">
            <span className="auth-badge">Verifica tu cuenta</span>
            <h2 className="auth-title">Revisa tu correo 📧</h2>
          </header>

          <p style={{ color: "#6b7280", lineHeight: 1.6, marginBottom: "12px" }}>
            Te enviamos un enlace de verificación a{" "}
            <strong style={{ color: "#111827" }}>{user?.email}</strong>.
          </p>

          <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
            Haz clic en el enlace para continuar con la configuración
            de tu autenticación de dos factores.
          </p>

          <p style={{ marginTop: "24px", fontSize: "13px", color: "#9ca3af" }}>
            ¿No llegó el correo? Revisa tu carpeta de spam.
          </p>

        </div>
      </div>
    );
  }

  /* =========================================================
     FORMULARIO DE REGISTRO
  ========================================================= */
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

          <div className="form-field">
            <label>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              {" "}Acepto términos
            </label>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Creando..." : "Continuar"}
          </button>

        </form>
      </div>
    </div>
  );
}