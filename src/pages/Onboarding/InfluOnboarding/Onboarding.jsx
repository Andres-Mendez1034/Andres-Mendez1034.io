import { useState, useContext, useEffect } from "react";
import "./Onboarding.css";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";

export default function OnboardingPage() {
  const { user, updateUser } = useContext(AuthContext) || {};

  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    tiktokUrl: "",
    tags: [],
    location: "",
  });

  useEffect(() => {
    console.log("👤 USER EN CONTEXT:", user);

    if (!user) return;

    const initialForm = {
      fullName: user?.fullName || "",
      idNumber: user?.idNumber || "",
      tiktokUrl: user?.tiktokUrl || "",
      tags: user?.tags || [],
      location: user?.location || "",
    };

    console.log("📦 FORM INIT:", initialForm);
    setForm(initialForm);
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

  const handleTagToggle = (tag) => {
    setForm((prev) => {
      const exists = prev.tags.includes(tag);

      const updated = {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      };

      console.log("🏷️ TAGS UPDATED:", updated.tags);

      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        user_id: Number(user?.id || user?.user_id),
        full_name: form.fullName?.trim(),
        id_number: form.idNumber?.trim(),
        location: form.location || "Chapinero",
        tiktok_url: form.tiktokUrl?.trim() || null,
        tags: Array.isArray(form.tags) ? form.tags : [],
        category: form.tags?.[0] || "general",
      };

      console.log("🚀 PAYLOAD FINAL:", payload);

      if (!payload.user_id) {
        alert("Usuario no válido");
        return;
      }

      console.log("📡 ENVIANDO REQUEST...");

      const { data } = await axios.post(
        "http://localhost:3000/api/profiles/influencer",
        payload
      );

      console.log("✅ RESPONSE BACKEND:", data);

      // 🔥 FIX CRÍTICO: SOLO SI EXISTE updateUser
      if (typeof updateUser === "function") {
        updateUser({
          ...user,
          fullName: form.fullName,
          idNumber: form.idNumber,
          tiktokUrl: form.tiktokUrl,
          location: form.location,
          tags: form.tags,
          profileCompleted: true,
        });

        console.log("🔄 USER GLOBAL UPDATED");
      } else {
        console.warn("⚠️ updateUser no está disponible en AuthContext");
      }

      alert("Perfil guardado correctamente");

      return data;
    } catch (err) {
      console.error("❌ ERROR ONBOARDING:", err?.response?.data || err);
      alert(err?.response?.data?.error || "Error al guardar perfil");
    }
  };

  return (
    <div className="onboarding">
      <h2>Completa tu perfil de Influencer</h2>

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

      <section className="block">
        <h3>Tags</h3>

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

      <button onClick={handleSubmit}>
        Finalizar
      </button>
    </div>
  );
}