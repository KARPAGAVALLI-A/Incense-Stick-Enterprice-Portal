import React, { useState, useEffect } from "react";
import { useSettings } from "../context/SettingsContext";
import "./ProductQrScanner.css";

const ANNOUNCEMENT_TRANSLATIONS = {
  en: {
    langLabel: "English",
    title: "📷 Product Box QR Code & Price Announcement",
    sub: "Scan box QR tag to trigger smart audio-visual offer announcement",
    scanLabel: "Scan or click below to play announcement",
    badge: "📢 SMART PRICE ANNOUNCEMENT",
    playing: "🔊 Playing Voice Announcement...",
    playBtn: "🔊 Play Voice Price Announcement →",
    stopBtn: "⏹️ Stop Audio Announcement",
    saveLabel: "Save ₹30 (20% OFF) + 10% Extra Sticks Free",
    batchLabel: "Batch",
    mfgLabel: "Mfg",
    fragranceLabel: "Fragrance Profile",
    guaranteeLabel: "Guarantee",
    fragranceValue: "Mysore Sandalwood & Natural Resin",
    guaranteeValue: "100% Charcoal Free & Eco-Friendly",
    closeScanner: "Close Scanner",
    voiceLang: "en-IN",
    speechText: (name) =>
      `Incense Stick Enterprise Festive Announcement! ${name}, Festive Offer Price 120 Rupees, original MRP 150 Rupees. Save 30 Rupees with 20% discount plus 10% extra sticks free. Enjoy divine fragrance and long-lasting aroma!`
  },
  ta: {
    langLabel: "தமிழ்",
    title: "📷 தயாரிப்பு QR குறியீடு & குரல் விலை அறிவிப்பு",
    sub: "ஸ்மார்ட் ஆடியோ-விஷுவல் சலுகை அறிவிப்பை இயக்க QR-ஐ ஸ்கேன் செய்யவும்",
    scanLabel: "அறிவிப்பைக் கேட்க கீழே கிளிக் செய்யவும்",
    badge: "📢 ஸ்மார்ட் குரல் விலை அறிவிப்பு",
    playing: "🔊 குரல் அறிவிப்பு ஒலிக்கிறது...",
    playBtn: "🔊 குரல் விலை அறிவிப்பை இயக்கு →",
    stopBtn: "⏹️ குரல் அறிவிப்பை நிறுத்து",
    saveLabel: "சேமிப்பு ₹30 (20% தள்ளுபடி) + 10% கூடுதல் இலவசம்",
    batchLabel: "தொகுதி",
    mfgLabel: "உற்பத்தி",
    fragranceLabel: "நறுமண விபரம்",
    guaranteeLabel: "உத்தரவாதம்",
    fragranceValue: "மைசூர் சந்தனம் மற்றும் இயற்கை பிசின்",
    guaranteeValue: "100% கரிக்கூழ் இல்லாதது & சுற்றுச்சூழல் நட்பு",
    closeScanner: "ஸ்கேனரை மூடு",
    voiceLang: "ta-IN",
    speechText: (name) =>
      `அகர்பத்தி நிறுவனம் சிறப்பு பண்டிகை அறிவிப்பு! ${name}, சிறப்பு சலுகை விலை நூற்று இருபது ரூபாய், அசல் விலை நூற்று ஐம்பது ரூபாய். முப்பது ரூபாய் சேமிப்புடன் இருபது சதவீத தள்ளுபடி மற்றும் பத்து சதவீதம் கூடுதல் குச்சிகள் முற்றிலும் இலவசம். தெய்வீக நறுமணத்தை அனுபவியுங்கள்!`
  },
  hi: {
    langLabel: "हिन्दी",
    title: "📷 उत्पाद क्यूआर कोड और ध्वनि मूल्य घोषणा",
    sub: "स्मार्ट ऑडियो-विजुअल ऑफर घोषणा चलाने के लिए क्यूआर स्कैन करें",
    scanLabel: "घोषणा सुनने के लिए नीचे क्लिक करें",
    badge: "📢 स्मार्ट ध्वनि मूल्य घोषणा",
    playing: "🔊 ऑडियो घोषणा चल रही है...",
    playBtn: "🔊 ध्वनि मूल्य घोषणा सुनें →",
    stopBtn: "⏹️ ध्वनि घोषणा बंद करें",
    saveLabel: "बचत ₹30 (20% छूट) + 10% अतिरिक्त अगरबत्तियां मुफ्त",
    batchLabel: "बैच",
    mfgLabel: "निर्माण",
    fragranceLabel: "सुगंध प्रोफ़ाइल",
    guaranteeLabel: "गारंटी",
    fragranceValue: "मैसूर चंदन और प्राकृतिक राल",
    guaranteeValue: "100% चारकोल मुक्त और पर्यावरण-अनुकूल",
    closeScanner: "स्कैनर बंद करें",
    voiceLang: "hi-IN",
    speechText: (name) =>
      `इन्सेंस स्टिक एंटरप्राइज विशेष घोषणा! ${name}, फेस्टिव ऑफर मूल्य एक सौ बीस रुपये, मूल एमआरपी एक सौ पचास रुपये। तीस रुपये की बचत के साथ बीस प्रतिशत छूट और दस प्रतिशत अतिरिक्त अगरबत्तियां मुफ्त। दिव्य सुगंध का आनंद लें!`
  },
  te: {
    langLabel: "తెలుగు",
    title: "📷 ఉత్పత్తి QR కోడ్ & వాయిస్ ధర ప్రకటన",
    sub: "స్మార్ట్ ఆడియో-విజువల్ ఆఫర్ ప్రకటన కోసం బాక్స్ QR ట్యాగ్‌ను స్కాన్ చేయండి",
    scanLabel: "ప్రకటన వినడానికి క్రింద క్లిక్ చేయండి",
    badge: "📢 స్మార్ట్ వాయిస్ ధర ప్రకటన",
    playing: "🔊 వాయిస్ ప్రకటన ప్లే అవుతోంది...",
    playBtn: "🔊 వాయిస్ ధర ప్రకటన వినండి →",
    stopBtn: "⏹️ ఆడియో ప్రకటనను ఆపివేయి",
    saveLabel: "ఆదా ₹30 (20% తగ్గింపు) + 10% అదనపు స్టిక్స్ ఉచితం",
    batchLabel: "బ్యాచ్",
    mfgLabel: "తయారీ",
    fragranceLabel: "సువాసన వివరాలు",
    guaranteeLabel: "హామీ",
    fragranceValue: "మైసూర్ గంధం & సహజ రెసిన్",
    guaranteeValue: "100% బొగ్గు రహితం & పర్యావరణ అనుకూలం",
    closeScanner: "స్కానర్ మూసివేయి",
    voiceLang: "te-IN",
    speechText: (name) =>
      `ఇన్సెన్స్ స్టిక్ ఎంటర్‌ప్రైజ్ పండుగ ఆఫర్ ప్రకటన! ${name}, పండుగ ఆఫర్ ధర నూట ఇరవై రూపాయలు, అసలు ఎంఆర్పీ నూట యాభై రూపాయలు. ముప్పై రూపాయల ఆదా మరియు పది శాతం అదనపు అగర్‌బత్తీలు ఉచితం. దివ్యమైన సువాసనను ఆస్వాదించండి!`
  },
  ml: {
    langLabel: "മലയാളം",
    title: "📷 ഉൽപ്പന്ന ബോക്സ് QR കോഡും വോയ്സ് വില അറിയിപ്പും",
    sub: "സ്മാർട്ട് ഓഡിയോ-വിഷ്വൽ ഓഫർ അറിയിപ്പ് കേൾക്കാൻ QR സ്കാൻ ചെയ്യുക",
    scanLabel: "അറിയിപ്പ് കേൾക്കാൻ താഴെ ക്ലിക്ക് ചെയ്യുക",
    badge: "📢 സ്മാർട്ട് വോയ്സ് വില അറിയിപ്പ്",
    playing: "🔊 വോയ്സ് അറിയിപ്പ് പ്ലേ ചെയ്യുന്നു...",
    playBtn: "🔊 വോയ്സ് വില അറിയിപ്പ് കേൾക്കൂ →",
    stopBtn: "⏹️ വോയ്സ് അറിയിപ്പ് നിർത്തുക",
    saveLabel: "ലാഭം ₹30 (20% കിഴിവ്) + 10% അധിക സ്റ്റിക്കുകൾ സൗജന്യം",
    batchLabel: "ബാച്ച്",
    mfgLabel: "നിർമ്മാണം",
    fragranceLabel: "സുഗന്ധ വിവരങ്ങൾ",
    guaranteeLabel: "ഗ്യാരണ്ടി",
    fragranceValue: "മൈസൂർ ചന്ദനവും പ്രകൃതിദത്ത റെസിനും",
    guaranteeValue: "100% കരി രഹിതവും പരിസ്ഥിതി സൗഹൃദവും",
    closeScanner: "സ്കാനർ അടയ്ക്കുക",
    voiceLang: "ml-IN",
    speechText: (name) =>
      `ഇൻസെൻസ് സ്റ്റിക്ക് എന്റർപ്രൈസ് പ്രത്യേക ഓഫർ അറിയിപ്പ്! ${name}, ഉത്സവ ഓഫർ വില നൂറ്റി ഇരുപത് രൂപ, യഥാർത്ഥ വില നൂറ്റമ്പത് രൂപ. മുപ്പത് രൂപ ലാഭിക്കൂ കൂടാതെ പത്ത് ശതമാനം അധിക സ്റ്റിക്കുകൾ സൗജന്യം. ദിവ്യ സുഗന്ധം ആസ്വദിക്കൂ!`
  }
};

