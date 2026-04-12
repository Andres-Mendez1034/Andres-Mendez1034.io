import React from "react";
import "./Pricing.css";

export default function Pricing() {
  const plans = [
    {
      name: "Básico",
      price: "$9/mes",
      features: ["Acceso limitado al marketplace", "Soporte por email", "1 campaña activa"]
    },
    {
      name: "Profesional",
      price: "$29/mes",
      features: ["Acceso completo al marketplace", "Soporte prioritario", "5 campañas activas", "Reportes avanzados"]
    },
    {
      name: "Premium",
      price: "$59/mes",
      features: ["Todo lo anterior", "Campañas ilimitadas", "Gestor dedicado", "Integraciones API"]
    }
  ];

  return (
    <div className="pricing-page">
      <h1>Planes de Precios</h1>
      <p>Escoge el plan que mejor se adapte a tus necesidades</p>

      <div className="plans-container">
        {plans.map((plan, index) => (
          <div key={index} className="plan-card">
            <h2>{plan.name}</h2>
            <p className="plan-price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>
            <button className="btn-select">Seleccionar</button>
          </div>
        ))}
      </div>
    </div>
  );
}