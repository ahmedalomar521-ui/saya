// ستايل 4 neon motion graphics — they live in the dark space ABOVE the head
// (top ~600 px) and glow additively (mixBlendMode: screen).
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {neonGlow, S4} from "./tokens";

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Stage: React.FC<{children: React.ReactNode; duration: number}> = ({children, duration}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, duration - 6, duration], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{opacity: o, mixBlendMode: "screen"}}>
      <div style={{position: "absolute", top: S4.layout.graphicsTop, left: 0, width: 1080, height: S4.layout.graphicsH}}>{children}</div>
    </AbsoluteFill>
  );
};

// ------------------------------------------------------------------ icons

export type NeonIconName = "bulb" | "bookmark" | "user" | "plane" | "search" | "clock" | "check" | "sparkle" | "play" | "download" | "folder" | "chat";

const ICONS: Record<NeonIconName, string> = {
  bulb: "M9 17h6 M10 20.5h4 M12 3a6 6 0 0 1 4 10.5c-.8.8-1 1.6-1 3.5H9c0-1.9-.2-2.7-1-3.5A6 6 0 0 1 12 3Z",
  bookmark: "M6 3h12v18l-6-4.5L6 21Z M9 8l2 2 4-4",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z M4 21c1.5-4.5 14.5-4.5 16 0",
  plane: "M21 3 3 10.5l7 2.5 2.5 7Z M10 13l11-10",
  search: "M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z M15.5 15.5 21 21",
  clock: "M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M12 9v4l3 2 M9 2.5h6",
  check: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M8 12.5l3 3 5-6",
  sparkle: "M12 2.5 14 10l7.5 2-7.5 2-2 7.5-2-7.5L2.5 12 10 10Z",
  play: "M4 5h16v14H4Z M10 9v6l5-3Z",
  download: "M12 3v12 M7 10l5 5 5-5 M4 19h16",
  folder: "M3 6h6l2 2h10v11H3Z",
  chat: "M4 5h16v11H9l-5 4Z M8 10h8 M8 13h5",
};

export const NeonIcon: React.FC<{name: NeonIconName; size?: number; color?: string; delay?: number}> = ({
  name,
  size = 120,
  color = S4.color.cyan,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const flick = 0.85 + 0.15 * Math.sin(frame / 3 + delay);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{filter: neonGlow(color, 0.8), opacity: flick}}>
      <path d={ICONS[name]} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
    </svg>
  );
};

/** Icons joined by a gradient curve that draws from one to the next
 *  (the bookmark → user → paper-plane beat). */
export const NeonIconPath: React.FC<{icons: NeonIconName[]; duration: number; stepFrames?: number}> = ({
  icons,
  duration,
  stepFrames = 10,
}) => {
  const frame = useCurrentFrame();
  const n = icons.length;
  const xs = icons.map((_, i) => 140 + (i * 800) / Math.max(1, n - 1));
  const ys = icons.map((_, i) => (i % 2 ? 160 : 300));
  const colors = [S4.color.cyan, S4.color.blue, S4.color.magenta, S4.color.pink];
  return (
    <Stage duration={duration}>
      <svg width={1080} height={600} style={{position: "absolute", inset: 0, filter: neonGlow(S4.color.blue, 0.7)}}>
        <defs>
          <linearGradient id="s4path" x1="0" x2="1">
            <stop offset="0" stopColor={S4.color.cyan} />
            <stop offset="1" stopColor={S4.color.magenta} />
          </linearGradient>
        </defs>
        {xs.slice(1).map((x, i) => {
          const p = interpolate(frame, [(i + 1) * stepFrames - 6, (i + 1) * stepFrames + 4], [0, 1], clamp);
          const x0 = xs[i] + 70;
          const y0 = ys[i] + 60;
          const x1 = x - 70;
          const y1 = ys[i + 1] + 60;
          return (
            <path
              key={i}
              d={`M${x0} ${y0} C${x0 + 120} ${y0 - 120} ${x1 - 120} ${y1 - 120} ${x1} ${y1}`}
              fill="none"
              stroke="url(#s4path)"
              strokeWidth={5}
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={100}
              strokeDashoffset={100 * (1 - p)}
            />
          );
        })}
      </svg>
      {icons.map((ic, i) => (
        <div key={i} style={{position: "absolute", left: xs[i] - 60, top: ys[i]}}>
          <NeonIcon name={ic} delay={i * stepFrames} color={colors[i % colors.length]} />
        </div>
      ))}
    </Stage>
  );
};

