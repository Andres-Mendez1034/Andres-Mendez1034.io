import React from "react";
import "./Cookies.css";

export default function Cookies() {
  return (
    <div className="cookies-page">
      <h1>Política de Cookies</h1>
      <p>
        En Brand Connect usamos cookies para mejorar tu experiencia en el sitio, 
        analizar el tráfico y personalizar contenido. Al navegar, aceptas nuestro uso de cookies.
      </p>

      <h2>Tipos de cookies que usamos</h2>
      <ul>
        <li><strong>Cookies necesarias:</strong> esenciales para el funcionamiento del sitio.</li>
        <li><strong>Cookies de rendimiento:</strong> nos ayudan a mejorar la velocidad y funcionamiento.</li>
        <li><strong>Cookies de funcionalidad:</strong> recuerdan tus preferencias y ajustes.</li>
        <li><strong>Cookies de marketing:</strong> muestran contenido y anuncios personalizados.</li>
      </ul>

      <h2>Gestión de cookies</h2>
      <p>
        Puedes configurar tu navegador para rechazar cookies o recibir alertas cuando se envíen. 
        Sin embargo, algunas funcionalidades del sitio podrían no funcionar correctamente.
      </p>
    </div>
  );
}