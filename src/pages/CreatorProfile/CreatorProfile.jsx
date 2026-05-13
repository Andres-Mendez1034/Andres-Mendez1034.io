import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./CreatorProfile.css";

/* ─────────────────────────────
   MOCK API
───────────────────────────── */
async function fetchCreatorById(id) {
  await new Promise((r) => setTimeout(r, 600));

  if (id === "1") {
    return {
      id: 1,
      name: null,
      age: null,
      avatar: null,
      bio: null,
      tags: [],
      willing: [],
      socials: {
        instagram: "#",
        tiktok: "#",
        x: "#",
      },
      stats: {
        followers: null,
        engagement: null,
        avgLikes: null,
        avgComments: null,
        reach: null,
        platforms: [],
      },
    };
  }

  return null;
}

/* ─────────────────────────────
   COMPONENTS
───────────────────────────── */
function StatCard({ label, value, unit = "", accent = false }) {
  const formatValue = (val) => {
    if (typeof val === "number" && val >= 1000) {
      return (val / 1000).toFixed(1) + "K";
    }
    return val ?? "--";
  };

  return (
    <div className={`cp-stat-card ${accent ? "cp-stat-card--accent" : ""}`}>
      <span className="cp-stat-value">
        {formatValue(value)}{unit}
      </span>
      <span className="cp-stat-label">{label}</span>
    </div>
  );
}

function PlatformBar({ name, value }) {
  return (
    <div className="cp-platform-row">
      <span className="cp-platform-name">{name}</span>

      <div className="cp-platform-track">
        <div
          className="cp-platform-fill"
          style={{ width: `${value || 0}%` }}
        />
      </div>

      <span className="cp-platform-pct">{value || 0}%</span>
    </div>
  );
}

/* ─────────────────────────────
   PAGE
───────────────────────────── */
export default function CreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const data = await fetchCreatorById(id);

        if (mounted) setCreator(data);
      } catch (err) {
        console.error(err);
        if (mounted) setCreator(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => (mounted = false);
  }, [id]);

  /* ─────────────────────────────
     STATES
  ───────────────────────────── */
  if (loading) {
    return (
      <div className="cp-loading">
        <div className="cp-spinner" />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="cp-error">
        <p>Creador no encontrado</p>
        <button onClick={() => navigate("/marketplace")}>
          ← Volver
        </button>
      </div>
    );
  }

  /* ─────────────────────────────
     SAFE DATA
  ───────────────────────────── */
  const {
    name,
    age,
    avatar,
    bio,
    tags = [],
    willing = [],
    socials = {},
    stats = {},
  } = creator;

  const {
    followers,
    engagement,
    avgLikes,
    avgComments,
    reach,
    platforms = [],
  } = stats;

  /* ─────────────────────────────
     UI
  ───────────────────────────── */
  return (
    <div className="cp-root">

      {/* BACK */}
      <button className="cp-back" onClick={() => navigate(-1)}>
        ← Marketplace
      </button>

      {/* HERO */}
      <header className="cp-hero">
        <div className="cp-hero-blur" />

        <div className="cp-hero-inner">

          <div className="cp-avatar-wrap">
            <img
              src={avatar || "/default-avatar.png"}
              alt={name || "Creator"}
              className="cp-avatar"
            />
            <span className="cp-badge">Creator</span>
          </div>

          <div className="cp-hero-info">
            <h1 className="cp-name">{name || "Sin nombre"}</h1>

            {age && <p className="cp-age">{age} años</p>}

            <p className="cp-bio">
              {bio || "Sin descripción disponible."}
            </p>

            {tags.length > 0 && (
              <ul className="cp-tags">
                {tags.map((tag) => (
                  <li key={tag} className="cp-tag">
                    {tag}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="cp-cta-wrap">
            <button className="cp-chat-btn">
              Chatear
            </button>
            <span className="cp-chat-note">
              Disponible próximamente
            </span>
          </div>

        </div>
      </header>

      {/* WILLING */}
      <section className="cp-section">
        <h2 className="cp-section-title">Dispuesto a hacer</h2>

        {willing.length > 0 ? (
          <ul className="cp-willing-list">
            {willing.map((item) => (
              <li key={item} className="cp-willing-item">
                <span className="cp-willing-dot" />
                {item}
              </li>
            ))}
          </ul>
        ) : (
          <p className="cp-muted">Sin información disponible.</p>
        )}
      </section>

      {/* SOCIALS */}
      <section className="cp-section">
        <h2 className="cp-section-title">Redes sociales</h2>

        <div className="cp-social-grid">

          <a
            className="cp-social-card cp-social-instagram"
            href={socials.instagram}
          >
            <span>Instagram</span>
            <small>Ver perfil</small>
          </a>

          <a
            className="cp-social-card cp-social-tiktok"
            href={socials.tiktok}
          >
            <span>TikTok</span>
            <small>Ver perfil</small>
          </a>

          <a
            className="cp-social-card cp-social-x"
            href={socials.x}
          >
            <span>X</span>
            <small>Ver perfil</small>
          </a>

        </div>
      </section>

      {/* DASHBOARD */}
      <section className="cp-section cp-dashboard">
        <h2 className="cp-section-title">
          Dashboard de rendimiento
        </h2>

        <div className="cp-stats-grid">
          <StatCard label="Seguidores" value={followers} accent />
          <StatCard label="Engagement" value={engagement} unit="%" />
          <StatCard label="Likes prom." value={avgLikes} />
          <StatCard label="Comentarios prom." value={avgComments} />
          <StatCard label="Alcance estimado" value={reach} />
        </div>

        <div className="cp-platforms-card">
          <h3 className="cp-platforms-title">
            Distribución por plataforma
          </h3>

          {platforms.length > 0 ? (
            platforms.map((p) => (
              <PlatformBar
                key={p.name}
                name={p.name}
                value={p.value}
              />
            ))
          ) : (
            <p className="cp-muted">
              No hay plataformas registradas.
            </p>
          )}
        </div>
      </section>

    </div>
  );
}