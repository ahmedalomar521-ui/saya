# Saya — video editing project

**Always talk to the user in Arabic (دائماً كلّم المستخدم بالعربي).**

**Never edit or render a video unless the user explicitly asks for it (لا تمنتج شي بدون ما يطلب).** Saving a style means saving it only: analyse the reference, write the skill and the reusable components, and check them with a few stills at most. Do not produce a demo edit or re-render existing videos on your own initiative. Offer it in one line instead.

Remotion project in `video/`. Editing styles are saved as skills:
`.claude/skills/style-1` (ستايل 1), `.claude/skills/style-2` (ستايل 2),
`.claude/skills/style-3` (ستايل 3), `.claude/skills/style-4` (ستايل 4), and any
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

2. **The spoken word in captions is light blue.** Whatever the style, the
   caption word that colours along with the speech (the word being spoken) uses
   `HOUSE_ACTIVE_WORD` (`#8FD3FF`, a soft light blue; glowing styles add
   `HOUSE_ACTIVE_GLOW`). Use `KaraokeText` (`video/src/styles/shared/Karaoke.tsx`)
   or `activeWordIndex()` from `house.ts`.

3. **House font: "خط صيدلية النهدي" for all text in every montage.** The
   font files go in `video/public/fonts/house/` and are listed in
   `HOUSE_FONT_FILES` in `house.ts`. Every style's font stacks go through
   `withHouseFont()` and every style's font promise includes `houseFontLoaded`,
   so adding the files switches all styles at once. Until the files are
   provided, styles fall back to their own fonts. If the font is missing for a
   new video, ask the user for it.

When saving a new style, its tokens must take `grade` from `HOUSE_GRADE`, wrap
font stacks in `withHouseFont()`, include `houseFontLoaded`, use the house
active-word colour, and its guide must link back to these house rules.
