import React from "react";

export default function SocialLinksInput({ value = {}, onChange }) {
  const handleChange = (e) => {
    const { name, value: val } = e.target;

    if (onChange) {
      onChange({
        ...value,
        [name]: val
      });
    }
  };

  return (
    <div className="social-links-input">

      <h3>Redes sociales</h3>

      <input
        name="tiktok_url"
        placeholder="TikTok URL"
        value={value.tiktok_url || ""}
        onChange={handleChange}
      />

      <input
        name="instagram_url"
        placeholder="Instagram URL"
        value={value.instagram_url || ""}
        onChange={handleChange}
      />

      <input
        name="twitter_url"
        placeholder="Twitter / X URL"
        value={value.twitter_url || ""}
        onChange={handleChange}
      />

      <input
        name="youtube_url"
        placeholder="YouTube URL"
        value={value.youtube_url || ""}
        onChange={handleChange}
      />

    </div>
  );
}