// ستايل سايا — component gallery on one timeline (for checking stills, not a
// montage). Copy this file as the starting point for a real Saya edit: swap
// the footage, paste the SRT, and time the graphics/sounds to the words.
// Preview images live in public/footage/ (git-ignored): kit-bg.jpg (a still
// of the speaker), kit-screen.jpg (phone screen), kit-article.jpg (screenshot).
import {siClaude, siGooglechrome, siGooglegemini, siInstagram} from "simple-icons";
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_KIT_FRAMES = 420;

const SRT = `1
00:00:00,000 --> 00:00:02,000
إنستغرام نزّل ميزة جديدة

2
00:00:02,000 --> 00:00:04,500
اسمها Instants ومخفية بالإعدادات

3
00:00:04,500 --> 00:00:07,000
افتحوا الإعدادات وروحوا على

4
00:00:07,000 --> 00:00:09,500
وبكبسة وحدة بتطفوها

5
00:00:09,500 --> 00:00:12,000
وإذا بتستخدموا Gemini أو Claude أو Chrome

6
00:00:12,000 --> 00:00:14,000
احفظوا الفيديو لترجعولو`;

export const sayaKitProps: SayaEditProps = {
  footage: "footage/kit-bg.jpg",
  isImage: true,
  face: {x: 560, y: 640, w: 380},
  srt: SRT,
  zooms: [
    {at: 0, scale: 1},
    {at: 60, scale: 1.14}, // punch-in on a cut
    {at: 210, scale: 1.0},
    {at: 240, scale: 1.08, mode: "slow", dur: 45},
    {at: 400, scale: 1.2, mode: "fast"},
  ],
  pip: [[75, 210]],
  blur: [[285, 360]],
  whips: [75],
  places: [
    {at: 0, y: 1150},
    {at: 75, y: 330}, // phone in the middle → caption goes up (R3)
    {at: 210, y: 1150},
    {at: 285, y: 1300},
    {at: 360, y: 1150},
  ],
  graphics: [
    {type: "logo", at: 2, dur: 50, logo: {icon: siInstagram}, place: {x: 820, y: 430}, size: 150},
    {type: "phone", at: 75, dur: 135, src: "footage/kit-screen.jpg", taps: [{at: 60, x: 520, y: 1330}]},
    {type: "feature", at: 120, dur: 40, text: "Content Preferences"},
    {
      type: "logoStack",
      at: 285,
      dur: 75,
      items: [
        {logo: {icon: siGooglegemini}, at: 0},
        {logo: {icon: siClaude}, at: 14},
        {logo: {icon: siGooglechrome}, at: 28},
      ],
      focus: {index: 1, at: 50},
    },
    {type: "save", at: 362, dur: 58},
  ],
  sfx: [
    {at: 2, sfx: "blink-bell"},
    {at: 60, sfx: "whoosh-1"},
    {at: 75, sfx: "sweep-up"},
    {at: 120, sfx: "ui-select"},
    {at: 135, sfx: "ui-select"},
    {at: 285, sfx: "click"},
    {at: 299, sfx: "click"},
    {at: 313, sfx: "click"},
    {at: 335, sfx: "shining"},
    {at: 374, sfx: "ding"},
    {at: 400, sfx: "whoosh-zoom"},
  ],
};

export const SayaKitPreview: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;

// ---------------------------------------------------------------------------
// Second gallery: the pieces ported from ستايل 1–4 (titles, doodles, neon
// icons, list / strike stages, stat, prompt, REC, notification, flash). Each
// piece gets its own 3-second window so stills can be checked one by one.
export const SAYA_KIT_MORE_FRAMES = 630;

const SRT_MORE = `1
00:00:00,000 --> 00:00:03,000
أغلب الناس بتشحن جوالها غلط

2
00:00:03,000 --> 00:00:06,000
ثلاث إعدادات بتغيّر كل شي

3
00:00:06,000 --> 00:00:09,000
هاد غلط وهاد الصح

4
00:00:09,000 --> 00:00:12,000
ووفّرت تسعين بالمية من الوقت

5
00:00:12,000 --> 00:00:15,000
أولاً افتح الإعدادات

6
00:00:15,000 --> 00:00:18,000
وصلتني رسالة جديدة

7
00:00:18,000 --> 00:00:21,000
احفظ الفيديو وابعته`;

