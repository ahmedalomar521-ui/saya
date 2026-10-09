// ستايل 2 — design tokens (measured from the reference reel, scaled to 1080×1920).
import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";
import {HOUSE_GRADE} from "../shared/house";

export const style2Fonts = Promise.all([
  loadFont({family: "S2Ar", url: staticFile("fonts/cairo-arabic-800-normal.woff2"), weight: "800"}),
  loadFont({family: "S2Ar", url: staticFile("fonts/cairo-arabic-900-normal.woff2"), weight: "900"}),
  loadFont({family: "S2Lat", url: staticFile("fonts/cairo-latin-900-normal.woff2"), weight: "900"}),
]);

export const S2 = {
  font: "S2Lat, S2Ar, sans-serif",
  color: {
    glow: "#F8E08A", // warm glowing caption yellow
    glowDeep: "#F0B84A",
    red: "#E8283A", // emphasis words / highlight bar
    redGlow: "#FF3B3B",
    ink: "#1E1E22", // text on light inserts
    mint1: "#F3F6F5",
    mint2: "#BFE6D6",
    mint3: "#8FD8B0",
    paper1: "#FFFFFF",
    paper2: "#C9CACC",
    chipOrange: ["#FF9B5E", "#F2683A"],
    chipRed: ["#FF6B6B", "#E23B46"],
    chipGreen: ["#62D97A", "#2FB653"],
    chipPurple: ["#A98BFF", "#7B5CF0"],
  },
  size: {caption: 96, captionSmall: 80},
  layout: {W: 1080, H: 1920, captionTop: 1020},
  // House rule: footage colour stays almost untouched (see styles/shared/house.ts).
  grade: HOUSE_GRADE,
};

export const glowShadow = (c = S2.color.glowDeep) =>
  [
    `0 0 4px ${c}`,
    `0 0 14px ${c}cc`,
    `0 0 30px ${c}99`,
    `0 0 60px ${c}55`,
    "0 4px 10px rgba(0,0,0,0.55)",
  ].join(", ");

// ---- Kashida (tatweel) stretching, the signature of this style ----------
// Letters that do NOT connect to the following letter.
const NON_JOINERS = new Set("اأإآدذرزوؤةءى".split(""));
const isArabicLetter = (ch: string) => /[ء-ي]/.test(ch);

/** Inserts `n` tatweels after the last letter that joins forward. */
export const stretchWord = (word: string, n: number): string => {
  if (n <= 0) return word;
  const chars = Array.from(word);
  for (let i = chars.length - 2; i >= 0; i--) {
    if (isArabicLetter(chars[i]) && !NON_JOINERS.has(chars[i]) && isArabicLetter(chars[i + 1])) {
      chars.splice(i + 1, 0, "ـ".repeat(n));
      return chars.join("");
    }
  }
  return word;
};

/** Deterministic pick of which words get stretched (≈ every other word). */
export const autoStretch = (word: string, index: number): string => {
  const letters = Array.from(word).filter(isArabicLetter).length;
  if (letters < 3) return word;
  const h = Array.from(word).reduce((a, c) => a + c.charCodeAt(0), index * 7);
  return h % 2 === 0 ? stretchWord(word, 2 + (h % 3)) : word;
};
