// "أهلاً أنا سايا" — channel intro, edited in ستايل 1.
import {Audio, Video} from "@remotion/media";
import {AbsoluteFill, Sequence, Series, staticFile, useCurrentFrame} from "remotion";
import {makeTimeline} from "../styles/style1/timeline";
import {S1} from "../styles/style1/tokens";
import {S1Title} from "../styles/style1/Titles";
import {S1Captions, chunkPhrases} from "../styles/style1/Captions";
import {S1TalkingHead, S1TopStage} from "../styles/style1/Layout";
import {
  AIAvatarCard,
  GlitchIn,
  KineticWord,
  ProgressCard,
  PromptBox,
  ToolGrid,
} from "../styles/style1/Graphics";
import {Burst, CurlyArrow, ScribbleOut} from "../styles/style1/Doodles";

export const SAYA_FPS = 30;
const SRC = staticFile("footage/saya-intro.mp4");

// Speech ranges (source seconds) from silence detection; pauses are cut.
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
  SAYA_FPS,
);
export const SAYA_FRAMES = T.total;

// Phrase timings from the provided SRT (snapped to the detected pauses).
const PHRASES = [
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
  {s: 17.45, e: 18.02, t: "ويلا نبدأ"},
];
const CHUNKS = chunkPhrases(PHRASES.map((p) => ({start: T.at(p.s), end: T.at(p.e), text: p.t})));

// Split-screen windows (source seconds). Everything else is full-frame.
const SPLITS: [number, number][] = [
  [2.55, 4.7],
  [6.35, 14.0],
];
const splitSpans = SPLITS.map(([a, b]) => T.span(a, b));
const isSplit = (f: number) => splitSpans.some((s) => f >= s.from && f < s.from + s.durationInFrames);

const OFFSET = 260; // headroom above her head for titles
const TITLE_Y = 500;

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={at} durationInFrames={30} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const Title: React.FC<{a: number; b: number} & Omit<React.ComponentProps<typeof S1Title>, "duration">> = ({
  a,
  b,
  ...rest
}) => {
  const sp = T.span(a, b);
  return (
    <Sequence name={`Title ${rest.big}`} {...sp}>
      <S1Title duration={sp.durationInFrames} y={TITLE_Y} {...rest} />
    </Sequence>
  );
};

const Stage: React.FC<{a: number; b: number; name: string; children: React.ReactNode; bg?: string; slideIn?: boolean}> = ({
  a,
  b,
  name,
  children,
  bg,
  slideIn,
}) => {
  const sp = T.span(a, b);
  return (
    <Sequence name={name} {...sp}>
      <S1TopStage duration={sp.durationInFrames} background={bg} slideIn={slideIn}>
        {children}
      </S1TopStage>
    </Sequence>
  );
};

