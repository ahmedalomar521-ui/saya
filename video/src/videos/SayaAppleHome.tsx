// سايا — أبل: هوم فيو + أبل تي في + هوم بود ميني 2، 2026-10-14. ستايل سايا مع
// قالب الشاشة المقسومة من مرجع رواء الجلاد (SplitStage).
// Footage in public/footage/apple/ (git-ignored): saya.mp4 = HeyGen Avatar V
// (four 1080p parts stitched), pauses cut to 0.12 s and sped ×1.15 (user's
// choice, option 2). ad.mp4 = Apple's HomeView ad (user's screen recording),
// 01–20 = Apple product images from apple.com (user). Captions = the user's
// final script, timed from a transcription of the cut footage.
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_APPLE_FRAMES = 1612; // 53.7 s

const SRT = `1
00:00:00,000 --> 00:00:01,374
أبل أعلنت أمس عن

2
00:00:01,417 --> 00:00:02,843
ثلاثة أجهزة جديدة للبيت.

3
00:00:02,887 --> 00:00:04,108
أولهم هوم فيو:

4
00:00:04,152 --> 00:00:06,304
شاشة ذكية بقياس سبعة إنش،

5
00:00:06,347 --> 00:00:06,797
بنسختين:

6
00:00:06,840 --> 00:00:07,632
وحدة بقاعدة

7
00:00:07,675 --> 00:00:08,864
ووحدة بتتعلق على الحيط.

8
00:00:08,864 --> 00:00:09,812
طيب شو بفيدني؟

9
00:00:09,812 --> 00:00:12,629
فيه وصول كامل لسيري بالذكاء الاصطناعي،

10
00:00:12,672 --> 00:00:14,216
فبتقدر تسألها شو ما بدك،

11
00:00:14,259 --> 00:00:15,407
نفس اللي بالآيفون يعني.

12
00:00:15,451 --> 00:00:17,854
وبتتحكم منه بكل أجهزة البيت الذكي،

13
00:00:17,897 --> 00:00:19,918
وحتى بتعمل منه مكالمات فيس تايم.

14
00:00:19,962 --> 00:00:20,675
والحلو فيه إنو

15
00:00:20,718 --> 00:00:22,586
بيقدروا ستة أشخاص يستخدموه،

16
00:00:22,629 --> 00:00:24,898
وكل واحد إله واجهته وبياناته.

17
00:00:24,941 --> 00:00:26,188
نيجي للجهاز التاني:

18
00:00:26,232 --> 00:00:26,958
أبل تي في الجديد.

19
00:00:27,002 --> 00:00:27,680
صار أسرع،

20
00:00:27,723 --> 00:00:30,123
وبتقدر تحكي مع سيري بدون ما تمسك الريموت،

21
00:00:30,167 --> 00:00:31,475
حتى لو الصوت شغال.

22
00:00:31,482 --> 00:00:33,446
وإذا ضاع الريموت بين الكنبات،

23
00:00:33,489 --> 00:00:33,744
عادي!

24
00:00:33,744 --> 00:00:35,271
بتلاقيه من خدمة فايند ماي.

25
00:00:35,314 --> 00:00:37,842
والجهاز التالت: هوم بود ميني 2.

26
00:00:37,886 --> 00:00:39,521
سماعة صغيرة فيها سيري،

27
00:00:39,564 --> 00:00:41,181
بمعالج أسرع وصوت أحسن

28
00:00:41,225 --> 00:00:42,703
وإضاءة بتتفاعل مع الصوت.

29
00:00:42,747 --> 00:00:44,790
وبتقدر تربط أربعة منه مع أبل تي في

30
00:00:44,834 --> 00:00:46,654
لتبني نظام صوتي محيطي.

31
00:00:46,698 --> 00:00:47,724
برأيي أحلاهم

32
00:00:47,767 --> 00:00:48,480
هوم فيو،

33
00:00:48,524 --> 00:00:50,291
لأنو الجهاز بيصير للبيت كله.

34
00:00:50,335 --> 00:00:51,352
تابعني لتوصلك أخبار

35
00:00:51,396 --> 00:00:53,491
التقنية والذكاء الاصطناعي أول بأول.`;

const A = "footage/apple/";
const AD = A + "ad.mp4";

