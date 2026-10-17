// Graphics that take the caption's place when something important is said
// (R4): FeaturePill (✦ feature name), BigWord (one huge glowing word). Plus
// StepPill (R2-d) and SaveCta (R2-f). Add the range to SayaCaptions `hide`
// when one of them sits where the caption is.
import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, navyGlass, neonGlow, SAYA} from "./tokens";

const usePop = (duration: number) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: SAYA.spring.pop});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  return {frame, p, out};
};

export const Sparkle: React.FC<{size: number; color?: string; spin?: number}> = ({size, color = SAYA.color.sky, spin = 0}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{transform: `rotate(${spin}deg)`, filter: neonGlow(SAYA.color.neon, 0.5)}}>
    <path d="M12 1.5 14.2 9.8 22.5 12l-8.3 2.2L12 22.5l-2.2-8.3L1.5 12l8.3-2.2Z" fill={color} />
  </svg>
);

/** ✦ Feature name pill in the caption's place (R4-d), e.g. "Content Preferences". */
export const FeaturePill: React.FC<{text: string; duration: number; y?: number}> = ({text, duration, y = SAYA.caption.chestY}) => {
  const {frame, p, out} = usePop(duration);
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: y,
        transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.5, 1]) * interpolate(out, [0, 1], [0.9, 1])})`,
        opacity: Math.min(p, out),
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px 40px 20px 30px",
        borderRadius: 99,
        fontFamily: SAYA.font,
        fontWeight: 900,
        fontSize: 54,
        color: SAYA.color.white,
        whiteSpace: "nowrap",
        ...navyGlass(0.85),
        border: `2.5px solid ${SAYA.color.neon}`,
      }}
    >
      <Sparkle size={56} spin={interpolate(frame, [0, 20], [-90, 0], clamp)} />
      <span>{text}</span>
    </div>
  );
};

/** One big glowing word in the caption's place (the punchline). */
export const BigWord: React.FC<{text: string; duration: number; y?: number}> = ({text, duration, y = SAYA.caption.chestY}) => {
  const {frame, p, out} = usePop(duration);
  const flick = 0.9 + 0.1 * Math.sin(frame / 2.5);
  return (
    <div
      style={{
        position: "absolute",
        left: SAYA.safe.left,
        width: SAYA.safe.right - SAYA.safe.left,
        top: y,
        transform: `translateY(-50%) scale(${interpolate(p, [0, 1], [1.4, 1])})`,
        opacity: Math.min(interpolate(frame, [0, 3], [0, 1], clamp), out) * flick,
        textAlign: "center",
        fontFamily: SAYA.font,
        fontWeight: 900,
        fontSize: 128,
        lineHeight: 1.1,
        color: SAYA.color.white,
        filter: neonGlow(SAYA.color.neon, 0.9),
      }}
    >
      {text}
    </div>
  );
};

/** Step pill with a pointer (R2-d): "الخطوة ١". */
export const StepPill: React.FC<{text: string; duration: number; x?: number; y?: number}> = ({text, duration, x = 540, y = 1000}) => {
  const {p, out} = usePop(duration);
  return (
    <div style={{position: "absolute", left: x, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.4, 1])})`, opacity: Math.min(p, out), display: "flex", flexDirection: "column", alignItems: "center"}}>
      <div style={{padding: "16px 38px", borderRadius: 99, background: SAYA.color.neon, color: SAYA.color.white, fontFamily: SAYA.font, fontWeight: 900, fontSize: 46, boxShadow: `0 0 30px ${SAYA.color.neon}, 0 10px 30px rgba(0,0,0,0.4)`, whiteSpace: "nowrap"}}>
        {text}
      </div>
      <svg width={40} height={26} viewBox="0 0 40 26" style={{marginTop: 6}}>
        <path d="M20 26 0 0h40Z" fill={SAYA.color.white} />
      </svg>
    </div>
  );
};

/** Save CTA (R2-f): bookmark icon that fills, with "احفظ الفيديو". */
/** `kind: "share"` swaps the bookmark for a paper plane (send to a friend). */
/** `big` (user reference m.3d3, 2026-10-17): no pill and no text, just a large white icon on the
 *  chest (outline first, then it fills white). Default y 1030, size 200. */
