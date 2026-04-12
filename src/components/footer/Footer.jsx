import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-top">
        <div className="ft-col brand">
          <Link to="/" className="brand-link" aria-label="Brand Connect - inicio">
            <span className="brand-logo">BC</span>
            <span className="brand-name">Brand Connect</span>
          </Link>
          <p className="brand-tag">Conecta. Crea. Crece.</p>
        </div>

        <nav className="ft-col nav" aria-label="Enlaces rápidos">
          <h4 className="ft-title">Navegación</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/marketplace">Marketplace</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/profile">Perfil</Link></li>
          </ul>
        </nav>

        <nav className="ft-col resources" aria-label="Recursos">
          <h4 className="ft-title">Recursos</h4>
          <ul>
            <li><Link to="/docs">Docs</Link></li>
            <li><Link to="/pricing">Precios</Link></li>
            <li><Link to="/support">Soporte</Link></li>
            <li><Link to="/status">Status</Link></li>
          </ul>
        </nav>

        <div className="ft-col newsletter">
          <h4 className="ft-title">Recibe novedades</h4>
          <p className="ft-note">Suscríbete para noticias del marketplace y lanzamientos.</p>
          <form className="ft-form" onSubmit={(e) => e.preventDefault()} aria-label="Formulario de suscripción">
            <input
              type="email"
              placeholder="tu@email.com"
              aria-label="Correo electrónico"
              required
            />
            <button type="submit" className="btn btn-primary">Suscribirme</button>
          </form>
          <div className="socials" aria-label="Redes sociales">
            <a href="https://twitter.com" aria-label="X / Twitter" target="_blank" rel="noreferrer">X</a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">IG</a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">IN</a>
            <a href="https://github.com" aria-label="GitHub" target="_blank" rel="noreferrer">GH</a>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <p>© {year} Brand Connect</p>
        <ul className="legal-links" aria-label="Legales">
          <li><Link to="/privacy">Privacidad</Link></li>
          <li><Link to="/terms">Términos</Link></li>
          <li><Link to="/cookies">Cookies</Link></li>
        </ul>
      </div>
    </footer>
  );
}