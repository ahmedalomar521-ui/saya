---
name: style-1
description: "ستايل 1" — graphics-heavy talking-head reel style (split-screen B-roll, two-tier yellow titles, hand-drawn doodles, small captions). Use when the user asks to edit/montage a video "بستايل 1" / "ستايل 1" / "style 1", or to reuse this editing style.
---

# ستايل 1 — Style 1

A talking-head reel where **the graphics carry the pacing**. Derived from a
reference reel (frames in `reference/`). Reusable Remotion components live in
`video/src/styles/style1/`; a complete worked example is
`video/src/videos/SayaIntro.tsx` (composition `SayaIntro`).

## Priorities (in order)

1. **Graphics first.** A new visual beat every ~1–3 s. Never leave more than
   ~3 s of plain talking head without a title, doodle or B-roll beat.
2. Split-screen B-roll for anything explainable (tools, websites, steps, numbers).
3. Two-tier yellow titles for the hook, key phrases and CTAs.
4. Small, quiet captions — the titles are the loud text, captions are not.

## Building blocks (all in `video/src/styles/style1/`)

| Element | Component | Rules |
|---|---|---|
| Colour grade | `S1TalkingHead` | cool, slightly desaturated, darker (`S1.grade`) + soft vignette |
| Headroom | `S1TalkingHead offsetY` | if the head is near the top, push the shot down (~260 px) and fill the gap with a blurred copy so titles fit above the head |
| **Two-tier title** | `S1Title` | small white **handwritten** line (Marhey / Permanent Marker, ~54 px) over a huge **yellow `#F8E000`** display word (Lalezar / Rubik Mono One), skewed −9°, typed on word-by-word (Arabic) or letter-by-letter (Latin). Sits just above the head. Exits by sliding sideways. Optional `squiggle` underline. Avoid `!` in Arabic titles (use `Burst` instead). |
| Split screen | `S1TopStage` + `S1TalkingHead mode="bottom"` | exact 50/50 at y = 960. Top = light paper `#F4F4F5` stage with graphics; bottom = talking head cropped to the face (`focusY`). First beat of a split window slides in (`slideIn`), later beats **hard-cut**. Put a paper layer under the whole window so nothing flashes black. Split windows must start/end inside cut pauses. |
| Captions | `S1Captions` + `chunkPhrases` | 1–3 words, Cairo 700, white. Over the talking head: ~77 % height, shadow only — or **boxed** (white on black) when wardrobe/background is light. In split mode: boxed, sitting on the seam. |
| Doodles | `Doodles.tsx` | marker strokes that draw on: `Squiggle`, `CurlyArrow`, `SpeechBubble`, `MarkerCircle`, `Burst`, `ScribbleOut` (red cross-out for "forget that" moments). |
| B-roll beats | `Graphics.tsx` | `UIKitCluster` (floating colourful UI: toggles, buttons, cards), `GlitchIn` (RGB smear entrance), `CursorClick`, `SliderBeat` (drag to 100), `ProgressCard` (0→100 %), `BigStat` (huge counting number), `KineticWord` (giant word sliding across a lime stage), `BrowserCard` (website with typed headline), `PromptBox` (prompt typing + send click), `AIAvatarCard` (live clip in a phone card with scan line + AI badge), `ToolGrid` (app-icon grid). |
| End CTA | `S1Title` + `SpeechBubble` / `CurlyArrow` + `S1PiPCard` | e.g. small "علّق" + big "كلمة", or small "فيديوهات" + big "أكثر" with a curly arrow pointing at a floating PiP card of another video. Optional handwritten sign-off `S1SignOff`. |

## Palette

yellow `#F8E000` (titles) · white · ink `#0A0A0A` · paper `#F4F4F5` ·
lime `#D4F53C` · purple `#B9A3F5` · blue `#2F80FF` · green `#22E05A`.

## Editing rhythm

- Jump-cut only the pauses (`makeTimeline` in `timeline.ts`, pads 0.08 s / 0.12 s);
  keep the talking head itself calm (no punch-in zooms — that belongs to other styles).
- Hook (first 1–2 s): two-tier title above the head immediately.
- Middle: alternate full-frame titles ↔ split-screen B-roll windows; inside a
  split window change the top graphic on every new idea (~1–2 s).
- End: CTA title + doodle, then a beat of sign-off.
- SFX: pop on titles, whoosh on split in/out, click on cursor/toggle/send,
  ding when something completes, low boom on a kinetic word. Keep SFX ≈ −8 dB under voice.

## Workflow for a new video

1. Join/convert footage → `video/public/footage/<name>.mp4` (`-g 12` for fast seeking).
2. Find pauses: `ffmpeg -af silencedetect=n=-32dB:d=0.12`. Use the user's SRT for
   phrase text/timing (clean spelling, keep dialect).
3. Copy `video/src/videos/SayaIntro.tsx` as a template: fill speech ranges,
   phrases, split windows, titles and stage beats; register it in `video/src/Root.tsx`
   with `style1Fonts` in `calculateMetadata`.
4. Check stills (`npx remotion still <id> --frame=N --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`)
   at every beat before rendering; look for black flashes, overlaps with the face,
   and titles colliding with the head.
5. Render, then send a compressed copy if > 30 MB.
