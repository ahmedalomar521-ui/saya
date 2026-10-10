// "مسحت محادثة انستغرام وندمت؟" — edited in ستايل 0 (all styles combined).
//   Style 1: yellow hook title, split-screen phone walkthrough + seam captions
//   Style 2: glowing kashida captions, red bar, paper insert with strike, red arrow
//   Style 3: flash + punch-in on turns
//   Style 4: neon icon label / icon paths in the headroom
// House rules: footage colour untouched, spoken word light blue.
import {Audio} from "@remotion/media";
import {AbsoluteFill, interpolate, Sequence, Series, staticFile, useCurrentFrame} from "remotion";
import {makeTimeline} from "../styles/style1/timeline";
import {S1TalkingHead} from "../styles/style1/Layout";
import {S1Title} from "../styles/style1/Titles";
import {S1Captions, chunkPhrases} from "../styles/style1/Captions";
import {Burst, CurlyArrow} from "../styles/style1/Doodles";
import {buildPages, S2Captions} from "../styles/style2/GlowCaptions";
import {PaperLines, PaperStage, RedArrow} from "../styles/style2/Inserts";
import {S3Flash} from "../styles/style3/WordCaptions";
import {NeonIconLabel, NeonIconPath} from "../styles/style4/Neon";
import {FlowScreen, NotificationBanner, PhoneFlow} from "../styles/shared/PhoneFlow";
import {FollowCTA} from "../Overlays";

export const RC_FPS = 30;
const SRC = staticFile("footage/job7.mp4");

const T = makeTimeline(
  [
    [0.19, 2.14],
    [2.63, 4.11],
    [4.47, 6.64],
    [6.98, 8.24],
    [8.61, 10.05],
    [10.39, 12.29],
    [12.73, 15.7],
    [16.07, 17.72],
    [18.24, 19.81],
    [20.18, 21.62],
    [21.96, 25.01],
    [25.6, 26.79],
    [27.16, 29.09],
    [29.48, 30.5],
    [30.92, 32.69],
    [32.88, 36.04],
    [36.37, 43.47],
    [43.87, 45.85],
  ],
  RC_FPS,
);
const TAIL = 14;
export const RC_FRAMES = T.total + TAIL;
const at = T.at;
const span = T.span;

// ---------------------------------------------------------------- phrases (SRT)
const PH: {s: number; e: number; t: string}[] = [
  {s: 0.2, e: 2.27, t: "مسحت محادثة انستغرام وندمت؟"},
  {s: 2.53, e: 3.13, t: "في طريقة"},
  {s: 3.13, e: 4.27, t: "تجيب [نسخة منها]"},
  {s: 4.37, e: 5.53, t: "وبأقل من *دقيقة*"},
  {s: 5.73, e: 6.57, t: "افتح انستغرام"},
  {s: 6.9, e: 8.17, t: "وادخل على الإعدادات"},
  {s: 8.6, e: 9.9, t: "بعدين مركز الحسابات"},
  {s: 10.33, e: 11.37, t: "وبعدها معلوماتك"},
  {s: 11.5, e: 12.37, t: "وأذوناتك"},
  {s: 12.7, e: 13.97, t: "وبعدين اختار تصدير"},
  {s: 14.1, e: 14.8, t: "معلوماتك"},
  {s: 14.8, e: 15.6, t: "اختار حسابك"},
  {s: 16.0, e: 17.7, t: "وبعدها التصدير إلى الجهاز"},
  {s: 18.17, e: 19.73, t: "ادخل على تخصيص المعلومات"},
  {s: 20.13, e: 21.57, t: "وحدّد الرسائل فقط"},
  {s: 21.9, e: 23.7, t: "واختار الفترة الزمنية اللي بدك"},
  {s: 23.77, e: 25.0, t: "ياها مثلاً آخر شهر"},
  {s: 25.57, e: 26.9, t: "بعدها ابدأ التصدير"},
  {s: 27.1, e: 29.27, t: "وانتظر إشعار البريد الإلكتروني"},
  {s: 29.47, e: 31.3, t: "لما يجهز الملف *نزّله*"},
  {s: 31.4, e: 32.73, t: "وافتح مجلد الرسائل"},
  {s: 32.8, e: 33.53, t: "[بس انتبه]"},
  {s: 33.53, e: 34.47, t: "الرسائل ما بترجع"},
  {s: 34.57, e: 35.87, t: "تلقائياً على انستغرام"},
  {s: 35.97, e: 37.8, t: "إنت عم تفتح نسخة من البيانات"},
  {s: 38.0, e: 38.8, t: "[ومو مضمون]"},
  {s: 38.87, e: 40.6, t: "تلاقي كل المحادثات المحذوفة"},
  {s: 40.67, e: 41.37, t: "ابعت الريل"},
  {s: 41.37, e: 42.3, t: "لصاحبك اللي دايماً"},
  {s: 42.37, e: 43.5, t: "بيمسح *محادثاته*"},
  {s: 43.8, e: 44.73, t: "وتابعني لأخبار"},
  {s: 44.9, e: 45.85, t: "وحيل انستغرام"},
];
const toOut = (p: {s: number; e: number; t: string}) => ({start: at(p.s), end: at(p.e), text: p.t});
const PAGES = buildPages(PH.map(toOut), 2);

