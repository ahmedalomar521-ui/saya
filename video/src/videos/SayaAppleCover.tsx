// سايا — غلاف ريل أبل (9:16). A real frame of the edit (3.0 s, surprised) zoomed
// on her face, the cover text in Cairo, and Apple's HomeView image in a glowing
// card. Face and text stay inside the centre 1080×1080 square (profile grid).
import {AbsoluteFill, Img, staticFile} from "remotion";
import {HOUSE_GRADE} from "../styles/shared/house";
import {neonGlow, SAYA} from "../styles/saya/tokens";

export type AppleCoverProps = {line1: string; line2: string};

const FACE = {x: 572, y: 675}; // face centre in the frame
const ZOOM = 2.0;
const AT = {x: 470, y: 1150}; // where the face lands on the cover

export const SayaAppleCover: React.FC<AppleCoverProps> = ({line1, line2}) => (
  <AbsoluteFill style={{background: SAYA.color.navy, overflow: "hidden"}}>
    <Img
      src={staticFile("footage/apple/cover-frame.png")}
      style={{position: "absolute", left: AT.x - FACE.x * ZOOM, top: AT.y - FACE.y * ZOOM, width: 1080 * ZOOM, height: 1920 * ZOOM, filter: HOUSE_GRADE}}
    />
    <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,27,63,.9) 0%, rgba(11,27,63,.6) 30%, rgba(11,27,63,0) 46%)"}} />
    <div style={{position: "absolute", top: 410, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", direction: "rtl", fontFamily: SAYA.font}}>
      <div style={{fontWeight: 900, fontSize: 128, lineHeight: 1.1, color: "#fff", textShadow: "0 6px 22px rgba(0,0,0,.6)"}}>{line1}</div>
      <div style={{marginTop: 36, padding: "4px 36px 14px", borderRadius: 26, background: SAYA.color.neon, color: "#fff", fontWeight: 900, fontSize: 96, lineHeight: 1.2, transform: "rotate(-2deg)", boxShadow: `0 0 30px ${SAYA.color.neon}, 0 10px 30px rgba(0,0,0,.45)`}}>{line2}</div>
    </div>
    {/* Apple's HomeView image in a glowing card */}
    <div style={{position: "absolute", left: 680, top: 1010, width: 360, height: 360, borderRadius: 40, overflow: "hidden", background: "#fff", border: `5px solid ${SAYA.color.neon}`, transform: "rotate(5deg)", filter: neonGlow(SAYA.color.neon, 0.8)}}>
      <Img src={staticFile("footage/apple/02-homeview-two-units.jpg")} style={{width: "100%", height: "100%", objectFit: "contain"}} />
    </div>
  </AbsoluteFill>
);
