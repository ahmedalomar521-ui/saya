// "أهلاً أنا سايا" — the same intro, edited in ستايل 2.
import {Audio, Video} from "@remotion/media";
import {AbsoluteFill, interpolate, Sequence, Series, staticFile, useCurrentFrame} from "remotion";
import {makeTimeline} from "../styles/style1/timeline";
import {S2} from "../styles/style2/tokens";
import {buildPages, S2Captions} from "../styles/style2/GlowCaptions";
import {GlassChip, GlowIcon, MintStage, PaperLines, PaperStage, RedArrow} from "../styles/style2/Inserts";

export const SAYA2_FPS = 30;
const SRC = staticFile("footage/saya-intro.mp4");

const T = makeTimeline(
  [
    [0.13, 1.34],
    [1.64, 4.45],
    [4.94, 5.97],
    [6.35, 8.85],
    [9.16, 9.94],
    [10.29, 13.89],
    [14.37, 18.02],
  ],
  SAYA2_FPS,
);
export const SAYA2_FRAMES = T.total;
const at = T.at;

// *word* = red glow, [words] = red highlight bar
const PAGES = buildPages(
  [
    {s: 0.13, e: 1.34, t: "أهلاً أنا"},
    {s: 1.64, e: 2.3, t: "*سايا*"},
    {s: 2.3, e: 2.95, t: "صح أنا"},
    {s: 4.94, e: 5.97, t: "بس خلّينا من *هالحكي*"},
    {s: 6.35, e: 7.68, t: "لأنه هون رح نكتشف سوا"},
    {s: 10.29, e: 11.17, t: "[وحيلة بسيطة]"},
    {s: 11.27, e: 13.1, t: "ممكن توفّر *وقتكم* وتسهّل عليكم"},
    {s: 13.2, e: 13.89, t: "أشياء كتير"},
    {s: 16.52, e: 17.2, t: "أهلاً فيكم"},
    {s: 17.45, e: 18.02, t: "[ويلا نبدأ]"},
  ].map((p) => ({start: at(p.s), end: at(p.e), text: p.t})),
);

// Full-screen inserts (source seconds). Captions hide while they're up.
const INSERTS = {
  ai: T.span(2.95, 4.7),
  tools: T.span(7.68, 10.1),
  paper: T.span(14.37, 16.45),
};
const inInsert = (f: number) =>
  Object.values(INSERTS).some((s) => f >= s.from && f < s.from + s.durationInFrames);

// Per-clip framing: punch-in + desaturation on the "but forget that" beat.
const FRAMING: {zoom: number; mono?: boolean}[] = [
  {zoom: 1.0},
  {zoom: 1.12},
  {zoom: 1.32, mono: true},
  {zoom: 1.0},
  {zoom: 1.0},
  {zoom: 1.12},
  {zoom: 1.0},
];

