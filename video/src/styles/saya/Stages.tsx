// Full-screen and UI inserts ported from ستايل 1/2 and the shared overlays,
// re-skinned for Saya (Cairo, navy / neon):
// - ListStage: a navy stage where glossy chips build one by one (a list of 2–4
//   things: problem / solution / options). Each item gets its own shape.
// - StrikeStage: a paper card where lines build and a red marker strikes the
//   wrong one (a correction).
// - StatCard: a number that counts up and lands (numbers, percentages).
// - PromptBox: a chat input that types a prompt and sends it.
// - RecFrame: screen-recording corners + a blinking REC pill.
// - NotificationBanner: an iOS-style banner dropping from the top.
// They cover the footage, so SayaEdit hides the captions while they play
// (ListStage, StrikeStage). Text is Arabic RTL; numbers are Western digits.
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, navyGlass, neonGlow, SAYA} from "./tokens";

const useBlurIn = (delay = 0, len = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
};

// ---------------------------------------------------------------- list stage

export type ChipIcon = "clock" | "alert" | "check" | "question" | "tool" | "chip" | "sparkle" | "robot" | "video" | "audio" | "link";
export type ChipTone = "blue" | "sky" | "red" | "green" | "amber";
const TONES: Record<ChipTone, [string, string]> = {
  blue: ["#3AA0FF", "#1E6FE0"],
  sky: ["#8FD3FF", "#3FA8E8"],
  red: ["#FF6B6B", "#E23B46"],
  green: ["#62D97A", "#2FB653"],
  amber: ["#FFC857", "#F2A33A"],
};

const ChipGlyph: React.FC<{icon: ChipIcon; size: number}> = ({icon, size}) => {
  const st = {stroke: "#fff", strokeWidth: 2, fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const};
  const inner = {
    clock: <><circle cx="12" cy="13" r="7" {...st} /><path d="M12 9.5 V13 L14.5 14.5 M9 3.5 h6" {...st} /></>,
    alert: <><path d="M12 4 L21 19 H3 Z" {...st} /><path d="M12 10 v4 M12 16.5 v.5" {...st} /></>,
    check: <><circle cx="12" cy="12" r="8.5" {...st} /><path d="M8 12.5 L11 15 L16 9.5" {...st} /></>,
    question: <><circle cx="12" cy="12" r="8.5" {...st} /><path d="M9.5 9.5 a2.5 2.5 0 1 1 3.5 2.3 c-.7.4-1 .9-1 1.7 M12 16.5 v.5" {...st} /></>,
    tool: <path d="M14.5 5.5 a4 4 0 0 0 4.9 5 l-8.6 8.6 a2 2 0 0 1-2.9-2.9 l8.6-8.6 a4 4 0 0 0-2-2.1 Z" {...st} />,
    chip: <><rect x="6" y="6" width="12" height="12" rx="2" {...st} /><path d="M9 3v3 M15 3v3 M9 18v3 M15 18v3 M3 9h3 M3 15h3 M18 9h3 M18 15h3" {...st} /></>,
    sparkle: <path d="M12 3 L13.8 10.2 L21 12 L13.8 13.8 L12 21 L10.2 13.8 L3 12 L10.2 10.2 Z" {...st} />,
    robot: <><rect x="5" y="8" width="14" height="10" rx="3" {...st} /><path d="M12 4 v4 M9 13 v.5 M15 13 v.5 M3 13 h2 M19 13 h2" {...st} /></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2.5" {...st} /><path d="M16 10.5 L21 7.5 V16.5 L16 13.5" {...st} /></>,
    audio: <path d="M5 10 v4 M8.5 7 v10 M12 4 v16 M15.5 7 v10 M19 10 v4" {...st} />,
    link: <path d="M10 14 a4 4 0 0 0 5.7 0 l3-3 a4 4 0 0 0-5.7-5.7 l-1 1 M14 10 a4 4 0 0 0-5.7 0 l-3 3 a4 4 0 0 0 5.7 5.7 l1-1" {...st} />,
  }[icon];
  return <svg width={size} height={size} viewBox="0 0 24 24">{inner}</svg>;
};

export type ListItem = {label: string; icon: ChipIcon; tone?: ChipTone; sub?: string; /** frames from the start of the insert */ at?: number};

