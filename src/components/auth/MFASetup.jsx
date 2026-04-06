// src/components/auth/MFASetup.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMFAQR, verifyMFA as verifyMFAService } from "../../services/auth.service";
import "./Login.css";

export default function MFASetup({ email }) {
  const { verifyMFA } = useContext(AuthContext);

  const [qr, setQr] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  // Generar QR al montar el componente
  useEffect(() => {
    const fetchQR = async () => {
      try {
        const data = await getMFAQR(email); // ✅ función correcta
        setQr(data.qr);
      } catch (err) {
        setError("Error al generar QR de MFA");
      }
    };
    fetchQR();
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await verifyMFA(token); // token se verifica en AuthContext
      if (data.success) setVerified(true);
      else setError("Código MFA incorrecto");
    } catch (err) {
      setError("Error verificando MFA");
    }
  };

  if (verified) return <p>MFA configurado correctamente 🎉</p>;

  return (
    <div className="mfa-container">
      <h2>Configura tu MFA</h2>
      {error && <p className="error">{error}</p>}
      {qr && <img src={qr} alt="QR MFA" />}
      <form onSubmit={handleVerify}>
        <input
          type="text"
          placeholder="Código de la app MFA"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />
        <button type="submit">Verificar</button>
      </form>
    </div>
  );
}