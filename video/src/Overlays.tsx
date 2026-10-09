import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import {C, FONT, textStroke} from "./theme";

// Each overlay is rendered inside a <Sequence>, so frame 0 = its cue.

const useIn = (delay = 0, damping = 14) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping, stiffness: 180}});
};

const useOut = (duration: number, len = 8) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [duration - len, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

// ---------- Small building blocks ----------

export const Toggle: React.FC<{on: number; size?: number}> = ({on, size = 1}) => {
  // on: 0 → off, 1 → on (animatable)
  const w = 110 * size;
  const h = 64 * size;
  const knob = h - 10 * size;
  const bg = on > 0.5 ? C.green : "#3A3A3C";
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: h,
        background: bg,
        position: "relative",
        transition: "none",
        boxShadow: on > 0.5 ? `0 0 ${24 * size}px rgba(52,199,89,0.6)` : "none",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 5 * size,
          left: interpolate(on, [0, 1], [5 * size, w - knob - 5 * size]),
          width: knob,
          height: knob,
          borderRadius: knob,
          background: "white",
          boxShadow: "0 3px 8px rgba(0,0,0,0.35)",
        }}
      />
    </div>
  );
};

const Pill: React.FC<{
  children: React.ReactNode;
  bg?: string;
  color?: string;
  style?: React.CSSProperties;
}> = ({children, bg = C.card, color = C.white, style}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 900,
      fontSize: 52,
      color,
      background: bg,
      padding: "14px 36px",
      borderRadius: 999,
      direction: "rtl",
      display: "flex",
      alignItems: "center",
      gap: 18,
      boxShadow: "0 14px 40px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

const WarnIcon: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2 L23 21 H1 Z" fill={C.yellow} stroke={C.ink} strokeWidth={1.2} strokeLinejoin="round" />
    <rect x="11" y="8" width="2" height="7" rx="1" fill={C.ink} />
    <circle cx="12" cy="18" r="1.3" fill={C.ink} />
  </svg>
);

// ---------- Hook: warning banner ----------

export const HookBanner: React.FC<{duration: number}> = ({duration}) => {
  const s = useIn(0, 11);
  const out = useOut(duration);
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 150, opacity: out}}>
      <div style={{transform: `scale(${s}) rotate(${interpolate(s, [0, 1], [-8, -2])}deg)`}}>
        <Pill bg={C.red} style={{fontSize: 58, padding: "18px 44px"}}>
          <WarnIcon size={62} />
          تنبيه لصنّاع المحتوى
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Red flash for "وبموافقتك" ----------

