import React from 'react';
import './MarketplacePage.css';
import Marketplace from '../../components/marketplace/Marketplace';
import { useMarketplace } from '../../hooks/useMarketplace';

export default function MarketplacePage() {
  const { data: influencers, loading } = useMarketplace();
  return (
    <main className="page">
      <h2>Marketplace</h2>
      {loading ? <p>Cargando...</p> : <Marketplace influencers={influencers} />}
    </main>
  );
}
