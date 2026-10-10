// Saya handoff: turn a finished Saya edit into an editable timeline for
// Premiere Pro / DaVinci Resolve (FCP7 XML "xmeml").
//
//   node --experimental-strip-types scripts/saya-handoff.mjs <CompositionId> [--final] [--xml-only] [--root=<folder on the user's computer>]
//
// Output in out/handoff/<CompositionId>/:
//   media/base.mp4         footage with its zooms/blur/PiP + the voice (V1 + A1)
//   media/captions.mov     all captions, transparent (V2)
//   media/gNN-<type>.mov   one transparent clip per graphic (V3+), cut to its range
//   media/sfx-NN-<name>.wav every sound at its own place (A2+), level preset
//   captions.srt           the caption chunks as shown (for text fixes)
//   timeline.xml           import in Premiere (File > Import) or Resolve (File > Import > Timeline)
//   timeline.md            the same timeline as a readable table
//   final.mp4              (--final) the finished video in one file
// Transparent clips are ProRes 4444 with alpha.
import {bundle} from "@remotion/bundler";
import {renderMedia, selectComposition} from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {srtToChunks} from "../src/styles/saya/srt.ts";
import {SAYA_SFX_VOLUME} from "../src/styles/saya/sfx.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [id, ...flags] = process.argv.slice(2);
if (!id) throw new Error("usage: saya-handoff.mjs <CompositionId> [--final] [--xml-only]");
const xmlOnly = flags.includes("--xml-only");
// Absolute folder where the user will keep the handoff on their computer
// (e.g. --root=/Users/me/Desktop/Saya01). Without it the XML uses relative
// paths and the editor asks to relink once: point it at the media folder.
const userRoot = flags.find((f) => f.startsWith("--root="))?.slice(7);
const browserExecutable = process.env.REMOTION_BROWSER ?? "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell";
const out = path.join(root, "out", "handoff", id);
const mediaDir = path.join(out, "media");
fs.mkdirSync(mediaDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(root, "src", "index.ts"), publicDir: path.join(root, "public")});
const comp = await selectComposition({serveUrl, id, browserExecutable});
const props = comp.props;
const fps = comp.fps;
const total = comp.durationInFrames;
const graphics = props.graphics ?? [];
const sfx = props.sfx ?? [];
const pad = (n) => String(n).padStart(2, "0");

const render = async (file, layer, frameRange, alpha) => {
  if (xmlOnly) return;
  console.log(`render ${file}`);
  await renderMedia({
    serveUrl,
    composition: comp,
    browserExecutable,
    inputProps: {...props, layer},
    outputLocation: path.join(out, file),
    frameRange,
    ...(alpha
      ? {codec: "prores", proResProfile: "4444", pixelFormat: "yuva444p10le", imageFormat: "png"}
      : {codec: "h264", crf: 16, imageFormat: "jpeg"}),
  });
};

// ---- media
await render("media/base.mp4", "base", undefined, false);
await render("media/captions.mov", "captions", undefined, true);
const gFiles = [];
for (let i = 0; i < graphics.length; i++) {
  const g = graphics[i];
  const file = `media/g${pad(i)}-${g.type}.mov`;
  gFiles.push(file);
  await render(file, i, [g.at, Math.min(total - 1, g.at + g.dur - 1)], true);
}
const wavFrames = (file) => {
  const buf = fs.readFileSync(file);
  const byteRate = buf.readUInt32LE(28);
  let o = 12;
  while (o < buf.length - 8) {
    const idc = buf.toString("ascii", o, o + 4);
    const size = buf.readUInt32LE(o + 4);
    if (idc === "data") return Math.ceil((size / byteRate) * fps);
    o += 8 + size;
  }
  return fps;
};
const sFiles = sfx.map((c, i) => {
  const src = path.join(root, "public", "sfx", "saya", `${c.sfx}.wav`);
  const file = `media/sfx-${pad(i)}-${c.sfx}.wav`;
  fs.copyFileSync(src, path.join(out, file));
  return {file, at: Math.max(0, c.at - 2), dur: Math.min(wavFrames(src), c.frames ?? 150), level: c.volume ?? SAYA_SFX_VOLUME[c.sfx], name: c.sfx};
});
if (flags.includes("--final") && !xmlOnly) {
  console.log("render final.mp4");
  await renderMedia({serveUrl, composition: comp, browserExecutable, inputProps: {...props, layer: "all"}, outputLocation: path.join(out, "final.mp4"), codec: "h264", crf: 18});
}