/** Single large neon icon with a label (the bulb + "Inspiration" beat). */
export const NeonIconLabel: React.FC<{icon: NeonIconName; label: string; duration: number; color?: string}> = ({
  icon,
  label,
  duration,
  color = S4.color.cyan,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [6, 14], [0, 1], clamp);
  return (
    <Stage duration={duration}>
      <div style={{position: "absolute", top: 150, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 30}}>
        <NeonIcon name={icon} size={190} color={color} />
        <div style={{fontFamily: S4.font, fontWeight: 900, fontSize: 84, color: S4.color.white, opacity: p, textShadow: `0 0 18px ${color}`, direction: /[؀-ۿ]/.test(label) ? "rtl" : "ltr"}}>
          {label}
        </div>
      </div>
    </Stage>
  );
};

// ------------------------------------------------------------------ phone dashboard

/** Holographic phone with an animated dashboard and a particle stream. */
export const NeonPhoneDashboard: React.FC<{duration: number; title?: string}> = ({duration, title = "Dashboard"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 16}});
  const bars = [0.4, 0.7, 0.5, 0.9, 0.6, 1.0, 0.75];
  return (
    <Stage duration={duration}>
      {/* particle stream to the right */}
      {Array.from({length: 70}).map((_, i) => {
        const speed = 6 + random(`v${i}`) * 10;
        const x = 600 + ((frame * speed + random(`x${i}`) * 500) % 480);
        const y = 260 + Math.sin((x + i * 40) / 60) * 60 * random(`a${i}`) + (random(`y${i}`) - 0.5) * 160;
        const r = 2 + random(`r${i}`) * 4;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: r, height: r, borderRadius: r, background: i % 3 ? S4.color.cyan : S4.color.blue, boxShadow: `0 0 8px ${S4.color.cyan}`, opacity: 0.4 + 0.6 * ((x - 600) / 480)}} />;
      })}
      {/* phone */}
      <div
        style={{
          position: "absolute",
          left: 380,
          top: 20,
          width: 250,
          height: 500,
          borderRadius: 36,
          border: `4px solid ${S4.color.cyan}`,
          filter: neonGlow(S4.color.blue, 0.6),
          background: "rgba(10,30,70,0.55)",
          transform: `translateY(${(1 - s) * 60}px) perspective(800px) rotateY(-14deg)`,
          opacity: s,
          padding: 22,
          boxSizing: "border-box",
        }}
      >
        <div style={{fontFamily: S4.font, fontWeight: 700, fontSize: 24, color: "#BFE9FF"}}>{title}</div>
        <div style={{display: "flex", gap: 8, marginTop: 14}}>
          {["+24%", "+18%", "+31%"].map((t) => (
            <div key={t} style={{flex: 1, height: 44, borderRadius: 10, background: "rgba(41,211,255,0.18)", border: `1px solid ${S4.color.cyan}`, fontFamily: S4.font, fontSize: 16, color: "#BFE9FF", display: "flex", alignItems: "center", justifyContent: "center"}}>
              {t}
            </div>
          ))}
        </div>
        <svg width={200} height={90} viewBox="0 0 200 90" style={{marginTop: 18}}>
          <path
            d="M0 70 C30 60 40 30 70 40 S120 70 140 30 S180 10 200 20"
            fill="none"
            stroke={S4.color.cyan}
            strokeWidth={3}
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 * (1 - interpolate(frame, [4, 24], [0, 1], clamp))}
          />
        </svg>
        <div style={{display: "flex", alignItems: "flex-end", gap: 10, height: 150, marginTop: 14}}>
          {bars.map((b, i) => (
            <div key={i} style={{flex: 1, height: 150 * b * interpolate(frame, [8 + i * 2, 22 + i * 2], [0, 1], clamp), borderRadius: 6, background: `linear-gradient(180deg, ${S4.color.cyan}, ${S4.color.blue})`}} />
          ))}
        </div>
      </div>
    </Stage>
  );
};

