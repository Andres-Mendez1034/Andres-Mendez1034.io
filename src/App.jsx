import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import AppRouter from "./routes/AppRouter";
import Chatbot from "./components/chatbot/Chatbot";

import { AuthProvider } from "./context/AuthContext";
import "./styles/main.css";

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  /* =========================================================
     DEBUG CHAT STATE
  ========================================================= */
  useEffect(() => {
    console.log("💬 [APP] chatOpen:", chatOpen);
  }, [chatOpen]);

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <BrowserRouter>
      <AuthProvider>

        {/* ================= NAVBAR ================= */}
        <Navbar
          onOpenChat={() => {
            console.log("👉 [APP] Navbar abrió chat");
            setChatOpen(true);
          }}
        />

        {/* ================= ROUTER ================= */}
        <AppRouter />

        {/* ================= CHATBOT GLOBAL ================= */}
        <Chatbot
          open={chatOpen}
          onClose={() => {
            console.log("❌ [APP] Chat cerrado");
            setChatOpen(false);
          }}
        />

        {/* ================= FOOTER ================= */}
        <Footer />

      </AuthProvider>
    </BrowserRouter>
  );
}