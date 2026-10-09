import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {CAPTION_PAGES, Word} from "./edit";
import {C, FONT, textStroke} from "./theme";

const colorFor = (w: Word) =>
  w.kind === "hl" ? C.yellow : w.kind === "alert" ? C.red : C.white;

export const Captions: React.FC<{bottom: number}> = ({bottom}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const page = CAPTION_PAGES.find((p) => frame >= p.start && frame < p.end);
  if (!page) return null;

  const single = page.words.length === 1;

  return (
    <div
      style={{
        position: "absolute",
        left: 70,
        right: 70,
        bottom,
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        direction: "rtl",
        gap: "0 22px",
        fontFamily: FONT,
        fontWeight: 900,
        lineHeight: 1.25,
      }}
    >
      {page.words.map((w, i) => {
        if (frame < w.start) {
          // keep layout stable: reserve the slot invisibly
          return (
            <span key={i} style={{fontSize: single ? 120 : 86, opacity: 0}}>
              {w.text}
            </span>
          );
        }
        const s = spring({frame: frame - w.start, fps, config: {damping: 12, stiffness: 220, mass: 0.6}});
        const scale = interpolate(s, [0, 1], [0.55, 1]);
        const lift = interpolate(s, [0, 1], [24, 0]);
        const special = w.kind !== "normal";
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              fontSize: single ? 120 : special ? 96 : 86,
              color: colorFor(w),
              transform: `translateY(${lift}px) scale(${scale})`,
              ...textStroke(14),
              textShadow: "0 8px 24px rgba(0,0,0,0.55)",
              unicodeBidi: "isolate",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
