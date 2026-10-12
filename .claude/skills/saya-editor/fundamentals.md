# Editing fundamentals (measured from the 5 references)

These are the basics every Saya edit follows. The numbers come from measuring the
reference videos (audio analysis plus 4 fps frame sheets), not from guesses.

## 1. Cutting the silences (قص السكتات) — manual only

Saya is AI-generated, so her takes usually have no silences. **Do not cut
silences unless the user asks** ("قص السكتات"). When they ask:

- The references keep **no pause longer than 0.1–0.22 s** after editing.
- Detect pauses with `silencedetect=n=-32dB:d=0.12`. Remove pauses > 0.15 s,
  keeping 0.04 s before and 0.06 s after each word.
- Shift the SRT times by the removed spans, so the captions stay in sync.
- Snap cuts to zero-crossings, or use a 2-frame audio crossfade. Cover a jump
  cut with a punch-in or a graphic.

## 2. Sound design (المؤثرات الصوتية) — base: R2, accents: R4

How we measured: spectrograms and transient detection, matched to the frames
where graphics appear. Claude cannot *listen*; it sees the sound's shape. The
choice of the actual sound files is therefore the user's (see `sfx/` below).

**Music bed.** R1, R2 and R5 keep a continuous low music bed under the voice
(in the pauses it is only about 14 dB below the speech). R3 and R4 keep it almost
silent.
- Saya: a soft electronic/tech bed at **-22 to -26 dB under the voice**,
  ducked further while she speaks.
- **Music drop (from R2):** cut the music for about 1 s right before the key
  reveal or the screen demo (R2 does it at 9.9–11 s), then bring it back.

**Every graphic that enters gets a sound (R2's rule).** The sound files and
the full "when to use which" guide (taught by the user's SFX videos) are in
`sfx.md` and `video/src/styles/saya/sfx.ts`. Quick mapping:

| Event | Sound | Seen in |
|---|---|---|
| Keyword / caption graphic pops | soft **pop** or **click** | R2 6.2 s, 7.4 s |
| App icon or logo appears | short **shimmer/chime** (tonal, ~0.6 s, ~2 kHz) | R2 4.2 s, R4 1.0 s |
| Save / like / success | **ding** (tonal ~2.7 kHz, ~0.8 s) | R2 9.8 s (bookmark) |
| Cut to a new scene / screen recording | **whoosh** + light **hit** | R2 5.0 s, 11 s |
| Phone mock-up rises from the bottom | **swoosh up** + soft **sub-bass swell** under it | R4 4–11 s |
| Tap / toggle in a UI demo | **UI click** | R2 screen rec, R4 toggles |
| Step pill ("الخطوة الثانية") | **pop** | R2 16.9 s, 24.3 s |

- SFX sit **-10 to -14 dB below the voice**. They must never cover a word. Shift
  them up to 2 frames early so the sound lands *with* the visual.
- At most one SFX every ~0.5 s. When graphics stack, only the first one gets a
  sound.

## 3. Visual effects (المؤثرات البصرية) — base: R5, plus R3/R4

Footage colour stays untouched (house rule 1). Every effect below is motion,
blur or framing, never a colour grade.

- **Punch-in / punch-out on jump cuts (R5):** alternate framing between
  scale **1.00** and **1.12–1.18** at each cut (centred on the face). Use a
  **slow zoom-in** (1.00 → 1.06 over the sentence) to build towards a key line,
  and a **fast zoom-in** (6–8 frames, ease-out) on the punchline.
- **Background blur for graphics (R3/R4/R5):** when a graphic takes over, blur
  the footage (0 → 18–24 px in 6–8 frames). It stays visible behind the
  graphic. Unblur when it ends.
- **Phone mock-up (R3/R4):** it rises from below with a spring (slight
  overshoot) in about 10 frames. The creator shrinks into a **circular PiP
  bubble** in the top corner with a glowing ring (R4).
- **Screenshot card (R5):** a white-bordered rounded card slides in with
  vertical motion blur (6 frames) and sits at full width minus the margins.
- **Whip transition (R4):** a 4–6 frame directional motion blur between the
  talking head and the screen content, synced with a whoosh.
- **Logo on mention (R5):** when an app or brand is **said**, its logo pops in
  (scale 0.6 → 1 with a spring) exactly on the word, in the caption's place or
  beside the head. Several logos named in a row stack in the top corners. The
  one being discussed zooms to the centre.

## 4. Instagram safe zone (1080×1920)

Keep captions and important graphics inside **x 80–940, y 280–1400**. Leave:
- the top 280 px clear (Reels header),
- the bottom 520 px clear (username, caption text, audio bar),
- the right 140 px clear (like, comment, share buttons).
