---
name: saya-editor
description: "saya_editor" — مونتاج فيديوهات سايا (صانعة المحتوى) بستايلها الخاص. Saya's own editing style, built by analysing several reference videos the user provides. Use when the user asks to edit/montage a video "بستايل سايا" / "saya_editor" / "saya editor" / "مونتاج سايا". STATUS: ready — components in video/src/styles/saya, template videos/SayaKitPreview.tsx.
---

# saya_editor — ستايل سايا

> **House rules first:** read `CLAUDE.md` at the repo root. They apply to this
> style and override it: footage colour barely changed (`HOUSE_GRADE`), house
> font Tahrir Bold for Arabic (`withHouseFont()` + `houseFontLoaded`), and the
> spoken caption word in light blue (`HOUSE_ACTIVE_WORD` via `KaraokeText`).

## Status

Ready. The components live in `video/src/styles/saya/`. Every piece is shown
on one timeline in `video/src/videos/SayaKitPreview.tsx` (composition
`SayaKitPreview`, a gallery for checking stills, not a montage).

## What we know about Saya

- **Niche:** tech content (التقنية). Every video is **talking-head**, speaking
  to the camera, **vertical 9:16** (1080×1920).
- **Brand colours** (for graphics and text only, never the footage). The hex
  values are proposals and are not approved yet:
  - neon blue (أزرق نيون): `#1E90FF`, with a glow
  - navy (كحلي): `#0B1B3F`, for plates, backgrounds and full-screen inserts
  - sky blue (سماوي): `#8FD3FF`, the same as `HOUSE_ACTIVE_WORD`, so the
    spoken word already matches the brand
- **Built from scratch.** Do NOT reuse or mix the saved styles (style-0 … style-N)
  or their components. Saya's components live only in `video/src/styles/saya/`.
  The shared house helpers (`house.ts`, `Karaoke.tsx`) are still used, because
  the house rules apply to every style.

## How the style gets built (from the reference videos)

1. Put each reference in `reference/` (keep only stills, not full videos):
   extract frames every ~0.5 s plus scene-change frames
   (`ffmpeg -vf "select='gt(scene,0.3)'"`), and note durations, cut rate and
   audio (music, SFX, silence cutting).
2. For every reference, note: caption layout (position, size, words per
   screen, animation, emphasis), typography, colour of graphics, B-roll /
   inserts / icons, zooms and transitions, pacing, sound design, intro/outro.
3. Present the analysis of each reference to the user, element by element.
   **The user picks** what they like. Only the chosen elements go into Saya's
   style, re-coloured to the brand palette above. Never copy a reference's
   footage grade.
4. Fill in **Principles**, **Tokens** and **Workflow** below, build reusable
   components in `video/src/styles/saya/` (tokens take `grade` from
   `HOUSE_GRADE`, fonts via `withHouseFont()`), and check them with a few
   stills only — no demo edit unless the user asks.

## What Saya takes from each reference (user's picks)

Read `fundamentals.md` first: it covers silence cutting, SFX and VFX with
measured numbers. Then read `sfx.md`: the sound library (56 sounds) and when to use each one. Element IDs refer to `reference/ANALYSIS.md`.

| Ref | What we take | IDs |
|---|---|---|
| **R1** | **Show what is said.** Whenever an app, product, site, person, place or number is named, a picture or graphic appears **on that word**: app → its screenshot or icon, place → a map, person → a photo. | R1-b, R1-c |
| **R2** | **Base of the sound design** (fundamentals §2). Motion-graphics ideas: floating preview window, 3D app icon beside the head, step pill, save CTA. | R2-b, R2-c, R2-d, R2-f |
| **R3** | **Caption behaviour and visual effects.** The caption is **always on screen** and a phrase is **never shown twice**. It moves up or down to dodge graphics, but stays inside the Instagram safe zone. When it moves to the top it can carry a small grey context line. Also: blurred background with a floating phone, glass cards, info chip, source tag. | R3-a, R3-b, R3-c, R3-d, R3-e |
| **R4** | **Closest to Saya.** Caption *look*: small, white, 2–3 words at a time. Neon logo pop beside the head; phone rising from the bottom with a PiP bubble; **a graphic that takes the caption's place when something important is said** (a pill with a sparkle for a feature name, a big glowing word). Sound accents: chime on logos, sub swell under the phone. | R4-a…R4-f |
| **R5** | **Base of the visual effects.** Punch-in/out on cuts, slow and fast zooms, background blur. **The app logo pops in the moment its name is spoken**, and several logos stack. Screenshot cards slide in with motion blur. | R5-b, R5-c (+ zooms) |

## Principles

1. **Talking head plus "show the thing."** Something changes on screen every
   2–4 s: a punch-in, a logo, a phone, a card. No stretch of more than ~4 s
   with the same plain frame.
2. **Captions: always on, never repeated (R3), R4 look.** 2–3 words per chunk,
   white Tahrir Bold, with the spoken word in sky blue (`HOUSE_ACTIVE_WORD`).
   Default position is the chest (about y 1150 at 1080×1920). It moves up (to
   about y 330) when a graphic takes the middle, always inside the safe zone.
3. **Important moment = the caption becomes a graphic (R4).** For a feature
   name, a key number or the punchline, the caption chunk is replaced by a
   pill, a big glowing word or a logo in the same spot. Then the normal caption
   resumes with the next words (no repetition).
