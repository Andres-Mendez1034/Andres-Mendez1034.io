// services/chat.service.js
const API = import.meta.env.VITE_API_URL ?? "";

async function authFetch(url, options = {}) {
  const token = localStorage.getItem("bc_token");
  const res = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const chatService = {
  getConversations: () =>
    authFetch("/chat/conversations"),

  createConversation: (creatorId) =>
    authFetch("/chat/conversations", {
      method: "POST",
      body: JSON.stringify({ creator_id: creatorId }),
    }),

  getMessages: (conversationId) =>
    authFetch(`/chat/conversations/${conversationId}/messages`),

  sendMessage: (conversationId, payload) =>
    authFetch(`/chat/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getUnreadCount: () =>
    authFetch("/chat/unread-count"),
};
