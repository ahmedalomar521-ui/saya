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
const PHONE = {at: 289, dur: 324, width: 540, top: 290};
// recording (1080×2340) → canvas: inner screen of the card, cover-fit of the cropped 1080×2240 video
const bez = PHONE.width * 0.035;
const x0 = 540 - PHONE.width / 2 + bez;
const y0 = PHONE.top + bez;
const sc = (PHONE.width * 2.06 - 2 * bez) / 2240;
const tap = (xr: number, yr: number) => ({x: Math.round(x0 + xr * sc - (2240 * sc * (1080 / 2240) - (PHONE.width - 2 * bez)) / 2), y: Math.round(y0 + (yr - 100) * sc)});
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
  places: [{at: 0, y: 1360}], // the lowest the safe zone allows
  onLight: [[0, SAYA_HIDE_FRAMES]], // the desk behind the captions is light
  // Saya stays visible as a circle (top left) while the phone card shows the screen
  pip: [[PHONE.at, PHONE.at + PHONE.dur]],
  pipPlace: {x: 30, y: 290, d: 220, fill: 0.44}, // zoomed out so the hijab and face details show
  graphics: [
    {type: "title", at: 5, dur: 85, small: "كيف بتخبّي", big: "إنك أونلاين؟", y: 300, squiggle: true},
    {type: "save", at: 193, dur: 76, text: "احفظ الريل", y: 1180}, // on "احفظ الريل"; above the captions (y 1360)
    {type: "phone", at: PHONE.at, dur: PHONE.dur, src: H + "screen.mp4", isVideo: true, width: PHONE.width, top: PHONE.top, taps: TAPS},
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
