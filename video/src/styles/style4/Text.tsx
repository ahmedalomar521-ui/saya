// ستايل 4 text layers: small chest captions (with the house light-blue spoken
// word), big white key terms, huge section numbers, the neon hook title and
// the closing line + fade to black.
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {neonGlow, S4} from "./tokens";
import {KaraokeText} from "../shared/Karaoke";

const isAr = (s: string) => /[؀-ۿ]/.test(s);

// ------------------------------------------------------------------ captions

export type S4Chunk = {start: number; end: number; text: string};

/** Phrases → chunks of ≤ 3 words (one line), output frames. */
export const chunk4 = (phrases: S4Chunk[], max = 3): S4Chunk[] => {
  const out: S4Chunk[] = [];
  for (const p of phrases) {
    const words = p.text.split(/\s+/).filter(Boolean);
    const total = words.join(" ").length;
    let acc = 0;
    for (let i = 0; i < words.length; i += max) {
      const t = words.slice(i, i + max).join(" ");
      const s = p.start + ((p.end - p.start) * acc) / total;
      acc += t.length + 1;
      const e = p.start + ((p.end - p.start) * Math.min(acc, total)) / total;
      out.push({start: Math.round(s), end: Math.round(e), text: t});
    }
  }
  return out.map((c, i) => {
    const n = out[i + 1];
    return {...c, end: n && n.start - c.end < 10 ? n.start : c.end + 4};
  });
};

export const S4Captions: React.FC<{chunks: S4Chunk[]; y?: number; hideDuring?: (f: number) => boolean}> = ({
  chunks,
  y = S4.layout.captionY,
  hideDuring,
}) => {
  const frame = useCurrentFrame();
  if (hideDuring?.(frame)) return null;
  const c = chunks.find((x) => frame >= x.start && frame < x.end);
  if (!c) return null;
  const p = interpolate(frame - c.start, [0, 4], [0, 1], {extrapolateRight: "clamp"});
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        top: y,
        textAlign: "center",
        fontFamily: S4.font,
        fontWeight: 700,
        fontSize: S4.size.caption,
        color: S4.color.white,
        textShadow: S4.textShadow,
        direction: isAr(c.text) ? "rtl" : "ltr",
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
      }}
    >
      <KaraokeText text={c.text} start={c.start} end={c.end} />
    </div>
  );
};

// ------------------------------------------------------------------ key term

/** Big white key term on the chest ("Professional Dashboard", "Search"). */
export const KeyTerm: React.FC<{text: string; sub?: string; duration: number; y?: number}> = ({
  text,
  sub,
  duration,
  y = S4.layout.keyTermY,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 220}});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const words = text.split(" ");
  return (
    <AbsoluteFill style={{alignItems: "center"}}>
      <div style={{position: "absolute", top: y, display: "flex", flexDirection: "column", alignItems: "center", opacity: out}}>
        {words.map((w, i) => {
          const wi = spring({frame: frame - i * 5, fps, config: {damping: 13, stiffness: 240}});
          return (
            <div
              key={i}
              style={{
                fontFamily: S4.font,
                fontWeight: 900,
                fontSize: S4.size.keyTerm,
                color: S4.color.white,
                lineHeight: 1.05,
                textShadow: `0 0 18px rgba(255,255,255,0.35), ${S4.textShadow}`,
                transform: `scale(${interpolate(wi, [0, 1], [0.6, 1])})`,
                opacity: Math.min(1, wi * 1.4),
                direction: isAr(w) ? "rtl" : "ltr",
                whiteSpace: "nowrap",
              }}
            >
              {w}
            </div>
          );
        })}
        {sub ? (
          <div style={{marginTop: 10, fontFamily: S4.font, fontWeight: 700, fontSize: S4.size.caption, color: S4.color.white, textShadow: S4.textShadow, opacity: s, direction: "rtl"}}>
            {sub}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ section number

/** Huge white section marker at the top: "أولاً" / "ثانياً". */
export const SectionNumber: React.FC<{text: string; duration: number}> = ({text, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 200}});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{alignItems: "center"}}>
      <div
        style={{
          position: "absolute",
          top: 110,
          fontFamily: S4.font,
          fontWeight: 900,
          fontSize: S4.size.section,
          color: S4.color.white,
          lineHeight: 1,
          textShadow: `0 0 30px rgba(255,255,255,0.35), ${S4.textShadow}`,
          transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`,
          opacity: Math.min(1, s * 1.5) * out,
          filter: `blur(${(1 - s) * 8}px)`,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ hook title

/** Opening title: small neon line + big stacked white words + laser line. */
export const NeonHook: React.FC<{small: string; big: string[]; duration: number; accent?: string}> = ({
  small,
  big,
  duration,
  accent = S4.color.green,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const laser = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const flicker = frame < 14 ? (Math.floor(frame / 2) % 2 ? 0.55 : 1) : 1;
  return (
    <AbsoluteFill style={{opacity: out}}>
      {/* vertical laser line */}
      <div
        style={{
          position: "absolute",
          left: 540,
          top: 0,
          width: 5,
          height: 560 * laser,
          background: accent,
          filter: neonGlow(accent, 1.2),
          opacity: 0.85,
        }}
      />
      <div style={{position: "absolute", top: 120, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div
          style={{
            fontFamily: S4.font,
            fontWeight: 900,
            fontSize: S4.size.hookSmall,
            color: accent,
            filter: neonGlow(accent, 0.6),
            opacity: flicker,
            direction: "rtl",
          }}
        >
          {small}
        </div>
        {big.map((w, i) => {
          const s = spring({frame: frame - 4 - i * 5, fps, config: {damping: 12, stiffness: 220}});
          return (
            <div
              key={i}
              style={{
                fontFamily: S4.font,
                fontWeight: 900,
                fontSize: S4.size.hookBig,
                lineHeight: 1.05,
                color: S4.color.white,
                transform: `skewX(-8deg) scale(${interpolate(s, [0, 1], [1.3, 1])})`,
                opacity: Math.min(1, s * 1.5),
                textShadow: `0 0 26px rgba(255,255,255,0.45), ${S4.textShadow}`,
                direction: "rtl",
              }}
            >
              {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ outro

/** Big closing line, then the whole frame fades to black. */
export const Outro: React.FC<{lines: string[]; duration: number; fadeFrames?: number}> = ({lines, duration, fadeFrames = 14}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fade = interpolate(frame, [duration - fadeFrames, duration], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", top: 1300, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center"}}>
        {lines.map((l, i) => {
          const s = spring({frame: frame - i * 6, fps, config: {damping: 13}});
          return (
            <div key={i} style={{fontFamily: S4.font, fontWeight: 900, fontSize: 120, lineHeight: 1.1, color: S4.color.white, textShadow: S4.textShadow, transform: `scale(${s})`, direction: "rtl"}}>
              {l}
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{background: "#000", opacity: fade}} />
    </AbsoluteFill>
  );
};
