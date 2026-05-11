import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Success.css";

export default function Success() {
  const navigate = useNavigate();

  // 🔥 Redirección automática a HOME
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="success-page">
      <div className="success-container">

        <h1>Pago exitoso 🎉</h1>

        <p>
          Tu suscripción fue activada correctamente.
        </p>

        <p>
          Ya puedes acceder a las funciones premium de Brand Connect.
        </p>

        <div className="success-actions">

          <Link to="/" className="dashboard-btn">
            Ir al Home
          </Link>

          <Link to="/billing" className="billing-btn">
            Ver Facturación
          </Link>

        </div>

      </div>
    </div>
  );
}