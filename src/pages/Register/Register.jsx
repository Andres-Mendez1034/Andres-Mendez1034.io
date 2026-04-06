// src/pages/Register/Register.jsx
import React from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import "../../components/auth/Register.css";

export default function Register() {
  return (
    <main className="page register-page" aria-label="Página de registro">
      <section className="register-layout">
        <RegisterForm />
      </section>
    </main>
  );
}