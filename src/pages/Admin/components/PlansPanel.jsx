import { useEffect, useState } from "react";
import "./PlansPanel.css";

const API = import.meta.env.VITE_API_URL;

export default function PlansPanel({ token }) {
  const [plans,   setPlans]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/admin/plans/top`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(data => { setPlans(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="panel-loading"><span className="spinner" />Cargando planes...</div>;

  const maxSubs = Math.max(...plans.map(p => Number(p.total_subscriptions) || 0), 1);

  return (
    <div className="plans-panel">
      <h2 className="panel-title">Planes más vendidos</h2>

      <div className="plans-list">
        {plans.map((plan, i) => {
          const pct = Math.round((Number(plan.total_subscriptions) / maxSubs) * 100);
          return (
            <div key={plan.id} className="plan-row">
              <div className="plan-rank">#{i + 1}</div>
              <div className="plan-info">
                <div className="plan-top">
                  <span className="plan-name">{plan.name}</span>
                  <span className="plan-price">${Number(plan.price).toFixed(2)}<span className="plan-period">/mes</span></span>
                </div>
                <div className="plan-bar-track">
                  <div className="plan-bar-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="plan-subs">
                <span className="plan-subs-count">{plan.total_subscriptions}</span>
                <span className="plan-subs-label">subs</span>
              </div>
            </div>
          );
        })}
        {plans.length === 0 && (
          <p className="empty-state">No hay datos de planes aún.</p>
        )}
      </div>
    </div>
  );
}