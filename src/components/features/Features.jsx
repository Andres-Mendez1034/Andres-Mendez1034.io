import React from "react";
import "./Features.css";

import cartIcon from "../../assets/cart.png";
import chatbotIcon from "../../assets/asesor.png";
import securityIcon from "../../assets/react.svg";
import dashboardIcon from "../../assets/vite.svg";

export default function Features() {
  const features = [
    {
      title: "Marketplace de Creadores",
      description:
        "Explora, contrata y gestiona servicios de influencers y creadores en un solo lugar.",
      icon: cartIcon,
    },
    {
      title: "Pagos Seguros",
      description:
        "Sistema de pagos integrado con verificación, checkout y estado de transacciones en tiempo real.",
      icon: securityIcon,
    },
    {
      title: "Chatbot Inteligente",
      description:
        "Asistente virtual para soporte, recomendaciones y ayuda dentro de la plataforma.",
      icon: chatbotIcon,
    },
    {
      title: "Panel de Control",
      description:
        "Dashboard completo para clientes y creadores con métricas, servicios y gestión de perfiles.",
      icon: dashboardIcon,
    },
  ];

  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Características del Sistema</h2>
        <p>
          Una plataforma SaaS completa para conectar creadores, clientes y pagos en un ecosistema seguro.
        </p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">
              <img src={feature.icon} alt={feature.title} />
            </div>

            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}