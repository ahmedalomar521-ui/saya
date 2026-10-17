// سايا — كيف تخبّي إنك أونلاين (سلسلة نصائح إنستغرام، الحلقة 1)، 2026-10-17. ستايل سايا.
// النسخة 2: الزوم القديم (قفزات + دفع بطيء مثل أبل، مثبّت)، بطاقة الجوال + ساية بدائرة (pip)،
// تسجيل الشاشة بسرعة طبيعية (أقصاها 1.15×)، وطقم الأصوات B (sfxKit.ts).
// Footage in public/footage/hide/ (git-ignored):
//   saya.mp4  = HeyGen, 2 parts joined (A 0–17.65 s + B), beret + olive cardigan image.
//   screen.mp4 = the user's Instagram screen recording, status bar cropped and RE-TIMED
//     (8 pieces, ffmpeg) so each tap lands on the matching spoken words. The touch circles
//     are drawn here (the phone had no touch dots): TapPulse at the 4 taps.
// Phone card: width 440 at top 330 (bottom 1236, clear of the captions at y 1360).
// Tap coordinates are mapped from the recording (1080×2340, top 100 px cropped) into the card.
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";
import {KIT_VOLUME, SFX_KIT} from "../styles/saya/sfxKit";

export const SAYA_HIDE_FRAMES = 954; // 31.8 s

const SRT = `1
00:00:00,100 --> 00:00:02,620
كيف بتخبّي إنك أونلاين على الإنستغرام؟

1b
00:00:02,870 --> 00:00:04,090
عن اللي بتتابعهم

2
00:00:04,460 --> 00:00:05,680
واللي بتراسلهم كمان؟

3
00:00:06,420 --> 00:00:07,240
احفظ الريل،

3b
00:00:07,450 --> 00:00:08,960
لأنك رح ترجعله بعدين.

4
00:00:09,620 --> 00:00:10,920
افتح ملفك الشخصي

5
00:00:11,260 --> 00:00:12,450
واضغط الثلاث خطوط

6
00:00:13,020 --> 00:00:15,370
انزل لـ"الرسائل والردود على القصص"

7
00:00:15,780 --> 00:00:17,450
واضغط على "حالة النشاط"

8
00:00:17,650 --> 00:00:19,750
وطفّي "عرض حالة النشاط"

9
00:00:20,440 --> 00:00:22,230
بس في شي ما حدا بيحكيلك عنه…

10
00:00:22,810 --> 00:00:23,970
لما تطفّي الخيار،

11
00:00:24,240 --> 00:00:25,980
إنت كمان ما رح تشوف نشاط حدا.

12
00:00:26,590 --> 00:00:27,270
وتابعني

13
00:00:27,640 --> 00:00:30,540
لتوصلك نصائح التقنية والذكاء الاصطناعي

14
00:00:30,890 --> 00:00:31,790
أول بأول.
`;

const H = "footage/hide/";
const icon = (n: string) => `assets/icons/lu-${n}.svg`;
const PHONE = {at: 289, dur: 324, width: 620, top: 290};
// recording (1080×2340) → canvas: inner screen of the card, cover-fit of the cropped 1080×2240 video
const bez = PHONE.width * 0.035;
const x0 = 540 - PHONE.width / 2 + bez;
const y0 = PHONE.top + bez;
const sc = (PHONE.width * 2.06 - 2 * bez) / 2240;
const tap = (xr: number, yr: number) => ({x: Math.round(x0 + xr * sc - (2240 * sc * (1080 / 2240) - (PHONE.width - 2 * bez)) / 2), y: Math.round(y0 + (yr - 100) * sc)});
const MARK = "#1E90FF"; // marker colour on the white phone screen (palette neon)
const TAPS = [
  {at: 41, ...tap(86, 151)}, // the three lines
  {at: 185, ...tap(800, 1469)}, // الرسائل والردود على القصص
  {at: 232, ...tap(800, 853)}, // حالة النشاط
  {at: 292, ...tap(120, 302)}, // the toggle
];

