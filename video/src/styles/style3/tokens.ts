// ستايل 3 — design tokens (reference 720×1280, scaled ×1.5).
import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";
import {HOUSE_GRADE} from "../shared/house";

const f = (file: string) => staticFile(`fonts/style3/${file}`);

export const style3Fonts = Promise.all([
  // clean sans for the one-word captions
  loadFont({family: "S3SansAr", url: f("ibm-plex-sans-arabic-arabic-700-normal.woff2"), weight: "700"}),
  loadFont({family: "S3SansLat", url: f("ibm-plex-sans-arabic-latin-700-normal.woff2"), weight: "700"}),
  // script / italic serif for emphasis words
  loadFont({family: "S3ScriptAr", url: f("aref-ruqaa-arabic-700-normal.woff2"), weight: "700"}),
  loadFont({family: "S3ScriptLat", url: f("instrument-serif-latin-400-italic.woff2"), style: "italic"}),
]);

export const S3 = {
  font: {
    sans: "S3SansLat, S3SansAr, sans-serif",
    script: "S3ScriptLat, S3ScriptAr, serif",
  },
  color: {
    white: "#FFFFFF",
    accent: "#2BDB7C", // emphasis green (swap per brand)
    red: "#E3262F",
  },
  size: {word: 74, script: 124, caps: 86},
  layout: {captionY: 1150},
  grade: HOUSE_GRADE,
  shadow: "0 2px 4px rgba(0,0,0,0.55), 0 4px 18px rgba(0,0,0,0.55)",
};
