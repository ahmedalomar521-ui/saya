// ستايل 4 — design tokens (reference 720×1280, scaled ×1.5).
import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";
import {HOUSE_GRADE, houseFontLoaded, withHouseFont} from "../shared/house";

export const style4Fonts = Promise.all([
  houseFontLoaded,
  loadFont({family: "S4Ar", url: staticFile("fonts/cairo-arabic-700-normal.woff2"), weight: "700"}),
  loadFont({family: "S4Ar", url: staticFile("fonts/cairo-arabic-900-normal.woff2"), weight: "900"}),
  loadFont({family: "S4Lat", url: staticFile("fonts/cairo-latin-700-normal.woff2"), weight: "700"}),
  loadFont({family: "S4Lat", url: staticFile("fonts/cairo-latin-900-normal.woff2"), weight: "900"}),
]);

export const S4 = {
  font: withHouseFont("S4Lat, S4Ar, sans-serif"),
  color: {
    white: "#FFFFFF",
    cyan: "#29D3FF",
    blue: "#3B7BFF",
    magenta: "#FF3DCB",
    pink: "#FF5FA2",
    yellow: "#FFE14A",
    green: "#39FF88",
    bg: "#05060C", // dark studio
  },
  size: {caption: 56, keyTerm: 104, section: 230, hookBig: 170, hookSmall: 46},
  layout: {captionY: 1380, keyTermY: 1180, graphicsTop: 70, graphicsH: 600},
  grade: HOUSE_GRADE,
  textShadow: "0 3px 12px rgba(0,0,0,0.75)",
};

export const neonGlow = (c: string, k = 1) =>
  `drop-shadow(0 0 ${4 * k}px ${c}) drop-shadow(0 0 ${12 * k}px ${c}) drop-shadow(0 0 ${26 * k}px ${c}88)`;