export const sayaHideProps: SayaEditProps = {
  footage: H + "saya.mp4",
  face: {x: 620, y: 730, w: 230},
  srt: SRT,
  // the original Saya zooms (locked, user 2026-10-17): base 1.12, instant emphasis cuts held ~28 frames
  // (like SayaAppleHome), one fast punch, and a slow push on the last line
  zooms: [
    {at: 0, scale: 1.12},
    {at: 54, scale: 1.28}, // "أونلاين"
    {at: 82, scale: 1.12},
    {at: 192, scale: 1.24, mode: "fast"}, // "احفظ"
    {at: 222, scale: 1.12},
    {at: 637, scale: 1.28}, // "ما حدا"
    {at: 665, scale: 1.12},
    {at: 829, scale: 1.22, mode: "slow", dur: 100}, // the call to action
  ],
  places: [{at: 0, y: 1040}], // like رواء الجلاد: the caption sits at ~54% of the height, also over the phone (user 2026-10-17)
  onLight: [[0, SAYA_HIDE_FRAMES]], // the desk behind the captions is light
  hide: [[193, 223]], // the bookmark says "احفظ" in the caption's place
  // Saya stays visible as a circle (top left) while the phone card shows the screen
  pip: [[PHONE.at, PHONE.at + PHONE.dur]],
  pipPlace: {x: 25, y: 275, d: 250, fill: 0.55}, // zoomed out so the hijab and face details show
  graphics: [
    {type: "title", at: 5, dur: 85, small: "كيف بتخبّي", big: "إنك أونلاين؟", y: 300, squiggle: true},
    {type: "save", at: 193, dur: 30, big: true, y: 1030}, // big white bookmark on the chest (reference m.3d3), on "احفظ الريل"
    // illustrative icons next to the words (user rule 2026-10-17: anything that is said gets a graphic; see iconMap.ts)
    {type: "sticker", at: 3, dur: 44, src: icon("eye-off"), x: 175, y: 560, size: 190, glow: true, rot: -6}, // "تخبّي"
    {type: "sticker", at: 57, dur: 40, src: "assets/icons/instagram-tile.svg", x: 930, y: 540, size: 180, glow: true, rot: 6}, // "الإنستغرام"
    {type: "sticker", at: 100, dur: 30, src: icon("users"), x: 175, y: 560, size: 190, glow: true, rot: -6}, // "بتتابعهم"
    {type: "sticker", at: 134, dur: 37, src: icon("message-circle"), x: 930, y: 560, size: 180, glow: true, rot: 6}, // "بتراسلهم"
    {type: "sticker", at: 684, dur: 35, src: icon("settings"), x: 175, y: 560, size: 190, glow: true, rot: -6}, // "الخيار"
    {type: "sticker", at: 748, dur: 44, src: icon("eye"), x: 930, y: 540, size: 180, glow: true, rot: -6}, // "نشاط"
    {type: "sticker", at: 829, dur: 44, src: icon("lightbulb"), x: 930, y: 560, size: 180, glow: true, rot: 6}, // "نصائح"
    {type: "save", at: 193, dur: 30, big: true, y: 1030}, // big white bookmark on the chest (reference m.3d3), on "احفظ الريل"
    // illustrative icons next to the words (user rule 2026-10-17: always an illustrative graphic)
    {type: "sticker", at: 57, dur: 40, src: "assets/icons/instagram-tile.svg", x: 930, y: 540, size: 180, glow: true, rot: 6},
    {type: "sticker", at: 748, dur: 44, src: "assets/icons/lucide-eye.svg", x: 930, y: 540, size: 180, glow: true, rot: -6},
    {type: "phone", at: PHONE.at, dur: PHONE.dur, src: H + "screen.mp4", isVideo: true, width: PHONE.width, top: PHONE.top, taps: TAPS},
    // key words = a big label in the caption's place + a marker on the same option in the screen
    {type: "feature", at: 289, dur: 45, text: "ملفك الشخصي", y: 1040},
    {type: "feature", at: 338, dur: 42, text: "الثلاث خطوط", y: 1040},
    {type: "feature", at: 391, dur: 83, text: "الرسائل والردود على القصص", y: 860}, // above its row, which sits at y≈1066
    {type: "feature", at: 473, dur: 55, text: "حالة النشاط", y: 1040},
    {type: "feature", at: 530, dur: 70, text: "عرض حالة النشاط", y: 1040},
    {type: "doodle", kind: "circle", at: 300, dur: 45, x: TAPS[0].x, y: TAPS[0].y, w: 120, h: 120, color: MARK},
    {type: "doodle", kind: "circle", at: 400, dur: 76, x: tap(740, 1469).x, y: tap(740, 1469).y, w: 520, h: 120, color: MARK},
    {type: "doodle", kind: "circle", at: 482, dur: 45, x: tap(740, 853).x, y: tap(740, 853).y, w: 520, h: 120, color: MARK},
    {type: "doodle", kind: "circle", at: 540, dur: 50, x: TAPS[3].x, y: TAPS[3].y, w: 150, h: 110, color: MARK},
    {type: "follow", at: 798, dur: 156, avatar: "footage/apple/avatar.jpg", handle: "saya_.tech", y: 1230, pressAt: 22},
  ],
  sfx: [
    {at: 54, sfx: SFX_KIT.punch[0], volume: KIT_VOLUME},
    {at: 192, sfx: SFX_KIT.punch[1], volume: KIT_VOLUME},
    {at: PHONE.at, sfx: SFX_KIT.cardIn, volume: KIT_VOLUME},
    ...TAPS.map((t) => ({at: PHONE.at + t.at, sfx: SFX_KIT.tap, volume: KIT_VOLUME})),
    {at: 637, sfx: SFX_KIT.punch[0], volume: KIT_VOLUME},
    {at: 798 + 22, sfx: SFX_KIT.cta, volume: KIT_VOLUME},
  ],
};

export const SayaHideStatus: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
