import React from 'react';
import './CartIcon.css';
import cartIcon from '../../assets/cart.png'; 

export default function CartIcon({ itemCount = 0 }) {
  return (
    <div className="cart-icon-container">
      <img src={cartIcon} alt="Carrito de compras" className="cart-icon" />
      {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
    </div>
  );
}