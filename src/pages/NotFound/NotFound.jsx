import React from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";

import "./NotFound.css";

export default function NotFound() {
  return (
    <>
      {/* Navbar visible */}
      <Navbar />

      {/* Contenido 404 */}
      <main className="notfound-container">
        <div className="notfound-content">
          <h1 className="notfound-code">404</h1>

          <h2 className="notfound-title">
            Página no encontrada
          </h2>

          <p className="notfound-text">
            La ruta que intentas acceder no existe o fue movida.
            Verifica la URL o regresa al inicio.
          </p>

          <div className="notfound-actions">
            <Link to="/" className="notfound-button primary">
              Ir al inicio
            </Link>

            <button
              className="notfound-button secondary"
              onClick={() => window.history.back()}
            >
              Volver atrás
            </button>
          </div>
        </div>
      </main>

      {/* Footer visible */}
      <Footer />
    </>
  );
}