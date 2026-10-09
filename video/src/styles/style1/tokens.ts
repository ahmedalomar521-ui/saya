// ستايل 1 — design tokens.
// Measured from the reference reel (720×1280) and scaled ×1.5 for 1080×1920.
import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";

const f = (file: string) => staticFile(`fonts/style1/${file}`);

export const style1Fonts = Promise.all([
  // Big yellow display word (Arabic: Lalezar, Latin: Rubik Mono One)
  loadFont({family: "S1DisplayAr", url: f("lalezar-arabic-400-normal.woff2")}),
  loadFont({family: "S1DisplayLat", url: f("rubik-mono-one-latin-400-normal.woff2")}),
  // Small handwritten line (Arabic: Marhey, Latin: Permanent Marker)
  loadFont({family: "S1HandAr", url: f("marhey-arabic-600-normal.woff2")}),
  loadFont({family: "S1HandLat", url: f("permanent-marker-latin-400-normal.woff2")}),
  // Captions reuse Cairo (already in public/fonts)
  loadFont({family: "S1CapAr", url: staticFile("fonts/cairo-arabic-700-normal.woff2"), weight: "700"}),
  loadFont({family: "S1CapLat", url: staticFile("fonts/cairo-latin-700-normal.woff2"), weight: "700"}),
]);

export const S1 = {
  font: {
    display: "S1DisplayLat, S1DisplayAr, sans-serif",
    hand: "S1HandLat, S1HandAr, cursive",
    caption: "S1CapLat, S1CapAr, sans-serif",
  },
  color: {
    yellow: "#F8E000", // signature colour — measured from reference
    white: "#FFFFFF",
    ink: "#0A0A0A",
    paper: "#F4F4F5", // light B-roll background (top half)
    lime: "#D4F53C",
    purple: "#B9A3F5",
    blue: "#2F80FF",
    green: "#22E05A",
  },
  size: {
    display: 132, // big yellow word
    hand: 54, // small handwritten line above it
    caption: 50, // talking-head caption
    captionSplit: 46, // boxed caption on the split seam
  },
  layout: {
    W: 1080,
    H: 1920,
    split: 960, // split-screen seam (exactly 50 %)
    titleY: 600, // baseline area of hook / CTA titles (just above the head)
    captionY: 1480, // centre of talking-head captions (~77 %)
  },
  // Talking-head grade: cool, slightly desaturated, darker like the reference.
  grade: "saturate(0.82) contrast(1.06) brightness(0.92) hue-rotate(-4deg)",
};
