import { useState } from "react";
import "./ClientOnboarding.css";

export default function ClientOnboarding() {
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    businessType: "",
    location: "",
    awareness: "",
    goal: "",
  });

  const locations = ["Suba", "Kennedy", "Engativá", "Chapinero"];

  const awarenessLevels = [
    "Muy poca gente nos conoce",
    "Algunos clientes frecuentes",
    "Tenemos clientela estable",
    "Somos conocidos en el barrio",
    "Marca bastante reconocida",
  ];

  const businessTypes = [
    "Restaurante",
    "Tienda de barrio",
    "Barbería",
    "Ropa / Moda",
    "Tecnología",
    "Servicios",
    "Otro",
  ];

  const goals = [
    "Conseguir más clientes",
    "Aumentar ventas",
    "Hacerme conocido",
    "Lanzar un nuevo producto",
    "Promociones y descuentos",
  ];

  const handleSubmit = () => {
    console.log("CLIENT ONBOARDING DATA:", form);
  };

  return (
    <div className="onboarding-page">
      
      <div className="onboarding">
        <h2>Configura tu negocio</h2>

        {/* DATOS */}
        <section className="block">
          <h3>Datos del negocio</h3>

          <input
            type="text"
            placeholder="Nombre del negocio"
            value={form.businessName}
            onChange={(e) =>
              setForm({ ...form, businessName: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Nombre del dueño"
            value={form.ownerName}
            onChange={(e) =>
              setForm({ ...form, ownerName: e.target.value })
            }
          />
        </section>

        {/* TIPO */}
        <section className="block">
          <h3>Tipo de negocio</h3>

          <select
            value={form.businessType}
            onChange={(e) =>
              setForm({ ...form, businessType: e.target.value })
            }
          >
            <option value="">Selecciona una opción</option>
            {businessTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </section>

        {/* UBICACIÓN */}
        <section className="block">
          <h3>Ubicación</h3>

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
        </section>

        {/* AWARENESS */}
        <section className="block">
          <h3>¿Cuánta gente conoce tu negocio?</h3>

          {awarenessLevels.map((level) => (
            <label key={level} className="tag">
              <input
                type="radio"
                name="awareness"
                value={level}
                checked={form.awareness === level}
                onChange={(e) =>
                  setForm({ ...form, awareness: e.target.value })
                }
              />
              {level}
            </label>
          ))}
        </section>

        {/* GOAL */}
        <section className="block">
          <h3>¿Qué quieres lograr?</h3>

          {goals.map((g) => (
            <label key={g} className="tag">
              <input
                type="radio"
                name="goal"
                value={g}
                checked={form.goal === g}
                onChange={(e) =>
                  setForm({ ...form, goal: e.target.value })
                }
              />
              {g}
            </label>
          ))}
        </section>

        {/* SUBMIT */}
        <button className="submit-btn" onClick={handleSubmit}>
          Finalizar configuración
        </button>
      </div>
    </div>
  );
}