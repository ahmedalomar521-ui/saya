// سايا — غلاف ريل Publer (9:16). A real frame of the edit (4.3 s) zoomed on
// her face, with the cover text in Cairo. Face and text sit inside the centre
// 1080×1080 square, because the profile grid crops the rest.
import {siInstagram, siTiktok, siYoutube} from "simple-icons";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {HOUSE_GRADE} from "../styles/shared/house";
import {SAYA} from "../styles/saya/tokens";

export type CoverProps = {line1: string; line2: string};

const FACE = {x: 545, y: 640}; // face centre in the frame
const ZOOM = 2.1;
const AT = {x: 540, y: 1130}; // where the face lands on the cover

const Logo: React.FC<{path: string; bg: string}> = ({path, bg}) => (
  <div style={{width: 112, height: 112, borderRadius: 30, background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,.45)"}}>
    <svg viewBox="0 0 24 24" width={64} height={64}>
      <path d={path} fill="#fff" />
    </svg>
  </div>
);

export const SayaPublerCover: React.FC<CoverProps> = ({line1, line2}) => (
  <AbsoluteFill style={{background: SAYA.color.navy, overflow: "hidden"}}>
    <Img
      src={staticFile("footage/publer/cover-frame.png")}
      style={{position: "absolute", left: AT.x - FACE.x * ZOOM, top: AT.y - FACE.y * ZOOM, width: 1080 * ZOOM, height: 1920 * ZOOM, filter: HOUSE_GRADE}}
    />
    {/* darker top so the text reads */}
    <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,27,63,.85) 0%, rgba(11,27,63,.55) 30%, rgba(11,27,63,0) 45%)"}} />
    <div style={{position: "absolute", top: 400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", direction: "rtl", fontFamily: SAYA.font}}>
      <div style={{fontWeight: 900, fontSize: 132, lineHeight: 1.1, color: "#fff", textShadow: "0 6px 22px rgba(0,0,0,.6)"}}>{line1}</div>
      <div style={{marginTop: 44, padding: "6px 34px 14px", borderRadius: 26, background: "#FFB020", color: SAYA.color.navy, fontWeight: 900, fontSize: 92, lineHeight: 1.2, transform: "rotate(-2deg)", boxShadow: "0 10px 30px rgba(0,0,0,.45)"}}>{line2}</div>
    </div>
    <div style={{position: "absolute", top: 770, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 34}}>
      <Logo path={siInstagram.path} bg="linear-gradient(45deg,#FFB020,#FF3D57 50%,#C837AB)" />
      <Logo path={siTiktok.path} bg="#000" />
      <Logo path={siYoutube.path} bg="#FF0000" />
    </div>
  </AbsoluteFill>
);
