import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MFAVerify() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const { verifyMFA, user } = useContext(AuthContext); // 👈 IMPORTANTE: user
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 🧪 DEBUG (puedes quitar luego)
      console.log("🚀 ENVIANDO:", {
        email: user?.email,
        token,
        type: typeof token,
      });

      const res = await verifyMFA({
        email: user.email,           // ✅ email correcto
        token: token.trim(),         // ✅ string limpio
      });

      console.log("🔐 MFA RESPONSE:", res);

      if (res?.success) {
        alert("MFA verificado correctamente");
        navigate("/profile");
        return;
      }

      setError("Código incorrecto");

    } catch (err) {
      console.error("❌ MFA VERIFY ERROR:", err);
      setError("Error al verificar MFA");
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginTop: "50px",
        fontFamily: "Arial",
      }}
    >
      <h2>🔐 Verificación MFA</h2>

      <p>Ingresa el código de 6 dígitos de tu app (Google Authenticator)</p>

      <form onSubmit={handleSubmit}>
        <input
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="123456"
          maxLength={6}
          style={{
            padding: "10px",
            fontSize: "16px",
            width: "160px",
            textAlign: "center",
            letterSpacing: "4px",
            marginTop: "10px",
          }}
        />

        <br />

        <button
          type="submit"
          style={{
            marginTop: "15px",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Verificar
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>
  );
}