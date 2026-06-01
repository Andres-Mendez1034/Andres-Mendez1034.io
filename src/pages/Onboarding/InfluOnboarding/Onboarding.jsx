import { useState, useContext, useEffect, useRef } from "react";
import "./Onboarding.css";
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ─── Leaflet se carga dinámicamente para evitar SSR issues ───────────────────
let L = null;

const BOGOTA_CENTER = [-4.7110, -74.0721];

const LOCALIDADES = [
  { name: "Usaquén",       coords: [-4.6918, -74.0310] },
  { name: "Chapinero",     coords: [-4.6486, -74.0560] },
  { name: "Santa Fe",      coords: [-4.5970, -74.0760] },
  { name: "San Cristóbal", coords: [-4.5700, -74.0850] },
  { name: "Usme",          coords: [-4.5090, -74.1090] },
  { name: "Tunjuelito",    coords: [-4.5750, -74.1220] },
  { name: "Bosa",          coords: [-4.6320, -74.1870] },
  { name: "Kennedy",       coords: [-4.6280, -74.1500] },
  { name: "Fontibón",      coords: [-4.6730, -74.1460] },
  { name: "Engativá",      coords: [-4.6980, -74.1180] },
  { name: "Suba",          coords: [-4.7420, -74.0840] },
  { name: "Barrios Unidos",coords: [-4.6640, -74.0850] },
  { name: "Teusaquillo",   coords: [-4.6350, -74.0900] },
  { name: "Los Mártires",  coords: [-4.6070, -74.0970] },
  { name: "Antonio Nariño",coords: [-4.5840, -74.1000] },
  { name: "Puente Aranda", coords: [-4.6250, -74.1250] },
  { name: "La Candelaria", coords: [-4.5980, -74.0730] },
  { name: "Rafael Uribe",  coords: [-4.5560, -74.1050] },
  { name: "Ciudad Bolívar",coords: [-4.5220, -74.1620] },
  { name: "Sumapaz",       coords: [-4.3500, -74.3500] },
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

const CATEGORIES = [
  "Comida", "Gaming", "Tech", "Tiendas de barrio",
  "Moda", "Fitness", "Restaurantes", "Servicios locales",
  "Humor", "Lifestyle", "Beauty", "Política",
];

const COLLAB_GOALS = [
  { value: "ads",         label: "Publicidad" },
  { value: "ugc",         label: "UGC" },
  { value: "brand_deals", label: "Brand Deals" },
  { value: "all",         label: "Todas" },
];

const STEPS = ["Identidad", "Redes", "Perfil público", "Ubicación"];

// ─── Componente del mapa ─────────────────────────────────────────────────────
function LocationMap({ onLocationChange }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [localidad, setLocalidad] = useState("");
  const [coords, setCoords] = useState(null);
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    // Carga Leaflet dinámicamente
    if (window.L) {
      L = window.L;
      setLeafletReady(true);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => { L = window.L; setLeafletReady(true); };
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: BOGOTA_CENTER,
      zoom: 11,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    // Icono personalizado
    const icon = L.divIcon({
      className: "",
      html: `<div class="map-pin"><div class="map-pin-dot"></div></div>`,
      iconSize: [32, 40],
      iconAnchor: [16, 40],
    });

    const marker = L.marker(BOGOTA_CENTER, { draggable: true, icon }).addTo(map);
    markerRef.current = marker;

    const updateLocation = (lat, lng) => {
      const loc = getNearestLocalidad(lat, lng);
      setLocalidad(loc);
      setCoords({ lat, lng });
      onLocationChange({ location: loc, lat, lng });
    };

    marker.on("dragend", (e) => {
      const { lat, lng } = e.target.getLatLng();
      updateLocation(lat, lng);
    });

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      updateLocation(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletReady]);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} className="map-container" />
      {!leafletReady && (
        <div className="map-loading">
          <div className="spinner" />
          <span>Cargando mapa...</span>
        </div>
      )}
      <div className={`map-result ${localidad ? "map-result--active" : ""}`}>
        {localidad ? (
          <>
            <span className="map-result-icon">📍</span>
            <div>
              <strong>{localidad}</strong>
              {coords && (
                <span className="map-coords">
                  {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                </span>
              )}
            </div>
          </>
        ) : (
          <span className="map-hint">Haz clic en el mapa o arrastra el pin para seleccionar tu localidad</span>
        )}
      </div>
    </div>
  );
}

