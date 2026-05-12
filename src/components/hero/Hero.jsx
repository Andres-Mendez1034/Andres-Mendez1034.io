import React from "react";
import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">

      {/* CONTENT */}
      <motion.div
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="hero-badge">
          Plataforma de Marketing
        </span>

        <h2>
          Brand Connect —{" "}
          <TypeAnimation
            sequence={[
              "Conecta",
              1500,
              "Escala",
              1500,
              "Monetiza",
              1500,
              "crece",
              1500,
              "disfruta",
              1500,
            ]}
            speed={40}
            repeat={Infinity}
            className="hero-type"
          />
        </h2>

        <p>
          Conecta marcas con creadores, gestiona campañas y controla métricas en un solo lugar.
        </p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <button className="btn btn-primary">
            Explorar plataforma
          </button>

          <button className="btn btn-ghost">
            Ver marketplace
          </button>
        </motion.div>
      </motion.div>

      {/* GLOW ANIMADO */}
      <motion.div
        className="hero-glow"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
      />
    </section>
  );
}