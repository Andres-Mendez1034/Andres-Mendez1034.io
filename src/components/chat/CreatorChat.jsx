// components/chat/CreatorChat.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { chatService } from "../../services/chat.service";
import OfferAcceptModal from "./OfferAcceptModal";
import "./CreatorChat.css";

const getInitials = (name = "") =>
  name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const formatDate = (iso) => {
  const d = new Date(iso);
  const today = new Date();
  const diff = Math.floor((today - d) / 86400000);
  if (diff === 0) return "Hoy";
  if (diff === 1) return "Ayer";
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
};

const fmt = (n) => Number(n).toLocaleString("es-CO");

// ── Negotiate Panel ──────────────────────────────────────────────────────────
function NegotiatePanel({ onSendOffer, onClose }) {
  const [price, setPrice] = useState(500000);
  const [step, setStep] = useState(50000);
  const [min, setMin] = useState(100000);
  const [max, setMax] = useState(2000000);
  const [sent, setSent] = useState(false);
  const [animDir, setAnimDir] = useState(null);

  const change = (dir) => {
    setAnimDir(dir);
    setTimeout(() => setAnimDir(null), 280);
    setSent(false);
    setPrice((p) => Math.min(Math.max(dir === "up" ? p + step : p - step, min), max));
  };

  const span = max - min || 1;
  const ratio = (price - min) / span;
  const stance =
    ratio <= 0.3
      ? { emoji: "🟢", label: "Oferta baja — firme", cls: "neg-stance--low" }
      : ratio >= 0.75
      ? { emoji: "🔴", label: "Cerca del límite", cls: "neg-stance--high" }
      : { emoji: "🟡", label: "Punto medio — flexible", cls: "neg-stance--mid" };

  const handleSend = () => {
    onSendOffer(price);
    setSent(true);
    setTimeout(onClose, 800);
  };

  return (
    <div className="chp-neg-overlay" onClick={onClose}>
      <div className="chp-neg-panel" onClick={(e) => e.stopPropagation()}>
        <button className="chp-neg-close" onClick={onClose}>✕</button>
        <h3 className="chp-neg-title">Negociar precio</h3>

        <div className="chp-neg-price-wrap">
          <span className="chp-neg-currency">COP</span>
          <span className={`chp-neg-price ${animDir === "up" ? "chp-anim-up" : ""} ${animDir === "down" ? "chp-anim-down" : ""}`}>
            ${fmt(price)}
          </span>
        </div>

        <div className="chp-neg-arrows">
          <button className="chp-neg-arrow" onClick={() => change("up")}>▲</button>
          <div className="chp-neg-step-wrap">
            <span className="chp-neg-step-label">paso</span>
            <select className="chp-neg-step" value={step} onChange={(e) => setStep(Number(e.target.value))}>
              {[5000, 10000, 25000, 50000, 100000, 250000, 500000].map((s) => (
                <option key={s} value={s}>${fmt(s)}</option>
              ))}
            </select>
          </div>
          <button className="chp-neg-arrow chp-neg-arrow--down" onClick={() => change("down")}>▼</button>
        </div>

        <div className="chp-neg-ranges">
          <label>
            <span>Mín</span>
            <input type="range" min={0} max={max - step} step={step} value={min}
              onChange={(e) => { const v = +e.target.value; if (v < max) setMin(v); }} />
            <span>${fmt(min)}</span>
          </label>
          <label>
            <span>Máx</span>
            <input type="range" min={min + step} max={5000000} step={step} value={max}
              onChange={(e) => { const v = +e.target.value; if (v > min) setMax(v); }} />
            <span>${fmt(max)}</span>
          </label>
        </div>

        <div className={`chp-neg-stance ${stance.cls}`}>
          {stance.emoji} {stance.label}
        </div>

        <button className={`chp-neg-send-btn ${sent ? "chp-neg-send-btn--sent" : ""}`} onClick={handleSend}>
          {sent ? "✓ Oferta enviada" : `Enviar oferta · $${fmt(price)}`}
        </button>
      </div>
    </div>
  );
}

