import {staticFile} from "remotion";

// Saya sound library: video/public/sfx/saya/*.wav, cut from the user's SFX
// reference videos and peak-normalised to -1 dBFS. When to use each sound is in
// .claude/skills/saya-editor/sfx.md. Volumes are relative to the voice at 1.0.

export type SayaSfx =
  // zoom / transitions
  | "whoosh-zoom" | "whoosh-1" | "whoosh-2" | "whoosh-deep" | "swish-whoosh"
  | "cinematic-whoosh" | "whoosh-shine" | "transition-swipe" | "sweep-up"
  | "camera-shutter" | "camera-shutter-2" | "shutter-click" | "camera-flash"
  | "film-burn" | "reverse"
  // attention / emphasis
  | "fuhh" | "click" | "impact" | "impact-deep" | "riser" | "metallic-riser"
  | "tension-keen" | "power-up"
  // meaning
  | "ding" | "cash-register"
  // tech / UI
  | "notification" | "mouse-click" | "keyboard-typing" | "toggle" | "ui-select"
  | "glitch" | "digital-loading" | "glitchy-counter" | "ticks-fast" | "ticks-slow";

export const sayaSfx = (name: SayaSfx) => staticFile(`sfx/saya/${name}.wav`);

/** Default level per sound, so every SFX sits about 10–14 dB under the voice. */
export const SAYA_SFX_VOLUME: Record<SayaSfx, number> = {
  "whoosh-zoom": 0.35, "whoosh-1": 0.35, "whoosh-2": 0.3, "whoosh-deep": 0.3,
  "swish-whoosh": 0.3, "cinematic-whoosh": 0.3, "whoosh-shine": 0.3,
  "transition-swipe": 0.35, "sweep-up": 0.3,
  "camera-shutter": 0.35, "camera-shutter-2": 0.4, "shutter-click": 0.4,
  "camera-flash": 0.3, "film-burn": 0.25, reverse: 0.3,
  fuhh: 0.35, click: 0.4, impact: 0.3, "impact-deep": 0.3, riser: 0.25,
  "metallic-riser": 0.22, "tension-keen": 0.22, "power-up": 0.28,
  ding: 0.35, "cash-register": 0.35,
  notification: 0.4, "mouse-click": 0.45, "keyboard-typing": 0.35, toggle: 0.45,
  "ui-select": 0.4, glitch: 0.28, "digital-loading": 0.3, "glitchy-counter": 0.28,
  "ticks-fast": 0.3, "ticks-slow": 0.3,
};

/**
 * What the edit is doing → which sound to use (first = default, rest = variants
 * to rotate so the same sound does not repeat back to back).
 */
export const SAYA_SFX_FOR = {
  zoomIn: ["whoosh-zoom", "whoosh-1", "swish-whoosh"],
  zoomOut: ["whoosh-zoom", "whoosh-2", "reverse"],
  sceneChange: ["camera-shutter", "camera-shutter-2", "transition-swipe", "cinematic-whoosh"],
  bigTransition: ["whoosh-deep", "cinematic-whoosh", "film-burn", "camera-flash"],
  surprise: ["fuhh", "impact-deep"],
  importantInfo: ["click", "impact"],
  elementPops: ["click", "shutter-click", "ui-select"],
  suspense: ["riser", "metallic-riser", "tension-keen"],
  reveal: ["power-up", "sweep-up", "whoosh-shine"],
  correct: ["ding"],
  money: ["cash-register"],
  phoneNotification: ["notification"],
  tapOrClick: ["mouse-click", "ui-select"],
  toggleSetting: ["toggle"],
  typing: ["keyboard-typing"],
  techGlitch: ["glitch"],
  loading: ["digital-loading"],
  numberCountUp: ["glitchy-counter", "ticks-fast"],
  scrolling: ["ticks-slow", "ticks-fast"],
} as const satisfies Record<string, readonly SayaSfx[]>;
