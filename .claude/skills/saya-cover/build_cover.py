#!/usr/bin/env python3
"""ستايل غلاف سايا الموحّد: نفس ستايل الكاروسيل (سماوي + دارة + كروت بيضا + Cairo) على 1080×1920.

Usage: python3 build_cover.py spec.json out.png
spec: {"line1": "...", "line2": "...", "sub": "...", "icon": "bolt", "chips": ["a","b","c"],
       "face": "path/to/photo.png" (optional, tilted white card), "face_pos": [x,y] (focal point 0-1)}
Safe zones: profile grid crops the centre 1080x1440 (y 240..1680); the reel cover view hides ~150px top
and ~350px bottom. Everything important sits in y 400..1570.
"""
import json, subprocess, sys, base64, pathlib, os

HERE = pathlib.Path(__file__).resolve().parent
ICONS = {  # 120x120 line icons, stroke drawn by CSS (navy, 8px, round)
 "bolt": '<path d="M68 8 L26 68 H56 L48 112 L94 48 H64 Z"/>',
 "chat": '<path d="M20 22 H100 A8 8 0 0 1 108 30 V76 A8 8 0 0 1 100 84 H60 L38 106 V84 H20 A8 8 0 0 1 12 76 V30 A8 8 0 0 1 20 22 Z"/><path d="M34 44 H86 M34 62 H70"/>',
 "home": '<path d="M12 56 L60 14 L108 56"/><path d="M26 48 V104 H94 V48"/><path d="M50 104 V74 H70 V104"/>',
 "key": '<circle cx="38" cy="48" r="24"/><path d="M56 64 L104 112 M84 92 L100 76 M94 102 L106 90"/>',
 "shield": '<path d="M60 10 L104 28 V60 C104 86 84 104 60 112 C36 104 16 86 16 60 V28 Z"/><path d="M40 60 L55 75 L82 46"/>',
 "phone": '<rect x="32" y="8" width="56" height="104" rx="12"/><path d="M52 98 H68"/>',
 "spark": '<path d="M60 10 L70 50 L110 60 L70 70 L60 110 L50 70 L10 60 L50 50 Z"/>',
 "news": '<rect x="14" y="20" width="92" height="80" rx="10"/><path d="M30 42 H90 M30 60 H90 M30 78 H66"/>',
}

def bg_svg():
    # carousel background (1080x1440) placed at y=240 + traces extended to the 1920 edges
    src = (HERE / "bg_1440.svgpart").read_text(encoding="utf-8")
    ext_top = "".join(f'<path d="M{x},240 V0"/>' for x in (300, 266, 249))
    ext_bot = "".join(f'<path d="M{x},1680 V1920"/>' for x in (74, 57, 763, 746))
    glow_top = '<path d="M283,240 V0"/>'
    glow_bot = "".join(f'<path d="M{x},1680 V1920"/>' for x in (40, 780))
    return f'''<svg class="bg" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
<rect width="1080" height="1920" fill="url(#bloom)"/>
<g transform="translate(0,240)">{src}</g>
<g fill="none" stroke-linecap="butt">
 <g stroke="#12356E" stroke-width="5" opacity=".38">{ext_top}{ext_bot}</g>
 <g stroke="#1E90FF" stroke-width="12" opacity=".55" filter="url(#g)">{glow_top}{glow_bot}</g>
 <g stroke="#1E90FF" stroke-width="6" opacity=".9">{glow_top}{glow_bot}</g>
 <g stroke="#fff" stroke-width="1.8" opacity=".95">{glow_top}{glow_bot}</g>
</g></svg>'''

