import React from 'react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <span className="hero-badge">Plataforma de Marketing</span>
        <h2>Brand Connect</h2>
        <p>
          Conecta marcas con oportunidades reales. Gestiona campañas,
          marketplace y métricas desde un solo lugar.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary">Explorar plataforma</button>
          <button className="btn btn-ghost">Ver marketplace</button>
        </div>
      </div>

      {/* Glow decorativo */}
      <div className="hero-glow" aria-hidden="true" />
    </section>
  );
}