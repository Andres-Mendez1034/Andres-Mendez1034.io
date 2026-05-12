import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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
// ONBOARDING
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

// ==========================
// 404
// ==========================
import NotFound from "../pages/NotFound/NotFound";

/* =========================================================
   PRIVATE ROUTE (MEJORADO)
========================================================= */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
};

/* =========================================================
   PUBLIC ONLY ROUTE (OPCIONAL PARA LOGIN/REGISTER)
========================================================= */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  return isAuthenticated ? <Navigate to="/" /> : children;
};

/* =========================================================
   APP ROUTER
========================================================= */
export default function AppRouter() {
  return (
    <Routes>

      {/* =========================
          LAYOUT WRAPPER
      ========================= */}
      <Route element={<Layout />}>


        {/* =========================
            PUBLIC
        ========================= */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />


        {/* =========================
            PROTECTED CORE
        ========================= */}
        <Route
          path="/marketplace"
          element={
            <PrivateRoute>
              <MarketplacePage />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <CartPage />
            </PrivateRoute>
          }
        />


        {/* =========================
            ONBOARDING
        ========================= */}
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


        {/* =========================
            MFA
        ========================= */}
        <Route
          path="/mfa"
          element={
            <PrivateRoute>
              <MFASetup />
            </PrivateRoute>
          }
        />


        {/* =========================
            INFO PUBLIC
        ========================= */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/status" element={<Status />} />


        {/* =========================
            LEGAL
        ========================= */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />


        {/* =========================
            CHATBOT
        ========================= */}
        <Route path="/chatbot" element={<ChatbotPage />} />


        {/* =========================
            BILLING / PAYMENTS
        ========================= */}
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


      {/* =========================
          404 FALLBACK
      ========================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
}