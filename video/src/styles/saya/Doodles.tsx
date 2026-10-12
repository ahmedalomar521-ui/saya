// Hand-drawn doodles that draw themselves (ported from ستايل 1/2 and re-skinned
// for Saya): curly arrow, marker circle, burst, squiggle underline, scribble-out
// and the red glowing arrow. Colours default to Saya's palette; the red ones
// keep their meaning (a mistake / a warning).
import {Easing, interpolate, useCurrentFrame} from "remotion";
import {SAYA} from "./tokens";

type DrawProps = {delay?: number; duration?: number; color?: string; width?: number; style?: React.CSSProperties};

const useDraw = (delay = 0, duration = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
};

const Stroke: React.FC<{d: string; p: number; color: string; width: number; len?: number}> = ({d, p, color, width, len = 1000}) => (
  <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" pathLength={len} strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
);

export const SAYA_RED = "#FF3B4E";

/** Loopy underline under a title word. */
export const SayaSquiggle: React.FC<DrawProps & {w?: number}> = ({delay, duration = 14, color = SAYA.color.sky, width = 7, w = 420, style}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={w} height={60} viewBox="0 0 420 60" style={style}>
      <Stroke p={p} color={color} width={width} d="M10 38 C60 20 90 52 130 34 C160 20 150 6 132 14 C118 22 140 48 182 40 C230 30 260 18 300 30 C340 42 380 30 410 24" />
    </svg>
  );
};

/** Curly marker arrow (points up-right by default; `flip` mirrors it). */
export const SayaCurlyArrow: React.FC<DrawProps & {size?: number; flip?: boolean}> = ({delay = 0, duration = 16, color = SAYA.color.white, width = 8, size = 200, flip, style}) => {
  const p = useDraw(delay, duration);
  const head = useDraw(delay + duration - 3, 5);
  return (
    <svg width={size} height={size * 1.4} viewBox="0 0 200 280" style={{transform: flip ? "scaleX(-1)" : undefined, filter: `drop-shadow(0 3px 10px rgba(0,0,0,0.5))`, ...style}}>
      <Stroke p={p} color={color} width={width} d="M60 270 C40 220 70 190 100 200 C130 210 120 250 92 240 C60 228 70 160 110 120 C135 95 150 70 160 30" />
      <Stroke p={head} color={color} width={width} d="M130 50 L160 26 L172 62" len={200} />
    </svg>
  );
};

/** Rough hand-drawn circle to ring something on screen. */
export const SayaMarkerCircle: React.FC<DrawProps & {w: number; h: number}> = ({delay, duration = 14, color = SAYA.color.sky, width = 8, w, h, style}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{filter: `drop-shadow(0 0 8px ${color})`, ...style}}>
      <Stroke p={p} color={color} width={width} d={`M${w * 0.55} ${h * 0.06} C${w * 0.95} ${h * 0.02} ${w * 1.0} ${h * 0.9} ${w * 0.5} ${h * 0.94} C${w * 0.05} ${h * 0.98} ${w * 0.0} ${h * 0.15} ${w * 0.45} ${h * 0.08} L${w * 0.62} ${h * 0.1}`} />
    </svg>
  );
};

/** Three short lines that punctuate a word. */
export const SayaBurst: React.FC<DrawProps & {size?: number}> = ({delay, duration = 8, color = SAYA.color.sky, width = 7, size = 120, style}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={style}>
      <Stroke p={p} color={color} width={width} d="M60 8 L60 34" len={100} />
      <Stroke p={p} color={color} width={width} d="M20 30 L40 48" len={100} />
      <Stroke p={p} color={color} width={width} d="M100 30 L80 48" len={100} />
    </svg>
  );
};

/** Marker zig-zag that crosses something out (red: it is wrong). */
export const SayaScribbleOut: React.FC<DrawProps & {w?: number; h?: number}> = ({delay, duration = 10, color = SAYA_RED, width = 14, w = 420, h = 160, style}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={w} height={h} viewBox="0 0 420 160" style={style}>
      <Stroke p={p} color={color} width={width} d="M10 120 L80 30 L110 130 L190 25 L220 135 L300 20 L330 128 L410 35" />
    </svg>
  );
};

/** Hand-drawn glowing red arrow, drawn on. Points down-left by default. */
export const SayaRedArrow: React.FC<{delay?: number; size?: number; style?: React.CSSProperties; flip?: boolean}> = ({delay = 0, size = 200, style, flip}) => {
  const p = useDraw(delay, 12);
  const head = useDraw(delay + 10, 5);
  return (
    <svg width={size} height={size} viewBox="0 0 200 200" style={{filter: `drop-shadow(0 0 10px ${SAYA_RED})`, transform: flip ? "scaleX(-1)" : undefined, ...style}}>
      <Stroke p={p} color={SAYA_RED} width={12} d="M180 20 C120 30 70 70 60 160" />
      <Stroke p={head} color={SAYA_RED} width={12} d="M30 130 L60 168 L92 132" />
    </svg>
  );
};