export const sayaKitMoreProps: SayaEditProps = {
  ...sayaKitProps,
  srt: SRT_MORE,
  zooms: [{at: 0, scale: 1}, {at: 270, scale: 1.12}],
  pip: [],
  blur: [[270, 360], [585, 630]],
  whips: [],
  places: [],
  graphics: [
    // 0–90: hook title above the head + doodles
    {type: "title", at: 0, dur: 90, small: "عادة غلط", big: "جوالك بيتعب", squiggle: true},
    {type: "doodle", at: 20, dur: 70, kind: "curlyArrow", x: 900, y: 900, size: 190},
    {type: "doodle", at: 30, dur: 60, kind: "circle", x: 540, y: 1250, w: 380, h: 170},
    {type: "doodle", at: 40, dur: 50, kind: "burst", x: 880, y: 560, size: 120},
    // 90–180: list stage
    {type: "list", at: 90, dur: 90, items: [{label: "المشكلة", icon: "alert", tone: "red", sub: "البطارية بتخلص"}, {label: "الحل", icon: "check", tone: "green", sub: "الشحن المحسّن"}]},
    // 180–270: strike stage
    {type: "strike", at: 180, dur: 90, lines: [{text: "اشحن لحد 100", at: 4, strike: true}, {text: "اشحن لحد 80", at: 30}]},
    // 270–360: stat + red scribble
    {type: "stat", at: 270, dur: 90, value: 90, suffix: "%", label: "وقت أقل"},
    {type: "doodle", at: 290, dur: 70, kind: "redArrow", x: 820, y: 700, size: 170, flip: true},
    // 360–450: section number + neon label
    {type: "section", at: 360, dur: 45, text: "أولاً", y: 150},
    {type: "neonLabel", at: 405, dur: 45, icon: "bulb", label: "فكرة", top: 150},
    // 450–540: neon path + REC
    {type: "neonPath", at: 450, dur: 90, icons: ["bookmark", "user", "plane"], top: 60},
    {type: "rec", at: 470, dur: 70},
    // 540–600: notification + prompt
    {type: "notification", at: 540, dur: 45, app: "Instagram", title: "رسالة جديدة", body: "سارة: شفتي الريل؟", top: 300},
    {type: "prompt", at: 585, dur: 45, text: "لخّصلي هالفيديو بثلاث نقاط", sendAt: 30},
    // flash on a section change
    {type: "flash", at: 270, dur: 10},
  ],
  sfx: [],
};

export const SayaKitMore: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;

// ---------------------------------------------------------------------------
// Third gallery: pieces learned from reference R6 (sketch icons, imported
// stickers, desktop card + PiP, chat exchange, viewfinder timecode) and the
// optional cinema grade. kit-desktop.jpg = any landscape screenshot.
export const SAYA_KIT_R6_FRAMES = 450;

export const sayaKitR6Props: SayaEditProps = {
  ...sayaKitProps,
  srt: `1
00:00:00,000 --> 00:00:03,000
شو يعني مهارة أصلاً؟

2
00:00:03,000 --> 00:00:06,000
خطرتلي فكرة حلوة

3
00:00:06,000 --> 00:00:10,000
افتحوا محادثة جديدة

4
00:00:10,000 --> 00:00:13,000
اكتبلي سكريبت فيديو

5
00:00:13,000 --> 00:00:15,000
وهيك صوّرتها`,
  grade: "cinema",
  gradeIntensity: 0.5,
  zooms: [{at: 0, scale: 1}],
  pip: [[180, 300], [320, 405]],
  pipPlace: {x: 70, y: 250, d: 230},
  blur: [],
  whips: [],
  places: [],
  graphics: [
    {type: "sketch", at: 0, dur: 90, kind: "question", x: 540, y: 330, spread: 330},
    {type: "sketch", at: 90, dur: 90, kind: "bulb", x: 300, y: 330},
    {type: "sticker", at: 100, dur: 80, src: "assets/icons/emoji-light-bulb.svg", x: 820, y: 360, size: 170},
    {type: "desktop", at: 180, dur: 120, src: "footage/kit-desktop.jpg", aspect: 1264 / 843, top: 380},
    {type: "chat", at: 300, dur: 105, prompt: "اكتبلي سكريبت فيديو للانستغرام", answer: ["الهوك:", "يومك بيضيع بسرعة؟", "المحاور:", "أولاً: قاعدة الدقيقتين", "ثانياً: بلوكات الوقت", "ثالثاً: الموبايل بعيد", "الخاتمة:", "احفظ الفيديو"], answerAt: 20},
    {type: "rec", at: 405, dur: 45, timecode: true, startSeconds: 81},
  ],
  sfx: [],
};

export const SayaKitR6: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
