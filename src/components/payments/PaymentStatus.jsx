import React from "react";
import "./PaymentStatus.css";

export default function PaymentStatus({
  status = "pending",
  message,
}) {
  const getStatusContent = () => {
    switch (status) {
      case "success":
        return {
          title: "Pago exitoso",
          description:
            message || "Tu pago fue procesado correctamente.",
          className: "success",
        };

      case "failed":
        return {
          title: "Pago fallido",
          description:
            message || "Hubo un problema procesando el pago.",
          className: "failed",
        };

      case "cancelled":
        return {
          title: "Pago cancelado",
          description:
            message || "El proceso de pago fue cancelado.",
          className: "cancelled",
        };

      default:
        return {
          title: "Procesando pago",
          description:
            message || "Estamos verificando tu transacción.",
          className: "pending",
        };
    }
  };

  const { title, description, className } =
    getStatusContent();

  return (
    <div className={`payment-status ${className}`}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}