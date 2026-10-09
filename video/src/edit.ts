// All times are in seconds of the source file public/footage/full.mp4
// (the four uploaded parts joined in order 14 → 2 → 1 → 11).

export const FPS = 30;

// Speech ranges kept from the recording. Take 1 supplies the hook,
// take 2 supplies everything from "بيخلّوا الناس" to the end.
// Pauses between ranges are cut out (jump cuts).
const SPEECH: [number, number][] = [
  // take 1 — hook
  [0.37, 3.4],
  [3.83, 4.79],
  [5.12, 7.54],
  // take 2
  [16.61, 19.11],
  [19.46, 21.04],
  [21.53, 22.33],
  [22.72, 23.81],
  [24.33, 25.07],
  [25.66, 26.8],
  [27.03, 27.6],
  [27.97, 29.91],
  [30.18, 30.62],
  [30.91, 31.48],
  [31.81, 32.65],
  [33.22, 35.15],
  [35.56, 35.86],
  [36.35, 37.22],
  [37.42, 38.86],
  [39.08, 40.86],
  [41.28, 41.78],
  [41.9, 43.73],
  [43.86, 44.45],
  [44.93, 47.23],
];

const PAD_BEFORE = 0.08;
const PAD_AFTER = 0.12;

export type Segment = {
  srcStart: number; // frames in source
  srcEnd: number;
  outStart: number; // frames in output
  duration: number;
};

export const SEGMENTS: Segment[] = (() => {
  const out: Segment[] = [];
  let cursor = 0;
  let prevEnd = 0;
  for (const [s, e] of SPEECH) {
    const srcStart = Math.max(prevEnd, Math.round((s - PAD_BEFORE) * FPS));
    const srcEnd = Math.round((e + PAD_AFTER) * FPS);
    out.push({
      srcStart,
      srcEnd,
      outStart: cursor,
      duration: srcEnd - srcStart,
    });
    cursor += srcEnd - srcStart;
    prevEnd = srcEnd;
  }
  return out;
})();

export const TAIL_FRAMES = 18;

export const TOTAL_FRAMES =
  SEGMENTS[SEGMENTS.length - 1].outStart +
  SEGMENTS[SEGMENTS.length - 1].duration +
  TAIL_FRAMES;

// Maps a source time (seconds) to an output frame. Times that fall in a
// removed pause snap to the start of the next kept segment.
export const srcToOut = (t: number): number => {
  const f = t * FPS;
  for (const seg of SEGMENTS) {
    if (f < seg.srcStart) return seg.outStart;
    if (f <= seg.srcEnd) return seg.outStart + (f - seg.srcStart);
  }
  const last = SEGMENTS[SEGMENTS.length - 1];
  return last.outStart + last.duration;
};

// ---- Captions ---------------------------------------------------------
// Phrase timings come from the provided SRT; text is cleaned up.
// Words wrapped in *stars* are highlighted, in !bangs! are alerts (red).

export type Phrase = {start: number; end: number; text: string};

export const PHRASES: Phrase[] = [
  {start: 0.42, end: 1.7, text: "إنستغرام ممكن يعطي"},
  {start: 1.8, end: 3.45, text: "*صورتك* *وصوتك* لأي حدا"},
  {start: 3.83, end: 4.8, text: "!وبموافقتك!"},
  {start: 5.13, end: 5.93, text: "بدون ما تعرف"},
  {start: 5.93, end: 7.56, text: "في *خيارين* مفعّلين عندك"},

  {start: 16.6, end: 18.07, text: "بيخلّوا الناس يعيدوا استخدام"},
  {start: 18.13, end: 19.17, text: "*محتواك* *وصوتك*"},
  {start: 19.46, end: 21.1, text: "ويعملوا عليه فيديوهات *AI*"},
  {start: 21.53, end: 22.4, text: "!وبموافقتك!"},
  {start: 22.73, end: 23.8, text: "بدون حتى ما تعرف"},
  {start: 24.33, end: 25.2, text: "كيف *بتطفّيهم؟*"},
  {start: 25.66, end: 26.8, text: "بتدخل على الإعدادات"},
  {start: 27.03, end: 27.7, text: "*Settings*"},
  {start: 27.97, end: 28.7, text: "المشاركة"},
  {start: 28.75, end: 29.95, text: "وإعادة الاستخدام"},
  {start: 30.18, end: 31.5, text: "*Share & Reuse*"},
  {start: 31.81, end: 32.7, text: "*طفّي* الخيارين"},
  {start: 33.22, end: 33.9, text: "بس رح تقلّي"},
  {start: 34.0, end: 35.86, text: "بيقدر *يسجّل* الشاشة! صح."},
  {start: 36.35, end: 37.2, text: "بس على الأقل"},
  {start: 37.42, end: 37.97, text: "ما تعطيه"},
  {start: 37.97, end: 39.0, text: "إنت *مفتاح* *البيت* وتقلّو"},
  {start: 39.08, end: 40.86, text: "تفضّل خود شو بيعجبك"},
  {start: 41.28, end: 43.73, text: "*ابعتها* لأي صانع أو صانعة محتوى"},
  {start: 43.86, end: 44.45, text: "بتعرفها"},
  {start: 44.93, end: 47.23, text: "*وتابعني* لأخبار الإنستغرام والـ*AI*"},
];

export type Word = {
  text: string;
  kind: "normal" | "hl" | "alert";
  start: number; // output frame
};

export type CaptionPage = {start: number; end: number; words: Word[]};

const parseWord = (raw: string): {text: string; kind: Word["kind"]} => {
  if (raw.includes("*")) return {text: raw.replace(/\*/g, ""), kind: "hl"};
  if (raw.includes("!") && raw.startsWith("!"))
    return {text: raw.replace(/!/g, ""), kind: "alert"};
  return {text: raw, kind: "normal"};
};

export const CAPTION_PAGES: CaptionPage[] = PHRASES.map((p, i) => {
  // Keep "Share & Reuse" as one token.
  const tokens = p.text
    .replace("*Share & Reuse*", "*Share&nbsp;&amp;&nbsp;Reuse*")
    .split(" ")
    .map((t) => t.replace("&nbsp;&amp;&nbsp;", " & "));
  const parsed = tokens.map(parseWord);
  const total = parsed.reduce((a, w) => a + w.text.length + 2, 0);
  let acc = 0;
  const startF = srcToOut(p.start);
  const endF = srcToOut(p.end);
  const words = parsed.map((w) => {
    const s = startF + ((endF - startF) * acc) / total;
    acc += w.text.length + 2;
    return {...w, start: Math.round(s)};
  });
  const next = PHRASES[i + 1];
  const pageEnd = next
    ? Math.min(srcToOut(next.start), endF + 12)
    : endF + TAIL_FRAMES;
  return {start: startF, end: Math.max(pageEnd, endF), words};
});

// ---- Overlay cues (source seconds → output frames) ---------------------
export const cue = (t: number) => Math.round(srcToOut(t));
