import React, { useEffect, useState } from "react";
import IseLogoSvg from "./IseLogoSvg";
import "./LoadingScreen.css";

export default function LoadingScreen() {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="loader-screen image-bg-screen">
      {/* Full Real-World Incense Background Image Overlay */}
      <div className="loader-bg-image" style={{ backgroundImage: `url('/incense-bg.png')` }} />
      <div className="loader-bg-overlay" />

      {/* Main Center Content Container */}
      <div className={`loader-content-box ${fadeIn ? "visible" : ""}`}>
        {/* Official Circular ISE Logo Emblem */}
        <div className="loader-logo-circle">
          <IseLogoSvg width={120} height={120} lightMode={false} />
        </div>

        <div className="loader-brand-name">ISE SYSTEM</div>
        <div className="loader-brand-sub">INCENSE STICK ENTERPRISE</div>

        {/* Loading Progress Bar */}
        <div className="loader-progress-bar">
          <div className="loader-progress-fill" />
        </div>

        <div className="loader-caption-text">
          ✨ Crafting Fragrance with Enterprise Perfection…
        </div>
      </div>
    </div>
  );
}
