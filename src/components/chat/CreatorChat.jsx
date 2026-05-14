import { useState, useRef, useCallback } from "react";
import "./CreatorChat.css";

/**
 * CreatorChat — Chat flotante con modo negociación integrado
 *
 * Props:
 *   creatorId     — ID del creador
 *   creatorName   — Nombre visible del creador
 *   creatorAvatar — URL del avatar del creador
 *   currentUser   — { id, name, avatar }
 *   currency      — símbolo moneda (default "$")
 *   minPrice      — precio mínimo (default 0)
 *   maxPrice      — precio máximo (default 5000)
 *   initialPrice  — precio inicial (default 500)
 */
export default function CreatorChat({
  creatorId,
  creatorName = "Creador",
  creatorAvatar = null,
  currentUser = null,
  currency = "$",
  minPrice = 0,
  maxPrice = 5000,
  initialPrice = 500,
}) {
  // ── Chat state ────────────────────────────────────────────────────────────
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [view, setView] = useState("chat"); // "chat" | "negotiate"

  // ── Negotiation state ─────────────────────────────────────────────────────
  const [price, setPrice] = useState(initialPrice);
  const [step, setStep] = useState(50);
  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [animDir, setAnimDir] = useState(null);
  const [offerSent, setOfferSent] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const fmt = (n) => n.toLocaleString("es-CO");

  const getInitials = (name = "") =>
    name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  // ── Stance ────────────────────────────────────────────────────────────────
  const getStance = () => {
    const span = localMax - localMin || 1;
    const ratio = (price - localMin) / span;
    if (ratio <= 0.3)
      return {
        emoji: "🟢",
        label: "Oferta baja — firme",
        phrase: "«Esta es mi mejor oferta. Si el precio sube, evaluaré otras opciones.»",
        cls: "neg-stance neg-stance--low",
      };
    if (ratio >= 0.75)
      return {
        emoji: "🔴",
        label: "Cerca del límite — pide algo",
        phrase: "«Estoy en mi tope. Para cerrar necesito algo extra: entrega rápida o garantía.»",
        cls: "neg-stance neg-stance--high",
      };
    return {
      emoji: "🟡",
      label: "Punto medio — flexible",
      phrase: "«Puedo llegar ahí si incluimos los términos acordados. ¿Cerramos hoy?»",
      cls: "neg-stance neg-stance--mid",
    };
  };

  // ── Price controls ────────────────────────────────────────────────────────
  const changePrice = (dir) => {
    setAnimDir(dir);
    setTimeout(() => setAnimDir(null), 280);
    setOfferSent(false);
    setPrice((prev) => {
      const next = dir === "up" ? prev + step : prev - step;
      return Math.min(Math.max(next, localMin), localMax);
    });
  };

  // ── Send offer as chat message ────────────────────────────────────────────
  const sendOffer = () => {
    const msg = {
      id: `${Date.now()}_offer`,
      senderId: currentUser?.id ?? "guest",
      senderName: currentUser?.name ?? "Tú",
      senderAvatar: currentUser?.avatar ?? null,
      text: `💰 Mi oferta: ${currency}${fmt(price)}`,
      timestamp: new Date().toISOString(),
      isMine: true,
      isOffer: true,
    };
    setMessages((prev) => [...prev, msg]);
    setOfferSent(true);
    setView("chat");
    scrollToBottom();
  };

  // ── Send chat message ─────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;
    const msg = {
      id: `${Date.now()}_${Math.random()}`,
      senderId: currentUser?.id ?? "guest",
      senderName: currentUser?.name ?? "Tú",
      senderAvatar: currentUser?.avatar ?? null,
      text,
      timestamp: new Date().toISOString(),
      isMine: true,
    };
    setMessages((prev) => [...prev, msg]);
    setInputValue("");
    scrollToBottom();
  }, [inputValue, currentUser, scrollToBottom]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Open / close / minimize ───────────────────────────────────────────────
  const toggleOpen = () => {
    setIsOpen((prev) => {
      if (!prev) { setIsMinimized(false); setUnreadCount(0); }
      return !prev;
    });
  };

  const toggleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized((prev) => !prev);
    setUnreadCount(0);
  };

  const stance = getStance();

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="cc-wrapper">

      {/* ── Bubble (closed) ── */}
      {!isOpen && (
        <button className="cc-bubble" onClick={toggleOpen} aria-label="Abrir chat">
          <span className="cc-bubble-icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="currentColor" />
            </svg>
          </span>
          <span className="cc-bubble-label">Chatear</span>
          {unreadCount > 0 && (
            <span className="cc-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </button>
      )}

      {/* ── Chat window ── */}
      {isOpen && (
        <div className={`cc-window ${isMinimized ? "cc-window--minimized" : ""}`}>

          {/* Header */}
          <div
            className="cc-header"
            onClick={isMinimized ? toggleMinimize : undefined}
            style={{ cursor: isMinimized ? "pointer" : "default" }}
          >
            <div className="cc-header-info">
              <div className="cc-avatar cc-avatar--sm">
                {creatorAvatar
                  ? <img src={creatorAvatar} alt={creatorName} />
                  : <span>{getInitials(creatorName)}</span>}
                <span className="cc-status-dot cc-status-dot--online" />
              </div>
              <div className="cc-header-text">
                <span className="cc-header-name">{creatorName}</span>
                <span className="cc-header-status">En línea</span>
              </div>
            </div>

            <div className="cc-header-actions">
              {unreadCount > 0 && isMinimized && (
                <span className="cc-badge cc-badge--header">{unreadCount}</span>
              )}
              {/* Toggle negociar */}
              {!isMinimized && (
                <button
                  className={`cc-icon-btn cc-neg-toggle ${view === "negotiate" ? "cc-neg-toggle--active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setView(v => v === "negotiate" ? "chat" : "negotiate"); }}
                  aria-label="Modo negociación"
                  title="Negociar precio"
                >
                  <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              )}
              <button
                className="cc-icon-btn"
                onClick={toggleMinimize}
                aria-label={isMinimized ? "Expandir" : "Minimizar"}
              >
                {isMinimized
                  ? <svg viewBox="0 0 24 24" fill="none"><path d="M5 15l7-7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  : <svg viewBox="0 0 24 24" fill="none"><path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
              <button
                className="cc-icon-btn cc-icon-btn--close"
                onClick={toggleOpen}
                aria-label="Cerrar chat"
              >
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* ══════════════ NEGOTIATE VIEW ══════════════ */}
              {view === "negotiate" && (
                <div className="neg-panel">

                  {/* Price display */}
                  <div className="neg-price-section">
                    <p className="neg-price-label">tu oferta</p>
                    <div className={`neg-price-value ${animDir === "up" ? "neg-anim-up" : ""} ${animDir === "down" ? "neg-anim-down" : ""}`}>
                      <span className="neg-currency">{currency}</span>
                      {fmt(price)}
                    </div>

                    {/* Arrows */}
                    <div className="neg-arrows">
                      <button className="neg-arrow-btn" onClick={() => changePrice("up")} aria-label="Subir precio">
                        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                          <path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="neg-arrow-btn neg-arrow-btn--down" onClick={() => changePrice("down")} aria-label="Bajar precio">
                        <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    {/* Step */}
                    <div className="neg-step-row">
                      <span className="neg-step-label">paso</span>
                      <select className="neg-step-select" value={step} onChange={(e) => setStep(Number(e.target.value))}>
                        {[5, 10, 25, 50, 100, 250, 500].map((s) => (
                          <option key={s} value={s}>{currency}{fmt(s)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Range sliders */}
                  <div className="neg-ranges">
                    <div className="neg-range-row">
                      <span className="neg-range-label">mín</span>
                      <input
                        type="range" min={minPrice} max={maxPrice} step={step} value={localMin}
                        onChange={(e) => { const v = Number(e.target.value); if (v < localMax) { setLocalMin(v); if (price < v) setPrice(v); } }}
                      />
                      <span className="neg-range-val">{currency}{fmt(localMin)}</span>
                    </div>
                    <div className="neg-range-row">
                      <span className="neg-range-label">máx</span>
                      <input
                        type="range" min={minPrice} max={maxPrice} step={step} value={localMax}
                        onChange={(e) => { const v = Number(e.target.value); if (v > localMin) { setLocalMax(v); if (price > v) setPrice(v); } }}
                      />
                      <span className="neg-range-val">{currency}{fmt(localMax)}</span>
                    </div>
                  </div>

                  {/* Stance */}
                  <div className={stance.cls}>
                    <p className="neg-stance-title">{stance.emoji} {stance.label}</p>
                    <p className="neg-stance-phrase">{stance.phrase}</p>
                  </div>

                  {/* Send offer */}
                  <button
                    className={`neg-offer-btn ${offerSent ? "neg-offer-btn--sent" : ""}`}
                    onClick={sendOffer}
                  >
                    {offerSent ? "✓ Oferta enviada al chat" : `Enviar oferta · ${currency}${fmt(price)}`}
                  </button>
                </div>
              )}

              {/* ══════════════ CHAT VIEW ══════════════ */}
              {view === "chat" && (
                <>
                  <div className="cc-messages">
                    {messages.length === 0 && (
                      <div className="cc-empty">
                        <span className="cc-empty-icon">💬</span>
                        <p>Inicia la conversación con <strong>{creatorName}</strong></p>
                        <button className="cc-neg-hint" onClick={() => setView("negotiate")}>
                          🤝 Negociar precio
                        </button>
                      </div>
                    )}

                    {messages.map((msg) => {
                      const isMine = msg.senderId === currentUser?.id || msg.isMine;
                      return (
                        <div key={msg.id} className={`cc-message ${isMine ? "cc-message--mine" : "cc-message--theirs"}`}>
                          {!isMine && (
                            <div className="cc-avatar cc-avatar--xs">
                              {msg.senderAvatar
                                ? <img src={msg.senderAvatar} alt={msg.senderName} />
                                : <span>{getInitials(msg.senderName)}</span>}
                            </div>
                          )}
                          <div className={`cc-bubble-msg ${msg.isOffer ? "cc-bubble-msg--offer" : ""}`}>
                            {!isMine && <span className="cc-sender-name">{msg.senderName}</span>}
                            <p className="cc-text">{msg.text}</p>
                            <span className="cc-time">{formatTime(msg.timestamp)}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Footer */}
                  <div className="cc-footer">
                    <button
                      className="cc-footer-neg-btn"
                      onClick={() => setView("negotiate")}
                      title="Negociar precio"
                      aria-label="Abrir modo negociación"
                    >
                      <svg viewBox="0 0 24 24" fill="none" width="16" height="16">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <textarea
                      ref={inputRef}
                      className="cc-input"
                      placeholder="Escribe un mensaje..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      rows={1}
                    />
                    <button
                      className="cc-send-btn"
                      onClick={sendMessage}
                      disabled={!inputValue.trim()}
                      aria-label="Enviar"
                    >
                      <svg viewBox="0 0 24 24" fill="none">
                        <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}