// ---------------------------------------------------------------- windows
const W = {
  hook: span(0.19, 2.4),
  quick: span(4.37, 5.6),
  split: span(5.6, 27.0),
  mail: span(27.1, 29.4),
  files: span(29.47, 32.75),
  paper: span(33.53, 37.95),
  share: span(40.67, 43.6),
  follow: {from: at(43.8), durationInFrames: RC_FRAMES - at(43.8)},
};
const inside = (f: number, w: {from: number; durationInFrames: number}) => f >= w.from && f < w.from + w.durationInFrames;
const isSplit = (f: number) => inside(f, W.split);
const hideGlow = (f: number) => inside(f, W.hook) || inside(f, W.split) || inside(f, W.paper);
const SPLIT_CHUNKS = chunkPhrases(PH.filter((p) => p.s >= 5.6 && p.s < 27.0).map(toOut));

const PUNCH: [number, number, number][] = [
  [2.53, 4.2, 1.15],
  [32.8, 33.6, 1.2],
  [38.0, 40.6, 1.1],
];
const FLASH_AT = [2.63, 32.88];
const zoomAtSrc = (t: number) => PUNCH.find(([a, b]) => t >= a && t < b)?.[2] ?? 1;

const Clip: React.FC<{srcStart: number; outStart: number}> = ({srcStart, outStart}) => {
  const frame = useCurrentFrame();
  const out = outStart + frame;
  return (
    <S1TalkingHead
      src={SRC}
      trimBefore={srcStart}
      mode={isSplit(out) ? "bottom" : "full"}
      focusY={0.36}
      zoom={zoomAtSrc((srcStart + frame) / RC_FPS)}
    />
  );
};

