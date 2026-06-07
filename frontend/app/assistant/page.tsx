"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./assistant.module.css";
import BottomNavigation from "@/components/BottomNavigation";

type Message = { role: "user" | "ai"; text: string };

const QUICK_PROMPTS = ["What is Ikat weaving?", "Find a red silk saree", "Who are the top Banarasi weavers?"];

const AI_RESPONSES: Record<string, string> = {
  "What is Ikat weaving?":
    "Ikat is a dyeing technique used to pattern textiles — the yarns are resist-dyed before weaving. The word comes from the Malay-Indonesian word 'mengikat', meaning to tie. Pochampally Ikat from Telangana is a GI-tagged masterpiece. Shall I show you some available Ikat pieces?",
  "Find a red silk saree":
    "I found 12 stunning red silk sarees from our verified artisans. The most prized is the 'Crimson Banarasi' by Ramesh Kumar — 72 hours of hand-weaving with real gold zari borders. Would you like to explore it?",
  "Who are the top Banarasi weavers?":
    "Our top certified Banarasi masters include: Ramesh Kumar (4th gen, 30+ years), Priya Devi (specialising in floral zari), and Mohammed Iqbal (famous for kinkhab brocade). Shall I take you to any of their profiles?",
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Namaste! I'm WeaveGuide, your heritage concierge. Ask me about weaving traditions, artisans, or help finding the perfect piece." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const response =
        AI_RESPONSES[text] ??
        "That's a fascinating question! The heritage of Indian handlooms runs deep. Let me research that for you and connect you with the right artisans. 🧵";
      setIsTyping(false);
      setMessages((m) => [...m, { role: "ai", text: response }]);
    }, 1500);
  };

  return (
    <main className={styles.assistantContainer}>
      <header className={styles.header}>
        <div className={styles.aiAvatar}>🤖</div>
        <div>
          <h1 className={styles.title}>WeaveGuide</h1>
          <p className={styles.status}>● Online · Heritage Concierge</p>
        </div>
      </header>

      <div className={styles.chatArea}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.bubble} ${msg.role === "user" ? styles.userBubble : styles.aiBubble}`}>
            <p>{msg.text}</p>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.bubble} ${styles.aiBubble}`}>
            <div className={styles.typingIndicator}>
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.quickPrompts}>
        {QUICK_PROMPTS.map((p) => (
          <button key={p} className={styles.promptChip} onClick={() => sendMessage(p)}>
            {p}
          </button>
        ))}
      </div>

      <div className={styles.inputArea}>
        <input
          type="text"
          placeholder="Ask about weaves, artisans, heritage..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
          className={styles.chatInput}
        />
        <button className={styles.sendBtn} onClick={() => sendMessage(input)}>➤</button>
      </div>

      <BottomNavigation />
    </main>
  );
}