const Clip: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const seg = T.segments[i];
  const f = FRAMING[i];
  const drift = interpolate(frame, [0, seg.duration], [0, 0.02]);
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Video
        src={SRC}
        trimBefore={seg.srcStart}
        style={{
          position: "absolute",
          width: 1080,
          height: 1920,
          filter: f.mono ? "grayscale(0.75) contrast(1.15) brightness(0.92)" : S2.grade,
          transform: `scale(${f.zoom + drift})`,
          transformOrigin: "50% 28%",
        }}
      />
      {/* warm low glow + vignette, like the reference's lamp-lit room */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(255,190,90,0.10) 0%, rgba(0,0,0,0) 50%), radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.45) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at: f, src, volume = 1}) => (
  <Sequence from={f} durationInFrames={30} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const rel = (base: {from: number}, t: number) => at(t) - base.from;

export const SayaIntroStyle2: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Series>
        {T.segments.map((seg, i) => (
          <Series.Sequence key={i} name={`Clip ${i + 1}`} durationInFrames={seg.duration}>
            <Clip i={i} />
          </Series.Sequence>
        ))}
      </Series>

      {/* ---- overlays on the talking head ---- */}
      <Sequence name="Arrow hello" from={at(0.4)} durationInFrames={at(1.34) - at(0.4)}>
        <RedArrow style={{position: "absolute", top: 820, right: 150}} size={170} />
      </Sequence>
      <Sequence name="Arrow discover" from={at(6.5)} durationInFrames={at(7.68) - at(6.5)}>
        <RedArrow style={{position: "absolute", top: 830, left: 140}} size={160} flip />
      </Sequence>
      <Sequence name="Bulb" from={at(10.29)} durationInFrames={at(11.27) - at(10.29)}>
        <AbsoluteFill style={{alignItems: "center"}}>
          <div style={{position: "absolute", top: 1250}}>
            <GlowIcon name="bulb" size={200} />
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Clock" from={at(11.5)} durationInFrames={at(13.89) - at(11.5)}>
        <AbsoluteFill style={{alignItems: "center"}}>
          <div style={{position: "absolute", top: 1300}}>
            <GlowIcon name="clock" size={200} />
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Arrow welcome" from={at(16.6)} durationInFrames={at(17.45) - at(16.6)}>
        <RedArrow style={{position: "absolute", top: 820, right: 150}} size={170} />
      </Sequence>

      {/* ---- captions ---- */}
      <S2Captions pages={PAGES} top={980} hideDuring={inInsert} />

      {/* ---- full-screen inserts ---- */}
      <Sequence name="Insert: AI" {...INSERTS.ai}>
        <MintStage>
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
            <GlassChip
              label="شخصية افتراضية"
              colors={S2.color.chipPurple}
              icon="robot"
              sub="بالذكاء الاصطناعي"
              subDelay={rel(INSERTS.ai, 3.4)}
              scale={1.15}
            />
          </AbsoluteFill>
        </MintStage>
      </Sequence>
      <Sequence name="Insert: tools" {...INSERTS.tools}>
        <MintStage>
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center", gap: 130}}>
            <GlassChip label="أدوات" scale={1.6} colors={S2.color.chipOrange} icon="tool" delay={rel(INSERTS.tools, 7.75)} />
            <GlassChip label="تقنية" scale={1.6} colors={S2.color.chipRed} icon="chip" delay={rel(INSERTS.tools, 8.4)} />
            <GlassChip label="برومبتات" scale={1.6} colors={S2.color.chipGreen} icon="sparkle" delay={rel(INSERTS.tools, 9.2)} />
          </AbsoluteFill>
        </MintStage>
      </Sequence>
      <Sequence name="Insert: no complexity" {...INSERTS.paper}>
        <PaperStage>
          <PaperLines
            top={560}
            lines={[
              {text: "بتحبّوا التقنية؟", at: rel(INSERTS.paper, 14.6), size: 120},
              {text: "بس من دون", at: rel(INSERTS.paper, 15.2), size: 96},
              {text: "تعقيد", at: rel(INSERTS.paper, 15.6), size: 190, strike: true},
            ]}
          />
        </PaperStage>
      </Sequence>

      {/* ---- sound design ---- */}
      <Sfx at={at(0.4)} src="whoosh" volume={0.35} />
      <Sfx at={at(1.64)} src="pop" volume={0.5} />
      <Sfx at={at(2.95)} src="whoosh" volume={0.5} />
      <Sfx at={at(4.94)} src="boom" volume={0.45} />
      <Sfx at={at(7.68)} src="whoosh" volume={0.5} />
      <Sfx at={at(7.75)} src="pop" volume={0.5} />
      <Sfx at={at(8.4)} src="pop" volume={0.5} />
      <Sfx at={at(9.2)} src="pop" volume={0.5} />
      <Sfx at={at(10.29)} src="ding" volume={0.35} />
      <Sfx at={at(14.37)} src="whoosh" volume={0.5} />
      <Sfx at={at(15.8)} src="click" volume={0.6} />
      <Sfx at={at(17.45)} src="ding" volume={0.4} />
    </AbsoluteFill>
  );
};
