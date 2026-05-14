import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCreatorById } from "../../services/influencer.service";
import "./CreatorProfile.css";

/* ─────────────────────────────────────────────────────────
   NORMALIZER
   Adapta cualquier forma que devuelva el backend a la
   estructura que espera el componente.
   Agrega aquí alias si el backend cambia nombres de campos.
───────────────────────────────────────────────────────── */
function normalizeCreator(raw) {
  if (!raw) return null;

  // Socials: el backend puede mandar { instagram_url, tiktok_url, x_url }
  // o un objeto anidado { socials: { instagram, tiktok, x } }
  const socials = raw.socials ?? {
    instagram: raw.instagram_url ?? raw.instagram ?? null,
    tiktok:    raw.tiktok_url   ?? raw.tiktok   ?? null,
    x:         raw.x_url        ?? raw.x         ?? raw.twitter ?? null,
  };

  // Stats: el backend puede mandarlas planas o anidadas
  const stats = raw.stats ?? {
    followers:   raw.followers    ?? raw.total_followers ?? null,
    engagement:  raw.engagement   ?? raw.engagement_rate ?? null,
    avgLikes:    raw.avg_likes    ?? raw.avgLikes        ?? null,
    avgComments: raw.avg_comments ?? raw.avgComments     ?? null,
    reach:       raw.reach        ?? raw.estimated_reach ?? null,
    platforms:   raw.platforms    ?? [],
  };

  return {
    id:      raw.id ?? raw.creator_id ?? raw.user_id,
    name:    raw.name ?? raw.full_name ?? raw.username ?? null,
    age:     raw.age  ?? null,
    avatar:  raw.avatar ?? raw.profile_image ?? raw.photo ?? null,
    bio:     raw.bio ?? raw.description ?? raw.about ?? null,
    tags:    raw.tags ?? raw.categories ?? (raw.tag ? [raw.tag] : []),
    willing: raw.willing ?? raw.services ?? raw.content_types ?? [],
    socials,
    stats,
  };
}

/* ─────────────────────────────
   SUB-COMPONENTS
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

  const [creator, setCreator]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);

  useEffect(() => {
    if (!id) return;

    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const raw  = await fetchCreatorById(id);
        const data = normalizeCreator(raw);

        if (mounted) setCreator(data);
      } catch (err) {
        console.error("CreatorProfile error:", err);
        if (mounted) setError(err.message || "Error al cargar el perfil");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => { mounted = false; };
  }, [id]);

  /* ── LOADING ── */
  if (loading) {
    return (
      <div className="cp-loading">
        <div className="cp-spinner" />
        <p>Cargando perfil...</p>
      </div>
    );
  }

  /* ── ERROR / NOT FOUND ── */
  if (error || !creator) {
    return (
      <div className="cp-error">
        <p>{error ?? "Creador no encontrado"}</p>
        <button onClick={() => navigate("/marketplace")}>
          ← Volver al marketplace
        </button>
      </div>
    );
  }

  /* ── DESTRUCTURE ── */
  const {
    name,
    age,
    avatar,
    bio,
    tags     = [],
    willing  = [],
    socials  = {},
    stats    = {},
  } = creator;

  const {
    followers,
    engagement,
    avgLikes,
    avgComments,
    reach,
    platforms = [],
  } = stats;

  /* ── UI ── */
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
                  <li key={tag} className="cp-tag">{tag}</li>
                ))}
              </ul>
            )}
          </div>

          <div className="cp-cta-wrap">
            <button className="cp-chat-btn">Chatear</button>
            <span className="cp-chat-note">Disponible próximamente</span>
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
          {socials.instagram && (
            <a
              className="cp-social-card cp-social-instagram"
              href={socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Instagram</span>
              <small>Ver perfil</small>
            </a>
          )}

          {socials.tiktok && (
            <a
              className="cp-social-card cp-social-tiktok"
              href={socials.tiktok}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>TikTok</span>
              <small>Ver perfil</small>
            </a>
          )}

          {socials.x && (
            <a
              className="cp-social-card cp-social-x"
              href={socials.x}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>X</span>
              <small>Ver perfil</small>
            </a>
          )}

          {!socials.instagram && !socials.tiktok && !socials.x && (
            <p className="cp-muted">Sin redes sociales registradas.</p>
          )}
        </div>
      </section>

      {/* DASHBOARD */}
      <section className="cp-section cp-dashboard">
        <h2 className="cp-section-title">Dashboard de rendimiento</h2>

        <div className="cp-stats-grid">
          <StatCard label="Seguidores"         value={followers}   accent />
          <StatCard label="Engagement"         value={engagement}  unit="%" />
          <StatCard label="Likes prom."        value={avgLikes} />
          <StatCard label="Comentarios prom."  value={avgComments} />
          <StatCard label="Alcance estimado"   value={reach} />
        </div>

        <div className="cp-platforms-card">
          <h3 className="cp-platforms-title">Distribución por plataforma</h3>

          {platforms.length > 0 ? (
            platforms.map((p) => (
              <PlatformBar key={p.name} name={p.name} value={p.value} />
            ))
          ) : (
            <p className="cp-muted">No hay plataformas registradas.</p>
          )}
        </div>
      </section>

    </div>
  );
}