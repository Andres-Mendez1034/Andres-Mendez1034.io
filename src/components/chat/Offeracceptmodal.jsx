// components/chat/OfferAcceptModal.jsx
import { useState } from "react";
import "./OfferAcceptModal.css";

const DURATIONS = [
  { value: 1,  label: "1 semana",   desc: "Publicación única o story" },
  { value: 2,  label: "2 semanas",  desc: "Mini campaña de lanzamiento" },
  { value: 4,  label: "1 mes",      desc: "Campaña mensual completa" },
  { value: 8,  label: "2 meses",    desc: "Campaña de awareness sostenida" },
  { value: 12, label: "3 meses",    desc: "Embajador de marca trimestral" },
];

const fmt = (n) => Number(n).toLocaleString("es-CO");

export default function OfferAcceptModal({ offer, conversationId, onClose, onSuccess }) {
  const [step, setStep]        = useState("confirm");
  const [weeks, setWeeks]      = useState(4);
  const [description, setDesc] = useState("");
  const [loading, setLoading]  = useState(false);
  const [error, setError]      = useState(null);

  const selectedDur = DURATIONS.find((d) => d.value === weeks) ?? DURATIONS[2];

  const handleReject = () => onClose("rejected");
  const handleAccept = () => setStep("details");

  const handlePay = async () => {
    if (!description.trim()) {
      setError("Escribe una descripción breve del trabajo.");
      return;
    }
    setError(null);
    setLoading(true);
    setStep("paying");

    try {
      const token = localStorage.getItem("bc_token");

      // VITE_API_URL ya contiene la base, ej: "http://localhost:3000/api"
      // La ruta es /payments/checkout-offer — sin /api extra
      const BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

      const res = await fetch(`${BASE}/payments/checkout-offer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          conversation_id:  conversationId,
          amount_cop:       offer.offer_amount,
          description:      description.trim(),
          duration_weeks:   weeks,
          offer_message_id: offer.id,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Error al crear el pago");
      }

      const { url } = await res.json();
      if (url) {
        onSuccess?.();
        window.location.href = url;
      }
    } catch (err) {
      setError(err.message);
      setStep("details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="oam-overlay" onClick={onClose}>
      <div className="oam-modal" onClick={(e) => e.stopPropagation()}>

        <div className="oam-header">
          <div className="oam-coin">💰</div>
          <h2 className="oam-title">Oferta recibida</h2>
          <p className="oam-subtitle">Han propuesto colaborar contigo</p>
        </div>

        <div className="oam-price-band">
          <span className="oam-currency">COP</span>
          <span className="oam-amount">${fmt(offer.offer_amount)}</span>
        </div>

        {/* ── STEP 1: Confirmar ── */}
        {step === "confirm" && (
          <div className="oam-body oam-body--confirm">
            <p className="oam-msg-preview">"{offer.text}"</p>
            <div className="oam-actions">
              <button className="oam-btn oam-btn--reject" onClick={handleReject}>
                <span className="oam-btn-icon">✕</span>
                Rechazar
              </button>
              <button className="oam-btn oam-btn--accept" onClick={handleAccept}>
                <span className="oam-btn-icon">✓</span>
                Aceptar oferta
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Detalles ── */}
        {(step === "details" || step === "paying") && (
          <div className="oam-body oam-body--details">

            <div className="oam-field">
              <label className="oam-label">
                <span className="oam-label-icon">📝</span>
                ¿Qué incluye esta colaboración?
              </label>
              <textarea
                className="oam-textarea"
                placeholder="Ej: 2 reels en Instagram mostrando el producto, con mención en stories durante 3 días..."
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                rows={3}
                maxLength={300}
              />
              <span className="oam-char-count">{description.length}/300</span>
            </div>

            <div className="oam-field">
              <label className="oam-label">
                <span className="oam-label-icon">📅</span>
                Duración de la campaña
              </label>
              <div className="oam-dur-grid">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    className={`oam-dur-card ${weeks === d.value ? "oam-dur-card--active" : ""}`}
                    onClick={() => setWeeks(d.value)}
                    type="button"
                  >
                    <span className="oam-dur-label">{d.label}</span>
                    <span className="oam-dur-desc">{d.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="oam-summary">
              <div className="oam-summary-row">
                <span>Precio acordado</span>
                <strong>COP ${fmt(offer.offer_amount)}</strong>
              </div>
              <div className="oam-summary-row">
                <span>Duración</span>
                <strong>{selectedDur.label}</strong>
              </div>
              <div className="oam-summary-row oam-summary-row--total">
                <span>Total a pagar</span>
                <strong>COP ${fmt(offer.offer_amount)}</strong>
              </div>
            </div>

            {error && <p className="oam-error">⚠ {error}</p>}

            <div className="oam-actions">
              <button
                className="oam-btn oam-btn--back"
                onClick={() => setStep("confirm")}
                disabled={loading}
              >
                ← Volver
              </button>
              <button
                className="oam-btn oam-btn--pay"
                onClick={handlePay}
                disabled={loading || !description.trim()}
              >
                {loading ? (
                  <span className="oam-spinner" />
                ) : (
                  <>
                    <span className="oam-btn-icon">🔒</span>
                    Pagar con Stripe
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        <button className="oam-close-x" onClick={onClose} aria-label="Cerrar">✕</button>
      </div>
    </div>
  );
}