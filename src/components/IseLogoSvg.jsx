import React from "react";

export default function IseLogoSvg({ width = 72, height = 72, lightMode = false }) {
  const primaryColor = lightMode ? "#1E293B" : "#FFFFFF";
  const ringColor = lightMode ? "#2563EB" : "#3B82F6";
  const smokeColor = lightMode ? "#3B82F6" : "#60A5FA";

  return (
    <svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Double Circle Ring */}
      <circle cx="100" cy="100" r="92" stroke={ringColor} strokeWidth="3" />
      <circle cx="100" cy="100" r="86" stroke={primaryColor} strokeWidth="2" opacity="0.9" />

      {/* Monogram 'iS' with Incense Stick Smoke */}
      {/* Dot of 'i' as ember */}
      <circle cx="83" cy="74" r="4.5" fill={smokeColor} />
      
      {/* Smoke swirl rising from 'i' */}
      <path
        d="M83 66 C80 58, 86 50, 83 42 C81 36, 85 30, 83 24"
        stroke={smokeColor}
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* 'i' stick */}
      <rect x="80.5" y="82" width="5" height="38" rx="2.5" fill={primaryColor} />

      {/* 'S' loop connecting smoothly */}
      <path
        d="M85 92 C115 75, 125 105, 95 115 C75 122, 105 140, 122 120"
        stroke={primaryColor}
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />

      {/* Text: INCENSE STICK ENTERPRISE */}
      <text
        x="100"
        y="152"
        textAnchor="middle"
        fill={primaryColor}
        fontSize="12.5"
        fontWeight="800"
        letterSpacing="1.2"
        fontFamily="'DM Sans', sans-serif"
      >
        INCENSE STICK
      </text>
      <text
        x="100"
        y="167"
        textAnchor="middle"
        fill={primaryColor}
        fontSize="12.5"
        fontWeight="800"
        letterSpacing="1.2"
        fontFamily="'DM Sans', sans-serif"
      >
        ENTERPRISE
      </text>
    </svg>
  );
}
