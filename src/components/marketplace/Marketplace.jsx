import React, { useState } from 'react';
import './Marketplace.css';

export default function Marketplace() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('trending');

  // Mock de items (puedes reemplazar por tus datos reales)
  const items = [
    { id: 1, title: 'Starter Brand Kit', price: 29, tag: 'Branding', trending: true, status: 'available' },
    { id: 2, title: 'UX Research Pack', price: 59, tag: 'UX', trending: true, status: 'limited' },
    { id: 3, title: 'Social Media Templates', price: 19, tag: 'Social', trending: false, status: 'available' },
    { id: 4, title: 'Logo Concept Pack', price: 99, tag: 'Branding', trending: true, status: 'soldout' },
    { id: 5, title: 'Pitch Deck Slides', price: 39, tag: 'Presentation', trending: false, status: 'available' },
    { id: 6, title: 'E-commerce UI Kit', price: 79, tag: 'UI', trending: true, status: 'available' },
  ];

  const filtered = items
    .filter(i => (category === 'all' ? true : i.tag.toLowerCase() === category))
    .filter(i => i.title.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'trending') return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
      return 0;
    });

  return (
    <div className="marketplace">
      {/* Hero/Header */}
      <header className="mk-hero">
        <div className="mk-hero-content">
          <h1>Marketplace</h1>
          <p>Descubre kits, recursos y assets para acelerar tu marca.</p>
          <div className="mk-hero-cta">
            <button className="btn btn-primary">Explorar ahora</button>
            <button className="btn btn-ghost">Publicar un recurso</button>
          </div>
        </div>
        <div className="mk-hero-glow" aria-hidden="true" />
      </header>

      {/* Filtros */}
      <section className="mk-filters">
        <div className="mk-search">
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Buscar en marketplace"
          />
        </div>

        <div className="mk-selects">
          <div className="select">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">Todas</option>
              <option value="branding">Branding</option>
              <option value="ux">UX</option>
              <option value="ui">UI</option>
              <option value="presentation">Presentation</option>
              <option value="social">Social</option>
            </select>
          </div>

          <div className="select">
            <label htmlFor="sort">Ordenar por</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="trending">Tendencia</option>
              <option value="price-asc">Precio: Bajo a Alto</option>
              <option value="price-desc">Precio: Alto a Bajo</option>
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mk-grid">
        {filtered.map((item) => (
          <article key={item.id} className="mk-card">
            <div className="mk-card-media">
              <div className="mk-thumb" />
              {item.trending && <span className="badge badge-primary">Trending</span>}
              {item.status === 'limited' && <span className="badge badge-success">Limited</span>}
              {item.status === 'soldout' && <span className="badge badge-muted">Sold out</span>}
            </div>

            <div className="mk-card-body">
              <h3 className="mk-card-title">{item.title}</h3>
              <div className="mk-card-meta">
                <span className="chip">{item.tag}</span>
                <span className="price">${item.price}</span>
              </div>
              <div className="mk-card-actions">
                <button className="btn btn-primary">Ver detalle</button>
                <button className="btn btn-outline">Añadir</button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}