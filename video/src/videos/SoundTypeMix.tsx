// SoundType AI — app tip reel, edited in ستايل 0 (all styles combined).
//   Style 1: yellow hook titles above the head, split-screen app walkthrough
//   Style 2: glowing kashida captions, red bar, mint insert with chips
//   Style 3: flash + punch-in on turns
//   Style 4: big white key term, neon audio→text graphic in the headroom
//   + the SoundType app icon floating around Saya when she says the name.
// House rules: footage colour untouched, spoken word light blue.
import {Audio} from "@remotion/media";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {makeTimeline} from "../styles/style1/timeline";
import {S1TalkingHead} from "../styles/style1/Layout";
import {S1Title} from "../styles/style1/Titles";
import {S1Captions, chunkPhrases} from "../styles/style1/Captions";
import {Burst} from "../styles/style1/Doodles";
import {S2} from "../styles/style2/tokens";
import {buildPages, S2Captions} from "../styles/style2/GlowCaptions";
import {GlassChip, MintStage, RedArrow} from "../styles/style2/Inserts";
import {S3Flash} from "../styles/style3/WordCaptions";
import {KeyTerm} from "../styles/style4/Text";
import {neonGlow, S4} from "../styles/style4/tokens";

export const ST_FPS = 30;
const SRC = staticFile("footage/soundtype.mp4");
const ICON = staticFile("assets/soundtype-icon.png");
const BLUE = "#1F74E0"; // SoundType brand blue (from the icon)

const T = makeTimeline(
  [
    [0.02, 5.5],
    [5.74, 8.21],
    [8.58, 11.7],
    [12.04, 30.18],
    [30.59, 31.2],
  ],
  ST_FPS,
);
const TAIL = 14;
export const ST_FRAMES = T.total + TAIL;
const at = T.at;
const span = T.span;

// ---------------------------------------------------------------- phrases (SRT)
const PH: {s: number; e: number; t: string}[] = [
  {s: 0.07, e: 1.97, t: "إذا بدك تحوّل الملفات الصوتية"},
  {s: 2.1, e: 3.53, t: "لنصوص مكتوبة *ببلاش*"},
  {s: 3.6, e: 5.37, t: "وبدون ما يكون حتى عندك *انترنت*"},
  {s: 5.77, e: 6.57, t: "لازم دلّك"},
  {s: 6.57, e: 7.37, t: "على تطبيق اسمه"},
  {s: 7.57, e: 8.37, t: "[SoundType]"},
  {s: 8.53, e: 9.5, t: "فإنت كل اللي عليك"},
  {s: 9.6, e: 10.6, t: "تدخل على التطبيق"},
  {s: 10.73, e: 11.67, t: "تضغط على + Plus"},
  {s: 11.97, e: 12.77, t: "وبعدها تختار"},
  {s: 12.87, e: 14.47, t: "إما تسجّل صوت مباشرة"},
  {s: 14.7, e: 16.27, t: "أو تضغط على خيار Upload"},
  {s: 16.37, e: 17.87, t: "وترفع أي ملف صوتي"},
  {s: 17.97, e: 18.77, t: "موجود عندك أصلاً"},
  {s: 19.2, e: 20.1, t: "سواء كان فيديو"},
  {s: 20.27, e: 22.37, t: "أو بس ملف صوت أو حتى فيك تعطيه"},
  {s: 22.5, e: 23.13, t: "رابط فيديو"},
  {s: 23.13, e: 23.5, t: "يوتيوب"},
  {s: 23.5, e: 24.17, t: "[ومبروك عليك]"},
  {s: 24.47, e: 25.53, t: "التطبيق رح يحوّل لك"},
  {s: 25.67, e: 26.77, t: "الملف الصوتي هاد"},
  {s: 26.9, e: 28.3, t: "لنص *مكتوب* ومرتّب"},
  {s: 28.5, e: 30.2, t: "تقدر [تنسخه] أو تعدّل عليه"},
  {s: 30.6, e: 31.2, t: "على كيفك"},
];
const toOut = (p: {s: number; e: number; t: string}) => ({start: at(p.s), end: at(p.e), text: p.t});
const PAGES = buildPages(PH.map(toOut), 2);

