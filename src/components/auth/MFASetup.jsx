import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MFASetup.css";

export default function MFASetup() {
  const { verifyMFA, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [qr, setQr] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  /* =========================================================
     GENERAR QR DESDE REGISTER
  ========================================================= */
  useEffect(() => {
    if (!user) return;

    console.log("👤 USER EN MFA:", user);

    if (!user?.otpauth_url) {
      setError("No hay QR disponible (otpauth_url faltante)");
      setLoading(false);
      return;
    }

    const qrUrl =
      "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
      encodeURIComponent(user.otpauth_url);

    setQr(qrUrl);
    setLoading(false);
  }, [user]);

  /* =========================================================
     VERIFY MFA + REDIRECT
  ========================================================= */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    const cleanToken = token.replace(/\D/g, "").trim();

    if (cleanToken.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    try {
      console.log("🚀 ENVIANDO:", {
        email: user?.email,
        token: cleanToken,
        role: user?.role,
      });

      const res = await verifyMFA({
        email: user?.email,
        token: cleanToken,
      });

      console.log("🔐 VERIFY RESPONSE:", res);

      if (res?.success) {
        // 🔥 REDIRECCIÓN SEGÚN ROL
        if (user?.role === "influencer") {
          navigate("/onboarding/influencer");
        } else {
          navigate("/onboarding/client");
        }
        return;
      }

      setError("Código incorrecto");

    } catch (err) {
      console.error("❌ VERIFY ERROR:", err);
      setError("Error verificando MFA");
    }
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="mfa-container">
      <h2>🔐 Configura tu MFA</h2>

      {error && <p className="error">{error}</p>}

      {loading && <p>Cargando QR...</p>}

      {!loading && qr && (
        <>
          <p>Escanea este código con Google Authenticator</p>
          <img src={qr} alt="QR MFA" />
        </>
      )}

      {!loading && (
        <form onSubmit={handleVerify}>
          <input
            className="mfa-input"
            value={token}
            onChange={(e) =>
              setToken(e.target.value.replace(/\D/g, "")) // solo números
            }
            placeholder="123456"
            maxLength={6}
          />

          <button className="mfa-button" type="submit">
            Verificar
          </button>
        </form>
      )}
    </div>
  );
}