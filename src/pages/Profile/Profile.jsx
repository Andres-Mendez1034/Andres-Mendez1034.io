import React from 'react';
import './Profile.css';

export default function Profile() {
  return (
    <main className="page profile-page">
      {/* Header */}
      <header className="profile-hero">
        <div className="profile-hero-content">
          <div className="avatar">
            <span>AF</span>
          </div>
          <div className="profile-head">
            <h2>Perfil</h2>
            <p>Gestiona tu información personal y preferencias.</p>
          </div>
        </div>
        <div className="profile-hero-glow" aria-hidden="true" />
      </header>

      {/* Contenido */}
      <section className="profile-content">
        {/* Card información */}
        <article className="profile-card">
          <h3>Información personal</h3>

          <div className="profile-grid">
            <div className="field">
              <label>Nombre</label>
              <span>Andrés Contreras</span>
            </div>
            <div className="field">
              <label>Email</label>
              <span>andres@email.com</span>
            </div>
            <div className="field">
              <label>Rol</label>
              <span>Usuario</span>
            </div>
            <div className="field">
              <label>Ubicación</label>
              <span>Cundinamarca, CO</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn btn-primary">Editar perfil</button>
            <button className="btn btn-outline">Cambiar contraseña</button>
          </div>
        </article>

        {/* Card configuración */}
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