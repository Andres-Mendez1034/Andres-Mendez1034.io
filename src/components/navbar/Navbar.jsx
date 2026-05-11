import React, { useState, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";
import cartIcon from "../../assets/cart.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const toggleMenu = () => setOpen((prev) => !prev);
  const closeMenu = () => setOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <nav className={`navbar${open ? " open" : ""}`}>
      <div className="container">

        {/* LEFT */}
        <div className="left">
          <NavLink to="/" className="logo" onClick={closeMenu}>
            Brand Connect
          </NavLink>

          <span className="navbar-greeting">
            Conecta. Crea. Crece.
          </span>
        </div>

        {/* DESKTOP MENU */}
        <ul className="desktop-menu">

          <li>
            <NavLink to="/" end className={linkClass}>
              Home
            </NavLink>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/marketplace" className={linkClass}>
                  Marketplace
                </NavLink>
              </li>

              <li>
                <NavLink to="/profile" className={linkClass}>
                  Profile
                </NavLink>
              </li>

              <li>
                <NavLink to="/chatbot" className={linkClass}>
                  💬 Asistente IA
                </NavLink>
              </li>

              <li>
                <NavLink to="/onboarding/creator" className={linkClass}>
                  Crear perfil
                </NavLink>
              </li>

              <li className="cart">
                <NavLink to="/cart" onClick={closeMenu}>
                  <img src={cartIcon} alt="Carrito" className="cart-icon" />
                </NavLink>
              </li>

              <li className="navbar-user">
                👋 Hola, {user?.name || "Usuario"}
              </li>

              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Cerrar sesión
                </button>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li>
                <NavLink to="/login" className={linkClass}>
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink to="/register" className={linkClass}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* HAMBURGER */}
        <button
          className={`menu-toggle${open ? " open" : ""}`}
          aria-label="Abrir/cerrar menú"
          aria-expanded={open}
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <ul className="mobile-menu">

          <li>
            <NavLink to="/" end onClick={closeMenu} className={linkClass}>
              Home
            </NavLink>
          </li>

          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/marketplace" onClick={closeMenu} className={linkClass}>
                  Marketplace
                </NavLink>
              </li>

              <li>
                <NavLink to="/profile" onClick={closeMenu} className={linkClass}>
                  Profile
                </NavLink>
              </li>

              <li>
                <NavLink to="/chatbot" onClick={closeMenu} className={linkClass}>
                  💬 Asistente IA
                </NavLink>
              </li>

              <li>
                <NavLink to="/onboarding/creator" onClick={closeMenu} className={linkClass}>
                  Crear perfil
                </NavLink>
              </li>

              <li>
                <NavLink to="/cart" onClick={closeMenu}>
                  <img src={cartIcon} alt="Carrito" className="cart-icon" />
                  Carrito
                </NavLink>
              </li>

              <li className="navbar-user">
                👋 Hola, {user?.name || "Usuario"}
              </li>

              <li>
                <button onClick={handleLogout} className="logout-btn">
                  Cerrar sesión
                </button>
              </li>
            </>
          )}

          {!isAuthenticated && (
            <>
              <li>
                <NavLink to="/login" onClick={closeMenu} className={linkClass}>
                  Login
                </NavLink>
              </li>

              <li>
                <NavLink to="/register" onClick={closeMenu} className={linkClass}>
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      )}
    </nav>
  );
}