import React, { useState } from "react";
import "./CreatorOnboarding.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { createCreatorProfile } from "../../../services/influencer.service";

export default function CreatorOnboarding() {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [form, setForm] = useState({
    full_name: "",
    age: "",
    gender: "",
    bio: "",
    location: "",
    niche: "",
    tiktok_url: "",
    instagram_url: "",
    twitter_url: "",
    image: null,
    collaboration_type: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     HANDLE INPUTS
  ========================================================= */
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFile = (e) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files?.[0] || null
    }));
  };

  /* =========================================================
     SUBMIT (FIX REAL DEL BUG)
  ========================================================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setError("Usuario no autenticado");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("user_id", user.id);
      formData.append("full_name", form.full_name);
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      formData.append("bio", form.bio);
      formData.append("location", form.location);
      formData.append("niche", form.niche);
      formData.append("tiktok_url", form.tiktok_url);
      formData.append("instagram_url", form.instagram_url);
      formData.append("twitter_url", form.twitter_url);
      formData.append("collaboration_type", form.collaboration_type);

      if (form.image) {
        formData.append("image", form.image);
      }

      /* =========================================================
         🔥 CREAR PERFIL
      ========================================================= */
      await createCreatorProfile(formData);

      /* =========================================================
         🔥 CRÍTICO: ACTUALIZAR USER EN FRONTEND
         (ESTO ERA EL BUG PRINCIPAL)
      ========================================================= */
      await refreshUser();

      /* =========================================================
         🔥 REDIRECCIÓN LIMPIA
      ========================================================= */
      navigate("/marketplace");

    } catch (err) {
      console.error(err);
      setError(err.message || "Error creando perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="creator-onboarding">

      <h1>Completa tu perfil de creador</h1>

      <form onSubmit={handleSubmit} className="creator-form">

        <input
          name="full_name"
          placeholder="Nombre completo"
          onChange={handleChange}
          required
        />

        <input
          name="age"
          type="number"
          placeholder="Edad"
          onChange={handleChange}
          required
        />

        <select name="gender" onChange={handleChange} required>
          <option value="">Género</option>
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
          <option value="other">Otro</option>
        </select>

        <textarea
          name="bio"
          placeholder="Describe quién eres..."
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder="Ciudad"
          onChange={handleChange}
        />

        <input
          name="niche"
          placeholder="Nicho (fitness, gaming, etc)"
          onChange={handleChange}
          required
        />

        <input
          name="tiktok_url"
          placeholder="TikTok URL"
          onChange={handleChange}
        />

        <input
          name="instagram_url"
          placeholder="Instagram URL"
          onChange={handleChange}
        />

        <input
          name="twitter_url"
          placeholder="Twitter URL"
          onChange={handleChange}
        />

        <select name="collaboration_type" onChange={handleChange}>
          <option value="">Tipo de colaboración</option>
          <option value="ads">Publicidad</option>
          <option value="ugc">UGC</option>
          <option value="brand_deals">Brand Deals</option>
          <option value="all">Todas</option>
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
        />

        {error && <p className="error">{error}</p>}

        <button disabled={loading}>
          {loading ? "Guardando..." : "Crear perfil"}
        </button>

      </form>
    </div>
  );
}