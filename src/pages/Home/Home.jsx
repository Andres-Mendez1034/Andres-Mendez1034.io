import React from 'react';
import './Home.css';
import Hero from '../../components/hero/Hero';
import Features from '../../components/features/Features';

export default function Home() {
  return (
    <main className="page home-page">
      <Hero />
      <Features />
    </main>
  );
}