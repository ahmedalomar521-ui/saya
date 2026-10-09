// ستايل 2 captions: big glowing Arabic text on the chest, built word by word
// over two lines, with stretched (kashida) letters.
// Markup per word:  *word*  → red glowing word
//                   [a b c] → white text on a red highlight bar (multi-word)
import {interpolate, useCurrentFrame} from "remotion";
import {autoStretch, glowShadow, S2} from "./tokens";
import {HOUSE_ACTIVE_GLOW, HOUSE_ACTIVE_WORD} from "../shared/house";

export type S2Phrase = {start: number; end: number; text: string}; // output frames

type Token = {text: string; kind: "glow" | "red" | "bar"; start: number};
type Page = {start: number; end: number; speechEnd: number; lines: Token[][]};

const tokenize = (text: string): {text: string; kind: Token["kind"]}[] => {
  const out: {text: string; kind: Token["kind"]}[] = [];
  const re = /\[([^\]]+)\]|\*([^*]+)\*|(\S+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m[1]) out.push({text: m[1], kind: "bar"});
    else if (m[2]) out.push({text: m[2], kind: "red"});
    else out.push({text: m[3], kind: "glow"});
  }
  return out;
};

/** Each phrase becomes one page of up to two lines. */
export const buildPages = (phrases: S2Phrase[], maxPerLine = 3): Page[] =>
  phrases.map((p, pi) => {
    const toks = tokenize(p.text);
    const weights = toks.map((t) => t.text.length + 2);
    const total = weights.reduce((a, b) => a + b, 0);
    let acc = 0;
    const timed: Token[] = toks.map((t, i) => {
      const s = p.start + ((p.end - p.start) * acc) / total;
      acc += weights[i];
      return {
        ...t,
        text: t.kind === "bar" ? t.text : autoStretch(t.text, i + pi),
        start: Math.round(s),
      };
    });
    const lines: Token[][] = [];
    // split into two balanced lines when longer than maxPerLine
    if (timed.length <= maxPerLine) lines.push(timed);
    else {
      const cut = Math.ceil(timed.length / 2);
      lines.push(timed.slice(0, cut), timed.slice(cut));
    }
    const next = phrases[pi + 1];
    const end = next ? Math.min(next.start, p.end + 15) : p.end + 12;
    return {start: p.start, end: Math.max(end, p.end), speechEnd: p.end, lines};
  });

const Word: React.FC<{t: Token; active?: boolean}> = ({t, active}) => {
  const frame = useCurrentFrame();
  const age = frame - t.start;
  if (age < 0) {
    return <span style={{opacity: 0, fontSize: S2.size.caption}}>{t.text}</span>;
  }
  const p = interpolate(age, [0, 6], [0, 1], {extrapolateRight: "clamp"});
  const blur = (1 - p) * 10;
  const x = (1 - p) * -26; // RTL: slides in from the right edge of the word
  const base: React.CSSProperties = {
    display: "inline-block",
    fontSize: S2.size.caption,
    opacity: p,
    filter: `blur(${blur}px)`,
    transform: `translateX(${-x}px)`,
    whiteSpace: "nowrap",
  };
  if (t.kind === "bar") {
    const bar = interpolate(age, [0, 7], [0, 1], {extrapolateRight: "clamp"});
    return (
      <span style={{...base, position: "relative", padding: "0 18px", color: "#fff", textShadow: "0 2px 6px rgba(0,0,0,0.35)"}}>
        <span
          style={{
            position: "absolute",
            inset: "14% 0 6% 0",
            background: S2.color.red,
            boxShadow: `0 0 30px ${S2.color.redGlow}aa`,
            transform: `scaleX(${bar})`,
            transformOrigin: "right",
            zIndex: -1,
          }}
        />
        {t.text}
      </span>
    );
  }
  // house rule: the word being spoken is light blue
  if (active) {
    return <span style={{...base, color: HOUSE_ACTIVE_WORD, textShadow: glowShadow(HOUSE_ACTIVE_GLOW)}}>{t.text}</span>;
  }
  if (t.kind === "red") {
    return <span style={{...base, color: "#FF4A4A", textShadow: glowShadow(S2.color.redGlow)}}>{t.text}</span>;
  }
  return <span style={{...base, color: S2.color.glow, textShadow: glowShadow()}}>{t.text}</span>;
};

export const S2Captions: React.FC<{pages: Page[]; top?: number; hideDuring?: (f: number) => boolean}> = ({
  pages,
  top = S2.layout.captionTop,
  hideDuring,
}) => {
  const frame = useCurrentFrame();
  if (hideDuring?.(frame)) return null;
  const page = pages.find((p) => frame >= p.start && frame < p.end);
  if (!page) return null;
  const started = page.lines.flat().filter((t) => t.start <= frame);
  const activeTok = frame < page.speechEnd ? started[started.length - 1] : undefined;
  return (
    <div style={{position: "absolute", left: 0, right: 0, top}}>
      {/* soft dark plate so the glow reads on light clothes */}
      <div
        style={{
          position: "absolute",
          left: 40,
          right: 40,
          top: -40,
          height: page.lines.length * 120 + 80,
          background: "radial-gradient(ellipse at 50% 50%, rgba(10,8,6,0.32) 0%, rgba(10,8,6,0.18) 45%, rgba(10,8,6,0) 72%)",
          filter: "blur(10px)",
        }}
      />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          fontFamily: S2.font,
          fontWeight: 900,
          lineHeight: 1.35,
          direction: "rtl",
        }}
      >
        {page.lines.map((line, li) => (
          <div key={li} style={{display: "flex", gap: 22, direction: "rtl"}}>
            {line.map((t, i) => (
              <Word key={i} t={t} active={t === activeTok} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
