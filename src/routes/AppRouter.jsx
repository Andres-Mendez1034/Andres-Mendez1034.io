import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "../layout/Layout";
import { AuthContext } from "../context/AuthContext";

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
import CreatorOnboarding from "../pages/Onboarding/CreatorOnboarding/CreatorOnboarding";

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

// CREATOR PROFILE
import CreatorProfile from "../pages/CreatorProfile/CreatorProfile";

// 404
import NotFound from "../pages/NotFound/NotFound";


// 🔐 PRIVATE ROUTE (arreglado con MFA)
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authState } = useContext(AuthContext);
  const location = useLocation();

  // 👉 1. Si está en MFA, lo mandas a MFA setup
  if (authState === "MFA_CHALLENGE") {
    return <Navigate to="/mfa-setup" replace />;
  }

  // 👉 2. Si no está autenticado, login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // 👉 3. OK
  return children;
};


// 🚫 PUBLIC ONLY ROUTE
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, authState } = useContext(AuthContext);

  // si está en MFA, también lo bloqueamos aquí
  if (authState === "MFA_CHALLENGE") {
    return <Navigate to="/mfa-setup" replace />;
  }

  return isAuthenticated ? <Navigate to="/" /> : children;
};


export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>

        {/* CORE */}
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<PublicOnlyRoute><Login /></PublicOnlyRoute>}
        />

        <Route
          path="/register"
          element={<PublicOnlyRoute><Register /></PublicOnlyRoute>}
        />

        <Route
          path="/marketplace"
          element={<PrivateRoute><MarketplacePage /></PrivateRoute>}
        />

        <Route
          path="/profile"
          element={<PrivateRoute><Profile /></PrivateRoute>}
        />

        <Route
          path="/cart"
          element={<PrivateRoute><CartPage /></PrivateRoute>}
        />

        {/* CREATOR PROFILE */}
        <Route
          path="/creator/:id"
          element={<PrivateRoute><CreatorProfile /></PrivateRoute>}
        />

        {/* ONBOARDING */}
        <Route
          path="/onboarding/influencer"
          element={<PrivateRoute><InfluOnboarding /></PrivateRoute>}
        />

        <Route
          path="/onboarding/client"
          element={<PrivateRoute><ClientOnboarding /></PrivateRoute>}
        />

        <Route
          path="/onboarding/creator"
          element={<PrivateRoute><CreatorOnboarding /></PrivateRoute>}
        />

        {/* MFA */}
        <Route path="/mfa-setup" element={<MFASetup />} />

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
          element={<PrivateRoute><Billing /></PrivateRoute>}
        />

        <Route path="/payment/success" element={<Success />} />
        <Route path="/payment/cancel" element={<Cancel />} />

        {/* ALIAS */}
        <Route
          path="/profiles/influencer"
          element={<PrivateRoute><Profile /></PrivateRoute>}
        />

      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}