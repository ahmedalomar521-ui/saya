// SayaEdit — one component that renders a whole Saya edit from a timeline:
// footage moves, always-on captions, graphics and sounds. A new video is just
// a new timeline object (see videos/SayaKitPreview.tsx for every piece).
import {AbsoluteFill, Sequence, staticFile} from "remotion";
import {SayaCaptions, type CaptionNote, type CaptionPlace, type Range} from "./Captions";
import {SayaFootage, type PipPlace, type Zoom} from "./Footage";
import {FloatingWindow, GlassCard, InfoChip, PhoneMock, ScreenshotCard, SourceTag, TapPulse} from "./Inserts";
import {LogoPop, LogoStack, type Logo} from "./Logos";
import {BigWord, FeaturePill, FollowCta, SaveCta, StepPill} from "./Pills";
import {SfxTrack, type SfxCue} from "./SfxTrack";
import {srtToChunks} from "./srt";
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
    | {type: "glass"; title: string; sub?: string}
    | {type: "chip"; title: string; label?: string; icon?: string; y?: number}
    | {type: "feature"; text: string; y?: number}
    | {type: "bigWord"; text: string}
    | {type: "step"; text: string}
    | {type: "save"; text?: string}
    | {type: "source"; text: string; y?: number}
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
  g.type === "feature" || g.type === "bigWord" || (g.type === "logo" && (g.place ?? "caption") === "caption");

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
      return <GlassCard title={g.title} sub={g.sub} duration={g.dur} />;
    case "chip":
      return <InfoChip title={g.title} label={g.label} icon={g.icon} duration={g.dur} y={g.y} />;
    case "feature":
      return <FeaturePill text={g.text} duration={g.dur} y={g.y} />;
    case "bigWord":
      return <BigWord text={g.text} duration={g.dur} />;
    case "step":
      return <StepPill text={g.text} duration={g.dur} />;
    case "save":
      return <SaveCta text={g.text} duration={g.dur} />;
    case "source":
      return <SourceTag text={g.text} y={g.y} />;
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