// ---------------------------------------------------------------- phone walkthrough
const r = (t: number) => at(t) - W.split.from;
const SCREENS: FlowScreen[] = [
  {at: 0, title: "saya", back: false, rows: [{label: "Edit profile", kind: "button"}, {label: "☰  Menu", sub: "Settings and activity", tapAt: r(7.0)}]},
  {
    at: r(7.2),
    title: "Settings and activity",
    rows: [
      {label: "Accounts Center", sub: "Password, security, personal details", tapAt: r(9.2)},
      {label: "Notifications"},
      {label: "Account privacy"},
      {label: "Close Friends"},
    ],
  },
  {
    at: r(9.45),
    title: "Accounts Center",
    rows: [
      {label: "Profiles"},
      {label: "Password and security"},
      {label: "Your information and permissions", tapAt: r(11.6)},
      {label: "Ad preferences"},
    ],
  },
  {
    at: r(11.85),
    title: "Your information and permissions",
    rows: [{label: "Access your information"}, {label: "Export your information", tapAt: r(13.6)}, {label: "Search history"}],
  },
  {at: r(13.85), title: "Export your information", rows: [{label: "Create export", kind: "button", tapAt: r(14.5)}]},
  {at: r(14.7), title: "Select profile", rows: [{label: "saya", sub: "Instagram", kind: "account", tapAt: r(15.3)}]},
  {
    at: r(15.6),
    title: "Choose where to export",
    rows: [{label: "Export to device", tapAt: r(17.0)}, {label: "Export to external service"}],
  },
  {
    at: r(17.25),
    title: "Confirm your export",
    rows: [{label: "Customize information", tapAt: r(19.0)}, {label: "Date range", sub: "All time"}, {label: "Format", sub: "HTML"}],
  },
  {
    at: r(19.25),
    title: "Customize information",
    rows: [
      {label: "Messages", kind: "check", on: true, onAt: 0},
      {label: "Posts", kind: "check"},
      {label: "Comments", kind: "check"},
      {label: "Likes", kind: "check"},
    ],
  },
  {
    at: r(22.0),
    title: "Date range",
    rows: [
      {label: "Last week", kind: "radio"},
      {label: "Last month", kind: "radio", tapAt: r(24.4)},
      {label: "Last year", kind: "radio"},
      {label: "All time", kind: "radio"},
    ],
  },
  {
    at: r(25.4),
    title: "Confirm your export",
    rows: [
      {label: "Messages", sub: "Customized"},
      {label: "Date range", sub: "Last month"},
      {label: "Start export", kind: "button", tapAt: r(26.3)},
    ],
  },
];
// "Messages only": the other boxes are unchecked and Messages gets ticked on the word
SCREENS[8].rows[0] = {label: "Messages", kind: "check", tapAt: r(20.9)};

// ---------------------------------------------------------------- composition
const Sfx: React.FC<{at: number; src: string; volume?: number}> = ({at: f, src, volume = 1}) => (
  <Sequence from={f} durationInFrames={30} layout="none" name={`sfx ${src}`}>
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={volume} />
  </Sequence>
);

const FadeOut: React.FC = () => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: "#000", opacity: interpolate(frame, [0, TAIL], [0, 1], {extrapolateRight: "clamp"})}} />;
};

const rel = (w: {from: number}, t: number) => at(t) - w.from;
const TAPS = [7.0, 9.2, 11.6, 13.6, 14.5, 15.3, 17.0, 19.0, 20.9, 24.4, 26.3];

