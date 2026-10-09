import {loadFont} from "@remotion/fonts";
import {staticFile} from "remotion";

// House rules shared by every style (ستايل 1، ستايل 2، and all future styles).
// Rule: colour changes to the footage must be minimal — barely noticeable.

/** The only grade allowed on footage: a near-neutral touch. */
export const HOUSE_GRADE = "saturate(1.03) contrast(1.02)";

/** Maximum darkness of any vignette laid over footage (0–1). */
export const HOUSE_VIGNETTE_MAX = 0.12;

/** Subtle edge vignette that respects the house limit. */
export const houseVignette = (strength = HOUSE_VIGNETTE_MAX) =>
  `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 60%, rgba(0,0,0,${Math.min(strength, HOUSE_VIGNETTE_MAX)}) 100%)`;

// ---------------------------------------------------------------------------
// Rule 2: the caption colour that follows the speech (the word being spoken)
// is a soft light blue in every style.
export const HOUSE_ACTIVE_WORD = "#8FD3FF";
/** Glow colour to pair with the active word in glowing styles. */
export const HOUSE_ACTIVE_GLOW = "#4FB6FF";

/** Index of the word being spoken inside a caption chunk [start, end). */
export const activeWordIndex = (frame: number, start: number, end: number, words: string[]) => {
  if (frame < start || frame >= end || words.length === 0) return -1;
  const weights = words.map((w) => w.length + 2);
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = start;
  for (let i = 0; i < words.length; i++) {
    acc += ((end - start) * weights[i]) / total;
    if (frame < acc) return i;
  }
  return words.length - 1;
};

// ---------------------------------------------------------------------------
// Rule 3: every montage uses the house font ("خط صيدلية النهدي") for ALL text,
// whatever the style. Put the font file in public/fonts/house/ and set the
// file name here; until then each style falls back to its own fonts.
export const HOUSE_FONT_FILES: {file: string; weight?: string}[] = [
  // e.g. {file: "nahdi-regular.ttf", weight: "400"}, {file: "nahdi-bold.ttf", weight: "700"}
];
export const HOUSE_FONT_FAMILY = "HouseFont";

export const houseFontLoaded = Promise.all(
  HOUSE_FONT_FILES.map((f) => loadFont({family: HOUSE_FONT_FAMILY, url: staticFile(`fonts/house/${f.file}`), weight: f.weight})),
);

/** Prepend the house font to any font stack (no-op until the file is added). */
export const withHouseFont = (stack: string) =>
  HOUSE_FONT_FILES.length ? `${HOUSE_FONT_FAMILY}, ${stack}` : stack;
