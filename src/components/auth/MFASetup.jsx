import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./MFASetup.css";

export default function MFASetup() {
  const { verifyMFA, user, isMfaSetup, isMfaChallenge } = useContext(AuthContext);
  const navigate = useNavigate();

  const [qr,      setQr]      = useState("");
  const [token,   setToken]   = useState("");
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(true);

  /* -------------------------------------------------------
     GENERAR QR si viene de verify-email (MFA_SETUP)
     o modo login challenge (MFA_CHALLENGE)
  ------------------------------------------------------- */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (user.otpauth_url) {
      // Setup nuevo: viene de confirmEmail con el otpauth_url
      const qrUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        encodeURIComponent(user.otpauth_url);
      setQr(qrUrl);
    }

    setLoading(false);
  }, [user]);

  /* -------------------------------------------------------
     ROUTE HELPER
  ------------------------------------------------------- */
  const getOnboardingRoute = (role) => {
    switch (role) {
      case "influencer": return "/onboarding/influencer";
      case "creator":    return "/onboarding/creator";
      case "client":     return "/onboarding/client";
      default:           return "/";
    }
  };

  /* -------------------------------------------------------
     VERIFY
  ------------------------------------------------------- */
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?.email) {
      setError("Sesión no encontrada. Vuelve a registrarte.");
      return;
    }

    const cleanToken = token.replace(/\D/g, "");
    if (cleanToken.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    try {
      const res = await verifyMFA({ email: user.email, token: cleanToken });

      if (res?.success) {
        const role  = res?.user?.role || user?.role || "client";
        const route = getOnboardingRoute(role);
        navigate(route);
        return;
      }

      setError("Código incorrecto");

    } catch (err) {
      setError(err?.message || "Error verificando MFA");
    }
  };

  /* -------------------------------------------------------
     UI
  ------------------------------------------------------- */
  return (
    <div className="mfa-container">

      <h2>🔐 {isMfaSetup ? "Configura tu MFA" : "Verificación en dos pasos"}</h2>

      {error && <p className="error">{error}</p>}

      {loading && <p>Cargando...</p>}

      {/* SETUP: mostrar QR para escanear */}
      {!loading && qr && (
        <>
          <p>Escanea este código con Google Authenticator u otra app TOTP</p>
          <img src={qr} alt="QR MFA" />
        </>
      )}

      {/* CHALLENGE: solo ingresar código */}
      {!loading && !qr && (
        <p>Introduce el código de 6 dígitos de tu app autenticadora</p>
      )}

      {!loading && (
        <form onSubmit={handleVerify}>
          <input
            className="mfa-input"
            value={token}
            onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            maxLength={6}
            autoFocus
          />
          <button className="mfa-button" type="submit">
            Verificar
          </button>
        </form>
      )}

    </div>
  );
}
