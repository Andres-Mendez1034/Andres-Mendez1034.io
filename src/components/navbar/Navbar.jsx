import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen(prev => !prev);
  const closeMenu = () => setOpen(false);

  return (
    <nav className={`navbar${open ? ' open' : ''}`}>
      <div className="container">
        <div className="left">
          <NavLink to="/" className="logo" onClick={closeMenu}>
            Brand Connect
          </NavLink>
          <span className="navbar-greeting">Conecta. Crea. Crece.</span>
        </div>

        {/* Menú de escritorio */}
        <ul className="desktop-menu">
          <li><NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/marketplace" className={({ isActive }) => isActive ? 'active' : ''}>Marketplace</NavLink></li>
          <li><NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink></li>
          <li><NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
          <li><NavLink to="/register" className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink></li>
        </ul>

        {/* Botón Hamburguesa */}
        <button
          className={`menu-toggle${open ? ' open' : ''}`}
          aria-label="Abrir/cerrar menú"
          aria-expanded={open}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Menú móvil */}
      {open && (
        <ul className="mobile-menu">
          <li><NavLink to="/" end onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
          <li><NavLink to="/marketplace" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Marketplace</NavLink></li>
          <li><NavLink to="/profile" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink></li>
          <li><NavLink to="/dashboard" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink></li>
          <li><NavLink to="/login" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Login</NavLink></li>
          <li><NavLink to="/register" onClick={closeMenu} className={({ isActive }) => isActive ? 'active' : ''}>Register</NavLink></li>
        </ul>
      )}
    </nav>
  );
}