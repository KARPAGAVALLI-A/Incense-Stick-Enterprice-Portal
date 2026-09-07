import React, { useState } from "react";
import "./ProductQrScanner.css";

export default function ProductQrScanner({ product, onClose }) {
  const [announcementPlayed, setAnnouncementPlayed] = useState(false);

  const prodName = product?.name || "Chandan Supreme 100g";
  const offerPrice = "₹120";
  const originalMrp = "₹150";
  const discountText = "Save ₹30 (20% OFF) + 10% Extra Sticks Free";

  function handlePlayAudioAnnouncement() {
    setAnnouncementPlayed(true);

    if ("speechSynthesis" in window) {
      const textToSpeak = `Incense Stick Enterprise Announcement! ${prodName}, Festive Offer Price, ${offerPrice}, original MRP ${originalMrp}. ${discountText}. Enjoy divine fragrance!`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  }

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="qr-modal-header">
          <div>
            <div className="qr-title">📷 Product Box QR Code &amp; Price Announcement</div>
            <div className="qr-sub">Scan box QR tag to trigger smart audio-visual offer announcement</div>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
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
            <div className="qr-tag-label">Scan or click below to play announcement</div>
          </div>

          {/* AUDIO-VISUAL PRICE ANNOUNCEMENT CARD */}
          <div className={`announcement-card ${announcementPlayed ? "active-playing" : ""}`}>
            <div className="ac-header">
              <span className="ac-badge">📢 SMART PRICE ANNOUNCEMENT</span>
              {announcementPlayed && <span className="sound-wave">🔊 Playing Voice...</span>}
            </div>

            <div className="ac-product-name">🪔 {prodName}</div>
            
            <div className="ac-price-row">
              <span className="offer-mrp">{offerPrice}</span>
              <span className="original-mrp">{originalMrp}</span>
              <span className="save-badge">{discountText}</span>
            </div>

            <div className="ac-details">
              • Batch: <b>SAL-2026-CH04</b> · Mfg: July 2026<br />
              • Fragrance Profile: Mysore Sandalwood &amp; Natural Resin<br />
              • Guarantee: 100% Charcoal Free &amp; Eco-Friendly
            </div>

            <button className="btn-announce-voice" onClick={handlePlayAudioAnnouncement}>
              🔊 Play Voice Price Announcement →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="qr-footer">
          <button className="btn btn-outline" onClick={onClose}>Close Scanner</button>
        </div>
      </div>
    </div>
  );
}
