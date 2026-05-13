import { useState, useContext, useEffect } from "react";
import "./ClientOnboarding.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";

export default function ClientOnboarding() {
  const { user, updateUser } = useContext(AuthContext);

  /* =========================================================
     🔁 PRELOAD (modo edición si ya existe perfil)
  ========================================================= */
  const [form, setForm] = useState({
    businessName: "",
    ownerName: "",
    businessType: "",
    location: "",
    awareness: "",
    goal: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        businessName: user.businessName || "",
        ownerName: user.ownerName || "",
        businessType: user.businessType || "",
        location: user.location || "",
        awareness: user.awareness || "",
        goal: user.goal || "",
      });
    }
  }, [user]);

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

  /* =========================================================
     SUBMIT (CREAR + EDITAR + SYNC GLOBAL)
  ========================================================= */
  const handleSubmit = async () => {
    try {
      const payload = {
        user_id: user?.id,
        business_name: form.businessName,
        owner_name: form.ownerName,
        business_type: form.businessType,
        location: form.location,
        awareness_level: form.awareness,
        main_goal: form.goal,
      };

      const { data } = await axios.post(
        "http://localhost:3000/api/profiles/client",
        payload
      );

      // 🔥 sincronizar con contexto global
      updateUser({
        businessName: form.businessName,
        ownerName: form.ownerName,
        businessType: form.businessType,
        location: form.location,
        awareness: form.awareness,
        goal: form.goal,
        profileCompleted: true,
      });

      alert("Perfil de cliente guardado correctamente");

      return data;

    } catch (err) {
      console.error("CLIENT ONBOARDING ERROR:", err);
      alert("Error al guardar perfil de cliente");
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding">

        <h2>
          {user?.profileCompleted
            ? "Editar configuración del negocio"
            : "Configura tu negocio"}
        </h2>

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

        {/* AWARENESS */}
        <section className="block">
          <h3>¿Cuánta gente conoce tu negocio?</h3>

          {awarenessLevels.map((level) => (
            <label key={level}>
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
            <label key={g}>
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
          {user?.profileCompleted ? "Guardar cambios" : "Finalizar configuración"}
        </button>

      </div>
    </div>
  );
}