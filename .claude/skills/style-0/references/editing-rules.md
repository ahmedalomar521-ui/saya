# Style 0 editing rules (ported from video-editor-bassam)

Rules from the `video-editor-bassam` skill, each one learned from a real
correction, adapted to this Remotion project and Saya's HeyGen footage. The
house rules in `CLAUDE.md` still win where they differ (for example the house
allows `HOUSE_GRADE`, where bassam allows no grade at all).

## 1. Every graphic carries meaning

- **The shape tells what she says, it does not decorate it.** Brainstorm 3–4
  ideas per sentence and pick a visual metaphor. "Three steps that close a
  loop" = a triangle that completes one side per word, not three chips.
- **Pick the mechanism from the kind of sentence:**

  | She says | Use | From |
  |---|---|---|
  | a number or price | counter that rolls and lands with a hit | Style 4 counter / `KeyTerm` |
  | a comparison of two things | two items, the spoken one glows and grows, the other dims | `GlassChip` pair / Style 2 |
  | a list of 2–4 things | each item as its own shape or icon, entering on its word | `GlassChip`, `NeonIconPath`, `GlowIcon` |
  | steps in an app | phone walkthrough, one tap per step on its word | `PhoneFlow`, `PhoneSettings`, `S1TopStage` |
  | a warning or a mistake | flash + punch-in + red bar, or a marker strike | `S3Flash`, `PaperLines strike` |
  | "it fixes it" / a result | check marks landing one by one | chips with check icons |
  | a notification or message | `NotificationBanner` | src/Overlays.tsx |
  | an app by name | the app icon floating near her | `OrbitIcon` |
  | follow / share | `FollowCTA`, `NeonIconPath` | Overlays / Style 4 |

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
- **One font family inside a graphic; weight is the hierarchy.** House font
  (Tahrir Bold) for Arabic. Do not request a weight the font does not have; the
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
- **Full-screen white flashes** are allowed only at real section changes (Style 3
  budget: 3–4 per minute).

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
