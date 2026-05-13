import React from "react";
import "./MarketplacePage.css";
import Marketplace from "../../components/marketplace/Marketplace";
import { useMarketplace } from "../../hooks/useMarketplace";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function MarketplacePage() {
  const { data: influencers, loading } = useMarketplace();
  const navigate = useNavigate();
  const { user } = useAuth();

  const goToCreatorOnboarding = () => {
    navigate("/onboarding/creator");
  };

  const goToCreatorProfile = (id) => {
    navigate(`/creator/${id}`);
  };

  const canCreateProfile = user?.role === "influencer";

  return (
    <main className="page">

      {/* HEADER */}
      <div className="mp-header">
        <h2>Marketplace</h2>

        {canCreateProfile && (
          <button
            className="create-profile-btn"
            onClick={goToCreatorOnboarding}
          >
            + Crear perfil
          </button>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Marketplace
          influencers={influencers}
          onCardClick={goToCreatorProfile}
        />
      )}

    </main>
  );
}