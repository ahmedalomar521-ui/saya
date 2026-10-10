// Plays Saya library sounds at given frames (1–2 frames before the visual).
import {Audio} from "@remotion/media";
import {Sequence} from "remotion";
import {SAYA_SFX_VOLUME, sayaSfx, type SayaSfx} from "./sfx";

export type SfxCue = {at: number; sfx: SayaSfx; volume?: number; frames?: number};

export const SfxTrack: React.FC<{cues: SfxCue[]; lead?: number}> = ({cues, lead = 2}) => (
  <>
    {cues.map((c, i) => (
      <Sequence key={i} from={Math.max(0, c.at - lead)} durationInFrames={c.frames ?? 150} layout="none" name={`sfx ${c.sfx}`}>
        <Audio src={sayaSfx(c.sfx)} volume={c.volume ?? SAYA_SFX_VOLUME[c.sfx]} />
      </Sequence>
    ))}
  </>
);
