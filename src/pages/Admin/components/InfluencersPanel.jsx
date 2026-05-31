import { useEffect, useState } from "react";
import "./InfluencersPanel.css";

const API = import.meta.env.VITE_API_URL;

export default function InfluencersPanel({ token }) {
  const [influencers, setInfluencers] = useState([]);
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
  if (error)   return (
    <div className="influencers-panel">
      <h2 className="panel-title">Top Influencers</h2>
      <div className="panel-error">
        <i className="ti ti-alert-circle" /> Error: {error}
      </div>
    </div>
  );

  return (
    <div className="influencers-panel">
      <h2 className="panel-title">Top Influencers</h2>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Influencer</th>
              <th>Categoría</th>
              <th>Órdenes</th>
              <th>Ingresos</th>
            </tr>
          </thead>
          <tbody>
            {influencers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", color: "rgba(255,255,255,0.25)", padding: "32px" }}>
                  No hay datos aún.
                </td>
              </tr>
            ) : influencers.map((inf, i) => (
              <tr key={inf.id}>
                <td className="cell-mono">{i + 1}</td>
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
                  {inf.category
                    ? <span className="badge badge--purple">{inf.category}</span>
                    : <span className="cell-email">—</span>
                  }
                </td>
                <td><span className="inf-orders">{inf.total_orders}</span></td>
                <td className="cell-amount">
                  ${Number(inf.total_revenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}