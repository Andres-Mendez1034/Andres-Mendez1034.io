import { useEffect, useState } from "react";
import "./StatsPanel.css";

const API = import.meta.env.VITE_API_URL;

function StatCard({ icon, label, value, sub, color }) {
  return (
    <div className={`stat-card stat-card--${color}`}>
      <div className="stat-icon">
        <i className={`ti ${icon}`} aria-hidden="true" />
      </div>
      <div className="stat-body">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
        {sub && <span className="stat-sub">{sub}</span>}
      </div>
    </div>
  );
}

export default function StatsPanel({ token }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => { setStats(data); setLoading(false); })
      .catch(() => { setError("Error cargando estadísticas"); setLoading(false); });
  }, [token]);

  if (loading) return <div className="panel-loading"><span className="spinner" />Cargando...</div>;
  if (error)   return <div className="panel-error">{error}</div>;

  return (
    <div className="stats-panel">
      <h2 className="panel-title">Dashboard</h2>
      <div className="stats-grid">
        <StatCard
          icon="ti-users"
          label="Usuarios totales"
          value={stats.totalUsers?.toLocaleString()}
          sub={`+${stats.newUsersToday} hoy`}
          color="purple"
        />
        <StatCard
          icon="ti-credit-card"
          label="Pagos completados"
          value={stats.totalPayments?.toLocaleString()}
          color="teal"
        />
        <StatCard
          icon="ti-currency-dollar"
          label="Ingresos totales"
          value={`$${Number(stats.totalRevenue).toLocaleString("en-US", { minimumFractionDigits: 2 })}`}
          sub={`$${Number(stats.revenueToday).toFixed(2)} hoy`}
          color="amber"
        />
        <StatCard
          icon="ti-user-plus"
          label="Nuevos hoy"
          value={stats.newUsersToday?.toLocaleString()}
          color="coral"
        />
      </div>
    </div>
  );
}