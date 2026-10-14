// SplitStage — the split-screen layout (learned from the رواء الجلاد reference,
// 2026-10-14, re-skinned in Saya's palette): the subject (product shot, ad
// clip) in a glowing card on top, Saya in a second card below, over a blurred,
// darkened copy of her shot. The top card can change its media on cue (items)
// without the cards re-entering. Footage colour: HOUSE_GRADE only.
import {Video} from "@remotion/media";
import {AbsoluteFill, Img, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {clamp, SAYA} from "./tokens";

export type SplitItem = {
  /** Frame (relative to the stage start) where this media takes over. */
  at: number;
  src: string;
  isVideo?: boolean;
  /** Seconds into the clip to start from. */
  from?: number;
  /** "cover" fills the card; "contain" shows the whole image on `bg`. */
  fit?: "cover" | "contain";
  bg?: string;
  /** Focus point for "cover" (CSS object-position). */
  pos?: string;
};

export type SplitStageProps = {
  /** staticFile path of Saya's footage (the same file as the base layer). */
  footage: string;
  /** Global frame where the stage starts (to keep her card in sync). */
  start: number;
  duration: number;
  items: SplitItem[];
  /** Small badge on the top card (e.g. "1"), and a source pill (e.g. "Apple"). */
  tag?: string;
  source?: string;
  /** Face centre in source pixels, for framing her card. */
  face?: {x: number; y: number};
  /** Shape of Saya's card (user, 2026-10-14: pick the shape per video/beat):
   *  "rect" = the big rounded rectangle (default), "circle", "pill". */
  shape?: "rect" | "circle" | "pill";
};

const CARD = {x: 60, w: 960, topY: 290, topH: 560, botY: 880, botH: 540, r: 40};

const cardFrame = (p: number): React.CSSProperties => ({
  position: "absolute",
  overflow: "hidden",
  borderRadius: CARD.r,
  border: `4px solid ${SAYA.color.neon}`,
  boxShadow: `0 0 18px ${SAYA.color.neon}, 0 0 46px ${SAYA.color.neon}88, 0 18px 50px rgba(0,0,0,0.5)`,
  opacity: p,
});

export const SplitStage: React.FC<SplitStageProps> = ({footage, start, duration, items, tag, source, face = {x: 572, y: 660}, shape = "rect"}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inP = spring({frame, fps, config: SAYA.spring.rise});
  const outP = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  const p = Math.min(inP, outP);

  const src = staticFile(footage);
  // her card: scale 1.12, face at 42% of the card height
  const k = 1.12;
  const bx = CARD.w / 2 - face.x * k;
  const by = CARD.botH * 0.42 - face.y * k;

  const sayaBox: React.CSSProperties =
    shape === "circle"
      ? {left: 540 - 270, top: CARD.botY, width: 540, height: 540, borderRadius: 270}
      : shape === "pill"
        ? {left: 540 - 380, top: CARD.botY, width: 760, height: CARD.botH, borderRadius: 270}
        : {left: CARD.x, top: CARD.botY, width: CARD.w, height: CARD.botH};

  // current top media + crossfade from the previous one
  const sorted = [...items].sort((a, b) => a.at - b.at);
  let idx = 0;
  for (let i = 0; i < sorted.length; i++) if (sorted[i].at <= frame) idx = i;

  const media = (it: SplitItem, i: number) => {
    const local = frame - it.at;
    const op = i === idx ? interpolate(local, [0, 6], [i === 0 ? 1 : 0, 1], clamp) : i === idx - 1 ? 1 : 0;
    if (op <= 0) return null;
    const fit = it.fit ?? "cover";
    const style: React.CSSProperties = {position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: fit, objectPosition: it.pos ?? "50% 50%", opacity: op, background: it.bg ?? (fit === "contain" ? "#F5F5F7" : "#000")};
    // slow push on stills so the card never feels frozen
    const push = it.isVideo ? 1 : interpolate(local, [0, 120], [1.0, 1.06], clamp);
    // a clip plays from `from` at the moment it appears (its own Sequence clock)
    return it.isVideo ? (
      <Sequence key={i} from={it.at} layout="none">
        <Video src={staticFile(it.src)} muted trimBefore={Math.round((it.from ?? 0) * fps)} objectFit={fit} style={style} />
      </Sequence>
    ) : (
      <Img key={i} src={staticFile(it.src)} style={{...style, transform: `scale(${push})`}} />
    );
  };

  return (
    <AbsoluteFill>
      {/* backdrop: her shot, blurred and darkened */}
      <AbsoluteFill style={{opacity: p, overflow: "hidden"}}>
        <Video src={src} muted trimBefore={start} objectFit="cover" style={{position: "absolute", width: 1080, height: 1920, filter: `${SAYA.grade} blur(28px)`, transform: "scale(1.15)"}} />
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,27,63,0.70), rgba(11,27,63,0.55) 50%, rgba(11,27,63,0.75))"}} />
      </AbsoluteFill>

      {/* top card: the subject */}
      <div style={{...cardFrame(p), left: CARD.x, top: CARD.topY, width: CARD.w, height: CARD.topH, transform: `translateY(${(1 - inP) * -60}px)`}}>
        {sorted.map(media)}
        {tag ? (
          <div style={{position: "absolute", left: 22, top: 18, width: 74, height: 74, borderRadius: 37, background: SAYA.color.neon, color: "#fff", fontFamily: SAYA.font, fontWeight: 900, fontSize: 46, lineHeight: "70px", textAlign: "center", boxShadow: `0 0 20px ${SAYA.color.neon}`}}>
            {tag}
          </div>
        ) : null}
        {source ? (
          <div style={{position: "absolute", right: 20, bottom: 16, padding: "4px 16px", borderRadius: 99, background: "rgba(11,27,63,0.7)", color: "#D6E2F5", fontFamily: SAYA.font, fontWeight: 700, fontSize: 24}}>
            {source}
          </div>
        ) : null}
      </div>

      {/* bottom card: Saya, in sync with the base layer */}
      <div style={{...cardFrame(p), ...sayaBox, transform: `translateY(${(1 - inP) * 60}px)`}}>
        <div style={{position: "absolute", left: bx - (sayaBox.left as number) + CARD.x, top: by + (shape === "rect" ? 0 : CARD.botH * 0.08), width: 1080 * k, height: 1920 * k}}>
          <Video src={src} muted trimBefore={start} objectFit="cover" style={{width: "100%", height: "100%", filter: SAYA.grade}} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