// ── OfferBubble ──────────────────────────────────────────────────────────────
// Muestra la burbuja de oferta. Si el mensaje NO es mío y aún no fue respondida,
// muestra los botones Aceptar / Rechazar.
function OfferBubble({ msg, isMine, conversationId, onAccepted }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [status, setStatus]       = useState(msg.offer_status ?? null);

  const handleClose = (result) => {
    setModalOpen(false);
    if (result === "rejected") setStatus("rejected");
  };

  const handleSuccess = () => {
    setStatus("accepted");
    onAccepted?.();
  };

  const canRespond = !isMine && !status;

  return (
    <>
      {modalOpen && (
        <OfferAcceptModal
          offer={msg}
          conversationId={conversationId}
          onClose={handleClose}
          onSuccess={handleSuccess}
        />
      )}

      <div className={`chp-bubble chp-bubble--offer ${msg._optimistic ? "chp-bubble--sending" : ""}`}>
        <div className="chp-offer-badge">💰 Oferta</div>
        <p className="chp-bubble-text">{msg.text}</p>

        {status === "accepted" && (
          <div className="chp-offer-status chp-offer-status--accepted">✓ Oferta aceptada — pago iniciado</div>
        )}
        {status === "rejected" && (
          <div className="chp-offer-status chp-offer-status--rejected">✕ Oferta rechazada</div>
        )}

        {canRespond && (
          <div className="chp-offer-actions">
            <button
              className="chp-offer-btn chp-offer-btn--reject"
              onClick={() => setStatus("rejected")}
            >
              Rechazar
            </button>
            <button
              className="chp-offer-btn chp-offer-btn--accept"
              onClick={() => setModalOpen(true)}
            >
              Aceptar oferta
            </button>
          </div>
        )}

        <span className="chp-bubble-time">{formatTime(msg.created_at)}</span>
      </div>
    </>
  );
}

