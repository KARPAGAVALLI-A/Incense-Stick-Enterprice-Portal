import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useSettings } from "../context/SettingsContext";
import { speechService } from "../services/speechService";
import { processVoiceCommand, detectLanguage } from "../services/voiceNavigationService";
import "./AiChatbot.css";

export default function AiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  // Default to 'en' (en-IN) which recognizes Indian English and Tanglish ("Employee page-ku po")
  const [activeSpeechLang, setActiveSpeechLang] = useState("en");
  const [lastDetectedLang, setLastDetectedLang] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [micError, setMicError] = useState(null);
  const [liveInterim, setLiveInterim] = useState("");
  const [micVolume, setMicVolume] = useState(0);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "👋 வணக்கம் & Hello! I am ISE Multilingual AI Voice Assistant.\nSpeak into your microphone or tap any voice command below:\n• Tanglish: \"Employee page-ku po\", \"Analytics open pannu\", \"Orders kaattu\"\n• English: \"Go to Employee page\", \"Open Analytics\", \"Show Inventory\"\n• தமிழ்: \"பணியாளர் பக்கம்\", \"அனலிடிக்ஸ்\", \"உத்தரவுகள்\"\n• हिन्दी: \"Employee page kholo\", \"Dashboard par jao\"",
      quickPrompts: [
        "🗣️ Tanglish: \"Employee page-ku po\"",
        "🗣️ Tanglish: \"Analytics open pannu\"",
        "🗣️ English: \"Go to Employee page\"",
        "🗣️ English: \"Open Analytics\"",
        "🗣️ Tanglish: \"Orders kaattu\"",
        "🗣️ தமிழ்: \"பணியாளர் பக்கம்\"",
        "🗣️ हिन्दी: \"Employee page kholo\"",
        "📈 Live Market Shares & Stock"
      ]
    }
  ]);

  const [inputText, setInputText] = useState("");
  const [typing, setTyping] = useState(false);

  const { employees, orders, inventory } = useData();
  const { language } = useSettings();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Auto-scroll chat body
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, liveInterim]);

  // Sync speech service mute state
  useEffect(() => {
    speechService.setMuted(isMuted);
  }, [isMuted]);

  // Handle Voice Command & Response Engine
  const executeCommand = useCallback(
    (text, wasVoice = false) => {
      if (!text || !text.trim()) return;

      // Clean prefixes like '🗣️ Tanglish: ', '🗣️ தமிழ்: ', etc.
      const cleaned = text
        .replace(/^🗣️\s*[^:]*:\s*/, "")
        .replace(/^["'“”]|["'“”]$/g, "")
        .trim();

      if (!cleaned) return;

      const detected =
        activeSpeechLang !== "auto" ? activeSpeechLang : detectLanguage(cleaned);
      setLastDetectedLang(detected);

      // 1. Add User message to chat
      const userMsg = {
        id: Date.now(),
        sender: "user",
        text: cleaned,
        wasVoice
      };
      setMessages((prev) => [...prev, userMsg]);
      setInputText("");
      setLiveInterim("");
      setTyping(true);

      setTimeout(() => {
        // 2. Process Intent & Navigation
        const result = processVoiceCommand(
          cleaned,
          { employees, orders, inventory },
          activeSpeechLang !== "auto" ? activeSpeechLang : null
        );

        // 3. Perform Navigation if requested
        if (result.type === "navigation") {
          if (result.action === "BACK") {
            navigate(-1);
          } else if (result.route) {
            navigate(result.route);
          }
        }

        // 4. Voice Response (Text-to-Speech)
        if (!isMuted && result.spokenText) {
          speechService.speak(result.spokenText, result.detectedLang || detected);
        }

        // 5. Add AI Message to chat
        const aiMsg = {
          id: Date.now() + 1,
          sender: "ai",
          text: result.responseText,
          cards: result.cards,
          link: result.link,
          linkText: result.linkText,
          detectedLang: result.detectedLang || detected
        };
        setMessages((prev) => [...prev, aiMsg]);
        setTyping(false);
      }, 350);
    },
    [activeSpeechLang, employees, orders, inventory, isMuted, navigate]
  );

  // Start / Toggle Microphone Listening
  const handleToggleMic = async () => {
    setMicError(null);

    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      setLiveInterim("");
      setMicVolume(0);
      return;
    }

    // Determine recognition dialect
    // 'en-IN' is ideal for Indian English and Tanglish (e.g. "Employee page-ku po", "Analytics open pannu")
    let recLang = "en-IN";
    if (activeSpeechLang === "ta") recLang = "ta-IN";
    else if (activeSpeechLang === "hi") recLang = "hi-IN";
    else if (activeSpeechLang === "en") recLang = "en-IN";
    else if (language === "ta") recLang = "ta-IN";
    else if (language === "hi") recLang = "hi-IN";
    else recLang = "en-IN";

    const started = await speechService.startListening({
      lang: recLang,
      onStart: () => {
        setIsListening(true);
        if (!isOpen) setIsOpen(true);
      },
      onVolume: (vol) => {
        setMicVolume(vol);
      },
      onResult: ({ transcript, isFinal, volume }) => {
        setLiveInterim(transcript);
        if (volume !== undefined) setMicVolume(volume);
        if (isFinal && transcript.trim()) {
          speechService.stopListening();
          setIsListening(false);
          setMicVolume(0);
          executeCommand(transcript, true);
        }
      },
      onError: ({ message }) => {
        setIsListening(false);
        setMicVolume(0);
        setMicError(message);
      },
      onEnd: (finalTranscript) => {
        setIsListening(false);
        setMicVolume(0);
        if (finalTranscript && finalTranscript.trim()) {
          executeCommand(finalTranscript, true);
        }
      }
    });

    if (!started && !speechService.isRecognitionSupported()) {
      setMicError(
        "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge."
      );
    }
  };

  const handleSendText = (e) => {
    if (e) e.preventDefault();
    if (inputText.trim()) {
      executeCommand(inputText, false);
    }
  };

  return (
    <div className="ai-chatbot-root">
      {/* Floating Activation Button */}
      <button
        className={`ai-float-btn ${isListening ? "listening" : ""} ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title={isListening ? "Listening... Click to close" : "Open ISE Multilingual AI Voice Assistant"}
      >
        <span className="ai-icon">{isListening ? "🎙️" : "🪔"}</span>
        <span className="ai-pulse" />
      </button>

      {/* Main Chat & Voice Window */}
      {isOpen && (
        <div className="ai-chat-window">
          {/* Header */}
          <div className="ai-chat-header">
            <div className="header-brand">
              <span className="bot-avatar">🤖</span>
              <div>
                <div className="bot-name">ISE AI Voice Agent</div>
                <div className="bot-status">
                  <span style={{ color: "#10B981" }}>●</span> Multilingual Voice &amp; Navigation
                </div>
              </div>
            </div>

            <div className="header-actions">
              {/* Voice Mute / Unmute Button */}
              <button
                className="header-icon-btn"
                onClick={() => setIsMuted(!isMuted)}
                title={isMuted ? "Unmute Voice Responses" : "Mute Voice Responses"}
              >
                {isMuted ? "🔇" : "🔊"}
              </button>

              {/* Close Button */}
              <button
                className="header-icon-btn"
                onClick={() => {
                  speechService.stopListening();
                  speechService.cancelSpeech();
                  setIsListening(false);
                  setIsOpen(false);
                }}
                title="Close Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Multilingual Dialect Selector Toolbar */}
          <div className="ai-lang-toolbar">
            <div style={{ fontWeight: 600, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
              <span>🎙️ Mic Dialect:</span>
            </div>
            <div className="lang-chip-group">
              <button
                className={`lang-chip ${activeSpeechLang === "en" ? "active" : ""}`}
                onClick={() => setActiveSpeechLang("en")}
                title="Best for Tanglish ('Employee page-ku po', 'Analytics open pannu') and English"
              >
                English / Tanglish
              </button>
              <button
                className={`lang-chip ${activeSpeechLang === "ta" ? "active" : ""}`}
                onClick={() => setActiveSpeechLang("ta")}
                title="Best for pure Tamil script ('பணியாளர் பக்கம்', 'அனலிடிக்ஸ்')"
              >
                தமிழ்
              </button>
              <button
                className={`lang-chip ${activeSpeechLang === "hi" ? "active" : ""}`}
                onClick={() => setActiveSpeechLang("hi")}
                title="Best for Hindi ('कर्मचारी पेज', 'डैशबोर्ड')"
              >
                हिन्दी
              </button>
            </div>

            {lastDetectedLang && (
              <span className="detected-lang-badge">
                {lastDetectedLang === "ta" ? "தமிழ்" : lastDetectedLang === "hi" ? "हिन्दी" : "English"}
              </span>
            )}
          </div>

          {/* Helpful Tanglish Tip Banner */}
          <div className="ai-dialect-hint">
            <span>💡 <strong>Tip:</strong> Tanglish (<em>"Employee page-ku po"</em>, <em>"Analytics open pannu"</em>) பேச <strong>English / Tanglish</strong> மோடை பயன்படுத்தவும்.</span>
          </div>

          {/* Listening Status Bar with live volume soundwave */}
          {isListening && (
            <div className="listening-banner">
              <div className="listening-indicator">
                <div className="soundwave-bars">
                  <span
                    className="soundwave-bar"
                    style={{ height: `${Math.max(6, Math.min(22, micVolume * 0.35))}px` }}
                  />
                  <span
                    className="soundwave-bar"
                    style={{ height: `${Math.max(10, Math.min(26, micVolume * 0.65))}px` }}
                  />
                  <span
                    className="soundwave-bar"
                    style={{ height: `${Math.max(14, Math.min(28, micVolume * 0.85))}px` }}
                  />
                  <span
                    className="soundwave-bar"
                    style={{ height: `${Math.max(8, Math.min(24, micVolume * 0.5))}px` }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {micVolume > 6 ? "🟢 Hearing your voice..." : "🎙️ Listening... Speak now"}
                  </div>
                  {liveInterim ? (
                    <div style={{ fontSize: "11px", color: "#1E3A8A", fontWeight: 500, maxWidth: "210px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      "{liveInterim}"
                    </div>
                  ) : (
                    <div style={{ fontSize: "10.5px", color: "var(--muted)", fontWeight: 400 }}>
                      Say: "Employee page-ku po" or "Open Analytics"
                    </div>
                  )}
                </div>
              </div>
              <button className="stop-mic-btn" onClick={handleToggleMic}>
                Stop &amp; Send
              </button>
            </div>
          )}

          {/* Microphone Error Message Banner */}
          {micError && (
            <div className="ai-error-banner">
              <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span style={{ fontSize: "16px" }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#991B1B", marginBottom: 2 }}>
                    மைக் அனுமதி தேவை (Microphone Access Needed)
                  </div>
                  <div style={{ color: "#7F1D1D", lineHeight: 1.35 }}>
                    {micError}
                  </div>
                  <div style={{ fontSize: "10.5px", marginTop: 4, color: "#B45309" }}>
                    👉 பிரவுசரின் URL பாரில் உள்ள 🔒 அல்லது 🎙️ ஐகானை கிளிக் செய்து <strong>Microphone: Allow</strong> செய்யவும்.
                  </div>
                </div>
              </div>
              <button
                onClick={() => setMicError(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#B45309", fontWeight: 700, fontSize: "14px" }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Chat Body */}
          <div className="ai-chat-body">
            {messages.map((m) => (
              <div key={m.id} className={`chat-bubble-wrap ${m.sender}`}>
                <div className="chat-bubble">
                  {m.wasVoice && (
                    <div className="user-voice-tag">
                      <span>🎙️ Spoken Voice Command</span>
                    </div>
                  )}

                  <div className="bubble-text" style={{ whiteSpace: "pre-line" }}>
                    {m.text}
                  </div>

                  {m.cards && (
                    <div className="bubble-cards">
                      {m.cards.map((c, idx) => (
                        <div key={idx} className="card-item">{c}</div>
                      ))}
                    </div>
                  )}

                  {m.link && (
                    <button
                      className="ai-action-btn"
                      onClick={() => {
                        navigate(m.link);
                        setIsOpen(false);
                      }}
                    >
                      {m.linkText || "View Page →"}
                    </button>
                  )}

                  {m.quickPrompts && (
                    <div className="quick-prompts-grid">
                      {m.quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          className="prompt-chip"
                          onClick={() => executeCommand(prompt, true)}
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Live interim recognized speech display */}
            {isListening && liveInterim && (
              <div className="chat-bubble-wrap user">
                <div className="chat-bubble" style={{ opacity: 0.92, fontStyle: "italic", background: "var(--blue-xs)", color: "var(--blue)", border: "1px solid var(--blue)" }}>
                  <div className="user-voice-tag" style={{ color: "var(--blue)" }}>🎙️ Hearing voice:</div>
                  "{liveInterim}"
                </div>
              </div>
            )}

            {typing && (
              <div className="chat-bubble-wrap ai">
                <div className="chat-bubble typing-bubble">
                  <span>●</span><span>●</span><span>●</span> Processing voice command...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Footer with Mic Button & Input Form */}
          <form className="ai-chat-footer" onSubmit={handleSendText}>
            {/* Microphone Button */}
            <button
              type="button"
              className={`ai-mic-btn ${isListening ? "active" : ""}`}
              onClick={handleToggleMic}
              title={isListening ? "Click to Stop Listening" : "Click to Speak (Tanglish / English / தமிழ் / हिन्दी)"}
            >
              {isListening ? "⏹️" : "🎙️"}
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isListening
                  ? "Listening to voice..."
                  : "Say: 'Employee page-ku po', 'Open Analytics'..."
              }
              className="ai-input"
            />

            <button type="submit" className="ai-send-btn" title="Send command">
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

