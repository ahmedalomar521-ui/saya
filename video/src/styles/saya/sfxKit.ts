// Saya sound kit "B" (user decision 2026-10-17: 13 sounds, small fixed family) and the
// generator that turns a zoom map into sound cues, so the sound lands on the same frame
// as the move. Level rule: the voice stays clear and comfortable, effects sit BEHIND it.
// Not every zoom gets a sound: the return to the base and Ken Burns are silent.
import type {SfxCue} from "./SfxTrack";
import type {SayaSfx} from "./sfx";
import {ZOOM, type ZoomEvent} from "./zoomSystem";

export const SFX_KIT = {
  punch: ["whoosh-1", "robot-zoom"] as SayaSfx[], // alternate so the same one never repeats back to back
  join: "whoosh-pack-1" as SayaSfx, // a cut between two HeyGen parts
  cardIn: "small-swoosh" as SayaSfx, // a card / split stage appears
  tap: "ui-select" as SayaSfx, // a screen-recording tap
  correct: ["ding", "idea-ding"] as SayaSfx[], // a check / a list item landing
  cta: "blink-bell" as SayaSfx, // the follow call to action
  shock: "impact-deep" as SayaSfx, // a shock word
  importantInfo: "stamp" as SayaSfx,
  imageIn: "camera-shutter" as SayaSfx, // a photo pops in
  typing: "keyboard" as SayaSfx, // a prompt being typed (3.5 s long: cap `frames`)
  notification: "notification" as SayaSfx,
} as const;

/** Level used by the generator (relative to the voice at 1.0). Quieter than the library defaults on purpose. */
export const KIT_VOLUME = 0.26;
/** Minimum gap between two cues, in frames (rule: at least 1.0 s between effects). */
export const KIT_MIN_GAP = 30;

export const sfxFromZoomMap = (events: ZoomEvent[]): SfxCue[] => {
  const cues: SfxCue[] = [];
  let n = 0;
  const lead = (f: number) => Math.max(1, f - ZOOM.lead);
  for (const e of [...events].sort((a, b) => ("at" in a ? a.at : a.from) - ("at" in b ? b.at : b.from))) {
    if (e.type === "punch") cues.push({at: lead(e.at), sfx: SFX_KIT.punch[n++ % SFX_KIT.punch.length], volume: KIT_VOLUME});
    else if (e.type === "join") cues.push({at: e.at, sfx: SFX_KIT.join, volume: KIT_VOLUME});
    else if (e.type === "ratchet") cues.push({at: lead(e.at), sfx: SFX_KIT.punch[n++ % SFX_KIT.punch.length], volume: KIT_VOLUME}); // one sound for the whole list, not one per step
    // kenburns: silent
  }
  // enforce the minimum gap: the later cue is dropped
  return cues.filter((c, i) => i === 0 || c.at - cues[i - 1].at >= KIT_MIN_GAP || false);
};
