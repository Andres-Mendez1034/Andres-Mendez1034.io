import React, { useState } from "react";
import "./Support.css";

export default function Support() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Aquí luego conectas con tu backend
      // await supportService.sendMessage(form);

      console.log("Mensaje enviado:", form);

      setSuccess(true);
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error(error);
      alert("Hubo un error al enviar el mensaje");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="support-page">
      <h1>Soporte</h1>
      <p>¿Tienes algún problema o duda? Escríbenos y te ayudaremos.</p>

      {success && (
        <p className="support-success">
          ✅ Tu mensaje fue enviado correctamente. Te responderemos pronto.
        </p>
      )}

      <form className="support-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div className="form-group">
          <label>Mensaje</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Describe tu problema..."
            rows="5"
            required
          />
        </div>

        <button type="submit" className="support-btn" disabled={loading}>
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}