import { useState, useContext, useEffect, useRef } from "react";
import "./ClientOnboarding.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// ─── Leaflet helpers (mismo patrón que el onboarding de influencer) ───────────
const BOGOTA_CENTER = [4.7110, -74.0721];

const LOCALIDADES = [
  { name: "Usaquén",        coords: [4.6918,  -74.0310] },
  { name: "Chapinero",      coords: [4.6486,  -74.0560] },
  { name: "Santa Fe",       coords: [4.5970,  -74.0760] },
  { name: "San Cristóbal",  coords: [4.5700,  -74.0850] },
  { name: "Usme",           coords: [4.5090,  -74.1090] },
  { name: "Tunjuelito",     coords: [4.5750,  -74.1220] },
  { name: "Bosa",           coords: [4.6320,  -74.1870] },
  { name: "Kennedy",        coords: [4.6280,  -74.1500] },
  { name: "Fontibón",       coords: [4.6730,  -74.1460] },
  { name: "Engativá",       coords: [4.6980,  -74.1180] },
  { name: "Suba",           coords: [4.7420,  -74.0840] },
  { name: "Barrios Unidos", coords: [4.6640,  -74.0850] },
  { name: "Teusaquillo",    coords: [4.6350,  -74.0900] },
  { name: "Los Mártires",   coords: [4.6070,  -74.0970] },
  { name: "Antonio Nariño", coords: [4.5840,  -74.1000] },
  { name: "Puente Aranda",  coords: [4.6250,  -74.1250] },
  { name: "La Candelaria",  coords: [4.5980,  -74.0730] },
  { name: "Rafael Uribe",   coords: [4.5560,  -74.1050] },
  { name: "Ciudad Bolívar", coords: [4.5220,  -74.1620] },
  { name: "Sumapaz",        coords: [4.3500,  -74.3500] },
];

function getNearestLocalidad(lat, lng) {
  let nearest = LOCALIDADES[0];
  let minDist = Infinity;
  for (const loc of LOCALIDADES) {
    const d = Math.hypot(lat - loc.coords[0], lng - loc.coords[1]);
    if (d < minDist) { minDist = d; nearest = loc; }
  }
  return nearest.name;
}

// ─── Mapa ────────────────────────────────────────────────────────────────────
function LocationMap({ onLocationChange }) {
  const mapRef         = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef      = useRef(null);
  const [localidad, setLocalidad] = useState("");
  const [coords, setCoords]       = useState(null);
  const [ready, setReady]         = useState(false);

  useEffect(() => {
    if (window.L) { setReady(true); return; }

    const link  = document.createElement("link");
    link.rel    = "stylesheet";
    link.href   = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script    = document.createElement("script");
    script.src      = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload   = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || mapInstanceRef.current) return;

    const L   = window.L;
    const map = L.map(mapRef.current, { center: BOGOTA_CENTER, zoom: 11 });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: `<div class="cl-map-pin"><div class="cl-map-pin-dot"></div></div>`,
      iconSize: [32, 40], iconAnchor: [16, 40],
    });

    const marker = L.marker(BOGOTA_CENTER, { draggable: true, icon }).addTo(map);
    markerRef.current = marker;

    const update = (lat, lng) => {
      const loc = getNearestLocalidad(lat, lng);
      setLocalidad(loc);
      setCoords({ lat, lng });
      onLocationChange({ location: loc, lat, lng });
    };

    marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      update(lat, lng);
    });

    map.on("click", (e) => {
      marker.setLatLng([e.latlng.lat, e.latlng.lng]);
      update(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    return () => { map.remove(); mapInstanceRef.current = null; };
  }, [ready]);

  return (
    <div className="cl-map-wrapper">
      <div ref={mapRef} className="cl-map-container" />
      {!ready && (
        <div className="cl-map-loading">
          <div className="cl-spinner" /> Cargando mapa...
        </div>
      )}
      <div className={`cl-map-result ${localidad ? "cl-map-result--active" : ""}`}>
        {localidad ? (
          <>
            <span>📍</span>
            <div>
              <strong>{localidad}</strong>
              {coords && (
                <span className="cl-map-coords">
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              )}
            </div>
          </>
        ) : (
          <span className="cl-map-hint">Haz clic en el mapa o arrastra el pin para ubicar tu negocio</span>
        )}
      </div>
    </div>
  );
}

