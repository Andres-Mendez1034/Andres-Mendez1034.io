import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";
import asesorImg from "../../assets/asesor.png";
import useChatbot from "../../hooks/useChatbot";

export default function Chatbot() {
  const [input, setInput] = useState("");

  const { messages, loading, sendMessage } = useChatbot();

  const messagesEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const text = input;
    setInput("");

    await sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-fullpage">

      {/* HEADER */}
      <div className="chatbot-header">
        <div className="chatbot-header-left">
          <img src={asesorImg} alt="asesor" />
          <div>
            <h4>Asistente IA</h4>
            <span className="status">Especialista en microinfluencers</span>
          </div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.role}`}>

            {msg.role === "bot" && (
              <img className="avatar" src={asesorImg} alt="bot" />
            )}

            <div className="bubble">
              {/* 👉 MARKDOWN RENDER */}
              <ReactMarkdown>
                {msg.text}
              </ReactMarkdown>

              <div className="time">
                {msg.time?.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="message bot">
            <img className="avatar" src={asesorImg} alt="bot" />
            <div className="bubble typing">escribiendo...</div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSend} disabled={loading}>
          Enviar
        </button>
      </div>

    </div>
  );
}