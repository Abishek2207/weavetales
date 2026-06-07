"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

const API = "http://localhost:8000/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Namaste! I am Weave Guide, your personal curator of Indian handloom heritage. I can tell you about specific weaves like Kanjeevaram, Banarasi, or Ikat, explain traditional motifs, or guide you on the history of these beautiful crafts. What would you like to know?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What makes Kanjeevaram silk special?",
    "Tell me about Banarasi motifs",
    "What is the difference between Ikat and double Ikat?"
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    const newMessages = [...messages, { role: "user", content: text } as Message];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setSuggestions([]);

    try {
      // Format history for the API
      const history = [];
      for (let i = 0; i < messages.length - 1; i += 2) {
        if (messages[i].role === "user" && messages[i+1]?.role === "assistant") {
           history.push({ user: messages[i].content, assistant: messages[i+1].content });
        }
      }

      const res = await fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: text,
          conversation_history: history,
          product_context: ""
        })
      });
      const data = await res.json();
      
      setMessages([...newMessages, { role: "assistant", content: data.answer }]);
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "assistant", content: "I'm sorry, my connection to the heritage archives is currently unavailable. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontFamily: "var(--font-playfair, serif)", color: "var(--primary)", marginBottom: "0.5rem" }}>Ask Weave Guide</h1>
        <p style={{ color: "var(--secondary)" }}>Your AI companion for Indian textile heritage</p>
      </div>

      <div className="premium-card" style={{ display: "flex", flexDirection: "column", height: "600px", padding: 0, overflow: "hidden" }}>
        
        {/* Chat Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem", background: "var(--background)" }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              background: msg.role === "user" ? "var(--primary)" : "var(--surface)",
              color: msg.role === "user" ? "#fff" : "var(--foreground)",
              padding: "1rem 1.2rem",
              borderRadius: msg.role === "user" ? "16px 16px 0 16px" : "16px 16px 16px 0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              border: msg.role === "assistant" ? "1px solid var(--border)" : "none"
            }}>
              {msg.role === "assistant" && <div style={{ fontSize: "0.8rem", color: "var(--primary)", fontWeight: 600, marginBottom: "0.4rem" }}>Weave Guide</div>}
              <p style={{ margin: 0, lineHeight: 1.6, fontSize: "0.95rem" }}>{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: "flex-start", background: "var(--surface)", padding: "1rem 1.2rem", borderRadius: "16px 16px 16px 0", border: "1px solid var(--border)" }}>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <span style={{ animation: "pulse 1.5s infinite" }}>●</span>
                <span style={{ animation: "pulse 1.5s infinite", animationDelay: "0.2s" }}>●</span>
                <span style={{ animation: "pulse 1.5s infinite", animationDelay: "0.4s" }}>●</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: "1.5rem", background: "var(--surface)", borderTop: "1px solid var(--border)" }}>
          
          {suggestions.length > 0 && !loading && (
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} style={{ 
                  background: "var(--surface-hover)", border: "1px solid var(--border)", 
                  padding: "0.4rem 0.8rem", borderRadius: 20, fontSize: "0.8rem", 
                  color: "var(--primary)", cursor: "pointer", transition: "all 0.2s" 
                }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "flex", gap: "1rem" }}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask about a weave, motif, or region..."
              style={{ 
                flex: 1, padding: "1rem", borderRadius: 8, border: "1px solid var(--border)",
                fontFamily: "var(--font-sans)", fontSize: "1rem", outline: "none",
                background: "var(--background)", color: "var(--foreground)"
              }}
              disabled={loading}
            />
            <button 
              className="btn btn-primary" 
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              style={{ padding: "0 2rem" }}
            >
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
