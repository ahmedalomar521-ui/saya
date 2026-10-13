// SayaEdit — one component that renders a whole Saya edit from a timeline:
// footage moves, always-on captions, graphics and sounds. A new video is just
// a new timeline object (see videos/SayaKitPreview.tsx for every piece).
import {AbsoluteFill, Sequence, staticFile} from "remotion";
import {SayaCaptions, type CaptionNote, type CaptionPlace, type Range} from "./Captions";
import {SayaFootage, type PipPlace, type Zoom} from "./Footage";
import {SayaBurst, SayaCurlyArrow, SayaMarkerCircle, SayaRedArrow, SayaScribbleOut, SayaSquiggle} from "./Doodles";
import {FloatingWindow, GlassCard, InfoChip, PhoneMock, ScreenshotCard, SourceTag, TapPulse} from "./Inserts";
import {LogoPop, LogoStack, type Logo} from "./Logos";
import {NeonIconLabel, NeonIconPath, type NeonIconName} from "./Neon";
import {BigWord, FeaturePill, FollowCta, SaveCta, StepPill} from "./Pills";
import {SfxTrack, type SfxCue} from "./SfxTrack";
import {srtToChunks} from "./srt";
import {ChatExchange, DesktopCard} from "./Screens";
import {SketchIcons, Sticker, type SketchKind} from "./Stickers";
import {ListStage, NotificationBanner, PromptBox, RecFrame, StatCard, StrikeStage, type ListItem, type StrikeLine} from "./Stages";
import {SayaFlash, SayaHookTitle, SectionNumber} from "./Titles";
import {SAYA, SAYA_FPS} from "./tokens";

type Timed = {at: number; dur: number};
export type SayaGraphic = Timed &
  (
    | {type: "logo"; logo: Logo; place?: "caption" | {x: number; y: number}; size?: number}
    | {type: "logoStack"; items: {logo: Logo; at: number}[]; focus?: {index: number; at: number}}
    | {type: "phone"; src?: string; isVideo?: boolean; trimBefore?: number; playbackRate?: number; taps?: {at: number; x: number; y: number}[]}
    | {type: "screenshot"; src: string; aspect?: number; centerY?: number}
    | {type: "floating"; src: string; aspect?: number; width?: number; top?: number; x?: number; label?: string}
    | {type: "follow"; avatar: string; handle: string; text?: string; y?: number; pressAt?: number}
    | {type: "glass"; title: string; sub?: string; centerY?: number}
    | {type: "chip"; title: string; label?: string; icon?: string; y?: number}
    | {type: "feature"; text: string; y?: number}
    | {type: "bigWord"; text: string}
    | {type: "step"; text: string; x?: number; y?: number}
    | {type: "save"; text?: string; kind?: "save" | "share"; y?: number}
    | {type: "source"; text: string; y?: number}
    // --- ported from ستايل 1–4 (see Titles / Doodles / Neon / Stages) ---
    | {type: "title"; small?: string; big: string; y?: number; squiggle?: boolean}
    | {type: "section"; text: string; y?: number}
    | {type: "flash"}
    | {type: "neonLabel"; icon: NeonIconName; label: string; top?: number}
    | {type: "neonPath"; icons: NeonIconName[]; top?: number; stepFrames?: number}
    | {type: "list"; items: ListItem[]}
    | {type: "strike"; lines: StrikeLine[]; top?: number}
    | {type: "stat"; value: number; suffix?: string; label?: string; centerY?: number}
    | {type: "prompt"; text: string; placeholder?: string; sendAt?: number; centerY?: number}
    | {type: "rec"; timecode?: boolean; startSeconds?: number}
    | {type: "notification"; app: string; title: string; body: string; top?: number}
    // --- learned from reference R6 (Stickers / Screens) ---
    | {type: "sketch"; kind: SketchKind; x?: number; y?: number; spread?: number; color?: string}
    | {type: "sticker"; src: string; x: number; y: number; size?: number; glow?: boolean; rot?: number}
    | {type: "desktop"; src: string; isVideo?: boolean; trimBefore?: number; playbackRate?: number; aspect?: number; scroll?: boolean; height?: number; top?: number; width?: number}
    | {type: "tap"; x: number; y: number}
    | {type: "chat"; prompt: string; answer: string[]; side?: "left" | "right" | "center"; answerAt?: number}
    | {type: "doodle"; kind: "curlyArrow" | "circle" | "burst" | "squiggle" | "scribble" | "redArrow"; x: number; y: number; size?: number; w?: number; h?: number; flip?: boolean; color?: string; delay?: number}
  );

