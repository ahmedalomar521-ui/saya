// Hand-drawn doodles that "draw themselves" (stroke-dashoffset), like the
// marker arrows / squiggles / speech bubble in the reference.
import {interpolate, useCurrentFrame, Easing} from "remotion";
import {S1} from "./tokens";

type DrawProps = {
  delay?: number;
  duration?: number;
  color?: string;
  width?: number;
  style?: React.CSSProperties;
};

const useDraw = (delay = 0, duration = 12) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

const Stroke: React.FC<{
  d: string;
  p: number;
  color: string;
  width: number;
  len?: number;
}> = ({d, p, color, width, len = 1000}) => (
  <path
    d={d}
    fill="none"
    stroke={color}
    strokeWidth={width}
    strokeLinecap="round"
    strokeLinejoin="round"
    pathLength={len}
    strokeDasharray={len}
    strokeDashoffset={len * (1 - p)}
  />
);

/** Loopy underline under a title word. */
export const Squiggle: React.FC<DrawProps & {w?: number}> = ({
  delay,
  duration = 14,
  color = S1.color.ink,
  width = 7,
  w = 420,
  style,
}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={w} height={60} viewBox="0 0 420 60" style={style}>
      <Stroke
        p={p}
        color={color}
        width={width}
        d="M10 38 C60 20 90 52 130 34 C160 20 150 6 132 14 C118 22 140 48 182 40 C230 30 260 18 300 30 C340 42 380 30 410 24"
      />
    </svg>
  );
};

/** Curly marker arrow (points up-right by default). */
export const CurlyArrow: React.FC<DrawProps & {size?: number; flip?: boolean}> = ({
  delay,
  duration = 16,
  color = S1.color.ink,
  width = 8,
  size = 200,
  flip,
  style,
}) => {
  const p = useDraw(delay, duration);
  const head = useDraw((delay ?? 0) + duration - 3, 5);
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 200 280"
      style={{transform: flip ? "scaleX(-1)" : undefined, ...style}}
    >
      <Stroke
        p={p}
        color={color}
        width={width}
        d="M60 270 C40 220 70 190 100 200 C130 210 120 250 92 240 C60 228 70 160 110 120 C135 95 150 70 160 30"
      />
      <Stroke p={head} color={color} width={width} d="M130 50 L160 26 L172 62" len={200} />
    </svg>
  );
};

/** Drawn speech bubble (the "Comment" icon). */
export const SpeechBubble: React.FC<DrawProps & {size?: number}> = ({
  delay,
  duration = 14,
  color = S1.color.ink,
  width = 8,
  size = 110,
  style,
}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={size} height={size} viewBox="0 0 110 110" style={style}>
      <Stroke
        p={p}
        color={color}
        width={width}
        d="M55 12 C82 10 100 30 98 54 C96 78 76 94 52 92 C42 91 36 89 30 86 L12 98 L20 78 C12 70 8 60 10 50 C12 28 32 12 55 12"
      />
    </svg>
  );
};

/** Rough hand-drawn circle to ring something on screen. */
export const MarkerCircle: React.FC<DrawProps & {w: number; h: number}> = ({
  delay,
  duration = 14,
  color = S1.color.yellow,
  width = 8,
  w,
  h,
  style,
}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={style}>
      <Stroke
        p={p}
        color={color}
        width={width}
        d={`M${w * 0.55} ${h * 0.06} C${w * 0.95} ${h * 0.02} ${w * 1.0} ${h * 0.9} ${w * 0.5} ${h * 0.94} C${w * 0.05} ${h * 0.98} ${w * 0.0} ${h * 0.15} ${w * 0.45} ${h * 0.08} L${w * 0.62} ${h * 0.1}`}
      />
    </svg>
  );
};

/** Little sparkle/burst lines to punctuate a word. */
export const Burst: React.FC<DrawProps & {size?: number}> = ({
  delay,
  duration = 8,
  color = S1.color.yellow,
  width = 7,
  size = 120,
  style,
}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" style={style}>
      <Stroke p={p} color={color} width={width} d="M60 8 L60 34" len={100} />
      <Stroke p={p} color={color} width={width} d="M20 30 L40 48" len={100} />
      <Stroke p={p} color={color} width={width} d="M100 30 L80 48" len={100} />
    </svg>
  );
};

/** Marker scribble that crosses something out (zig-zag). */
export const ScribbleOut: React.FC<DrawProps & {w?: number; h?: number}> = ({
  delay,
  duration = 10,
  color = "#FF2D55",
  width = 14,
  w = 420,
  h = 160,
  style,
}) => {
  const p = useDraw(delay, duration);
  return (
    <svg width={w} height={h} viewBox="0 0 420 160" style={style}>
      <Stroke p={p} color={color} width={width} d="M10 120 L80 30 L110 130 L190 25 L220 135 L300 20 L330 128 L410 35" />
    </svg>
  );
};
