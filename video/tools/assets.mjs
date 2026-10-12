#!/usr/bin/env node
// Graphics importer for Saya edits: reads a script / SRT, finds what needs a
// graphic (apps and brands), and pulls icons from the libraries installed in
// this project, so an edit never waits on a manual download.
//
//   node tools/assets.mjs scan <file.srt|file.txt>   brands mentioned + where each logo comes from
//   node tools/assets.mjs search <words…> [--set lucide|emoji|logos|brands]
//   node tools/assets.mjs save <set:name> [--color "#ffffff"]   → public/assets/icons/<set>-<name>.svg
//
// Sets (all offline, from npm):
//   brands  simple-icons (3,400+ brand marks; used directly as `logo.icon` in SayaEdit)
//   logos   @iconify-json/logos (full-colour brand logos, CC0; e.g. OpenAI, which simple-icons lacks)
//   lucide  @iconify-json/lucide (line icons; saved white for neon stickers)
//   emoji   @iconify-json/fluent-emoji-flat (colourful flat emoji illustrations, MIT)
// Photos, screenshots and screen recordings are never invented: ask the user,
// or generate with tools/gemini_image.py after the user approves the cost.
import fs from "node:fs";
import path from "node:path";
import {createRequire} from "node:module";
import {fileURLToPath} from "node:url";

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public/assets/icons");

const SETS = {
  lucide: () => require("@iconify-json/lucide/icons.json"),
  emoji: () => require("@iconify-json/fluent-emoji-flat/icons.json"),
  logos: () => require("@iconify-json/logos/icons.json"),
};
const simpleIcons = () => Object.values(require("simple-icons")).filter((v) => v && v.slug);
const siExport = (slug) => "si" + slug.charAt(0).toUpperCase() + slug.slice(1).replace(/[^a-z0-9]/gi, "");

// Arabic (and common spoken) names → the brand name to look up.
const ALIASES = {
  "واتساب": "WhatsApp", "واتس": "WhatsApp", "الواتساب": "WhatsApp", "الواتس": "WhatsApp",
  "انستغرام": "Instagram", "انستجرام": "Instagram", "إنستغرام": "Instagram", "الانستغرام": "Instagram", "انستا": "Instagram",
  "يوتيوب": "YouTube", "اليوتيوب": "YouTube", "تيك توك": "TikTok", "تيكتوك": "TikTok", "فيسبوك": "Facebook", "فيس بوك": "Facebook",
  "تلغرام": "Telegram", "تيليجرام": "Telegram", "تليجرام": "Telegram", "سناب": "Snapchat", "سناب شات": "Snapchat",
  "تويتر": "X", "اكس": "X", "إكس": "X", "جوجل": "Google", "غوغل": "Google", "قوقل": "Google", "كروم": "Google Chrome",
  "جيميناي": "Google Gemini", "جيمناي": "Google Gemini", "جيمني": "Google Gemini", "كلود": "Claude",
  "شات جي بي تي": "OpenAI", "تشات جي بي تي": "OpenAI", "شات جبت": "OpenAI", "اوبن اي اي": "OpenAI",
  "ايفون": "Apple", "آيفون": "Apple", "ابل": "Apple", "آبل": "Apple", "أندرويد": "Android", "اندرويد": "Android",
  "سامسونج": "Samsung", "كانفا": "Canva", "نتفليكس": "Netflix", "سبوتيفاي": "Spotify", "ديسكورد": "Discord",
  "لينكدان": "LinkedIn", "لينكد ان": "LinkedIn", "ماسنجر": "Messenger", "جيميل": "Gmail", "ويندوز": "Windows",
  "بيربليكسيتي": "Perplexity", "بربلكسيتي": "Perplexity", "نوشن": "Notion", "زوم": "Zoom", "تيمز": "Microsoft Teams",
};

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

/** Best source for a brand: simple-icons first, then the full-colour logos set. */
const findBrand = (name) => {
  const n = norm(name);
  const si = simpleIcons().find((i) => norm(i.title) === n || i.slug === n);
  if (si) return {source: "brands", export: siExport(si.slug), title: si.title, hex: si.hex};
  const logos = SETS.logos();
  const ids = Object.keys(logos.icons);
  const id = ids.find((k) => norm(k) === n + "icon") ?? ids.find((k) => norm(k) === n) ?? ids.find((k) => norm(k).startsWith(n));
  if (id) return {source: "logos", id: `logos:${id}`};
  return null;
};

