import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import MarketplacePage from '../pages/Marketplace/MarketplacePage';
import Profile from '../pages/Profile/Profile';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import Login from '../pages/Login/Login';
import Register from '../pages/Register/Register';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/marketplace" element={<MarketplacePage />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}