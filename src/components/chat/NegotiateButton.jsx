// components/chat/NegotiateButton.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chatService } from "../../services/chat.service";
import "./NegotiateButton.css";

export default function NegotiateButton({ creatorId, creatorName }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNegotiate = async () => {
    console.log("🟡 NegotiateButton → creatorId recibido:", creatorId, "| tipo:", typeof creatorId);
    setLoading(true);
    try {
      const conv = await chatService.createConversation(creatorId);
      console.log("🟢 Conversación creada:", conv);
      navigate(`/chat/${creatorId}`);
    } catch (err) {
      console.error("🔴 Error al iniciar conversación:", err);
      navigate(`/chat/${creatorId}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neg-btn-wrap">
      <button
        className="neg-btn-primary"
        onClick={handleNegotiate}
        disabled={loading}
      >
        <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            fill="currentColor"
          />
        </svg>
        {loading ? "Abriendo..." : "Negociar"}
      </button>
    </div>
  );
}
