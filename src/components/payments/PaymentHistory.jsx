import { useEffect, useState } from "react";
import "./PaymentHistory.css";

const API = import.meta.env.VITE_API_URL;

const STATUS = {
  paid:    { label: "Pagado",    cls: "ph-badge--green" },
  pending: { label: "Pendiente", cls: "ph-badge--amber" },
  failed:  { label: "Fallido",   cls: "ph-badge--red"   },
};

const TYPE_ICON = {
  offer:   "🤝",
  service: "⚡",
};

export default function PaymentHistory({ token }) {
  const [orders,  setOrders]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    fetch(`${API}/payments/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar el historial");
        setLoading(false);
      });
  }, [token]);

  if (loading) return (
    <div className="ph-loading">
      <span className="ph-spinner" />
      Cargando historial...
    </div>
  );

  if (error) return <div className="ph-error">{error}</div>;

  if (!orders.length) return (
    <div className="ph-empty">
      <span className="ph-empty-icon">💳</span>
      <p>Aún no tienes pagos registrados</p>
    </div>
  );

  return (
    <div className="ph-wrap">
      <h3 className="ph-title">Mis pagos</h3>
      <ul className="ph-list">
        {orders.map((o) => {
          const s       = STATUS[o.status] || { label: o.status, cls: "ph-badge--gray" };
          const icon    = TYPE_ICON[o.order_type] || "💳";
          const label   = o.order_type === "offer"
            ? (o.notes?.trim() || "Colaboración negociada")
            : (o.service_title || "Servicio");
          const duration = o.duration_weeks
            ? ` · ${o.duration_weeks === 1 ? "1 semana" : o.duration_weeks < 4 ? `${o.duration_weeks} semanas` : o.duration_weeks === 4 ? "1 mes" : `${o.duration_weeks} semanas`}`
            : "";
          const currency = (o.currency || "cop").toUpperCase();
          const amount   = Number(o.amount).toLocaleString("es-CO");
          const date     = new Date(o.created_at).toLocaleDateString("es-CO", {
            day: "2-digit", month: "short", year: "numeric",
          });

          return (
            <li key={o.id} className="ph-item">
              <div className="ph-item-icon">{icon}</div>

              <div className="ph-item-main">
                <span className="ph-item-label">{label}{duration}</span>
                {o.influencer_name && (
                  <span className="ph-item-to">→ {o.influencer_name}</span>
                )}
              </div>

              <div className="ph-item-right">
                <span className="ph-item-amount">
                  {currency} {amount}
                </span>
                <span className={`ph-badge ${s.cls}`}>{s.label}</span>
                <span className="ph-item-date">{date}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
