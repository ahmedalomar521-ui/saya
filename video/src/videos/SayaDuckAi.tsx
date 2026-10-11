// سايا — "duck.ai" (first trial edit, 2026-10-11). ستايل سايا (saya_editor).
// Footage + assets in public/footage/duck/ (git-ignored). Frames = SRT words
// at 30 fps (see srt.ts). Every treatment is used once (feedback rule 1).
import {siClaude, siDuckduckgo, siGoogle, siMistralai} from "simple-icons";
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_DUCK_FRAMES = 912; // 30.4 s

const SRT = `1
00:00:00,100 --> 00:00:00,700
اذا بدك

2
00:00:00,700 --> 00:00:01,766
تستخدم كل ادوات

3
00:00:01,866 --> 00:00:03,300
الذكاء الاصطناعي ببلاش

4
00:00:03,366 --> 00:00:04,666
وبدون حتى ما تعمل حساب

5
00:00:05,200 --> 00:00:06,766
فلازم تجرب موقع داك

6
00:00:06,900 --> 00:00:07,500
اي اي

7
00:00:07,500 --> 00:00:08,300
انت كل اللي عليك

8
00:00:08,400 --> 00:00:09,300
تدخل على الموقع

9
00:00:09,366 --> 00:00:09,900
وتسال

10
00:00:09,900 --> 00:00:11,800
اي شيء بيخطر على بالك مباشرة

11
00:00:11,900 --> 00:00:13,166
واذا ما اقنعك الجواب

12
00:00:13,400 --> 00:00:14,266
ببساطة غير

13
00:00:14,366 --> 00:00:14,900
الموديل

14
00:00:14,900 --> 00:00:16,666
لحتى تاخذ النتيجة اللي بترضيك

15
00:00:16,800 --> 00:00:18,000
بامكانك حتى تنشئ

16
00:00:18,166 --> 00:00:19,100
صور بشكل مجاني

17
00:00:19,266 --> 00:00:20,766
وعدا عن هالمميزات كلها

18
00:00:20,966 --> 00:00:22,100
المفروض الموقع بيشيل

19
00:00:22,166 --> 00:00:23,266
المعلومات التعريفية

20
00:00:23,466 --> 00:00:24,266
متل اي بي

21
00:00:24,300 --> 00:00:25,100
ادرس يعني

22
00:00:25,500 --> 00:00:26,333
امن وشبه

23
00:00:26,466 --> 00:00:27,400
مستحيل التتبع

24
00:00:27,700 --> 00:00:28,466
وتابعني

25
00:00:28,466 --> 00:00:29,566
للمزيد من الحيل

26
00:00:29,700 --> 00:00:30,366
التقنية`;

const openai = {src: "footage/duck/openai-white.png", color: "#10A37F"};

export const sayaDuckProps: SayaEditProps = {
  footage: "footage/duck/saya.mp4",
  face: {x: 555, y: 690, w: 330},
  srt: SRT,
  zooms: [
    {at: 0, scale: 1},
    {at: 87, scale: 1.15, mode: "fast"}, // "ببلاش" — fast zoom (once)
    {at: 156, scale: 1.0}, // "فلازم" — punch-out on the new idea (once)
    {at: 545, scale: 1.08, mode: "slow", dur: 70}, // image beat — slow push (once)
    {at: 629, scale: 1.12}, // hidden inside the whip (once)
  ],
  pip: [[252, 356]],
  blur: [[402, 500]],
  whips: [629],
  places: [
    {at: 0, y: 1150},
    {at: 252, y: 330}, // phone in the middle → caption up
    {at: 356, y: 1150},
    {at: 402, y: 330}, // screenshot card → caption up
    {at: 500, y: 1150},
  ],
  graphics: [
    // Hook — the AI models on duck.ai stack above the head (logo stack: once)
    {
      type: "logoStack",
      at: 21,
      dur: 119,
      items: [
        {logo: openai, at: 0},
        {logo: {icon: siClaude}, at: 10},
        {logo: {icon: siMistralai}, at: 20},
        {logo: {icon: siGoogle}, at: 30},
      ],
    },
    {type: "bigWord", at: 87, dur: 14, text: "ببلاش"},
    // "داك اي اي" — DuckDuckGo logo in the caption's place (logo pop: once)
    {type: "logo", at: 193, dur: 32, logo: {icon: siDuckduckgo, name: "Duck.ai"}},
    // "تدخل على الموقع وتسأل" — phone with the screen recording + PiP (once)
    {type: "phone", at: 252, dur: 104, src: "footage/duck/ask-recording.mp4", isVideo: true, trimBefore: 240, playbackRate: 3.2},
    // "غيّر الموديل" — the model menu as a screenshot card (once) + feature pill (once)
    {type: "screenshot", at: 402, dur: 98, src: "footage/duck/model-menu-crop.jpg", aspect: 1.08, centerY: 840},
    {type: "feature", at: 431, dur: 16, text: "غيّر الموديل", y: 1330},
    // "تنشئ صور" — the generated image in a floating window above the head (once)
    {type: "floating", at: 545, dur: 45, src: "footage/duck/donkey.jpg", aspect: 1.05, width: 330, top: 330, x: 230, label: "GPT Image 2"},
    // "اي بي ادرس" — info chip (once)
    {type: "chip", at: 704, dur: 50, title: "IP address", label: "مخفي عن صاحب المودل", icon: "🔒", y: 1330},
    // "امن" — the site's own privacy line as a source tag (once)
    {type: "source", at: 765, dur: 60, text: "Privacy protected and anonymized by DuckDuckGo", y: 1290},
    // "تابعني" — follow card (once)
    {type: "follow", at: 831, dur: 81, avatar: "footage/duck/avatar.jpg", handle: "saya_.tech", y: 1330, pressAt: 32},
  ],
  sfx: [
    {at: 21, sfx: "click"},
    {at: 31, sfx: "shutter-click"},
    {at: 41, sfx: "ui-select"},
    {at: 51, sfx: "small-swoosh"},
    {at: 87, sfx: "boom"},
    {at: 156, sfx: "whoosh-1"},
    {at: 193, sfx: "shining"},
    {at: 252, sfx: "sweep-up"},
    {at: 262, sfx: "keyboard", frames: 60},
    {at: 402, sfx: "swish-whoosh"},
    {at: 431, sfx: "ui-select", volume: 0.3},
    {at: 545, sfx: "power-up"},
    {at: 629, sfx: "whoosh-2"},
    {at: 704, sfx: "glitch"},
    {at: 765, sfx: "stamp"},
    {at: 863, sfx: "ding"}, // follow button pressed
  ],
};

export const SayaDuckAi: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