// ─── Pasos ───────────────────────────────────────────────────────────────────
const STEPS = ["Tu negocio", "Presencia digital", "Objetivos", "Ubicación"];

const BUSINESS_TYPES = [
  "Restaurante / Comida", "Tienda de barrio", "Barbería / Salón",
  "Ropa / Moda", "Tecnología", "Servicios profesionales",
  "Salud / Bienestar", "Educación", "Entretenimiento", "Otro",
];

const AWARENESS_LEVELS = [
  { value: "muy_poca",   label: "Muy poca gente nos conoce",     desc: "Estamos empezando" },
  { value: "algunos",    label: "Algunos clientes frecuentes",    desc: "Clientela pequeña pero fiel" },
  { value: "estable",    label: "Clientela estable",              desc: "Nos va bien en el barrio" },
  { value: "conocidos",  label: "Somos conocidos en la zona",     desc: "Buena reputación local" },
  { value: "reconocida", label: "Marca bastante reconocida",      desc: "Queremos escalar más" },
];

const GOALS = [
  { value: "mas_clientes",  label: "Conseguir más clientes",       icon: "👥" },
  { value: "aumentar_ventas", label: "Aumentar ventas",            icon: "📈" },
  { value: "reconocimiento", label: "Hacerme conocido",            icon: "⭐" },
  { value: "lanzamiento",   label: "Lanzar un nuevo producto",     icon: "🚀" },
  { value: "promociones",   label: "Promociones y descuentos",     icon: "🏷️" },
  { value: "fidelizar",     label: "Fidelizar clientes actuales",  icon: "❤️" },
];

const BUDGETS = [
  "Menos de $200.000",
  "$200.000 - $500.000",
  "$500.000 - $1.000.000",
  "$1.000.000 - $3.000.000",
  "Más de $3.000.000",
];

