// ستايل 2 full-screen inserts and overlays:
// - MintStage + GlassChip: soft mint gradient with glossy coloured labels
//   ("المشكلة" / "الحل" / "التوقيت") that blur in, with a small caption below
// - PaperStage + PaperLines + VoiceNote: grey-white card with dark stretched
//   text built line by line, a red marker stroke, and a WhatsApp-style voice note
// - RedArrow: hand-drawn glowing red arrow
// - GlowIcon: neon line icon (checklist, clock, bulb, sparkle, robot)
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {autoStretch, glowShadow, S2} from "./tokens";

const useBlurIn = (delay = 0, len = 10) => {
  const frame = useCurrentFrame();
  return interpolate(frame - delay, [0, len], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
};

// ------------------------------------------------------------------ mint

export const MintStage: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 40;
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${S2.color.mint1} 0%, ${S2.color.mint2} 55%, ${S2.color.mint3} 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${30 + drift / 10}% ${70 - drift / 20}%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 45%)`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export type ChipIcon = "clock" | "alert" | "check" | "question" | "tool" | "chip" | "sparkle" | "robot";

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
  }[icon];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {inner}
    </svg>
  );
};

/** Glossy coloured label with an icon, blurring in; optional caption below. */
export const GlassChip: React.FC<{
  label: string;
  colors: string[];
  icon: ChipIcon;
  delay?: number;
  sub?: string;
  subDelay?: number;
  scale?: number;
}> = ({label, colors, icon, delay = 0, sub, subDelay = 10, scale = 1}) => {
  const frame = useCurrentFrame();
  const p = useBlurIn(delay, 10);
  const subN = sub
    ? Math.floor(interpolate(frame - delay - subDelay, [0, sub.length * 0.9], [0, sub.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}))
    : 0;
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 22, transform: `scale(${scale})`}}>
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          gap: 26,
          direction: "rtl",
          padding: "22px 44px 26px 50px",
          borderRadius: 26,
          background: `linear-gradient(180deg, ${colors[0]}, ${colors[1]})`,
          boxShadow: `0 18px 40px ${colors[1]}66, inset 0 2px 0 rgba(255,255,255,0.5), inset 0 -4px 10px rgba(0,0,0,0.12)`,
          border: "3px solid rgba(255,255,255,0.55)",
          opacity: p,
          filter: `blur(${(1 - p) * 18}px)`,
          transform: `scale(${interpolate(p, [0, 1], [1.12, 1])})`,
        }}
      >
        <div style={{width: 84, height: 84, borderRadius: 84, background: "rgba(255,255,255,0.22)", display: "flex", alignItems: "center", justifyContent: "center"}}>
          <ChipGlyph icon={icon} size={58} />
        </div>
        <span
          style={{
            fontFamily: S2.font,
            fontWeight: 900,
            fontSize: 76,
            color: "#fff",
            textShadow: "0 3px 8px rgba(0,0,0,0.18)",
            lineHeight: 1.2,
          }}
        >
          {autoStretch(label, 0)}
        </span>
        {/* glossy highlight */}
        <div style={{position: "absolute", left: 10, right: 10, top: 6, height: "38%", borderRadius: 20, background: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0))"}} />
      </div>
      {sub ? (
        <div style={{fontFamily: S2.font, fontWeight: 800, fontSize: 44, color: "#3B4744", direction: "rtl", minHeight: 60}}>
          {sub.slice(0, subN)}
        </div>
      ) : null}
    </div>
  );
};

// ------------------------------------------------------------------ paper

export const PaperStage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(ellipse at 50% 35%, ${S2.color.paper1} 0%, #E9E9EA 45%, ${S2.color.paper2} 100%)`,
    }}
  >
    {children}
  </AbsoluteFill>
);

