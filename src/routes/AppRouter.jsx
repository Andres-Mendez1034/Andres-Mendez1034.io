import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import axios from "axios";
import Layout from "../layout/Layout";
import { AuthContext } from "../context/AuthContext";

// CORE
import Home            from "../pages/Home/Home";
import MarketplacePage from "../pages/Marketplace/MarketplacePage";
import Profile         from "../pages/Profile/Profile";
import Login           from "../pages/Login/Login";
import Register        from "../pages/Register/Register";
import CartPage        from "../pages/Cart/CartPage";

// ONBOARDING
import InfluOnboarding  from "../pages/Onboarding/InfluOnboarding/Onboarding";
import ClientOnboarding from "../pages/Onboarding/ClientOnboarding/ClientOnboarding";

// ADMIN
import AdminPage from "../pages/Admin/AdminPage";

// AUTH
import MFASetup    from "../components/auth/MFASetup";
import VerifyEmail from "../pages/VerifyEmail/VerifyEmail";

// INFO
import Pricing from "../pages/Pricing/Pricing";
import Support from "../pages/Support/Support";
import Status  from "../pages/Status/Status";

// LEGAL
import Privacy from "../pages/Legal/Privacy/Privacy";
import Terms   from "../pages/Legal/Terms/Terms";
import Cookies from "../pages/Legal/Cookies/Cookies";

// CHATBOT
import ChatbotPage from "../pages/Chatbot/ChatbotPage";

// PAYMENTS
import Billing        from "../pages/Billing/Billing";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import Cancel         from "../pages/Cancel/Cancel";

// CREATOR PROFILE
import CreatorProfile from "../pages/CreatorProfile/CreatorProfile";

// CHAT
import ChatPage from "../pages/Chat/ChatPage";

// 404
import NotFound from "../pages/NotFound/NotFound";

const API = "https://brandconnect.azurewebsites.net";


/* =========================================================
   PRIVATE ROUTE
========================================================= */
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, authState } = useContext(AuthContext);
  const location = useLocation();

  if (authState === "MFA_CHALLENGE" || authState === "MFA_SETUP") {
    return <Navigate to="/mfa-setup" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};


/* =========================================================
   PUBLIC ONLY ROUTE
========================================================= */
const PublicOnlyRoute = ({ children }) => {
  const { isAuthenticated, authState } = useContext(AuthContext);

  if (
    authState === "PENDING_EMAIL" ||
    authState === "MFA_SETUP"     ||
    authState === "MFA_CHALLENGE"
  ) {
    return children;
  }

  return isAuthenticated ? <Navigate to="/" replace /> : children;
};


/* =========================================================
   ONBOARDING GUARD
   Si el usuario ya tiene perfil → redirige a inicio
========================================================= */
const OnboardingGuard = ({ children, profileType }) => {
  const { user, token } = useContext(AuthContext);
  const [checking,   setChecking]   = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    const userId = user?.id || user?.user_id;
    if (!userId) { setChecking(false); return; }

    axios
      .get(`${API}/api/profiles/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(({ data }) => {
        if (profileType === "influencer" && data.influencer) setHasProfile(true);
        if (profileType === "client"     && data.client)     setHasProfile(true);
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [user, token, profileType]);

  if (checking)    return null;
  if (hasProfile)  return <Navigate to="/" replace />;
  return children;
};


/* =========================================================
   ROLE REDIRECT
========================================================= */
const RoleRedirect = () => {
  const { isAuthenticated, user, authState } = useContext(AuthContext);

  if (authState === "UNAUTHENTICATED" && !user) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === "superadmin") {
    return <Navigate to="/admin" replace />;
  }

  return <Home />;
};


/* =========================================================
   ROUTER
========================================================= */
export default function AppRouter() {
  return (
    <Routes>
      <Route element={<Layout />}>

        <Route path="/" element={<RoleRedirect />} />

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

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<PrivateRoute><AdminPage /></PrivateRoute>}
        />

        {/* CREATOR PROFILE */}
        <Route
          path="/creator/:id"
          element={<PrivateRoute><CreatorProfile /></PrivateRoute>}
        />

        {/* CHAT — lista de conversaciones */}
        <Route
          path="/chat"
          element={<PrivateRoute><ChatPage /></PrivateRoute>}
        />

        {/* CHAT — abre directo con un creador desde "Negociar" */}
        <Route
          path="/chat/:creatorId"
          element={<PrivateRoute><ChatPage /></PrivateRoute>}
        />

        {/* ONBOARDING */}
        <Route
          path="/onboarding/influencer"
          element={
            <PrivateRoute>
              <OnboardingGuard profileType="influencer">
                <InfluOnboarding />
              </OnboardingGuard>
            </PrivateRoute>
          }
        />
        <Route
          path="/onboarding/client"
          element={
            <PrivateRoute>
              <OnboardingGuard profileType="client">
                <ClientOnboarding />
              </OnboardingGuard>
            </PrivateRoute>
          }
        />

        {/* AUTH FLOW */}
        <Route path="/mfa-setup"    element={<MFASetup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* INFO */}
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/support" element={<Support />} />
        <Route path="/status"  element={<Status />} />

        {/* LEGAL */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms"   element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />

        {/* CHATBOT */}
        <Route path="/chatbot" element={<ChatbotPage />} />

        {/* PAYMENTS */}
        <Route
          path="/billing"
          element={<PrivateRoute><Billing /></PrivateRoute>}
        />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel"  element={<Cancel />} />

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