export type SayaEditProps = {
  /** Path inside public/, e.g. "footage/saya-01.mp4". */
  footage: string;
  isImage?: boolean;
  face?: {x: number; y: number; w: number};
  srt: string;
  zooms?: Zoom[];
  blur?: Range[];
  pip?: Range[];
  pipPlace?: PipPlace;
  whips?: number[];
  places?: CaptionPlace[];
  notes?: CaptionNote[];
  onLight?: Range[];
  hide?: Range[];
  graphics?: SayaGraphic[];
  sfx?: SfxCue[];
  /** Which layer to draw. "all" = the finished edit. The others are for the
   *  editable-timeline handoff (scripts/saya-handoff.mjs): "base" = footage
   *  with its moves and the voice; "captions" / a graphic index = that layer
   *  alone on a transparent background, with no sound. */
  layer?: "all" | "base" | "captions" | number;
};

/** Graphics that stand in the caption's place hide the caption meanwhile. */
const replacesCaption = (g: SayaGraphic) =>
  g.type === "feature" ||
  g.type === "bigWord" ||
  g.type === "list" ||
  g.type === "strike" ||
  (g.type === "logo" && (g.place ?? "caption") === "caption");

/** Doodles are placed by their centre (x, y) in canvas pixels. */
const Doodle: React.FC<{g: Extract<SayaGraphic, {type: "doodle"}>}> = ({g}) => {
  const size = g.size ?? 200;
  const w = g.w ?? 360;
  const h = g.h ?? 160;
  const box = g.kind === "circle" || g.kind === "scribble" ? {w: g.kind === "circle" ? w : 420, h: g.kind === "circle" ? h : 160} : g.kind === "squiggle" ? {w: g.w ?? 420, h: 60} : g.kind === "curlyArrow" ? {w: size, h: size * 1.4} : {w: size, h: size};
  return (
    <div style={{position: "absolute", left: g.x - box.w / 2, top: g.y - box.h / 2}}>
      {g.kind === "curlyArrow" ? <SayaCurlyArrow size={size} flip={g.flip} color={g.color} delay={g.delay} /> : null}
      {g.kind === "circle" ? <SayaMarkerCircle w={w} h={h} color={g.color} delay={g.delay} /> : null}
      {g.kind === "burst" ? <SayaBurst size={size} color={g.color} delay={g.delay} /> : null}
      {g.kind === "squiggle" ? <SayaSquiggle w={g.w ?? 420} color={g.color} delay={g.delay} /> : null}
      {g.kind === "scribble" ? <SayaScribbleOut color={g.color} delay={g.delay} /> : null}
      {g.kind === "redArrow" ? <SayaRedArrow size={size} flip={g.flip} delay={g.delay} /> : null}
    </div>
  );
};

