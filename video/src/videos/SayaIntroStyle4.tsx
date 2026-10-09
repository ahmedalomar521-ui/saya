// "أهلاً أنا سايا" — the same intro, edited in ستايل 4 (neon motion graphics above the head).
import {Audio} from "@remotion/media";
import {AbsoluteFill, Sequence, Series, staticFile} from "remotion";
import {makeTimeline} from "../styles/style1/timeline";
import {S1TalkingHead} from "../styles/style1/Layout";
import {S4} from "../styles/style4/tokens";
import {chunk4, KeyTerm, NeonHook, Outro, S4Captions} from "../styles/style4/Text";
import {NeonFluid, NeonIconLabel, NeonIconPath, NeonPhoneDashboard, NeonSearchGrid} from "../styles/style4/Neon";

export const SAYA4_FPS = 30;
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
  SAYA4_FPS,
);
export const SAYA4_FRAMES = T.total + 12; // short black tail after the fade
const at = T.at;

const CHUNKS = chunk4(
  [
    {s: 0.13, e: 1.34, t: "أهلاً أنا"},
    {s: 1.64, e: 3.33, t: "سايا، صح أنا شخصية افتراضية"},
    {s: 3.4, e: 4.45, t: "بالذكاء الاصطناعي"},
    {s: 4.94, e: 5.97, t: "بس خلّينا من هالحكي"},
    {s: 6.35, e: 8.2, t: "لأنه هون رح نكتشف سوا أدوات"},
    {s: 8.33, e: 9.94, t: "تقنية وبرومبتات"},
    {s: 10.29, e: 11.17, t: "وحيلة بسيطة"},
    {s: 11.27, e: 13.1, t: "ممكن توفّر وقتكم وتسهّل عليكم"},
    {s: 13.2, e: 13.89, t: "أشياء كتير"},
    {s: 14.37, e: 16.31, t: "فإذا بتحبّوا التقنية من دون تعقيد"},
    {s: 16.52, e: 17.2, t: "أهلاً فيكم"},
  ].map((p) => ({start: at(p.s), end: at(p.e), text: p.t})),
);

// key terms take the caption's place while they're on screen
const TERMS = [
  {a: 2.6, b: 4.45, text: "AI Avatar"},
  {a: 7.6, b: 8.85, text: "Tools"},
  {a: 9.16, b: 9.94, text: "Prompts"},
  {a: 10.29, b: 11.17, text: "Simple Hacks"},
  {a: 15.0, b: 16.4, text: "Tech, Simplified"},
];
const termSpans = TERMS.map((t) => T.span(t.a, t.b));
const hideCaptions = (f: number) => termSpans.some((s) => f >= s.from && f < s.from + s.durationInFrames) || f >= at(17.4);

const OFFSET = 300; // dark headroom above her head for the neon graphics

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at: f, src, volume = 1}) => (
  <Sequence from={f} durationInFrames={30} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const G: React.FC<{a: number; b: number; name: string; children: (d: number) => React.ReactNode}> = ({a, b, name, children}) => {
  const sp = T.span(a, b);
  return (
    <Sequence name={name} {...sp}>
      {children(sp.durationInFrames)}
    </Sequence>
  );
};

export const SayaIntroStyle4: React.FC = () => {
  return (
    <AbsoluteFill style={{background: S4.color.bg}}>
      <Series>
        {T.segments.map((seg, i) => (
          <Series.Sequence key={i} name={`Clip ${i + 1}`} durationInFrames={seg.duration}>
            <S1TalkingHead src={SRC} trimBefore={seg.srcStart} offsetY={OFFSET} />
          </Series.Sequence>
        ))}
      </Series>

      {/* ---- neon graphics above the head ---- */}
      <G a={0.13} b={2.6} name="Hook">{(d) => <NeonHook small="أهلاً أنا" big={["سايا"]} duration={d} />}</G>
      <G a={2.6} b={4.7} name="Fluid">{(d) => <NeonFluid duration={d} />}</G>
      <G a={6.35} b={8.85} name="Search grid">{(d) => <NeonSearchGrid query="AI tools" duration={d} />}</G>
      <G a={9.16} b={10.1} name="Phone">{(d) => <NeonPhoneDashboard duration={d} title="Prompts" />}</G>
      <G a={10.29} b={11.27} name="Bulb">{(d) => <NeonIconLabel icon="bulb" label="Hack" duration={d} />}</G>
      <G a={11.27} b={14.0} name="Time path">{(d) => <NeonIconPath icons={["clock", "sparkle", "check"]} duration={d} stepFrames={14} />}</G>
      <G a={14.37} b={16.45} name="Fluid 2">{(d) => <NeonFluid duration={d} />}</G>
      <G a={16.52} b={18.02} name="CTA path">{(d) => <NeonIconPath icons={["bookmark", "user", "plane"]} duration={d} />}</G>

      {/* ---- key terms on the chest ---- */}
      {TERMS.map((t) => (
        <G key={t.text} a={t.a} b={t.b} name={`Term ${t.text}`}>
          {(d) => <KeyTerm text={t.text} duration={d} y={1300} />}
        </G>
      ))}

      <S4Captions chunks={CHUNKS} hideDuring={hideCaptions} y={1600} />

      {/* ---- outro: big line, fade to black ---- */}
      <Sequence name="Outro" from={at(17.4)} durationInFrames={SAYA4_FRAMES - at(17.4)}>
        <Outro lines={["ويلا", "نبدأ"]} duration={SAYA4_FRAMES - at(17.4)} />
      </Sequence>

      <Sfx at={at(0.13)} src="whoosh" volume={0.45} />
      <Sfx at={at(2.6)} src="pop" volume={0.4} />
      <Sfx at={at(6.35)} src="whoosh" volume={0.4} />
      <Sfx at={at(7.6)} src="pop" volume={0.45} />
      <Sfx at={at(9.16)} src="pop" volume={0.45} />
      <Sfx at={at(10.29)} src="ding" volume={0.35} />
      <Sfx at={at(11.27)} src="whoosh" volume={0.35} />
      <Sfx at={at(15.0)} src="pop" volume={0.45} />
      <Sfx at={at(17.4)} src="boom" volume={0.35} />
    </AbsoluteFill>
  );
};
