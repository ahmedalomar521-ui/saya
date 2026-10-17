# Cover prompt (the user generates the cover himself; user decision 2026-10-17)

The user takes (1) Saya's parent image (same angle, outfit and studio every time) and (2) the prompt below, filled in
for the video, to ChatGPT or Gemini. He then uses the generated image as the reel cover. Claude gives the filled prompt
after the video is made. Claude cannot generate or edit the face (Gemini image generation is off for our key).

Risk to say out loud every time: image models often get Arabic letters wrong. The user checks the two title lines letter
by letter. If the text is wrong, fall back: generate the expression only (no text, no icons) and Claude adds the title
and the icons with `build_cover.py` (`"style": "studio"`), where the Arabic is exact.

## Template (fill the braces)

```
Image 1 is the parent photo of Saya. Keep her face, glasses, sky-blue hijab, outfit, the studio and the camera angle
exactly identical. Make a vertical 9:16 social-media cover from it.

1. Change ONLY her expression: {expression, e.g. "surprised: eyebrows raised, eyes wide, mouth slightly open, looking
   into the lens"}. Keep both hands anatomically correct with five fingers.
2. Title, in the top part of the frame ABOVE her head, never touching her head or hair. If there is no room, shrink the
   whole photo a little and extend the dark navy background at the top. Two lines, centred, extra-bold Arabic font in the
   style of Cairo, with a soft dark shadow:
   - Line 1 in white: "{line1}"
   - Line 2 in sky blue #8FD3FF with a soft blue glow: "{line2}"
   Write the Arabic EXACTLY as given, letters correctly connected, no extra words, no other text anywhere.
3. Add {2-4} floating rounded-square cards of frosted glass with a thin glowing sky-blue border, slightly rotated, placed
   left and right of her at shoulder and desk height, never covering her face or hands. Each card holds one thin
   white line icon with a soft glow: {icon 1}, {icon 2}, {icon 3}.
4. Keep everything important inside the central band of the frame (about the middle 75% vertically). No logos, no
   watermark, one single photograph.
```

## Rules for the fields
- **line1:** the thing (a name or a topic), white. **line2:** the benefit or the question, sky blue. Up to 5 words in all.
- **expression:** from `cover-designer/references/thumbnail-rules.md` (surprise, curiosity, excitement, concern, confidence).
- **icons:** 2–4, each tied to the video (a toggle for "activity status", an eye for "hidden", a lock for privacy...).