export const AlertFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3, 18], [0, 0.55, 0], {extrapolateRight: "clamp"});
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 45%, rgba(255,45,85,0) 35%, rgba(255,45,85,${o}) 100%)`,
      }}
    />
  );
};

// ---------- Two toggles that are ON ----------

export const TogglesOn: React.FC<{duration: number}> = ({duration}) => {
  const a = useIn(0);
  const b = useIn(5);
  const out = useOut(duration);
  const row = (s: number, label: string) => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 40,
        width: 640,
        transform: `translateX(${interpolate(s, [0, 1], [-700, 0])}px)`,
      }}
    >
      <Toggle on={1} />
      <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 48, color: C.white, direction: "rtl"}}>
        {label}
      </span>
    </div>
  );
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 140, opacity: out}}>
      <div
        style={{
          background: C.card,
          borderRadius: 40,
          padding: "34px 44px",
          display: "flex",
          flexDirection: "column",
          gap: 26,
          border: `3px solid ${C.green}`,
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        {row(a, "الخيار ١ · مفعّل")}
        {row(b, "الخيار ٢ · مفعّل")}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Content & voice → AI ----------

export const ToAI: React.FC<{duration: number; aiAt: number}> = ({duration, aiAt}) => {
  const frame = useCurrentFrame();
  const a = useIn(0);
  const b = useIn(6);
  const ai = useIn(aiAt, 9);
  const out = useOut(duration);
  const pulse = 1 + 0.05 * Math.sin(frame / 3);
  const flow = interpolate(frame, [aiAt - 10, aiAt], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 150, opacity: out}}>
      <div style={{display: "flex", alignItems: "center", gap: 26, direction: "rtl"}}>
        <div style={{display: "flex", flexDirection: "column", gap: 18}}>
          <div style={{transform: `scale(${a}) translateX(${flow * -40}px)`}}>
            <Pill style={{fontSize: 46}}>📷 محتواك</Pill>
          </div>
          <div style={{transform: `scale(${b}) translateX(${flow * -40}px)`}}>
            <Pill style={{fontSize: 46}}>🎙 صوتك</Pill>
          </div>
        </div>
        <svg width={110} height={60} viewBox="0 0 110 60" style={{opacity: flow, transform: "scaleX(-1)"}}>
          <path d="M5 30 H90 M70 10 L95 30 L70 50" stroke={C.yellow} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div
          style={{
            transform: `scale(${ai * pulse})`,
            width: 190,
            height: 190,
            borderRadius: 48,
            background: C.igGradient,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 92,
            color: C.white,
            boxShadow: "0 0 60px rgba(214,41,118,0.8)",
            ...textStroke(4, "rgba(0,0,0,0.25)"),
          }}
        >
          AI
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Phone mock: Settings → Share & Reuse → toggles off ----------

const Row: React.FC<{label: string; active?: number; icon: string}> = ({label, active = 0, icon}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 22,
      padding: "22px 28px",
      borderRadius: 18,
      background: `rgba(255,214,10,${0.22 * active})`,
      outline: active > 0 ? `${4 * active}px solid rgba(255,214,10,${active})` : "none",
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: 34,
      color: C.white,
    }}
  >
    <span style={{width: 40, textAlign: "center", fontSize: 32}}>{icon}</span>
    <span style={{flex: 1}}>{label}</span>
    <span style={{color: C.grey, fontSize: 36}}>›</span>
  </div>
);

export const PhoneSettings: React.FC<{
  duration: number;
  tapAt: number;
  screen2At: number;
  off1At: number;
  off2At: number;
}> = ({duration, tapAt, screen2At, off1At, off2At}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = useIn(0, 16);
  const out = interpolate(frame, [duration - 10, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const y = interpolate(enter, [0, 1], [1400, 0]) + out * 1400;

  const tap = interpolate(frame, [tapAt - 4, tapAt, tapAt + 14], [0, 1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ripple = interpolate(frame, [tapAt, tapAt + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const slide = spring({frame: frame - screen2At, fps, config: {damping: 18, stiffness: 160}});
  const t1 = 1 - spring({frame: frame - off1At, fps, config: {damping: 14, stiffness: 260}});
  const t2 = 1 - spring({frame: frame - off2At, fps, config: {damping: 14, stiffness: 260}});
  const done = spring({frame: frame - off2At - 6, fps, config: {damping: 12}});

  const W = 640;
  const H = 1180;

  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 150}}>
      <div
        style={{
          width: W,
          height: H,
          borderRadius: 80,
          background: "#000",
          border: "14px solid #1C1C1E",
          boxShadow: "0 40px 120px rgba(0,0,0,0.7), 0 0 0 3px #3A3A3C",
          overflow: "hidden",
          position: "relative",
          transform: `translateY(${y}px)`,
        }}
      >
        {/* notch */}
        <div style={{position: "absolute", top: 18, left: W / 2 - 14 - 80, width: 160, height: 40, borderRadius: 30, background: "#000", zIndex: 5, border: "2px solid #111"}} />
        <div style={{display: "flex", width: W * 2, height: "100%", transform: `translateX(${-slide * (W - 28)}px)`}}>
          {/* Screen 1 */}
          <div style={{width: W - 28, padding: "110px 26px 0", display: "flex", flexDirection: "column", gap: 8}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white, padding: "0 10px 26px"}}>
              Settings and activity
            </div>
            <Row icon="🔔" label="Notifications" />
            <Row icon="🔒" label="Account privacy" />
            <Row icon="⭐" label="Close Friends" />
            <div style={{position: "relative"}}>
              <Row icon="🔁" label="Sharing and reuse" active={tap} />
              {ripple > 0 && ripple < 1 ? (
                <div
                  style={{
                    position: "absolute",
                    left: 300 - 60 * ripple,
                    top: 50 - 60 * ripple,
                    width: 120 * ripple,
                    height: 120 * ripple,
                    borderRadius: "50%",
                    background: `rgba(255,255,255,${0.5 * (1 - ripple)})`,
                  }}
                />
              ) : null}
            </div>
            <Row icon="⏱" label="Time management" />
            <Row icon="🌙" label="Content preferences" />
          </div>
          {/* Screen 2 */}
          <div style={{width: W - 28, padding: "110px 30px 0", display: "flex", flexDirection: "column", gap: 34}}>
            <div style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.white}}>‹ Sharing and reuse</div>
            {[
              {label: "Allow others to reuse your content", on: t1},
              {label: "Allow reuse of your voice & likeness in AI", on: t2},
            ].map((r) => (
              <div
                key={r.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  padding: "26px 24px",
                  borderRadius: 22,
                  background: "#1C1C1E",
                  outline: `4px solid ${r.on > 0.5 ? C.red : C.green}`,
                }}
              >
                <span style={{flex: 1, fontFamily: FONT, fontWeight: 700, fontSize: 32, color: C.white, lineHeight: 1.3}}>
                  {r.label}
                </span>
                <Toggle on={r.on} size={1.1} />
              </div>
            ))}
            <div
              style={{
                alignSelf: "center",
                marginTop: 20,
                transform: `scale(${done})`,
                fontFamily: FONT,
                fontWeight: 900,
                fontSize: 54,
                color: C.green,
                direction: "rtl",
              }}
            >
              ✓ تمّ الإطفاء
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Breadcrumb path ----------

export const Breadcrumb: React.FC<{duration: number; step2At: number; step3At: number}> = ({duration, step2At, step3At}) => {
  const s1 = useIn(0);
  const s2 = useIn(step2At);
  const s3 = useIn(step3At);
  const out = useOut(duration);
  const chip = (s: number, t: string, hl = false) => (
    <div style={{transform: `scale(${s})`, opacity: s}}>
      <Pill bg={hl ? C.yellow : C.card} color={hl ? C.ink : C.white} style={{fontSize: 38, padding: "10px 26px"}}>
        {t}
      </Pill>
    </div>
  );
  const arrow = (s: number) => (
    <span style={{fontFamily: FONT, fontWeight: 900, fontSize: 44, color: C.yellow, opacity: s}}>←</span>
  );
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 60, opacity: out}}>
      <div style={{display: "flex", direction: "rtl", alignItems: "center", gap: 14}}>
        {chip(s1, "الإعدادات")}
        {arrow(s2)}
        {chip(s2, "Share & Reuse")}
        {arrow(s3)}
        {chip(s3, "طفّي الخيارين", true)}
      </div>
    </AbsoluteFill>
  );
};

// ---------- Screen-recording frame ----------

export const RecFrame: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const s = useIn(0);
  const out = useOut(duration);
  const blink = Math.floor(frame / 8) % 2 === 0 ? 1 : 0.25;
  const corner = (r: number): React.CSSProperties => ({
    position: "absolute",
    width: 120,
    height: 120,
    borderColor: C.white,
    borderStyle: "solid",
    borderWidth: 0,
    transform: `rotate(${r}deg)`,
  });
  const inset = interpolate(s, [0, 1], [0, 70]);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{...corner(0), top: inset, left: inset, borderTopWidth: 10, borderLeftWidth: 10}} />
      <div style={{...corner(0), top: inset, right: inset, borderTopWidth: 10, borderRightWidth: 10}} />
      <div style={{...corner(0), bottom: inset, left: inset, borderBottomWidth: 10, borderLeftWidth: 10}} />
      <div style={{...corner(0), bottom: inset, right: inset, borderBottomWidth: 10, borderRightWidth: 10}} />
      <div style={{position: "absolute", top: 120, left: 0, right: 0, display: "flex", justifyContent: "center"}}>
        <Pill bg="rgba(0,0,0,0.65)" style={{direction: "ltr", fontSize: 46, transform: `scale(${s})`}}>
          <span style={{width: 34, height: 34, borderRadius: 34, background: C.red, opacity: blink}} />
          REC
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

// ---------- Key → house ----------

const HouseIcon: React.FC<{door: number}> = ({door}) => (
  <svg width={260} height={240} viewBox="0 0 260 240">
    <path d="M20 115 L130 20 L240 115" fill="none" stroke={C.white} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="45" y="105" width="170" height="125" rx="10" fill="rgba(255,255,255,0.12)" stroke={C.white} strokeWidth={12} />
    {/* door opening: glow behind */}
    <rect x="105" y="150" width="50" height="80" fill={C.yellow} opacity={door} />
    <rect
      x="105"
      y="150"
      width={50 * (1 - door * 0.85)}
      height="80"
      fill="#5B3A1E"
      stroke={C.white}
      strokeWidth={6}
    />
  </svg>
);

const KeyIcon: React.FC = () => (
  <svg width={190} height={90} viewBox="0 0 190 90">
    <circle cx="40" cy="45" r="30" fill="none" stroke={C.yellow} strokeWidth={14} />
    <path d="M70 45 H175 M140 45 V70 M162 45 V64" stroke={C.yellow} strokeWidth={14} strokeLinecap="round" />
  </svg>
);

export const KeyHouse: React.FC<{duration: number; openAt: number}> = ({duration, openAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = useIn(0);
  const out = useOut(duration);
  const travel = interpolate(frame, [4, openAt], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });
  const door = spring({frame: frame - openAt, fps, config: {damping: 16}});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <div style={{position: "absolute", top: 120, right: 90, transform: `scale(${enter})`}}>
        <HouseIcon door={door} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 200 + interpolate(travel, [0, 1], [0, 40]),
          left: interpolate(travel, [0, 1], [90, 560]),
          transform: `scale(${enter * interpolate(travel, [0.8, 1], [1, 0.6], {extrapolateLeft: "clamp"})}) rotate(${interpolate(travel, [0, 1], [-20, 0])}deg)`,
          opacity: interpolate(travel, [0.9, 1], [1, 0], {extrapolateLeft: "clamp"}),
        }}
      >
        <KeyIcon />
      </div>
    </AbsoluteFill>
  );
};

// ---------- CTA: share + follow ----------

export const ShareCTA: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const s = useIn(0, 10);
  const out = useOut(duration);
  const fly = interpolate(frame, [10, 30], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 150, opacity: out}}>
      <div style={{transform: `scale(${s})`}}>
        <Pill bg={C.igGradient} style={{fontSize: 56, padding: "18px 46px"}}>
          <svg width={60} height={60} viewBox="0 0 24 24" style={{transform: `translate(${-fly * 14}px, ${-fly * 10}px) scaleX(-1)`}}>
            <path d="M22 2 L11 13 M22 2 L15 22 L11 13 L2 9 Z" fill="none" stroke={C.white} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" />
          </svg>
          ابعتها لصانع محتوى
        </Pill>
      </div>
    </AbsoluteFill>
  );
};

export const FollowCTA: React.FC<{duration: number; clickAt: number}> = ({duration, clickAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = useIn(0, 10);
  const out = useOut(duration, 6);
  const pressed = frame >= clickAt;
  const press = spring({frame: frame - clickAt, fps, config: {damping: 8, stiffness: 300}});
  const scale = s * (pressed ? interpolate(press, [0, 1], [0.85, 1]) : 1);
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 150, opacity: out}}>
      <div style={{transform: `scale(${scale})`}}>
        <Pill
          bg={pressed ? "#262626" : "#0095F6"}
          style={{fontSize: 60, padding: "20px 64px", border: pressed ? "3px solid #555" : "none"}}
        >
          {pressed ? "✓ متابَع" : "+ تابعني"}
        </Pill>
      </div>
      <div
        style={{
          marginTop: 22,
          transform: `scale(${s})`,
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 44,
          color: C.white,
          direction: "rtl",
          ...textStroke(10),
        }}
      >
        لأخبار الإنستغرام والـ AI
      </div>
    </AbsoluteFill>
  );
};
