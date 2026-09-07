import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useSettings } from "../context/SettingsContext";
import "./AiChatbot.css";

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "👋 Vanakkam! I am ISE AI Assistant. Ask me about weather alerts, rain work-stops, GPS tracking, employees, stock, or Profit & Loss!",
      quickPrompts: [
        "🌧️ Weather Alert & Rain Work Stop",
        "🗺️ Live GPS Delivery Map",
        "💹 Profit & Loss Overview",
        "👷 Present Employees Count",
        "📦 Low Stock Alert"
      ]
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);

  const { employees, orders, rawMaterials } = useData();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Robust AI Query Processing Engine
  function processAiResponse(query) {
    const rawQ = query.toLowerCase();
    const cleanQ = rawQ.replace(/[^a-z0-9\u0B80-\u0BFF]/g, ""); // Normalize spaces, dashes, symbols

    // 0. WEATHER / RAIN / WORK STOP / SMS QUERY
    if (
      cleanQ.includes("weather") ||
      cleanQ.includes("rain") ||
      cleanQ.includes("downpour") ||
      cleanQ.includes("workstop") ||
      cleanQ.includes("stopwork") ||
      cleanQ.includes("sms") ||
      cleanQ.includes("intimate") ||
      rawQ.includes("மழை") ||
      rawQ.includes("வானிலை")
    ) {
      return {
        text: `🌧️ **AI Weather Sentinel Alert**:\n• Status: **Heavy Downpour Warning (88% Rain Probability)**\n• Action: **Outdoor Sun-Drying Unit Halted**\n• Manager Intimation & SMS Dispatched to 3 Workers`,
        cards: [
          "• Muthu Selvam: Outdoor Sun-Drying ➔ Shifted to Indoor Box Packaging",
          "• Deepa Lakshmi: Sun-Drying B ➔ Shifted to Quality Check",
          "• Karthik M: Bamboo Tray Drying ➔ Shifted to Sambrani Moulding"
        ],
        link: "/manager",
        linkText: "View Manager Rain Sentinel & Send SMS →"
      };
    }

    // 1. PROFIT & LOSS / FINANCIAL QUERY
    if (
      cleanQ.includes("profit") ||
      cleanQ.includes("loss") ||
      cleanQ.includes("profitloss") ||
      cleanQ.includes("finance") ||
      cleanQ.includes("margin") ||
      cleanQ.includes("cost") ||
      cleanQ.includes("income") ||
      rawQ.includes("profit") ||
      rawQ.includes("loss")
    ) {
      return {
        text: `💹 **Profit & Loss Performance (Apr – Jul 2026)**:\n• **Total Revenue**: ₹197 Lakhs\n• **Total Costs**: ₹127 Lakhs (Raw materials + Labor)\n• **Net Profit**: **₹70 Lakhs** (35.5% Margin)`,
        cards: [
          "• Apr 2026: ₹42L Revenue | ₹29L Cost (Profit: ₹13L)",
          "• May 2026: ₹46L Revenue | ₹31L Cost (Profit: ₹15L)",
          "• Jun 2026: ₹51L Revenue | ₹33L Cost (Profit: ₹18L)",
          "• Jul 2026: ₹58L Revenue | ₹34L Cost (Profit: ₹24L)"
        ],
        link: "/admin/profit-loss",
        linkText: "Open Full Profit & Loss Report →"
      };
    }

    // 2. EMPLOYEES / ATTENDANCE QUERY
    if (
      cleanQ.includes("employee") ||
      cleanQ.includes("staff") ||
      cleanQ.includes("worker") ||
      cleanQ.includes("present") ||
      cleanQ.includes("absent") ||
      cleanQ.includes("attendance") ||
      rawQ.includes("ஆட்கள்") ||
      rawQ.includes("பணியாளர்கள்")
    ) {
      const presentEmps = employees.filter((e) => e.status === "Present");
      return {
        text: `👷 Currently **${presentEmps.length} out of ${employees.length} employees** are present today (92% attendance).`,
        cards: presentEmps.slice(0, 4).map((e) => `• ${e.name} (${e.dept})`),
        link: "/admin/employees",
        linkText: "View Employees Roster →"
      };
    }

    // 3. STOCK / RAW MATERIALS / INVENTORY QUERY
    if (
      cleanQ.includes("stock") ||
      cleanQ.includes("inventory") ||
      cleanQ.includes("material") ||
      cleanQ.includes("bamboo") ||
      cleanQ.includes("jigat") ||
      cleanQ.includes("low") ||
      cleanQ.includes("warehouse") ||
      rawQ.includes("இருப்பு") ||
      rawQ.includes("சரக்கு")
    ) {
      return {
        text: `📦 **Stock Alert Overview**:\nThere are **2 low stock materials** below safety thresholds:`,
        cards: [
          "• Bamboo Sticks: 50kg remaining (Reorder level: 100kg)",
          "• Jigat Powder: 30kg remaining (Reorder level: 80kg)",
          "• Rose Essential Oil: 12L remaining (Healthy)"
        ],
        link: "/admin/stock",
        linkText: "Open Stock & Materials →"
      };
    }

    // 4. ORDERS QUERY / MAP TRACKING
    if (
      cleanQ.includes("order") ||
      cleanQ.includes("customer") ||
      cleanQ.includes("pending") ||
      cleanQ.includes("shipped") ||
      cleanQ.includes("delivered") ||
      cleanQ.includes("delivery") ||
      cleanQ.includes("map") ||
      cleanQ.includes("gps") ||
      rawQ.includes("ஆர்டர்")
    ) {
      const pendingOrders = (orders || []).filter((o) => o.status !== "Delivered");
      return {
        text: `🚚 **Orders Pipeline & Live GPS Tracking**: There are **${pendingOrders.length} pending orders** currently in transit:`,
        cards: (orders || []).slice(0, 3).map((o) => `• ${o.id}: ${o.customer} - ${o.items || o.product} (${o.status})`),
        link: "/admin/orders",
        linkText: "Open Live GPS Order Map →"
      };
    }

    // 5. PRODUCTION QUERY
    if (
      cleanQ.includes("production") ||
      cleanQ.includes("produce") ||
      cleanQ.includes("batch") ||
      cleanQ.includes("target") ||
      cleanQ.includes("shift") ||
      cleanQ.includes("stick") ||
      rawQ.includes("உற்பத்தி")
    ) {
      return {
        text: `⚙️ **Today's Production Overview**:\n• Sticks Produced Today: **42,600 units**\n• Active Batches: **5 Running**\n• Average Defect Rate: **0.3% (Healthy)**`,
        link: "/admin/production",
        linkText: "Open Production Calendar →"
      };
    }

    // Fallback Response
    return {
      text: `🤖 ISE Assistant here! I searched the system for "${query}". You can ask about:\n• 🌧️ Weather Alert & Rain Work Stop\n• 🗺️ Live GPS Delivery Map\n• 💹 Profit & Loss metrics\n• 👷 Employees present today\n• 📦 Stock levels & raw materials`,
      link: "/admin",
      linkText: "Go to Business Dashboard →"
    };
  }

  function handleSend(textToSend) {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setTyping(true);

    setTimeout(() => {
      const responseData = processAiResponse(text);
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: responseData.text,
        cards: responseData.cards,
        link: responseData.link,
        linkText: responseData.linkText
      };
      setMessages((prev) => [...prev, aiMsg]);
      setTyping(false);
    }, 500);
  }

  return (
    <div className="ai-chatbot-root">
      {/* Floating Toggle Button */}
      <button
        className={`ai-float-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Open ISE AI Assistant"
      >
        <span className="ai-icon">🪔</span>
        <span className="ai-pulse" />
      </button>

      {/* Floating Chat Drawer Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="header-brand">
              <span className="bot-avatar">🤖</span>
              <div>
                <div className="bot-name">ISE AI Assistant</div>
                <div className="bot-status">● Live Weather &amp; GPS Engine</div>
              </div>
            </div>
            <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
          </div>

          {/* Messages Body */}
          <div className="ai-chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-wrap ${m.sender}`}>
                <div className="chat-bubble">
                  <div className="bubble-text" style={{ whiteSpace: "pre-line" }}>{m.text}</div>

                  {/* Bullet Cards if present */}
                  {m.cards && (
                    <div className="bubble-cards">
                      {m.cards.map((c, idx) => (
                        <div key={idx} className="card-item">{c}</div>
                      ))}
                    </div>
                  )}

                  {/* Action Link Button */}
                  {m.link && (
                    <button
                      className="ai-action-btn"
                      onClick={() => {
                        navigate(m.link);
                        setIsOpen(false);
                      }}
                    >
                      {m.linkText}
                    </button>
                  )}

                  {/* Quick Prompts */}
                  {m.quickPrompts && (
                    <div className="quick-prompts-grid">
                      {m.quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          className="prompt-chip"
                          onClick={() => handleSend(prompt)}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {typing && (
              <div className="chat-bubble-wrap ai">
                <div className="chat-bubble typing-bubble">
                  <span>●</span><span>●</span><span>●</span> Searching live data...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            className="ai-chat-footer"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask AI about rain alert, GPS map, stock..."
              className="ai-input"
            />
            <button type="submit" className="ai-send-btn">
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
