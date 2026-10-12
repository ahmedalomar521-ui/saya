// Logos on mention (R5 + R4): when an app or brand name is spoken, its logo
// pops in on that word. It goes in the caption's place (with its name under it)
// or beside the head with a neon glow. Several names in a row → LogoStack.
// Icons: `simple-icons` (import {siInstagram} from "simple-icons"), or any image.
import {Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import type {SimpleIcon} from "simple-icons";
import {clamp, neonGlow, SAYA} from "./tokens";

/** `src` + `color`: a white mark (PNG) drawn on a brand-colour tile. `src` alone: a full app icon. */
export type Logo = {icon?: SimpleIcon; src?: string; name?: string; color?: string};

/** Paths inside public/ ("footage/x.png") go through staticFile(); URLs pass as is. */
const resolveSrc = (src: string) => (/^(https?:|data:|blob:|\/)/.test(src) ? src : staticFile(src));

const brandColor = (l: Logo) => l.color ?? (l.icon ? `#${l.icon.hex}` : SAYA.color.neon);

/** The logo tile itself (squircle, brand colour, white mark). */
export const LogoTile: React.FC<{logo: Logo; size: number}> = ({logo, size}) => {
  const c = brandColor(logo);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.24,
        background: logo.src && !logo.color ? "transparent" : c,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        boxShadow: `0 10px 30px rgba(0,0,0,0.45), 0 0 0 2px rgba(255,255,255,0.12)`,
      }}
    >
      {logo.src ? (
        <Img src={resolveSrc(logo.src)} style={logo.color ? {width: size * 0.62, height: size * 0.62, objectFit: "contain"} : {width: size, height: size, objectFit: "cover"}} />
      ) : logo.icon ? (
        <svg viewBox="0 0 24 24" width={size * 0.58} height={size * 0.58}>
          <path d={logo.icon.path} fill="#fff" />
        </svg>
      ) : null}
    </div>
  );
};

const popIn = (frame: number, fps: number, duration: number) => {
  const p = spring({frame, fps, config: SAYA.spring.pop});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  return {scale: interpolate(p, [0, 1], [0.6, 1]) * interpolate(out, [0, 1], [0.85, 1]), opacity: Math.min(interpolate(frame, [0, 3], [0, 1], clamp), out)};
};

/** One logo. Use inside a <Sequence from={wordFrame} durationInFrames={…}>.
 *  place "caption": centred at caption height, with the name under it (it
 *  replaces the caption — add this range to SayaCaptions `hide`).
 *  place {x,y}: beside the head (R4), neon glow. */
export const LogoPop: React.FC<{logo: Logo; duration: number; place?: "caption" | {x: number; y: number}; size?: number; captionY?: number}> = ({
  logo,
  duration,
  place = "caption",
  size = 190,
  captionY = SAYA.caption.chestY,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {scale, opacity} = popIn(frame, fps, duration);
  const float = Math.sin(frame / 14) * 6;
  const atCaption = place === "caption";
  const x = atCaption ? 540 : place.x;
  const y = atCaption ? captionY - size * 0.35 : place.y;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y + float,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 14,
        filter: atCaption ? undefined : neonGlow(brandColor(logo), 0.6),
      }}
    >
      <LogoTile logo={logo} size={size} />
      {atCaption && logo.name ? (
        <div style={{fontFamily: SAYA.font, fontWeight: 900, fontSize: 60, color: SAYA.color.white, textShadow: `${SAYA.textShadow}, 0 0 20px ${SAYA.color.neon}`, whiteSpace: "nowrap"}}>
          {logo.name}
        </div>
      ) : null}
    </div>
  );
};

/** Several logos named in a row (R5): each pops at its own frame into a row at
 *  the top of the safe zone; `focus` brings one to the centre, big. Frames are
 *  relative to the enclosing Sequence. */
export const LogoStack: React.FC<{items: {logo: Logo; at: number}[]; duration: number; focus?: {index: number; at: number}; size?: number}> = ({
  items,
  duration,
  focus,
  size = 150,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = items.length;
  const gap = Math.min(220, (SAYA.safe.right - SAYA.safe.left - size) / Math.max(1, n - 1));
  const rowW = gap * (n - 1);
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  return (
    <>
      {items.map((it, i) => {
        if (frame < it.at) return null;
        const p = spring({frame: frame - it.at, fps, config: SAYA.spring.pop});
        const f = focus && focus.index === i ? spring({frame: frame - focus.at, fps, config: SAYA.spring.soft}) : 0;
        const dim = focus && focus.index !== i && frame >= focus.at ? interpolate(frame - focus.at, [0, 8], [1, 0.35], clamp) : 1;
        const x0 = 540 - rowW / 2 + i * gap;
        const y0 = SAYA.safe.top + 60 + size / 2;
        const x = interpolate(f, [0, 1], [x0, 540]);
        const y = interpolate(f, [0, 1], [y0, 820]);
        const s = interpolate(p, [0, 1], [0.5, 1]) * interpolate(f, [0, 1], [1, 2.1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${s})`,
              opacity: Math.min(p, out) * dim,
              filter: neonGlow(brandColor(it.logo), 0.45 + f * 0.4),
            }}
          >
            <LogoTile logo={it.logo} size={size} />
          </div>
        );
      })}
    </>
  );
};
