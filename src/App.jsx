import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";

import AppRouter from "./routes/AppRouter";
import Chatbot   from "./components/chatbot/Chatbot";

import { AuthProvider } from "./context/AuthContext";
import "./styles/main.css";

export default function App() {
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    console.log("💬 [APP] chatOpen:", chatOpen);
  }, [chatOpen]);

  return (
    <BrowserRouter>
      <AuthProvider>

        {/* El Navbar y Footer viven en Layout, no aquí */}
        <AppRouter />

        {/* Chatbot global — fuera del router para persistir entre rutas */}
        <Chatbot
          open={chatOpen}
          onClose={() => {
            console.log("❌ [APP] Chat cerrado");
            setChatOpen(false);
          }}
        />

      </AuthProvider>
    </BrowserRouter>
  );
}
