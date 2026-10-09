# Saya — video editing project

Remotion project in `video/`. Editing styles are saved as skills:
`.claude/skills/style-1` (ستايل 1), `.claude/skills/style-2` (ستايل 2),
`.claude/skills/style-3` (ستايل 3), and any
future `style-N`.

## House rules — apply to EVERY style (past and future)

These override anything a style's own guide or reference video suggests.

1. **Footage colour stays almost untouched.** Colour changes to the video
   itself must be very slight, barely noticeable:
   - Use only `HOUSE_GRADE` from `video/src/styles/shared/house.ts`
     (currently `saturate(1.03) contrast(1.02)`) on footage.
   - No strong looks: no grayscale/black-and-white beats, no sepia or tint,
     no hue shifts, no brightening/darkening of the shot.
   - Vignettes over footage max `HOUSE_VIGNETTE_MAX` (0.12) via `houseVignette()`.
   - Even if a reference video has a heavy grade, do not copy it. Copy its
     layout, typography, graphics and rhythm instead.
   - Graphics, text and full-screen inserts keep their own colours. This rule
     is about the footage only.

When saving a new style, its tokens must take `grade` from `HOUSE_GRADE` and
its guide must link back to these house rules.
