// Dynamic Color System: Mathematically generates complete matching UI palette from ANY single primary color.

export function hexToRgb(hex) {
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map((c) => c + c).join("");
  }
  const num = parseInt(cleanHex, 16);
  if (isNaN(num) || cleanHex.length !== 6) {
    return { r: 37, g: 99, b: 235 }; // Default sapphire
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Generate complete palette from any single primary color
export function generateDynamicPalette(primaryColor, isDarkMode = false) {
  // Normalize color to valid hex
  let hex = primaryColor;
  if (!hex || !hex.startsWith("#")) {
    const PRESET_MAP = {
      sapphire: "#2563EB",
      teal: "#1D95AD",
      pink: "#C2185B",
      red: "#D32F2F",
      purple: "#7B1FA2",
      green: "#388E3C",
      amber: "#D97706",
      emerald: "#059669",
      rose: "#C2185B",
      violet: "#7B1FA2"
    };
    hex = PRESET_MAP[primaryColor?.toLowerCase()] || "#2563EB";
  }

  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Compute shades
  const hoverL = Math.max(10, hsl.l - 8);
  const activeL = Math.max(5, hsl.l - 15);
  const lightL = Math.min(78, hsl.l + 12);
  const darkL = Math.max(12, hsl.l - 22);

  const hoverHex = hslToHex(hsl.h, hsl.s, hoverL);
  const activeHex = hslToHex(hsl.h, hsl.s, activeL);
  const lightHex = hslToHex(hsl.h, Math.min(100, hsl.s + 5), lightL);
  const darkHex = hslToHex(hsl.h, hsl.s, darkL);

  // Surface and border calculation (adapts to light or dark mode)
  const surfaceL = isDarkMode ? Math.min(18, Math.max(8, hsl.l * 0.25)) : 96.5;
  const surfaceS = Math.min(isDarkMode ? 40 : 55, hsl.s);
  const surfaceHex = hslToHex(hsl.h, surfaceS, surfaceL);

  const surfaceHoverL = isDarkMode ? surfaceL + 4 : 92.5;
  const surfaceHoverHex = hslToHex(hsl.h, surfaceS, surfaceHoverL);

  const borderL = isDarkMode ? 28 : 84;
  const borderHex = hslToHex(hsl.h, Math.min(50, hsl.s), borderL);

  // Text contrast check: if primary is light, use dark text; else use white text
  const yiq = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  const contrastText = yiq >= 165 ? "#0F172A" : "#FFFFFF";

  return {
    primary: hex,
    hover: hoverHex,
    active: activeHex,
    light: lightHex,
    dark: darkHex,
    surface: surfaceHex,
    surfaceHover: surfaceHoverHex,
    border: borderHex,
    focus: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.25)`,
    glow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.18)`,
    gradient: `linear-gradient(135deg, ${hex} 0%, ${hoverHex} 100%)`,
    contrastText,
    rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    hsl
  };
}

// Apply palette variables to document root
export function applyDynamicTheme(primaryColor, isDarkMode = false) {
  const p = generateDynamicPalette(primaryColor, isDarkMode);
  const root = document.documentElement;

  // Primary palette variables used across ISE System
  root.style.setProperty("--blue", p.primary);
  root.style.setProperty("--blue-hover", p.hover);
  root.style.setProperty("--blue-active", p.active);
  root.style.setProperty("--blue-lt", p.light);
  root.style.setProperty("--blue-xs", p.surface);
  root.style.setProperty("--blue-border", p.border);
  root.style.setProperty("--blue-focus", p.focus);
  root.style.setProperty("--blue-glow", p.glow);
  root.style.setProperty("--blue-gradient", p.gradient);
  root.style.setProperty("--blue-contrast", p.contrastText);
  root.style.setProperty("--blue-rgb", p.rgb);

  // Standard generic aliases
  root.style.setProperty("--primary", p.primary);
  root.style.setProperty("--primary-hover", p.hover);
  root.style.setProperty("--primary-active", p.active);
  root.style.setProperty("--primary-light", p.light);
  root.style.setProperty("--primary-xs", p.surface);
  root.style.setProperty("--primary-border", p.border);
  root.style.setProperty("--primary-focus", p.focus);
  root.style.setProperty("--primary-glow", p.glow);
  root.style.setProperty("--primary-gradient", p.gradient);
  root.style.setProperty("--primary-contrast", p.contrastText);
  root.style.setProperty("--primary-rgb", p.rgb);

  return p;
}

// Preset primary colors requested by the user
export const PRESET_THEME_COLORS = [
  { id: "teal", name: "Teal", hex: "#1D95AD" },
  { id: "pink", name: "Pink", hex: "#C2185B" },
  { id: "red", name: "Red", hex: "#D32F2F" },
  { id: "purple", name: "Purple", hex: "#7B1FA2" },
  { id: "green", name: "Green", hex: "#388E3C" },
  { id: "sapphire", name: "Sapphire Blue", hex: "#2563EB" },
  { id: "amber", name: "Amber Gold", hex: "#D97706" }
];
