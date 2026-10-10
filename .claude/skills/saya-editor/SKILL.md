---
name: saya-editor
description: "saya_editor" — مونتاج فيديوهات سايا (صانعة المحتوى) بستايلها الخاص. Saya's own editing style, built by analysing several reference videos the user provides. Use when the user asks to edit/montage a video "بستايل سايا" / "saya_editor" / "saya editor" / "مونتاج سايا". STATUS: style specified, components not built yet.
---

# saya_editor — ستايل سايا

> **House rules first:** read `CLAUDE.md` at the repo root. They apply to this
> style and override it: footage colour barely changed (`HOUSE_GRADE`), house
> font Tahrir Bold for Arabic (`withHouseFont()` + `houseFontLoaded`), and the
> spoken caption word in light blue (`HOUSE_ACTIVE_WORD` via `KaraokeText`).

## Status

The style is **specified** (below) from the user's picks. The components in
`video/src/styles/saya/` are **not built yet**. Until they exist, do not edit a
video with this skill: say so in Arabic and offer to build them.

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
measured numbers. Then read `sfx.md`: the sound library (63 sounds) and when to use each one. Element IDs refer to `reference/ANALYSIS.md`.

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
   about y 420) when a graphic takes the middle, always inside the safe zone.
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

## Tokens (initial; tune when building)

- Canvas 1080×1920, 30 fps.
- Caption: Tahrir Bold (Arabic) and the brand Latin font, about 64 px, white,
  shadow `0 3px 12px rgba(0,0,0,.55)`. On light UI it gets a 3 px navy stroke.
  Active word `#8FD3FF` + `HOUSE_ACTIVE_GLOW`.
- Neon blue `#1E90FF` (glow `0 0 24px #1E90FFAA`), navy `#0B1B3F` (glass
  plates at 78% opacity plus 20 px backdrop blur), sky `#8FD3FF`.
- Safe zone: x 80–940, y 280–1400.
- Punch-in scale 1.12–1.18; slow zoom 1.00 → 1.06; background blur 18–24 px.
- Springs: pop `damping 12, stiffness 180`; phone rise `damping 14, stiffness 120`.

## Components to build (`video/src/styles/saya/`)

`tokens.ts`, `SayaCaptions` (always-on, chunked, repositioning, never
repeats), `LogoPop` and `LogoStack`, `PhoneMock` and `PipBubble`,
`ScreenshotCard`, `GlassCard` and `InfoChip`, `FeaturePill` (the caption-replacing
graphic), `StepPill`, `SaveCta`, `PunchZoom` and `BgBlur` helpers, `Whip`
transition, `SayaSfx` (event → sound mapping from fundamentals §2), and a
template `video/src/videos/SayaTemplate.tsx`.

## Workflow for a new video

1. Footage → `video/public/footage/<name>.mp4`. Cut the silences
   (fundamentals §1). Get word timings for the captions.
2. Go through the script and mark every **name** (logo, screenshot or phone),
   every **important moment** (caption → graphic) and the **main reveal**
   (music drop).
3. Build the timeline from the template. Add SFX from the event table.
4. Check stills: captions inside the safe zone, not covering the mouth, never
   repeated. Then render. If the file is over 30 MB, send a compressed copy.
