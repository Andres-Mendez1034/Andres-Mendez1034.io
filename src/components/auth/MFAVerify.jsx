// src/components/auth/MFAVerify.jsx
import React, { useState } from "react";
import { verifyMFA } from "../../services/auth.service";

export default function MFAVerify({ onSuccess }) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await verifyMFA(token); // Llama al backend
      if (res.success) {
        setError("");
        alert("¡MFA verificado! Login exitoso.");
        if (onSuccess) onSuccess(); // Callback opcional después del login
      } else {
        setError("Código MFA incorrecto. Intenta de nuevo.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al verificar MFA. Intenta de nuevo.");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Verificación MFA</h2>
      <p>Ingresa el código de tu app de autenticación:</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="123456"
          style={{ padding: "8px", fontSize: "16px", width: "120px", textAlign: "center" }}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px", padding: "8px 16px" }}>
          Verificar
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}