// ── CreatorChat ──────────────────────────────────────────────────────────────
export default function CreatorChat({ initialCreatorId = null }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv]       = useState(null);
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(true);
  const [loadingMsgs, setLoadingMsgs]     = useState(false);
  const [showNeg, setShowNeg]             = useState(false);
  const [search, setSearch]               = useState("");
  const [mobileView, setMobileView]       = useState("list");

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const pollRef        = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await chatService.getConversations();
      setConversations(data);
      return data;
    } catch (err) {
      console.error("loadConversations:", err);
      return [];
    }
  }, []);

  const loadMessages = useCallback(async (convId) => {
    if (!convId) return;
    setLoadingMsgs(true);
    try {
      const data = await chatService.getMessages(convId);
      setMessages(data);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch (err) {
      console.error("loadMessages:", err);
    } finally {
      setLoadingMsgs(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      setLoading(true);
      const convs = await loadConversations();
      if (cancelled) return;

      if (initialCreatorId) {
        try {
          const conv = await chatService.createConversation(initialCreatorId);
          if (!cancelled) {
            setActiveConv(conv);
            setMobileView("chat");
            await loadConversations();
          }
        } catch (err) {
          console.error("createConversation:", err);
        }
      } else if (convs.length > 0) {
        setActiveConv(convs[0]);
      }

      if (!cancelled) setLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, [initialCreatorId]);

  // Polling global de conversaciones (siempre activo)
  useEffect(() => {
    const convPollRef = setInterval(async () => {
      const convs = await chatService.getConversations().catch(() => null);
      if (!convs) return;

      setConversations(convs);
      setActiveConv((prev) => {
        if (prev) return prev;
        return convs.length > 0 ? convs[0] : null;
      });

      const totalUnread = convs.reduce((acc, c) => acc + Number(c.unread_count ?? 0), 0);
      document.title = totalUnread > 0
        ? `(${totalUnread}) Nuevo mensaje — Brand Connect`
        : "Brand Connect";
    }, 5000);

    return () => {
      clearInterval(convPollRef);
      document.title = "Brand Connect";
    };
  }, []);

  // Polling de mensajes (solo cuando hay conv activa)
  useEffect(() => {
    if (!activeConv) return;
    loadMessages(activeConv.id);

    pollRef.current = setInterval(async () => {
      const msgs = await chatService.getMessages(activeConv.id).catch(() => null);
      if (msgs) setMessages(msgs);
    }, 5000);

    return () => clearInterval(pollRef.current);
  }, [activeConv?.id]);

  const sendMessage = useCallback(async (text, isOffer = false, offerAmount = null) => {
    if (!text?.trim() || !activeConv) return;

    const optimistic = {
      id: `opt_${Date.now()}`,
      conversation_id: activeConv.id,
      sender_id:    user?.id,
      sender_name:  user?.name,
      sender_avatar: null,
      text: text.trim(),
      is_offer: isOffer,
      offer_amount: offerAmount,
      created_at: new Date().toISOString(),
      _optimistic: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInput("");
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    try {
      await chatService.sendMessage(activeConv.id, {
        text: text.trim(),
        is_offer: isOffer,
        offer_amount: offerAmount,
      });
      const msgs = await chatService.getMessages(activeConv.id);
      setMessages(msgs);
      await loadConversations();
    } catch (err) {
      console.error("sendMessage:", err);
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
    }
  }, [activeConv, user]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSendOffer = (price) => {
    sendMessage(`💰 Mi oferta: $${fmt(price)} COP`, true, price);
    setShowNeg(false);
  };

  const selectConv = (conv) => {
    setActiveConv(conv);
    setMobileView("chat");
    setMessages([]);
  };

  const filtered = conversations.filter((c) =>
    c.other_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="chp-loading">
        <div className="chp-spinner" />
        <p>Cargando mensajes...</p>
      </div>
    );
  }

  return (
    <div className="chp-root">
      {showNeg && (
        <NegotiatePanel
          onSendOffer={handleSendOffer}
          onClose={() => setShowNeg(false)}
        />
      )}

      <aside className={`chp-sidebar ${mobileView === "chat" ? "chp-sidebar--hidden" : ""}`}>
        <div className="chp-sidebar-header">
          <h2 className="chp-sidebar-title">Mensajes</h2>
        </div>

        <div className="chp-search-wrap">
          <svg className="chp-search-icon" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
            <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            className="chp-search"
            placeholder="Buscar conversación..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="chp-conv-list">
          {filtered.length === 0 && (
            <div className="chp-conv-empty">
              <span>💬</span>
              <p>Sin conversaciones aún</p>
            </div>
          )}
          {filtered.map((conv) => (
            <button
              key={conv.id}
              className={`chp-conv-item ${activeConv?.id === conv.id ? "chp-conv-item--active" : ""}`}
              onClick={() => selectConv(conv)}
            >
              <div className="chp-conv-avatar">
                {conv.other_avatar
                  ? <img src={conv.other_avatar} alt={conv.other_name} />
                  : <span>{getInitials(conv.other_name ?? "?")}</span>}
                {Number(conv.unread_count) > 0 && (
                  <span className="chp-conv-badge">
                    {conv.unread_count > 9 ? "9+" : conv.unread_count}
                  </span>
                )}
              </div>
              <div className="chp-conv-info">
                <span className="chp-conv-name">{conv.other_name ?? "Usuario"}</span>
                <span className="chp-conv-last">{conv.last_message ?? "Sin mensajes"}</span>
              </div>
              {conv.last_message_at && (
                <span className="chp-conv-time">{formatDate(conv.last_message_at)}</span>
              )}
            </button>
          ))}
        </div>
      </aside>

      <main className={`chp-chat ${mobileView === "list" ? "chp-chat--hidden" : ""}`}>
        {!activeConv ? (
          <div className="chp-chat-empty">
            <div className="chp-chat-empty-icon">💬</div>
            <h3>Selecciona una conversación</h3>
            <p>Elige un chat de la lista para empezar</p>
          </div>
        ) : (
          <>
            <div className="chp-chat-header">
              <button className="chp-back-btn" onClick={() => setMobileView("list")}>
                <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                  <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div className="chp-chat-header-avatar">
                {activeConv.other_avatar
                  ? <img src={activeConv.other_avatar} alt={activeConv.other_name} />
                  : <span>{getInitials(activeConv.other_name ?? "?")}</span>}
                <span className="chp-status-dot" />
              </div>
              <div className="chp-chat-header-info">
                <span className="chp-chat-header-name">{activeConv.other_name ?? "Usuario"}</span>
                <span className="chp-chat-header-status">En línea</span>
              </div>
            </div>

            <div className="chp-messages">
              {loadingMsgs && (
                <div className="chp-msgs-loading">
                  <div className="chp-spinner chp-spinner--sm" />
                </div>
              )}

              {!loadingMsgs && messages.length === 0 && (
                <div className="chp-msgs-empty">
                  <span>👋</span>
                  <p>Inicia la conversación con <strong>{activeConv.other_name}</strong></p>
                  <button className="chp-start-neg-btn" onClick={() => setShowNeg(true)}>
                    🤝 Negociar precio
                  </button>
                </div>
              )}

              {messages.map((msg, i) => {
                const isMine = String(msg.sender_id) === String(user?.id);
                const prev = messages[i - 1];
                const showDate =
                  !prev || formatDate(prev.created_at) !== formatDate(msg.created_at);

                return (
                  <div key={msg.id}>
                    {showDate && (
                      <div className="chp-date-divider">
                        <span>{formatDate(msg.created_at)}</span>
                      </div>
                    )}
                    <div className={`chp-msg ${isMine ? "chp-msg--mine" : "chp-msg--theirs"}`}>
                      {!isMine && (
                        <div className="chp-msg-avatar">
                          {msg.sender_avatar
                            ? <img src={msg.sender_avatar} alt={msg.sender_name} />
                            : <span>{getInitials(msg.sender_name ?? "?")}</span>}
                        </div>
                      )}

                      {msg.is_offer ? (
                        <OfferBubble
                          msg={msg}
                          isMine={isMine}
                          conversationId={activeConv.id}
                          onAccepted={() => loadMessages(activeConv.id)}
                        />
                      ) : (
                        <div className={`chp-bubble ${msg._optimistic ? "chp-bubble--sending" : ""}`}>
                          <p className="chp-bubble-text">{msg.text}</p>
                          <span className="chp-bubble-time">{formatTime(msg.created_at)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="chp-input-bar">
              <button className="chp-neg-btn" onClick={() => setShowNeg(true)} title="Negociar precio">
                <svg viewBox="0 0 24 24" fill="none" width="18" height="18">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <textarea
                ref={inputRef}
                className="chp-input"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                className="chp-send-btn"
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
