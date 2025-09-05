import { useState } from "react";
import ReactMarkdown from "react-markdown";
import API from "../utils/api";
import "../styles/ChatBox.css";

function ChatBox() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { text: prompt, isUser: true }]);
    setPrompt("");

    try {
      const res = await API.post("/api/gemini/ask", {
        prompt,
      });
      setMessages((prev) => [
        ...prev,
        { text: res.data.message, isUser: false },
      ]);
    } catch (error) {
      console.warn("Gemini API Error:", error.message);
      let errorMessage = "❌ Error getting response from Gemini API";

      if (error.response) {
        // Server responded with error status
        if (error.response.status === 404) {
          errorMessage += "\n\nThe Gemini backend endpoint is not found. Please check if the backend is deployed and the endpoint is correctly configured.";
        } else if (error.response.status === 500) {
          errorMessage += "\n\nThe server encountered an internal error. Please try again later or contact support if the issue persists.";
        } else if (error.response.status === 429) {
          errorMessage += "\n\nToo many requests. Please wait a moment before trying again.";
        } else if (error.response.status === 401) {
          errorMessage += "\n\nAuthentication failed. Please check your login status.";
        } else {
          errorMessage += `\n\nServer error (${error.response.status}). Please try again.`;
        }
      } else if (error.code === 'ECONNABORTED') {
        errorMessage += "\n\nRequest timed out. Please check your internet connection and try again.";
      } else {
        errorMessage += "\n\nNetwork error. Please check your connection and try again.";
      }

      setMessages((prev) => [
        ...prev,
        {
          text: errorMessage,
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chat-container ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <div className="chatbox">
          <div className="chat-header">
            <h2>Gemini Chat</h2>
            <div className="status">
              <div className="status-indicator"></div>
              <span>Online</span>
            </div>
            <button className="close-button" onClick={toggleChat}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="chat-history">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.isUser ? "user-message" : "bot-message"
                }`}
              >
                <div className="message-content">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <div className="message-time">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}
            {loading && (
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="chat-form">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message..."
              className="chat-input"
              disabled={loading}
            />
            <button type="submit" className="chat-button" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      )}

      <button className="chat-toggle-button" onClick={toggleChat}>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              <path d="M17 8h.01" />
              <path d="M13 8h.01" />
              <path d="M9 8h.01" />
            </>
          )}
        </svg>
      </button>
    </div>
  );
}

export default ChatBox;