// ─── Componente principal ────────────────────────────────────────────────────
export default function ClientOnboarding() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const [form, setForm] = useState({
    // Paso 0 — Negocio
    businessName: "",
    ownerName:    "",
    businessType: "",
    phone:        "",

    // Paso 1 — Presencia digital
    instagramUrl: "",
    tiktokUrl:    "",
    facebookUrl:  "",
    monthlyBudget: "",

    // Paso 2 — Objetivos
    awareness: "",
    goal:      "",

    // Paso 3 — Ubicación
    location: "",
    lat:      null,
    lng:      null,
  });

  useEffect(() => {
    if (!user) return;
    setForm(prev => ({
      ...prev,
      businessName: user.businessName || "",
      ownerName:    user.ownerName    || "",
    }));
  }, [user]);

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleLocationChange = ({ location, lat, lng }) =>
    setForm(prev => ({ ...prev, location, lat, lng }));

  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!form.businessName.trim()) return setError("El nombre del negocio es requerido"), false;
      if (!form.ownerName.trim())    return setError("El nombre del dueño es requerido"), false;
      if (!form.businessType)        return setError("Selecciona el tipo de negocio"), false;
    }
    if (step === 2) {
      if (!form.awareness) return setError("Selecciona el nivel de reconocimiento"), false;
      if (!form.goal)      return setError("Selecciona tu objetivo principal"), false;
    }
    if (step === 3) {
      if (!form.location) return setError("Ubica tu negocio en el mapa"), false;
    }
    return true;
  };

  const nextStep = () => { if (validateStep()) setStep(s => s + 1); };
  const prevStep = () => { setError(""); setStep(s => s - 1); };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!user?.id) return setError("Usuario no autenticado");

    setLoading(true);
    setError("");

    try {
      const payload = {
        user_id:        Number(user.id || user.user_id),
        business_name:  form.businessName.trim(),
        owner_name:     form.ownerName.trim(),
        business_type:  form.businessType,
        phone:          form.phone.trim() || null,
        location:       form.location,
        lat:            form.lat,
        lng:            form.lng,
        awareness_level: form.awareness,
        main_goal:      form.goal,
        monthly_budget: form.monthlyBudget || null,
        instagram_url:  form.instagramUrl  || null,
        tiktok_url:     form.tiktokUrl     || null,
        facebook_url:   form.facebookUrl   || null,
      };

      await axios.post("https://brandconnect.azurewebsites.net/api/profiles/client", payload);

      if (typeof updateUser === "function") {
        updateUser({
          ...user,
          businessName:    form.businessName,
          ownerName:       form.ownerName,
          location:        form.location,
          profileCompleted: true,
        });
      }

      navigate("/marketplace");

    } catch (err) {
      console.error("CLIENT ONBOARDING ERROR:", err?.response?.data || err);
      setError(err?.response?.data?.error || "Error al guardar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render pasos ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="cl-step">
            <div className="cl-step-header">
              <span className="cl-step-emoji">🏪</span>
              <h2>Cuéntanos sobre tu negocio</h2>
              <p>La información básica que necesitamos para conectarte con los influencers correctos.</p>
            </div>

            <div className="cl-field">
              <label>Nombre del negocio <span className="cl-req">*</span></label>
              <input
                type="text"
                placeholder="Ej: Restaurante El Rincón"
                value={form.businessName}
                onChange={set("businessName")}
              />
            </div>

            <div className="cl-field">
              <label>Nombre del dueño / responsable <span className="cl-req">*</span></label>
              <input
                type="text"
                placeholder="Ej: Carlos Martínez"
                value={form.ownerName}
                onChange={set("ownerName")}
              />
            </div>

            <div className="cl-field">
              <label>Tipo de negocio <span className="cl-req">*</span></label>
              <div className="cl-type-grid">
                {BUSINESS_TYPES.map(t => (
                  <button
                    key={t}
                    type="button"
                    className={`cl-type-btn ${form.businessType === t ? "cl-type-btn--active" : ""}`}
                    onClick={() => setForm(prev => ({ ...prev, businessType: t }))}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="cl-field">
              <label>Teléfono / WhatsApp <span className="cl-opt">(opcional)</span></label>
              <div className="cl-input-prefix">
                <span>+57</span>
                <input
                  type="tel"
                  placeholder="300 123 4567"
                  value={form.phone.replace("+57", "")}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    phone: e.target.value ? `+57${e.target.value.replace(/\D/g, "")}` : ""
                  }))}
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="cl-step">
            <div className="cl-step-header">
              <span className="cl-step-emoji">📱</span>
              <h2>Presencia digital y presupuesto</h2>
              <p>Si ya tienes redes, conéctalas. Si no, no hay problema — te ayudamos a crecer.</p>
            </div>

            <div className="cl-field">
              <label>Instagram <span className="cl-opt">(opcional)</span></label>
              <div className="cl-input-prefix">
                <span>instagram.com/</span>
                <input
                  type="text"
                  placeholder="tunegocio"
                  value={form.instagramUrl.replace("https://www.instagram.com/", "")}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    instagramUrl: e.target.value
                      ? `https://www.instagram.com/${e.target.value}`
                      : ""
                  }))}
                />
              </div>
            </div>

            <div className="cl-field">
              <label>TikTok <span className="cl-opt">(opcional)</span></label>
              <div className="cl-input-prefix">
                <span>tiktok.com/@</span>
                <input
                  type="text"
                  placeholder="tunegocio"
                  value={form.tiktokUrl.replace("https://www.tiktok.com/@", "")}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    tiktokUrl: e.target.value
                      ? `https://www.tiktok.com/@${e.target.value}`
                      : ""
                  }))}
                />
              </div>
            </div>

            <div className="cl-field">
              <label>Facebook <span className="cl-opt">(opcional)</span></label>
              <div className="cl-input-prefix">
                <span>facebook.com/</span>
                <input
                  type="text"
                  placeholder="tunegocio"
                  value={form.facebookUrl.replace("https://www.facebook.com/", "")}
                  onChange={e => setForm(prev => ({
                    ...prev,
                    facebookUrl: e.target.value
                      ? `https://www.facebook.com/${e.target.value}`
                      : ""
                  }))}
                />
              </div>
            </div>

            <div className="cl-field">
              <label>Presupuesto mensual para marketing <span className="cl-opt">(opcional)</span></label>
              <div className="cl-budget-grid">
                {BUDGETS.map(b => (
                  <button
                    key={b}
                    type="button"
                    className={`cl-budget-btn ${form.monthlyBudget === b ? "cl-budget-btn--active" : ""}`}
                    onClick={() => setForm(prev => ({ ...prev, monthlyBudget: b }))}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="cl-step">
            <div className="cl-step-header">
              <span className="cl-step-emoji">🎯</span>
              <h2>Objetivos de tu negocio</h2>
              <p>Esto nos ayuda a recomendarte los influencers que mejor se adapten a lo que necesitas.</p>
            </div>

            <div className="cl-field">
              <label>¿Cuánta gente conoce tu negocio hoy? <span className="cl-req">*</span></label>
              <div className="cl-awareness-list">
                {AWARENESS_LEVELS.map(a => (
                  <button
                    key={a.value}
                    type="button"
                    className={`cl-awareness-btn ${form.awareness === a.value ? "cl-awareness-btn--active" : ""}`}
                    onClick={() => setForm(prev => ({ ...prev, awareness: a.value }))}
                  >
                    <span className="cl-awareness-label">{a.label}</span>
                    <span className="cl-awareness-desc">{a.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="cl-field">
              <label>¿Cuál es tu objetivo principal? <span className="cl-req">*</span></label>
              <div className="cl-goals-grid">
                {GOALS.map(g => (
                  <button
                    key={g.value}
                    type="button"
                    className={`cl-goal-btn ${form.goal === g.value ? "cl-goal-btn--active" : ""}`}
                    onClick={() => setForm(prev => ({ ...prev, goal: g.value }))}
                  >
                    <span className="cl-goal-icon">{g.icon}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="cl-step">
            <div className="cl-step-header">
              <span className="cl-step-emoji">📍</span>
              <h2>¿Dónde está tu negocio?</h2>
              <p>Haz clic en el mapa o arrastra el pin a la ubicación de tu local.</p>
            </div>
            <LocationMap onLocationChange={handleLocationChange} />
            {form.location && (
              <div className="cl-location-confirm">
                ✅ Localidad: <strong>{form.location}</strong>
              </div>
            )}
          </div>
        );

      default: return null;
    }
  };

  const isLast = step === STEPS.length - 1;

  return (
    <div className="cl-wrap">
      <div className="cl-card">

        {/* Progreso */}
        <div className="cl-progress">
          {STEPS.map((label, i) => (
            <div key={i} className={`cl-progress-step ${i <= step ? "cl-progress-step--done" : ""}`}>
              <div className="cl-progress-dot">{i < step ? "✓" : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
          <div
            className="cl-progress-bar"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Contenido */}
        <div className="cl-content">{renderStep()}</div>

        {/* Error */}
        {error && <div className="cl-error">⚠️ {error}</div>}

        {/* Nav */}
        <div className="cl-nav">
          {step > 0 && (
            <button className="cl-btn cl-btn--back" onClick={prevStep} disabled={loading}>
              ← Atrás
            </button>
          )}
          <div style={{ flex: 1 }} />
          {isLast ? (
            <button className="cl-btn cl-btn--submit" onClick={handleSubmit} disabled={loading}>
              {loading
                ? <><span className="cl-spin" /> Guardando...</>
                : "Finalizar y buscar influencers 🚀"
              }
            </button>
          ) : (
            <button className="cl-btn cl-btn--next" onClick={nextStep}>
              Siguiente →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}