def build(spec):
    b64 = lambda p: base64.b64encode(open(HERE / "fonts" / p, "rb").read()).decode()
    icon = ICONS[spec.get("icon", "spark")]
    chips = spec.get("chips", [])
    rot = [-8, 5, -4]
    pos = [("left:70px;top:470px", ), ("right:80px;top:430px",), ("left:90px;top:1340px",)]
    chip_html = ""
    for i, c in enumerate(chips[:3]):
        chip_html += f'<div class="chip" style="{pos[i][0]};transform:rotate({rot[i]}deg)">{c}</div>'
    face = ""
    if spec.get("face"):
        fb = base64.b64encode(open(spec["face"], "rb").read()).decode()
        fx, fy = spec.get("face_pos", [0.5, 0.45])
        face = f'<div class="face" style="background-image:url(data:image/png;base64,{fb});background-position:{fx*100}% {fy*100}%"></div>'
    sub = f'<p>{spec["sub"]}</p>' if spec.get("sub") else ""
    return f'''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>
:root{{--ink:#0B1B3F;--line:#12356E;--neon:#1E90FF}}
@font-face{{font-family:SayaAr;src:url(data:font/woff2;base64,{b64("cairo-arabic-900-normal.woff2")});font-weight:900}}
@font-face{{font-family:SayaAr;src:url(data:font/woff2;base64,{b64("cairo-arabic-700-normal.woff2")});font-weight:700}}
@font-face{{font-family:SayaLat;src:url(data:font/woff2;base64,{b64("cairo-latin-900-normal.woff2")});font-weight:900}}
@font-face{{font-family:SayaLat;src:url(data:font/woff2;base64,{b64("cairo-latin-700-normal.woff2")});font-weight:700}}
*{{box-sizing:border-box;margin:0;padding:0}}
body{{width:1080px;height:1920px;overflow:hidden}}
.cover{{width:1080px;height:1920px;position:relative;direction:rtl;font-family:SayaLat,SayaAr,sans-serif;color:var(--ink);
 background:linear-gradient(165deg,#EAF6FF 0%,#CFEBFF 52%,#A9D9FF 100%)}}
.bg{{position:absolute;inset:0;width:100%;height:100%}}
.mid{{position:absolute;left:0;right:0;top:{spec.get("top", 640)}px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:22px;z-index:2}}
.ic{{width:200px;height:200px;background:#fff;border-radius:48px;box-shadow:0 18px 50px rgba(11,27,63,.13);display:flex;align-items:center;justify-content:center;margin-bottom:10px}}
.ic svg{{width:120px;height:120px;fill:none;stroke:var(--ink);stroke-width:8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 14px rgba(30,144,255,.55))}}
h1{{font-size:{spec.get("h1", 150)}px;line-height:1.12;font-weight:900;font-family:SayaLat,SayaAr}}
h1.hot{{color:var(--neon)}}
p{{font-size:52px;line-height:1.45;font-weight:700;opacity:.9;max-width:860px}}
.chip{{position:absolute;direction:ltr;font-family:SayaLat;font-weight:900;font-size:60px;background:#fff;color:var(--line);padding:6px 38px 14px;border-radius:30px;box-shadow:0 14px 36px rgba(11,27,63,.14);z-index:2}}
.face{{position:absolute;left:310px;top:{spec.get("face_top", 1050)}px;width:460px;height:520px;border-radius:44px;background-size:cover;border:8px solid #fff;box-shadow:0 18px 50px rgba(11,27,63,.2),0 0 36px rgba(30,144,255,.45);transform:rotate(4deg);z-index:3}}
.foot{{position:absolute;bottom:{spec.get("foot", 330)}px;left:0;right:0;text-align:center;direction:ltr;font-size:46px;font-weight:900;color:var(--ink);z-index:2}}
</style></head><body><div class="cover">{bg_svg()}
<div class="mid"><div class="ic"><svg viewBox="0 0 120 120">{icon}</svg></div>
<h1>{spec["line1"]}</h1><h1 class="hot">{spec["line2"]}</h1>{sub}</div>
{chip_html}{face}<div class="foot">@saya_.tech</div></div></body></html>'''

if __name__ == "__main__":
    spec = json.load(open(sys.argv[1], encoding="utf-8"))
    out = pathlib.Path(sys.argv[2]).resolve()
    html = out.with_suffix(".html")
    html.write_text(build(spec), encoding="utf-8")
    shot = HERE / "shot.js"
    env = dict(os.environ, NODE_PATH="/opt/node-tools/node_modules")
    subprocess.check_call(["node", str(shot), str(html), str(out)], env=env)
    print(out)
