import { useState } from "react";

export default function useChatbot() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Hola 👋 Soy tu asesor de microinfluencers. ¿En qué puedo ayudarte?",
      time: new Date(),
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Agregar mensaje del usuario
  const addUserMessage = (text) => {
    const userMessage = {
      id: Date.now(),
      role: "user",
      text,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  // Agregar mensaje del bot
  const addBotMessage = (text) => {
    const botMessage = {
      id: Date.now() + 1,
      role: "bot",
      text,
      time: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
  };

  // Enviar mensaje al backend (REAL)
  const sendMessage = async (text) => {
    if (!text.trim()) return;

    addUserMessage(text);
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/chatbot/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en el servidor");
      }

      const data = await response.json();

      const botReply = data?.data?.reply;

      addBotMessage(botReply || "No pude generar respuesta en este momento.");
    } catch (error) {
      console.error(error);
      addBotMessage("Hubo un error conectando con el servidor 😕");
    } finally {
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    sendMessage,
  };
}