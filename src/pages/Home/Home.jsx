import React from 'react';
import './Home.css';

import Hero from '../../components/hero/Hero';
import Features from '../../components/features/Features';
import Recommendations from '../../components/recommendations/Recommendations';

export default function Home() {
  return (
    <main className="page home-page">
      <Hero />

      {/* 👇 NUEVO SISTEMA DE RECOMENDACIONES */}
      <Recommendations />

      <Features />
    </main>
  );
}