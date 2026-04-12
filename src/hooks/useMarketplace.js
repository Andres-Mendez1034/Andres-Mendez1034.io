// src/hooks/useMarketplace.js
import { useState, useEffect } from 'react';
import { useFetch } from './useFetch';
import { fetchInfluencers } from '../services/influencer.service';

export function useMarketplace() {
  // Datos del marketplace (influencers)
  const { data, loading, error } = useFetch(fetchInfluencers, []);

  // Estado del carrito
  const [cartItems, setCartItems] = useState(() => {
    // intenta cargar carrito del localStorage si existe
    const stored = localStorage.getItem('cartItems');
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Función para agregar un item
  const addItem = (item) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        // si ya existe, aumentar cantidad
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  // Función para eliminar un item
  const removeItem = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  // Función para vaciar el carrito
  const clearCart = () => {
    setCartItems([]);
  };

  return {
    data: data || [],
    loading,
    error,
    cartItems,
    addItem,
    removeItem,
    clearCart
  };
}