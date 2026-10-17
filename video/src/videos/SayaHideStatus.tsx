// سايا — كيف تخبّي إنك أونلاين (سلسلة نصائح إنستغرام، الحلقة 1)، 2026-10-17. ستايل سايا
// مع نظام الزوم الجديد (zoomSystem.ts) وطقم الأصوات B (sfxKit.ts).
// Footage in public/footage/hide/ (git-ignored):
//   saya.mp4  = HeyGen, 2 parts joined (A 0–17.65 s + B), beret + olive cardigan image.
//   screen.mp4 = the user's Instagram screen recording, status bar cropped and RE-TIMED
//     (8 pieces, ffmpeg) so each tap lands on the matching spoken words. The touch circles
//     are drawn here (the phone had no touch dots): TapPulse at the 4 taps.
// Phone card: width 440 at top 330 (bottom 1236, clear of the captions at y 1360).
// Tap coordinates are mapped from the recording (1080×2340, top 100 px cropped) into the card.
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";
import {checkZoomMap, type ZoomEvent} from "../styles/saya/zoomSystem";
import {KIT_VOLUME, SFX_KIT, sfxFromZoomMap} from "../styles/saya/sfxKit";

export const SAYA_HIDE_FRAMES = 954; // 31.8 s

const SRT = `1
00:00:00,100 --> 00:00:04,090
كيف بتخبّي إنك أونلاين على الإنستغرام…

2
00:00:04,440 --> 00:00:05,670
عن اللي بتتابعهم واللي بتراسلهم كمان؟

3
00:00:06,400 --> 00:00:08,950
احفظ الريل، لأنك رح ترجعله بعدين.

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
const PHONE = {at: 289, dur: 322, width: 440, top: 330};
// recording (1080×2340) → canvas: inner screen of the card, cover-fit of the cropped 1080×2240 video
const bez = PHONE.width * 0.035;
const x0 = 540 - PHONE.width / 2 + bez;
const y0 = PHONE.top + bez;
const sc = (PHONE.width * 2.06 - 2 * bez) / 2240;
const tap = (xr: number, yr: number) => ({x: Math.round(x0 + xr * sc - (2240 * sc * (1080 / 2240) - (PHONE.width - 2 * bez)) / 2), y: Math.round(y0 + (yr - 100) * sc)});
const TAPS = [
  {at: 47, ...tap(86, 151)}, // the three lines
  {at: 168, ...tap(800, 1469)}, // الرسائل والردود على القصص
  {at: 224, ...tap(800, 853)}, // حالة النشاط
  {at: 269, ...tap(120, 302)}, // the toggle
];

export const zoomMapHide: ZoomEvent[] = [
  {type: "punch", at: 54}, // "أونلاين"
  {type: "punch", at: 192}, // "احفظ"
  // the HeyGen join (frame 530) is hidden under the phone card: no join zoom
  {type: "punch", at: 637}, // "ما حدا"
  {type: "kenburns", from: 684, to: 779}, // the thesis: "إنت كمان ما رح تشوف نشاط حدا"
  {type: "kenburns", from: 829, to: 945}, // the CTA
];

export const sayaHideProps: SayaEditProps = {
  footage: H + "saya.mp4",
  face: {x: 620, y: 730, w: 230},
  srt: SRT,
  zoomMap: zoomMapHide,
  places: [{at: 0, y: 1360}], // the lowest the safe zone allows
  onLight: [[0, SAYA_HIDE_FRAMES]], // the desk behind the captions is light
  graphics: [
    {type: "title", at: 5, dur: 85, small: "كيف بتخبّي", big: "إنك أونلاين؟", y: 300, squiggle: true},
    {type: "phone", at: PHONE.at, dur: PHONE.dur, src: H + "screen.mp4", isVideo: true, width: PHONE.width, top: PHONE.top, taps: TAPS},
    {type: "follow", at: 798, dur: 156, avatar: "footage/apple/avatar.jpg", handle: "saya_.tech", y: 1230, pressAt: 22},
  ],
  sfx: [
    ...sfxFromZoomMap(zoomMapHide),
    {at: PHONE.at, sfx: SFX_KIT.cardIn, volume: KIT_VOLUME},
    ...TAPS.map((t) => ({at: PHONE.at + t.at, sfx: SFX_KIT.tap, volume: KIT_VOLUME})),
    {at: 798 + 22, sfx: SFX_KIT.cta, volume: KIT_VOLUME},
  ],
};

// rationing check (run in dev): empty = fine
export const hideZoomWarnings = checkZoomMap(zoomMapHide, SAYA_HIDE_FRAMES);

export const SayaHideStatus: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
