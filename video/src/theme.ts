import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";

export const FONT = "CairoLatin, CairoArabic, sans-serif";

export const fontsLoaded = Promise.all([
  loadFont({family: "CairoArabic", url: staticFile("fonts/cairo-arabic-700-normal.woff2"), weight: "700"}),
  loadFont({family: "CairoArabic", url: staticFile("fonts/cairo-arabic-900-normal.woff2"), weight: "900"}),
  loadFont({family: "CairoLatin", url: staticFile("fonts/cairo-latin-700-normal.woff2"), weight: "700"}),
  loadFont({family: "CairoLatin", url: staticFile("fonts/cairo-latin-900-normal.woff2"), weight: "900"}),
]);

export const C = {
  white: "#FFFFFF",
  ink: "#0B0B12",
  yellow: "#FFD60A",
  red: "#FF2D55",
  green: "#34C759",
  grey: "#8E8E93",
  card: "rgba(18,18,28,0.88)",
  igGradient:
    "linear-gradient(45deg, #FEDA75 0%, #FA7E1E 25%, #D62976 50%, #962FBF 75%, #4F5BD5 100%)",
};

export const textStroke = (px: number, color = C.ink): React.CSSProperties => ({
  WebkitTextStroke: `${px}px ${color}`,
  paintOrder: "stroke fill",
});