const toSvg = (setName, name, color) => {
  const set = SETS[setName]();
  let icon = set.icons[name];
  let w = set.width ?? 16;
  let h = set.height ?? 16;
  if (!icon && set.aliases?.[name]) icon = set.icons[set.aliases[name].parent];
  if (!icon) return null;
  w = icon.width ?? w;
  h = icon.height ?? h;
  let body = icon.body;
  if (color) body = body.replaceAll("currentColor", color);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.left ?? 0} ${icon.top ?? 0} ${w} ${h}" width="${w * 8}" height="${h * 8}">${body}</svg>\n`;
};

const save = (ref, color) => {
  const [setName, name] = ref.split(":");
  if (!SETS[setName]) throw new Error(`unknown set "${setName}" (lucide | emoji | logos)`);
  const svg = toSvg(setName, name, color ?? (setName === "lucide" ? "#ffffff" : undefined));
  if (!svg) throw new Error(`no icon "${name}" in ${setName}`);
  fs.mkdirSync(OUT, {recursive: true});
  const file = path.join(OUT, `${setName}-${name}.svg`);
  fs.writeFileSync(file, svg);
  return path.relative(path.join(ROOT, "public"), file);
};

const parseCues = (text) => {
  const cues = [];
  const re = /(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)\s*\n([\s\S]*?)(?=\n\s*\n|\n?$)/g;
  const t = (h, m, s, ms) => +h * 3600 + +m * 60 + +s + +ms / 1000;
  let m;
  while ((m = re.exec(text))) cues.push({start: t(m[1], m[2], m[3], m[4]), end: t(m[5], m[6], m[7], m[8]), text: m[9].trim()});
  if (!cues.length) text.split(/\n+/).forEach((l, i) => l.trim() && cues.push({start: null, end: null, text: l.trim(), line: i + 1}));
  return cues;
};

const scan = (file) => {
  const cues = parseCues(fs.readFileSync(file, "utf8"));
  const brands = simpleIcons();
  const found = [];
  const seen = new Set();
  for (const c of cues) {
    const hits = [];
    for (const [ar, en] of Object.entries(ALIASES)) if (c.text.includes(ar)) hits.push({word: ar, name: en});
    for (const w of c.text.match(/[A-Za-z][A-Za-z0-9+.]{1,}/g) ?? []) {
      const si = brands.find((b) => norm(b.title) === norm(w) || b.slug === norm(w));
      hits.push({word: w, name: si ? si.title : w, guess: !si});
    }
    for (const h of hits) {
      const key = `${h.name}@${c.start}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const src = findBrand(h.name);
      let file;
      if (src?.source === "logos") file = save(src.id.replace("logos:", "logos:"));
      found.push({word: h.word, brand: h.name, at: c.start, frame30: c.start == null ? null : Math.round(c.start * 30), line: c.line, ...(src ?? {source: h.guess ? "unknown-word" : "missing"}), ...(file ? {file} : {})});
    }
  }
  return found;
};

const search = (words, only) => {
  const q = words.map(norm).filter(Boolean);
  const res = [];
  const match = (s) => q.every((w) => norm(s).includes(w));
  if (!only || only === "brands") for (const i of simpleIcons()) if (match(i.title) || match(i.slug)) res.push(`brands:${siExport(i.slug)}  (${i.title}, #${i.hex})`);
  for (const s of ["logos", "lucide", "emoji"]) {
    if (only && only !== s) continue;
    const set = SETS[s]();
    for (const k of [...Object.keys(set.icons), ...Object.keys(set.aliases ?? {})]) if (match(k)) res.push(`${s}:${k}`);
  }
  return res.slice(0, 40);
};

const [cmd, ...rest] = process.argv.slice(2);
const flag = (n) => {
  const i = rest.indexOf(n);
  if (i < 0) return undefined;
  const v = rest[i + 1];
  rest.splice(i, 2);
  return v;
};
try {
  if (cmd === "scan") console.log(JSON.stringify(scan(rest[0]), null, 2));
  else if (cmd === "search") {
    const only = flag("--set");
    console.log(search(rest, only).join("\n") || "(no match)");
  } else if (cmd === "save") {
    const color = flag("--color");
    console.log(save(rest[0], color));
  } else {
    console.log("usage: assets.mjs scan <file> | search <words…> [--set s] | save <set:name> [--color c]");
    process.exit(1);
  }
} catch (e) {
  console.error(String(e.message ?? e));
  process.exit(1);
}
