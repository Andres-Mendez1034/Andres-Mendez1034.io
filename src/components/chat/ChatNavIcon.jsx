// components/chat/ChatNavIcon.jsx
// Agregar al Navbar: icono de chat con badge de mensajes no leídos
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { chatService } from "../../services/chat.service";
import { useAuth } from "../../hooks/useAuth";
import "./ChatNavIcon.css";

export default function ChatNavIcon() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unread, setUnread] = useState(0);

  const isActive = location.pathname.startsWith("/chat");

  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      try {
        const { unread: count } = await chatService.getUnreadCount();
        setUnread(count);
      } catch {
        // silencioso
      }
    };

    fetchUnread();
    // Polling cada 15 segundos
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;

  return (
    <button
      className={`chni-btn ${isActive ? "chni-btn--active" : ""}`}
      onClick={() => navigate("/chat")}
      aria-label={`Mensajes${unread > 0 ? `, ${unread} sin leer` : ""}`}
      title="Mensajes"
    >
      <svg
        className="chni-icon"
        viewBox="0 0 24 24"
        fill={isActive ? "currentColor" : "none"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {unread > 0 && (
        <span className="chni-badge" aria-hidden="true">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </button>
  );
}
