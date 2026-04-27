import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import "../../components/auth/Register.css";

export default function Register() {
  const navigate = useNavigate();

  // 🔥 ESTE ES EL FLUJO CORRECTO
  const handleRegisterSuccess = (state) => {
    // 1. MFA FLOW (CRÍTICO)
    if (state === "mfa") {
      navigate("/mfa");
      return;
    }

    // 2. ONBOARDING CLIENTE
    if (state === "client") {
      navigate("/onboarding/client");
      return;
    }

    // 3. ONBOARDING INFLUENCER
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