export const RecoverChatsMix: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      <Series>
        {T.segments.map((seg, i) => {
          const last = i === T.segments.length - 1;
          return (
            <Series.Sequence key={i} name={`Clip ${i + 1}`} durationInFrames={seg.duration + (last ? TAIL : 0)}>
              <Clip srcStart={seg.srcStart} outStart={seg.outStart} />
            </Series.Sequence>
          );
        })}
      </Series>

      {FLASH_AT.map((t) => (
        <Sequence key={t} name={`Flash ${t}`} from={at(t)} durationInFrames={8}>
          <S3Flash />
        </Sequence>
      ))}

      {/* Style 1 hook */}
      <Sequence name="Hook" {...W.hook}>
        <S1Title small="مسحت محادثة انستغرام" big="وندمت؟" duration={W.hook.durationInFrames} y={330} squiggle />
      </Sequence>
      <Sequence name="Hook burst" {...span(1.3, 2.4)}>
        <AbsoluteFill>
          <Burst style={{position: "absolute", top: 90, left: 230}} />
          <Burst style={{position: "absolute", top: 90, right: 230, transform: "scaleX(-1)"}} />
        </AbsoluteFill>
      </Sequence>

      {/* Style 2 arrow on "a copy of it" */}
      <Sequence name="Arrow copy" {...span(3.2, 4.3)}>
        <RedArrow style={{position: "absolute", top: 820, right: 120}} size={170} />
      </Sequence>

      {/* Style 4: under a minute */}
      <Sequence name="Under a minute" {...W.quick}>
        <NeonIconLabel icon="clock" label="< 1 min" duration={W.quick.durationInFrames} />
      </Sequence>

      {/* Style 1 split-screen walkthrough */}
      <Sequence name="Split paper" {...W.split}>
        <AbsoluteFill style={{height: 960, background: "#F4F4F5"}} />
      </Sequence>
      <Sequence name="Phone walkthrough" {...W.split}>
        <AbsoluteFill style={{height: 960, overflow: "hidden"}}>
          <PhoneFlow screens={SCREENS} duration={W.split.durationInFrames} />
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Split captions" {...W.split}>
        <AbsoluteFill>
          <ShiftedS1Captions offset={W.split.from} />
        </AbsoluteFill>
      </Sequence>

      {/* email notification */}
      <Sequence name="Mail" {...W.mail}>
        <NotificationBanner app="Mail" title="Your information is ready" body="Your download is ready to save" duration={W.mail.durationInFrames} />
      </Sequence>

      {/* Style 4: download → folder → messages */}
      <Sequence name="Files path" {...W.files}>
        <NeonIconPath icons={["download", "folder", "chat"]} duration={W.files.durationInFrames} stepFrames={22} />
      </Sequence>

      {/* Style 2 paper insert: not restored to Instagram */}
      <Sequence name="Insert: copy only" {...W.paper}>
        <PaperStage>
          <PaperLines
            top={520}
            lines={[
              {text: "الرسائل ما بترجع", at: rel(W.paper, 33.6), size: 110},
              {text: "على انستغرام", at: rel(W.paper, 34.8), size: 130, strike: true},
              {text: "إنت عم تفتح نسخة", at: rel(W.paper, 36.0), size: 96},
            ]}
          />
        </PaperStage>
      </Sequence>
      <Sequence name="Arrow not guaranteed" {...span(38.0, 40.6)}>
        <RedArrow style={{position: "absolute", top: 820, right: 120}} size={170} />
      </Sequence>

      {/* Style 4 share path, then follow */}
      <Sequence name="Share path" {...W.share}>
        <NeonIconPath icons={["play", "plane", "user"]} duration={W.share.durationInFrames} stepFrames={16} />
      </Sequence>
      <Sequence name="Follow" {...W.follow}>
        <FollowCTA duration={W.follow.durationInFrames} clickAt={rel(W.follow, 44.5)} />
      </Sequence>
      <Sequence name="Follow arrow" {...span(44.0, 45.85)}>
        <CurlyArrow size={150} color="#FFFFFF" style={{position: "absolute", top: 230, right: 120}} />
      </Sequence>

      <S2Captions pages={PAGES} top={1010} hideDuring={hideGlow} />

      <Sequence name="Fade out" from={RC_FRAMES - TAIL}>
        <FadeOut />
      </Sequence>

      {/* sound design */}
      <Sfx at={at(0.2)} src="whoosh" volume={0.4} />
      <Sfx at={at(1.4)} src="pop" volume={0.5} />
      {FLASH_AT.map((t) => (
        <Sfx key={t} at={at(t)} src="boom" volume={0.3} />
      ))}
      <Sfx at={at(4.37)} src="ding" volume={0.35} />
      <Sfx at={at(5.6)} src="whoosh" volume={0.45} />
      {TAPS.map((t) => (
        <Sfx key={t} at={at(t)} src="click" volume={0.55} />
      ))}
      <Sfx at={at(27.1)} src="ding" volume={0.45} />
      <Sfx at={at(29.5)} src="whoosh" volume={0.35} />
      <Sfx at={at(33.53)} src="whoosh" volume={0.45} />
      <Sfx at={at(35.3)} src="click" volume={0.5} />
      <Sfx at={at(40.67)} src="whoosh" volume={0.4} />
      <Sfx at={at(44.5)} src="click" volume={0.8} />
      <Sfx at={at(44.7)} src="ding" volume={0.35} />
    </AbsoluteFill>
  );
};

const ShiftedS1Captions: React.FC<{offset: number}> = ({offset}) => {
  const chunks = SPLIT_CHUNKS.map((c) => ({...c, start: c.start - offset, end: c.end - offset}));
  return <S1Captions chunks={chunks} isSplit={() => true} />;
};
