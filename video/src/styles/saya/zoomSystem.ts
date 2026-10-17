// Saya zoom system (user decision 2026-10-17; research: add-zooms skill + editing guides).
// Three moves only, all anchored to a word start:
//   punch    – hard cut to the peak, hold, hard cut back to the base (emphasis word, number,
//              question, last word of a contrast, and every HeyGen join)
//   ratchet  – a list of 2–4 items, each hard-cut one level up, then back to the base
//   kenburns – slow linear push across a thesis line or the CTA (the ONLY smooth move)
// "Zoom out" is always the return to the base; there is no zoom below the base.
// Long stretches stay at the base. Old `zooms: Zoom[]` props still work for finished videos.
import type {Zoom} from "./Footage";

export const ZOOM = {
  base: 1.1,
  punch: 1.25,
  max: 1.3, // never above (crisp on 1080p; research says ≤ 1.35)
  hold: 12, // frames a punch holds (0.4 s)
  ratchet: [1.16, 1.25] as [number, number], // first and last step; steps in between are even
  kenburns: 1.14,
  release: 15, // frames Ken Burns takes to return to the base
  lead: 2, // frames before the word start (≈0.05 s)
  maxPunchesPerMinute: 6,
  maxKenBurns: 2,
} as const;

export type ZoomEvent =
  | {type: "punch"; at: number; peak?: number; hold?: number}
  | {type: "ratchet"; at: number; steps: 2 | 3 | 4; stepFrames: number; hold?: number}
  | {type: "kenburns"; from: number; to: number}
  | {type: "join"; at: number}; // a cut between two HeyGen parts: a punch that hides the join

export const buildZooms = (events: ZoomEvent[], base: number = ZOOM.base): Zoom[] => {
  const out: Zoom[] = [{at: 0, scale: base}];
  const lead = (f: number) => Math.max(1, f - ZOOM.lead);
  for (const e of [...events].sort((a, b) => ("at" in a ? a.at : a.from) - ("at" in b ? b.at : b.from))) {
    if (e.type === "punch" || e.type === "join") {
      const at = e.type === "join" ? e.at : lead(e.at);
      const peak = Math.min(e.type === "punch" ? e.peak ?? ZOOM.punch : ZOOM.punch, ZOOM.max);
      out.push({at, scale: peak}, {at: at + (e.type === "punch" ? e.hold ?? ZOOM.hold : ZOOM.hold), scale: base});
    } else if (e.type === "ratchet") {
      const [lo, hi] = ZOOM.ratchet;
      let last = lead(e.at);
      for (let i = 0; i < e.steps; i++) {
        last = lead(e.at) + i * e.stepFrames;
        out.push({at: last, scale: Math.min(lo + ((hi - lo) * i) / (e.steps - 1), ZOOM.max)});
      }
      out.push({at: last + (e.hold ?? ZOOM.hold), scale: base});
    } else {
      out.push(
        {at: lead(e.from), scale: ZOOM.kenburns, mode: "linear", dur: e.to - e.from},
        {at: e.to, scale: base, mode: "linear", dur: ZOOM.release},
      );
    }
  }
  return out;
};

/** Rationing check: returns warnings (empty = fine). Run it on every zoom map before a render. */
export const checkZoomMap = (events: ZoomEvent[], totalFrames: number, fps = 30): string[] => {
  const w: string[] = [];
  const minutes = totalFrames / fps / 60;
  const punches = events.filter((e) => e.type === "punch" || e.type === "join" || e.type === "ratchet").length;
  if (punches > Math.max(2, Math.ceil(ZOOM.maxPunchesPerMinute * minutes))) w.push(`too many punches: ${punches} for ${(minutes * 60).toFixed(0)} s`);
  if (events.filter((e) => e.type === "kenburns").length > ZOOM.maxKenBurns) w.push("more than 2 Ken Burns pushes");
  const times = events.map((e) => ("at" in e ? e.at : e.from)).sort((a, b) => a - b);
  for (let i = 1; i < times.length; i++) if (times[i] - times[i - 1] < 45) w.push(`events closer than 1.5 s at frame ${times[i]}`);
  return w;
};