export const sayaAppleProps: SayaEditProps = {
  footage: A + "saya.mp4",
  face: {x: 572, y: 660, w: 240},
  srt: SRT,
  zooms: [
    {at: 0, scale: 1.12},
    {at: 266, scale: 1.3}, // "طيب شو بفيدني؟" — punch-in
    {at: 294, scale: 1.12},
    {at: 446, scale: 1.3, mode: "fast"}, // "يعني" 🙄
    {at: 464, scale: 1.12},
    {at: 748, scale: 1.24}, // "نيجي للجهاز التاني"
    {at: 787, scale: 1.12},
    {at: 997, scale: 1.32}, // "عادي!"
    {at: 1012, scale: 1.12},
    {at: 1510, scale: 1.22, mode: "slow", dur: 90}, // follow
  ],
  hide: [[43, 87]], // the hook title says "3 أجهزة"
  graphics: [
    {type: "title", at: 5, dur: 80, small: "أبل أعلنت أمس", big: "3 أجهزة جديدة", y: 400, squiggle: true},
    // 1 — HomeView
    {
      type: "split", at: 87, dur: 179, tag: "1", source: "Apple",
      items: [
        {at: 0, src: AD, isVideo: true, from: 2.2},
        {at: 38, src: A + "02-homeview-two-units.jpg", fit: "contain", bg: "#FFFFFF"},
        {at: 143, src: A + "11-homeview-wall-controls.jpg", fit: "cover", pos: "50% 55%"},
      ],
    },
    {
      type: "split", at: 294, dur: 134, tag: "1", source: "Apple",
      items: [
        {at: 0, src: AD, isVideo: true, from: 5.0},
        {at: 86, src: AD, isVideo: true, from: 10.0},
      ],
    },
    {type: "sticker", at: 446, dur: 26, src: "assets/icons/emoji-face-with-rolling-eyes.svg", x: 820, y: 470, size: 170, rot: 8},
    {
      type: "split", at: 464, dur: 284, tag: "1", source: "Apple",
      items: [
        {at: 0, src: AD, isVideo: true, from: 40.0},
        {at: 40, src: AD, isVideo: true, from: 42.6},
        {at: 73, src: AD, isVideo: true, from: 22.2},
        {at: 158, src: AD, isVideo: true, from: 15.2, pos: "15% 50%"},
        {at: 215, src: A + "17-homeview-six-profiles.jpg", fit: "cover", pos: "75% 45%"},
      ],
    },
    // 2 — Apple TV
    {type: "section", at: 750, dur: 34, text: "2", y: 400},
    {
      type: "split", at: 787, dur: 157, tag: "2", source: "Apple",
      items: [
        {at: 0, src: A + "06-appletv-box-remote.jpg", fit: "cover", pos: "50% 70%"},
        {at: 45, src: A + "09-siri-remote.jpg", fit: "contain", bg: "#FFFFFF"},
      ],
    },
    {type: "split", at: 1012, dur: 47, tag: "2", source: "Apple", items: [{at: 0, src: A + "08-findmy-remote.jpg", fit: "contain", bg: "#FFFFFF"}]},
    // 3 — HomePod mini 2
    {
      type: "split", at: 1059, dur: 342, tag: "3", source: "Apple",
      items: [
        {at: 0, src: A + "01-homepod-mini-colors.jpg", fit: "cover", pos: "50% 60%"},
        {at: 178, src: A + "19-homepod-mini-top.jpg", fit: "cover"},
        {at: 223, src: A + "07-appletv-homepod-surround.jpg", fit: "cover", pos: "50% 45%"},
        {at: 286, src: A + "18-multiroom-floorplan.jpg", fit: "contain", bg: "#F4F4F6"},
      ],
    },
    // opinion — back to HomeView
    {type: "split", at: 1401, dur: 109, source: "Apple", items: [{at: 0, src: AD, isVideo: true, from: 60.0}]},
    {type: "follow", at: 1512, dur: 70, avatar: A + "avatar.jpg", handle: "saya_.tech", y: 1100, pressAt: 14},
  ],
  sfx: [
    {at: 87, sfx: "swish-whoosh"},
    {at: 266, sfx: "whoosh-zoom"},
    {at: 294, sfx: "small-swoosh"},
    {at: 446, sfx: "boring"},
    {at: 464, sfx: "whoosh-pack-1"},
    {at: 750, sfx: "ui-select"},
    {at: 787, sfx: "small-swoosh"},
    {at: 997, sfx: "badum-tss"},
    {at: 1012, sfx: "blink-bell"},
    {at: 1059, sfx: "swish-whoosh"},
    {at: 1401, sfx: "shining"},
    {at: 1524, sfx: "click"},
  ],
};

export const SayaAppleHome: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
