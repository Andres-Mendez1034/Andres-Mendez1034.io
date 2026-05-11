import React from "react";
import { Check } from "lucide-react";
import { createCheckout } from "../../services/payment.service";
import "./Pricing.css";

export default function Pricing() {

  const handleCheckout = async (plan) => {
    try {
      // 🔥 solo planes pagos
      if (plan.price === "$0") {
        window.location.href = "/";
        return;
      }

      const data = await createCheckout({
        productId: plan.name, // o mapea a ID real luego
      });

      // 🚀 redirección a Stripe Checkout
      window.location.href = data.url;

    } catch (err) {
      console.error("Checkout error:", err);
      alert("No se pudo iniciar el pago");
    }
  };

  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Ideal para probar la plataforma y explorar microinfluencers",
      features: [
        "Acceso limitado al chatbot IA",
        "Explorar microinfluencers básicos",
        "1 campaña activa",
        "Dashboard básico",
      ],
      cta: "Empezar gratis",
      highlight: false,
    },
    {
      name: "Pro",
      price: "$19",
      description: "Para creadores y negocios en crecimiento",
      features: [
        "Acceso completo al chatbot IA",
        "Recomendación de microinfluencers inteligente",
        "Hasta 10 campañas activas",
        "Analítica básica de engagement",
        "Personalización de campañas",
      ],
      cta: "Activar Pro",
      highlight: true,
    },
    {
      name: "Business",
      price: "$49",
      description: "Para marcas que quieren escalar campañas reales",
      features: [
        "IA avanzada de match influencer-marca",
        "Campañas ilimitadas",
        "Dashboard avanzado de métricas",
        "Optimización automática de contenido",
        "Soporte prioritario",
      ],
      cta: "Escalar negocio",
      highlight: false,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Soluciones a medida para agencias y grandes marcas",
      features: [
        "API de integración completa",
        "Modelo IA personalizado",
        "Gestión multi-equipo",
        "Automatización de campañas masivas",
        "Soporte dedicado 24/7",
      ],
      cta: "Hablar con ventas",
      highlight: false,
    },
  ];

  return (
    <div className="pricing-container">

      <div className="pricing-header">
        <h1>Planes simples para crecer con microinfluencers</h1>
        <p>Conecta marcas, creadores y campañas con IA en segundos</p>
      </div>

      <div className="pricing-grid">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`pricing-card ${
              plan.highlight ? "highlight" : ""
            }`}
          >
            <div>
              <h2>{plan.name}</h2>

              <p className="price">{plan.price}</p>

              <p className="description">{plan.description}</p>

              <ul className="features">
                {plan.features.map((feature, i) => (
                  <li key={i} className="feature">
                    <Check size={16} className="check-icon" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout(plan)}
              className={`pricing-btn ${
                plan.highlight ? "highlight" : "normal"
              }`}
            >
              {plan.cta}
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}