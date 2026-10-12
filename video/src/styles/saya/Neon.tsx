// Neon line icons (ported from ستايل 4, re-skinned for Saya's neon blue / sky):
// - NeonIconLabel: one big icon + a label (the "idea" beat).
// - NeonIconPath: icons joined by a curve that draws from one to the next
//   (e.g. bookmark → user → plane for the share CTA).
// They sit in the empty headroom above Saya's head (`top` in canvas pixels).
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from "remotion";
import {clamp, neonGlow, SAYA} from "./tokens";

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

const Stage: React.FC<{children: React.ReactNode; duration: number}> = ({children, duration}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, duration - 6, duration], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const NeonIcon: React.FC<{name: NeonIconName; size?: number; color?: string; delay?: number}> = ({name, size = 120, color = SAYA.color.sky, delay = 0}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const flick = 0.88 + 0.12 * Math.sin(frame / 3 + delay);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{filter: neonGlow(SAYA.color.neon, 0.8), opacity: flick}}>
      <path d={ICONS[name]} fill="none" stroke={color} strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />
    </svg>
  );
};

export const NeonIconLabel: React.FC<{icon: NeonIconName; label: string; duration: number; top?: number}> = ({icon, label, duration, top = 330}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [6, 14], [0, 1], clamp);
  return (
    <Stage duration={duration}>
      <div style={{position: "absolute", top, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 30}}>
        <NeonIcon name={icon} size={170} />
        <div style={{fontFamily: SAYA.font, fontWeight: 900, fontSize: 84, color: SAYA.color.white, opacity: p, textShadow: `0 0 18px ${SAYA.color.neon}`, direction: /[؀-ۿ]/.test(label) ? "rtl" : "ltr"}}>{label}</div>
      </div>
    </Stage>
  );
};

export const NeonIconPath: React.FC<{icons: NeonIconName[]; duration: number; stepFrames?: number; top?: number}> = ({icons, duration, stepFrames = 10, top = 300}) => {
  const frame = useCurrentFrame();
  const n = icons.length;
  const xs = icons.map((_, i) => 170 + (i * 740) / Math.max(1, n - 1));
  const ys = icons.map((_, i) => (i % 2 ? 100 : 220));
  const colors = [SAYA.color.sky, SAYA.color.neon, SAYA.color.white];
  return (
    <Stage duration={duration}>
      <div style={{position: "absolute", top, left: 0, width: 1080, height: 460}}>
        <svg width={1080} height={460} style={{position: "absolute", inset: 0, filter: neonGlow(SAYA.color.neon, 0.7)}}>
          <defs>
            <linearGradient id="sayaPath" x1="0" x2="1">
              <stop offset="0" stopColor={SAYA.color.sky} />
              <stop offset="1" stopColor={SAYA.color.neon} />
            </linearGradient>
          </defs>
          {xs.slice(1).map((x, i) => {
            const p = interpolate(frame, [(i + 1) * stepFrames - 6, (i + 1) * stepFrames + 4], [0, 1], clamp);
            const x0 = xs[i] + 70;
            const y0 = ys[i] + 60;
            const x1 = x - 70;
            const y1 = ys[i + 1] + 60;
            return <path key={i} d={`M${x0} ${y0} C${x0 + 100} ${y0 - 100} ${x1 - 100} ${y1 - 100} ${x1} ${y1}`} fill="none" stroke="url(#sayaPath)" strokeWidth={5} strokeLinecap="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - p)} />;
          })}
        </svg>
        {icons.map((ic, i) => (
          <div key={i} style={{position: "absolute", left: xs[i] - 60, top: ys[i]}}>
            <NeonIcon name={ic} delay={i * stepFrames} color={colors[i % colors.length]} />
          </div>
        ))}
      </div>
    </Stage>
  );
};
