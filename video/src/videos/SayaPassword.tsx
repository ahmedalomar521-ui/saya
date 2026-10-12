// سايا — نسيت كلمة سر حسابك؟ مدير كلمات المرور بكروم (2026-10-12). ستايل سايا.
// Footage + assets in public/footage/password/ (git-ignored). rec-edit.mp4 is
// the user's screen recording cut and retimed so each tap lands on its word,
// with the account e-mails blurred. Every treatment is used once (rule 1).
import {siGooglechrome} from "simple-icons";
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_PASSWORD_FRAMES = 920; // 30.7 s

const SRT = `1
00:00:00,200 --> 00:00:01,866
نسيت كلمة سر حسابك

2
00:00:02,166 --> 00:00:02,966
استنى شوي

3
00:00:03,200 --> 00:00:05,133
يمكن تلاقيها محفوظة بتليفونك

4
00:00:05,400 --> 00:00:06,900
افتح متصفح كروم

5
00:00:07,066 --> 00:00:08,533
واضغط على النقاط الثلاث

6
00:00:08,900 --> 00:00:10,400
وبعدها ادخل على الاعدادات

7
00:00:10,800 --> 00:00:11,600
اختار مدير

8
00:00:11,600 --> 00:00:12,466
كلمات المرور

9
00:00:12,566 --> 00:00:14,200
 password manager

10
00:00:14,300 --> 00:00:15,966
هلق ابحث عن الحساب اللي نسيت كلمة

11
00:00:16,100 --> 00:00:16,700
سره

12
00:00:16,700 --> 00:00:18,200
مثل انستغرام او فيسبوك

13
00:00:18,733 --> 00:00:19,566
اضغط على الحساب

14
00:00:19,933 --> 00:00:21,366
وبعدها على علامة العين

15
00:00:21,500 --> 00:00:22,866
حتى تظهر كلمة السر

16
00:00:23,066 --> 00:00:25,466
طبعا اذا كانت محفوظة عندك جربها

17
00:00:25,766 --> 00:00:27,300
واذا لقيت كلمتك السر

18
00:00:27,566 --> 00:00:28,166
تابعني

19
00:00:28,166 --> 00:00:30,066
واحفظ الفيديو حتى ترجع له وقت

20
00:00:30,200 --> 00:00:30,700
تحتاجه`;

// The recording sits in a 500 px card (top 285); taps are in canvas pixels.
const CARD = {at: 210, end: 687};

export const sayaPasswordProps: SayaEditProps = {
  footage: "footage/password/saya.mp4",
  face: {x: 550, y: 720, w: 280},
  srt: SRT,
  zooms: [
    {at: 0, scale: 1},
    {at: 65, scale: 1.15}, // "استنى شوي" — punch-in (once)
    {at: 162, scale: 1},
    {at: 690, scale: 1.08, mode: "slow", dur: 90}, // "طبعاً إذا كانت محفوظة" — slow push (once)
    {at: 784, scale: 1.16, mode: "fast"}, // "لقيت" — fast zoom (once)
  ],
  pip: [[CARD.at, CARD.end]],
  pipPlace: {x: 50, y: 300, d: 220},
  places: [
    {at: 0, y: 1270},
    {at: CARD.at, y: 1360}, // under the recording card
    {at: CARD.end, y: 1270},
  ],
  hide: [[0, 57]], // the hook title says it
  graphics: [
    // Hook — title above her head (once)
    {type: "title", at: 0, dur: 60, small: "نسيت", big: "كلمة السر؟", y: 430},
    // "محفوظة بتليفونك" — line-drawn key beside the head (sticker: once)
    {type: "sticker", at: 121, dur: 41, src: "assets/icons/lucide-key-round.svg", x: 870, y: 560, size: 170, glow: true, rot: -12},
    // "كروم" — Chrome logo in the caption's place (logo: once)
    {type: "logo", at: 192, dur: 18, logo: {icon: siGooglechrome, name: "Chrome"}},
    // The steps — the real recording in a glowing white card, Saya in the bubble (desktop + pip: once)
    {type: "desktop", at: CARD.at, dur: CARD.end - CARD.at, src: "footage/password/rec-edit.mp4", isVideo: true, aspect: 1080 / 2170, width: 500, height: 1005, top: 285},
    {type: "tap", at: 240, dur: 15, x: 321, y: 313}, // three dots
    {type: "tap", at: 291, dur: 15, x: 512, y: 929}, // الإعدادات
    {type: "tap", at: 322, dur: 15, x: 582, y: 779}, // الملء التلقائي وكلمات المرور
    {type: "tap", at: 355, dur: 15, x: 568, y: 396}, // مدير كلمات المرور
    {type: "feature", at: 377, dur: 50, text: "Password Manager", y: 1360}, // (feature: once)
    // "مثل انستغرام او فيسبوك" — each logo pops beside its row (stickers)
    {type: "sticker", at: 508, dur: 54, src: "assets/icons/instagram-tile.svg", x: 900, y: 1092, size: 120},
    {type: "sticker", at: 532, dur: 30, src: "assets/icons/logos-facebook.svg", x: 900, y: 714, size: 120},
    {type: "tap", at: 562, dur: 15, x: 609, y: 714}, // facebook.com
    // "علامة العين" — glowing eye beside the card + a tap on the real eye
    {type: "sticker", at: 619, dur: 68, src: "assets/icons/lucide-eye.svg", x: 160, y: 760, size: 150, glow: true},
    {type: "tap", at: 630, dur: 15, x: 424, y: 619},
    {type: "tap", at: 645, dur: 15, x: 424, y: 619},
    // "واذا لقيت كلمة السر" — sparkle in the headroom (sketch: once)
    {type: "sketch", at: 784, dur: 40, kind: "sparkle", x: 820, y: 400, color: "#8FD3FF"},
    // "تابعني" + "احفظ الفيديو" — follow, then save (once each)
    {type: "follow", at: 820, dur: 25, avatar: "footage/password/avatar.jpg", handle: "saya_.tech", y: 1110, pressAt: 8},
    {type: "save", at: 845, dur: 75, kind: "save", y: 1110},
  ],
  sfx: [
    {at: 0, sfx: "fuhh"},
    {at: 65, sfx: "whoosh-zoom"},
    {at: 120, sfx: "blink-bell"},
    {at: 208, sfx: "swish-whoosh"},
    {at: 240, sfx: "ui-select"},
    {at: 377, sfx: "click"},
    {at: 508, sfx: "small-swoosh"},
    {at: 562, sfx: "ui-select"},
    {at: 645, sfx: "shining"},
    {at: 687, sfx: "whoosh-2"},
    {at: 782, sfx: "ding"},
    {at: 826, sfx: "click"},
    {at: 856, sfx: "ding"},
  ],
};

export const SayaPassword: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
