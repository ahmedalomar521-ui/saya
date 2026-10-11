// Inserts that sit on the blurred footage: phone mock-up (R3/R4), screenshot
// card (R5), glass card + info chip + source tag (R3). Use each inside a
// <Sequence> and blur the footage for the same range (SayaFootage `blur`/`pip`).
import {Video} from "@remotion/media";
import {Img, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, navyGlass, SAYA} from "./tokens";

const enter = (frame: number, fps: number, duration: number, config: Parameters<typeof spring>[0]["config"] = SAYA.spring.rise) => {
  const inP = spring({frame, fps, config});
  const outP = interpolate(frame, [duration - 8, duration], [0, 1], clamp);
  return {inP, outP};
};

/** iPhone-style frame. Content: an image/video (`src`) or children. Rises from
 *  below with a slight overshoot and drops out at the end. */
export const PhoneMock: React.FC<{
  duration: number;
  src?: string;
  isVideo?: boolean;
  /** Screen recordings: skip the start (frames of the recording) and speed up. */
  trimBefore?: number;
  playbackRate?: number;
  children?: React.ReactNode;
  width?: number;
  top?: number;
}> = ({duration, src, isVideo, trimBefore, playbackRate, children, width = 500, top = 420}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {inP, outP} = enter(frame, fps, duration);
  const h = width * 2.06;
  const y = interpolate(inP, [0, 1], [1920 - top + 40, 0]) + interpolate(outP, [0, 1], [0, 1920 - top]);
  const bezel = width * 0.035;
  return (
    <div
      style={{
        position: "absolute",
        left: 540 - width / 2,
        top: top + y,
        width,
        height: h,
        borderRadius: width * 0.14,
        background: "#0A0C12",
        padding: bezel,
        boxShadow: `0 0 0 2px #2A2F3A, 0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${SAYA.color.neon}55`,
      }}
    >
      <div style={{position: "relative", width: "100%", height: "100%", borderRadius: width * 0.11, overflow: "hidden", background: "#fff"}}>
        {src ? (
          isVideo ? (
            <Video src={src} muted trimBefore={trimBefore} playbackRate={playbackRate} objectFit="cover" style={{width: "100%", height: "100%"}} />
          ) : (
            <Img src={src} style={{width: "100%", height: "100%", objectFit: "cover"}} />
          )
        ) : (
          children
        )}
        {/* dynamic island */}
        <div style={{position: "absolute", top: width * 0.03, left: "50%", transform: "translateX(-50%)", width: width * 0.3, height: width * 0.075, borderRadius: 99, background: "#000"}} />
      </div>
    </div>
  );
};

/** A tap on the phone screen (R4-f): glowing pulse at (x, y) in canvas pixels. */
export const TapPulse: React.FC<{x: number; y: number}> = ({x, y}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, 14], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 90,
        height: 90,
        marginLeft: -45,
        marginTop: -45,
        borderRadius: 99,
        border: `5px solid ${SAYA.color.sky}`,
        transform: `scale(${0.4 + p})`,
        opacity: 1 - p,
        boxShadow: `0 0 24px ${SAYA.color.neon}`,
      }}
    />
  );
};

/** Screenshot card (R5): white-bordered rounded card, slides up with a
 *  vertical motion blur. */
export const ScreenshotCard: React.FC<{src: string; duration: number; aspect?: number; centerY?: number}> = ({src, duration, aspect = 0.75, centerY = 860}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {inP, outP} = enter(frame, fps, duration, SAYA.spring.soft);
  const w = SAYA.safe.right - SAYA.safe.left;
  const h = w / aspect;
  const dy = interpolate(inP, [0, 1], [700, 0]) - interpolate(outP, [0, 1], [0, 700]);
  const mb = Math.min(18, Math.abs(dy) / 30);
  return (
    <div
      style={{
        position: "absolute",
        left: SAYA.safe.left,
        top: centerY - h / 2 + dy,
        width: w,
        height: h,
        borderRadius: 28,
        border: "8px solid #fff",
        overflow: "hidden",
        background: "#fff",
        opacity: interpolate(frame, [0, 4], [0, 1], clamp) * (1 - outP),
        filter: mb > 0.5 ? `blur(${mb}px)` : undefined,
        boxShadow: `0 24px 70px rgba(0,0,0,0.55), 0 0 30px ${SAYA.color.neon}55`,
      }}
    >
      <Img src={src} style={{width: "100%", height: "100%", objectFit: "cover"}} />
    </div>
  );
};

