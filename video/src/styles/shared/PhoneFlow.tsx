// Generic phone walkthrough for app tutorials (used by ستايل 0).
// A sequence of screens slides in one after another; rows can be tapped,
// checked (checkbox) or selected (radio) at given frames.
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {HOUSE_ACTIVE_WORD} from "./house";

export type FlowRow = {
  label: string;
  sub?: string;
  kind?: "row" | "check" | "radio" | "button" | "account";
  /** frame (relative to the walkthrough) when this row is tapped */
  tapAt?: number;
  /** checkbox/radio: frame it becomes selected (defaults to tapAt) */
  onAt?: number;
  /** starts selected */
  on?: boolean;
};
export type FlowScreen = {at: number; title: string; rows: FlowRow[]; back?: boolean};

const FONT = "S2Lat, S2Ar, sans-serif";
const ACCENT = "#0095F6";

const Row: React.FC<{r: FlowRow; frame: number}> = ({r, frame}) => {
  const tapped = r.tapAt !== undefined && frame >= r.tapAt - 3;
  const ripple = r.tapAt !== undefined ? interpolate(frame, [r.tapAt, r.tapAt + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 0;
  const onAt = r.onAt ?? r.tapAt;
  const on = r.on || (onAt !== undefined && frame >= onAt);
  const kind = r.kind ?? "row";
  if (kind === "button") {
    return (
      <div style={{marginTop: 18, padding: "22px 0", borderRadius: 18, background: ACCENT, textAlign: "center", fontFamily: FONT, fontWeight: 900, fontSize: 30, color: "#fff", transform: `scale(${tapped && ripple < 0.4 ? 0.95 : 1})`, outline: tapped ? `4px solid ${HOUSE_ACTIVE_WORD}` : "none"}}>
        {r.label}
      </div>
    );
  }
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "20px 20px",
        borderRadius: 18,
        background: tapped ? "rgba(0,149,246,0.22)" : "#1C1F26",
        outline: tapped ? `3px solid ${HOUSE_ACTIVE_WORD}` : "none",
        fontFamily: FONT,
        color: "#fff",
        overflow: "hidden",
      }}
    >
      {kind === "account" ? <div style={{width: 52, height: 52, borderRadius: 52, background: "linear-gradient(45deg,#FEDA75,#D62976,#4F5BD5)"}} /> : null}
      <div style={{flex: 1}}>
        <div style={{fontWeight: 900, fontSize: 28, lineHeight: 1.2}}>{r.label}</div>
        {r.sub ? <div style={{fontWeight: 700, fontSize: 20, color: "#9AA0A8", marginTop: 4}}>{r.sub}</div> : null}
      </div>
      {kind === "check" ? (
        <div style={{width: 38, height: 38, borderRadius: 8, border: `3px solid ${on ? ACCENT : "#5A606B"}`, background: on ? ACCENT : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, fontWeight: 900}}>
          {on ? "✓" : ""}
        </div>
      ) : kind === "radio" ? (
        <div style={{width: 36, height: 36, borderRadius: 36, border: `3px solid ${on ? ACCENT : "#5A606B"}`, display: "flex", alignItems: "center", justifyContent: "center"}}>
          {on ? <div style={{width: 18, height: 18, borderRadius: 18, background: ACCENT}} /> : null}
        </div>
      ) : (
        <div style={{color: "#6B717C", fontSize: 34}}>›</div>
      )}
      {ripple > 0 && ripple < 1 ? (
        <div style={{position: "absolute", left: "50%", top: "50%", width: 300 * ripple, height: 300 * ripple, marginLeft: -150 * ripple, marginTop: -150 * ripple, borderRadius: "50%", background: `rgba(255,255,255,${0.35 * (1 - ripple)})`}} />
      ) : null}
    </div>
  );
};

export const PhoneFlow: React.FC<{screens: FlowScreen[]; duration: number; width?: number; height?: number; top?: number}> = ({
  screens,
  duration,
  width = 520,
  height = 880,
  top = 36,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16}});
  const exit = interpolate(frame, [duration - 8, duration], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)});
  // current + previous screen for the slide transition
  let idx = 0;
  screens.forEach((s, i) => {
    if (frame >= s.at) idx = i;
  });
  const cur = screens[idx];
  const prev = idx > 0 ? screens[idx - 1] : null;
  const slide = idx > 0 ? spring({frame: frame - cur.at, fps, config: {damping: 20, stiffness: 180}}) : 1;
  const Screen: React.FC<{s: FlowScreen; x: number}> = ({s, x}) => (
    <div style={{position: "absolute", inset: 0, padding: "70px 26px 0", transform: `translateX(${x}px)`, background: "#0E1014", display: "flex", flexDirection: "column", gap: 14}}>
      <div style={{display: "flex", alignItems: "center", gap: 14, marginBottom: 14, fontFamily: FONT, fontWeight: 900, fontSize: 34, color: "#fff"}}>
        {s.back !== false ? <span style={{fontSize: 40, color: "#C9CDD3"}}>‹</span> : null}
        <span>{s.title}</span>
      </div>
      {s.rows.map((r, i) => (
        <Row key={i} r={r} frame={frame} />
      ))}
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: top}}>
      <div
        style={{
          position: "relative",
          width,
          height,
          borderRadius: 64,
          border: "12px solid #111",
          background: "#0E1014",
          boxShadow: "0 30px 80px rgba(0,0,0,0.35)",
          overflow: "hidden",
          transform: `translateY(${(1 - enter) * 1000 + exit * -1000}px)`,
        }}
      >
        {prev && slide < 1 ? <Screen s={prev} x={-slide * width * 0.3} /> : null}
        <Screen s={cur} x={(1 - slide) * width} />
        <div style={{position: "absolute", top: 16, left: width / 2 - 80, width: 160, height: 36, borderRadius: 30, background: "#000"}} />
      </div>
    </AbsoluteFill>
  );
};

/** iOS-style notification banner dropping from the top. */
export const NotificationBanner: React.FC<{app: string; title: string; body: string; duration: number; top?: number}> = ({
  app,
  title,
  body,
  duration,
  top = 70,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 160}});
  const out = interpolate(frame, [duration - 8, duration], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top,
        padding: "26px 30px",
        borderRadius: 40,
        background: "rgba(245,245,247,0.92)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
        transform: `translateY(${(1 - s) * -300 + out * -300}px)`,
        display: "flex",
        gap: 22,
        alignItems: "center",
        direction: "ltr",
        fontFamily: FONT,
      }}
    >
      <div style={{width: 84, height: 84, borderRadius: 20, background: "#3478F6", display: "flex", alignItems: "center", justifyContent: "center"}}>
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
