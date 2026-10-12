# Saya sound library — when to use each sound

Files: `video/public/sfx/saya/*.wav` (56 sounds, peak-normalised to -1 dBFS).
Code: `video/src/styles/saya/sfx.ts` (`sayaSfx(name)`, `SAYA_SFX_VOLUME`, and
`SAYA_SFX_FOR`, which maps each event to its sounds).

## Where the rules come from (the user's teaching videos)

Three of the teaching videos say the same rules (on-screen text, read frame by
frame). They agree with each other:

| Sound | When to use it | Source |
|---|---|---|
| **Whoosh** | with **zoom in / zoom out** | S1, S2, S5 |
| **Fuhh** | to **surprise** the viewer and grab attention ("لتفاجئ المشاهد وتشد انتباهو") | S1, S5 |
| **Riser** | before or under a **tense** scene, to build **suspense** ("مشهد فيه توتر" / "تزيد التشويق") | S1, S2, S5 |
| **Click & Impact** | to stress an **important piece of information** ("توضيح معلومة مهمة") | S1, S5 |
| **Click / Pop** | when an element **pops up** on screen ("للحاجات اللي تطلع") | S2 |
| **Ding** | for a **correct answer** or success | S1, S5 |
| **Cash register** | whenever **money** comes up (price, cost, earnings) | S1, S5 |
| **Camera shutter** | for **transitions between scenes** | S1, S2, S5, S6 |
| **Magic reveal** | when a **result appears** ("بش تظهر نتيجة") | S2 (not extracted, see below) |

S3 adds a **tech set**: notification, mouse click, keyboard typing, toggle,
glitch, digital loading and glitchy counter. It also has a transition set:
woosh 1/2, deep woosh, camera shutter, film burning and reverse. S6 sorts its
sounds into **transitions** (انتقالات) and **suspense** (تشويق). S4 shows sound
synced to **every movement** (power-up, ticks, swipes).

## The library

| File | Sound | Use for | From |
|---|---|---|---|
| `whoosh-zoom` | whoosh in + out | zoom in / zoom out (main) | S5 |
| `whoosh-1`, `whoosh-2` | short / longer whoosh | zoom variants, quick slides | S3 |
| `swish-whoosh` | large swish | fast slide-in of a card or phone | S6 |
| `cinematic-whoosh` | cinematic whoosh | opening, big transition | S6 |
| `whoosh-shine` | whoosh with a bright tail | logo or product reveal | S4 |
| `sweep-up` | sci-fi rising sweep | phone rising, UI reveal | S4 |
| `transition-swipe` | short swipe | cut to screen recording | S6 |
| `camera-shutter` | shutter | scene transition (main) | S5 |
| `camera-shutter-2`, `shutter-click` | short shutters | quick transitions, screenshot card | S6 |
| `camera-flash` | flash + shutter | screenshot or "photo" moment | S6 |
| `fuhh` | breathy swoosh-hit | surprise, hook line | S5 |
| `click` | double click | important info (with impact) / pop-up | S5 |
| `impact` | soft boom | important info, keyword slam | S5 |
| `impact-deep` | deep boom | punchline, big claim | S6 |
| `riser` | riser | tension before a reveal | S5 |
| `metallic-riser` | metallic riser | tech tension, "wait for it" | S6 |
| `tension-keen` | "bad feeling" drone | a warning or a problem | S6 |
| `power-up` | sci-fi charge | feature turns on, AI "thinking" | S4 |
| `ding` | ding | correct answer, success, ✓ | S5 |
| `cash-register` | register | price, money, free vs paid | S5 |
| `notification` | phone notification | notification banner, message | S3 |
| `ui-select` | UI select | tap or select in a phone demo, pill pops | S6 |
| `glitch` | digital glitch | error, hack, "something is wrong" | S3 |
| `digital-loading` | rising digital beeps | loading, processing, download | S3 |
| `glitchy-counter` | beeping counter | numbers counting up (stats) | S3 |
| `ticks-fast`, `ticks-slow` | ratchet ticks | scrolling a list, counting, timer | S4 |

### Pack 2 — labelled SFX videos (LSK "Sound Effect" parts 1, 3, 4, 5, 7)

Each sound plays alone, with its name on screen, so these labels are certain.

| File | Use for |
|---|---|
| `small-swoosh` | small element slides in, a light zoom |
| `whoosh-pack-1` (one), `whoosh-pack-2` / `-3` (two each) | zooms and slides; the pairs suit zoom-in then zoom-out |
| `robot-zoom` | mechanical / tech zoom on a device or screen |
| `rewind` | "let's go back", rewinding a step |
| `old-projector` | flashback, "in the old days" (rare) |
| `slow-motion`, `slow-motion-2` | a slow-motion moment, a dramatic pause |
| `riser-2` | suspense (variant of `riser`) |
| `boom`, `cinematic-boom` | a big statement, a title card, the hook |
| `epic-baam` | the biggest reveal or punchline (at most once per video) |
| `stamp` | "approved", a verdict, a label stamped on screen |
| `badum-tss` | after a joke |
| `idea-ding` | "here's the trick", an idea or a tip |
| `blink-bell` | a small sparkle or highlight on an element |
| `shining` | a shine on a logo or product, "a result appears" (stands in for Magic Reveal) |
| `confetti` | celebration, success, a milestone |
| `cash-register-2` | money, price, free vs paid (variants of `cash-register`) |
| `keyboard`, `typewriter` | longer typing beds: writing a prompt, a search, a message |
| `timer-ticks`, `alarm-clock` | deadline, "time is running out", a countdown |
| `boring` | a dull or slow thing (comedic) |
| `crickets` | awkward silence, no answer (comedic) |
| `airplane` | travel, flying (rare) |

## Mixing rules

- SFX sit **10–14 dB under the voice** (defaults in `SAYA_SFX_VOLUME`). Never
  cover a word.
- Place the sound **1–2 frames before** its visual, so they land together.
- **One sound per event.** When graphics stack, only the first one gets a
  sound. At most about one SFX every 0.5 s.
- **Rotate variants** (`SAYA_SFX_FOR`) so the same whoosh never plays twice in
  a row.
- Riser: it **ends exactly on** the reveal frame (start it `duration` frames
  earlier) and is followed by `impact` or `whoosh-shine`.
- Music bed: duck it under the voice, and cut it about 1 s before the main
  reveal (fundamentals §2).

## Gaps

- **Magic Reveal** (S2) was not extracted: the speaker talks over it the whole
  time (≈1.4 s at 10.1–11.5 s of a 12.7 s video). Use `shining`,
  `whoosh-shine` or `power-up` for "a result appears" until the user provides a
  clean file.
- **Meme sounds** in S3 (vine boom, bruh, huh?…) were skipped: they do not fit
  Saya's tech tone, and their order on screen was hard to match.
- S1 and S2 play their sounds under speech, so their versions were not cut.
  The same sounds come from the clean videos (S5, S6).

## Removed (doubtful)

The user asked to delete every sound whose label or cut was in doubt:
`money` (it ran into the end of "Message"), `whoosh-deep`, `film-burn` and
`reverse` (S3: matched only by order), and `mouse-click`, `keyboard-typing`
and `toggle` (S3: the split between them was a guess). For typing use
`keyboard` / `typewriter`; for taps use `ui-select` / `shutter-click`. Never
add a sound to the library unless its name is certain and it plays alone,
with no speech or other sound over it.
