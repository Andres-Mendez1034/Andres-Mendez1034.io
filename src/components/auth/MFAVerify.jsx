import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "https://brandconnect.azurewebsites.net";

export default function MFAVerify() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  const { verifyMFA, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await verifyMFA({
        email: user.email,
        token: token.trim(),
      });

      if (res?.success) {
        const role   = res?.user?.role   || user?.role;
        const userId = res?.user?.id     || res?.user?.user_id;

        if (role === "superadmin") {
          navigate("/admin");
          return;
        }

        // Verificar si ya tiene perfil completado
        try {
          const { data } = await axios.get(`${API}/api/profiles/user/${userId}`);
          const profileType   = role === "influencer" ? "influencer" : "client";
          const alreadyExists = data?.[profileType];
          navigate(alreadyExists ? "/" : `/onboarding/${profileType}`);
        } catch {
          navigate(`/onboarding/${role === "influencer" ? "influencer" : "client"}`);
        }

        return;
      }

      setError("Código incorrecto");
    } catch (err) {
      console.error("❌ MFA VERIFY ERROR:", err);
      setError("Error al verificar MFA");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial" }}>
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
          style={{ marginTop: "15px", padding: "10px 20px", cursor: "pointer" }}
        >
          Verificar
        </button>
      </form>

      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}