const Chip: React.FC<{item: ListItem; delay: number}> = ({item, delay}) => {
  const frame = useCurrentFrame();
  const p = useBlurIn(delay, 10);
  const [c0, c1] = TONES[item.tone ?? "blue"];
  const subN = item.sub ? Math.floor(interpolate(frame - delay - 10, [0, item.sub.length * 0.9], [0, item.sub.length], clamp)) : 0;
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 18}}>
      <div style={{position: "relative", display: "flex", alignItems: "center", gap: 26, direction: "rtl", padding: "22px 44px 26px 50px", borderRadius: 26, background: `linear-gradient(180deg, ${c0}, ${c1})`, boxShadow: `0 18px 40px ${c1}66, inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -4px 10px rgba(0,0,0,0.12)`, border: "3px solid rgba(255,255,255,0.55)", opacity: p, filter: `blur(${(1 - p) * 18}px)`, transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`}}>
        <div style={{width: 84, height: 84, borderRadius: 84, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <ChipGlyph icon={item.icon} size={58} />
        </div>
        <span style={{fontFamily: SAYA.font, fontWeight: 900, fontSize: 72, color: "#fff", textShadow: "0 3px 8px rgba(0,0,0,0.25)", lineHeight: 1.2}}>{item.label}</span>
        <div style={{position: "absolute", left: 10, right: 10, top: 6, height: "38%", borderRadius: 20, background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))"}} />
      </div>
      {item.sub ? <div style={{fontFamily: SAYA.font, fontWeight: 800, fontSize: 42, color: SAYA.color.sky, direction: "rtl", minHeight: 56}}>{item.sub.slice(0, subN)}</div> : null}
    </div>
  );
};

export const ListStage: React.FC<{items: ListItem[]; duration: number}> = ({items, duration}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out, background: `linear-gradient(165deg, #0E2352 0%, ${SAYA.color.navy} 60%, #07122B 100%)`}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at ${30 + drift / 10}% ${70 - drift / 20}%, ${SAYA.color.neon}55 0%, rgba(30,144,255,0) 48%)`}} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", gap: 70, flexDirection: "column"}}>
        {items.map((it, i) => (
          <Chip key={i} item={it} delay={it.at ?? i * 22} />
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- strike stage

export type StrikeLine = {text: string; at: number; size?: number; strike?: boolean};

const MarkerStroke: React.FC<{delay: number}> = ({delay}) => {
  const p = useBlurIn(delay, 10);
  return (
    <svg viewBox="0 0 400 60" preserveAspectRatio="none" style={{position: "absolute", left: -10, right: -10, top: "48%", width: "calc(100% + 20px)", height: 60}}>
      <path d="M395 30 C300 18 200 42 110 26 C70 20 30 34 5 30 M390 40 C280 30 180 50 20 38" stroke="#E8283A" strokeWidth={16} strokeLinecap="round" fill="none" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)} opacity={0.92} />
    </svg>
  );
};

export const StrikeStage: React.FC<{lines: StrikeLine[]; duration: number; top?: number}> = ({lines, duration, top = 560}) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: out, background: "radial-gradient(ellipse at 50% 35%, #FFFFFF 0%, #E9E9EA 45%, #C9CACC 100%)"}}>
      <div style={{position: "absolute", top, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 22, direction: "rtl"}}>
        {lines.map((l, li) => {
          const words = l.text.split(" ");
          return (
            <div key={li} style={{position: "relative", display: "flex", gap: 22, direction: "rtl"}}>
              {words.map((w, wi) => {
                const p = interpolate(frame - l.at - wi * 3, [0, 7], [0, 1], clamp);
                return (
                  <span key={wi} style={{fontFamily: SAYA.font, fontWeight: 900, fontSize: l.size ?? 120, color: "#1E1E22", opacity: p, filter: `blur(${(1 - p) * 8}px)`, textShadow: "0 6px 14px rgba(0,0,0,0.12)", lineHeight: 1.3}}>
                    {w}
                  </span>
                );
              })}
              {l.strike ? <MarkerStroke delay={l.at + words.length * 3 + 6} /> : null}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- stat card

/** A number that counts up and lands on `value`, with an optional label. Sits
 *  over the blurred footage like the other glass cards. */
export const StatCard: React.FC<{value: number; suffix?: string; label?: string; duration: number; frames?: number; centerY?: number}> = ({value, suffix = "", label, duration, frames = 24, centerY = 900}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: SAYA.spring.pop});
  const out = interpolate(frame, [duration - 8, duration], [1, 0], clamp);
  const v = interpolate(frame, [4, 4 + frames], [0, value], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: "absolute", left: 540, top: centerY, transform: `translate(-50%, -50%) scale(${interpolate(s, [0, 1], [0.6, 1])})`, opacity: Math.min(s, out), padding: "34px 64px", borderRadius: 40, textAlign: "center", ...navyGlass(0.82)}}>
      <div style={{fontFamily: "SayaLat, sans-serif", fontWeight: 900, fontSize: 230, lineHeight: 1, color: SAYA.color.white, filter: neonGlow(SAYA.color.neon, 0.8), direction: "ltr"}}>
        {Math.round(v)}
        {suffix}
      </div>
      {label ? <div style={{fontFamily: SAYA.font, fontWeight: 800, fontSize: 52, color: SAYA.color.sky, marginTop: 8, direction: "rtl"}}>{label}</div> : null}
    </div>
  );
};

// ---------------------------------------------------------------- prompt box

export const PromptBox: React.FC<{text: string; duration: number; placeholder?: string; sendAt?: number; centerY?: number}> = ({text, duration, placeholder = "اكتب البرومبت…", sendAt, centerY = 900}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: SAYA.spring.rise});
  const out = interpolate(frame, [duration - 8, duration], [1, 0], clamp);
  const typeEnd = sendAt ? sendAt - 6 : 4 + text.length * 0.9;
  const n = Math.floor(interpolate(frame, [4, typeEnd], [0, text.length], clamp));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const sent = sendAt !== undefined && frame >= sendAt;
  const ar = /[؀-ۿ]/.test(text);
  return (
    <div style={{position: "absolute", left: 90, right: 90, top: centerY, transform: `translateY(calc(-50% + ${(1 - s) * 60}px))`, opacity: Math.min(s, out), display: "flex", alignItems: "flex-end", gap: 24, direction: ar ? "rtl" : "ltr", padding: "34px 36px", borderRadius: 36, ...navyGlass(0.88), border: `3px solid ${sent ? SAYA.color.sky : "rgba(143,211,255,0.35)"}`}}>
      <div style={{flex: 1, fontFamily: SAYA.font, fontWeight: 700, fontSize: 46, lineHeight: 1.4, color: n ? SAYA.color.white : SAYA.color.grey, minHeight: 130}}>
        {n ? text.slice(0, n) : placeholder}
        {!sent && caret ? <span style={{color: SAYA.color.neon}}>|</span> : null}
      </div>
      <div style={{width: 86, height: 86, borderRadius: 86, background: sent ? SAYA.color.sky : SAYA.color.neon, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sent ? 0.9 : 1})`, boxShadow: `0 0 24px ${SAYA.color.neon}`}}>
        <svg width={44} height={44} viewBox="0 0 24 24"><path d="M12 19 V5 M5 12 L12 5 L19 12" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- rec frame

export const RecFrame: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 160}});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  const blink = Math.floor(frame / 8) % 2 === 0 ? 1 : 0.25;
  const inset = interpolate(s, [0, 1], [0, 70]);
  const corner: React.CSSProperties = {position: "absolute", width: 120, height: 120, borderColor: "#fff", borderStyle: "solid", borderWidth: 0};
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{...corner, top: inset, left: inset, borderTopWidth: 10, borderLeftWidth: 10}} />
      <div style={{...corner, top: inset, right: inset, borderTopWidth: 10, borderRightWidth: 10}} />
      <div style={{...corner, bottom: inset, left: inset, borderBottomWidth: 10, borderLeftWidth: 10}} />
      <div style={{...corner, bottom: inset, right: inset, borderBottomWidth: 10, borderRightWidth: 10}} />
      <div style={{position: "absolute", top: 220, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <div style={{display: "flex", alignItems: "center", gap: 16, padding: "10px 34px", borderRadius: 99, background: "rgba(0,0,0,0.65)", fontFamily: "SayaLat, sans-serif", fontWeight: 900, fontSize: 46, color: "#fff", direction: "ltr", transform: `scale(${s})`}}>
          <span style={{width: 34, height: 34, borderRadius: 34, background: "#FF3B30", opacity: blink}} />
          REC
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- notification

export const NotificationBanner: React.FC<{app: string; title: string; body: string; duration: number; top?: number}> = ({app, title, body, duration, top = 300}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 160}});
  const out = interpolate(frame, [duration - 8, duration], [0, 1], clamp);
  return (
    <div style={{position: "absolute", left: 60, right: 60, top, padding: "26px 30px", borderRadius: 40, background: "rgba(245,245,247,0.94)", boxShadow: "0 20px 50px rgba(0,0,0,0.35)", transform: `translateY(${(1 - s) * -600 + out * -600}px)`, display: "flex", gap: 22, alignItems: "center", direction: "ltr", fontFamily: SAYA.font}}>
      <div style={{width: 84, height: 84, borderRadius: 20, background: SAYA.color.neon, display: "flex", alignItems: "center", justifyContent: "center"}}>
        <svg width={52} height={52} viewBox="0 0 24 24"><path d="M3 6h18v12H3Z M3 7l9 6 9-6" stroke="#fff" strokeWidth={2} fill="none" strokeLinejoin="round" /></svg>
      </div>
      <div style={{flex: 1}}>
        <div style={{display: "flex", justifyContent: "space-between", fontSize: 24, color: "#6E6E73", fontWeight: 700}}>
          <span>{app}</span>
          <span>now</span>
        </div>
        <div style={{fontSize: 32, fontWeight: 900, color: "#111", marginTop: 4}}>{title}</div>
        <div style={{fontSize: 26, fontWeight: 700, color: "#3A3A3C", marginTop: 2}}>{body}</div>
      </div>
    </div>
  );
};
