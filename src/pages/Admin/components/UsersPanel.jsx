import { useEffect, useState, useCallback } from "react";
import "./UsersPanel.css";

const API = import.meta.env.VITE_API_URL;

const ROLE_BADGE = {
  influencer: "badge--teal",
  client:     "badge--gray",
  superadmin: "badge--purple",
  banned:     "badge--red",
};

const LIMIT = 50;

export default function UsersPanel({ token }) {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [inputValue, setInputValue] = useState("");
  const [busy,       setBusy]       = useState(null);
  const [page,       setPage]       = useState(1);
  const [total,      setTotal]      = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async (p, s) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: p, limit: LIMIT });
      if (s) params.set("search", s);

      const res  = await fetch(`${API}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      setUsers(data.users ?? []);
      setTotal(data.total ?? 0);
      setTotalPages(data.totalPages ?? 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Búsqueda con debounce 400ms
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [inputValue]);

  useEffect(() => {
    fetchUsers(page, search);
  }, [page, search, fetchUsers]);

  const updateUser = async (id, endpoint, body) => {
    setBusy(id);
    try {
      const res     = await fetch(`${API}/admin/users/${id}/${endpoint}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const updated = await res.json();
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="users-panel">
      <div className="panel-header">
        <h2 className="panel-title">
          Usuarios <span className="panel-count">({total.toLocaleString()})</span>
        </h2>
        <div className="search-box">
          <i className="ti ti-search" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
          />
        </div>
      </div>

      <div className="table-wrap">
        {loading ? (
          <div className="panel-loading"><span className="spinner" />Cargando usuarios...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Verificado</th>
                <th>Registrado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "rgba(255,255,255,0.3)" }}>
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : users.map(u => (
                <tr key={u.id} className={u.role === "banned" ? "row-banned" : ""}>
                  <td className="cell-mono">#{u.id}</td>
                  <td>
                    <div className="cell-user">
                      <div className="inf-avatar">{u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase()}</div>
                      <div>
                        <span className="cell-name">{u.name || "—"}</span>
                        <span className="cell-email">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${ROLE_BADGE[u.role] || "badge--gray"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td>
                    {u.email_verified
                      ? <span className="verified-yes"><i className="ti ti-circle-check" /> Sí</span>
                      : <span className="verified-no"><i className="ti ti-circle-x" /> No</span>
                    }
                  </td>
                  <td className="cell-date">{new Date(u.created_at).toLocaleDateString("es-CO")}</td>
                  <td>
                    <div className="action-btns">
                      {u.role !== "superadmin" && (
                        <button
                          className="action-btn action-btn--promote"
                          disabled={busy === u.id}
                          onClick={() => updateUser(u.id, "role", { role: "superadmin" })}
                          title="Promover a superadmin"
                        >
                          <i className="ti ti-shield-up" />
                        </button>
                      )}
                      {u.role !== "banned" ? (
                        <button
                          className="action-btn action-btn--ban"
                          disabled={busy === u.id}
                          onClick={() => updateUser(u.id, "ban", {})}
                          title="Banear usuario"
                        >
                          <i className="ti ti-ban" />
                        </button>
                      ) : (
                        <button
                          className="action-btn action-btn--unban"
                          disabled={busy === u.id}
                          onClick={() => updateUser(u.id, "role", { role: "client" })}
                          title="Desbanear usuario"
                        >
                          <i className="ti ti-refresh" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* PAGINACIÓN */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            <i className="ti ti-chevron-left" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
            .reduce((acc, p, idx, arr) => {
              if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
              acc.push(p);
              return acc;
            }, [])
            .map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="page-ellipsis">…</span>
              ) : (
                <button
                  key={p}
                  className={`page-btn ${p === page ? "active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              )
            )
          }

          <button
            className="page-btn"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <i className="ti ti-chevron-right" />
          </button>

          <span className="page-info">
            {((page - 1) * LIMIT) + 1}–{Math.min(page * LIMIT, total)} de {total.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
}