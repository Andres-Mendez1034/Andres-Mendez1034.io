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
     DEBUG USER
  ========================================================= */
  useEffect(() => {
    console.log("👤 MFA USER:", user);
  }, [user]);

  /* =========================================================
     GENERAR QR
  ========================================================= */
  useEffect(() => {

    if (!user) {
      setLoading(false);
      return;
    }

    // ⚠️ Login MFA challenge normalmente NO trae QR
    // Solo setup/register suele traer otpauth_url

    if (!user.otpauth_url) {
      console.log("ℹ️ No otpauth_url → MFA LOGIN MODE");

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
     HELPER → ROLE ROUTES
  ========================================================= */
  const getOnboardingRoute = (role) => {

    switch (role) {

      case "influencer":
        return "/onboarding/influencer";

      case "creator":
        return "/onboarding/creator";

      case "client":
        return "/onboarding/client";

      default:
        return "/";
    }
  };

  /* =========================================================
     VERIFY MFA
  ========================================================= */
  const handleVerify = async (e) => {
    e.preventDefault();

    setError("");

    if (!user?.email) {
      setError("Usuario no cargado");
      return;
    }

    const cleanToken = token.replace(/\D/g, "");

    if (cleanToken.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    try {

      console.log("🚀 VERIFY MFA REQUEST:", {
        email: user.email,
        token: cleanToken,
        role: user.role,
      });

      const res = await verifyMFA({
        email: user.email,
        token: cleanToken,
      });

      console.log("🔐 VERIFY RESPONSE:", res);

      if (res?.success) {

        // ✅ usar role del response primero
        const role =
          res?.user?.role ||
          user?.role ||
          "client";

        console.log("👤 FINAL ROLE:", role);

        const route = getOnboardingRoute(role);

        console.log("➡️ NAVIGATE:", route);

        navigate(route);

        return;
      }

      setError("Código incorrecto");

    } catch (err) {

      console.error("❌ VERIFY ERROR:", err);

      setError(
        err?.message ||
        "Error verificando MFA"
      );
    }
  };

  /* =========================================================
     UI
  ========================================================= */
  return (
    <div className="mfa-container">

      <h2>🔐 Configura tu MFA</h2>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      {loading && (
        <p>Cargando MFA...</p>
      )}

      {/* QR SOLO SI EXISTE */}
      {!loading && qr && (
        <>
          <p>
            Escanea este código con Google
            Authenticator
          </p>

          <img
            src={qr}
            alt="QR MFA"
          />
        </>
      )}

      {/* LOGIN MODE */}
      {!loading && !qr && (
        <p>
          Introduce el código de tu app
          autenticadora
        </p>
      )}

      {!loading && (
        <form onSubmit={handleVerify}>

          <input
            className="mfa-input"
            value={token}
            onChange={(e) =>
              setToken(
                e.target.value.replace(/\D/g, "")
              )
            }
            placeholder="123456"
            maxLength={6}
          />

          <button
            className="mfa-button"
            type="submit"
          >
            Verificar
          </button>

        </form>
      )}
    </div>
  );
}