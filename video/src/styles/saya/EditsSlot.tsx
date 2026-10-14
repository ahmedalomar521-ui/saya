// EditsSlot — the reserved card for a reel-inside-a-reel (editing-rules §8,
// learned from رواء الجلاد, 2026-10-15). We render an empty framed card at the
// exact rectangle; the user drops the Edits "link to reel" element on top of it
// before posting, so the linked reel plays inside our frame and Instagram shows
// its "Watch full reel" chip. If no element is dropped, the card still reads as
// a deliberate "video here" slot (play glyph + label).
import {interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, SAYA} from "./tokens";

/** The default rectangle (1080×1920): portrait 9:16, centred on the chest. */
export const EDITS_CARD = {x: 368, y: 990, w: 344, h: 612};

export const EditsSlot: React.FC<{duration: number; rect?: typeof EDITS_CARD; label?: string}> = ({duration, rect = EDITS_CARD, label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: SAYA.spring.pop});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  const s = interpolate(p, [0, 1], [0.55, 1]);
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.w,
        height: rect.h,
        borderRadius: 28,
        // the border sits outside the rectangle so the dropped element fits inside it exactly
        outline: `5px solid ${SAYA.color.white}`,
        outlineOffset: 3,
        background: "linear-gradient(180deg, rgba(11,27,63,0.92), rgba(11,27,63,0.78))",
        boxShadow: "0 18px 50px rgba(0,0,0,0.55)",
        transform: `scale(${s})`,
        transformOrigin: "50% 100%",
        opacity: Math.min(p, out),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
      }}
    >
      <svg width={96} height={96} viewBox="0 0 24 24">
        <circle cx={12} cy={12} r={11} fill="rgba(255,255,255,0.12)" stroke={SAYA.color.white} strokeWidth={1.2} />
        <path d="M10 8.2v7.6l6-3.8Z" fill={SAYA.color.white} />
      </svg>
      {label ? (
        <div style={{fontFamily: SAYA.font, fontWeight: 700, fontSize: 30, color: SAYA.color.white, textAlign: "center", padding: "0 18px", lineHeight: 1.3}}>{label}</div>
      ) : null}
    </div>
  );
};
