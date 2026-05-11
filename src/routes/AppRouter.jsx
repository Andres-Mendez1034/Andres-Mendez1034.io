import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../layout/Layout";
import { AuthContext } from "../context/AuthContext";

// ==========================
// CORE
// ==========================
import Home from "../pages/Home/Home";
import MarketplacePage from "../pages/Marketplace/MarketplacePage";
import Profile from "../pages/Profile/Profile";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import CartPage from "../pages/Cart/CartPage";

// ==========================
// ONBOARDING (solo rutas, sin guards)
// ==========================
import CreatorOnboarding from "../pages/Onboarding/CreatorOnboarding/CreatorOnboarding";
import ClientOnboarding from "../pages/Onboarding/ClientOnboarding/ClientOnboarding";

// ==========================
// MFA
// ==========================
import MFASetup from "../components/auth/MFASetup";

// ==========================
// INFO
// ==========================
import Pricing from "../pages/Pricing/Pricing";
import Support from "../pages/Support/Support";
import Status from "../pages/Status/Status";

// ==========================
// LEGAL
// ==========================
import Privacy from "../pages/Legal/Privacy/Privacy";
import Terms from "../pages/Legal/Terms/Terms";
import Cookies from "../pages/Legal/Cookies/Cookies";

// ==========================
// CHATBOT
// ==========================
import ChatbotPage from "../pages/Chatbot/ChatbotPage";

// ==========================
// PAYMENTS
// ==========================
import Billing from "../pages/Billing/Billing";
import Success from "../pages/Success/Success";
import Cancel from "../pages/Cancel/Cancel";

/* =========================================================
   PRIVATE ROUTE SIMPLE (SOLO LOGIN)
========================================================= */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? children : <Navigate to="/login" />;
};

/* =========================================================
   ROUTER LIMPIO
========================================================= */
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* MARKETPLACE */}
        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <MarketplacePage />
            </PrivateRoute>
          }
        />

        {/* PROFILE */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* CART */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />

        {/* ONBOARDING (SIN REGLAS, SOLO ACCESO) */}
        <Route
          path="/onboarding/creator"
          element={
            <PrivateRoute>
              <CreatorOnboarding />
            </PrivateRoute>
          }
        />

        <Route
          path="/onboarding/client"
          element={
            <PrivateRoute>
              <ClientOnboarding />
            </PrivateRoute>
          }
        />

        {/* MFA */}
        <Route path="/mfa" element={<MFASetup />} />

        {/* INFO */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/status" element={<Status />} />

        {/* LEGAL */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* CHATBOT */}
        <Route path="/chatbot" element={<ChatbotPage />} />

        {/* PAYMENTS */}
        <Route
          path="/billing"
          element={
            <PrivateRoute>
              <Billing />
            </PrivateRoute>
          }
        />

        <Route path="/payment/success" element={<Success />} />
        <Route path="/payment/cancel" element={<Cancel />} />

      </Route>
    </Routes>
  );
}