// pages/Chat/ChatPage.jsx
import { useParams } from "react-router-dom";
import CreatorChat from "../../components/chat/CreatorChat";
import "./ChatPage.css";

export default function ChatPage() {
  const { creatorId } = useParams();

  return (
    <div className="chat-page">
      <CreatorChat initialCreatorId={creatorId ?? null} />
    </div>
  );
}