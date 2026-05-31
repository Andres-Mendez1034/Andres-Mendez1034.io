import { useState } from "react";
import "./AdminSidebar.css";

const NAV_ITEMS = [
  { id: "stats",        icon: "ti-chart-bar",     label: "Dashboard"   },
  { id: "payments",     icon: "ti-credit-card",   label: "Pagos"       },
  { id: "plans",        icon: "ti-package",       label: "Planes"      },
  { id: "influencers",  icon: "ti-star",          label: "Influencers" },
  { id: "users",        icon: "ti-users",         label: "Usuarios"    },
  { id: "map",          icon: "ti-map-pin",       label: "Mapa"        },
];

export default function AdminSidebar({ active, onSelect, onLogout, user }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="brand-icon">⬡</span>
          {!collapsed && <span className="brand-name">Admin</span>}
        </div>
        <button
          className="collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <i className={`ti ${collapsed ? "ti-chevron-right" : "ti-chevron-left"}`} aria-hidden="true" />
        </button>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => onSelect(item.id)}
          >
            <i className={`ti ${item.icon}`} aria-hidden="true" />
            {!collapsed && <span>{item.label}</span>}
            {collapsed && <span className="nav-tooltip">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        {!collapsed && (
          <div className="sidebar-user">
            <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || "A"}</div>
            <div className="user-info">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">Superadmin</span>
            </div>
          </div>
        )}
        <button className="logout-btn" onClick={onLogout}>
          <i className="ti ti-logout" aria-hidden="true" />
          {!collapsed && <span>Salir</span>}
        </button>
      </div>
    </aside>
  );
}