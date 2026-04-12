import React from "react";
import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/auth/RegisterForm";
import "../../components/auth/Register.css";

export default function Register() {
  const navigate = useNavigate();

  const handleRegisterSuccess = (userType) => {
    if (userType === "client") {
      navigate("/onboarding/client");
    } else {
      navigate("/onboarding/influencer");
    }
  };

  return (
    <main className="page register-page" aria-label="Página de registro">
      <section className="register-layout">
        <RegisterForm onSuccess={handleRegisterSuccess} />
      </section>
    </main>
  );
}