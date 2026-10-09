// Caption text whose spoken word turns the house light blue (house rule 2).
import {useCurrentFrame} from "remotion";
import {activeWordIndex, HOUSE_ACTIVE_WORD} from "./house";

export const KaraokeText: React.FC<{
  text: string;
  start: number;
  end: number;
  activeStyle?: React.CSSProperties;
}> = ({text, start, end, activeStyle}) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  const active = activeWordIndex(frame, start, end, words);
  return (
    <>
      {words.map((w, i) => (
        <span key={i} style={i === active ? {color: HOUSE_ACTIVE_WORD, ...activeStyle} : undefined}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
};
