import { useEffect, useState } from "react";
import "./PaymentsPanel.css";

const API = import.meta.env.VITE_API_URL;

const STATUS_LABEL = {
  paid:     { label: "Pagado",    cls: "badge--green" },
  pending:  { label: "Pendiente", cls: "badge--amber" },
  failed:   { label: "Fallido",   cls: "badge--red"   },
};

const TABS = [
  { id: "all",       label: "Todos"       },
  { id: "paid",      label: "Pagados"     },
  { id: "pending",   label: "Pendientes"  },
  { id: "failed",    label: "Fallidos"    },
  { id: "clientes",  label: "Top Clientes"    },
  { id: "influencers", label: "Top Influencers" },
];

export default function PaymentsPanel({ token }) {
  const [payments, setPayments] = useState([]);
  const [byDay,    setByDay]    = useState([]);
  const [view,     setView]     = useState("table");
  const [tab,      setTab]      = useState("all");
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/admin/payments`,        { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${API}/admin/payments/by-day`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([p, d]) => {
      setPayments(Array.isArray(p) ? p : []);
      setByDay(Array.isArray(d) ? d.slice(0, 14).reverse() : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="panel-loading"><span className="spinner" />Cargando pagos...</div>;

  const maxTotal = Math.max(...byDay.map(d => Number(d.total) || 0), 1);

  // ── Filtro por tab ────────────────────────────────────────────────────
  const filtered = ["paid","pending","failed"].includes(tab)
    ? payments.filter(p => p.status === tab)
    : payments;

  // ── Top clientes ──────────────────────────────────────────────────────
  const topClientes = Object.values(
    payments
      .filter(p => p.status === "paid")
      .reduce((acc, p) => {
        const key = p.email;
        if (!acc[key]) acc[key] = { name: p.name, email: p.email, total: 0, orders: 0 };
        acc[key].total  += Number(p.amount);
        acc[key].orders += 1;
        return acc;
      }, {})
  ).sort((a, b) => b.total - a.total).slice(0, 10);

  // ── Top influencers ───────────────────────────────────────────────────
  const topInfluencers = Object.values(
    payments
      .filter(p => p.status === "paid" && p.influencer_name)
      .reduce((acc, p) => {
        const key = p.influencer_name;
        if (!acc[key]) acc[key] = { name: p.influencer_name, total: 0, orders: 0 };
        acc[key].total  += Number(p.amount);
        acc[key].orders += 1;
        return acc;
      }, {})
  ).sort((a, b) => b.total - a.total).slice(0, 10);

  // ── Contadores para tabs ──────────────────────────────────────────────
  const count = {
    all:     payments.length,
    paid:    payments.filter(p => p.status === "paid").length,
    pending: payments.filter(p => p.status === "pending").length,
    failed:  payments.filter(p => p.status === "failed").length,
  };

  return (
    <div className="payments-panel">

      {/* ── Header ── */}
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

      {/* ── Chart ── */}
      {view === "chart" && (
        <div className="bar-chart">
          <div className="chart-bars">
            {byDay.map((d) => (
              <div key={d.day} className="bar-col">
                <div className="bar-wrap">
                  <div
                    className="bar-fill bar-fill--green"
                    style={{ height: `${(Number(d.total) / maxTotal) * 160}px` }}
                    title={`${Number(d.total).toLocaleString("es-CO")} COP`}
                  />
                </div>
                <span className="bar-label">{String(d.day).slice(5)}</span>
                <span className="bar-count">{d.completed}✓</span>
                {Number(d.failed) > 0 && <span className="bar-failed">{d.failed}✗</span>}
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-dot legend-dot--green" /> Ingresos por día
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      {view === "table" && (
        <>
          <div className="pp-tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`pp-tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
                {count[t.id] !== undefined && (
                  <span className="pp-tab-count">{count[t.id]}</span>
                )}
              </button>
            ))}
          </div>

          {/* ── Tabla de pagos ── */}
          {!["clientes","influencers"].includes(tab) && (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Descripción</th>
                    <th>Influencer</th>
                    <th>Monto</th>
                    <th>Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="cell-empty">Sin registros.</td>
                    </tr>
                  ) : filtered.map((p) => {
                    const s = STATUS_LABEL[p.status] || { label: p.status, cls: "badge--gray" };
                    const durLabel = p.duration_weeks
                      ? ` · ${p.duration_weeks === 1 ? "1 sem" : p.duration_weeks < 4 ? `${p.duration_weeks} sem` : p.duration_weeks === 4 ? "1 mes" : `${p.duration_weeks} sem`}`
                      : "";
                    return (
                      <tr key={p.id}>
                        <td className="cell-mono">#{p.id}</td>
                        <td>
                          <div className="cell-user">
                            <span className="cell-name">{p.name || "—"}</span>
                            <span className="cell-email">{p.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className="cell-name">
                            {p.description || "—"}{durLabel}
                          </span>
                          {p.category && (
                            <span className="badge badge--purple" style={{marginLeft:6}}>{p.category}</span>
                          )}
                        </td>
                        <td>
                          <span className="cell-name">{p.influencer_name || "—"}</span>
                        </td>
                        <td className="cell-amount">
                          {Number(p.amount).toLocaleString("es-CO")}
                          <span className="cell-currency"> {p.currency?.toUpperCase()}</span>
                        </td>
                        <td><span className={`badge ${s.cls}`}>{s.label}</span></td>
                        <td className="cell-date">{new Date(p.created_at).toLocaleDateString("es-CO")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Top Clientes ── */}
          {tab === "clientes" && (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Órdenes pagadas</th>
                    <th>Total gastado</th>
                  </tr>
                </thead>
                <tbody>
                  {topClientes.length === 0 ? (
                    <tr><td colSpan={4} className="cell-empty">Sin datos.</td></tr>
                  ) : topClientes.map((c, i) => (
                    <tr key={c.email}>
                      <td className="cell-mono">{i + 1}</td>
                      <td>
                        <div className="cell-user">
                          <div className="inf-avatar">{c.name?.[0]?.toUpperCase() || "?"}</div>
                          <div>
                            <span className="cell-name">{c.name || "—"}</span>
                            <span className="cell-email">{c.email}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="inf-orders">{c.orders}</span></td>
                      <td className="cell-amount">
                        {c.total.toLocaleString("es-CO")}
                        <span className="cell-currency"> COP</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Top Influencers ── */}
          {tab === "influencers" && (
            <div className="table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Influencer</th>
                    <th>Servicios vendidos</th>
                    <th>Total recibido</th>
                  </tr>
                </thead>
                <tbody>
                  {topInfluencers.length === 0 ? (
                    <tr><td colSpan={4} className="cell-empty">Sin datos.</td></tr>
                  ) : topInfluencers.map((inf, i) => (
                    <tr key={inf.name}>
                      <td className="cell-mono">{i + 1}</td>
                      <td>
                        <div className="cell-user">
                          <div className="inf-avatar">{inf.name?.[0]?.toUpperCase() || "?"}</div>
                          <span className="cell-name">{inf.name}</span>
                        </div>
                      </td>
                      <td><span className="inf-orders">{inf.orders}</span></td>
                      <td className="cell-amount">
                        {inf.total.toLocaleString("es-CO")}
                        <span className="cell-currency"> COP</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}