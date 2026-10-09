// "خيارين بانستغرام لازم تطفيهم" — edited by combining Styles 1–4.
//   Style 1: yellow two-tier hook title, split-screen tutorial, doodles
//   Style 2: glowing kashida captions, red emphasis/bar, mint + paper inserts, red arrow, glow icon
//   Style 3: white flash + punch-in on section changes
//   Style 4: neon linked icons for the share CTA, fade to black
// House rules: footage colour untouched (HOUSE_GRADE), spoken word light blue.
import {Audio} from "@remotion/media";
import {AbsoluteFill, interpolate, Sequence, Series, staticFile, useCurrentFrame} from "remotion";
import {makeTimeline} from "../styles/style1/timeline";
import {S1TalkingHead} from "../styles/style1/Layout";
import {S1Title} from "../styles/style1/Titles";
import {S1Captions, chunkPhrases} from "../styles/style1/Captions";
import {Burst, CurlyArrow} from "../styles/style1/Doodles";
import {S2} from "../styles/style2/tokens";
import {buildPages, S2Captions} from "../styles/style2/GlowCaptions";
import {GlassChip, GlowIcon, MintStage, PaperLines, PaperStage, RedArrow} from "../styles/style2/Inserts";
import {S3Flash} from "../styles/style3/WordCaptions";
import {NeonIconPath} from "../styles/style4/Neon";
import {FollowCTA, PhoneSettings, RecFrame} from "../Overlays";

export const MIX_FPS = 30;
const SRC = staticFile("footage/insta-share.mp4");

// Speech ranges (source seconds) from silencedetect on the joined footage.
const T = makeTimeline(
  [
    [0.16, 2.69],
    [3.01, 4.55],
    [4.99, 6.29],
    [6.6, 8.0],
    [8.31, 10.7],
    [11.11, 12.2],
    [12.53, 15.29],
    [15.59, 17.47],
    [17.79, 19.83],
    [20.19, 23.21],
    [23.54, 25.75],
    [26.09, 26.45],
    [26.74, 28.59],
    [28.94, 31.79],
    [32.02, 32.88],
    [33.15, 38.73],
    [39.0, 41.05],
  ],
  MIX_FPS,
);
const TAIL = 14;
export const MIX_FRAMES = T.total + TAIL;
const at = T.at;
const span = T.span;

// ---------------------------------------------------------------- phrases
// Text from the SRT (cleaned), times snapped to the detected pauses.
// Style-2 markup: *word* red glow, [words] red bar.
const PH: {s: number; e: number; t: string}[] = [
  {s: 0.16, e: 0.8, t: "إذا بتنشر"},
  {s: 0.87, e: 2.69, t: "صورك وفيديوهاتك على انستغرام"},
  {s: 3.01, e: 3.87, t: "[لا تتجاهل]"},
  {s: 3.87, e: 4.55, t: "هالإعدادين"},
  {s: 4.99, e: 6.29, t: "في خيارين بانستغرام"},
  {s: 6.6, e: 7.1, t: "إذا كانوا"},
  {s: 7.1, e: 8.0, t: "مفعّلين عندك"},
  {s: 8.31, e: 9.1, t: "ممكن يسمحوا"},
  {s: 9.17, e: 10.7, t: "بإعادة استخدام *محتواك*"},
  {s: 11.11, e: 12.2, t: "إذا ما بدك هالشي"},
  {s: 12.53, e: 14.3, t: "خلّيني فرجيكي كيف *تطفيهم*"},
  {s: 14.4, e: 15.29, t: "افتح الإعدادات"},
  {s: 15.59, e: 17.47, t: "وادخل على Share & Reuse"},
  {s: 17.79, e: 18.6, t: "يعني المشاركة"},
  {s: 18.73, e: 19.83, t: "وإعادة الاستخدام"},
  {s: 20.19, e: 21.3, t: "وراجع الخيارين"},
  {s: 21.4, e: 23.21, t: "وطفّيهم إذا ما بدك تسمح"},
  {s: 23.54, e: 25.75, t: "بإعادة استخدام *محتواك*"},
  {s: 26.09, e: 26.45, t: "وراح تقلّي"},
  {s: 26.74, e: 28.59, t: "طيب بيقدروا [يسجلوا الشاشة] صح؟"},
  {s: 28.94, e: 29.7, t: "ولهيك تعطيل"},
  {s: 29.8, e: 31.79, t: "هالخيارات مو حماية كاملة"},
  {s: 32.02, e: 32.88, t: "بس على الأقل"},
  {s: 33.15, e: 34.9, t: "[لا تفعّل بنفسك] خيارات"},
  {s: 35.1, e: 36.3, t: "ما بدك تسمح فيها"},
  {s: 36.4, e: 37.15, t: "ابعت الفيديو"},
  {s: 37.15, e: 38.73, t: "لأي صانع محتوى بتعرفه"},
  {s: 39.0, e: 40.15, t: "وتابعني لأخبار"},
  {s: 40.15, e: 41.05, t: "انستغرام والـ *AI*"},
];
const toOut = (p: {s: number; e: number; t: string}) => ({start: at(p.s), end: at(p.e), text: p.t});
const PAGES = buildPages(PH.map(toOut), 2);