export const SayaIntro: React.FC = () => {
  const at = T.at;
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* ---- footage: each kept range is its own clip; layout switches between
              full-frame (with headroom) and the bottom half of a split ---- */}
      <Series>
        {T.segments.map((seg, i) => (
          <Series.Sequence key={i} name={`Clip ${i + 1}`} durationInFrames={seg.duration}>
            <ClipLayout srcStart={seg.srcStart} outStart={seg.outStart} />
          </Series.Sequence>
        ))}
      </Series>

      {/* ---- titles (above the head) ---- */}
      <Title a={0.13} b={1.4} big="أهلاً" />
      <Sequence name="Hello burst" from={at(0.3)} durationInFrames={at(1.4) - at(0.3)}>
        <AbsoluteFill>
          <Burst style={{position: "absolute", top: 150, left: 250}} />
        </AbsoluteFill>
      </Sequence>
      <Title a={1.64} b={2.55} small="أنا اسمي" big="سايا" squiggle />
      <Title a={4.94} b={5.97} small="بس خلّينا من" big="هالحكي" />
      <Sequence name="Scribble" from={at(5.3)} durationInFrames={at(5.97) - at(5.3)}>
        <AbsoluteFill style={{alignItems: "center"}}>
          <ScribbleOut style={{position: "absolute", top: 400}} w={460} />
        </AbsoluteFill>
      </Sequence>
      <Title a={14.37} b={16.4} small="التقنية" big="بدون تعقيد" squiggle />
      <Title a={16.52} b={17.4} big="أهلاً فيكم" />
      <Title a={17.4} b={18.02} big="يلا نبدأ" />
      <Sequence name="Arrow + burst" from={at(17.45)} durationInFrames={T.total - at(17.45)}>
        <AbsoluteFill>
          <Burst style={{position: "absolute", top: 150, left: 170}} />
          <Burst style={{position: "absolute", top: 150, right: 170, transform: "scaleX(-1)"}} />
          <CurlyArrow size={140} color={S1.color.white} style={{position: "absolute", top: 420, right: 70}} />
        </AbsoluteFill>
      </Sequence>

      {/* ---- split-screen top stage: one graphic beat every ~1–2 s ---- */}
      {splitSpans.map((sp, i) => (
        <Sequence key={i} name={`Split paper ${i + 1}`} {...sp}>
          <AbsoluteFill style={{height: S1.layout.split, background: S1.color.paper}} />
        </Sequence>
      ))}
      <Stage a={2.55} b={4.7} name="AI avatar card" slideIn>
        <AIAvatarCard label="شخصية افتراضية بالذكاء الاصطناعي">
          <Video
            src={SRC}
            trimBefore={Math.round(2.55 * SAYA_FPS)}
            muted
            style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 15%"}}
          />
        </AIAvatarCard>
      </Stage>
      <Stage a={6.35} b={8.4} name="Tools" slideIn>
        <GlitchIn>
          <div style={{width: 1080, height: 960}}>
            <ToolGrid
              tools={[
                {label: "ذكاء اصطناعي", color: S1.color.lime, glyph: "🤖"},
                {label: "كتابة", color: S1.color.purple, glyph: "✍️"},
                {label: "فيديو", color: "#FFB4A2", glyph: "🎬"},
                {label: "تصميم", color: "#A8E6FF", glyph: "🎨"},
                {label: "أتمتة", color: "#FFE58A", glyph: "⚡"},
                {label: "أفكار", color: "#C9F7C2", glyph: "💡"},
              ]}
            />
          </div>
        </GlitchIn>
      </Stage>
      <Stage a={8.4} b={10.1} name="Prompt">
        <PromptBox text="اكتبلي سكريبت ريلز عن…" sendAt={at(9.75) - at(8.4)} />
      </Stage>
      <Stage a={10.29} b={11.22} name="Kinetic word" bg={S1.color.lime}>
        <KineticWord text="حيلة بسيطة" duration={at(11.22) - at(10.29)} />
      </Stage>
      <Stage a={11.22} b={14.0} name="Progress">
        <ProgressCard frames={at(13.1) - at(11.22) - 4} />
      </Stage>

      {/* ---- captions ---- */}
      <S1Captions chunks={CHUNKS} isSplit={isSplit} boxed />

      {/* ---- sound design ---- */}
      <Sfx at={at(0.13)} src="pop" volume={0.6} />
      <Sfx at={at(1.64)} src="pop" volume={0.5} />
      <Sfx at={at(2.55)} src="whoosh" volume={0.5} />
      <Sfx at={at(4.7) - 4} src="whoosh" volume={0.35} />
      <Sfx at={at(5.3)} src="click" volume={0.6} />
      <Sfx at={at(6.35)} src="whoosh" volume={0.5} />
      <Sfx at={at(9.75)} src="click" volume={0.8} />
      <Sfx at={at(10.29)} src="boom" volume={0.4} />
      <Sfx at={at(13.1)} src="ding" volume={0.4} />
      <Sfx at={at(14.0) - 4} src="whoosh" volume={0.35} />
      <Sfx at={at(14.37)} src="pop" volume={0.5} />
      <Sfx at={at(17.45)} src="ding" volume={0.45} />
    </AbsoluteFill>
  );
};

/** Chooses full-frame vs bottom-half per frame, so a clip can change layout
 *  mid-way when a split-screen window starts or ends. */
const ClipLayout: React.FC<{srcStart: number; outStart: number}> = ({srcStart, outStart}) => {
  return (
    <SplitAware outStart={outStart}>
      {(split) => (
        <S1TalkingHead
          src={SRC}
          trimBefore={srcStart}
          mode={split ? "bottom" : "full"}
          focusY={0.19}
          offsetY={OFFSET}
        />
      )}
    </SplitAware>
  );
};

const SplitAware: React.FC<{outStart: number; children: (split: boolean) => React.ReactNode}> = ({
  outStart,
  children,
}) => {
  const frame = useCurrentFrame();
  return <>{children(isSplit(outStart + frame))}</>;
};