/** Dark stretched text that builds line by line (word blur-in). */
export const PaperLines: React.FC<{
  lines: {text: string; at: number; size?: number; strike?: boolean}[];
  top?: number;
}> = ({lines, top = 420}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: "absolute", top, left: 70, right: 70, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, direction: "rtl"}}>
      {lines.map((l, li) => {
        const words = l.text.split(" ");
        return (
          <div key={li} style={{position: "relative", display: "flex", gap: 20, direction: "rtl"}}>
            {words.map((w, wi) => {
              const p = interpolate(frame - l.at - wi * 3, [0, 7], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
              return (
                <span
                  key={wi}
                  style={{
                    fontFamily: S2.font,
                    fontWeight: 900,
                    fontSize: l.size ?? 130,
                    color: S2.color.ink,
                    opacity: p,
                    filter: `blur(${(1 - p) * 8}px)`,
                    textShadow: "0 6px 14px rgba(0,0,0,0.12)",
                    lineHeight: 1.3,
                  }}
                >
                  {autoStretch(w, wi + li)}
                </span>
              );
            })}
            {l.strike ? <MarkerStroke delay={l.at + words.length * 3 + 6} /> : null}
          </div>
        );
      })}
    </div>
  );
};

/** Rough red marker stroke scribbled over / under the line it sits in. */
export const MarkerStroke: React.FC<{delay: number}> = ({delay}) => {
  const p = useBlurIn(delay, 10);
  return (
    <svg
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
      style={{position: "absolute", left: -10, right: -10, top: "48%", width: "calc(100% + 20px)", height: 60}}
    >
      <path
        d="M395 30 C300 18 200 42 110 26 C70 20 30 34 5 30 M390 40 C280 30 180 50 20 38"
        stroke={S2.color.red}
        strokeWidth={16}
        strokeLinecap="round"
        fill="none"
        pathLength={1000}
        strokeDasharray={1000}
        strokeDashoffset={1000 * (1 - p)}
        opacity={0.92}
      />
    </svg>
  );
};

/** WhatsApp-style voice note bubble that plays. */
export const VoiceNote: React.FC<{seconds?: number; time?: string; top?: number}> = ({seconds = 2, time = "4:36 pm", top = 1000}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 16}});
  const progress = interpolate(frame, [8, 8 + seconds * fps], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const bars = Array.from({length: 28}, (_, i) => 10 + Math.abs(Math.sin(i * 1.7) * 30) + (i % 5) * 3);
  const elapsed = Math.floor(progress * seconds);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: 140,
        right: 140,
        height: 150,
        borderRadius: 40,
        background: "linear-gradient(180deg, #2A2F36, #1B1F24)",
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        gap: 26,
        padding: "0 34px",
        transform: `translateY(${(1 - s) * 80}px)`,
        opacity: s,
      }}
    >
      <div style={{display: "flex", gap: 8}}>
        <div style={{width: 12, height: 40, borderRadius: 3, background: "#E6E6E6"}} />
        <div style={{width: 12, height: 40, borderRadius: 3, background: "#E6E6E6"}} />
      </div>
      <div style={{flex: 1, position: "relative", height: 90}}>
        <div style={{display: "flex", alignItems: "center", gap: 6, height: 60}}>
          {bars.map((h, i) => (
            <div key={i} style={{width: 7, height: h, borderRadius: 4, background: i / bars.length < progress ? "#4FB4FF" : "#8A9099"}} />
          ))}
        </div>
        <div style={{position: "absolute", top: 22, left: `${progress * 96}%`, width: 20, height: 20, borderRadius: 20, background: "#4FB4FF"}} />
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: S2.font, fontWeight: 800, fontSize: 24, color: "#9AA0A8"}}>
          <span>0:{String(elapsed).padStart(2, "0")}</span>
          <span>{time}</span>
        </div>
      </div>
      <div style={{width: 92, height: 92, borderRadius: 92, background: "#E9EDF0", display: "flex", alignItems: "center", justifyContent: "center"}}>
        <svg width={56} height={56} viewBox="0 0 24 24"><circle cx="12" cy="9" r="4" fill="#9AA3AD" /><path d="M4 21 c1-5 15-5 16 0" fill="#9AA3AD" /></svg>
      </div>
    </div>
  );
};

