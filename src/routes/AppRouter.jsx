import React from "react";
import { Routes, Route } from "react-router-dom";

import Layout from "../layout/Layout";

// CORE
import Home from "../pages/Home/Home";
import MarketplacePage from "../pages/Marketplace/MarketplacePage";
import Profile from "../pages/Profile/Profile";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import CartPage from "../pages/Cart/CartPage";

// ONBOARDING
import InfluOnboarding from "../pages/Onboarding/InfluOnboarding/Onboarding";
import ClientOnboarding from "../pages/Onboarding/ClientOnboarding/ClientOnboarding";

// MFA
import MFASetup from "../components/auth/MFASetup";

// INFO
import Pricing from "../pages/Pricing/Pricing";
import Support from "../pages/Support/Support";
import Status from "../pages/Status/Status";

// LEGAL
import Privacy from "../pages/Legal/Privacy/Privacy";
import Terms from "../pages/Legal/Terms/Terms";
import Cookies from "../pages/Legal/Cookies/Cookies";

// CHATBOT
import ChatbotPage from "../pages/Chatbot/ChatbotPage";

// PAYMENTS
import Billing from "../pages/Billing/Billing";
import Success from "../pages/Success/Success";
import Cancel from "../pages/Cancel/Cancel";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* CORE */}
        <Route path="/" element={<Home />} />
        <Route path="/marketplace" element={<MarketplacePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />

        {/* ONBOARDING */}
        <Route
          path="/onboarding/influencer"
          element={<InfluOnboarding />}
        />

        <Route
          path="/onboarding/client"
          element={<ClientOnboarding />}
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
        <Route path="/billing" element={<Billing />} />

        <Route
          path="/payment/success"
          element={<Success />}
        />

        <Route
          path="/payment/cancel"
          element={<Cancel />}
        />

      </Route>
    </Routes>
  );
}