// ---- captions.srt (the chunks as shown)
const chunks = srtToChunks(props.srt, fps, 3, 18);
const tc = (f) => {
  const ms = Math.round((f / fps) * 1000);
  const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)},${String(ms % 1000).padStart(3, "0")}`;
};
fs.writeFileSync(
  path.join(out, "captions.srt"),
  chunks.map((c, i) => `${i + 1}\n${tc(c.start)} --> ${tc(chunks[i + 1] ? Math.min(chunks[i + 1].start, c.end + 12) : c.end + 12)}\n${c.words.map((w) => w.text).join(" ")}\n`).join("\n"),
);

// ---- tracks: pack clips that do not overlap onto the same track
const pack = (items) => {
  const tracks = [];
  for (const it of [...items].sort((a, b) => a.at - b.at)) {
    let t = tracks.find((tr) => tr[tr.length - 1].at + tr[tr.length - 1].dur <= it.at);
    if (!t) tracks.push((t = []));
    t.push(it);
  }
  return tracks;
};
const vItems = graphics.map((g, i) => ({file: gFiles[i], at: g.at, dur: Math.min(g.dur, total - g.at), name: `${pad(i)} ${g.type}${g.text ? ` · ${g.text}` : ""}`}));

// ---- FCP7 XML
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const rate = `<rate><timebase>${fps}</timebase><ntsc>FALSE</ntsc></rate>`;
let nid = 0;
const fileXml = (f, dur, kind) => {
  const vid = kind !== "audio" ? `<video><samplecharacteristics>${rate}<width>1080</width><height>1920</height><pixelaspectratio>square</pixelaspectratio></samplecharacteristics></video>` : "";
  const aud = kind !== "video" ? `<audio><samplecharacteristics><depth>16</depth><samplerate>48000</samplerate></samplecharacteristics><channelcount>2</channelcount></audio>` : "";
  return `<file id="file-${esc(f)}"><name>${esc(path.basename(f))}</name><pathurl>${esc(userRoot ? `file://localhost${encodeURI(path.posix.join(userRoot.replace(/\\/g, "/").replace(/^([A-Za-z]):/, "/$1:"), f))}` : f)}</pathurl>${rate}<duration>${dur}</duration><media>${vid}${aud}</media></file>`;
};
const level = (v) =>
  `<filter><effect><name>Audio Levels</name><effectid>audiolevels</effectid><effectcategory>audiolevels</effectcategory><effecttype>audiolevels</effecttype><mediatype>audio</mediatype><parameter><parameterid>level</parameterid><name>Level</name><valuemin>0</valuemin><valuemax>3.98109</valuemax><value>${v}</value></parameter></effect></filter>`;
const clip = (it, kind, extra = "") =>
  `<clipitem id="clip-${++nid}"><name>${esc(it.name)}</name><enabled>TRUE</enabled><duration>${it.dur}</duration>${rate}<start>${it.at}</start><end>${it.at + it.dur}</end><in>0</in><out>${it.dur}</out>${fileXml(it.file, it.dur, kind)}${kind === "audio" ? "<sourcetrack><mediatype>audio</mediatype><trackindex>1</trackindex></sourcetrack>" : ""}${extra}</clipitem>`;

const base = {file: "media/base.mp4", at: 0, dur: total, name: "base (footage + voice)"};
const caps = {file: "media/captions.mov", at: 0, dur: total, name: "captions"};
const videoTracks = [[base], [caps], ...pack(vItems)].map((t) => `<track>${t.map((it) => clip(it, it === base ? "av" : "video")).join("")}</track>`);
const audioTracks = [[base], ...pack(sFiles)].map((t) => `<track>${t.map((it) => clip(it, "audio", it === base ? "" : level(it.level))).join("")}</track>`);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE xmeml>
<xmeml version="4"><sequence id="seq-1"><name>${esc(id)}</name><duration>${total}</duration>${rate}<media><video><format><samplecharacteristics>${rate}<width>1080</width><height>1920</height><pixelaspectratio>square</pixelaspectratio><fielddominance>none</fielddominance></samplecharacteristics></format>${videoTracks.join("")}</video><audio>${audioTracks.join("")}</audio></media></sequence></xmeml>
`;
fs.writeFileSync(path.join(out, "timeline.xml"), xml);

// ---- timeline.md
const sec = (f) => (f / fps).toFixed(2);
const rows = [
  ...vItems.map((v) => `| ${sec(v.at)} – ${sec(v.at + v.dur)} | graphic | ${v.name} | ${v.file} |`),
  ...sFiles.map((s) => `| ${sec(s.at)} | sound | ${s.name} (level ${s.level}) | ${s.file} |`),
].sort((a, b) => parseFloat(a.slice(2)) - parseFloat(b.slice(2)));
fs.writeFileSync(
  path.join(out, "timeline.md"),
  `# ${id} — timeline\n\nV1 base.mp4 (footage + voice) · V2 captions.mov · V3+ graphics · A1 voice · A2+ sounds\n\n| time (s) | kind | what | file |\n|---|---|---|---|\n${rows.join("\n")}\n`,
);
console.log(`done → ${out}`);
