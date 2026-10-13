// سايا — تنزيل أي فيديو بتلات خطوات (Publer)، 2026-10-13. ستايل سايا.
// Footage + assets in public/footage/publer/ (git-ignored). rec-edit.mp4 is the
// user's two screen recordings cut and retimed to the words, with contacts,
// gallery photos and the app name blurred. The app name stays hidden until
// "اسمه Publer" (frame 897). Caption fixes: بابلر → Publer, بنزل → بينزل,
// وبيبعت لك اياه → وببعتلك ياه (user's request).
import {siFacebook, siGoogleplay, siInstagram, siTiktok, siX, siYoutube} from "simple-icons";
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_PUBLER_FRAMES = 1067; // 35.6 s

const SRT = `1
00:00:00,166 --> 00:00:01,700
بتلات خطوات بتنزل

2
00:00:01,800 --> 00:00:02,600
اي فيديو

3
00:00:02,700 --> 00:00:03,600
من اي منصة

4
00:00:03,800 --> 00:00:04,666
وبلا علامة

5
00:00:04,766 --> 00:00:06,266
مائية بس قبل ما اقلك

6
00:00:06,366 --> 00:00:07,166
اسم التطبيق

7
00:00:07,166 --> 00:00:07,533
انسى

8
00:00:07,533 --> 00:00:09,266
كل التطبيقات الغريبة اللي بتعبي

9
00:00:09,333 --> 00:00:10,200
جوالك اعلانات

10
00:00:10,533 --> 00:00:11,800
لانه التطبيق مجاني

11
00:00:12,000 --> 00:00:14,266
بينزل على الاندرويد والايفون حتى

12
00:00:14,766 --> 00:00:15,566
وكل اللي عليك

13
00:00:15,800 --> 00:00:17,066
تنزله من المتجر

14
00:00:17,400 --> 00:00:17,900
وبعدين

15
00:00:17,900 --> 00:00:20,100
انسخ رابط اي فيديو بدك تنزله

16
00:00:20,266 --> 00:00:21,400
من اي منصة كانت

17
00:00:21,900 --> 00:00:22,800
وافتح التطبيق

18
00:00:23,100 --> 00:00:23,933
الصق الرابط

19
00:00:24,066 --> 00:00:24,866
ومبروك عليك

20
00:00:25,133 --> 00:00:25,766
صار الفيديو

21
00:00:25,766 --> 00:00:26,733
بالاستديو عندك

22
00:00:26,866 --> 00:00:28,500
وبدقته الاصلية كمان

23
00:00:29,000 --> 00:00:30,333
التطبيق اسمه Publer

24
00:00:30,466 --> 00:00:32,000
واذا بدك رابط التنزيل

25
00:00:32,366 --> 00:00:33,500
تابعني وعلق

26
00:00:33,600 --> 00:00:35,500
Publer وببعتلك ياه عالخاص`;

const CARD = {at: 516, end: 862};

