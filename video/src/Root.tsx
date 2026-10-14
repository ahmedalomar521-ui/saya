import {Composition, Still} from "remotion";
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
import {SayaKitMore, SAYA_KIT_MORE_FRAMES, SayaKitPreview, SayaKitR6, SAYA_KIT_FRAMES, SAYA_KIT_R6_FRAMES, sayaKitMoreProps, sayaKitProps, sayaKitR6Props} from "./videos/SayaKitPreview";
import {SayaDuckAi, SAYA_DUCK_FRAMES, sayaDuckProps} from "./videos/SayaDuckAi";
import {SayaChrome, SAYA_CHROME_FRAMES, sayaChromeProps} from "./videos/SayaChrome";
import {SayaPassword, SAYA_PASSWORD_FRAMES, sayaPasswordProps} from "./videos/SayaPassword";
import {SayaPubler, SAYA_PUBLER_FRAMES, sayaPublerProps} from "./videos/SayaPubler";
import {SayaPublerCover} from "./videos/SayaPublerCover";
import {SayaAppleHome, SAYA_APPLE_FRAMES, sayaAppleProps} from "./videos/SayaAppleHome";
import {SayaGaza, SAYA_GAZA_FRAMES, sayaGazaProps} from "./videos/SayaGaza";
import {SayaAppleCover} from "./videos/SayaAppleCover";
import {sayaFonts, SAYA_FPS as SAYA_STYLE_FPS} from "./styles/saya/tokens";
import {InstaShareMix, MIX_FPS, MIX_FRAMES} from "./videos/InstaShareMix";
import {SoundTypeMix, ST_FPS, ST_FRAMES} from "./videos/SoundTypeMix";
import {RecoverChatsMix, RC_FPS, RC_FRAMES} from "./videos/RecoverChatsMix";

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
      {/* All styles combined */}
      <Composition
        id="InstaShareMix"
        component={InstaShareMix}
        durationInFrames={MIX_FRAMES}
        fps={MIX_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await Promise.all([fontsLoaded, style1Fonts, style2Fonts, style4Fonts]);
          return {};
        }}
      />
      {/* ستايل 0 — SoundType */}
      <Composition
        id="SoundTypeMix"
        component={SoundTypeMix}
        durationInFrames={ST_FRAMES}
        fps={ST_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await Promise.all([style1Fonts, style2Fonts, style4Fonts]);
          return {};
        }}
      />
      {/* ستايل 0 — recover deleted chats */}
      <Composition
        id="RecoverChatsMix"
        component={RecoverChatsMix}
        durationInFrames={RC_FRAMES}
        fps={RC_FPS}
        width={1080}
        height={1920}
        calculateMetadata={async () => {
          await Promise.all([fontsLoaded, style1Fonts, style2Fonts, style4Fonts]);
          return {};
        }}
      />
      {/* ستايل سايا (saya_editor) — component gallery */}
      <Composition
        id="SayaKitPreview"
        component={SayaKitPreview}
        durationInFrames={SAYA_KIT_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaKitProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* ستايل سايا — the pieces ported from ستايل 1–4 */}
      <Composition
        id="SayaKitMore"
        component={SayaKitMore}
        durationInFrames={SAYA_KIT_MORE_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaKitMoreProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* ستايل سايا — pieces learned from reference R6 */}
      <Composition
        id="SayaKitR6"
        component={SayaKitR6}
        durationInFrames={SAYA_KIT_R6_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaKitR6Props}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* سايا — duck.ai (trial edit) */}
      <Composition
        id="SayaDuckAi"
        component={SayaDuckAi}
        durationInFrames={SAYA_DUCK_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaDuckProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* سايا — Chrome permissions */}
      <Composition
        id="SayaChrome"
        component={SayaChrome}
        durationInFrames={SAYA_CHROME_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaChromeProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* سايا — forgot your password? Chrome password manager */}
      <Composition
        id="SayaPassword"
        component={SayaPassword}
        durationInFrames={SAYA_PASSWORD_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaPasswordProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* سايا — download any video in 3 steps (Publer) */}
      <Composition
        id="SayaPubler"
        component={SayaPubler}
        durationInFrames={SAYA_PUBLER_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaPublerProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* سايا — غزة: علي الجعفراوي (reel inside a reel, Edits slot) */}
      <Composition
        id="SayaGaza"
        component={SayaGaza}
        durationInFrames={SAYA_GAZA_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaGazaProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      {/* سايا — Apple HomeView + Apple TV + HomePod mini 2 (split-screen) */}
      <Composition
        id="SayaAppleHome"
        component={SayaAppleHome}
        durationInFrames={SAYA_APPLE_FRAMES}
        fps={SAYA_STYLE_FPS}
        width={1080}
        height={1920}
        defaultProps={sayaAppleProps}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      <Still
        id="SayaAppleCover"
        component={SayaAppleCover}
        width={1080}
        height={1920}
        defaultProps={{line1: "أبل نزّلت", line2: "3 أجهزة للبيت"}}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
      <Still
        id="SayaPublerCover"
        component={SayaPublerCover}
        width={1080}
        height={1920}
        defaultProps={{line1: "نزّل أي فيديو", line2: "بلا علامة مائية"}}
        calculateMetadata={async () => {
          await sayaFonts;
          return {};
        }}
      />
    </>
  );
};
