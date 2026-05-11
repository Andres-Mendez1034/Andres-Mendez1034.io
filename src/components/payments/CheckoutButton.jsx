import React, { useState } from "react";
import paymentService from "../../services/payment.service";
import "./CheckoutButton.css";

export default function CheckoutButton({
  productId,
  text = "Suscribirme",
}) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const response = await paymentService.createCheckout(productId);

      if (response?.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("❌ Error creating checkout:", error);
      alert("No se pudo iniciar el pago.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="checkout-btn"
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Procesando..." : text}
    </button>
  );
}