// ------------------------------------------------------------------ search + grid + counter

/** Neon search bar typing, a grid of video tiles, and an optional counter. */
export const NeonSearchGrid: React.FC<{query: string; duration: number; counterTo?: number; counterLabel?: (n: number) => string}> = ({
  query,
  duration,
  counterTo,
  counterLabel,
}) => {
  const frame = useCurrentFrame();
  const typed = Math.floor(interpolate(frame, [2, 2 + query.length * 1.5], [0, query.length], clamp));
  const tilesP = interpolate(frame, [12, 26], [0, 1], clamp);
  const cols = [S4.color.magenta, S4.color.cyan, S4.color.yellow, S4.color.green, S4.color.blue, S4.color.pink];
  const n = counterTo !== undefined ? Math.round(interpolate(frame, [20, Math.min(duration - 8, 60)], [0, counterTo], {...clamp, easing: Easing.in(Easing.quad)})) : 0;
  return (
    <Stage duration={duration}>
      <div style={{position: "absolute", left: 300, top: 10, width: 480, height: 70, borderRadius: 14, border: `4px solid ${S4.color.cyan}`, filter: neonGlow(S4.color.cyan, 0.6), background: "rgba(41,211,255,0.15)", display: "flex", alignItems: "center", padding: "0 20px", gap: 14, boxSizing: "border-box"}}>
        <div style={{flex: 1, fontFamily: S4.font, fontWeight: 700, fontSize: 32, color: "#E6FAFF", direction: /[؀-ۿ]/.test(query) ? "rtl" : "ltr"}}>
          {query.slice(0, typed)}
          {frame % 16 < 8 ? "|" : ""}
        </div>
        <div style={{width: 54, height: 46, borderRadius: 10, background: S4.color.yellow, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <svg width={30} height={30} viewBox="0 0 24 24"><path d={ICONS.search} stroke="#222" strokeWidth={2.4} fill="none" strokeLinecap="round" /></svg>
        </div>
      </div>
      <div style={{position: "absolute", left: 320, top: 120, display: "grid", gridTemplateColumns: "repeat(6, 64px)", gap: 12}}>
        {Array.from({length: 18}).map((_, i) => {
          const on = tilesP * 18 > i;
          return (
            <div key={i} style={{width: 64, height: 46, borderRadius: 8, border: `3px solid ${cols[i % cols.length]}`, filter: on ? neonGlow(cols[i % cols.length], 0.4) : undefined, opacity: on ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <svg width={22} height={22} viewBox="0 0 24 24"><path d="M8 6v12l10-6Z" fill={cols[(i + 2) % cols.length]} /></svg>
            </div>
          );
        })}
      </div>
      {counterTo !== undefined ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 330, display: "flex", justifyContent: "center"}}>
          <div style={{padding: "8px 36px", borderRadius: 18, border: "5px solid transparent", background: `linear-gradient(#0A0A14,#0A0A14) padding-box, linear-gradient(90deg, ${S4.color.magenta}, ${S4.color.yellow}, ${S4.color.green}, ${S4.color.cyan}) border-box`, fontFamily: S4.font, fontWeight: 900, fontSize: 96, color: "#E8FFFF", filter: neonGlow(S4.color.cyan, 0.4)}}>
            {counterLabel ? counterLabel(n) : n}
          </div>
        </div>
      ) : null}
    </Stage>
  );
};

// ------------------------------------------------------------------ waves

/** Flowing neon sound/data waves with a magnifier gliding over them. */
export const NeonWaves: React.FC<{duration: number; magnifier?: boolean}> = ({duration, magnifier = true}) => {
  const frame = useCurrentFrame();
  const lines = 7;
  const mx = interpolate(frame, [0, duration], [260, 760]);
  return (
    <Stage duration={duration}>
      <svg width={1080} height={600} style={{position: "absolute", inset: 0}}>
        <defs>
          <linearGradient id="s4wave" x1="0" x2="1">
            <stop offset="0" stopColor={S4.color.cyan} />
            <stop offset="0.5" stopColor={S4.color.blue} />
            <stop offset="1" stopColor={S4.color.green} />
          </linearGradient>
        </defs>
        {Array.from({length: lines}).map((_, l) => {
          const pts: string[] = [];
          for (let x = 0; x <= 1080; x += 20) {
            const y = 260 + Math.sin(x / 90 + frame / 8 + l * 0.5) * (40 + l * 10) * Math.sin(x / 1080 * Math.PI);
            pts.push(`${x},${y + (l - lines / 2) * 6}`);
          }
          return <polyline key={l} points={pts.join(" ")} fill="none" stroke="url(#s4wave)" strokeWidth={2.5} opacity={0.35 + l * 0.08} style={{filter: neonGlow(S4.color.cyan, 0.4)}} />;
        })}
      </svg>
      {magnifier ? (
        <svg width={200} height={200} viewBox="0 0 24 24" style={{position: "absolute", left: mx - 100, top: 150, filter: neonGlow("#FFFFFF", 0.4)}}>
          <path d={ICONS.search} fill="rgba(255,255,255,0.08)" stroke="#EAF6FF" strokeWidth={1.2} strokeLinecap="round" />
        </svg>
      ) : null}
    </Stage>
  );
};

// ------------------------------------------------------------------ fluid shapes

/** Abstract glowing spiral swirls in pink / blue / teal (mood beat). */
export const NeonFluid: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const spiral = (cx: number, cy: number, turns: number, r: number, rot: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const a = t * turns * Math.PI * 2 + rot;
      const rr = r * (1 - t) ** 1.2;
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr * 0.8).toFixed(1)}`);
    }
    return pts.join(" ");
  };
  const draw = interpolate(frame, [0, 16], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const rot = frame / 25;
  const items = [
    {cx: 270, cy: 280, r: 150, turns: 1.4, grad: "f0", rot: rot},
    {cx: 540, cy: 250, r: 130, turns: 1.6, grad: "f1", rot: -rot + 1},
    {cx: 810, cy: 290, r: 150, turns: 1.4, grad: "f2", rot: rot + 2},
  ];
  return (
    <Stage duration={duration}>
      <svg width={1080} height={600} style={{position: "absolute", inset: 0, filter: neonGlow(S4.color.magenta, 0.5)}}>
        <defs>
          <linearGradient id="f0" x1="0" x2="1"><stop offset="0" stopColor={S4.color.magenta} /><stop offset="1" stopColor="#FF9A5C" /></linearGradient>
          <linearGradient id="f1" x1="0" x2="1"><stop offset="0" stopColor={S4.color.blue} /><stop offset="1" stopColor={S4.color.cyan} /></linearGradient>
          <linearGradient id="f2" x1="0" x2="1"><stop offset="0" stopColor="#1FE0B0" /><stop offset="1" stopColor={S4.color.green} /></linearGradient>
        </defs>
        {items.map((it, i) => (
          <polyline
            key={i}
            points={spiral(it.cx, it.cy, it.turns, it.r, it.rot)}
            fill="none"
            stroke={`url(#${it.grad})`}
            strokeWidth={14}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={100}
            strokeDasharray={100}
            strokeDashoffset={100 * (1 - draw)}
          />
        ))}
      </svg>
    </Stage>
  );
};
