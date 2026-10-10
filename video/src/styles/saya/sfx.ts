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
  | "glitch" | "digital-loading" | "glitchy-counter" | "ticks-fast" | "ticks-slow"
  // pack 2 (LSK "Sound Effect" parts 1/3/4/5/7)
  | "small-swoosh" | "whoosh-pack-1" | "whoosh-pack-2" | "whoosh-pack-3" | "robot-zoom"
  | "rewind" | "old-projector" | "slow-motion" | "slow-motion-2" | "riser-2"
  | "boom" | "cinematic-boom" | "epic-baam" | "stamp" | "badum-tss"
  | "idea-ding" | "blink-bell" | "shining" | "confetti" | "money" | "cash-register-2"
  | "keyboard" | "typewriter" | "timer-ticks" | "alarm-clock" | "boring" | "crickets"
  | "airplane";

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
  "small-swoosh": 0.35, "whoosh-pack-1": 0.3, "whoosh-pack-2": 0.3, "whoosh-pack-3": 0.3,
  "robot-zoom": 0.3, rewind: 0.28, "old-projector": 0.2, "slow-motion": 0.25,
  "slow-motion-2": 0.25, "riser-2": 0.22, boom: 0.3, "cinematic-boom": 0.28,
  "epic-baam": 0.28, stamp: 0.4, "badum-tss": 0.3, "idea-ding": 0.35, "blink-bell": 0.35,
  shining: 0.3, confetti: 0.3, money: 0.35, "cash-register-2": 0.35, keyboard: 0.3,
  typewriter: 0.3, "timer-ticks": 0.28, "alarm-clock": 0.25, boring: 0.3, crickets: 0.3,
  airplane: 0.2,
};

/**
 * What the edit is doing → which sound to use (first = default, rest = variants
 * to rotate so the same sound does not repeat back to back).
 */
export const SAYA_SFX_FOR = {
  zoomIn: ["whoosh-zoom", "whoosh-1", "swish-whoosh", "small-swoosh", "robot-zoom"],
  zoomOut: ["whoosh-zoom", "whoosh-2", "reverse", "whoosh-pack-1"],
  sceneChange: ["camera-shutter", "camera-shutter-2", "transition-swipe", "cinematic-whoosh"],
  bigTransition: ["whoosh-deep", "cinematic-whoosh", "film-burn", "camera-flash", "whoosh-pack-2"],
  surprise: ["fuhh", "impact-deep", "boom"],
  importantInfo: ["click", "impact", "stamp"],
  bigClaim: ["epic-baam", "cinematic-boom", "boom"],
  elementPops: ["click", "shutter-click", "ui-select", "small-swoosh"],
  suspense: ["riser", "metallic-riser", "riser-2", "tension-keen"],
  reveal: ["shining", "power-up", "sweep-up", "whoosh-shine"],
  celebrate: ["confetti", "ding"],
  idea: ["idea-ding", "blink-bell"],
  correct: ["ding", "idea-ding"],
  money: ["cash-register", "cash-register-2", "money"],
  flashback: ["rewind", "old-projector", "film-burn"],
  slowMotion: ["slow-motion", "slow-motion-2"],
  joke: ["badum-tss"],
  awkwardSilence: ["crickets"],
  boringPart: ["boring"],
  timeRunningOut: ["timer-ticks", "alarm-clock", "ticks-slow"],
  travel: ["airplane"],
  phoneNotification: ["notification"],
  tapOrClick: ["mouse-click", "ui-select"],
  toggleSetting: ["toggle"],
  typing: ["keyboard-typing", "keyboard", "typewriter"],
  techGlitch: ["glitch"],
  loading: ["digital-loading"],
  numberCountUp: ["glitchy-counter", "ticks-fast"],
  scrolling: ["ticks-slow", "ticks-fast"],
} as const satisfies Record<string, readonly SayaSfx[]>;
