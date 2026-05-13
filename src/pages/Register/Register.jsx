import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import "../../components/auth/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (res) => {
    const user = res?.user || res;

    console.log("📦 REGISTER SUCCESS:", res);

    // 🔐 MFA SETUP (solo si backend lo indica)
    const requiresMfaSetup =
      res?.mfaRequired === true ||
      user?.otpauth_url;

    if (requiresMfaSetup) {
      navigate("/mfa-setup");
      return;
    }

    // =========================
    // CLIENT
    // =========================
    if (user?.role === "client") {
      navigate("/onboarding/client");
      return;
    }

    // =========================
    // INFLUENCER (DEFAULT)
    // =========================
    if (user?.role === "influencer") {
      navigate("/onboarding/influencer");
      return;
    }

    // 🔥 FALLBACK SEGURO
    navigate("/onboarding/influencer");
  };

  return (
    <main className="page register-page" aria-label="Página de registro">
      <section className="register-layout">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </section>
    </main>
  );
}