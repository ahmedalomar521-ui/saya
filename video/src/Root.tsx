import {Composition} from "remotion";
import {FPS, TOTAL_FRAMES} from "./edit";
import {Reel} from "./Reel";
import {fontsLoaded} from "./theme";
import {SayaIntro, SAYA_FPS, SAYA_FRAMES} from "./videos/SayaIntro";
import {style1Fonts} from "./styles/style1/tokens";
import {SayaIntroStyle2, SAYA2_FPS, SAYA2_FRAMES} from "./videos/SayaIntroStyle2";
import {style2Fonts} from "./styles/style2/tokens";
import {SayaIntroStyle3, SAYA3_FPS, SAYA3_FRAMES} from "./videos/SayaIntroStyle3";
import {style3Fonts} from "./styles/style3/tokens";
import {SayaIntroStyle4, SAYA4_FPS, SAYA4_FRAMES} from "./videos/SayaIntroStyle4";
import {style4Fonts} from "./styles/style4/tokens";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="InstagramReuse"
        component={Reel}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await fontsLoaded;
          return {};
        }}
      />
      {/* ستايل 1 */}
      <Composition
        id="SayaIntro"
        component={SayaIntro}
        durationInFrames={SAYA_FRAMES}
        fps={SAYA_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await style1Fonts;
          return {};
        }}
      />
      {/* ستايل 2 */}
      <Composition
        id="SayaIntroStyle2"
        component={SayaIntroStyle2}
        durationInFrames={SAYA2_FRAMES}
        fps={SAYA2_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await style2Fonts;
          return {};
        }}
      />
      {/* ستايل 3 */}
      <Composition
        id="SayaIntroStyle3"
        component={SayaIntroStyle3}
        durationInFrames={SAYA3_FRAMES}
        fps={SAYA3_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await style3Fonts;
          return {};
        }}
      />
      {/* ستايل 4 */}
      <Composition
        id="SayaIntroStyle4"
        component={SayaIntroStyle4}
        durationInFrames={SAYA4_FRAMES}
        fps={SAYA4_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await style4Fonts;
          return {};
        }}
      />
    </>
  );
};
