// ستايل سايا — design tokens (canvas 1080×1920, 30 fps).
// House rules (CLAUDE.md) apply: HOUSE_GRADE on footage. The house font
// (Tahrir) is NOT used: Saya uses Cairo (feedback rule 2). Spoken word in HOUSE_ACTIVE_WORD.
import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";
import {HOUSE_ACTIVE_GLOW, HOUSE_ACTIVE_WORD, HOUSE_GRADE} from "../shared/house";

export const SAYA_FPS = 30;

// Font: Cairo (Arabic + Latin). The user asked to drop the house font (Tahrir)
// for Saya — "هاد الخط سيء" — and go back to the earlier font (feedback rule 2).
export const sayaFonts = Promise.all([
  loadFont({family: "SayaLat", url: staticFile("fonts/cairo-latin-700-normal.woff2"), weight: "700"}),
  loadFont({family: "SayaLat", url: staticFile("fonts/cairo-latin-900-normal.woff2"), weight: "900"}),
  loadFont({family: "SayaAr", url: staticFile("fonts/cairo-arabic-700-normal.woff2"), weight: "700"}),
  loadFont({family: "SayaAr", url: staticFile("fonts/cairo-arabic-900-normal.woff2"), weight: "900"}),
]);

export const SAYA = {
  font: "SayaLat, SayaAr, sans-serif",
  grade: HOUSE_GRADE,
  color: {
    neon: "#1E90FF", // أزرق نيون — glows, rings, accents
    navy: "#0B1B3F", // كحلي — plates, glass, backgrounds
    sky: HOUSE_ACTIVE_WORD, // سماوي — spoken word, small accents
    skyGlow: HOUSE_ACTIVE_GLOW,
    white: "#FFFFFF",
    grey: "#A9B4C8",
  },
  /** Instagram Reels safe zone: keep captions and key graphics inside. */
  safe: {left: 80, right: 940, top: 280, bottom: 1400},
  /** Caption: centred on the frame width (540) inside the safe zone, low on the
   *  chest, bigger text (feedback rule 2). */
  caption: {size: 76, chestY: 1270, topY: 340, left: 140, width: 800, maxWords: 3, maxChars: 18},
  textShadow: "0 3px 12px rgba(0,0,0,0.55)",
  /** Spring configs. */
  spring: {
    pop: {damping: 12, stiffness: 180, mass: 0.6},
    rise: {damping: 14, stiffness: 120, mass: 0.8},
    soft: {damping: 20, stiffness: 140},
  },
  blurPx: 22,
} as const;

export const neonGlow = (c: string = SAYA.color.neon, k = 1) =>
  `drop-shadow(0 0 ${4 * k}px ${c}) drop-shadow(0 0 ${14 * k}px ${c}AA) drop-shadow(0 0 ${30 * k}px ${c}55)`;

/** Navy frosted glass used by cards, chips and pills. */
export const navyGlass = (alpha = 0.78): React.CSSProperties => ({
  background: `rgba(11,27,63,${alpha})`,
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1.5px solid rgba(143,211,255,0.35)",
  boxShadow: `0 0 0 1px rgba(30,144,255,0.25), 0 12px 40px rgba(0,0,0,0.45), 0 0 26px rgba(30,144,255,0.35)`,
});

export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
