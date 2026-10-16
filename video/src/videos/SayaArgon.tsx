// سايا — جيميناي 4 أرغون: هل بيستاهل تدفع؟، 2026-10-16. ستايل سايا.
// Footage in public/footage/argon/ (git-ignored): saya.mp4 = HeyGen, three parts
// (new sky-blue tunic image, plain version of the script) joined at pauses:
//   P1 0–16.55 s, P2 0.80–13.82 s (its first word "أكيد" is not in the script, cut),
//   P3 0.36–end. The parts are separate TTS runs, so they are cut at silences and the
//   joins (frames 497 and 887) are hidden under a punch-in.
// ad.mp4 = Google's own Arabic Gemini 4 Argon ad (user's screen recording, no voice).
// The wall lights shift colours in the footage; the user likes it (2026-10-16).
// Captions sit on the dark gradient under the desk: no outline needed.
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_ARGON_FRAMES = 1290; // 43.0 s

// Timed on the speech segments between silences of the joined footage.
const SRT = `1
00:00:00,120 --> 00:00:02,050
إذا مفكر جيميناي صار قديم…

2
00:00:02,480 --> 00:00:02,770
وقّف.

3
00:00:03,400 --> 00:00:05,430
جوجل نزّلت جيميناي فور أرغون…

4
00:00:05,820 --> 00:00:07,510
وإنت يمكن ما رح تشوفه.

5
00:00:07,930 --> 00:00:08,430
ليش؟

6
00:00:08,820 --> 00:00:10,390
وهل بيستاهل تدفع عشانه؟

7
00:00:10,820 --> 00:00:11,750
بقولك بالآخر.

8
00:00:12,260 --> 00:00:16,440
جوجل بتقول إنو أقوى نماذجها، ومصمم للمهام المعقدة.

9
00:00:16,650 --> 00:00:18,460
بس هون الشي اللي ما حدا بيحكيه…

10
00:00:18,880 --> 00:00:23,380
إنو هلق الموديل متاح بتطبيق جيميناي بس لمشتركي برو وألترا.

11
00:00:23,840 --> 00:00:24,670
أما المجاني؟

12
00:00:25,110 --> 00:00:25,530
لسا لا.

13
00:00:26,110 --> 00:00:27,690
فهل بيستاهل تدفع عشانه؟

14
00:00:28,150 --> 00:00:31,740
برأيي، إذا استخدامك يومي، يعني تلخيص وشرح وأسئلة،

15
00:00:32,110 --> 00:00:33,520
النسخة اللي عندك بتكفي.

16
00:00:33,960 --> 00:00:37,090
أما إذا شغلك مهام كبيرة وطويلة ومعقدة،

17
00:00:37,370 --> 00:00:38,490
وقتها بيفرق معك.

18
00:00:38,970 --> 00:00:42,760
وتابعني لتوصلك أخبار الذكاء الاصطناعي أول بأول.
`;

const F = "footage/argon/";
const AD = F + "ad.mp4";

export const sayaArgonProps: SayaEditProps = {
  footage: F + "saya.mp4",
  face: {x: 640, y: 470, w: 215},
  srt: SRT,
  // captions sit over the bright desk: dark outline all through (no colour change to the footage)
  places: [{at: 0, y: 1500}],
  onLight: [[0, SAYA_ARGON_FRAMES]],
  zooms: [
    {at: 0, scale: 1.1},
    {at: 74, scale: 1.26, mode: "fast"}, // "وقّف."
    {at: 92, scale: 1.1},
    {at: 236, scale: 1.24}, // "ليش؟"
    {at: 262, scale: 1.1},
    {at: 497, scale: 1.24, mode: "slow", dur: 60}, // join 1 — "بس هون الشي اللي ما حدا بيحكيه"
    {at: 566, scale: 1.1},
    {at: 715, scale: 1.22}, // "أما المجاني؟"
    {at: 753, scale: 1.32, mode: "fast"}, // "لسا لا."
    {at: 770, scale: 1.1},
    {at: 887, scale: 1.24}, // join 2 — hidden under the punch-in
    {at: 963, scale: 1.1},
    {at: 1121, scale: 1.26}, // "وقتها بيفرق معك."
    {at: 1150, scale: 1.1},
  ],
  graphics: [
    {type: "title", at: 5, dur: 85, small: "جوجل نزّلت جيميناي 4", big: "أرغون", y: 175, squiggle: true},
    // "مصمم للمهام المعقدة" — Google's own ad
    {type: "split", at: 368, dur: 125, source: "Google", items: [{at: 0, src: AD, isVideo: true, from: 16.5}]},
    // "متاح بس لمشتركي برو وألترا" — the ad's own end card says it
    {type: "split", at: 566, dur: 135, source: "Google", items: [{at: 0, src: AD, isVideo: true, from: 22.2}]},
    {type: "bigWord", at: 750, dur: 30, text: "لسا لا"},
    {type: "follow", at: 1169, dur: 121, avatar: "footage/apple/avatar.jpg", handle: "saya_.tech", y: 1250, pressAt: 20},
  ],
  sfx: [
    {at: 5, sfx: "cinematic-whoosh", volume: 0.2},
    {at: 74, sfx: "impact-deep", volume: 0.16},
    {at: 368, sfx: "swish-whoosh"},
    {at: 497, sfx: "whoosh-zoom", volume: 0.2},
    {at: 566, sfx: "swish-whoosh"},
    {at: 750, sfx: "badum-tss", volume: 0.25},
    {at: 1191, sfx: "click"},
  ],
};

export const SayaArgon: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