const LANGUAGES = [
  { code: "en", label: "EN", flag: "🇬🇧", name: "English" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳", name: "Tamil" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳", name: "Hindi" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳", name: "Telugu" },
  { code: "ml", label: "മലയാളം", flag: "🇮🇳", name: "Malayalam" }
];

export default function ProductQrScanner({ product, onClose }) {
  const { language: sysLang } = useSettings();
  const [selectedLang, setSelectedLang] = useState(() => {
    return ANNOUNCEMENT_TRANSLATIONS[sysLang] ? sysLang : "ta";
  });
  const [announcementPlayed, setAnnouncementPlayed] = useState(false);

  // Sync if system language changes initially
  useEffect(() => {
    if (ANNOUNCEMENT_TRANSLATIONS[sysLang]) {
      setSelectedLang(sysLang);
    }
  }, [sysLang]);

  // Clean up any ongoing speech synthesis on unmount or language change
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedLang]);

  const t = ANNOUNCEMENT_TRANSLATIONS[selectedLang] || ANNOUNCEMENT_TRANSLATIONS.en;

  const prodName = product?.name || "Chandan Supreme 100g";
  const offerPrice = "₹120";
  const originalMrp = "₹150";

  function handleStopAudio() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setAnnouncementPlayed(false);
  }

  function handlePlayAudioAnnouncement() {
    if (announcementPlayed) {
      handleStopAudio();
      return;
    }

    if (!("speechSynthesis" in window)) {
      alert("Speech synthesis is not supported in this browser.");
      return;
    }

    // Cancel any previous utterance
    window.speechSynthesis.cancel();

    const textToSpeak = t.speechText(prodName);
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = t.voiceLang;
    utterance.rate = 0.92;
    utterance.pitch = 1.0;

    // Pick best native voice matching language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const targetLang = t.voiceLang.toLowerCase();
      const prefix = targetLang.split("-")[0];
      const matched =
        voices.find((v) => v.lang.toLowerCase() === targetLang) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix)) ||
        voices.find((v) => v.lang.toLowerCase().includes("in"));

      if (matched) {
        utterance.voice = matched;
      }
    }

    utterance.onstart = () => {
      setAnnouncementPlayed(true);
    };

    utterance.onend = () => {
      setAnnouncementPlayed(false);
    };

    utterance.onerror = () => {
      setAnnouncementPlayed(false);
    };

    window.speechSynthesis.speak(utterance);
    setAnnouncementPlayed(true);
  }

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qr-modal-header">
          <div>
            <div className="qr-title">{t.title}</div>
            <div className="qr-sub">{t.sub}</div>
          </div>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Multilingual Selector Bar */}
        <div className="qr-lang-bar">
          <span className="qr-lang-hint">🌐 Voice Language / மொழி:</span>
          <div className="qr-lang-pills">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                type="button"
                className={`qr-lang-btn ${selectedLang === lang.code ? "active" : ""}`}
                onClick={() => {
                  handleStopAudio();
                  setSelectedLang(lang.code);
                }}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* QR Code Graphic & Product Box Card */}
        <div className="qr-body">
          <div className="qr-code-wrapper">
            {/* Simulated Generated QR Code Graphic */}
            <div className="qr-graphic">
              <div className="qr-corner top-left" />
              <div className="qr-corner top-right" />
              <div className="qr-corner bottom-left" />
              <div className="qr-center-icon">🪔</div>
            </div>
            <div className="qr-tag-label">{t.scanLabel}</div>
          </div>

          {/* AUDIO-VISUAL PRICE ANNOUNCEMENT CARD */}
          <div className={`announcement-card ${announcementPlayed ? "active-playing" : ""}`}>
            <div className="ac-header">
              <span className="ac-badge">{t.badge}</span>
              {announcementPlayed && (
                <div className="sound-wave-box">
                  <span className="wave-bar bar1" />
                  <span className="wave-bar bar2" />
                  <span className="wave-bar bar3" />
                  <span className="wave-bar bar4" />
                  <span className="sound-wave-text">{t.playing}</span>
                </div>
              )}
            </div>

            <div className="ac-product-name">🪔 {prodName}</div>

            <div className="ac-price-row">
              <span className="offer-mrp">{offerPrice}</span>
              <span className="original-mrp">{originalMrp}</span>
              <span className="save-badge">{t.saveLabel}</span>
            </div>

            <div className="ac-details">
              • {t.batchLabel}: <b>SAL-2026-CH04</b> · {t.mfgLabel}: July 2026
              <br />
              • {t.fragranceLabel}: <b>{t.fragranceValue}</b>
              <br />
              • {t.guaranteeLabel}: <b>{t.guaranteeValue}</b>
            </div>

            <div className="voice-actions-row">
              <button
                className={`btn-announce-voice ${announcementPlayed ? "is-playing" : ""}`}
                onClick={handlePlayAudioAnnouncement}
              >
                {announcementPlayed ? t.stopBtn : t.playBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="qr-footer">
          <button className="btn btn-outline" onClick={onClose}>
            {t.closeScanner}
          </button>
        </div>
      </div>
    </div>
  );
}
