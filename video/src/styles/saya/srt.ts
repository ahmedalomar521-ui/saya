// SRT → word timings → caption chunks.
// Saya's videos come with an SRT made on the raw footage. Words inside a cue
// get times spread by their length. Chunks are 2–3 words and never span two
// cues, so a phrase is never shown twice.

export type SrtCue = {start: number; end: number; text: string}; // seconds
export type Word = {text: string; start: number; end: number}; // frames
export type Chunk = {words: Word[]; start: number; end: number}; // frames

const toSec = (t: string) => {
  const [h, m, rest] = t.trim().replace(",", ".").split(":");
  return Number(h) * 3600 + Number(m) * 60 + Number(rest);
};

export const parseSrt = (srt: string): SrtCue[] =>
  srt
    .replace(/\r/g, "")
    .split(/\n\s*\n/)
    .map((block) => block.trim().split("\n"))
    .filter((l) => l.length >= 2)
    .map((lines) => {
      const timeIdx = lines.findIndex((l) => l.includes("-->"));
      const [a, b] = lines[timeIdx].split("-->");
      return {start: toSec(a), end: toSec(b), text: lines.slice(timeIdx + 1).join(" ").trim()};
    })
    .filter((c) => c.text.length > 0);

/** Spread each cue's time over its words (weighted by letters). */
export const cuesToWords = (cues: SrtCue[], fps: number): Word[][] =>
  cues.map((c) => {
    const parts = c.text.split(/\s+/).filter(Boolean);
    const weights = parts.map((w) => w.length + 2);
    const total = weights.reduce((x, y) => x + y, 0);
    let t = c.start;
    return parts.map((text, i) => {
      const d = ((c.end - c.start) * weights[i]) / total;
      const w = {text, start: Math.round(t * fps), end: Math.round((t + d) * fps)};
      t += d;
      return w;
    });
  });

/** Split each cue's words into chunks of up to maxWords / maxChars. */
export const wordsToChunks = (cueWords: Word[][], maxWords = 3, maxChars = 18): Chunk[] => {
  const chunks: Chunk[] = [];
  for (const words of cueWords) {
    let cur: Word[] = [];
    const flush = () => {
      if (cur.length) chunks.push({words: cur, start: cur[0].start, end: cur[cur.length - 1].end});
      cur = [];
    };
    for (const w of words) {
      const len = cur.map((x) => x.text).join(" ").length + w.text.length + 1;
      if (cur.length >= maxWords || (cur.length > 0 && len > maxChars)) flush();
      cur.push(w);
      if (/[.،,!?؟:]$/.test(w.text)) flush();
    }
    flush();
  }
  return chunks;
};

export const srtToChunks = (srt: string, fps: number, maxWords = 3, maxChars = 18) =>
  wordsToChunks(cuesToWords(parseSrt(srt), fps), maxWords, maxChars);

/** First frame where a word matching `re` is spoken (to time a logo pop). */
export const findWord = (chunks: Chunk[], re: RegExp): number | undefined => {
  for (const c of chunks) for (const w of c.words) if (re.test(w.text)) return w.start;
  return undefined;
};