// ---------------------------------------------------------------- windows
const W = {
  hook: span(0.16, 2.75),
  mint: span(4.99, 8.15),
  split: span(14.3, 23.4),
  rec: span(26.74, 28.7),
  paper: span(28.94, 32.0),
  share: span(36.4, 38.85),
  follow: {from: at(39.0), durationInFrames: MIX_FRAMES - at(39.0)},
};
const inside = (f: number, w: {from: number; durationInFrames: number}) => f >= w.from && f < w.from + w.durationInFrames;
const isSplit = (f: number) => inside(f, W.split);
const hideGlow = (f: number) => inside(f, W.hook) || inside(f, W.mint) || inside(f, W.split) || inside(f, W.paper);

// split-screen captions (Style 1, boxed on the seam) — only the split phrases
const SPLIT_CHUNKS = chunkPhrases(PH.filter((p) => p.s >= 14.3 && p.s < 23.4).map(toOut));

// Framing: calm by default, punch-in on section changes (Style 3).
const PUNCH: [number, number, number][] = [
  [3.01, 4.6, 1.22],
  [12.53, 14.3, 1.12],
  [26.74, 28.7, 1.2],
  [32.02, 32.95, 1.1],
];
const FLASH_AT = [3.01, 12.53, 26.74, 32.02];
const zoomAtSrc = (t: number) => PUNCH.find(([a, b]) => t >= a && t < b)?.[2] ?? 1;

const Clip: React.FC<{srcStart: number; outStart: number}> = ({srcStart, outStart}) => {
  const frame = useCurrentFrame();
  const out = outStart + frame;
  const srcT = (srcStart + frame) / MIX_FPS;
  return (
    <S1TalkingHead
      src={SRC}
      trimBefore={srcStart}
      mode={isSplit(out) ? "bottom" : "full"}
      focusY={0.3}
      zoom={zoomAtSrc(srcT)}
    />
  );
};

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

