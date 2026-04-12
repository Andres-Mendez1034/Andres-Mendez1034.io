import React from "react";
import "./Privacy.css";

export default function Privacy() {
  return (
    <div className="privacy-page">
      <h1>Política de Privacidad</h1>
      <p>
        En Brand Connect nos comprometemos a proteger tu información personal y tu privacidad. 
        Esta política explica cómo recopilamos, usamos y protegemos tus datos.
      </p>

      <h2>Información que recopilamos</h2>
      <ul>
        <li>Datos que proporcionas al registrarte (nombre, correo, perfil).</li>
        <li>Información de uso del sitio (páginas visitadas, tiempo de navegación).</li>
        <li>Datos de pagos y transacciones dentro del marketplace.</li>
      </ul>

      <h2>Cómo usamos tu información</h2>
      <ul>
        <li>Para proporcionarte servicios y soporte.</li>
        <li>Para mejorar el marketplace y la experiencia del usuario.</li>
        <li>Para enviar comunicaciones importantes y novedades relevantes.</li>
      </ul>

      <h2>Protección de datos</h2>
      <p>
        Implementamos medidas de seguridad técnicas y administrativas para proteger tus datos 
        personales contra acceso no autorizado, pérdida o alteración.
      </p>

      <h2>Contacto</h2>
      <p>
        Si tienes preguntas sobre esta política o sobre tus datos, puedes contactarnos a través 
        de nuestra sección de <strong>Soporte</strong>.
      </p>
    </div>
  );
}