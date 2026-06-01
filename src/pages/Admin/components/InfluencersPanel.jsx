import { useEffect, useState } from "react";
import "./InfluencersPanel.css";

const API = import.meta.env.VITE_API_URL;

const TABS = [
  { id: "top",      label: "Top Influencers" },
  { id: "ingresos", label: "Por Ingresos"    },
];

export default function InfluencersPanel({ token }) {
  const [influencers, setInfluencers] = useState([]);
  const [tab,         setTab]         = useState("top");
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/influencers/top`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error || `Error ${r.status}`);
        if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor");
        return data;
      })
      .then(data => { setInfluencers(data); setLoading(false); })
      .catch(err  => { setError(err.message); setLoading(false); });
  }, [token]);

  if (loading) return <div className="panel-loading"><span className="spinner" />Cargando influencers...</div>;
  if (error) return (
    <div className="influencers-panel">
      <h2 className="panel-title">Top Influencers</h2>
      <div className="panel-error">
        <i className="ti ti-alert-circle" /> Error: {error}
      </div>
    </div>
  );

  const sorted = tab === "ingresos"
    ? [...influencers].sort((a, b) => Number(b.total_revenue) - Number(a.total_revenue))
    : [...influencers].sort((a, b) => Number(b.total_orders)  - Number(a.total_orders));

  return (
    <div className="influencers-panel">
      <div className="panel-header">
        <h2 className="panel-title">Influencers</h2>
      </div>

      <div className="pp-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`pp-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Influencer</th>
              <th>Tags</th>
              <th>Órdenes</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="cell-empty">No hay datos aún.</td>
              </tr>
            ) : sorted.map((inf, i) => (
              <tr key={inf.id}>
                <td className="cell-mono">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                </td>
                <td>
                  <div className="cell-user">
                    <div className="inf-avatar">{inf.name?.[0]?.toUpperCase() || "?"}</div>
                    <div>
                      <span className="cell-name">{inf.name || "Sin nombre"}</span>
                      <span className="cell-email">{inf.email}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="inf-tags">
                    {inf.category
                      ? inf.category.split(", ").map(tag => (
                          <span key={tag} className="badge badge--purple">{tag}</span>
                        ))
                      : <span className="cell-email">—</span>
                    }
                  </div>
                </td>
                <td><span className="inf-orders">{inf.total_orders}</span></td>
                <td className="cell-amount">
                  {Number(inf.total_revenue).toLocaleString("es-CO")}
                  <span className="cell-currency"> COP</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}