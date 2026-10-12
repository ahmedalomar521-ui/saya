// Screen pieces learned from reference R6 (the "Claude Skills" reel):
// - DesktopCard: a big white rounded card that holds a desktop screenshot or
//   screen recording over the blurred footage, with a soft neon edge. Pair it
//   with a `pip` range so Saya sits in the glowing bubble at its top corner
//   (pipPlace ≈ {x: 70, y: 300, d: 230}). A tall screenshot can scroll.
// - ChatExchange: the prompt types into a frosted-glass bubble (top right),
//   then the answer builds line by line in a tall frosted panel at the side
//   and scrolls up as it grows. Default `center`: pair it with a `pip` range
//   (Saya in the bubble, footage blurred) so the panel never covers her face;
//   `left` / `right` put a narrow panel at the side for wide shots only.
import {Video} from "@remotion/media";
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {clamp, SAYA} from "./tokens";

const resolveSrc = (src: string) => (/^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src));

const frost: React.CSSProperties = {
  background: "rgba(255,255,255,0.14)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "2px solid rgba(255,255,255,0.45)",
  boxShadow: "0 10px 40px rgba(0,0,0,0.25)",
};

export const DesktopCard: React.FC<{
  src: string;
  duration: number;
  isVideo?: boolean;
  trimBefore?: number;
  playbackRate?: number;
  /** content width / height (screenshot or recording) */
  aspect?: number;
  /** 0 = no scroll; else the image is taller than the card and pans down over the insert */
  scroll?: boolean;
  /** visible card height in px (default from aspect, max 900) */
  height?: number;
  top?: number;
  width?: number;
}> = ({src, duration, isVideo, trimBefore, playbackRate, aspect = 16 / 10, scroll, height, top = 360, width = 900}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: SAYA.spring.rise});
  const out = interpolate(frame, [duration - 8, duration], [0, 1], clamp);
  const contentH = width / aspect;
  const h = height ?? Math.min(contentH, 900);
  const pan = scroll ? interpolate(frame, [10, duration - 12], [0, Math.max(0, contentH - h)], {...clamp, easing: Easing.inOut(Easing.sin)}) : 0;
  return (
    <div style={{position: "absolute", left: 540 - width / 2, top: top + (1 - s) * 120 + out * 60, width, height: h, borderRadius: 30, overflow: "hidden", background: "#fff", opacity: Math.min(s * 1.5, 1 - out), transform: `scale(${interpolate(s, [0, 1], [0.92, 1])})`, boxShadow: `0 0 0 3px rgba(255,255,255,0.9), 0 0 36px ${SAYA.color.neon}, 0 0 80px ${SAYA.color.neon}66, 0 30px 70px rgba(0,0,0,0.45)`}}>
      <div style={{position: "absolute", left: 0, top: -pan, width, height: contentH}}>
        {isVideo ? <Video src={resolveSrc(src)} muted trimBefore={trimBefore} playbackRate={playbackRate} objectFit="cover" style={{width, height: contentH}} /> : <Img src={resolveSrc(src)} style={{width, height: contentH, objectFit: "cover"}} />}
      </div>
    </div>
  );
};

export const ChatExchange: React.FC<{prompt: string; answer: string[]; duration: number; side?: "left" | "right" | "center"; answerAt?: number}> = ({prompt, answer, duration, side = "center", answerAt = 30}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const out = interpolate(frame, [duration - 8, duration], [1, 0], clamp);
  const qIn = spring({frame, fps, config: SAYA.spring.pop});
  const typed = Math.floor(interpolate(frame, [4, 4 + prompt.length * 0.8], [0, prompt.length], clamp));
  const aIn = spring({frame: frame - answerAt, fps, config: SAYA.spring.rise});
  const perLine = 6;
  const shown = Math.max(0, Math.floor((frame - answerAt - 6) / perLine) + 1);
  const lineH = 62;
  const panelH = 760;
  const scroll = Math.max(0, shown * lineH - (panelH - 60));
  const panelW = side === "center" ? 760 : 380;
  const panelX = side === "left" ? 50 : side === "right" ? 1080 - 50 - panelW : 540 - panelW / 2;
  return (
    <div style={{position: "absolute", inset: 0, opacity: out, direction: "rtl", fontFamily: SAYA.font}}>
      {/* prompt bubble */}
      <div style={{position: "absolute", right: 70, top: 300, maxWidth: 560, padding: "22px 30px", borderRadius: 26, ...frost, transform: `scale(${interpolate(qIn, [0, 1], [0.7, 1])})`, transformOrigin: "100% 0", opacity: qIn, color: "#fff", fontWeight: 800, fontSize: 40, lineHeight: 1.35, textShadow: "0 2px 8px rgba(0,0,0,0.35)"}}>
        {prompt.slice(0, typed)}
      </div>
      {/* answer panel */}
      {frame >= answerAt ? (
        <div style={{position: "absolute", left: panelX, top: 470, width: panelW, height: panelH, borderRadius: 26, overflow: "hidden", ...frost, opacity: aIn, transform: `translateY(${(1 - aIn) * 60}px)`}}>
          <div style={{position: "absolute", left: 30, right: 30, top: 30 - scroll}}>
            {answer.slice(0, shown).map((l, i) => {
              const p = interpolate(frame - answerAt - 6 - i * perLine, [0, 6], [0, 1], clamp);
              return (
                <div key={i} style={{height: lineH, color: "#fff", fontWeight: l.endsWith(":") ? 900 : 700, fontSize: 34, lineHeight: `${lineH}px`, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", opacity: p, textShadow: "0 2px 8px rgba(0,0,0,0.35)"}}>
                  {l}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};
