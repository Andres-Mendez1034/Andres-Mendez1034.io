import { useState, useContext, useEffect } from "react";
import "./Onboarding.css";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

export default function OnboardingPage() {
  const { user, updateUser } = useContext(AuthContext);

  /* =========================================================
     🔁 FORM STATE (modo creación / edición)
  ========================================================= */
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    tiktokUrl: "",
    tags: [],
    location: "",
  });

  /* =========================================================
     🔁 CARGAR DATOS EXISTENTES (EDICIÓN REAL)
  ========================================================= */
  useEffect(() => {
    if (user?.role !== "influencer") return;

    setForm({
      fullName: user?.fullName || "",
      idNumber: user?.idNumber || "",
      tiktokUrl: user?.tiktokUrl || "",
      tags: user?.tags || [],
      location: user?.location || "",
    });
  }, [user]);

  const categories = [
    "Comida",
    "Gaming",
    "Tech",
    "Tiendas de barrio",
    "Moda",
    "Fitness",
    "Restaurantes",
    "Servicios locales",
  ];

  const locations = ["Suba", "Kennedy", "Engativá", "Chapinero"];

  /* =========================================================
     TAGS TOGGLE
  ========================================================= */
  const handleTagToggle = (tag) => {
    setForm((prev) => {
      const exists = prev.tags.includes(tag);

      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      };
    });
  };

  /* =========================================================
     SUBMIT (BACKEND + SYNC GLOBAL USER)
  ========================================================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        user_id: user?.id,
        full_name: form.fullName,
        id_number: form.idNumber,
        location: form.location,
        tiktok_url: form.tiktokUrl,
        tags: form.tags,
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/profiles/influencer",
        payload
      );

      /* =========================================================
         🔥 SINCRONIZAR USER GLOBAL (CLAVE DEL SISTEMA)
      ========================================================= */
      updateUser({
        fullName: form.fullName,
        idNumber: form.idNumber,
        tiktokUrl: form.tiktokUrl,
        location: form.location,
        tags: form.tags,
        profileCompleted: true,
      });

      alert("Perfil de influencer guardado correctamente");

      return data;

    } catch (err) {
      console.error("ERROR ONBOARDING:", err);
      alert("Error al guardar perfil");
    }
  };

  return (
    <div className="onboarding">
      <h2>
        {user?.profileCompleted
          ? "Editar perfil de Influencer"
          : "Completa tu perfil de Influencer"}
      </h2>

      {/* ---------------- PERSONAL ---------------- */}
      <section className="block">
        <h3>Datos personales</h3>

        <input
          type="text"
          placeholder="Nombre completo"
          value={form.fullName}
          onChange={(e) =>
            setForm({ ...form, fullName: e.target.value })
          }
        />

        <input
          type="text"
          placeholder="Cédula"
          value={form.idNumber}
          onChange={(e) =>
            setForm({ ...form, idNumber: e.target.value })
          }
        />
      </section>

      {/* ---------------- TIKTOK ---------------- */}
      <section className="block">
        <h3>TikTok principal</h3>

        <input
          type="url"
          placeholder="https://www.tiktok.com/@usuario"
          value={form.tiktokUrl}
          onChange={(e) =>
            setForm({ ...form, tiktokUrl: e.target.value })
          }
        />
      </section>

      {/* ---------------- TAGS ---------------- */}
      <section className="block">
        <h3>¿En qué te enfocas?</h3>

        <div className="tags">
          {categories.map((tag) => (
            <label key={tag}>
              <input
                type="checkbox"
                checked={form.tags.includes(tag)}
                onChange={() => handleTagToggle(tag)}
              />
              {tag}
            </label>
          ))}
        </div>
      </section>

      {/* ---------------- LOCATION ---------------- */}
      <section className="block">
        <h3>Localidad</h3>

        {locations.map((loc) => (
          <label key={loc}>
            <input
              type="radio"
              name="location"
              value={loc}
              checked={form.location === loc}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
            {loc}
          </label>
        ))}
      </section>

      {/* ---------------- SUBMIT ---------------- */}
      <button onClick={handleSubmit}>
        {user?.profileCompleted ? "Guardar cambios" : "Finalizar"}
      </button>
    </div>
  );
}