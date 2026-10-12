---
name: style-4
description: description: "RETIRED — do not use; ستايل سايا (saya-editor) is the only active editing style. \"ستايل 4\" — dark-studio talking-head reel with neon/holographic motion graphics above the head (phone dashboard + particle stream, neon search bar + video grid + counter, waves with magnifier, linked neon icons, neon swirls), big white key terms on the chest, huge section numbers (أولاً / ثانياً), small captions, fade to black. Use when the user asks to edit/montage a video \"بستايل 4\" / \"ستايل 4\" / \"style 4\"."
---

# ستايل 4 — Style 4

> **House rules first:** read `CLAUDE.md` at the repo root. They apply to this
> style and override it. They cover the footage colour (barely changed), the
> house font (Tahrir Bold) and the light-blue spoken word in captions.

A medium-shot talking head on a **dark studio** background. **Neon motion
graphics** play in the dark space above the head and glow additively. It
comes from a reference reel (frames in `reference/`). The components live in
`video/src/styles/style4/`, and a complete worked example is
`video/src/videos/SayaIntroStyle4.tsx` (composition `SayaIntroStyle4`).

## Layout (1080×1920)

- Graphics zone: top ~70–670 px, above the head. If the subject's head is
  high in the frame, push the shot down (`S1TalkingHead offsetY` ≈ 300; the
  gap is filled with a blurred copy of the same shot) so the zone is dark and free.
- Key terms: big white bold words on the chest (~104 px, stacked one word per line).
- Captions: small white (~56 px), one line of up to 3 words, under the key-term area.
  The spoken word is light blue (house rule).
- Section numbers: huge white "أولاً" / "ثانياً" at the top (~230 px).

## Building blocks

| Beat | Component | Use for |
|---|---|---|
| Opening title | `NeonHook` | neon green small line + big skewed white word(s) + vertical neon laser line |
| Section marker | `SectionNumber` | "أولاً", "ثانياً", … for list videos |
| Key term | `KeyTerm` | English/Arabic keyword of the sentence ("Professional Dashboard", "Search"); hide the captions while it's up |
| Phone dashboard | `NeonPhoneDashboard` | apps, analytics, tools, "dashboard" lines; includes a particle stream |
| Icon + label | `NeonIconLabel` | single idea ("Inspiration" with a bulb) |
| Search + grid + counter | `NeonSearchGrid` | searching or niches; `counterTo` counts up (only with a real number from the script) |
| Waves + magnifier | `NeonWaves` | analysis, hooks, sound and data |
| Linked icons | `NeonIconPath` | steps or a funnel (save → follow → share, time → magic → done) |
| Swirls | `NeonFluid` | mood or "idea quality" beats |
| Outro | `Outro` | big last line, then fade to black |

Icons available: bulb, bookmark, user, plane, search, clock, check, sparkle, play.
Neon palette: cyan `#29D3FF`, blue `#3B7BFF`, magenta `#FF3DCB`, pink `#FF5FA2`,
yellow `#FFE14A`, green `#39FF88`.

## Rhythm

- Change the graphic on every new idea (~1.5–3 s); the talking head stays continuous (cut only the pauses).
- A key term appears roughly once per sentence, when its word is said.
- SFX: whoosh into new graphics, pop on key terms, ding on ideas, a low boom on the outro.

## Workflow

1. Footage → `video/public/footage/<name>.mp4`. Pauses from `silencedetect`, text from the SRT.
2. Copy `video/src/videos/SayaIntroStyle4.tsx`: speech ranges, phrases, `TERMS`,
   graphics windows (`G a b`). Register it in `Root.tsx` with `style4Fonts`.
3. Check stills: key terms and captions must not cover the face or mouth, and
   the graphics must stay above the head.
4. Render; if the file is over 30 MB, send a compressed copy.