// ------------------------------------------------------------------ overlays

/** Hand-drawn red arrow with glow, drawn on. Points down-left by default. */
export const RedArrow: React.FC<{delay?: number; size?: number; style?: React.CSSProperties; flip?: boolean}> = ({
  delay = 0,
  size = 200,
  style,
  flip,
}) => {
  const p = useBlurIn(delay, 12);
  const head = useBlurIn(delay + 10, 5);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      style={{filter: `drop-shadow(0 0 10px ${S2.color.redGlow})`, transform: flip ? "scaleX(-1)" : undefined, ...style}}
    >
      <path d="M180 20 C120 30 70 70 60 160" stroke={S2.color.redGlow} strokeWidth={12} fill="none" strokeLinecap="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - p)} />
      <path d="M30 130 L60 168 L92 132" stroke={S2.color.redGlow} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1000} strokeDasharray={1000} strokeDashoffset={1000 * (1 - head)} />
    </svg>
  );
};

export type GlowIconName = "checklist" | "clock" | "bulb" | "sparkle" | "robot";

/** Neon line icon (yellow glow), drawn on, gently floating. */
export const GlowIcon: React.FC<{name: GlowIconName; size?: number; delay?: number; color?: string}> = ({
  name,
  size = 220,
  delay = 0,
  color = S2.color.glow,
}) => {
  const frame = useCurrentFrame();
  const p = useBlurIn(delay, 14);
  const float = Math.sin(frame / 10) * 6;
  const st = {
    stroke: color,
    strokeWidth: 1.6,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    pathLength: 100,
    strokeDasharray: 100,
    strokeDashoffset: 100 * (1 - p),
  };
  const paths = {
    checklist: (
      <>
        <rect x="4" y="2.5" width="14" height="18" rx="2" {...st} />
        <path d="M7 7 h1 M10 7 h5 M7 11 h1 M10 11 h5 M7 15 h1 M10 15 h3" {...st} />
        <circle cx="18" cy="18.5" r="4" {...st} />
        <path d="M16.2 18.6 L17.5 19.8 L19.8 17.3" {...st} />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="13" r="8" {...st} />
        <path d="M12 9 V13 L15 15 M9 2.5 h6" {...st} />
      </>
    ),
    bulb: (
      <>
        <path d="M9 17 h6 M10 20.5 h4 M12 3 a6 6 0 0 1 4 10.5 c-.8.8-1 1.6-1 3.5 h-6 c0-1.9-.2-2.7-1-3.5 A6 6 0 0 1 12 3 Z" {...st} />
      </>
    ),
    sparkle: <path d="M12 2.5 L14 10 L21.5 12 L14 14 L12 21.5 L10 14 L2.5 12 L10 10 Z" {...st} />,
    robot: (
      <>
        <rect x="4" y="8" width="16" height="11" rx="3" {...st} />
        <path d="M12 4 v4 M9 13 v1 M15 13 v1 M2 13 h2 M20 13 h2" {...st} />
      </>
    ),
  }[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{transform: `translateY(${float}px)`, filter: `drop-shadow(0 0 6px ${S2.color.glowDeep}) drop-shadow(0 0 16px ${S2.color.glowDeep})`, opacity: Math.min(1, p * 2)}}
    >
      {paths}
    </svg>
  );
};

/** Big quoted word: “ دليل ” with glowing quote marks. */
export const QuoteWord: React.FC<{text: string; delay?: number}> = ({text, delay = 0}) => {
  const p = useBlurIn(delay, 8);
  return (
    <div style={{fontFamily: S2.font, fontWeight: 900, fontSize: 120, color: S2.color.glow, textShadow: glowShadow(), opacity: p, filter: `blur(${(1 - p) * 10}px)`, direction: "rtl", whiteSpace: "nowrap"}}>
      ”{autoStretch(text, 0)}“
    </div>
  );
};
