import React from "react";
import "./Terms.css";

export default function Terms() {
  return (
    <div className="terms-page">
      <h1>Términos y Condiciones</h1>
      <p>
        Bienvenido a Brand Connect. Al usar nuestro sitio y servicios, aceptas cumplir con estos términos y condiciones.
      </p>

      <h2>Uso del sitio</h2>
      <ul>
        <li>El usuario se compromete a utilizar el sitio de manera legal y ética.</li>
        <li>No se permite el uso del marketplace para actividades ilegales o fraudulentas.</li>
        <li>Los usuarios son responsables de la información que publiquen o compartan.</li>
      </ul>

      <h2>Propiedad intelectual</h2>
      <ul>
        <li>Todo el contenido del sitio, incluyendo imágenes, textos y código, es propiedad de Brand Connect.</li>
        <li>Queda prohibida la reproducción total o parcial sin autorización.</li>
      </ul>

      <h2>Pagos y servicios</h2>
      <p>
        Los planes y servicios ofrecidos en el marketplace se rigen por las condiciones de cada plan. 
        Los pagos realizados son no reembolsables salvo indicación expresa.
      </p>

      <h2>Modificaciones</h2>
      <p>
        Brand Connect puede modificar estos términos en cualquier momento. Se recomienda revisar periódicamente esta sección.
      </p>

      <h2>Contacto</h2>
      <p>
        Para preguntas sobre estos términos, puedes contactarnos a través de nuestra sección de <strong>Soporte</strong>.
      </p>
    </div>
  );
}