// src/pages/Login/Login.jsx
import React from "react";
import LoginForm from "../../components/auth/LoginForm";
import "../../components/auth/Login.css";

export default function Login() {
  return (
    <main className="page login-page" aria-label="Página de inicio de sesión">
      <section className="login-layout">
        <aside className="login-aside" aria-hidden="true">
          <div className="login-aside-inner">

            <p className="aside-text">
            </p>
            <div className="aside-glow" />
          </div>
        </aside>

        <div className="login-auth auth">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}