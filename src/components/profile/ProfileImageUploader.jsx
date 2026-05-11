import React, { useState } from "react";

export default function ProfileImageUploader({ onFileChange, previewUrl }) {
  const [preview, setPreview] = useState(previewUrl || null);

  const handleChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // preview local
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // enviar al padre
    if (onFileChange) {
      onFileChange(file);
    }
  };

  return (
    <div className="image-uploader">

      <label className="upload-box">
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          hidden
        />

        {!preview ? (
          <div className="placeholder">
            📸 Subir foto de perfil
          </div>
        ) : (
          <img
            src={preview}
            alt="preview"
            className="preview-image"
          />
        )}
      </label>

    </div>
  );
}