/** Navy glass card for a product name (R3-c), e.g. "Introducing Muse". */
export const GlassCard: React.FC<{title: string; sub?: string; duration: number; centerY?: number}> = ({title, sub, duration, centerY = 860}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {inP, outP} = enter(frame, fps, duration, SAYA.spring.pop);
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        width: 800,
        top: centerY,
        transform: `translateY(-50%) scale(${interpolate(inP, [0, 1], [0.85, 1]) * (1 - 0.1 * outP)})`,
        opacity: Math.min(inP, 1 - outP),
        padding: "56px 40px",
        borderRadius: 36,
        textAlign: "center",
        fontFamily: SAYA.font,
        color: SAYA.color.white,
        ...navyGlass(),
      }}
    >
      <div style={{fontSize: 76, fontWeight: 900, lineHeight: 1.1, textShadow: `0 0 22px ${SAYA.color.neon}`}}>{title}</div>
      {sub ? <div style={{fontSize: 36, fontWeight: 700, color: SAYA.color.sky, marginTop: 14}}>{sub}</div> : null}
    </div>
  );
};

/** Info chip (R3-e): dark glass with an icon slot, a title and a small label. */
export const InfoChip: React.FC<{title: string; label?: string; icon?: React.ReactNode; duration: number; y?: number}> = ({title, label, icon, duration, y = 1280}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {inP, outP} = enter(frame, fps, duration, SAYA.spring.pop);
  return (
    <div
      style={{
        position: "absolute",
        left: 540,
        top: y,
        transform: `translate(-50%, -50%) translateY(${interpolate(inP, [0, 1], [40, 0])}px)`,
        opacity: Math.min(inP, 1 - outP),
        display: "flex",
        alignItems: "center",
        gap: 22,
        direction: "rtl",
        padding: "22px 30px",
        borderRadius: 28,
        fontFamily: SAYA.font,
        color: SAYA.color.white,
        whiteSpace: "nowrap",
        ...navyGlass(),
      }}
    >
      {icon ? <div style={{width: 72, height: 72, borderRadius: 18, background: SAYA.color.neon, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40}}>{icon}</div> : null}
      <div>
        {label ? <div style={{fontSize: 24, fontWeight: 700, color: SAYA.color.grey}}>{label}</div> : null}
        <div style={{fontSize: 44, fontWeight: 900}}>{title}</div>
      </div>
    </div>
  );
};

/** Source tag (R3-d) under a visual: "لقطات رسمية من Meta". */
export const SourceTag: React.FC<{text: string; y?: number}> = ({text, y = 1500}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 540, top: y, transform: "translate(-50%, -50%)", padding: "10px 24px", borderRadius: 99, whiteSpace: "nowrap", fontFamily: SAYA.font, fontWeight: 700, fontSize: 28, color: "#D6E2F5", opacity: interpolate(frame, [0, 8], [0, 1], clamp), ...navyGlass(0.7)}}>
      {text}
    </div>
  );
};

/** Floating window above the head (R2-b): a rounded image that drops in with a
 *  glowing frame and floats — e.g. the result of an AI image prompt. */
export const FloatingWindow: React.FC<{src: string; duration: number; width?: number; aspect?: number; top?: number; x?: number; label?: string}> = ({src, duration, width = 470, aspect = 1.05, top = 300, x = 540, label}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {inP, outP} = enter(frame, fps, duration, SAYA.spring.pop);
  const h = width / aspect;
  const float = Math.sin(frame / 16) * 8;
  const reveal = interpolate(frame, [4, 16], [0, 100], clamp); // image wipes in
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: top + float + interpolate(inP, [0, 1], [-60, 0]),
        width,
        transform: `scale(${interpolate(inP, [0, 1], [0.7, 1]) * (1 - 0.15 * outP)}) rotate(${interpolate(inP, [0, 1], [-4, -1.5])}deg)`,
        opacity: Math.min(inP, 1 - outP),
      }}
    >
      <div style={{width, height: h, borderRadius: 30, overflow: "hidden", border: `5px solid ${SAYA.color.sky}`, boxShadow: `0 0 0 2px ${SAYA.color.neon}, 0 0 40px ${SAYA.color.neon}, 0 20px 50px rgba(0,0,0,0.5)`, background: SAYA.color.navy}}>
        <Img src={src} style={{width: "100%", height: "100%", objectFit: "cover", clipPath: `inset(0 0 ${100 - reveal}% 0)`}} />
      </div>
      {label ? (
        <div style={{position: "absolute", left: "50%", bottom: -26, transform: "translateX(-50%)", padding: "8px 22px", borderRadius: 99, fontFamily: SAYA.font, fontWeight: 900, fontSize: 30, color: SAYA.color.white, whiteSpace: "nowrap", ...navyGlass(0.9)}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};
