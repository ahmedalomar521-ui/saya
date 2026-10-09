import {Audio, Video} from "@remotion/media";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  Series,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {Captions} from "./Captions";
import {cue, SEGMENTS, TAIL_FRAMES, TOTAL_FRAMES} from "./edit";
import {
  AlertFlash,
  Breadcrumb,
  FollowCTA,
  HookBanner,
  KeyHouse,
  PhoneSettings,
  RecFrame,
  ShareCTA,
  ToAI,
  TogglesOn,
} from "./Overlays";

const FOOTAGE = staticFile("footage/full.mp4");

// Alternating punch-in levels give each jump cut a visible "cut".
const ZOOMS = [1.0, 1.14, 1.04, 1.2, 1.08, 1.16];

const Clip: React.FC<{index: number; duration: number; isLast: boolean}> = ({index, duration, isLast}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const base = ZOOMS[index % ZOOMS.length];
  // the very first shot slams in from a tight crop
  const hook = index === 0 ? interpolate(spring({frame, fps, config: {damping: 14}}), [0, 1], [0.35, 0]) : 0;
  const drift = interpolate(frame, [0, duration], [0, 0.025]);
  const scale = base + hook + drift;
  const speechEnd = duration - (isLast ? TAIL_FRAMES : 0);
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: "50% 32%"}}>
      <Video
        src={FOOTAGE}
        trimBefore={SEGMENTS[index].srcStart}
        volume={(f) => (isLast ? interpolate(f, [speechEnd - 2, speechEnd + 2], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}) : 1)}
        style={{width: "100%", height: "100%", objectFit: "cover"}}
      />
    </AbsoluteFill>
  );
};

const Dim: React.FC<{duration: number}> = ({duration}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 8, duration - 8, duration], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        backdropFilter: `blur(${16 * o}px)`,
        background: `rgba(0,0,0,${0.45 * o})`,
      }}
    />
  );
};

const FadeOut: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: "#000", opacity: interpolate(frame, [0, TAIL_FRAMES], [0, 1])}} />;
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at, src, volume = 1}) => (
  <Sequence from={at} durationInFrames={30} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const span = (a: number, b: number) => ({from: cue(a), durationInFrames: Math.max(1, cue(b) - cue(a))});

export const Reel: React.FC = () => {
  const phone = span(24.33, 33.15);
  const toAI = span(18.13, 21.1);
  const key = span(37.97, 41.0);
  const follow = {from: cue(44.93), durationInFrames: TOTAL_FRAMES - cue(44.93)};
  const crumb = span(25.66, 33.15);

  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* ---- Footage with jump cuts ---- */}
      <Series>
        {SEGMENTS.map((s, i) => {
          const isLast = i === SEGMENTS.length - 1;
          const d = s.duration + (isLast ? TAIL_FRAMES : 0);
          return (
            <Series.Sequence key={i} durationInFrames={d} name={`Clip ${i + 1}`}>
              <Clip index={i} duration={d} isLast={isLast} />
            </Series.Sequence>
          );
        })}
      </Series>

      {/* ---- Graphics ---- */}
      <Sequence name="Hook banner" {...span(0.42, 3.45)}>
        <HookBanner duration={cue(3.45) - cue(0.42)} />
      </Sequence>
      <Sequence name="Flash 1" from={cue(3.83)} durationInFrames={20}>
        <AlertFlash />
      </Sequence>
      <Sequence name="Toggles on" {...span(5.93, 7.66)}>
        <TogglesOn duration={cue(7.66) - cue(5.93)} />
      </Sequence>
      <Sequence name="Content to AI" {...toAI}>
        <ToAI duration={toAI.durationInFrames} aiAt={cue(19.9) - toAI.from} />
      </Sequence>
      <Sequence name="Flash 2" from={cue(21.53)} durationInFrames={20}>
        <AlertFlash />
      </Sequence>

      <Sequence name="Dim behind phone" {...phone}>
        <Dim duration={phone.durationInFrames} />
      </Sequence>
      <Sequence name="Phone settings" {...phone}>
        <PhoneSettings
          duration={phone.durationInFrames}
          tapAt={cue(28.0) - phone.from}
          screen2At={cue(28.85) - phone.from}
          off1At={cue(31.85) - phone.from}
          off2At={cue(32.25) - phone.from}
        />
      </Sequence>
      <Sequence name="Breadcrumb" {...crumb}>
        <Breadcrumb
          duration={crumb.durationInFrames}
          step2At={cue(28.0) - crumb.from}
          step3At={cue(31.81) - crumb.from}
        />
      </Sequence>

      <Sequence name="Screen recording" {...span(34.0, 35.9)}>
        <RecFrame duration={cue(35.9) - cue(34.0)} />
      </Sequence>
      <Sequence name="Key and house" {...key}>
        <KeyHouse duration={key.durationInFrames} openAt={cue(39.1) - key.from} />
      </Sequence>
      <Sequence name="Share CTA" {...span(41.28, 44.6)}>
        <ShareCTA duration={cue(44.6) - cue(41.28)} />
      </Sequence>
      <Sequence name="Follow CTA" {...follow}>
        <FollowCTA duration={follow.durationInFrames} clickAt={cue(46.1) - follow.from} />
      </Sequence>

      {/* ---- Captions ---- */}
      <Captions bottom={330} />

      <Sequence name="Fade out" from={TOTAL_FRAMES - TAIL_FRAMES}>
        <FadeOut />
      </Sequence>

      {/* ---- Sound design ---- */}
      <Sfx at={cue(0.42)} src="boom" volume={0.6} />
      <Sfx at={cue(0.5)} src="whoosh" volume={0.5} />
      <Sfx at={cue(3.83)} src="ding" volume={0.45} />
      <Sfx at={cue(5.93)} src="click" volume={0.5} />
      <Sfx at={cue(6.1)} src="click" volume={0.5} />
      <Sfx at={cue(18.13)} src="whoosh" volume={0.45} />
      <Sfx at={cue(19.9)} src="pop" volume={0.6} />
      <Sfx at={cue(21.53)} src="ding" volume={0.45} />
      <Sfx at={cue(24.33)} src="whoosh" volume={0.55} />
      <Sfx at={cue(28.0)} src="click" volume={0.7} />
      <Sfx at={cue(28.85)} src="whoosh" volume={0.3} />
      <Sfx at={cue(31.85)} src="click" volume={0.8} />
      <Sfx at={cue(32.25)} src="click" volume={0.8} />
      <Sfx at={cue(32.45)} src="ding" volume={0.35} />
      <Sfx at={cue(33.0)} src="whoosh" volume={0.45} />
      <Sfx at={cue(34.0)} src="pop" volume={0.5} />
      <Sfx at={cue(37.97)} src="whoosh" volume={0.45} />
      <Sfx at={cue(39.1)} src="pop" volume={0.6} />
      <Sfx at={cue(41.28)} src="whoosh" volume={0.45} />
      <Sfx at={cue(44.93)} src="pop" volume={0.5} />
      <Sfx at={cue(46.1)} src="click" volume={0.8} />
    </AbsoluteFill>
  );
};
