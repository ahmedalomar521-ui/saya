// Jump-cut timeline helper: keep speech ranges, drop pauses, and map source
// seconds → output frames for placing captions and graphics.

export type S1Segment = {srcStart: number; srcEnd: number; outStart: number; duration: number};

export const makeTimeline = (
  speech: [number, number][],
  fps: number,
  padBefore = 0.08,
  padAfter = 0.12,
) => {
  const segments: S1Segment[] = [];
  let cursor = 0;
  let prevEnd = 0;
  for (const [s, e] of speech) {
    const srcStart = Math.max(prevEnd, Math.round((s - padBefore) * fps));
    const srcEnd = Math.round((e + padAfter) * fps);
    segments.push({srcStart, srcEnd, outStart: cursor, duration: srcEnd - srcStart});
    cursor += srcEnd - srcStart;
    prevEnd = srcEnd;
  }
  const total = cursor;
  const at = (t: number): number => {
    const f = t * fps;
    for (const seg of segments) {
      if (f < seg.srcStart) return seg.outStart;
      if (f <= seg.srcEnd) return Math.round(seg.outStart + (f - seg.srcStart));
    }
    return total;
  };
  /** Sequence props spanning source seconds a → b. */
  const span = (a: number, b: number) => ({from: at(a), durationInFrames: Math.max(1, at(b) - at(a))});
  return {segments, total, at, span};
};
