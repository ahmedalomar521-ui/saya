---
name: style-3
description: description: "RETIRED — do not use; ستايل سايا (saya-editor) is the only active editing style. \"ستايل 3\" — minimal talking-head reel style: ONE small clean word at a time under the chin, with occasional stacked emphasis (script/italic word in green, bold word, red word, hand-drawn ellipse or underline) and white flashes on section changes. Use when the user asks to edit/montage a video \"بستايل 3\" / \"ستايل 3\" / \"style 3\"."
---

# ستايل 3 — Style 3

> **House rules first:** read `CLAUDE.md` at the repo root. They apply to this
> style and override it. They cover the footage colour (barely changed), the
> house font (Tahrir Bold) and the light-blue spoken word in captions.

A **minimal** talking-head reel: the face and the words, nothing else. It comes
from a reference reel (frames in `reference/`). The components live in
`video/src/styles/style3/`, and a complete worked example is
`video/src/videos/SayaIntroStyle3.tsx` (composition `SayaIntroStyle3`).

## Principles

1. **One word at a time.** Captions are small, clean and white, and sit just
   under the chin. Each word pops in (a quick spring from 0.7 to 1) and replaces
   the previous one. No boxes, no strokes, only a soft shadow.
2. **Emphasis = a short stack** (2–3 lines) that builds word by word and holds
   for about half a second. In a stack you can mix:
   - a **script/italic** word in the accent green (`~word~`) or in white (`_word_`)
   - a **bold** word (`!word!`), which is upper-case in Latin
   - a **red** word for negatives (`^word^`)
   - a hand-drawn **ellipse** around the stack: white (`{…}o`) or red for
     strong statements (`{…}O`)
   - an **accent underline swoosh** (`{…}u`)
3. **No graphics, no B-roll, no inserts.** Restraint is the style.
4. **Section changes:** a quick white flash (`S3Flash`, about 7 frames) plus a
   change of framing (a punch-in of 1.0 → ~1.12–1.18). Inside a section, the
   framing stays calm with a very slow drift.
5. **Sound:** almost none. A soft whoosh on the section flashes only.

## Tokens

- Sans: IBM Plex Sans Arabic 700 (Latin and Arabic), ~74 px at 1080 wide.
- Script: Aref Ruqaa 700 (Arabic) or Instrument Serif Italic (Latin), ~124 px.
- Bold word ~86 px. Colours: white, accent `#2BDB7C` (swap per brand), red `#E3262F`.
- Caption position: just under the chin (`y` prop). Pick it from a still: in
  the Saya footage it is y ≈ 930.

## Markup cheat-sheet (phrase text)

```
"صح أنا {شخصية ~افتراضية~}"            → stack, script word in green
"{وحيلة !بسيطة!}o"                     → stack + white ellipse
"فإذا بتحبّوا التقنية {من دون !تعقيد!}O" → words one by one, then stack + red ellipse
"بس خلّينا من ^هالحكي^"                → red word
"{_سايا_}u"                            → white script word + green underline
```

Use roughly one stack per sentence at most. Most of the video should be plain
single words.

## Workflow for a new video

1. Footage → `video/public/footage/<name>.mp4` (`-g 12`). Get the pauses from
   `silencedetect=n=-32dB:d=0.12`, and the phrase text from the user's SRT.
2. Copy `video/src/videos/SayaIntroStyle3.tsx`. Fill in the speech ranges, the
   phrases with markup, `ZOOM` per clip and `FLASH_AT` (section starts). Then
   register it in `video/src/Root.tsx` with `style3Fonts`.
3. Check stills: the words must sit under the chin and must not cover the mouth.
   Light clothing needs the shadow; if text is still hard to read, move `y` up
   onto a darker area rather than changing the footage colours.
4. Render; if the file is over 30 MB, send a compressed copy.
