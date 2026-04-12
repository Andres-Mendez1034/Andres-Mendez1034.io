import React, { useState } from "react";
import { items } from "../../data/items";
import { useMarketplace } from "../../hooks/useMarketplace";
import "./Marketplace.css";

export default function Marketplace() {
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sort, setSort] = useState("trending");
  const [query, setQuery] = useState("");

  const { addItem } = useMarketplace();

  const filtered = items
    .filter(i =>
      category === "all"
        ? true
        : i.tag.toLowerCase() === category.toLowerCase()
    )
    .filter(i =>
      statusFilter === "all"
        ? true
        : i.status === statusFilter
    )
    .filter(i =>
      locationFilter === "all"
        ? true
        : i.location === locationFilter
    )
    .filter(i =>
      i.title.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      if (sort === "price-asc") {
        return Number(a.price.replace("$", "")) - Number(b.price.replace("$", ""));
      }
      if (sort === "price-desc") {
        return Number(b.price.replace("$", "")) - Number(a.price.replace("$", ""));
      }
      if (sort === "trending") {
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      }
      return 0;
    });

  const locations = ["Suba", "Kennedy", "Engativá", "Chapinero"];

  return (
    <div className="marketplace">

      {/* HERO */}
      <section className="mk-hero">
        <div className="mk-hero-content">
          <h1>Marketplace de Influencers</h1>
          <p>Explora y conecta con los mejores influencers colombianos</p>
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

          {/* CATEGORÍA */}
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

          {/* ESTADO */}
          <div className="select">
            <label>Estado</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Todos</option>
              <option value="available">Disponible</option>
              <option value="limited">Limitado</option>
              <option value="soldout">Agotado</option>
            </select>
          </div>

          {/* 📍 LOCALIDAD (NUEVO) */}
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

          {/* ORDEN */}
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
              <div className="mk-thumb"></div>

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
                <span className="chip">{i.location}</span> {/* 👈 NUEVO */}
                <span className="price">{i.price}</span>
              </div>

              {i.status !== "soldout" && (
                <button
                  className="add-to-cart-btn"
                  onClick={() =>
                    addItem({
                      id: i.id,
                      name: i.title,
                      price: Number(i.price.replace("$", "")),
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