// ستايل 1 captions: small, clean, 1–3 words at a time, NO stroke.
// - "plain": white text with soft shadow over the talking head (~77 % height)
// - "boxed": white text on a black box, sitting on the split-screen seam
import {useCurrentFrame} from "remotion";
import {S1} from "./tokens";
import {KaraokeText} from "../shared/Karaoke";

export type S1Chunk = {start: number; end: number; text: string}; // output frames

/** Splits phrases (start/end in output frames) into 1–3 word chunks. */
export const chunkPhrases = (
  phrases: {start: number; end: number; text: string}[],
  maxWords = 3,
): S1Chunk[] => {
  const out: S1Chunk[] = [];
  for (const p of phrases) {
    const words = p.text.split(/\s+/).filter(Boolean);
    const groups: string[][] = [];
    for (let i = 0; i < words.length; i += maxWords) groups.push(words.slice(i, i + maxWords));
    const total = words.join(" ").length;
    let acc = 0;
    groups.forEach((g) => {
      const t = g.join(" ");
      const s = p.start + ((p.end - p.start) * acc) / total;
      acc += t.length + 1;
      const e = p.start + ((p.end - p.start) * Math.min(acc, total)) / total;
      out.push({start: Math.round(s), end: Math.round(e), text: t});
    });
  }
  // hold each chunk until the next one starts (no flicker in short gaps)
  return out.map((c, i) => {
    const next = out[i + 1];
    return {...c, end: next && next.start - c.end < 10 ? next.start : c.end + 4};
  });
};

export const S1Captions: React.FC<{
  chunks: S1Chunk[];
  /** returns true while the split-screen layout is on screen */
  isSplit?: (frame: number) => boolean;
  /** black box even over the talking head (for light / busy wardrobe) */
  boxed?: boolean;
}> = ({chunks, isSplit, boxed}) => {
  const frame = useCurrentFrame();
  const c = chunks.find((x) => frame >= x.start && frame < x.end);
  if (!c) return null;
  const split = isSplit?.(frame) ?? false;
  const isArabic = /[؀-ۿ]/.test(c.text);

  if (split || boxed) {
    return (
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: split ? S1.layout.split - 78 : S1.layout.captionY - 40,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontFamily: S1.font.caption,
            fontWeight: 700,
            fontSize: S1.size.captionSplit,
            color: S1.color.white,
            background: S1.color.ink,
            padding: "2px 16px 6px",
            lineHeight: 1.35,
            direction: isArabic ? "rtl" : "ltr",
          }}
        >
          <KaraokeText text={c.text} start={c.start} end={c.end} />
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 90,
        top: S1.layout.captionY - 40,
        textAlign: "center",
        fontFamily: S1.font.caption,
        fontWeight: 700,
        fontSize: S1.size.caption,
        color: S1.color.white,
        lineHeight: 1.35,
        direction: isArabic ? "rtl" : "ltr",
        textShadow: "0 2px 10px rgba(0,0,0,0.7), 0 0 2px rgba(0,0,0,0.6)",
      }}
    >
      <KaraokeText text={c.text} start={c.start} end={c.end} />
    </div>
  );
};
