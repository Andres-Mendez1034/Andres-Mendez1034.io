// src/pages/Marketplace/Marketplace.jsx
import React, { useState } from "react";
import { items } from "../../data/items";
import { useMarketplace } from "../../hooks/useMarketplace"; // hook del carrito
import "./Marketplace.css"; 

export default function Marketplace() {
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("trending");
  const [query, setQuery] = useState("");

  const { addItem } = useMarketplace(); // función para agregar al carrito

  const filtered = items
    .filter(i => (category === "all" ? true : i.tag.toLowerCase() === category.toLowerCase()))
    .filter(i => (statusFilter === "all" ? true : i.status === statusFilter))
    .filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") {
        const aPrice = Number(a.price.replace("$", ""));
        const bPrice = Number(b.price.replace("$", ""));
        return aPrice - bPrice;
      }
      if (sort === "price-desc") {
        const aPrice = Number(a.price.replace("$", ""));
        const bPrice = Number(b.price.replace("$", ""));
        return bPrice - aPrice;
      }
      if (sort === "trending") {
        return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      }
      return 0;
    });

  return (
    <div className="marketplace">
      {/* Hero */}
      <section className="mk-hero">
        <div className="mk-hero-content">
          <h1>Marketplace de Influencers</h1>
          <p>Explora y conecta con los mejores influencers colombianos</p>
        </div>
        <div className="mk-hero-glow"></div>
      </section>

      {/* Filtros */}
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
            <label>Ordenar</label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="trending">Tendencia</option>
              <option value="price-asc">Precio ↑</option>
              <option value="price-desc">Precio ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid de resultados */}
      <div className="mk-grid">
        {filtered.map((i) => (
          <div key={i.id} className="mk-card">
            <div className="mk-card-media">
              <div className="mk-thumb"></div>
              {i.trending && <span className="badge badge-primary">🔥 Trending</span>}
              {i.status === "available" && <span className="badge badge-success">Disponible</span>}
              {i.status === "limited" && <span className="badge badge-muted">Limitado</span>}
              {i.status === "soldout" && <span className="badge badge-muted">Agotado</span>}
            </div>
            <div className="mk-card-body">
              <h3 className="mk-card-title">{i.title}</h3>
              <div className="mk-card-meta">
                <span className="chip">{i.tag}</span>
                <span className="price">{i.price}</span>
              </div>
              {/* Botón agregar al carrito */}
              {i.status !== "soldout" && (
                <button
                  className="add-to-cart-btn"
                  onClick={() => addItem({
                    id: i.id,
                    name: i.title,           // nombre que se verá en el carrito
                    price: Number(i.price.replace("$","")), // precio como número
                    image: i.image || "",    // si tienes imagen en items
                    quantity: 1
                  })}
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