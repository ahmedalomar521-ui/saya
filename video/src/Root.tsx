import {Composition} from "remotion";
import {FPS, TOTAL_FRAMES} from "./edit";
import {Reel} from "./Reel";
import {fontsLoaded} from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
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
  );
};
