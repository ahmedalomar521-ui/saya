// سايا — أذونات Chrome الخطيرة (2026-10-11). ستايل سايا (saya_editor).
// Footage + assets in public/footage/chrome/ (git-ignored). Frames = SRT words
// at 30 fps. Every treatment is used once (feedback rule 1).
import {siGooglechrome} from "simple-icons";
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_CHROME_FRAMES = 1203; // 40.1 s

const SRT = `1
00:00:00,166 --> 00:00:01,300
اذونات خطيرة

2
00:00:01,366 --> 00:00:03,500
ما بتعرف حتى انك اعطيها لكروم

3
00:00:03,766 --> 00:00:04,600
لحتى توقفه

4
00:00:04,766 --> 00:00:05,933
تعال فرجيك وين موجودة

5
00:00:06,066 --> 00:00:06,866
هالاعدادات

6
00:00:07,266 --> 00:00:08,100
افتح كروم

7
00:00:08,266 --> 00:00:09,666
واضغط على تلات نقاط

8
00:00:09,966 --> 00:00:11,333
بعدها ادخل على الاعدادات

9
00:00:11,866 --> 00:00:13,366
وبعدها اعدادات الموقع

10
00:00:13,700 --> 00:00:15,300
اول شيء راجع خيار

11
00:00:15,366 --> 00:00:17,500
ملفات تعريف الارتباطات الخارجية

12
00:00:17,666 --> 00:00:19,066
وشوف اذا بدك تحضرها

13
00:00:19,400 --> 00:00:20,266
وبعدها راجع

14
00:00:20,366 --> 00:00:21,566
صلاحيات المواقع

15
00:00:21,766 --> 00:00:23,133
مثل الموقع الجغرافي

16
00:00:23,266 --> 00:00:24,100
والمايكروفون

17
00:00:24,266 --> 00:00:25,066
والكاميرا

18
00:00:25,133 --> 00:00:26,800
او حتى الاستديو والملفات

19
00:00:26,900 --> 00:00:28,133
لانه ممكن تكون موجودة

20
00:00:28,500 --> 00:00:30,400
اذا بدك تمنعها او تخليها تطلب

21
00:00:30,566 --> 00:00:31,566
اذنك قبل الاستخدام

22
00:00:31,733 --> 00:00:32,700
فهات شانك

23
00:00:32,966 --> 00:00:33,700
ابعت الفيديو

24
00:00:33,700 --> 00:00:35,333
لصاحبك اللي ما بيحب خصوصيته

25
00:00:35,400 --> 00:00:37,000
تتسرب وبالنهاية

26
00:00:37,400 --> 00:00:38,466
درهم وقاية

27
00:00:38,566 --> 00:00:39,866
خير من قنطار علاج`;

const perm = (src: string, color: string) => ({src, color});

export const sayaChromeProps: SayaEditProps = {
  footage: "footage/chrome/saya.mp4",
  face: {x: 540, y: 660, w: 300},
  srt: SRT,
  zooms: [
    {at: 0, scale: 1},
    {at: 22, scale: 1.15, mode: "fast"}, // "خطيرة" — fast zoom (once)
    {at: 143, scale: 1.06}, // hidden in the whip (once)
    {at: 578, scale: 1.0},
    {at: 993, scale: 1.12}, // "ابعت الفيديو" — punch-in (once)
    {at: 1122, scale: 1.22, mode: "slow", dur: 78}, // proverb — slow push (once)
  ],
  whips: [143],
  pip: [[218, 578]],
  blur: [[855, 967], [1122, 1200]],
  places: [
    {at: 0, y: 1270},
    {at: 218, y: 340}, // phone → caption up
    {at: 578, y: 1270},
    {at: 855, y: 340}, // permission card → caption up
    {at: 967, y: 1270},
  ],
  hide: [[1122, 1203]], // the proverb is said by the glass card
  graphics: [
    // Hook — Chrome logo beside the head (logo: once) + "خطيرة" big word (once)
    {type: "logo", at: 4, dur: 100, logo: {icon: siGooglechrome}, place: {x: 820, y: 470}, size: 150},
    {type: "bigWord", at: 23, dur: 16, text: "خطيرة"},
    // "افتح كروم … إعدادات الموقع … ملفات تعريف الارتباط" — phone with the recording + PiP (once)
    {type: "phone", at: 218, dur: 360, src: "footage/chrome/recording.mp4", isVideo: true, playbackRate: 1.5},
    {type: "feature", at: 356, dur: 45, text: "إعدادات الموقع", y: 340},
    {type: "chip", at: 461, dur: 80, title: "Third-party cookies", label: "ملفات تعريف الارتباط الخارجية", icon: "🍪", y: 1330},
    // "الموقع الجغرافي، المايكروفون، الكاميرا، الاستديو والملفات" — permission icons stack (once)
    {
      type: "logoStack",
      at: 654,
      dur: 150,
      items: [
        {logo: perm("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z'/><circle cx='12' cy='9.5' r='2.5'/></svg>", "#E8453C"), at: 8},
        {logo: perm("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='9' y='3' width='6' height='11' rx='3'/><path d='M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21M8.5 21h7'/></svg>", "#1E90FF"), at: 44},
        {logo: perm("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='2.5' y='6.5' width='13' height='11' rx='2.5'/><path d='M15.5 10.5 21.5 7v10l-6-3.5Z'/></svg>", "#7B5CFF"), at: 74},
        {logo: perm("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='4' width='18' height='16' rx='2.5'/><circle cx='8.5' cy='9.5' r='1.8'/><path d='m21 16-5-5-9 9'/></svg>", "#F5A623"), at: 116},
        {logo: perm("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 6.5h6l2 2.5h10v10.5H3Z'/></svg>", "#2BB673"), at: 133},
      ],
    },
    // "تمنعها أو تخليها تطلب إذنك" — the real permission page as a screenshot card (once)
    {type: "screenshot", at: 855, dur: 112, src: "footage/chrome/camera-crop.jpg", aspect: 1080 / 820, centerY: 860},
    // "ابعت الفيديو لصاحبك" — share CTA (once)
    {type: "save", at: 990, dur: 120, text: "شارك", kind: "share", y: 1110},
    // "درهم وقاية خير من قنطار علاج" — glass card (once)
    {type: "glass", at: 1122, dur: 81, title: "درهم وقاية", sub: "خير من قنطار علاج", centerY: 1180},
  ],
  sfx: [
    {at: 4, sfx: "tension-keen"},
    {at: 22, sfx: "impact"},
    {at: 143, sfx: "whoosh-2"},
    {at: 218, sfx: "sweep-up"},
    {at: 356, sfx: "ui-select"},
    {at: 461, sfx: "glitch"},
    {at: 662, sfx: "click"},
    {at: 698, sfx: "shutter-click"},
    {at: 728, sfx: "click"},
    {at: 770, sfx: "small-swoosh"},
    {at: 787, sfx: "shutter-click"},
    {at: 855, sfx: "swish-whoosh"},
    {at: 1002, sfx: "ding"},
    {at: 1122, sfx: "cinematic-boom"},
  ],
};

export const SayaChrome: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