export const sayaPublerProps: SayaEditProps = {
  footage: "footage/publer/saya.mp4",
  face: {x: 545, y: 690, w: 150},
  srt: SRT,
  zooms: [
    {at: 0, scale: 1.3}, // wide shot: base framing closer on her
    {at: 155, scale: 1.55}, // "بس قبل ما قلك" — punch-in (once)
    {at: 215, scale: 1.3},
    {at: 316, scale: 1.42, mode: "slow", dur: 100}, // "مجاني… الاندرويد والايفون" — slow push (once)
    {at: 470, scale: 1.3},
    {at: 895, scale: 1.62, mode: "fast"}, // "اسمه Publer" — fast zoom on the reveal (once)
    {at: 914, scale: 1.35},
  ],
  pip: [[CARD.at, CARD.end]],
  pipPlace: {x: 50, y: 300, d: 220},
  places: [
    {at: 0, y: 1270},
    {at: CARD.at, y: 1360},
    {at: CARD.end, y: 1270},
  ],
  hide: [[0, 53]], // the hook title says it
  graphics: [
    // Hook — "3 خطوات" above her head (title: once)
    {type: "title", at: 5, dur: 46, big: "3 خطوات", y: 430, squiggle: true},
    // "من أي منصة" — the platforms pop in a row (logoStack: once)
    {
      type: "logoStack",
      at: 89,
      dur: 52,
      items: [
        {logo: {icon: siInstagram}, at: 0},
        {logo: {icon: siTiktok}, at: 6},
        {logo: {icon: siYoutube}, at: 12},
        {logo: {icon: siFacebook}, at: 18},
        {logo: {icon: siX}, at: 24},
      ],
    },
    // "وبلا علامة مائية" — big word in the caption's place (once)
    {type: "bigWord", at: 114, dur: 32, text: "بلا علامة مائية"},
    // "قبل ما قلك اسم التطبيق" — "?" marks in the headroom (sketch: once)
    {type: "sketch", at: 186, dur: 28, kind: "question", x: 545, y: 400, spread: 250, color: "#8FD3FF"},
    // "بتعبي جوالك اعلانات" — a spammy ad notification (once)
    {type: "notification", at: 262, dur: 46, app: "إعلان", title: "مبروك! ربحت آيفون 🎁", body: "اضغط هون لتستلم جائزتك…", top: 300},
    // "مجاني" — price 0 (stat: once)
    {type: "stat", at: 340, dur: 34, value: 0, suffix: "$", label: "السعر", centerY: 400},
    // "الاندرويد والايفون" — the two systems beside her (stickers)
    {type: "sticker", at: 380, dur: 62, src: "assets/icons/android-green.svg", x: 230, y: 520, size: 150},
    {type: "sticker", at: 400, dur: 42, src: "assets/icons/apple-white.svg", x: 850, y: 510, size: 140, glow: true},
    // Step 1 — "تنزله من المتجر" + the store logo in the caption's place
    {type: "step", at: 474, dur: 40, text: "الخطوة 1", y: 430},
    {type: "logo", at: 496, dur: 20, logo: {icon: siGoogleplay, name: "Google Play", color: "#01875F"}},
    // Steps 2–3 — the real recording in a glowing card, Saya in the bubble (desktop + pip: once)
    {type: "desktop", at: CARD.at, dur: CARD.end - CARD.at, src: "footage/publer/rec-edit.mp4", isVideo: true, aspect: 1080 / 2170, width: 500, height: 1005, top: 285},
    {type: "step", at: 537, dur: 40, text: "الخطوة 2", x: 165, y: 650},
    {type: "tap", at: 598, dur: 15, x: 765, y: 1205}, // نسخ الرابط
    {type: "step", at: 657, dur: 40, text: "الخطوة 3", x: 165, y: 650},
    {type: "tap", at: 667, dur: 15, x: 461, y: 571}, // Free Social Media Downloader
    {type: "tap", at: 716, dur: 15, x: 523, y: 1004}, // paste
    {type: "tap", at: 725, dur: 15, x: 540, y: 920}, // Download
    // The reveal — "اسمه Publer": the real logo above her head + the name pill (feature: once)
    {type: "sticker", at: 895, dur: 72, src: "footage/publer/publer-word.png", x: 540, y: 390, size: 440},
    {type: "feature", at: 897, dur: 17, text: "Publer"},
    // "تابعني" then "وعلق Publer" — follow, then a comment being typed (once each)
    {type: "follow", at: 965, dur: 28, avatar: "footage/publer/avatar.jpg", handle: "saya_.tech", y: 1110, pressAt: 10},
    {type: "prompt", at: 995, dur: 72, text: "Publer", placeholder: "أضف تعليقاً…", sendAt: 40, centerY: 1080},
  ],
  sfx: [
    {at: 89, sfx: "blink-bell"},
    {at: 155, sfx: "whoosh-zoom"},
    {at: 262, sfx: "notification"},
    {at: 340, sfx: "cash-register"},
    {at: 474, sfx: "ui-select"},
    {at: 514, sfx: "swish-whoosh"},
    {at: 598, sfx: "ui-select"},
    {at: 667, sfx: "click"},
    {at: 736, sfx: "ding"},
    {at: 862, sfx: "whoosh-2"},
    {at: 895, sfx: "shining"},
    {at: 975, sfx: "click"},
    {at: 1000, sfx: "keyboard"},
  ],
};

export const SayaPubler: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
