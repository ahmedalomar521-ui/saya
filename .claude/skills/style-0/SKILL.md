---
name: style-0
description: "ستايل 0" — the combined style: use ALL saved styles (ستايل 1، 2، 3، 4 and any later style-N) together, picking the best tool for each beat of the script to get the most professional result. Use when the user asks to edit/montage a video "بستايل 0" / "ستايل صفر" / "style 0" / "كل الستايلات".
---

# ستايل 0 — all styles combined

> **House rules first:** read `CLAUDE.md` at the repo root (Arabic replies, no
> edit or render without an explicit request, untouched footage colour,
> light-blue spoken word, the house font).

Style 0 is not a new look. It **mixes every saved style** (`style-1` …
`style-N`; read each one's `SKILL.md`), choosing for each sentence the
component that tells it best. The worked example and template is
`video/src/videos/InstaShareMix.tsx` (composition `InstaShareMix`).

## Base layer (always on)

- **Captions:** Style 2 glowing kashida captions (`S2Captions` + `buildPages(…, 2)`;
  max two words per line so lines never overflow), with the house light-blue
  spoken word. Place them on the chest, on the darkest area below the chin.
- **Cuts:** jump-cut the pauses (`makeTimeline`).
- **Colour:** `HOUSE_GRADE` only.

## Choosing a component per beat

| Beat in the script | Use | From |
|---|---|---|
| Hook (first 1–3 s) | two-tier yellow title above the head + `Burst`/`Squiggle` | Style 1 `S1Title` |
| "Don't…" / warning / turn ("بس…", "لا تتجاهل") | white flash + punch-in (~1.1–1.25) + red bar caption `[…]` | Style 3 `S3Flash` + Style 2 |
| Listing 2–3 things (options, problem/solution, tools) | mint insert with glass chips | Style 2 `MintStage` + `GlassChip` |
| Step-by-step how-to (settings, app steps) | 50/50 split screen: graphic/phone on top, speaker below, boxed captions on the seam | Style 1 `S1TopStage` / `S1TalkingHead mode="bottom"` + `S1Captions` |
| A key word to remember | red glow word `*…*` + `RedArrow`, or a big white `KeyTerm` | Style 2 / Style 4 |
| Correction / "not really" / nuance | paper insert with a marker strike on the key word | Style 2 `PaperLines strike` |
| Abstract idea (time, ideas, checklist) | `GlowIcon` under captions or neon icon in the headroom | Style 2 / Style 4 |
| Tech / data / apps | neon phone dashboard, search grid, waves (needs dark headroom) | Style 4 |
| Screen recording mention | REC frame | `RecFrame` (src/Overlays.tsx) |
| Share CTA | `NeonIconPath` (play → plane → user) | Style 4 |
| Follow CTA + ending | `FollowCTA` click + curly arrow, then fade to black | src/Overlays.tsx + Style 1 doodle |
| Calm talking stretches | captions only; optionally Style 3 one-word stacks for a single punchy line | Style 2 / 3 |

## Rules of thumb

- Change the visual beat every ~2–4 s, but leave at least one breathing
  stretch (captions only) between heavy graphics.
- Use at most one full-screen insert in any 6 s window. Hide the captions
  during inserts, the hook title and split screens (the split uses its own seam captions).
- Use 3–4 flashes per minute at most, only at real section changes.
- Graphics go where the frame is empty: the headroom above the head, the dark
  jacket or chest area, or full-screen inserts. Never cover the face or mouth.
- Check stills at every beat before rendering. Fix overflowing captions, black
  flashes and overlaps on the face.
- Mention every mock UI (for example a phone settings screen) to the user, and
  offer to swap in a real screen recording.

## Retention checks

Run these on the beat mapping before writing code, and again on the stills.

- **First frame:** the hook title and the speech both start on frame 0. No
  silence and no slow fade-in in the first second. The first frame should look
  different from the body (punch-in, title, or flash).
- **3–7 s promise:** by second 7 the viewer has heard what they get for
  staying. If the script delays it, flag it to the user rather than re-cutting.
- **Nothing static for more than ~5 s.** A talking-head stretch can hold up to
  ~7 s if the delivery is lively. Otherwise add a punch-in, a key word or a
  small icon. This complements "change the visual beat every ~2–4 s" above.
- **Cut rhythm by length:** 15 s reels cut every ~2–3 s, 30 s every ~3–5 s,
  45–60 s every ~4–7 s (jump cuts included).
- **Text follows the voice.** On-screen titles and key words appear 0.1–0.3 s
  after the word starts, never before it.
- **Transitions:** hard cuts, punch-ins, whip pans and the Style 3 flash. No
  cross-dissolves or fades to black between beats. The only fade is the
  ending after the Follow CTA.
- **Safe zone (1080×1920):** keep titles, captions and graphics inside
  x 70–1010, y 150–1570. Instagram's buttons cover the right edge and its
  caption area covers the bottom ~350 px.
- **Cover frame:** pick a frame with Saya's face and the hook title, both
  inside the centre 1080×1080 square, because the profile grid crops the rest.
  Tell the user the timestamp so they can set it as the reel cover.
- **Ending:** hold the CTA text until the end. A last line that leads back into
  the hook makes the reel loop cleanly.

## Workflow

1. Join and convert the footage, find the pauses, and read the SRT (snap SRT times to the pauses).
2. Map each SRT phrase to a beat type from the table above, and write that mapping out first.
3. Copy `InstaShareMix.tsx`, then fill in the phrases, windows, punches/flashes,
   inserts and SFX. Register it in `Root.tsx`, awaiting every style's fonts that
   it uses (plus `fontsLoaded` if it uses `src/Overlays.tsx`).
4. Check stills, then render. If the file is over 30 MB, send a compressed copy
   and offer the original split into parts.