// ---------------------------------------------------------------- windows
const W = {
  hookA: span(0.02, 2.02),
  hookB: span(2.02, 3.6),
  offline: span(3.6, 5.5),
  orbit: span(7.45, 9.6),
  split: span(9.6, 18.95),
  mint: span(19.15, 23.15),
  convert: span(24.47, 28.4),
  copy: span(28.5, 30.3),
  end: {from: at(30.59), durationInFrames: ST_FRAMES - at(30.59)},
};
const inside = (f: number, w: {from: number; durationInFrames: number}) => f >= w.from && f < w.from + w.durationInFrames;
const isSplit = (f: number) => inside(f, W.split);
const hideGlow = (f: number) =>
  inside(f, W.hookA) || inside(f, W.hookB) || inside(f, W.orbit) || inside(f, W.split) || inside(f, W.mint);
const SPLIT_CHUNKS = chunkPhrases(PH.filter((p) => p.s >= 9.6 && p.s < 18.95).map(toOut));

const PUNCH: [number, number, number][] = [
  [3.6, 5.5, 1.15],
  [23.13, 24.3, 1.18],
  [30.59, 31.3, 1.1],
];
const FLASH_AT = [3.6, 23.3];
const zoomAtSrc = (t: number) => PUNCH.find(([a, b]) => t >= a && t < b)?.[2] ?? 1;

const Clip: React.FC<{srcStart: number; outStart: number}> = ({srcStart, outStart}) => {
  const frame = useCurrentFrame();
  const out = outStart + frame;
  return (
    <S1TalkingHead
      src={SRC}
      trimBefore={srcStart}
      mode={isSplit(out) ? "bottom" : "full"}
      focusY={0.4}
      zoom={zoomAtSrc((srcStart + frame) / ST_FPS)}
    />
  );
};

// ---------------------------------------------------------------- floating app icon

