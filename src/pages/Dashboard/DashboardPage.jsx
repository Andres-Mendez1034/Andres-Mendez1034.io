import React from 'react';
import './DashboardPage.css';
import Dashboard from '../../components/dashboard/Dashboard';

const sampleStats = [
  { label: 'Gasto mensual', value: '$2,300', trend: 5 },
  { label: 'ROI', value: '2.4x', trend: 12 },
  { label: 'Campañas activas', value: 3, trend: -2 },
];

const sampleCampaigns = [
  { id: 1, name: 'Lanzamiento X', status: 'active', budget: 1200, reach: '45K' },
  { id: 2, name: 'Verano 2026', status: 'paused', budget: 800, reach: '18K' },
  { id: 3, name: 'Awareness', status: 'draft', budget: 500, reach: '—' },
];

export default function DashboardPage() {
  return (
    <main className="page dashboard-page">
      <header className="dp-hero">
        <div className="dp-hero-content">
          <h2>Dashboard</h2>
          <p>Resumen de desempeño, campañas y retorno.</p>
        </div>
        <div className="dp-hero-glow" aria-hidden="true" />
      </header>

      <section className="dp-content">
        <Dashboard stats={sampleStats} campaigns={sampleCampaigns} />
      </section>
    </main>
  );
}