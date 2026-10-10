// ستايل سايا — component gallery on one timeline (for checking stills, not a
// montage). Copy this file as the starting point for a real Saya edit: swap
// the footage, paste the SRT, and time the graphics/sounds to the words.
// Preview images live in public/footage/ (git-ignored): kit-bg.jpg (a still
// of the speaker), kit-screen.jpg (phone screen), kit-article.jpg (screenshot).
import {siClaude, siGooglechrome, siGooglegemini, siInstagram} from "simple-icons";
import {SayaEdit, type SayaEditProps} from "../styles/saya/SayaEdit";

export const SAYA_KIT_FRAMES = 420;

const SRT = `1
00:00:00,000 --> 00:00:02,000
إنستغرام نزّل ميزة جديدة

2
00:00:02,000 --> 00:00:04,500
اسمها Instants ومخفية بالإعدادات

3
00:00:04,500 --> 00:00:07,000
افتحوا الإعدادات وروحوا على

4
00:00:07,000 --> 00:00:09,500
وبكبسة وحدة بتطفوها

5
00:00:09,500 --> 00:00:12,000
وإذا بتستخدموا Gemini أو Claude أو Chrome

6
00:00:12,000 --> 00:00:14,000
احفظوا الفيديو لترجعولو`;

export const sayaKitProps: SayaEditProps = {
  footage: "footage/kit-bg.jpg",
  isImage: true,
  face: {x: 560, y: 640, w: 380},
  srt: SRT,
  zooms: [
    {at: 0, scale: 1},
    {at: 60, scale: 1.14}, // punch-in on a cut
    {at: 210, scale: 1.0},
    {at: 240, scale: 1.08, mode: "slow", dur: 45},
    {at: 400, scale: 1.2, mode: "fast"},
  ],
  pip: [[75, 210]],
  blur: [[285, 360]],
  whips: [75],
  places: [
    {at: 0, y: 1150},
    {at: 75, y: 330}, // phone in the middle → caption goes up (R3)
    {at: 210, y: 1150},
    {at: 285, y: 1300},
    {at: 360, y: 1150},
  ],
  graphics: [
    {type: "logo", at: 2, dur: 50, logo: {icon: siInstagram}, place: {x: 820, y: 430}, size: 150},
    {type: "phone", at: 75, dur: 135, src: "footage/kit-screen.jpg", taps: [{at: 60, x: 520, y: 1330}]},
    {type: "feature", at: 120, dur: 40, text: "Content Preferences"},
    {
      type: "logoStack",
      at: 285,
      dur: 75,
      items: [
        {logo: {icon: siGooglegemini}, at: 0},
        {logo: {icon: siClaude}, at: 14},
        {logo: {icon: siGooglechrome}, at: 28},
      ],
      focus: {index: 1, at: 50},
    },
    {type: "save", at: 362, dur: 58},
  ],
  sfx: [
    {at: 2, sfx: "blink-bell"},
    {at: 60, sfx: "whoosh-1"},
    {at: 75, sfx: "sweep-up"},
    {at: 120, sfx: "ui-select"},
    {at: 135, sfx: "ui-select"},
    {at: 285, sfx: "click"},
    {at: 299, sfx: "click"},
    {at: 313, sfx: "click"},
    {at: 335, sfx: "shining"},
    {at: 374, sfx: "ding"},
    {at: 400, sfx: "whoosh-zoom"},
  ],
};

export const SayaKitPreview: React.FC<SayaEditProps> = (props) => <SayaEdit {...props} />;
