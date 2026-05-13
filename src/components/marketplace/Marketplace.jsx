import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useMarketplace } from "../../hooks/useMarketplace";
import { AuthContext } from "../../context/AuthContext";
import "./Marketplace.css";

export default function Marketplace() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const {
    influencers,
    loading,
    error,
    addItem,
  } = useMarketplace();

  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sort, setSort] = useState("trending");
  const [query, setQuery] = useState("");

  const locations = ["Suba", "Kennedy", "Engativá", "Chapinero"];

  /* =========================================================
     FILTERED DATA
  ========================================================= */
  const filtered = (influencers || [])
    .filter((i) => {
      if (category === "all") return true;
      return (i.tag || "").toLowerCase() === category.toLowerCase();
    })
    .filter((i) => {
      if (statusFilter === "all") return true;
      return i.status === statusFilter;
    })
    .filter((i) => {
      if (locationFilter === "all") return true;
      return i.location === locationFilter;
    })
    .filter((i) =>
      (i.title || "").toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (sort === "price-asc") return priceA - priceB;
      if (sort === "price-desc") return priceB - priceA;

      if (sort === "trending") {
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      }

      return 0;
    });

  /* =========================================================
     LOADING / ERROR
  ========================================================= */
  if (loading) {
    return (
      <div className="marketplace">
        <p>Cargando marketplace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="marketplace">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="marketplace">

      {/* HERO */}
      <section className="mk-hero">
        <div className="mk-hero-content">
          <h1>Marketplace de Influencers</h1>
          <p>Explora y conecta con los mejores creadores</p>
        </div>
      </section>

      {/* FILTROS */}
      <div className="mk-filters">

        <div className="mk-search">
          <input
            type="text"
            placeholder="Buscar influencer..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="mk-selects">

          <div className="select">
            <label>Categoría</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Todas</option>
              <option value="humor">Humor</option>
              <option value="gaming">Gaming</option>
              <option value="fitness">Fitness</option>
              <option value="politica">Política</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>

          <div className="select">
            <label>Estado</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="available">Disponible</option>
              <option value="limited">Limitado</option>
              <option value="soldout">Agotado</option>
            </select>
          </div>

          <div className="select">
            <label>Localidad</label>
            <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
              <option value="all">Todas</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="select">
            <label>Ordenar</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="trending">Tendencia</option>
              <option value="price-asc">Precio ↑</option>
              <option value="price-desc">Precio ↓</option>
            </select>
          </div>

        </div>
      </div>

      {/* GRID */}
      <div className="mk-grid">
        {filtered.map((i) => (
          <div key={i.id} className="mk-card">

            <div className="mk-card-media">
              <div className="mk-thumb" />

              {i.trending && (
                <span className="badge badge-primary">🔥 Trending</span>
              )}

              {i.status === "available" && (
                <span className="badge badge-success">Disponible</span>
              )}

              {i.status === "limited" && (
                <span className="badge badge-muted">Limitado</span>
              )}

              {i.status === "soldout" && (
                <span className="badge badge-muted">Agotado</span>
              )}
            </div>

            <div className="mk-card-body">
              <h3 className="mk-card-title">{i.title}</h3>

              <div className="mk-card-meta">
                <span className="chip">{i.tag}</span>
                <span className="chip">{i.location}</span>
                <span className="price">${i.price}</span>
              </div>

              {i.status !== "soldout" && (
                <button
                  className="add-to-cart-btn"
                  onClick={() =>
                    addItem({
                      id: i.id,
                      name: i.title,
                      price: Number(i.price) || 0,
                      image: i.image || "",
                      quantity: 1,
                    })
                  }
                >
                  Agregar al carrito
                </button>
              )}

            </div>
          </div>
        ))}
      </div>

    </div>
  );
}