/** The SoundType icon pops in and floats in an orbit around Saya. */
const OrbitIcon: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 10, stiffness: 200}});
  const out = interpolate(frame, [duration - 8, duration], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  // orbit: starts at the top (above the head) and travels clockwise around her,
  // never crossing the face (face ≈ x 430–650, y 560–860)
  const a = -Math.PI / 2 + interpolate(frame, [0, duration], [0, Math.PI * 2 * 0.95]);
  const cx = 540 + Math.cos(a) * 400;
  const cy = 730 + Math.sin(a) * 340;
  const bob = Math.sin(frame / 5) * 10;
  const tilt = Math.sin(frame / 9) * 8;
  const size = 220;
  // a soft trail of ghost icons
  const trail = [1, 2, 3].map((k) => {
    const ak = a - k * 0.16;
    return {x: 540 + Math.cos(ak) * 400, y: 730 + Math.sin(ak) * 340, o: 0.18 / k};
  });
  return (
    <AbsoluteFill style={{opacity: out}}>
      {trail.map((t, i) => (
        <Img
          key={i}
          src={ICON}
          style={{position: "absolute", left: t.x - size / 2, top: t.y - size / 2, width: size, height: size, opacity: t.o * pop, filter: "blur(2px)"}}
        />
      ))}
      <div
        style={{
          position: "absolute",
          left: cx - size / 2,
          top: cy - size / 2 + bob,
          width: size,
          height: size,
          transform: `scale(${pop}) rotate(${tilt}deg)`,
          filter: `drop-shadow(0 18px 30px rgba(0,0,0,0.45)) drop-shadow(0 0 26px ${BLUE}aa)`,
        }}
      >
        <Img src={ICON} style={{width: size, height: size}} />
      </div>
      {/* sound rings around the icon */}
      {[0, 10].map((d) => {
        const r = ((frame + d) % 20) / 20;
        return (
          <div
            key={d}
            style={{
              position: "absolute",
              left: cx - (size / 2) * (1 + r * 0.6),
              top: cy + bob - (size / 2) * (1 + r * 0.6),
              width: size * (1 + r * 0.6),
              height: size * (1 + r * 0.6),
              borderRadius: 60 * (1 + r * 0.6),
              border: `4px solid rgba(143,211,255,${0.6 * (1 - r) * pop})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- app walkthrough mock

const Sheet: React.FC<{p: number; hi: number}> = ({p, hi}) => {
  const rows = [
    {t: "Record audio", d: "M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z M5 11a7 7 0 0 0 14 0 M12 18v3"},
    {t: "Upload file", d: "M12 16V4 M7 9l5-5 5 5 M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3"},
    {t: "YouTube link", d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1 M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"},
  ];
  return (
    <div style={{position: "absolute", left: 0, right: 0, bottom: 0, padding: "34px 30px 60px", borderRadius: "40px 40px 0 0", background: "#1E2430", transform: `translateY(${(1 - p) * 520}px)`, display: "flex", flexDirection: "column", gap: 18}}>
      <div style={{alignSelf: "center", width: 80, height: 8, borderRadius: 8, background: "#4A5160"}} />
      {rows.map((r, i) => (
        <div key={r.t} style={{display: "flex", alignItems: "center", gap: 22, padding: "22px 24px", borderRadius: 22, background: hi === i ? BLUE : "#2A3140", outline: hi === i ? "4px solid #8FD3FF" : "none", fontFamily: "S2Lat, S2Ar, sans-serif", fontWeight: 900, fontSize: 34, color: "#fff"}}>
          <svg width={44} height={44} viewBox="0 0 24 24"><path d={r.d} stroke="#fff" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          {r.t}
        </div>
      ))}
    </div>
  );
};

/** Phone mock of the SoundType app: home → "+" → options → upload progress. */
const SoundTypePhone: React.FC<{duration: number; plusAt: number; sheetAt: number; recAt: number; upAt: number; fileAt: number; doneAt: number}> = ({
  duration,
  plusAt,
  sheetAt,
  recAt,
  upAt,
  fileAt,
  doneAt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 16}});
  const exit = interpolate(frame, [duration - 8, duration], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.in(Easing.cubic)});
  const press = frame >= plusAt && frame < plusAt + 6 ? 0.86 : 1;
  const ripple = interpolate(frame, [plusAt, plusAt + 14], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const sheet = spring({frame: frame - sheetAt, fps, config: {damping: 18}});
  const hi = frame >= upAt ? 1 : frame >= recAt ? 0 : -1;
  const fileScreen = spring({frame: frame - fileAt, fps, config: {damping: 18}});
  const prog = interpolate(frame, [fileAt + 6, doneAt], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const done = spring({frame: frame - doneAt, fps, config: {damping: 11}});
  const W_ = 500;
  const H_ = 860;
  return (
    <AbsoluteFill style={{alignItems: "center", paddingTop: 40}}>
      <div style={{width: W_, height: H_, borderRadius: 64, border: "12px solid #111", background: "#12161E", boxShadow: "0 30px 80px rgba(0,0,0,0.35)", overflow: "hidden", position: "relative", transform: `translateY(${(1 - enter) * 900 + exit * -900}px)`}}>
        {/* home */}
        <div style={{position: "absolute", inset: 0, padding: "60px 30px", fontFamily: "S2Lat, S2Ar, sans-serif", color: "#fff"}}>
          <div style={{display: "flex", alignItems: "center", gap: 16}}>
            <Img src={ICON} style={{width: 64, height: 64}} />
            <div style={{fontWeight: 900, fontSize: 40}}>SoundType AI</div>
          </div>
          <div style={{marginTop: 40, display: "flex", flexDirection: "column", gap: 16}}>
            {[0.9, 0.7, 0.8].map((w, i) => (
              <div key={i} style={{height: 70, borderRadius: 18, background: "#1E2430", padding: "16px 20px", boxSizing: "border-box"}}>
                <div style={{width: `${w * 100}%`, height: 12, borderRadius: 6, background: "#3A4252"}} />
                <div style={{width: `${w * 60}%`, height: 10, borderRadius: 6, background: "#2C3342", marginTop: 12}} />
              </div>
            ))}
          </div>
          {/* + FAB */}
          <div style={{position: "absolute", right: 40, bottom: 50, width: 120, height: 120, borderRadius: 120, background: BLUE, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, fontWeight: 900, boxShadow: `0 0 ${30 + 20 * Math.sin(frame / 4)}px ${BLUE}`, transform: `scale(${press})`}}>
            +
          </div>
          {ripple > 0 && ripple < 1 ? (
            <div style={{position: "absolute", right: 100 - 90 * ripple, bottom: 110 - 90 * ripple, width: 180 * ripple, height: 180 * ripple, borderRadius: "50%", border: `5px solid rgba(143,211,255,${1 - ripple})`, transform: "translate(50%, 50%)"}} />
          ) : null}
        </div>
        {frame >= sheetAt && frame < fileAt + 10 ? <Sheet p={sheet} hi={hi} /> : null}
        {/* upload screen */}
        {frame >= fileAt ? (
          <div style={{position: "absolute", inset: 0, background: "#12161E", transform: `translateX(${(1 - fileScreen) * W_}px)`, padding: "70px 30px", fontFamily: "S2Lat, S2Ar, sans-serif", color: "#fff"}}>
            <div style={{fontWeight: 900, fontSize: 36}}>Upload</div>
            <div style={{marginTop: 40, padding: 24, borderRadius: 22, background: "#1E2430", display: "flex", alignItems: "center", gap: 18}}>
              <svg width={56} height={56} viewBox="0 0 24 24"><path d="M5 10v4 M8.5 7v10 M12 4v16 M15.5 7v10 M19 10v4" stroke="#8FD3FF" strokeWidth={2.2} strokeLinecap="round" /></svg>
              <div style={{flex: 1}}>
                <div style={{fontWeight: 900, fontSize: 28}}>voice-note.m4a</div>
                <div style={{marginTop: 14, height: 12, borderRadius: 8, background: "#2C3342", overflow: "hidden"}}>
                  <div style={{width: `${prog * 100}%`, height: "100%", background: BLUE}} />
                </div>
              </div>
            </div>
            <div style={{marginTop: 50, textAlign: "center", fontWeight: 900, fontSize: 44, color: "#62D97A", transform: `scale(${done})`}}>✓</div>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- neon audio → text (Style 4 look)

const AudioToText: React.FC<{duration: number; textAt: number}> = ({duration, textAt}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 6, duration - 6, duration], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const arrow = interpolate(frame, [textAt - 12, textAt], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const lines = [0.95, 0.75, 0.88, 0.6];
  return (
    <AbsoluteFill style={{opacity: o, mixBlendMode: "screen"}}>
      <div style={{position: "absolute", top: 130, left: 0, right: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 40, direction: "ltr"}}>
        {/* waveform */}
        <div style={{display: "flex", alignItems: "center", gap: 12, height: 220, filter: neonGlow(S4.color.cyan, 0.6)}}>
          {Array.from({length: 9}).map((_, i) => {
            const h = 40 + Math.abs(Math.sin(frame / 4 + i * 0.9)) * 150 * (1 - Math.abs(i - 4) / 6);
            return <div key={i} style={{width: 16, height: h, borderRadius: 10, background: S4.color.cyan}} />;
          })}
        </div>
        {/* arrow */}
        <svg width={130} height={60} viewBox="0 0 130 60" style={{filter: neonGlow(S4.color.magenta, 0.6)}}>
          <path d="M5 30 H110 M88 10 L115 30 L88 50" stroke={S4.color.magenta} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={100} strokeDasharray={100} strokeDashoffset={100 * (1 - arrow)} />
        </svg>
        {/* text document */}
        <div style={{width: 260, height: 260, borderRadius: 26, border: `4px solid ${S4.color.green}`, filter: neonGlow(S4.color.green, 0.5), padding: 28, boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 22}}>
          {lines.map((w, i) => {
            const p = interpolate(frame, [textAt + i * 6, textAt + i * 6 + 10], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
            return <div key={i} style={{width: `${w * 100 * p}%`, height: 14, borderRadius: 8, background: S4.color.green}} />;
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- composition

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at: f, src, volume = 1}) => (
  <Sequence from={f} durationInFrames={30} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const FadeOut: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: "#000", opacity: interpolate(frame, [0, TAIL], [0, 1], {extrapolateRight: "clamp"})}} />;
};

const rel = (w: {from: number}, t: number) => at(t) - w.from;

export const SoundTypeMix: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Series>
        {T.segments.map((seg, i) => {
          const last = i === T.segments.length - 1;
          return (
            <Series.Sequence key={i} name={`Clip ${i + 1}`} durationInFrames={seg.duration + (last ? TAIL : 0)}>
              <Clip srcStart={seg.srcStart} outStart={seg.outStart} />
            </Series.Sequence>
          );
        })}
      </Series>

      {FLASH_AT.map((t) => (
        <Sequence key={t} name={`Flash ${t}`} from={at(t)} durationInFrames={8}>
          <S3Flash />
        </Sequence>
      ))}

      {/* Style 1 hook titles (dark headroom above the head) */}
      <Sequence name="Hook A" {...W.hookA}>
        <S1Title small="إذا بدك تحوّل" big="الملفات الصوتية" duration={W.hookA.durationInFrames} y={360} />
      </Sequence>
      <Sequence name="Hook B" {...W.hookB}>
        <S1Title small="لنصوص مكتوبة" big="ببلاش" duration={W.hookB.durationInFrames} y={360} squiggle />
      </Sequence>
      <Sequence name="Hook burst" {...span(2.5, 3.6)}>
        <AbsoluteFill>
          <Burst style={{position: "absolute", top: 120, left: 250}} />
          <Burst style={{position: "absolute", top: 120, right: 250, transform: "scaleX(-1)"}} />
        </AbsoluteFill>
      </Sequence>

      {/* Style 4 key term above the head */}
      <Sequence name="Offline" {...W.offline}>
        <KeyTerm text="Offline" duration={W.offline.durationInFrames} y={250} />
      </Sequence>

      {/* Style 2 red arrow on "an app called…" */}
      <Sequence name="Arrow app" {...span(5.9, 7.5)}>
        <RedArrow style={{position: "absolute", top: 820, right: 150}} size={170} />
      </Sequence>

      {/* ★ the app icon floats around her on "SoundType" */}
      <Sequence name="SoundType icon orbit" {...W.orbit}>
        <OrbitIcon duration={W.orbit.durationInFrames} />
      </Sequence>
      <Sequence name="SoundType label" {...W.orbit}>
        <KeyTerm text="SoundType AI" duration={W.orbit.durationInFrames} y={60} />
      </Sequence>

      {/* Style 1 split-screen app walkthrough */}
      <Sequence name="Split paper" {...W.split}>
        <AbsoluteFill style={{height: 960, background: "#F4F4F5"}} />
      </Sequence>
      <Sequence name="App walkthrough" {...W.split}>
        <AbsoluteFill style={{height: 960, overflow: "hidden"}}>
          <SoundTypePhone
            duration={W.split.durationInFrames}
            plusAt={rel(W.split, 11.15)}
            sheetAt={rel(W.split, 11.97)}
            recAt={rel(W.split, 13.1)}
            upAt={rel(W.split, 15.5)}
            fileAt={rel(W.split, 16.4)}
            doneAt={rel(W.split, 18.5)}
          />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Split captions" {...W.split}>
        <AbsoluteFill>
          <ShiftedS1Captions offset={W.split.from} />
        </AbsoluteFill>
      </Sequence>

      {/* Style 2 mint insert: video / audio / YouTube link */}
      <Sequence name="Insert: sources" {...W.mint}>
        <MintStage>
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center", gap: 90}}>
            <GlassChip label="فيديو" colors={S2.color.chipPurple} icon="video" delay={rel(W.mint, 19.4)} scale={1.4} />
            <GlassChip label="ملف صوت" colors={S2.color.chipOrange} icon="audio" delay={rel(W.mint, 20.6)} scale={1.4} />
            <GlassChip label="رابط يوتيوب" colors={S2.color.chipRed} icon="link" delay={rel(W.mint, 22.5)} scale={1.4} />
          </AbsoluteFill>
        </MintStage>
      </Sequence>
      <Sequence name="Congrats burst" {...span(23.3, 24.3)}>
        <AbsoluteFill>
          <Burst style={{position: "absolute", top: 260, left: 200}} size={160} />
          <Burst style={{position: "absolute", top: 260, right: 200, transform: "scaleX(-1)"}} size={160} />
        </AbsoluteFill>
      </Sequence>

      {/* Style 4 neon audio → text in the headroom */}
      <Sequence name="Audio to text" {...W.convert}>
        <AudioToText duration={W.convert.durationInFrames} textAt={rel(W.convert, 26.9)} />
      </Sequence>

      {/* copy / edit beat */}
      <Sequence name="Copy edit" {...W.copy}>
        <KeyTerm text="Copy Edit" duration={W.copy.durationInFrames} y={170} />
      </Sequence>

      {/* closing title */}
      <Sequence name="End title" {...W.end}>
        <S1Title big="على كيفك" duration={W.end.durationInFrames + 20} y={360} />
      </Sequence>

      <S2Captions pages={PAGES} top={1000} hideDuring={hideGlow} plate={0.5} />

      <Sequence name="Fade out" from={ST_FRAMES - TAIL}>
        <FadeOut />
      </Sequence>

      {/* sound design */}
      <Sfx at={at(0.07)} src="whoosh" volume={0.4} />
      <Sfx at={at(2.02)} src="pop" volume={0.5} />
      {FLASH_AT.map((t) => (
        <Sfx key={t} at={at(t)} src="boom" volume={0.3} />
      ))}
      <Sfx at={at(7.5)} src="pop" volume={0.6} />
      <Sfx at={at(7.55)} src="whoosh" volume={0.45} />
      <Sfx at={at(9.6)} src="whoosh" volume={0.45} />
      <Sfx at={at(11.15)} src="click" volume={0.8} />
      <Sfx at={at(13.1)} src="click" volume={0.6} />
      <Sfx at={at(15.5)} src="click" volume={0.8} />
      <Sfx at={at(18.5)} src="ding" volume={0.4} />
      <Sfx at={at(19.15)} src="whoosh" volume={0.45} />
      <Sfx at={at(19.4)} src="pop" volume={0.5} />
      <Sfx at={at(20.6)} src="pop" volume={0.5} />
      <Sfx at={at(22.5)} src="pop" volume={0.5} />
      <Sfx at={at(26.9)} src="ding" volume={0.35} />
      <Sfx at={at(28.5)} src="pop" volume={0.45} />
    </AbsoluteFill>
  );
};

const ShiftedS1Captions: React.FC<{offset: number}> = ({offset}) => {
  const chunks = SPLIT_CHUNKS.map((c) => ({...c, start: c.start - offset, end: c.end - offset}));
  return <S1Captions chunks={chunks} isSplit={() => true} />;
};
