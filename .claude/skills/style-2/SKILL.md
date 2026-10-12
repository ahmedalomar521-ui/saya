---
name: style-2
description: "RETIRED — do not use; ستايل سايا (saya-editor) is the only active editing style. \"ستايل 2\" — caption-driven Arabic talking-head reel style (big glowing yellow captions with stretched kashida letters, red emphasis / red highlight bar, hand-drawn red arrows, full-screen mint glass-chip and paper-card inserts). Use when the user asks to edit/montage a video \"بستايل 2\" / \"ستايل 2\" / \"style 2\"."
---

# ستايل 2 — Style 2

> **House rules first:** read `CLAUDE.md` at the repo root. They apply to this
> style and override it. They cover the footage colour (barely changed), the
> house font (Tahrir Bold) and the light-blue spoken word in captions.

An Arabic talking-head reel where **the captions are the design**. Derived from
a reference reel (frames in `reference/`). Remotion components live in
`video/src/styles/style2/`; a complete worked example is
`video/src/videos/SayaIntroStyle2.tsx` (composition `SayaIntroStyle2`).

## Priorities (in order)

1. **Glowing captions on the chest**: big, warm yellow, glowing, built word by
   word, 1–2 lines, with stretched letters (كشيدة / tatweel). They are always
   on while the speaker is on screen.
2. **Emphasis**: key words in **red glow**; the punchline phrase on a **red
   highlight bar** (white text on a red box).
3. **Full-screen inserts** for concepts: a mint background with glossy colored
   chips, or a paper card with dark stretched text and a red marker stroke.
   The voice continues under them, and the captions hide.
4. Small glowing accents: a hand-drawn red arrow pointing at the text, and a
   neon line icon under the captions.

## Building blocks (`video/src/styles/style2/`)

| Element | Component | Rules |
|---|---|---|
| Captions | `S2Captions` + `buildPages` | Cairo 900, ~96 px, color `#F8E08A` with a multi-layer warm glow (`glowShadow`). One phrase = one page, split into 2 balanced lines when > 3 words. Words blur in from the right (~6 frames). Sits at y ≈ 980–1060 (chest, just under the chin). A soft dark plate behind the text keeps it readable on light clothes. Hide during inserts. |
| Kashida | `autoStretch`, `stretchWord` | Applied automatically to about every other word (≥ 3 letters): 2–4 tatweels after the last forward-joining letter. |
| Emphasis | markup in phrase text | `*word*` → red glow (`#FF4A4A`); `[a b c]` → red bar `#E8283A` that wipes in from the right. Use at most one emphasis per page. |
| Punch-in | per-clip framing | Mostly a calm 1.0–1.12 zoom. On a "turn" line ("but…", "forget that…"), punch in to ~1.3. No colour change (house rule). |
| Grade | `S2.grade` | House grade only (`HOUSE_GRADE`, barely noticeable) plus a very light vignette. The reference's warm/green look is not copied. |
| Mint insert | `MintStage` + `GlassChip` | Gradient `#F3F6F5 → #BFE6D6 → #8FD8B0` with a drifting white bloom. Chips are glossy rounded labels (orange / red / green / purple) with an icon in a circle on the right. They blur in, and an optional sub-line types underneath. Stack 2–3 chips for lists (problem / solution / timing, tools / tech / prompts). |
| Paper insert | `PaperStage` + `PaperLines` | Radial white→grey card. Dark stretched text builds line by line; `strike: true` scribbles a red marker stroke through the key word. Can add a `VoiceNote` (WhatsApp-style dark pill with a playing waveform) for client or quote stories. |
| Red arrow | `RedArrow` | Hand-drawn with a red glow, pointing at the caption or the speaker. |
| Glow icon | `GlowIcon` | Neon line icon (checklist, clock, bulb, sparkle, robot) drawn on under the captions, floating gently. |
| Quote word | `QuoteWord` | Big glowing word in quote marks for terms (”دليل“). |

## Rhythm

- Jump-cut the pauses (`makeTimeline` from `styles/style1/timeline.ts`).
- Every 3–6 s, cut to a full-screen insert for a concept or list (1.5–3 s each).
- Use red emphasis or a red bar roughly once per sentence, on the word that carries the meaning.
- SFX: whoosh into and out of inserts, pop per chip, click for the marker
  stroke, low boom on the punch-in, ding on the closing line.

## Workflow for a new video

1. Footage → `video/public/footage/<name>.mp4` (`-g 12`). Pauses come from
   `silencedetect=n=-32dB:d=0.12`; phrase text comes from the user's SRT.
2. Copy `video/src/videos/SayaIntroStyle2.tsx`. Fill in the speech ranges, the phrases
   with `*red*` / `[bar]` markup, `INSERTS`, `FRAMING` and the overlays. Then
   register the composition in `video/src/Root.tsx` with `style2Fonts`.
3. Render stills at every beat (headless shell:
   `/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell`).
   Check that the captions don't cover the mouth, that chips don't overflow the
   width (long labels → `scale` ≤ 1.2), and that no insert starts empty.
4. Render; if the file is over 30 MB, send a compressed copy.
