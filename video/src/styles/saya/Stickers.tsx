// Pieces learned from reference R6 (the "Claude Skills" reel, purple room):
// - SketchIcons: white hand-drawn line icons that pop around the head and float
//   (a cloud of "?" for a question, a bulb with rays for an idea, a sparkle /
//   asterisk for a name, "!" for a warning). They draw themselves.
// - Sticker: any imported icon or image (tools/assets.mjs → public/assets/…)
//   popping at a spot, floating gently, with an optional neon glow.
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {clamp, SAYA} from "./tokens";

const resolveSrc = (src: string) => (/^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src));

const glow = (c = SAYA.color.white) => `drop-shadow(0 0 6px ${c}) drop-shadow(0 0 16px ${SAYA.color.neon}88)`;

const Draw: React.FC<{d: string; delay: number; width?: number}> = ({d, delay, width = 2.2}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return <path d={d} fill="none" stroke="#fff" strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />;
};

const QUESTION = "M8 8.5a4 4 0 1 1 5.6 3.7c-1 .5-1.6 1.3-1.6 2.4v.9 M12 19.2v.3";
const EXCLAIM = "M12 4v10 M12 18.6v.4";
const BULB = "M9 17h6 M10 20.5h4 M12 5a5.5 5.5 0 0 1 3.6 9.6c-.7.7-.9 1.4-.9 2.4H9.3c0-1-.2-1.7-.9-2.4A5.5 5.5 0 0 1 12 5Z";
const RAYS = "M12 1v1.5 M4.5 4l1.1 1.1 M19.5 4l-1.1 1.1 M2 11h1.5 M20.5 11H22";
const SPARK = "M12 3v18 M3 12h18 M5.6 5.6l12.8 12.8 M18.4 5.6 5.6 18.4";

/** One floating sketch glyph. */
const Glyph: React.FC<{d: string[]; x: number; y: number; size: number; delay: number; rot?: number; spin?: boolean}> = ({d, x, y, size, delay, rot = 0, spin}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: SAYA.spring.pop});
  const float = Math.sin((frame + delay * 7) / 14) * 8;
  const r = rot + (spin ? frame * 0.6 : 0);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{position: "absolute", left: x - size / 2, top: y - size / 2 + float, transform: `scale(${s}) rotate(${r}deg)`, opacity: Math.min(1, s * 1.4), filter: glow(), overflow: "visible"}}>
      {d.map((p, i) => (
        <Draw key={i} d={p} delay={delay + i * 3} />
      ))}
    </svg>
  );
};

export type SketchKind = "question" | "bulb" | "sparkle" | "exclaim";

/** Sketch icons around a point (usually the head). `question` scatters 5 marks. */
export const SketchIcons: React.FC<{kind: SketchKind; duration: number; x?: number; y?: number; spread?: number}> = ({kind, duration, x = 540, y = 420, spread = 300}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  let glyphs: React.ReactNode;
  if (kind === "question") {
    const spots = [
      [-0.85, 0.1, 95, -12],
      [-0.45, -0.75, 120, 8],
      [0.3, -0.55, 105, -6],
      [0.9, -0.05, 115, 10],
      [-0.95, 0.85, 90, 14],
    ];
    glyphs = spots.map(([dx, dy, s, r], i) => <Glyph key={i} d={[QUESTION]} x={x + dx * spread} y={y + dy * spread * 0.6} size={s} delay={i * 4} rot={r} />);
  } else if (kind === "bulb") {
    glyphs = <Glyph d={[BULB, RAYS]} x={x} y={y} size={190} delay={0} />;
  } else if (kind === "sparkle") {
    glyphs = <Glyph d={[SPARK]} x={x} y={y} size={170} delay={0} spin />;
  } else {
    glyphs = [<Glyph key={0} d={[EXCLAIM]} x={x - spread * 0.5} y={y} size={130} delay={0} rot={-10} />, <Glyph key={1} d={[EXCLAIM]} x={x + spread * 0.5} y={y - 30} size={110} delay={5} rot={10} />];
  }
  return <div style={{position: "absolute", inset: 0, opacity: out}}>{glyphs}</div>;
};

/** An imported icon or image popping at (x, y) — its centre — and floating. */
export const Sticker: React.FC<{src: string; duration: number; x: number; y: number; size?: number; glow?: boolean; rot?: number}> = ({src, duration, x, y, size = 200, glow: withGlow, rot = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: SAYA.spring.pop});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  const float = Math.sin(frame / 15) * 7;
  return (
    <Img
      src={resolveSrc(src)}
      style={{position: "absolute", left: x - size / 2, top: y - size / 2 + float, width: size, height: size, objectFit: "contain", transform: `scale(${interpolate(s, [0, 1], [0.3, 1])}) rotate(${rot + (1 - s) * -20}deg)`, opacity: Math.min(s * 1.5, out), filter: withGlow ? glow() : "drop-shadow(0 10px 24px rgba(0,0,0,0.45))"}}
    />
  );
};
