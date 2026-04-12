// src/pages/Cart/CartPage.jsx
import React from 'react';
import './CartPage.css';
import { useMarketplace } from '../../hooks/useMarketplace'; // hook que maneja el carrito

export default function CartPage() {
  // Aseguramos que cartItems siempre sea un array
  const { cartItems = [], removeItem, clearCart } = useMarketplace() || {};

  // Calculamos total sin errores aunque haya undefined
  const totalPrice = (cartItems || []).reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h2>Tu carrito está vacío</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>Mi Carrito</h2>
      <ul className="cart-items">
        {cartItems.map((item) => (
          <li key={item.id} className="cart-item">
            <img
              src={item.image || '/assets/placeholder.png'}
              alt={item.name || 'Producto'}
              className="cart-item-image"
            />
            <div className="cart-item-info">
              <h3>{item.name || 'Producto'}</h3>
              <p>Cantidad: {item.quantity || 0}</p>
              <p>Precio: ${item.price || 0}</p>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeItem && removeItem(item.id)}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
      <div className="cart-summary">
        <h3>Total: ${totalPrice}</h3>
        <button className="clear-btn" onClick={() => clearCart && clearCart()}>
          Vaciar carrito
        </button>
        <button className="checkout-btn">Pagar</button>
      </div>
    </div>
  );
}