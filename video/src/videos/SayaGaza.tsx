// سايا — غزة: علي الجعفراوي، 2026-10-15. ستايل سايا، ريل جوّا ريل (editing-rules §8).
// Footage in public/footage/gaza/ (git-ignored): saya.mp4 = 3.0 s Pollo
// (Hailuo) intro where she lowers her eyes to the card, then HeyGen (Tiffany,
// Calm delivery) in three overlapping parts joined at their audio match
// (P1 0–17.322, P2 0–15.813, P3 whole). Pauses kept: the reel is meant to be
// slow and heavy. No speed-up.
// The card (EditsSlot, EDITS_CARD) stays empty on purpose: the user drops the
// Edits "link to reel" element of Ali's reel exactly on it before posting.
// Captions move above the card while it is up, never hidden (user, 2026-10-15).
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_GAZA_FRAMES = 1617; // 53.9 s

// Timed on the speech segments between silences of the joined footage.
const SRT = `1
00:00:03,210 --> 00:00:04,510
هاد علي الجعفراوي…

2
00:00:05,250 --> 00:00:07,480
أخو الصحفي الشه*يد صالح الجعفراوي

3
00:00:08,180 --> 00:00:10,210
فات على بناية عم تحترق بغزة

4
00:00:10,610 --> 00:00:14,150
بعد ما ضربها الاحتلال الإسرائيلي بأكتر من تلت صواريخ

5
00:00:14,600 --> 00:00:17,210
لأنه سمع إنه في بنت محاصرة جوّا النار

6
00:00:17,690 --> 00:00:19,050
الدخان كان أقوى منه…

7
00:00:19,610 --> 00:00:20,220
أغمي عليه

8
00:00:20,550 --> 00:00:21,540
وطلّعوه عالإسعاف

9
00:00:22,130 --> 00:00:24,160
أخوه راح وهو عم ينقل الحقيقة…

10
00:00:24,610 --> 00:00:26,970
وهو لسا عم يفوت عالنار ليطلّع غيره

11
00:00:27,450 --> 00:00:28,760
وعلي مش حالة وحدة

12
00:00:29,130 --> 00:00:32,620
بغزة التصعيد ما بيوقف، والقصف ما بيوقف

13
00:00:33,080 --> 00:00:34,160
حصار من سنين…

14
00:00:34,620 --> 00:00:37,800
لا أكل كفاية، ولا دوا، ولا مكان آمن

15
00:00:38,110 --> 00:00:41,050
كل يوم في بيت بينهدّ، وعيلة بتخسر حدا

16
00:00:41,420 --> 00:00:43,500
وناس عم تعاني وما عندها غير بعضها

17
00:00:44,000 --> 00:00:44,610
ومع هيك

18
00:00:45,000 --> 00:00:45,960
ما عم تترك بعضها

19
00:00:46,330 --> 00:00:47,780
غزة ما بدها منّا كتير

20
00:00:48,200 --> 00:00:49,210
بدها ما ننساها

21
00:00:49,600 --> 00:00:50,350
وما نسكت

22
00:00:50,690 --> 00:00:51,620
شاركوا هالفيديو

23
00:00:52,030 --> 00:00:53,700
لأنه كل مشاركة صوت
`;

const G = "footage/gaza/";
// a little lower and smaller than EDITS_CARD: room for two caption lines above it
export const GAZA_CARD = {x: 371, y: 1000, w: 338, h: 601};
const CARD_IN = 24; // she has lowered her eyes (Pollo intro, 0.8 s)
const CARD_OUT = 650; // end of "وطلّعوه عالإسعاف"

export const sayaGazaProps: SayaEditProps = {
  footage: G + "saya.mp4",
  face: {x: 568, y: 700, w: 250},
  srt: SRT,
  // writing in the نيكولاس (AJ+) caption look the user picked, 2026-10-15
  captionLook: "nicolas",
  zooms: [
    // no zoom while the card is up: the chin–card gap holds the captions
    {at: 0, scale: 1},
    {at: 664, scale: 1.12}, // "أخوه راح"
    {at: 824, scale: 1.25}, // "وعلي مش حالة وحدة" — straight to camera
    {at: 874, scale: 1.1},
    {at: 1143, scale: 1.18, mode: "slow", dur: 90}, // "كل يوم في بيت بينهدّ"
    {at: 1390, scale: 1.3, mode: "slow", dur: 120}, // "غزة ما بدها منّا كتير"
    {at: 1521, scale: 1.12}, // "شاركوا"
  ],
  places: [
    {at: 0, y: 878}, // two lines between the chin and the card
    {at: CARD_OUT, y: 1330},
    {at: 1500, y: 1180}, // make room for the share pill
  ],
  graphics: [
    {type: "editsSlot", at: CARD_IN, dur: CARD_OUT - CARD_IN, label: "علي الجعفراوي", rect: GAZA_CARD},
    {type: "bigWord", at: 909, dur: 28, text: "التصعيد"},
    {type: "bigWord", at: 957, dur: 28, text: "القصف"},
    {type: "bigWord", at: 992, dur: 32, text: "الحصار"},
    {type: "title", at: 1446, dur: 171, big: "لا تنسوا غزة", y: 400},
    {type: "save", at: 1521, dur: 96, kind: "share", text: "شاركوا الفيديو", y: 1390},
  ],
  sfx: [
    {at: 0, sfx: "airplane", volume: 0.12, frames: 110},
    {at: CARD_IN, sfx: "swish-whoosh", volume: 0.2},
    {at: CARD_OUT - 6, sfx: "small-swoosh", volume: 0.25},
    {at: 824, sfx: "impact-deep", volume: 0.25},
    {at: 909, sfx: "impact-deep", volume: 0.16},
    {at: 957, sfx: "impact-deep", volume: 0.16},
    {at: 992, sfx: "impact-deep", volume: 0.18},
    {at: 1446, sfx: "cinematic-whoosh", volume: 0.2},
    {at: 1533, sfx: "ui-select", volume: 0.3},
  ],
};

export const SayaGaza: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
