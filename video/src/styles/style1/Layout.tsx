// Layout primitives: graded talking head, 50/50 split screen, full-screen
// B-roll and the picture-in-picture "other video" card.
import {Video} from "@remotion/media";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {S1} from "./tokens";

/** Talking head, colour-graded like the reference. */
export const S1TalkingHead: React.FC<{
  src: string;
  trimBefore: number;
  /** "full" = whole frame, "bottom" = bottom half of a split screen */
  mode?: "full" | "bottom";
  /** vertical focus of the crop when in the bottom half (0 – 1) */
  focusY?: number;
  zoom?: number;
  /** push the shot down (px) to make headroom for titles; the gap is
   *  filled with a blurred copy of the same shot */
  offsetY?: number;
}> = ({src, trimBefore, mode = "full", focusY = 0.38, zoom = 1, offsetY = 0}) => {
  const bottom = mode === "bottom";
  const shift = bottom ? 0 : offsetY;
  return (
    <AbsoluteFill
      style={{
        top: bottom ? S1.layout.split : 0,
        height: bottom ? S1.layout.H - S1.layout.split : S1.layout.H,
        overflow: "hidden",
      }}
    >
      {offsetY > 0 ? (
        <Video
          src={src}
          trimBefore={trimBefore}
          muted
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: S1.layout.W,
            height: S1.layout.H,
            filter: `${S1.grade} blur(40px) brightness(0.7)`,
            transform: "scale(1.4)",
            transformOrigin: "50% 0%",
            opacity: shift > 0 ? 1 : 0,
          }}
        />
      ) : null}
      <Video
        src={src}
        trimBefore={trimBefore}
        style={{
          position: "absolute",
          left: 0,
          // explicit 1080×1920 element, cropped by the container (the media
          // canvas does not honour objectFit/objectPosition)
          top: bottom ? -(S1.layout.H - S1.layout.split) * focusY : 0,
          width: S1.layout.W,
          height: S1.layout.H,
          filter: S1.grade,
          transform: `translateY(${shift}px) scale(${zoom})`,
          transformOrigin: "50% 30%",
          ...(shift > 0
            ? {maskImage: "linear-gradient(to bottom, transparent 0px, black 220px)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, black 220px)"}
            : {}),
        }}
      />
      {/* soft vignette */}
      <AbsoluteFill
        style={{background: "radial-gradient(ellipse at 50% 40%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.35) 100%)"}}
      />
    </AbsoluteFill>
  );
};

/** Top half of a split screen — B-roll / graphics on a light "paper" stage. */
export const S1TopStage: React.FC<{
  children: React.ReactNode;
  background?: string;
  /** frames the stage is on screen (for the exit) */
  duration: number;
  /** slide down from the top (first beat of a split window); otherwise hard cut */
  slideIn?: boolean;
}> = ({children, background = S1.color.paper, slideIn}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = slideIn ? spring({frame, fps, config: {damping: 20, stiffness: 220}}) : 1;
  const exit = 0;
  return (
    <AbsoluteFill
      style={{
        height: S1.layout.split,
        overflow: "hidden",
        background,
        transform: `translateY(${(-(1 - enter) + -exit) * S1.layout.split}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Full-screen B-roll card that pushes in (used for screen recordings). */
export const S1FullBRoll: React.FC<{children: React.ReactNode; duration: number; background?: string}> = ({
  children,
  duration,
  background = S1.color.paper,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 20}});
  const exit = interpolate(frame, [duration - 6, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background,
        opacity: s * (1 - exit),
        transform: `scale(${interpolate(s, [0, 1], [1.08, 1])})`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Floating phone-shaped thumbnail of another video, top-right (end CTA). */
export const S1PiPCard: React.FC<{children: React.ReactNode; duration: number}> = ({children, duration}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 13}});
  const exit = interpolate(frame, [duration - 6, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        right: 150,
        width: 300,
        height: 533,
        borderRadius: 26,
        overflow: "hidden",
        border: "4px solid rgba(255,255,255,0.9)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
        transform: `translateY(${(1 - s) * -120}px) rotate(${(1 - s) * 6}deg)`,
        opacity: s * (1 - exit),
      }}
    >
      {children}
    </div>
  );
};
