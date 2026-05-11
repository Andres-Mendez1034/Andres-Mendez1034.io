import React, { useState, useEffect } from "react";

export default function CreatorProfileForm({
  initialData = {},
  onSubmit,
  loading = false
}) {
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
    collaboration_type: "",
    ...initialData
  });

  useEffect(() => {
    if (initialData) {
      setForm(prev => ({
        ...prev,
        ...initialData
      }));
    }
  }, [initialData]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
  };

  return (
    <form className="creator-profile-form" onSubmit={handleSubmit}>

      <input
        name="full_name"
        placeholder="Nombre completo"
        value={form.full_name}
        onChange={handleChange}
        required
      />

      <input
        name="age"
        type="number"
        placeholder="Edad"
        value={form.age}
        onChange={handleChange}
      />

      <select
        name="gender"
        value={form.gender}
        onChange={handleChange}
      >
        <option value="">Género</option>
        <option value="male">Hombre</option>
        <option value="female">Mujer</option>
        <option value="other">Otro</option>
      </select>

      <textarea
        name="bio"
        placeholder="Bio"
        value={form.bio}
        onChange={handleChange}
      />

      <input
        name="location"
        placeholder="Ciudad"
        value={form.location}
        onChange={handleChange}
      />

      <input
        name="niche"
        placeholder="Nicho (fitness, gaming...)"
        value={form.niche}
        onChange={handleChange}
      />

      <input
        name="tiktok_url"
        placeholder="TikTok"
        value={form.tiktok_url}
        onChange={handleChange}
      />

      <input
        name="instagram_url"
        placeholder="Instagram"
        value={form.instagram_url}
        onChange={handleChange}
      />

      <input
        name="twitter_url"
        placeholder="Twitter"
        value={form.twitter_url}
        onChange={handleChange}
      />

      <select
        name="collaboration_type"
        value={form.collaboration_type}
        onChange={handleChange}
      >
        <option value="">Tipo de colaboración</option>
        <option value="ads">Ads</option>
        <option value="ugc">UGC</option>
        <option value="brand_deals">Brand Deals</option>
        <option value="all">Todas</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Guardando..." : "Guardar perfil"}
      </button>

    </form>
  );
}