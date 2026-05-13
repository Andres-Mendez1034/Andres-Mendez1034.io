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
    main_category: "",       // ← era niche
    tiktok_url: "",
    instagram_url: "",
    youtube_url: "",         // ← era twitter_url
    profile_image: null,     // ← era image
    collaboration_goal: "",  // ← era collaboration_type
    followers: "",
    engagement_rate: "",
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, profile_image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) { setError("Usuario no autenticado"); return; }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("user_id",           user.id);
      formData.append("full_name",         form.full_name);
      formData.append("age",               form.age);
      formData.append("gender",            form.gender);
      formData.append("bio",               form.bio);
      formData.append("location",          form.location);
      formData.append("main_category",     form.main_category);
      formData.append("collaboration_goal",form.collaboration_goal);
      formData.append("tiktok_url",        form.tiktok_url);
      formData.append("instagram_url",     form.instagram_url);
      formData.append("youtube_url",       form.youtube_url);
      formData.append("followers",         form.followers || "0");
      formData.append("engagement_rate",   form.engagement_rate || "0");

      if (form.profile_image) {
        formData.append("profile_image", form.profile_image);
      }

      await createCreatorProfile(formData);
      await refreshUser();
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

        <select name="location" onChange={handleChange} required>
          <option value="">Localidad</option>
          <option value="Suba">Suba</option>
          <option value="Kennedy">Kennedy</option>
          <option value="Engativá">Engativá</option>
          <option value="Chapinero">Chapinero</option>
        </select>

        <select name="main_category" onChange={handleChange} required>
          <option value="">Categoría</option>
          <option value="humor">Humor</option>
          <option value="gaming">Gaming</option>
          <option value="fitness">Fitness</option>
          <option value="politica">Política</option>
          <option value="lifestyle">Lifestyle</option>
          <option value="beauty">Beauty</option>
        </select>

        <select name="collaboration_goal" onChange={handleChange}>
          <option value="">Tipo de colaboración</option>
          <option value="ads">Publicidad</option>
          <option value="ugc">UGC</option>
          <option value="brand_deals">Brand Deals</option>
          <option value="all">Todas</option>
        </select>

        <input
          name="followers"
          type="number"
          placeholder="Número de seguidores"
          onChange={handleChange}
        />

        <input
          name="engagement_rate"
          type="number"
          step="0.01"
          placeholder="Engagement rate (ej: 3.5)"
          onChange={handleChange}
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
          name="youtube_url"
          placeholder="YouTube URL"
          onChange={handleChange}
        />

        <input type="file" accept="image/*" onChange={handleFile} />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={{
              width: 120,
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        )}

        {error && <p className="error">{error}</p>}

        <button disabled={loading}>
          {loading ? "Guardando..." : "Crear perfil"}
        </button>

      </form>
    </div>
  );
}