# Saya editing rules (from video-editor-bassam, plus the retention checks)

Rules from the `video-editor-bassam` skill, each one learned from a real
correction, adapted to this Remotion project and Saya's HeyGen footage. The
house rules in `CLAUDE.md` still win where they differ (for example the house
allows `HOUSE_GRADE`, where bassam allows no grade at all). Where a rule here
and the feedback log in `SKILL.md` disagree, the feedback log wins (it is the
user's own words).

## 1. Every graphic carries meaning

- **The shape tells what she says, it does not decorate it.** Brainstorm 3–4
  ideas per sentence and pick a visual metaphor. "Three steps that close a
  loop" = a triangle that completes one side per word, not three chips.
- **Pick the mechanism from the kind of sentence:**

  | She says | Use (`SayaGraphic` type) |
  |---|---|
  | a number or price | `stat` (counts up and lands with a hit) or `bigWord` |
  | a comparison / problem and fix | `list` with two chips (tones `red` and `green`), or `strike` for a correction |
  | a list of 2–4 things | `list` (each item its own icon and tone), `logoStack` for apps, `neonPath` for a chain |
  | steps in an app | `phone` with a screen recording and `taps`, plus `step` pills |
  | a warning or a mistake | `flash` + a punch-in zoom, or `strike`, or `doodle` `scribble` / `redArrow` |
  | "it fixes it" / a result | `list` with check icons landing one by one |
  | a notification or message | `notification` |
  | a typed prompt to an AI | `prompt` |
  | an app by name | `logo` on the word (`findWord`) |
  | a screen recording | `rec` frame |
  | a section ("أولاً…") | `section` |
  | the hook (first 3 s) | `title` above the head (+ a `doodle`) |
  | follow / share / save | `follow`, `save` (`kind: "share"`) |
  | an idea in the headroom | `neonLabel`, or `sketch` `bulb` |
  | a question to the viewer ("شو يعني…؟") | `sketch` `question` (a cloud of "?" around the head) |
  | an object / feeling / idea (battery, rocket, money, time…) | `sticker` with a **line-drawn icon + glow** (`assets.mjs search … --set lucide`, `save lucide:<name> --color <hex>`, `glow: true`) |
  | a desktop site or app | `desktop` + `pip` (scroll a long page) |
  | asking an AI and its answer | `chat` + `pip` (or `prompt` for the question alone) |
  | behind the scenes / "this is how I filmed it" | `rec` with `timecode` |
  | a product / news item with real visuals (ad clip, official images) | `split` (subject card on top, Saya in a `rect`/`circle`/`pill` card below, `tag` number, `source` pill) |

- **Icon style: line-drawn icons first (user preference, 2026-10-12).** For
  ideas, objects and feelings use the line-drawn look (thin strokes, glow), in
  any colour that suits the shot: white, sky `#8FD3FF`, neon `#1E90FF`, or a
  colour that matches the idea. Use `sketch` glyphs (`color`), or a lucide
  icon saved in that colour (`save lucide:<name> --color <hex>`) and shown as a
  `sticker` with `glow: true`. Use a filled colourful emoji (`--set emoji`)
  only when no line icon fits the idea. Brand logos keep their own colours.

- **Each item in a list gets its own shape.** Identical bars or identical chips
  for four different things read as "nobody thought about it".
- **Three abstract graphics in a row feel empty.** One concrete graphic is
  enough; her face talking in between is content, not a gap.
- **No mechanism twice in one video, and none from the previous two videos.**
  Read `video/MECHANISMS.md` before mapping beats, and add this video's line
  after it is approved.

## 2. Timing a graphic

- **A graphic is tied to the word, not the sentence.** Take times from the SRT
  word or phrase, never from "phrase start + a constant".
- **A graphic ends with its sentence.** Compare each graphic's end with the end
  of its phrase; a graphic that lingers into the next topic is noticed at once.
- **Images and screenshots appear on their word and leave after it, with hard
  cuts** (no fade in or out for a 1–2 s image).
- **Face back for less than ~2 s between two graphics reads as a glitch.** Give
  the face at least 2.5 s, or merge the two graphics into one.
- **A graphic starts only after its transition has finished** (punch-in,
  split-screen slide). Starting during the move looks rushed.
- **A static graphic held more than ~2.5 s while she talks about something
  else is a freeze.** Add a pulse on a word she says, or end it.
- **Density:** at least one real graphic every ~15 s, spread along the video.
  Full-screen inserts at most ~2 per minute; she should not feel absent.
- **Don't switch layouts twice within 2 s** (full → split → full).
- **The first caption is visible in the first 0.5 s.**
- **After a cut, the first word starts at the cut**, not at the SRT time. SRT
  starts often run 0.1–0.3 s early, which makes text appear before the voice.

## 3. Text on screen

- **Never put words in her mouth.** A short functional label is fine (a title
  that sums up, a word under a number). A label that adds a claim or a
  commitment she did not make is not. Test: would she say "yes, that's what I
  meant"?
- **A label does not repeat the caption** word for word, and does not say what
  the graphic already says ("first" under a big 1). A symbol can negate:
  "ترند" + ✕ instead of "مو ترند".
- **Direction: text RTL, pure graphics LTR.** Any element with text: text on the
  right, number or icon on the left, right-aligned. Progress bars, timelines,
  connectors and charts run left → right. Do not mix both in one element.
- **One font family inside a graphic; weight is the hierarchy.** Saya's
  font (Cairo) for Arabic. Do not request a weight the font does not have; the
  browser silently falls back to a system font.
- **The @handle is Latin text:** give it an explicit Latin font and a plate
  behind it, or `@` and `.` fall back to random fonts.
- **Western digits (0–9) on screen by default.** They read better large.
- **Captions:** a word is hidden until it is spoken, two lines at most, and
  balanced line breaks (never one lonely word on a line). The house light-blue
  spoken word applies.
- **HeyGen mispronounced a term?** Correct the word on screen (the caption shows
  the right spelling); never touch the audio.
- **Progress bars are a flat fill**, no gradient inside the bar.
- **Lit = good.** In a grid or chart, light up the part that is the gain and
  dim the rest. If the meaning is "all of them are wrong", none stays lit as
  "correct".

## 4. Face and frame

- **Graphics never touch her face or hair.** Over full-frame footage, graphics
  live in the headroom above her head only. Measure that space per clip (it
  changes with framing); the margin above the hair is about twice the margin
  under the chin.
- **Safe zone (1080×1920):** no text in the top 150 px or the bottom 300 px
  (caution band from y 1500), and keep the right 180 px clear between
  y 1100 and 1750 (like, comment, share buttons).
- **Full-screen white flashes** are allowed only at real section changes
  (budget: 3–4 per minute).

## 5. Sound effects

The project has `public/sfx/`: `whoosh`, `pop`, `click`, `ding`, `boom`.

- **Every effect is tied to a moment with meaning:** a graphic entering, a
  number landing, a check mark, a section change. Sprinkling sounds on every
  word sounds like noise.
- **Budget per minute:** at most ~10 transition sounds (whoosh, pop, click,
  ding) and ~20 effects in total. Fewer than ~10 in total feels flat.
- **At least 1.0 s between two effects,** and no tails overlapping.
- **The same sound at most 3 times in a video** (a semantic sound at most twice).
- **A semantic sound lands on the word itself** (±0.1 s), not before or after.
  A whoosh lands on the visual move it belongs to.
- **Repeated items get one sound each:** five chips = five pops, each on its
  own entry frame.
- **Effects sit under her voice:** peaks around 6–7 dB above her speech level,
  not louder. Volumes 0.25–0.45 in the existing videos are the reference.
- **No music unless the user asks and supplies or approves it.** If there is
  "no music", sounds with a melody or a riser read as music too.
- **Avoid sounds that read as childish or harsh:** risers, clocks, knocks,
  countdowns, breaths. Listen to what a sound actually resembles, not its name.

## 6. Render and delivery checks

- **Contact sheet, not single stills.** Check one sheet of 6+ frames at the
  beats (hook, each insert, the CTA) before a full render, and show it to the
  user:
  ```bash
  npx remotion still <Comp> out/f1.png --frame=<n>   # per beat, then:
  ffmpeg -i out/f%d.png -filter_complex tile=3x2 out/sheet.png
  ```
- **Colour stays as it came in.** JPEG frames and untagged output can shift
  brightness and saturation (BT.601 vs BT.709). Render with
  `--image-format=png --color-space=bt709`, then compare one frame of the
  source with the same frame of the output numerically (mean RGB within ~1–2).
  Only the intended `HOUSE_GRADE` difference is allowed.
- **Her voice stays as it came in.** No compression or normalising filters. The
  only allowed change is a fixed loudness gain, and only if asked.
- **Bitrate:** the output should not drop below about a third of the source
  bitrate (`ffprobe -show_entries format=bit_rate`).
- **A failed render can leave the old file behind.** Delete the target before
  rendering, and check a frame from the delivered file itself.
- **Never name a delivery like its source** (`<name>-v<N>.mp4` while in review),
  and don't delete working files until the user approves.
- **"The render finished" is not "it is correct".** Say it is correct only
  after the checks above pass.

## 7. Retention checks (run on the beat mapping, and again on the stills)

- **First frame:** the hook title and the speech both start on frame 0. No
  silence and no slow fade-in in the first second. **Pick the opening
  sound with care** (feedback rule 4 in `SKILL.md`): often none is needed, and
  never a startling hit on the first frame. The first frame should look
  different from the body (punch-in, title, or flash).
- **3–7 s promise:** by second 7 the viewer has heard what they get for
  staying. If the script delays it, flag it to the user rather than re-cutting.
- **Nothing static for more than ~5 s.** A talking-head stretch can hold up to
  ~7 s if the delivery is lively. Otherwise add a punch-in, a key word or a
  small icon.
- **Cut rhythm by length:** 15 s reels cut every ~2–3 s, 30 s every ~3–5 s,
  45–60 s every ~4–7 s (jump cuts included).
- **Text follows the voice.** On-screen titles and key words appear 0.1–0.3 s
  after the word starts, never before it.
- **Transitions:** hard cuts, punch-ins, whip pans and the `flash` graphic. No
  cross-dissolves or fades to black between beats. The only fade is the ending
  after the follow CTA. At most 3–4 flashes a minute, only at real section changes.
- **Safe zone:** Saya's zone is x 80–940, y 280–1400 (`SAYA.safe`); it already
  respects Instagram's top bar, bottom caption area and right-hand buttons.
- **Cover frame:** pick a frame with Saya's face and the hook title, both
  inside the centre 1080×1080 square, because the profile grid crops the rest.
  Tell the user the timestamp so they can set it as the reel cover.
- **Ending:** hold the CTA until the end. A last line that leads back into the
  hook makes the reel loop cleanly.

## 8. Reel inside a reel (Edits link) — learned from رواء الجلاد, 2026-10-15

Instagram's **Edits** app can put a link to another reel inside a clip. The
viewer then sees a "Watch full reel >" chip and a tappable preview card of that
reel. We render the montage; the user adds the link in Edits before posting.
What the reference does, and what we copy:
- **The chip** sits at the top, above the head (~y 280–380 of 1920). Keep the
  top band y 0–400 free of titles while the link is on screen.
- **The card** is a small portrait 9:16 card with a thin white border and
  rounded corners, centred on the chest between her hands (~x 360–720,
  y 950–1590). Her face stays fully visible above it.
- **Captions** are hidden while the card is up (the card speaks). For a long
  card stretch, move them up under the chin with `places` instead of hiding.
- **Captions elsewhere:** one short line, small white text, no box, on the
  chest centre (~y 1110).
- **Timing:** the card shows for ~3 s on the line that names the reel ("لو
  كبست هلا"), with a hand gesture pointing at it, and then goes.
- **Our side:** reserve the card rectangle (`EDITS_CARD` below), or show the
  same footage ourselves in a card of exactly that size, so the Edits element
  can be dropped on top. Always tell the user the exact rectangle and the
  seconds.
  `EDITS_CARD = {x: 340, y: 900, w: 400, h: 711}` (1080×1920).