// ─── Onboarding principal ────────────────────────────────────────────────────
export default function OnboardingPage() {
  const { user, updateUser } = useContext(AuthContext) || {};
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    // Step 0 — Identidad (influencer_profiles)
    fullName:   "",
    idNumber:   "",
    tags:       [],

    // Step 1 — Redes sociales
    tiktokUrl:    "",
    instagramUrl: "",
    youtubeUrl:   "",

    // Step 2 — Perfil público (creator_profiles)
    age:               "",
    gender:            "",
    bio:               "",
    mainCategory:      "",
    collaborationGoal: "",
    followers:         "",
    engagementRate:    "",
    profileImage:      null,

    // Step 3 — Ubicación
    location: "",
    lat:      null,
    lng:      null,
  });

  useEffect(() => {
    if (!user) return;
    setForm(prev => ({
      ...prev,
      fullName: user.fullName || "",
    }));
  }, [user]);

  const set = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleTagToggle = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, profileImage: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleLocationChange = ({ location, lat, lng }) => {
    setForm(prev => ({ ...prev, location, lat, lng }));
  };

  // Validaciones por paso
  const validateStep = () => {
    setError("");
    if (step === 0) {
      if (!form.fullName.trim()) return setError("El nombre es requerido"), false;
      if (!form.idNumber.trim()) return setError("La cédula es requerida"), false;
    }
    if (step === 2) {
      if (!form.mainCategory) return setError("Selecciona una categoría"), false;
    }
    if (step === 3) {
      if (!form.location) return setError("Selecciona tu ubicación en el mapa"), false;
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep(s => s + 1);
  };

  const prevStep = () => {
    setError("");
    setStep(s => s - 1);
  };

  // ── Submit final ────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validateStep()) return;
    if (!user?.id) return setError("Usuario no autenticado");

    setLoading(true);
    setError("");

    try {
      const userId = Number(user.id || user.user_id);

      // 1️⃣ influencer_profiles
      await axios.post("http://localhost:3000/api/profiles/influencer", {
        user_id:    userId,
        full_name:  form.fullName.trim(),
        id_number:  form.idNumber.trim(),
        location:   form.location,
        lat:        form.lat,
        lng:        form.lng,
        tiktok_url: form.tiktokUrl.trim() || null,
        tags:       form.tags,
        category:   form.tags[0] || "general",
      });

      // 2️⃣ creator_profiles + influencer_services
      const formData = new FormData();
      formData.append("user_id",            userId);
      formData.append("full_name",          form.fullName.trim());
      formData.append("age",                form.age || "");
      formData.append("gender",             form.gender || "");
      formData.append("bio",                form.bio || "");
      formData.append("location",           form.location);
      formData.append("main_category",      form.mainCategory || form.tags[0] || "general");
      formData.append("collaboration_goal", form.collaborationGoal || "");
      formData.append("tiktok_url",         form.tiktokUrl || "");
      formData.append("instagram_url",      form.instagramUrl || "");
      formData.append("youtube_url",        form.youtubeUrl || "");
      formData.append("followers",          form.followers || "0");
      formData.append("engagement_rate",    form.engagementRate || "0");
      if (form.profileImage) {
        formData.append("profile_image", form.profileImage);
      }

      await axios.post("http://localhost:3000/api/profiles/creator", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3️⃣ Actualizar contexto global
      if (typeof updateUser === "function") {
        updateUser({
          ...user,
          fullName:        form.fullName,
          location:        form.location,
          profileCompleted: true,
        });
      }

      navigate("/marketplace");

    } catch (err) {
      console.error("ONBOARDING ERROR:", err?.response?.data || err);
      setError(err?.response?.data?.error || "Error al guardar perfil. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render pasos ────────────────────────────────────────────────────────────
  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="ob-step">
            <div className="ob-step-header">
              <span className="ob-step-emoji">👤</span>
              <h2>Datos de identidad</h2>
              <p>Esta información es privada y solo se usa para verificar tu cuenta.</p>
            </div>

            <div className="ob-field">
              <label>Nombre completo</label>
              <input
                type="text"
                placeholder="Ej: María García"
                value={form.fullName}
                onChange={set("fullName")}
              />
            </div>

            <div className="ob-field">
              <label>Número de cédula</label>
              <input
                type="text"
                placeholder="Ej: 1020304050"
                value={form.idNumber}
                onChange={set("idNumber")}
              />
            </div>

            <div className="ob-field">
              <label>Categorías de contenido <span className="ob-optional">(opcional)</span></label>
              <div className="ob-tags">
                {CATEGORIES.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    className={`ob-tag ${form.tags.includes(tag) ? "ob-tag--active" : ""}`}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="ob-step">
            <div className="ob-step-header">
              <span className="ob-step-emoji">🔗</span>
              <h2>Tus redes sociales</h2>
              <p>Conecta tus plataformas para que las marcas puedan encontrarte.</p>
            </div>

            <div className="ob-field">
              <label>TikTok</label>
              <div className="ob-input-prefix">
                <span>tiktok.com/@</span>
                <input
                  type="text"
                  placeholder="usuario"
                  value={form.tiktokUrl.replace("https://www.tiktok.com/@", "")}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      tiktokUrl: e.target.value
                        ? `https://www.tiktok.com/@${e.target.value}`
                        : "",
                    }))
                  }
                />
              </div>
            </div>

            <div className="ob-field">
              <label>Instagram</label>
              <div className="ob-input-prefix">
                <span>instagram.com/</span>
                <input
                  type="text"
                  placeholder="usuario"
                  value={form.instagramUrl.replace("https://www.instagram.com/", "")}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      instagramUrl: e.target.value
                        ? `https://www.instagram.com/${e.target.value}`
                        : "",
                    }))
                  }
                />
              </div>
            </div>

            <div className="ob-field">
              <label>YouTube</label>
              <div className="ob-input-prefix">
                <span>youtube.com/</span>
                <input
                  type="text"
                  placeholder="@canal o /c/canal"
                  value={form.youtubeUrl.replace("https://www.youtube.com/", "")}
                  onChange={e =>
                    setForm(prev => ({
                      ...prev,
                      youtubeUrl: e.target.value
                        ? `https://www.youtube.com/${e.target.value}`
                        : "",
                    }))
                  }
                />
              </div>
            </div>

            <div className="ob-row">
              <div className="ob-field">
                <label>Seguidores (total)</label>
                <input
                  type="number"
                  placeholder="Ej: 15000"
                  value={form.followers}
                  onChange={set("followers")}
                />
              </div>
              <div className="ob-field">
                <label>Engagement rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 3.5"
                  value={form.engagementRate}
                  onChange={set("engagementRate")}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="ob-step">
            <div className="ob-step-header">
              <span className="ob-step-emoji">🏷️</span>
              <h2>Tu perfil público</h2>
              <p>Esta info aparecerá en el marketplace para que las marcas te elijan.</p>
            </div>

            <div className="ob-field ob-field--image">
              <label>Foto de perfil</label>
              <div className="ob-image-picker">
                {preview ? (
                  <img src={preview} alt="preview" className="ob-preview" />
                ) : (
                  <div className="ob-image-placeholder">
                    <span>📷</span>
                  </div>
                )}
                <label className="ob-image-btn">
                  {preview ? "Cambiar foto" : "Subir foto"}
                  <input type="file" accept="image/*" onChange={handleFile} hidden />
                </label>
              </div>
            </div>

            <div className="ob-row">
              <div className="ob-field">
                <label>Edad</label>
                <input
                  type="number"
                  placeholder="Ej: 24"
                  value={form.age}
                  onChange={set("age")}
                />
              </div>
              <div className="ob-field">
                <label>Género</label>
                <select value={form.gender} onChange={set("gender")}>
                  <option value="">Seleccionar</option>
                  <option value="male">Hombre</option>
                  <option value="female">Mujer</option>
                  <option value="other">Otro / Prefiero no decir</option>
                </select>
              </div>
            </div>

            <div className="ob-field">
              <label>Bio</label>
              <textarea
                rows={3}
                placeholder="Cuéntale a las marcas quién eres y qué haces..."
                value={form.bio}
                onChange={set("bio")}
              />
            </div>

            <div className="ob-row">
              <div className="ob-field">
                <label>Categoría principal <span className="ob-required">*</span></label>
                <select value={form.mainCategory} onChange={set("mainCategory")}>
                  <option value="">Seleccionar</option>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c.toLowerCase()}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="ob-field">
                <label>Tipo de colaboración</label>
                <select value={form.collaborationGoal} onChange={set("collaborationGoal")}>
                  <option value="">Seleccionar</option>
                  {COLLAB_GOALS.map(g => (
                    <option key={g.value} value={g.value}>{g.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="ob-step">
            <div className="ob-step-header">
              <span className="ob-step-emoji">🗺️</span>
              <h2>Tu ubicación en Bogotá</h2>
              <p>Haz clic en el mapa o arrastra el pin a tu localidad. Esto ayuda a las marcas a encontrarte.</p>
            </div>

            <LocationMap onLocationChange={handleLocationChange} />

            {form.location && (
              <div className="ob-location-confirm">
                ✅ Localidad seleccionada: <strong>{form.location}</strong>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="onboarding-wrap">
      <div className="ob-card">

        {/* Progreso */}
        <div className="ob-progress">
          {STEPS.map((label, i) => (
            <div key={i} className={`ob-progress-step ${i <= step ? "ob-progress-step--done" : ""}`}>
              <div className="ob-progress-dot">
                {i < step ? "✓" : i + 1}
              </div>
              <span>{label}</span>
            </div>
          ))}
          <div
            className="ob-progress-bar"
            style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Contenido */}
        <div className="ob-content">
          {renderStep()}
        </div>

        {/* Error */}
        {error && (
          <div className="ob-error">
            ⚠️ {error}
          </div>
        )}

        {/* Navegación */}
        <div className="ob-nav">
          {step > 0 && (
            <button className="ob-btn ob-btn--back" onClick={prevStep} disabled={loading}>
              ← Atrás
            </button>
          )}
          <div className="ob-nav-spacer" />
          {isLastStep ? (
            <button
              className="ob-btn ob-btn--submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <><span className="ob-spinner" /> Guardando...</>
              ) : (
                "Finalizar y entrar al marketplace 🚀"
              )}
            </button>
          ) : (
            <button className="ob-btn ob-btn--next" onClick={nextStep}>
              Siguiente →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}