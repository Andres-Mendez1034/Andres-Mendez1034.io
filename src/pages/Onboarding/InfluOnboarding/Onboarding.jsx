import { useState } from "react";
import "./Onboarding.css";

export default function OnboardingPage() {
  const [form, setForm] = useState({
    fullName: "",
    idNumber: "",
    category: "",
    tags: [],
    location: "",
  });

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
      return {
        ...prev,
        tags: exists
          ? prev.tags.filter((t) => t !== tag)
          : [...prev.tags, tag],
      };
    });
  };

  const handleSubmit = () => {
    console.log("ONBOARDING DATA:", form);
  };

  return (
    <div className="onboarding">
      <h2>Completa tu perfil</h2>

      {/* 🔹 DATOS PERSONALES */}
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

      {/* 🔹 CATEGORÍA */}
      <section className="block">
        <h3>¿A qué te dedicas?</h3>

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        >
          <option value="">Selecciona una opción</option>
          <option value="influencer">Influencer</option>
          <option value="marca">Marca</option>
          <option value="agencia">Agencia</option>
          <option value="negocio">Negocio local</option>
        </select>
      </section>

      {/* 🔹 INTERESES / PAUTA */}
      <section className="block">
        <h3>¿Dónde quieres pautar?</h3>
        <p>Selecciona los tipos de negocio</p>

        <div className="tags">
          {categories.map((tag) => (
            <label key={tag} className="tag">
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

      {/* 🔹 LOCALIDAD */}
      <section className="block">
        <h3>Selecciona tu localidad</h3>

        <div className="locations">
          {locations.map((loc) => (
            <label key={loc} className="tag">
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
        </div>
      </section>

      {/* 🔹 SUBMIT */}
      <button className="submit-btn" onClick={handleSubmit}>
        Finalizar
      </button>
    </div>
  );
}