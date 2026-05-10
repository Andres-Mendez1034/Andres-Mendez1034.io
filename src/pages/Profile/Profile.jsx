import React, { useContext } from "react";
import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  /* =========================================================
     🔥 REDIRECCIÓN A ONBOARDING SEGÚN ROL
  ========================================================= */
  const goToEditProfile = () => {
    if (!user?.role) {
      alert("Rol no definido. Contacta soporte.");
      return;
    }

    if (user.role === "influencer") {
      navigate("/onboarding/influencer");
    } else if (user.role === "client") {
      navigate("/onboarding/client");
    }
  };

  /* =========================================================
     🔥 INFO DINÁMICA SEGÚN ROL
  ========================================================= */
  const renderRoleSpecificData = () => {
    if (user?.role === "influencer") {
      return (
        <>
          <div className="field">
            <label>TikTok</label>
            <span>{user?.tiktokUrl || "No definido"}</span>
          </div>

          <div className="field">
            <label>Enfoque</label>
            <span>
              {user?.tags?.length ? user.tags.join(", ") : "No definido"}
            </span>
          </div>
        </>
      );
    }

    if (user?.role === "client") {
      return (
        <>
          <div className="field">
            <label>Negocio</label>
            <span>{user?.businessName || "No definido"}</span>
          </div>

          <div className="field">
            <label>Tipo de negocio</label>
            <span>{user?.businessType || "No definido"}</span>
          </div>

          <div className="field">
            <label>Objetivo</label>
            <span>{user?.goal || "No definido"}</span>
          </div>

          <div className="field">
            <label>Nivel de reconocimiento</label>
            <span>{user?.awareness || "No definido"}</span>
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <main className="page profile-page">

      {/* HEADER */}
      <header className="profile-hero">
        <div className="profile-hero-content">

          <div className="avatar">
            <span>
              {user?.name?.slice(0, 2).toUpperCase() || "US"}
            </span>
          </div>

          <div className="profile-head">
            <h2>Perfil</h2>
            <p>Gestiona tu información personal y configuración.</p>
          </div>

        </div>

        <div className="profile-hero-glow" aria-hidden="true" />
      </header>

      {/* CONTENIDO */}
      <section className="profile-content">

        {/* CARD PRINCIPAL */}
        <article className="profile-card">

          <h3>Información personal</h3>

          <div className="profile-grid">

            <div className="field">
              <label>Nombre</label>
              <span>{user?.name || "Sin nombre"}</span>
            </div>

            <div className="field">
              <label>Email</label>
              <span>{user?.email || "Sin email"}</span>
            </div>

            <div className="field">
              <label>Rol</label>
              <span>{user?.role || "Usuario"}</span>
            </div>

            <div className="field">
              <label>Ubicación</label>
              <span>{user?.location || "No definida"}</span>
            </div>

            {/* 🔥 DATA DINÁMICA POR ROL */}
            {renderRoleSpecificData()}

          </div>

          {/* ACCIÓN ÚNICA */}
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={goToEditProfile}>
              Completar / Editar perfil
            </button>
          </div>

        </article>

        {/* PREFERENCIAS (mock por ahora) */}
        <article className="profile-card muted">

          <h3>Preferencias</h3>

          <ul className="profile-list">
            <li>
              <span>Notificaciones por email</span>
              <span className="chip active">Activadas</span>
            </li>

            <li>
              <span>Modo oscuro</span>
              <span className="chip active">Activo</span>
            </li>

            <li>
              <span>Idioma</span>
              <span className="chip">Español</span>
            </li>
          </ul>

        </article>

      </section>
    </main>
  );
}