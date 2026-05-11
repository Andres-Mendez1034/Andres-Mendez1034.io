import { useState, useEffect, useContext, useMemo } from "react";
import { useFetch } from "./useFetch";
import { fetchInfluencers } from "../services/influencer.service";
import { AuthContext } from "../context/AuthContext";

export function useMarketplace() {
  const { user } = useContext(AuthContext);

  const {
    data: influencers,
    loading,
    error,
  } = useFetch(fetchInfluencers, []);

  /* =========================================================
     CART STATE
  ========================================================= */
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem("cartItems");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /* =========================================================
     🔥 ONBOARDING LOGIC CORREGIDO (CRÍTICO)
  ========================================================= */
  const needsOnboarding = useMemo(() => {
    if (!user) return false;

    if (user.has_profile) return false;

    switch (user.role) {
      case "creator":
      case "influencer":
      case "client":
        return true;

      default:
        return false;
    }
  }, [user]);

  /* =========================================================
     CART ACTIONS
  ========================================================= */
  const addItem = (item) => {
    if (needsOnboarding) {
      console.warn("Usuario necesita completar onboarding");
      return;
    }

    setCartItems((prev) => {
      const exists = prev.find((i) => i.id === item.id);

      if (exists) {
        return prev.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  /* =========================================================
     DATA NORMALIZADA
  ========================================================= */
  const activeInfluencers = useMemo(() => {
    return influencers || [];
  }, [influencers]);

  /* =========================================================
     RETURN
  ========================================================= */
  return {
    influencers: activeInfluencers,
    loading,
    error,

    cartItems,
    addItem,
    removeItem,
    clearCart,

    needsOnboarding,
  };
}