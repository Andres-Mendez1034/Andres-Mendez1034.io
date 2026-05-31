import { useEffect, useState } from "react";
import "./PaymentsPanel.css";

const API = import.meta.env.VITE_API_URL;

const STATUS_LABEL = {
  completed: { label: "Completado", cls: "badge--green"  },
  pending:   { label: "Pendiente",  cls: "badge--amber"  },
  failed:    { label: "Fallido",    cls: "badge--red"    },
};

export default function PaymentsPanel({ token }) {
  const [payments,  setPayments]  = useState([]);
  const [byDay,     setByDay]     = useState([]);
  const [view,      setView]      = useState("table");
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/payments`,          { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/admin/payments/by-day`,   { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, d]) => {
      setPayments(p);
      setByDay(d.slice(0, 14).reverse());
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="panel-loading"><span className="spinner" />Cargando pagos...</div>;

  const maxTotal = Math.max(...byDay.map(d => Number(d.total) || 0), 1);

  return (
    <div className="payments-panel">
      <div className="panel-header">
        <h2 className="panel-title">Pagos</h2>
        <div className="view-toggle">
          <button className={view === "table" ? "active" : ""} onClick={() => setView("table")}>
            <i className="ti ti-table" /> Tabla
          </button>
          <button className={view === "chart" ? "active" : ""} onClick={() => setView("chart")}>
            <i className="ti ti-chart-bar" /> Por día
          </button>
        </div>
      </div>

      {view === "chart" ? (
        <div className="bar-chart">
          <div className="chart-bars">
            {byDay.map((d) => (
              <div key={d.day} className="bar-col">
                <div className="bar-wrap">
                  <div
                    className="bar-fill bar-fill--green"
                    style={{ height: `${(Number(d.total) / maxTotal) * 160}px` }}
                    title={`$${Number(d.total).toFixed(2)}`}
                  />
                </div>
                <span className="bar-label">{String(d.day).slice(5)}</span>
                <span className="bar-count">{d.completed}✓</span>
                {Number(d.failed) > 0 && <span className="bar-failed">{d.failed}✗</span>}
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-dot legend-dot--green" /> Ingresos por día (USD)
          </div>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => {
                const s = STATUS_LABEL[p.status] || { label: p.status, cls: "badge--gray" };
                return (
                  <tr key={p.id}>
                    <td className="cell-mono">#{p.id}</td>
                    <td>
                      <div className="cell-user">
                        <span className="cell-name">{p.name || "—"}</span>
                        <span className="cell-email">{p.email}</span>
                      </div>
                    </td>
                    <td className="cell-amount">${Number(p.amount).toFixed(2)} <span className="cell-currency">{p.currency?.toUpperCase()}</span></td>
                    <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                    <td className="cell-date">{new Date(p.created_at).toLocaleDateString("es-CO")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}