export const SaveCta: React.FC<{text?: string; duration: number; fillAt?: number; y?: number; kind?: "save" | "share"; big?: boolean}> = ({text = "احفظ الفيديو", duration, fillAt = 12, y, kind = "save", big = false}) => {
  const {frame, p, out} = usePop(duration);
  const fill = interpolate(frame, [fillAt, fillAt + 6], [0, 1], clamp);
  const bump = 1 + 0.18 * Math.sin(Math.min(1, Math.max(0, (frame - fillAt) / 8)) * Math.PI);
  if (big) {
    return (
      <div style={{position: "absolute", left: 540, top: y ?? 1030, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1]) * bump})`, opacity: Math.min(p, out), filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.45))"}}>
        <svg width={200} height={260} viewBox="0 0 24 24">
          <path d={kind === "share" ? "M21 3 3 10.5l7 2.5 2.5 7Z" : "M6 3h12v18l-6-4.5L6 21Z"} fill={SAYA.color.white} fillOpacity={fill} stroke={SAYA.color.white} strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
      </div>
    );
  }
  y = y ?? 1330;
  return (
    <div style={{position: "absolute", left: 540, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(p, out), display: "flex", alignItems: "center", gap: 18, direction: "rtl", padding: "18px 34px", borderRadius: 99, ...navyGlass()}}>
      <svg width={58} height={58} viewBox="0 0 24 24" style={{transform: `scale(${bump})`, filter: fill > 0 ? neonGlow(SAYA.color.neon, 0.5) : undefined}}>
        <path d={kind === "share" ? "M21 3 3 10.5l7 2.5 2.5 7Z" : "M6 3h12v18l-6-4.5L6 21Z"} fill={fill > 0 ? SAYA.color.sky : "none"} fillOpacity={fill} stroke={SAYA.color.white} strokeWidth={1.8} strokeLinejoin="round" />
      </svg>
      <span style={{fontFamily: SAYA.font, fontWeight: 900, fontSize: 46, color: SAYA.color.white, whiteSpace: "nowrap"}}>{text}</span>
    </div>
  );
};

/** Follow CTA (end card): Saya's avatar with a glowing ring, her handle and a
 *  "تابعني" button that gets pressed. */
export const FollowCta: React.FC<{avatar: string; handle: string; text?: string; duration: number; y?: number; pressAt?: number}> = ({avatar, handle, text = "تابعني", duration, y = 1320, pressAt = 14}) => {
  const {frame, p, out} = usePop(duration);
  const press = interpolate(frame, [pressAt, pressAt + 4, pressAt + 9], [1, 0.9, 1], clamp);
  const done = frame >= pressAt + 4;
  return (
    <div style={{position: "absolute", left: 540, top: y, transform: `translate(-50%, -50%) scale(${interpolate(p, [0, 1], [0.6, 1])})`, opacity: Math.min(p, out), display: "flex", alignItems: "center", gap: 22, direction: "rtl", padding: "16px 18px 16px 30px", borderRadius: 99, ...navyGlass(0.88)}}>
      <Img src={avatar} style={{width: 92, height: 92, borderRadius: 99, objectFit: "cover", boxShadow: `0 0 0 4px ${SAYA.color.neon}, 0 0 22px ${SAYA.color.neon}`}} />
      <span style={{fontFamily: "SayaLat, sans-serif", fontWeight: 900, fontSize: 42, color: SAYA.color.white, direction: "ltr"}}>@{handle}</span>
      <div style={{transform: `scale(${press})`, padding: "14px 30px", borderRadius: 99, background: done ? "transparent" : SAYA.color.neon, border: `3px solid ${SAYA.color.neon}`, fontFamily: SAYA.font, fontWeight: 900, fontSize: 38, color: SAYA.color.white, boxShadow: done ? undefined : `0 0 24px ${SAYA.color.neon}`}}>
        {done ? "✓" : text}
      </div>
    </div>
  );
};
