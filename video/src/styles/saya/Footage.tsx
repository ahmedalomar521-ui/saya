// SayaFootage — the talking head with all of Saya's camera moves (R5 base):
// punch-in/out on cuts, slow and fast zooms, background blur under graphics,
// whip blur, and the PiP bubble (R4): the sharp shot shrinks into a glowing
// circle in the top corner while a blurred copy stays behind.
// Colour: HOUSE_GRADE only (house rule 1).
import {Video} from "@remotion/media";
import {AbsoluteFill, Img, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {houseVignette} from "../shared/house";
import type {Range} from "./Captions";
import {clamp, SAYA} from "./tokens";

/** Zoom keyframe: from `at`, scale goes to `scale` — instantly ("cut", a
 *  punch-in on a jump cut), over `dur` frames ("slow"), or fast ("fast", 7f). */
export type Zoom = {at: number; scale: number; mode?: "cut" | "slow" | "fast"; dur?: number};

export const zoomAt = (frame: number, zooms: Zoom[]) => {
  let s = 1;
  for (const z of [...zooms].sort((a, b) => a.at - b.at)) {
    if (frame < z.at) break;
    const mode = z.mode ?? "cut";
    if (mode === "cut") s = z.scale;
    else {
      const dur = z.dur ?? (mode === "fast" ? 7 : 60);
      const ease = mode === "fast" ? Easing.out(Easing.cubic) : Easing.inOut(Easing.sin);
      s = interpolate(frame, [z.at, z.at + dur], [s, z.scale], {...clamp, easing: ease});
    }
  }
  return s;
};

/** 0→1→0 envelope for a set of ranges, with `ramp` frames in and out. */
export const rangeAmount = (frame: number, ranges: Range[], ramp = 7) =>
  Math.max(0, ...ranges.map(([a, b]) => interpolate(frame, [a - ramp, a, b, b + ramp], [0, 1, 1, 0], clamp)));

export type PipPlace = {x: number; y: number; d: number};
const PIP_DEFAULT: PipPlace = {x: 90, y: 300, d: 230};

export const SayaFootage: React.FC<{
  /** staticFile() of the video, or of an image for stills checks. */
  src: string;
  isImage?: boolean;
  trimBefore?: number;
  zooms?: Zoom[];
  /** Face centre in source pixels (1080×1920): zoom origin and PiP framing. */
  face?: {x: number; y: number; w: number};
  blur?: Range[];
  pip?: Range[];
  pipPlace?: PipPlace;
  /** Frames where a whip happens (directional blur ±4 frames). */
  whips?: number[];
}> = ({src, isImage, trimBefore, zooms = [], face = {x: 540, y: 620, w: 430}, blur = [], pip = [], pipPlace = PIP_DEFAULT, whips = []}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const zoom = zoomAt(frame, zooms);

  // PiP progress (spring in, spring out)
  let pipP = 0;
  for (const [a, b] of pip) {
    if (frame >= a - 1 && frame < b + 20) {
      const inP = spring({frame: frame - a, fps, config: SAYA.spring.rise});
      const outP = spring({frame: frame - b, fps, config: SAYA.spring.soft});
      pipP = Math.max(pipP, frame < b ? inP : 1 - outP);
    }
  }
  const blurA = Math.max(rangeAmount(frame, blur), pipP);

  // whip: strong horizontal blur + shift around each whip frame
  const whip = Math.max(0, ...whips.map((w) => interpolate(Math.abs(frame - w), [0, 4], [1, 0], clamp)));

  const media = (style: React.CSSProperties, muted: boolean) =>
    isImage ? (
      <Img src={src} style={{position: "absolute", width: 1080, height: 1920, objectFit: "cover", ...style}} />
    ) : (
      <Video src={src} trimBefore={trimBefore} muted={muted} objectFit="cover" style={{position: "absolute", width: 1080, height: 1920, ...style}} />
    );

  const origin = `${(face.x / 1080) * 100}% ${(face.y / 1920) * 100}%`;

  // sharp layer geometry: full frame → circle at pipPlace
  const d = pipPlace.d;
  const cw = interpolate(pipP, [0, 1], [1080, d]);
  const ch = interpolate(pipP, [0, 1], [1920, d]);
  const cx = interpolate(pipP, [0, 1], [0, pipPlace.x]);
  const cy = interpolate(pipP, [0, 1], [0, pipPlace.y]);
  const k = interpolate(pipP, [0, 1], [1, (d * 0.92) / face.w]);
  const offX = interpolate(pipP, [0, 1], [0, cw / 2 - face.x * k]);
  const offY = interpolate(pipP, [0, 1], [0, ch / 2 - face.y * k]);

  return (
    <AbsoluteFill style={{background: "#000", overflow: "hidden"}}>
      {/* blurred backdrop (under graphics and behind the PiP) */}
      {blurA > 0 ? (
        <AbsoluteFill style={{opacity: blurA}}>
          {media({filter: `${SAYA.grade} blur(${SAYA.blurPx * blurA}px)`, transform: `scale(${zoom * 1.06})`, transformOrigin: origin}, true)}
        </AbsoluteFill>
      ) : null}
      {/* sharp shot / PiP bubble */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          width: cw,
          height: ch,
          overflow: "hidden",
          borderRadius: interpolate(pipP, [0, 1], [0, d / 2]),
          opacity: pipP > 0 ? 1 : 1 - blurA,
          boxShadow: pipP > 0.05 ? `0 0 0 ${5 * pipP}px ${SAYA.color.neon}, 0 0 ${34 * pipP}px ${SAYA.color.neon}, 0 0 ${70 * pipP}px ${SAYA.color.neon}88` : undefined,
        }}
      >
        <div style={{position: "absolute", left: offX, top: offY, width: 1080 * k, height: 1920 * k}}>
          <div style={{width: 1080, height: 1920, transform: `scale(${k})`, transformOrigin: "0 0"}}>
            <div
              style={{
                width: 1080,
                height: 1920,
                transform: `scale(${zoom * (1 + 0.04 * whip)}) translateX(${whip * 40}px)`,
                transformOrigin: origin,
                filter: whip > 0 ? `blur(${whip * 14}px)` : undefined,
              }}
            >
              {media({filter: SAYA.grade}, false)}
            </div>
          </div>
        </div>
      </div>
      <AbsoluteFill style={{background: houseVignette(), pointerEvents: "none"}} />
    </AbsoluteFill>
  );
};
