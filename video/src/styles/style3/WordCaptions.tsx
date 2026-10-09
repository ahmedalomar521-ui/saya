// ستايل 3 captions: ONE word at a time, small and clean, under the chin.
// Emphasis moments become a short stack of lines that builds word by word,
// mixing the sans with a script/italic word, CAPS, red, and a hand-drawn
// ellipse or underline.
//
// Phrase markup (per phrase text):
//   plain words              → shown one at a time
//   {a b c}                  → stack: words build up line by line and stay
//   {a b c}o / {…}O / {…}u   → stack + white ellipse / red ellipse / accent underline
//   ~word~  script, accent colour     _word_  script, white
//   !word!  CAPS bold                  ^word^  red
import {interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {S3} from "./tokens";

export type S3Phrase = {start: number; end: number; text: string}; // output frames

type Kind = "sans" | "script" | "scriptWhite" | "caps" | "red";
type W = {text: string; kind: Kind; start: number};
type Beat =
  | {type: "word"; start: number; end: number; word: W}
  | {type: "stack"; start: number; end: number; words: W[]; deco?: "o" | "O" | "u"};

const parseWord = (raw: string): {text: string; kind: Kind} => {
  if (/^~.+~$/.test(raw)) return {text: raw.slice(1, -1), kind: "script"};
  if (/^_.+_$/.test(raw)) return {text: raw.slice(1, -1), kind: "scriptWhite"};
  if (/^!.+!$/.test(raw)) return {text: raw.slice(1, -1), kind: "caps"};
  if (/^\^.+\^$/.test(raw)) return {text: raw.slice(1, -1), kind: "red"};
  return {text: raw, kind: "sans"};
};

export const buildBeats = (phrases: S3Phrase[]): Beat[] => {
  const beats: Beat[] = [];
  const lingerUntil: number[] = []; // per beat: latest frame it may stay on
  for (const p of phrases) {
    // tokens: either a {group}deco or a single word
    const re = /\{([^}]+)\}([oOu])?|(\S+)/g;
    const parts: ({group: string[]; deco?: "o" | "O" | "u"} | {word: string})[] = [];
    let m: RegExpExecArray | null;
    while ((m = re.exec(p.text))) {
      if (m[1]) parts.push({group: m[1].split(/\s+/), deco: m[2] as "o" | "O" | "u" | undefined});
      else parts.push({word: m[3]});
    }
    const flat = parts.flatMap((x) => ("group" in x ? x.group : [x.word]));
    const weights = flat.map((w) => w.replace(/[~_!^]/g, "").length + 2);
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    let wi = 0;
    const timeOf = () => {
      const t = p.start + ((p.end - p.start) * acc) / total;
      acc += weights[wi++];
      return Math.round(t);
    };
    parts.forEach((part, pi) => {
      const isLast = pi === parts.length - 1;
      if ("group" in part) {
        const words = part.group.map((g) => ({...parseWord(g), start: timeOf()}));
        beats.push({type: "stack", start: words[0].start, end: 0, words, deco: part.deco});
        lingerUntil.push(isLast ? p.end + 16 : p.end);
      } else {
        const w = {...parseWord(part.word), start: timeOf()};
        beats.push({type: "word", start: w.start, end: 0, word: w});
        lingerUntil.push(isLast ? p.end + 6 : p.end);
      }
    });
  }
  // a beat stays until the next beat starts, but never past its linger limit
  return beats.map((b, i) => {
    const next = beats[i + 1];
    const end = next ? Math.min(next.start, Math.max(lingerUntil[i], b.start + 6)) : lingerUntil[i];
    return {...b, end};
  });
};

const styleFor = (k: Kind): React.CSSProperties => {
  switch (k) {
    case "script":
      return {fontFamily: S3.font.script, fontStyle: "italic", fontWeight: 700, fontSize: S3.size.script, color: S3.color.accent, lineHeight: 0.95};
    case "scriptWhite":
      return {fontFamily: S3.font.script, fontStyle: "italic", fontWeight: 700, fontSize: S3.size.script, color: S3.color.white, lineHeight: 0.95};
    case "caps":
      return {fontFamily: S3.font.sans, fontWeight: 700, fontSize: S3.size.caps, color: S3.color.white, textTransform: "uppercase", letterSpacing: -1, lineHeight: 0.95};
    case "red":
      return {fontFamily: S3.font.sans, fontWeight: 700, fontSize: S3.size.word, color: S3.color.red, lineHeight: 1};
    default:
      return {fontFamily: S3.font.sans, fontWeight: 700, fontSize: S3.size.word, color: S3.color.white, lineHeight: 1};
  }
};

const Pop: React.FC<{w: W; children?: React.ReactNode}> = ({w}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - w.start, fps, config: {damping: 13, stiffness: 320, mass: 0.5}});
  const vis = frame >= w.start;
  return (
    <div
      style={{
        ...styleFor(w.kind),
        opacity: vis ? 1 : 0,
        transform: `scale(${interpolate(s, [0, 1], [0.7, 1])})`,
        textShadow: S3.shadow,
        whiteSpace: "nowrap",
        direction: /[؀-ۿ]/.test(w.text) ? "rtl" : "ltr",
      }}
    >
      {w.text}
    </div>
  );
};

const Ellipse: React.FC<{start: number; color: string}> = ({start, color}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, 12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  return (
    <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{position: "absolute", left: "-14%", top: "-22%", width: "128%", height: "144%", overflow: "visible"}}>
      <path
        d="M230 14 C330 12 392 50 390 100 C388 160 300 190 200 188 C90 186 10 160 12 100 C14 44 110 10 250 22"
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        pathLength={1000}
        strokeDasharray={1000}
        strokeDashoffset={1000 * (1 - p)}
        style={{filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))"}}
      />
    </svg>
  );
};

const Underline: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - start, [0, 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  return (
    <svg viewBox="0 0 300 40" preserveAspectRatio="none" style={{position: "absolute", left: "-6%", bottom: "-16%", width: "112%", height: 40, overflow: "visible"}}>
      <path d="M290 18 C200 30 100 10 10 26" fill="none" stroke={S3.color.accent} strokeWidth={6} strokeLinecap="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)} />
    </svg>
  );
};

export const S3Captions: React.FC<{beats: Beat[]; y?: number; hideDuring?: (f: number) => boolean}> = ({
  beats,
  y = S3.layout.captionY,
  hideDuring,
}) => {
  const frame = useCurrentFrame();
  if (hideDuring?.(frame)) return null;
  const b = beats.find((x) => frame >= x.start && frame < x.end);
  if (!b) return null;
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: y, display: "flex", justifyContent: "center"}}>
      {b.type === "word" ? (
        <Pop w={b.word} />
      ) : (
        <div style={{position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 0}}>
          {b.words.map((w, i) => (
            <Pop key={i} w={w} />
          ))}
          {b.deco === "o" || b.deco === "O" ? (
            <Ellipse start={b.words[b.words.length - 1].start} color={b.deco === "O" ? S3.color.red : S3.color.white} />
          ) : null}
          {b.deco === "u" ? <Underline start={b.words[b.words.length - 1].start + 3} /> : null}
        </div>
      )}
    </div>
  );
};

/** Quick white flash used on section changes (paired with a framing change). */
export const S3Flash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, 7], [0.85, 0.6, 0], {extrapolateRight: "clamp"});
  return <div style={{position: "absolute", inset: 0, background: "#fff", opacity: o, mixBlendMode: "screen"}} />;
};
