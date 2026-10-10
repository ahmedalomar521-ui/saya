// SayaCaptions — always on (R3), never repeated, R4 look: 2–3 white words,
// the spoken word in sky blue. Moves between chest and top to dodge graphics,
// always inside the Instagram safe zone. A chunk that falls inside a `hide`
// range is "said" by a graphic (FeaturePill / LogoPop in the caption's place)
// and is skipped, not shown later.
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import type {Chunk} from "./srt";
import {clamp, SAYA} from "./tokens";

export type Range = [from: number, to: number];
/** From frame `at`, the caption sits at `y` (eases over 8 frames). */
export type CaptionPlace = {at: number; y: number};
/** Small grey context line under the caption (R3), e.g. "ديمو رسمي · تنفيذ المهام". */
export type CaptionNote = {from: number; to: number; text: string};

const inRange = (f: number, rs: Range[]) => rs.some(([a, b]) => f >= a && f < b);

export const captionYAt = (frame: number, places: CaptionPlace[], fallback: number = SAYA.caption.chestY) => {
  const sorted = [...places].sort((a, b) => a.at - b.at);
  let y = fallback;
  for (const p of sorted) {
    if (frame < p.at) break;
    y = interpolate(frame, [p.at, p.at + 8], [y, p.y], clamp);
  }
  return Math.min(Math.max(y, SAYA.safe.top + 40), SAYA.safe.bottom - 40);
};

export const SayaCaptions: React.FC<{
  chunks: Chunk[];
  hide?: Range[];
  places?: CaptionPlace[];
  notes?: CaptionNote[];
  /** Ranges over light UI (phone, white card): add a navy outline. */
  onLight?: Range[];
  size?: number;
}> = ({chunks, hide = [], places = [], notes = [], onLight = [], size = SAYA.caption.size}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Current chunk: the last one that has started; it stays until the next one
  // starts (no blank gaps), but leaves 12 frames after a long pause.
  let idx = -1;
  for (let i = 0; i < chunks.length; i++) if (chunks[i].start <= frame) idx = i;
  if (idx < 0) return null;
  const c = chunks[idx];
  const next = chunks[idx + 1];
  const until = next ? Math.min(next.start, c.end + 12) : c.end + 12;
  if (frame >= until || inRange(frame, hide) || inRange(c.start, hide)) return null;

  const t = frame - c.start;
  const pop = spring({frame: t, fps, config: SAYA.spring.pop});
  const scale = interpolate(pop, [0, 1], [0.86, 1]);
  const opacity = interpolate(t, [0, 3], [0, 1], clamp);
  const y = captionYAt(frame, places);
  const light = inRange(frame, onLight);
  const note = notes.find((n) => frame >= n.from && frame < n.to);

  return (
    <div
      style={{
        position: "absolute",
        left: SAYA.safe.left,
        width: SAYA.safe.right - SAYA.safe.left,
        top: y,
        transform: `translateY(-50%) scale(${scale})`,
        opacity,
        textAlign: "center",
        direction: "rtl",
        fontFamily: SAYA.font,
        fontWeight: 900,
        fontSize: size,
        lineHeight: 1.25,
        color: SAYA.color.white,
        textShadow: SAYA.textShadow,
        WebkitTextStroke: light ? `3px ${SAYA.color.navy}` : undefined,
        paintOrder: "stroke fill",
      }}
    >
      {c.words.map((w, i) => {
        const active = frame >= w.start && frame < w.end;
        return (
          <span
            key={i}
            style={
              active
                ? {color: SAYA.color.sky, textShadow: `${SAYA.textShadow}, 0 0 18px ${SAYA.color.skyGlow}`}
                : undefined
            }
          >
            {w.text}
            {i < c.words.length - 1 ? " " : ""}
          </span>
        );
      })}
      {note ? (
        <div style={{fontSize: size * 0.4, fontWeight: 700, color: SAYA.color.grey, marginTop: 6, WebkitTextStroke: undefined}}>
          {note.text}
        </div>
      ) : null}
    </div>
  );
};
