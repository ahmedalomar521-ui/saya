// Optional cinematic grade (house rule 1 exception, used only after the user
// approves it for a given video). Modelled on the user's reference reel (the
// man in the dark studio): lifted, slightly cool shadows; warm skin and
// highlights; a mild S-curve. Measured on the reference: blacks sit near
// 10/255 (not crushed), shadows lean blue (B − R ≈ +7), mids and highlights
// lean warm (R − B ≈ +60) with green held back.
//
// Saya's version is deliberately much gentler (`intensity` 0–1, default 0.5)
// so her studio blues stay blue. No black-and-white, no tints, no hue shifts.
//
// Usage: render <CinemaGradeDefs /> once in the composition, then put
// `cinemaFilter()` in the footage's CSS filter.

const N = 33;
const smooth = (x: number) => x * x * (3 - 2 * x);

/** Per-channel tone curves sampled at N points (0–1). */
export const cinemaCurves = (intensity = 0.5) => {
  const t = Math.max(0, Math.min(1, intensity));
  const curve = (ch: "r" | "g" | "b") =>
    Array.from({length: N}, (_, i) => {
      const x = i / (N - 1);
      // mild S-curve
      let y = x + (smooth(x) - x) * 0.6 * t;
      // warm highlights / skin, green held back a touch
      const hi = x * x;
      if (ch === "r") y *= 1 + 0.08 * t * hi;
      if (ch === "g") y *= 1 - 0.015 * t * hi;
      if (ch === "b") y *= 1 - 0.1 * t * hi;
      // cool shadows
      const lo = Math.pow(1 - x, 3);
      if (ch === "b") y += 0.04 * t * lo;
      if (ch === "r") y -= 0.012 * t * lo;
      // lifted blacks (a little more on blue)
      const lift = (ch === "b" ? 0.045 : 0.028) * t;
      y = lift + y * (1 - lift);
      return Math.max(0, Math.min(1, y));
    });
  return {r: curve("r"), g: curve("g"), b: curve("b")};
};

export const CINEMA_FILTER_ID = "saya-cinema-grade";

export const CinemaGradeDefs: React.FC<{intensity?: number}> = ({intensity = 0.5}) => {
  const c = cinemaCurves(intensity);
  const v = (a: number[]) => a.map((n) => n.toFixed(4)).join(" ");
  return (
    <svg width={0} height={0} style={{position: "absolute"}} aria-hidden>
      <defs>
        <filter id={CINEMA_FILTER_ID} colorInterpolationFilters="sRGB">
          <feComponentTransfer>
            <feFuncR type="table" tableValues={v(c.r)} />
            <feFuncG type="table" tableValues={v(c.g)} />
            <feFuncB type="table" tableValues={v(c.b)} />
          </feComponentTransfer>
        </filter>
      </defs>
    </svg>
  );
};

/** CSS filter for graded footage (pair with <CinemaGradeDefs />). */
export const cinemaFilter = (intensity = 0.5) => `url(#${CINEMA_FILTER_ID}) saturate(${(1 + 0.06 * intensity).toFixed(3)})`;
