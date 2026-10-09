// House rules shared by every style (ستايل 1، ستايل 2، and all future styles).
// Rule: colour changes to the footage must be minimal — barely noticeable.

/** The only grade allowed on footage: a near-neutral touch. */
export const HOUSE_GRADE = "saturate(1.03) contrast(1.02)";

/** Maximum darkness of any vignette laid over footage (0–1). */
export const HOUSE_VIGNETTE_MAX = 0.12;

/** Subtle edge vignette that respects the house limit. */
export const houseVignette = (strength = HOUSE_VIGNETTE_MAX) =>
  `radial-gradient(ellipse at 50% 42%, rgba(0,0,0,0) 60%, rgba(0,0,0,${Math.min(strength, HOUSE_VIGNETTE_MAX)}) 100%)`;
