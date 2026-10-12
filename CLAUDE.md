# Saya — video editing project

**Always talk to the user in Arabic (دائماً كلّم المستخدم بالعربي).**

**Never edit or render a video unless the user explicitly asks for it (لا تمنتج شي بدون ما يطلب).** Saving a style means saving it only: analyse the reference, write the skill and the reusable components, and check them with a few stills at most. Do not produce a demo edit or re-render existing videos on your own initiative. Offer it in one line instead.

Remotion project in `video/`. **The only active editing style is ستايل سايا**
(`.claude/skills/saya-editor`, components in `video/src/styles/saya/`, rules in
`.claude/skills/saya-editor/editing-rules.md`). The old styles
(`style-0` … `style-4`, ستايل 0–4) are RETIRED: the user decided to ignore them,
and their useful pieces were ported into the Saya style. They are kept in the
repo only as history. Do not use or suggest them; edit every video in the Saya
style unless the user names another style.

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
   - If the footage looks like it needs a colour change, tell the user before
     the edit and let them decide. Never grade on your own (user decision,
     2026-10-12: the optional cinematic grade was cancelled).

2. **The spoken word in captions is light blue.** Whatever the style, the
   caption word that colours along with the speech (the word being spoken) uses
   `HOUSE_ACTIVE_WORD` (`#8FD3FF`, a soft light blue; glowing styles add
   `HOUSE_ACTIVE_GLOW`). Use `KaraokeText` (`video/src/styles/shared/Karaoke.tsx`)
   or `activeWordIndex()` from `house.ts`.

3. **House font: Tahrir Bold (`video/public/fonts/house/tahrir-bold.ttf`) for
   all Arabic text in every montage, whatever the style.** It is listed in
   `HOUSE_FONT_FILES` in `house.ts`. Every style's font stacks go through
   `withHouseFont()` and every style's font promise includes `houseFontLoaded`,
   so it applies to all styles at once. Tahrir has Arabic glyphs only: Latin
   letters and Western digits fall through to the style's own Latin font. (It
   replaces the earlier request for "خط صيدلية النهدي".)
   **Exception: ستايل سايا (`saya-editor`) uses Cairo, not Tahrir** — the
   user rejected Tahrir for Saya's videos.

When saving a new style, its tokens must take `grade` from `HOUSE_GRADE`, wrap
font stacks in `withHouseFont()`, include `houseFontLoaded`, use the house
active-word colour, and its guide must link back to these house rules.
