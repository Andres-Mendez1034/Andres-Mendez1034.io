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

  // 🔥 DEBUG: ver si cambia el estado del chatbot
  useEffect(() => {
    console.log("💬 chatOpen cambió a:", chatOpen);
  }, [chatOpen]);

  return (
    <BrowserRouter>
      <AuthProvider>

        {/* NAVBAR */}
        <Navbar
          onOpenChat={() => {
            console.log("👉 Click en Asistente IA desde Navbar");
            setChatOpen(true);
          }}
        />

        {/* ROUTES */}
        <AppRouter />

        {/* CHATBOT GLOBAL CONTROLADO */}
        <Chatbot
          open={chatOpen}
          onClose={() => {
            console.log("❌ Cerrando chatbot");
            setChatOpen(false);
          }}
        />

        {/* FOOTER */}
        <Footer />

      </AuthProvider>
    </BrowserRouter>
  );
}