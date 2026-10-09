// "أهلاً أنا سايا" — the same intro, edited in ستايل 3 (minimal one-word captions).
import {Audio, Video} from "@remotion/media";
import {AbsoluteFill, interpolate, Sequence, Series, staticFile, useCurrentFrame} from "remotion";
import {makeTimeline} from "../styles/style1/timeline";
import {S3} from "../styles/style3/tokens";
import {buildBeats, S3Captions, S3Flash} from "../styles/style3/WordCaptions";
import {houseVignette} from "../styles/shared/house";

export const SAYA3_FPS = 30;
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
  SAYA3_FPS,
);
export const SAYA3_FRAMES = T.total;
const at = T.at;

// Markup: {stack}  {stack}o white ellipse  {stack}O red ellipse  {stack}u underline
//         ~script accent~  _script white_  !bold caps!  ^red^
const BEATS = buildBeats(
  [
    {s: 0.13, e: 1.34, t: "أهلاً أنا"},
    {s: 1.64, e: 2.3, t: "{_سايا_}u"},
    {s: 2.3, e: 3.33, t: "صح أنا {شخصية ~افتراضية~}"},
    {s: 3.4, e: 4.45, t: "{بالذكاء !الاصطناعي!}o"},
    {s: 4.94, e: 5.97, t: "بس خلّينا من ^هالحكي^"},
    {s: 6.35, e: 8.2, t: "لأنه هون رح نكتشف سوا {~أدوات~}u"},
    {s: 8.33, e: 9.94, t: "تقنية {و ~برومبتات~}"},
    {s: 10.29, e: 11.17, t: "{وحيلة !بسيطة!}o"},
    {s: 11.27, e: 13.1, t: "ممكن توفّر {~وقتكم~}u وتسهّل عليكم"},
    {s: 13.2, e: 13.89, t: "أشياء كتير"},
    {s: 14.37, e: 16.31, t: "فإذا بتحبّوا التقنية {من دون !تعقيد!}O"},
    {s: 16.52, e: 17.2, t: "أهلاً فيكم"},
    {s: 17.45, e: 18.02, t: "{~ويلا~ !نبدأ!}"},
  ].map((p) => ({start: at(p.s), end: at(p.e), text: p.t})),
);

// Framing per kept clip — calm, with a punch-in at each new section.
const ZOOM = [1.0, 1.06, 1.18, 1.0, 1.0, 1.12, 1.04];
// Section changes get a quick white flash.
const FLASH_AT = [4.94, 10.29, 14.37];

const Clip: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const seg = T.segments[i];
  const drift = interpolate(frame, [0, seg.duration], [0, 0.015]);
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <Video
        src={SRC}
        trimBefore={seg.srcStart}
        style={{position: "absolute", width: 1080, height: 1920, filter: S3.grade, transform: `scale(${ZOOM[i] + drift})`, transformOrigin: "50% 28%"}}
      />
      <AbsoluteFill style={{background: houseVignette()}} />
    </AbsoluteFill>
  );
};

const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at: f, src, volume = 1}) => (
  <Sequence from={f} durationInFrames={30} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

export const SayaIntroStyle3: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Series>
        {T.segments.map((seg, i) => (
          <Series.Sequence key={i} name={`Clip ${i + 1}`} durationInFrames={seg.duration}>
            <Clip i={i} />
          </Series.Sequence>
        ))}
      </Series>

      {FLASH_AT.map((t) => (
        <Sequence key={t} name={`Flash ${t}`} from={at(t)} durationInFrames={8}>
          <S3Flash />
        </Sequence>
      ))}

      <S3Captions beats={BEATS} y={930} />

      {/* minimal sound design: a soft whoosh on section flashes only */}
      {FLASH_AT.map((t) => (
        <Sfx key={t} at={at(t)} src="whoosh" volume={0.3} />
      ))}
    </AbsoluteFill>
  );
};
