// The signature two-tier title: a small handwritten line on top and a huge
// yellow display word that types on letter by letter.
// Used for the hook ("HOW TO CREATE / ANIMATIONS"), greetings ("HEY!") and
// the CTAs ("THIS VIDEO / SAVE", "COMMENT / WEBSITE", "WEBSITES / MORE").
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {S1} from "./tokens";
import {Squiggle} from "./Doodles";

export type TitleProps = {
  /** small handwritten line (optional) */
  small?: string;
  /** big yellow word(s) */
  big: string;
  /** frames the title stays on screen (for the exit) */
  duration: number;
  /** vertical centre of the big word */
  y?: number;
  /** frames per revealed letter of the big word */
  perLetter?: number;
  squiggle?: boolean;
  /** extra element drawn above the small line (icon doodle) */
  icon?: React.ReactNode;
  align?: "center" | "left" | "right";
};

const splitGraphemes = (s: string) => {
  // Arabic letters must stay joined, so reveal by word for Arabic and by
  // letter for Latin.
  return /[؀-ۿ]/.test(s) ? s.split(/(\s+)/) : Array.from(s);
};

export const S1Title: React.FC<TitleProps> = ({
  small,
  big,
  duration,
  y = S1.layout.titleY,
  perLetter = 1.4,
  squiggle,
  icon,
  align = "center",
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pieces = splitGraphemes(big);
  const smallIn = spring({frame, fps, config: {damping: 14, stiffness: 200}});
  const bigStart = small ? 4 : 0;
  // exit: the big word wipes out sideways while the small line fades
  const exit = interpolate(frame, [duration - 7, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isArabic = /[؀-ۿ]/.test(big);

  return (
    <AbsoluteFill
      style={{
        alignItems: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        padding: "0 70px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: y - S1.size.display * 0.9 - (small ? S1.size.hand * 1.3 : 0) - (icon ? 130 : 0),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: 1 - exit,
          transform: `translateX(${exit * (isArabic ? 120 : -120)}px)`,
        }}
      >
        {icon ? <div style={{marginBottom: 6}}>{icon}</div> : null}
        {small ? (
          <div
            style={{
              fontFamily: S1.font.hand,
              fontSize: S1.size.hand,
              color: S1.color.white,
              lineHeight: 1.1,
              transform: `translateY(${(1 - smallIn) * 20}px) rotate(-2deg)`,
              opacity: smallIn,
              textShadow: "0 3px 14px rgba(0,0,0,0.45)",
              direction: isArabic ? "rtl" : "ltr",
            }}
          >
            {small}
          </div>
        ) : null}
        <div
          style={{
            fontFamily: isArabic ? "S1DisplayAr, S1DisplayLat, sans-serif" : S1.font.display,
            fontSize: isArabic ? S1.size.display * 1.15 : S1.size.display * 0.72,
            color: S1.color.yellow,
            lineHeight: isArabic ? 1.15 : 1.05,
            letterSpacing: isArabic ? 0 : -2,
            transform: "skewX(-9deg)",
            whiteSpace: "nowrap",
            direction: isArabic ? "rtl" : "ltr",
            textShadow: "0 6px 24px rgba(0,0,0,0.35)",
          }}
        >
          {pieces.map((ch, i) => {
            const t = frame - bigStart - i * perLetter;
            const o = t >= 0 ? 1 : 0;
            const pop = spring({frame: t, fps, config: {damping: 10, stiffness: 320, mass: 0.5}});
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: o,
                  transform: `translateY(${(1 - pop) * 18}px)`,
                  whiteSpace: "pre",
                  width: /^\s+$/.test(ch) && isArabic ? "0.22em" : undefined,
                }}
              >
                {/^\s+$/.test(ch) ? " " : ch}
              </span>
            );
          })}
        </div>
        {squiggle ? (
          <Squiggle delay={bigStart + pieces.length * perLetter} w={460} style={{marginTop: -18}} />
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

/** Small handwritten sign-off, e.g. "PEACE" / "سلام" at the very end. */
export const S1SignOff: React.FC<{text: string; y?: number}> = ({text, y = 560}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 12}});
  return (
    <AbsoluteFill style={{alignItems: "center"}}>
      <div
        style={{
          position: "absolute",
          top: y,
          fontFamily: S1.font.hand,
          fontSize: S1.size.hand,
          color: S1.color.white,
          transform: `scale(${s}) rotate(-4deg)`,
          textShadow: "0 3px 14px rgba(0,0,0,0.45)",
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
