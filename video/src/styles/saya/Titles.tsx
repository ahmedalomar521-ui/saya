// Title-type pieces (ported from ستايل 1/3/4, re-skinned for Saya):
// - SayaHookTitle: small line + one big skewed word revealed word by word.
//   Sits above the head; it does not hide the captions.
// - SectionNumber: huge "أولاً / ثانياً" marker at the top.
// - SayaFlash: quick white flash for a real section change (3–4 per minute at
//   most; pair it with a punch-in zoom).
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {SayaSquiggle} from "./Doodles";
import {clamp, neonGlow, SAYA} from "./tokens";

const isAr = (s: string) => /[؀-ۿ]/.test(s);

/** Hook / key-phrase title. `big` can be one word or a few; Arabic is revealed
 *  word by word so the letters stay joined. `y` is the centre of the big word:
 *  keep it above her head (measure the headroom per clip; push the footage
 *  down with `face` if the shot is tight). It never covers the face. */
export const SayaHookTitle: React.FC<{small?: string; big: string; duration: number; y?: number; squiggle?: boolean}> = ({small, big, duration, y = 400, squiggle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ar = isAr(big);
  const words = ar ? big.split(" ") : Array.from(big);
  const smallIn = spring({frame, fps, config: {damping: 14, stiffness: 200}});
  const exit = interpolate(frame, [duration - 7, duration], [0, 1], clamp);
  const start = small ? 4 : 0;
  const per = ar ? 3 : 1.4;
  return (
    <AbsoluteFill style={{alignItems: "center"}}>
      <div style={{position: "absolute", top: y - 150, display: "flex", flexDirection: "column", alignItems: "center", opacity: 1 - exit, transform: `translateX(${exit * (ar ? 120 : -120)}px)`}}>
        {small ? (
          <div style={{fontFamily: SAYA.font, fontWeight: 700, fontSize: 52, color: SAYA.color.sky, opacity: smallIn, transform: `translateY(${(1 - smallIn) * 20}px)`, textShadow: SAYA.textShadow, direction: ar ? "rtl" : "ltr"}}>{small}</div>
        ) : null}
        <div style={{fontFamily: SAYA.font, fontWeight: 900, fontSize: ar ? 150 : 110, lineHeight: 1.15, color: SAYA.color.white, transform: "skewX(-8deg)", whiteSpace: "nowrap", direction: ar ? "rtl" : "ltr", filter: neonGlow(SAYA.color.neon, 0.7), textShadow: SAYA.textShadow}}>
          {words.map((w, i) => {
            const t = frame - start - i * per;
            const pop = spring({frame: t, fps, config: {damping: 10, stiffness: 320, mass: 0.5}});
            return (
              <span key={i} style={{display: "inline-block", opacity: t >= 0 ? 1 : 0, transform: `translateY(${(1 - pop) * 18}px)`, whiteSpace: "pre"}}>
                {w}
                {ar && i < words.length - 1 ? " " : ""}
              </span>
            );
          })}
        </div>
        {squiggle ? <SayaSquiggle delay={start + words.length * per} w={460} style={{marginTop: -14}} /> : null}
      </div>
    </AbsoluteFill>
  );
};

/** Huge section marker at the top, e.g. "أولاً". Keep it inside the safe zone. */
export const SectionNumber: React.FC<{text: string; duration: number; y?: number}> = ({text, duration, y = 300}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12, stiffness: 200}});
  const out = interpolate(frame, [duration - 6, duration], [1, 0], clamp);
  return (
    <AbsoluteFill style={{alignItems: "center"}}>
      <div style={{position: "absolute", top: y, fontFamily: SAYA.font, fontWeight: 900, fontSize: 210, color: SAYA.color.white, lineHeight: 1, textShadow: `0 0 30px ${SAYA.color.neon}88, ${SAYA.textShadow}`, transform: `scale(${interpolate(s, [0, 1], [1.4, 1])})`, opacity: Math.min(1, s * 1.5) * out, filter: `blur(${(1 - s) * 8}px)`}}>
        {text}
      </div>
    </AbsoluteFill>
  );
};

/** Quick white flash (about 7 frames). Declared as a flash for the checks. */
export const SayaFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 2, 7], [0.85, 0.6, 0], {extrapolateRight: "clamp"});
  return <div style={{position: "absolute", inset: 0, background: "#fff", opacity: o, mixBlendMode: "screen"}} />;
};