const Graphic: React.FC<{g: SayaGraphic}> = ({g}) => {
  switch (g.type) {
    case "logo":
      return <LogoPop logo={g.logo} duration={g.dur} place={g.place} size={g.size} />;
    case "logoStack":
      return <LogoStack items={g.items} duration={g.dur} focus={g.focus} />;
    case "phone":
      return (
        <>
          <PhoneMock duration={g.dur} src={g.src ? staticFile(g.src) : undefined} isVideo={g.isVideo} trimBefore={g.trimBefore} playbackRate={g.playbackRate} />
          {(g.taps ?? []).map((t, i) => (
            <Sequence key={i} from={t.at} durationInFrames={16} layout="none">
              <TapPulse x={t.x} y={t.y} />
            </Sequence>
          ))}
        </>
      );
    case "screenshot":
      return <ScreenshotCard src={staticFile(g.src)} duration={g.dur} aspect={g.aspect} centerY={g.centerY} />;
    case "floating":
      return <FloatingWindow src={staticFile(g.src)} duration={g.dur} aspect={g.aspect} width={g.width} top={g.top} x={g.x} label={g.label} />;
    case "follow":
      return <FollowCta avatar={staticFile(g.avatar)} handle={g.handle} text={g.text} duration={g.dur} y={g.y} pressAt={g.pressAt} />;
    case "glass":
      return <GlassCard title={g.title} sub={g.sub} duration={g.dur} centerY={g.centerY} />;
    case "chip":
      return <InfoChip title={g.title} label={g.label} icon={g.icon} duration={g.dur} y={g.y} />;
    case "feature":
      return <FeaturePill text={g.text} duration={g.dur} y={g.y} />;
    case "bigWord":
      return <BigWord text={g.text} duration={g.dur} />;
    case "step":
      return <StepPill text={g.text} duration={g.dur} x={g.x} y={g.y} />;
    case "save":
      return <SaveCta text={g.text} duration={g.dur} kind={g.kind} y={g.y} />;
    case "source":
      return <SourceTag text={g.text} y={g.y} />;
    case "title":
      return <SayaHookTitle small={g.small} big={g.big} duration={g.dur} y={g.y} squiggle={g.squiggle} />;
    case "section":
      return <SectionNumber text={g.text} duration={g.dur} y={g.y} />;
    case "flash":
      return <SayaFlash />;
    case "neonLabel":
      return <NeonIconLabel icon={g.icon} label={g.label} duration={g.dur} top={g.top} />;
    case "neonPath":
      return <NeonIconPath icons={g.icons} duration={g.dur} top={g.top} stepFrames={g.stepFrames} />;
    case "list":
      return <ListStage items={g.items} duration={g.dur} />;
    case "strike":
      return <StrikeStage lines={g.lines} duration={g.dur} top={g.top} />;
    case "stat":
      return <StatCard value={g.value} suffix={g.suffix} label={g.label} duration={g.dur} centerY={g.centerY} />;
    case "prompt":
      return <PromptBox text={g.text} placeholder={g.placeholder} sendAt={g.sendAt} duration={g.dur} centerY={g.centerY} />;
    case "rec":
      return <RecFrame duration={g.dur} timecode={g.timecode} startSeconds={g.startSeconds} />;
    case "sketch":
      return <SketchIcons kind={g.kind} duration={g.dur} x={g.x} y={g.y} spread={g.spread} color={g.color} />;
    case "sticker":
      return <Sticker src={g.src} duration={g.dur} x={g.x} y={g.y} size={g.size} glow={g.glow} rot={g.rot} />;
    case "desktop":
      return <DesktopCard src={g.src} duration={g.dur} isVideo={g.isVideo} trimBefore={g.trimBefore} playbackRate={g.playbackRate} aspect={g.aspect} scroll={g.scroll} height={g.height} top={g.top} width={g.width} />;
    case "tap":
      return <TapPulse x={g.x} y={g.y} />;
    case "chat":
      return <ChatExchange prompt={g.prompt} answer={g.answer} duration={g.dur} side={g.side} answerAt={g.answerAt} />;
    case "notification":
      return <NotificationBanner app={g.app} title={g.title} body={g.body} duration={g.dur} top={g.top} />;
    case "doodle":
      return <Doodle g={g} />;
  }
};

export const sayaChunks = (p: SayaEditProps) => srtToChunks(p.srt, SAYA_FPS, SAYA.caption.maxWords, SAYA.caption.maxChars);

export const SayaEdit: React.FC<SayaEditProps> = (p) => {
  const layer = p.layer ?? "all";
  const chunks = sayaChunks(p);
  const graphics = p.graphics ?? [];
  const hide: Range[] = [...(p.hide ?? []), ...graphics.filter(replacesCaption).map((g) => [g.at, g.at + g.dur] as Range)];
  const show = (l: "base" | "captions" | number) => layer === "all" || layer === l;
  return (
    <AbsoluteFill style={{background: layer === "all" || layer === "base" ? "#000" : "transparent"}}>
      {show("base") ? (
        <SayaFootage src={staticFile(p.footage)} isImage={p.isImage} face={p.face} zooms={p.zooms} blur={p.blur} pip={p.pip} pipPlace={p.pipPlace} whips={p.whips} />
      ) : null}
      {graphics.map((g, i) =>
        show(i) ? (
          <Sequence key={i} from={g.at} durationInFrames={g.dur} name={`${g.type} ${i}`}>
            <Graphic g={g} />
          </Sequence>
        ) : null,
      )}
      {show("captions") ? <SayaCaptions chunks={chunks} hide={hide} places={p.places} notes={p.notes} onLight={p.onLight} /> : null}
      {layer === "all" ? <SfxTrack cues={p.sfx ?? []} /> : null}
    </AbsoluteFill>
  );
};
