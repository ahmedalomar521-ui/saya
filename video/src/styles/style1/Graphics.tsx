// Graphic beats of ستايل 1. In the reference the graphics carry the pacing:
// a new visual beat every ~1–3 s (UI kit pop, slider, cursor click, big
// number, kinetic word, browser card).
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {S1} from "./tokens";

const useSpring = (delay = 0, damping = 14, stiffness = 220) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness}});
};

// ---------------------------------------------------------------- glitch

/** RGB-split smear entrance (the colourful smear when the UI kit appears). */
export const GlitchIn: React.FC<{children: React.ReactNode; length?: number}> = ({children, length = 6}) => {
  const frame = useCurrentFrame();
  const g = interpolate(frame, [0, length], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  if (g <= 0) return <>{children}</>;
  const off = 40 * g;
  return (
    <div style={{position: "relative"}}>
      <div style={{position: "absolute", inset: 0, transform: `translateX(${-off}px)`, opacity: 0.7, filter: "hue-rotate(90deg) saturate(3)", mixBlendMode: "screen"}}>
        {children}
      </div>
      <div style={{position: "absolute", inset: 0, transform: `translateX(${off}px)`, opacity: 0.7, filter: "hue-rotate(-90deg) saturate(3)", mixBlendMode: "screen"}}>
        {children}
      </div>
      <div style={{filter: `blur(${6 * g}px)`, transform: `scaleX(${1 + 0.25 * g})`}}>{children}</div>
    </div>
  );
};

// ---------------------------------------------------------------- UI kit

const Toggle: React.FC<{on: boolean; color?: string}> = ({on, color = S1.color.green}) => (
  <div style={{width: 92, height: 52, borderRadius: 52, background: on ? color : "#2A2A2A", position: "relative"}}>
    <div style={{position: "absolute", top: 6, left: on ? 46 : 6, width: 40, height: 40, borderRadius: 40, background: "#fff"}} />
  </div>
);

const Btn: React.FC<{label: string; dark?: boolean}> = ({label, dark}) => (
  <div
    style={{
      padding: "14px 34px",
      borderRadius: 40,
      background: dark ? "#111" : "#fff",
      color: dark ? "#fff" : "#111",
      fontFamily: S1.font.caption,
      fontWeight: 700,
      fontSize: 28,
      border: dark ? "none" : "2px solid #ddd",
    }}
  >
    {label}
  </div>
);

/** Floating cluster of colourful UI components that pops in staggered. */
export const UIKitCluster: React.FC<{top?: number}> = ({top = 130}) => {
  const items: {x: number; y: number; el: React.ReactNode}[] = [
    {x: 90, y: 0, el: <div style={{width: 64, height: 64, borderRadius: 64, background: S1.color.green}} />},
    {x: 170, y: 0, el: <div style={{width: 64, height: 64, borderRadius: 64, background: S1.color.purple}} />},
    {x: 250, y: 0, el: <Toggle on />},
    {x: 380, y: 0, el: <Btn label="Continue" dark />},
    {x: 90, y: 90, el: <div style={{width: 64, height: 64, borderRadius: 64, background: S1.color.blue}} />},
    {x: 170, y: 90, el: <div style={{width: 64, height: 64, borderRadius: 64, background: S1.color.lime}} />},
    {x: 250, y: 90, el: <Toggle on color={S1.color.green} />},
    {x: 380, y: 96, el: <div style={{width: 210, height: 14, borderRadius: 14, background: "#222", overflow: "hidden"}}><div style={{width: "70%", height: "100%", background: "#fff"}} /></div>},
    {x: 640, y: -10, el: <div style={{width: 300, height: 150, borderRadius: 26, background: S1.color.lime, padding: 22, boxSizing: "border-box"}}><div style={{width: 150, height: 12, borderRadius: 8, background: "rgba(0,0,0,0.35)"}} /><div style={{width: 110, height: 12, borderRadius: 8, background: "rgba(0,0,0,0.25)", marginTop: 12}} /><div style={{width: 44, height: 44, borderRadius: 44, background: "#111", marginTop: 20, marginLeft: 210}} /></div>},
    {x: 640, y: 160, el: <div style={{width: 300, height: 150, borderRadius: 26, background: S1.color.purple}} />},
    {x: 90, y: 190, el: <Btn label="Sign up" />},
    {x: 300, y: 190, el: <div style={{width: 120, height: 120, borderRadius: 24, background: "#E9E2FF", display: "flex", alignItems: "center", justifyContent: "center"}}><div style={{width: 50, height: 10, borderRadius: 10, background: S1.color.purple}} /></div>},
    {x: 450, y: 210, el: <Btn label="Continue  →" dark />},
  ];
  return (
    <AbsoluteFill>
      {items.map((it, i) => (
        <Pop key={i} delay={i * 1.2} x={it.x} y={top + it.y}>
          {it.el}
        </Pop>
      ))}
    </AbsoluteFill>
  );
};

const Pop: React.FC<{delay: number; x: number; y: number; children: React.ReactNode}> = ({delay, x, y, children}) => {
  const s = useSpring(delay, 11, 260);
  const frame = useCurrentFrame();
  const float = Math.sin((frame + delay * 7) / 14) * 4;
  return (
    <div style={{position: "absolute", left: x, top: y + float, transform: `scale(${s})`, opacity: Math.min(1, s * 1.5)}}>
      {children}
    </div>
  );
};

// ---------------------------------------------------------------- cursor

export const Cursor: React.FC<{x: number; y: number; pressed?: boolean; size?: number}> = ({x, y, pressed, size = 70}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    style={{position: "absolute", left: x, top: y, transform: `scale(${pressed ? 0.85 : 1})`, filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.35))"}}
  >
    <path d="M4 2 L4 20 L9 15.5 L12.5 22 L15.5 20.5 L12 14 L19 14 Z" fill="#111" stroke="#fff" strokeWidth={1.4} strokeLinejoin="round" />
  </svg>
);

/** A cursor glides from (x0,y0) to (x1,y1) and clicks, with a ripple. */
export const CursorClick: React.FC<{
  from: [number, number];
  to: [number, number];
  clickAt: number;
  moveFrames?: number;
}> = ({from, to, clickAt, moveFrames = 14}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [clickAt - moveFrames, clickAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const x = interpolate(t, [0, 1], [from[0], to[0]]);
  const y = interpolate(t, [0, 1], [from[1], to[1]]);
  const r = interpolate(frame, [clickAt, clickAt + 12], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <>
      {r > 0 && r < 1 ? (
        <div
          style={{
            position: "absolute",
            left: to[0] - 60 * r,
            top: to[1] - 60 * r,
            width: 120 * r,
            height: 120 * r,
            borderRadius: "50%",
            border: `5px solid ${S1.color.blue}`,
            opacity: 1 - r,
          }}
        />
      ) : null}
      <Cursor x={x} y={y} pressed={frame >= clickAt && frame < clickAt + 4} />
    </>
  );
};

// ---------------------------------------------------------------- slider

/** Dark card with a slider that drags to a value (the "100" beat). */
export const SliderBeat: React.FC<{to?: number; startAt?: number; dragFrames?: number}> = ({
  to = 100,
  startAt = 4,
  dragFrames = 18,
}) => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 16);
  const p = interpolate(frame, [startAt, startAt + dragFrames], [0.15, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const W = 700;
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{transform: `scale(${s})`, width: W, height: 330, borderRadius: 34, background: "#0E0E10", position: "relative", overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,0.25)"}}>
        <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 70, background: "#66B8FF"}} />
        <div style={{position: "absolute", top: 190, left: 80, width: 400, height: 8, borderRadius: 8, background: "#3A3A3C"}} />
        <div style={{position: "absolute", top: 190, left: 80, width: 400 * p, height: 8, borderRadius: 8, background: "#fff"}} />
        <div style={{position: "absolute", top: 172, left: 80 + 400 * p - 22, width: 44, height: 44, borderRadius: 44, background: "#fff"}} />
        <div style={{position: "absolute", top: 156, left: 520, fontFamily: S1.font.caption, fontWeight: 700, fontSize: 70, color: "#fff"}}>
          {Math.round(p * to)}
        </div>
        <Cursor x={80 + 400 * p - 4} y={196} />
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- big stat

/** Huge counting number (the "96%" export beat). */
export const BigStat: React.FC<{value: number; suffix?: string; frames?: number; color?: string}> = ({
  value,
  suffix = "%",
  frames = 20,
  color = S1.color.blue,
}) => {
  const frame = useCurrentFrame();
  const v = interpolate(frame, [0, frames], [0, value], {extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  const s = useSpring(0, 12);
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: S1.font.caption, fontWeight: 700, fontSize: 300, color, transform: `scale(${s})`, letterSpacing: -10}}>
        {Math.round(v)}
        {suffix}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- kinetic word

/** Giant word that slides across the stage (the "0000TH" beat). */
export const KineticWord: React.FC<{text: string; duration: number; color?: string; bg?: string}> = ({
  text,
  duration,
  color = S1.color.ink,
  bg = S1.color.lime,
}) => {
  const frame = useCurrentFrame();
  const isArabic = /[؀-ۿ]/.test(text);
  const x = interpolate(frame, [0, duration], isArabic ? [-500, 200] : [200, -500]);
  return (
    <AbsoluteFill style={{background: bg, justifyContent: "center", overflow: "hidden"}}>
      <div
        style={{
          fontFamily: S1.font.display,
          fontSize: isArabic ? 420 : 330,
          color,
          whiteSpace: "nowrap",
          transform: `translateX(${x}px) skewX(-9deg)`,
          lineHeight: 1,
          direction: isArabic ? "rtl" : "ltr",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- browser card

/** Minimal browser / website mock with a headline that types on. */
export const BrowserCard: React.FC<{
  headline: string;
  sub?: string;
  brand?: string;
  accent?: string;
}> = ({headline, sub, brand = "website", accent = S1.color.purple}) => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 18);
  const chars = Math.floor(interpolate(frame, [4, 4 + headline.length * 0.8], [0, headline.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const isArabic = /[؀-ۿ]/.test(headline);
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{width: 960, height: 760, borderRadius: 28, background: "#fff", boxShadow: "0 30px 90px rgba(0,0,0,0.18)", transform: `translateY(${(1 - s) * 80}px)`, opacity: s, overflow: "hidden"}}>
        <div style={{height: 64, background: "#F1F1F3", display: "flex", alignItems: "center", gap: 12, padding: "0 24px"}}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => (
            <div key={c} style={{width: 18, height: 18, borderRadius: 18, background: c}} />
          ))}
          <div style={{marginLeft: 20, flex: 1, height: 36, borderRadius: 18, background: "#fff", fontFamily: S1.font.caption, fontSize: 22, color: "#666", display: "flex", alignItems: "center", padding: "0 18px"}}>
            {brand}
          </div>
        </div>
        <div style={{padding: "90px 60px", textAlign: "center", direction: isArabic ? "rtl" : "ltr"}}>
          <div style={{fontFamily: S1.font.caption, fontWeight: 700, fontSize: 84, color: "#111", lineHeight: 1.15, minHeight: 200}}>
            {headline.slice(0, chars)}
          </div>
          {sub ? (
            <div style={{fontFamily: S1.font.caption, fontWeight: 700, fontSize: 34, color: "#777", marginTop: 20}}>{sub}</div>
          ) : null}
          <div style={{display: "inline-block", marginTop: 40, padding: "16px 44px", borderRadius: 40, background: accent, color: "#fff", fontFamily: S1.font.caption, fontWeight: 700, fontSize: 32}}>
            {isArabic ? "جرّب مجاناً" : "Try for free"}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/** Colour card with a loading/progress handle and a % pill (the "7 %" beat). */
export const ProgressCard: React.FC<{to?: number; frames?: number}> = ({to = 100, frames = 30}) => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 18);
  const p = interpolate(frame, [4, 4 + frames], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{width: 820, height: 620, borderRadius: 34, background: `linear-gradient(90deg, #D9F04A, #F2F27A)`, position: "relative", transform: `scale(${s})`}}>
        <div style={{position: "absolute", top: 300, left: 0, right: 0, height: 4, background: "rgba(255,255,255,0.9)"}} />
        <div style={{position: "absolute", top: 270, left: 40 + 680 * p, width: 64, height: 64, border: `6px solid ${S1.color.blue}`, background: "rgba(255,255,255,0.4)"}} />
        <Cursor x={80 + 680 * p} y={320} size={90} />
        <div style={{position: "absolute", top: 380, left: 120 + 680 * p, padding: "10px 28px", borderRadius: 40, background: "#6B6B2F", color: "#fff", fontFamily: S1.font.caption, fontWeight: 700, fontSize: 46}}>
          {Math.round(p * to)}%
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- prompt box

/** Chat / prompt input that types a prompt, then the send button is clicked. */
export const PromptBox: React.FC<{text: string; placeholder?: string; sendAt?: number}> = ({
  text,
  placeholder = "اكتب البرومبت…",
  sendAt,
}) => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 16);
  const typeEnd = sendAt ? sendAt - 6 : 4 + text.length * 0.9;
  const n = Math.floor(interpolate(frame, [4, typeEnd], [0, text.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const caret = Math.floor(frame / 8) % 2 === 0;
  const sent = sendAt !== undefined && frame >= sendAt;
  const isArabic = /[؀-ۿ]/.test(text);
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{transform: `translateY(${(1 - s) * 60}px)`, opacity: s, width: 900, borderRadius: 36, background: "#fff", boxShadow: "0 24px 70px rgba(0,0,0,0.16)", padding: "34px 36px", display: "flex", alignItems: "flex-end", gap: 24, direction: isArabic ? "rtl" : "ltr", border: `3px solid ${sent ? S1.color.purple : "#E6E6EA"}`}}>
        <div style={{flex: 1, fontFamily: S1.font.caption, fontWeight: 700, fontSize: 46, lineHeight: 1.4, color: n ? "#111" : "#9A9AA2", minHeight: 130}}>
          {n ? text.slice(0, n) : placeholder}
          {!sent && caret ? <span style={{color: S1.color.purple}}>|</span> : null}
        </div>
        <div style={{width: 86, height: 86, borderRadius: 86, background: sent ? S1.color.purple : "#111", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sent ? 0.9 : 1})`}}>
          <svg width={44} height={44} viewBox="0 0 24 24"><path d="M12 19 V5 M5 12 L12 5 L19 12" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- AI badge card

/** Phone-style card framing a live clip of the speaker with an "AI" scan. */
export const AIAvatarCard: React.FC<{children: React.ReactNode; label: string; badge?: string}> = ({
  children,
  label,
  badge = "AI",
}) => {
  const frame = useCurrentFrame();
  const s = useSpring(0, 15);
  const scan = (frame * 14) % 700;
  const b = useSpring(10, 9, 300);
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{display: "flex", alignItems: "center", gap: 46, direction: "rtl", transform: `scale(${s})`}}>
        <div style={{width: 380, height: 640, borderRadius: 40, overflow: "hidden", position: "relative", border: "6px solid #111", boxShadow: "0 30px 80px rgba(0,0,0,0.25)"}}>
          {children}
          <div style={{position: "absolute", left: 0, right: 0, top: scan - 40, height: 80, background: `linear-gradient(180deg, rgba(212,245,60,0), rgba(212,245,60,0.55), rgba(212,245,60,0))`}} />
          <div style={{position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)", backgroundSize: "40px 40px"}} />
        </div>
        <div style={{display: "flex", flexDirection: "column", gap: 26, alignItems: "flex-start"}}>
          <div style={{transform: `scale(${b}) rotate(-6deg)`, background: S1.color.ink, color: S1.color.yellow, fontFamily: S1.font.display, fontSize: 120, padding: "6px 40px 0", borderRadius: 26, lineHeight: 1.2}}>
            {badge}
          </div>
          <div style={{fontFamily: S1.font.caption, fontWeight: 700, fontSize: 48, color: "#111", maxWidth: 420, lineHeight: 1.3}}>{label}</div>
          <div style={{display: "flex", alignItems: "center", gap: 16, fontFamily: S1.font.caption, fontWeight: 700, fontSize: 34, color: "#555"}}>
            <Toggle on />
            <span>Virtual</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- tool grid

/** Grid of tool "app icons" popping in — for "tools / أدوات" beats. */
export const ToolGrid: React.FC<{tools: {label: string; color: string; glyph: string}[]}> = ({tools}) => (
  <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 230px)", gap: 34, direction: "rtl"}}>
      {tools.map((t, i) => (
        <ToolIcon key={t.label} delay={i * 2.5} {...t} />
      ))}
    </div>
  </AbsoluteFill>
);

const ToolIcon: React.FC<{delay: number; label: string; color: string; glyph: string}> = ({delay, label, color, glyph}) => {
  const s = useSpring(delay, 11, 260);
  const frame = useCurrentFrame();
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14, transform: `scale(${s}) translateY(${Math.sin((frame + delay * 9) / 12) * 5}px)`}}>
      <div style={{width: 190, height: 190, borderRadius: 50, background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 96, boxShadow: "0 18px 40px rgba(0,0,0,0.15)"}}>
        {glyph}
      </div>
      <div style={{fontFamily: S1.font.caption, fontWeight: 700, fontSize: 34, color: "#222"}}>{label}</div>
    </div>
  );
};
