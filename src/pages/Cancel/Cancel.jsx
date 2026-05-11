import React from "react";
import { Link } from "react-router-dom";
import "./Cancel.css";

export default function Cancel() {
  return (
    <div className="cancel-page">
      <div className="cancel-container">
        <h1>Pago cancelado</h1>

        <p>
          El proceso de pago fue cancelado o no pudo completarse.
        </p>

        <p>
          Puedes intentarlo nuevamente cuando quieras.
        </p>

        <div className="cancel-actions">
          <Link to="/pricing" className="cancel-btn">
            Volver a Pricing
          </Link>

          <Link to="/" className="home-btn">
            Ir al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}