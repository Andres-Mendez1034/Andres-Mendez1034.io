import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PLAN_DATA = {
  pro: {
    label: "Pro",
    price: "$19",
    emoji: "⚡",
    perks: [
      "Acceso completo al chatbot IA",
      "Recomendación de microinfluencers inteligente",
      "Hasta 10 campañas activas",
      "Analítica básica de engagement",
    ],
  },
  business: {
    label: "Business",
    price: "$49",
    emoji: "🚀",
    perks: [
      "IA avanzada de match influencer-marca",
      "Campañas ilimitadas",
      "Dashboard avanzado de métricas",
      "Soporte prioritario",
    ],
  },
};

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  const planName = searchParams.get("plan") || "pro";
  const plan = PLAN_DATA[planName] || PLAN_DATA.pro;

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  return (
    <div className="success-bg">
      <div className={`success-card ${visible ? "success-card--in" : ""}`}>

        {/* Icono animado */}
        <div className="success-icon-wrap">
          <div className="success-ring" />
          <span className="success-check">✓</span>
        </div>

        <p className="success-eyebrow">Pago confirmado</p>
        <h1 className="success-title">
          {plan.emoji} Plan {plan.label} activado
        </h1>
        <p className="success-sub">
          Tu cuenta ha sido actualizada. Ya tienes acceso a todo lo incluido en el plan.
        </p>

        {/* Perks */}
        <ul className="success-perks">
          {plan.perks.map((p, i) => (
            <li key={i} className="success-perk" style={{ animationDelay: `${0.4 + i * 0.08}s` }}>
              <span className="perk-dot" />
              {p}
            </li>
          ))}
        </ul>

        {/* Acciones */}
        <div className="success-actions">
          <button className="btn-primary" onClick={() => navigate("/dashboard")}>
            Ir al dashboard
          </button>
          <button className="btn-ghost" onClick={() => navigate("/")}>
            Volver al inicio
          </button>
        </div>

      </div>
    </div>
  );
}