4. **Name = picture (R1 + R5).** An app or brand name brings its logo on the
   word (spring pop + chime). A product demo brings a phone mock-up (R3/R4). A
   website or article brings a screenshot card (R5).
5. **Brand colours on graphics only.** Neon blue glows, navy glass plates,
   sky-blue accents. The footage stays as shot (`HOUSE_GRADE`).
6. **Sound on every graphic** (fundamentals §2), music bed underneath with one
   drop before the main reveal.

## Tokens (source of truth: `video/src/styles/saya/tokens.ts`)

- Canvas 1080×1920, 30 fps.
- Caption: Tahrir Bold (Arabic) and the brand Latin font, about 64 px, white,
  shadow `0 3px 12px rgba(0,0,0,.55)`. On light UI it gets a 3 px navy stroke.
  Active word `#8FD3FF` + `HOUSE_ACTIVE_GLOW`.
- Neon blue `#1E90FF` (glow `0 0 24px #1E90FFAA`), navy `#0B1B3F` (glass
  plates at 78% opacity plus 20 px backdrop blur), sky `#8FD3FF`.
- Safe zone: x 80–940, y 280–1400.
- Punch-in scale 1.12–1.18; slow zoom 1.00 → 1.06; background blur 18–24 px.
- Springs: pop `damping 12, stiffness 180`; phone rise `damping 14, stiffness 120`.

## Components (`video/src/styles/saya/`)

| File | What it does | From |
|---|---|---|
| `tokens.ts` | colours (neon / navy / sky), fonts, safe zone, springs, `navyGlass()`, `neonGlow()` | — |
| `srt.ts` | `srtToChunks(srt, fps)`: SRT → word times → 2–3-word chunks (never across cues); `findWord()` returns the frame where a name is spoken | R3 |
| `Captions.tsx` | `SayaCaptions`: always on, never repeated, white with the sky active word; `places` move it (chest 1150 ↔ top ~330), `hide` skips the chunks a graphic says, `notes` adds a grey context line, `onLight` adds a navy outline | R3 + R4 |
| `Footage.tsx` | `SayaFootage`: `zooms` (cut / slow / fast), `blur` ranges, `pip` ranges (the shot shrinks into a glowing circle top-left over a blurred copy), `whips` | R5 + R4 |
| `Logos.tsx` | `LogoPop` (in the caption's place with its name, or beside the head with a neon glow), `LogoStack` (logos named in a row; `focus` zooms one to the centre). Icons come from `simple-icons` (`import {siInstagram} from "simple-icons"`) or an image | R5 + R4 |
| `Inserts.tsx` | `PhoneMock` (rises from below), `TapPulse`, `ScreenshotCard` (slides up with motion blur), `GlassCard`, `InfoChip`, `SourceTag` | R3 R4 R5 |
| `Pills.tsx` | `FeaturePill` (✦ name in the caption's place), `BigWord`, `StepPill`, `SaveCta` | R4 + R2 |
| `sfx.ts`, `SfxTrack.tsx` | the sound library map and a cue track (sounds land 2 frames early) | — |
| `SayaEdit.tsx` | renders a whole edit from one timeline object (`SayaEditProps`) | — |

## Working agreement with the user (always)

1. **Before editing: ask for the video's script.** Read it and list everything
   the edit will need that is not already in the project. For example:
   screenshots or screen recordings of each app or site mentioned, logos
   missing from `simple-icons`, images, numbers to show, and the SRT. Send that
   list in **one** message and wait until the user sends the files. Do not
   start editing with gaps.
2. **While editing: if something is missing, pause and ask.** Say exactly what
   is needed and where it goes (timestamp + purpose). Never fill the gap with a
   placeholder or a guess, and never render a version that has gaps. Resume
   when it arrives.
3. **Render once.** Check with stills only, and render the final video a single
   time, when everything is in place, to avoid wasted renders.
4. **After editing: deliver an editable timeline** as well as the video, so the
   user can fix small things by hand (see "Timeline handoff" below).

## Workflow for a new video

1. Footage → `video/public/footage/<name>.mp4` (git-ignored). The SRT comes from
   the user. Cut silences **only if the user asks** (fundamentals §1).
2. Copy `videos/SayaKitPreview.tsx` to `videos/<Name>.tsx`. Set `footage`,
   paste the SRT, and set `face` (face centre and width in pixels, read from a
   still).
3. Go through the script:
   - every **app or brand name** → `logo` on that word (`findWord`), with a
     chime or click;
   - every **app demo** → `phone` + `pip` + caption `places` to the top;
   - every **site or article** → `screenshot` + `blur`;
   - every **important moment** → `feature` or `bigWord` (the caption gives
     way automatically);
   - a **cut or a new idea** → a `zooms` punch-in with a whoosh;
   - **steps** → `step`; the end → `save` (+ ding).

   Pick sounds from `sfx.md`.
4. Register the composition in `Root.tsx` with `sayaFonts`. Check a few stills
   (captions inside the safe zone, never covering the mouth, no phrase twice).
   Render only when the user asks.

Stills render with
`npx remotion still <Comp> out.png --frame=N --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`
(the default Chrome download is blocked in this environment).

## Feedback log (rules learned from the user's notes)

The first edit is a **trial**. After each edit, turn every note the user gives
into a short rule here (what to do, and in which situation), so the next edit
starts from it. Newer rules override older ones and the principles above
(house rules still come first).

_(empty — waiting for the trial edit)_
