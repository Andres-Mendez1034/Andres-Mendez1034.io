import { useContext } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

import AdminSidebar      from "./components/AdminSidebar";
import StatsPanel        from "./components/StatsPanel";
import PaymentsPanel     from "./components/PaymentsPanel";
import PlansPanel        from "./components/PlansPanel";
import InfluencersPanel  from "./components/InfluencersPanel";
import UsersPanel        from "./components/UsersPanel";
import MapPanel          from "./components/MapPanel";

import "./AdminPage.css";

const PANELS = {
  stats:       StatsPanel,
  payments:    PaymentsPanel,
  plans:       PlansPanel,
  influencers: InfluencersPanel,
  users:       UsersPanel,
  map:         MapPanel,
};

export default function AdminPage() {
  const { user, token, logout, isAuthenticated } = useContext(AuthContext);
  const [active, setActive] = useState("stats");
  const navigate = useNavigate();

  if (!isAuthenticated || user?.role !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  const Panel = PANELS[active] || StatsPanel;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      <AdminSidebar
        active={active}
        onSelect={setActive}
        onLogout={handleLogout}
        user={user}
      />
      <main className="admin-main">
        <Panel token={token} />
      </main>
    </div>
  );
}