export const InstaShareMix: React.FC = () => {
  return (
    <AbsoluteFill style={{background: "#000"}}>
      {/* ---------------- footage (jump cuts) ---------------- */}
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

      {/* ---------------- Style 3: flashes on section changes ---------------- */}
      {FLASH_AT.map((t) => (
        <Sequence key={t} name={`Flash ${t}`} from={at(t)} durationInFrames={8}>
          <S3Flash />
        </Sequence>
      ))}

      {/* ---------------- Style 1: hook titles above the head ---------------- */}
      <Sequence name="Hook 1" {...span(0.16, 1.75)}>
        <S1Title small="إذا بتنشر" big="صورك وفيديوهاتك" duration={at(1.75) - at(0.16)} y={400} />
      </Sequence>
      <Sequence name="Hook 2" {...span(1.75, 2.75)}>
        <S1Title big="على انستغرام" duration={at(2.75) - at(1.75)} y={400} squiggle />
      </Sequence>
      <Sequence name="Hook burst" {...span(1.9, 2.75)}>
        <AbsoluteFill>
          <Burst style={{position: "absolute", top: 120, left: 110}} />
          <Burst style={{position: "absolute", top: 120, right: 110, transform: "scaleX(-1)"}} />
        </AbsoluteFill>
      </Sequence>

      {/* ---------------- Style 2: red arrows ---------------- */}
      <Sequence name="Arrow content" {...span(9.17, 10.7)}>
        <RedArrow style={{position: "absolute", top: 830, right: 120}} size={170} />
      </Sequence>
      <Sequence name="Arrow off" {...span(12.9, 14.3)}>
        <RedArrow style={{position: "absolute", top: 830, left: 120}} size={170} flip />
      </Sequence>
      <Sequence name="Arrow reuse" {...span(23.9, 25.75)}>
        <RedArrow style={{position: "absolute", top: 830, right: 120}} size={170} />
      </Sequence>

      {/* ---------------- Style 2: glow icon under the captions ---------------- */}
      <Sequence name="Checklist icon" {...span(33.15, 36.3)}>
        <AbsoluteFill style={{alignItems: "center"}}>
          <div style={{position: "absolute", top: 1330}}>
            <GlowIcon name="checklist" size={210} />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* ---------------- Style 2: mint insert (the two options) ---------------- */}
      <Sequence name="Insert: two options" {...W.mint}>
        <MintStage>
          <AbsoluteFill style={{alignItems: "center", justifyContent: "center", gap: 110}}>
            <GlassChip label="الخيار الأول" colors={S2.color.chipOrange} icon="alert" delay={rel(W.mint, 5.5)} scale={1.3} />
            <GlassChip
              label="الخيار الثاني"
              colors={S2.color.chipRed}
              icon="alert"
              delay={rel(W.mint, 5.85)}
              scale={1.3}
              sub="مفعّلين عندك؟"
              subDelay={rel(W.mint, 7.1) - rel(W.mint, 5.85)}
            />
          </AbsoluteFill>
        </MintStage>
      </Sequence>

      {/* ---------------- Style 1: split-screen tutorial ---------------- */}
      <Sequence name="Split paper" {...W.split}>
        <AbsoluteFill style={{height: 960, background: "#F4F4F5"}} />
      </Sequence>
      <Sequence name="Phone tutorial" {...W.split}>
        <AbsoluteFill style={{height: 960, overflow: "hidden"}}>
          <div style={{position: "absolute", left: 0, top: -40, width: 1080, height: 1920, transform: "scale(0.66)", transformOrigin: "50% 0%"}}>
            <PhoneSettings
              duration={W.split.durationInFrames}
              tapAt={rel(W.split, 16.3)}
              screen2At={rel(W.split, 17.0)}
              off1At={rel(W.split, 21.75)}
              off2At={rel(W.split, 22.15)}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
      <Sequence name="Split captions" {...W.split}>
        <AbsoluteFill>
          <ShiftedS1Captions offset={W.split.from} />
        </AbsoluteFill>
      </Sequence>

      {/* ---------------- screen-recording beat ---------------- */}
      <Sequence name="REC" {...W.rec}>
        <RecFrame duration={W.rec.durationInFrames} />
      </Sequence>

      {/* ---------------- Style 2: paper insert ---------------- */}
      <Sequence name="Insert: not full protection" {...W.paper}>
        <PaperStage>
          <PaperLines
            top={560}
            lines={[
              {text: "تعطيل الخيارات", at: rel(W.paper, 29.2), size: 110},
              {text: "مو حماية", at: rel(W.paper, 30.5), size: 130},
              {text: "كاملة", at: rel(W.paper, 31.1), size: 200, strike: true},
            ]}
          />
        </PaperStage>
      </Sequence>

      {/* ---------------- Style 4: neon share path, then follow CTA ---------------- */}
      <Sequence name="Neon share path" {...W.share}>
        <NeonIconPath icons={["play", "plane", "user"]} duration={W.share.durationInFrames} stepFrames={14} />
      </Sequence>
      <Sequence name="Follow CTA" {...W.follow}>
        <FollowCTA duration={W.follow.durationInFrames} clickAt={rel(W.follow, 40.0)} />
      </Sequence>
      <Sequence name="Follow arrow" {...span(39.3, 41.05)}>
        <CurlyArrow size={150} color="#FFFFFF" style={{position: "absolute", top: 260, right: 130}} />
      </Sequence>

      {/* ---------------- Style 2: glowing captions (main) ---------------- */}
      <S2Captions pages={PAGES} top={990} hideDuring={hideGlow} />

      <Sequence name="Fade out" from={MIX_FRAMES - TAIL}>
        <FadeOut />
      </Sequence>

      {/* ---------------- sound design ---------------- */}
      <Sfx at={at(0.16)} src="whoosh" volume={0.4} />
      <Sfx at={at(1.75)} src="pop" volume={0.5} />
      {FLASH_AT.map((t) => (
        <Sfx key={t} at={at(t)} src="boom" volume={0.3} />
      ))}
      <Sfx at={at(4.99)} src="whoosh" volume={0.45} />
      <Sfx at={at(5.5)} src="pop" volume={0.5} />
      <Sfx at={at(5.85)} src="pop" volume={0.5} />
      <Sfx at={at(8.15) - 3} src="whoosh" volume={0.3} />
      <Sfx at={at(14.3)} src="whoosh" volume={0.45} />
      <Sfx at={at(16.3)} src="click" volume={0.7} />
      <Sfx at={at(17.0)} src="whoosh" volume={0.25} />
      <Sfx at={at(21.75)} src="click" volume={0.8} />
      <Sfx at={at(22.15)} src="click" volume={0.8} />
      <Sfx at={at(22.35)} src="ding" volume={0.35} />
      <Sfx at={at(28.94)} src="whoosh" volume={0.45} />
      <Sfx at={at(31.5)} src="click" volume={0.6} />
      <Sfx at={at(36.4)} src="whoosh" volume={0.4} />
      <Sfx at={at(40.0)} src="click" volume={0.8} />
      <Sfx at={at(40.2)} src="ding" volume={0.35} />
    </AbsoluteFill>
  );
};

/** Style-1 boxed captions for the split window (Sequence-relative frames). */
const ShiftedS1Captions: React.FC<{offset: number}> = ({offset}) => {
  const chunks = SPLIT_CHUNKS.map((c) => ({...c, start: c.start - offset, end: c.end - offset}));
  return <S1Captions chunks={chunks} isSplit={() => true} />;
};
