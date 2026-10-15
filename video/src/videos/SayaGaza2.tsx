// سايا — غزة (نسخة 2): قالب نيكولاس (AJ+ عربي)، 2026-10-15. ستايل سايا.
// Script template: hook line → the real footage full screen with its shouts
// subtitled → who filmed it → the "should have / instead" contrast → the
// girl's mother → ending. Captions in the "nicolas" look (editing-rules §9).
// Footage in public/footage/gaza/ (git-ignored): saya-v2.mp4 =
//   P1 0–5.55 (hook) + Ali Aljafarawi's footage 0–18 s (no bodies or burns;
//   his watermark kept) + P1 5.80–end + P2 (HeyGen, Calm + emotion tags).
// saleh-1/2.jpg = photos of the martyred journalist Saleh Aljafarawi (user).
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_GAZA2_FRAMES = 1691; // 56.37 s

// Saya timed on the speech segments between silences; the shouts in Ali's
// footage follow its audio (Gemini transcript + the AJ+ subtitles).
const SRT = `1
00:00:00,300 --> 00:00:03,050
الاحتلال عم يحرق أطفال غزة وهنن نايمين…

2
00:00:03,620 --> 00:00:05,420
بعد سنة من وقف إطلاق النار

3
00:00:05,570 --> 00:00:08,170
رش مية

4
00:00:08,370 --> 00:00:11,070
فيه أطفال بيصرخوا… عايشين!

5
00:00:11,570 --> 00:00:13,870
هات مية!

6
00:00:14,170 --> 00:00:16,370
هي هي… فيه ولاد صغار هون

7
00:00:16,570 --> 00:00:20,070
يا عمي هات لي… بس حدا يجيب لي بطانية

8
00:00:20,170 --> 00:00:21,570
بطانية… بطانية

9
00:00:21,670 --> 00:00:23,470
جيب… جيب

10
00:00:23,740 --> 00:00:25,600
هاد اللي وثّقه علي الجعفراوي…

11
00:00:26,100 --> 00:00:28,280
أخو الصحفي الشه*يد صالح الجعفراوي

12
00:00:28,790 --> 00:00:29,350
أطفال،

13
00:00:29,790 --> 00:00:31,390
المفروض يصحّوا على صوت إمهم…

14
00:00:31,870 --> 00:00:33,390
تصحّيهم ليروحوا عالمدرسة

15
00:00:33,900 --> 00:00:35,840
وهي فعلاً صحيت على صوت إمها…

16
00:00:36,310 --> 00:00:38,330
بس كانت آخر مرة بتسمعه بحياتها

17
00:00:38,790 --> 00:00:40,800
وأول شي شافته بعد ما صحيت…

18
00:00:41,160 --> 00:00:43,190
نار عم تحرق كل شي حواليها

19
00:00:43,610 --> 00:00:44,680
وهاي مو أول مرة…

20
00:00:45,140 --> 00:00:45,910
وما بتوقع،

21
00:00:46,280 --> 00:00:47,030
بس بتمنى…

22
00:00:47,360 --> 00:00:48,150
تكون الأخيرة

23
00:00:48,570 --> 00:00:50,010
غزة ما بدها منّا كتير

24
00:00:50,370 --> 00:00:51,430
بدها ما ننساها

25
00:00:51,770 --> 00:00:52,540
وما نسكت

26
00:00:52,900 --> 00:00:53,850
شاركوا هالفيديو

27
00:00:54,250 --> 00:00:56,300
لأنه كل مشاركة صوت
`;

const G = "footage/gaza/";
const ALI_IN = 167; // 5.57 s — Ali's footage, full screen
const ALI_OUT = 707; // 23.57 s — back to Saya

export const sayaGaza2Props: SayaEditProps = {
  footage: G + "saya-v2.mp4",
  face: {x: 568, y: 700, w: 250},
  srt: SRT,
  captionLook: "nicolas",
  zooms: [
    {at: 0, scale: 1.12},
    {at: 109, scale: 1.22}, // "بعد سنة من وقف إطلاق النار"
    {at: ALI_IN, scale: 1}, // the footage as filmed
    {at: ALI_OUT, scale: 1.1},
    {at: 1017, scale: 1.22, mode: "slow", dur: 90}, // "وهي فعلاً صحيت"
    {at: 1164, scale: 1.12},
    {at: 1308, scale: 1.28, mode: "slow", dur: 90}, // "وهاي مو أول مرة"
    {at: 1457, scale: 1.12}, // "غزة ما بدها منّا كتير"
    {at: 1587, scale: 1.15}, // "شاركوا"
  ],
  places: [{at: 1570, y: 1180}],
  graphics: [
    {type: "source", at: ALI_IN + 4, dur: ALI_OUT - ALI_IN - 4, text: "تصوير: علي الجعفراوي", y: 1560},
    {type: "floating", at: 779, dur: 40, src: G + "saleh-1.jpg", width: 360, aspect: 0.78, top: 330, x: 862, label: "صالح الجعفراوي"},
    {type: "floating", at: 819, dur: 48, src: G + "saleh-2.jpg", width: 380, aspect: 0.95, top: 340, x: 858, label: "صالح الجعفراوي"},
    {type: "title", at: 1457, dur: 234, big: "لا تنسوا غزة", y: 400},
    {type: "save", at: 1587, dur: 104, kind: "share", text: "شاركوا الفيديو", y: 1390},
  ],
  sfx: [
    {at: ALI_IN, sfx: "impact-deep", volume: 0.2},
    {at: ALI_OUT, sfx: "small-swoosh", volume: 0.22},
    {at: 779, sfx: "camera-shutter", volume: 0.25},
    {at: 819, sfx: "camera-shutter-2", volume: 0.25},
    {at: 1457, sfx: "cinematic-whoosh", volume: 0.2},
    {at: 1599, sfx: "ui-select", volume: 0.3},
  ],
};

export const SayaGaza2: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
