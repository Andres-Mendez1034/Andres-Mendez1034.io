import React from "react";
import "./Status.css";

export default function Status() {
  const services = [
    { name: "Marketplace", status: "Operativo" },
    { name: "Dashboard", status: "Operativo" },
    { name: "Soporte", status: "Mantenimiento programado" },
    { name: "Pagos", status: "Operativo" },
  ];

  return (
    <div className="status-page">
      <h1>Estado de los Servicios</h1>
      <p>Consulta aquí el estado actual de todas las funcionalidades de Brand Connect.</p>

      <div className="status-container">
        {services.map((service, index) => (
          <div key={index} className="status-card">
            <h2>{service.name}</h2>
            <p className={`status-${service.status.toLowerCase().replace(/\s/g, "-")}`}>
              {service.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}