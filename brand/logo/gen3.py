NEON='#1E90FF';SKY='#8FD3FF';NAVY='#0B1B3F';CREAM='#F3E3D3'
BOLT='M56 8 L22 54 H44 L38 92 L78 42 H55 Z'
def defs(i):
    return (f'<defs><filter id="g{i}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3.5"/></filter>'
      f'<linearGradient id="l{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6CC0FF"/><stop offset="1" stop-color="#1E6BFF"/></linearGradient></defs>')
def bolt(fill,stroke=None,sw=0,extra=''):
    s=f' stroke="{stroke}" stroke-width="{sw}" stroke-linejoin="round"' if stroke else ''
    return f'<path d="{BOLT}" fill="{fill}"{s} {extra}/>'
# 1 rounded bolt in squircle, cream bolt
def L1(i,dm):
    return (defs(i)+f'<rect x="6" y="6" width="88" height="88" rx="32" fill="url(#l{i})"/>'
      +f'<g transform="translate(5 3) scale(.92)">'+bolt('#fff','#fff',7)+'</g>')
# 2 bolt + round glasses
def L2(i,dm):
    col=CREAM if dm else NAVY
    return (defs(i)+f'<g transform="translate(25 -6) scale(.5)"><path d="{BOLT}" fill="{NEON}" opacity=".55" filter="url(#g{i})"/>'+bolt(f'url(#l{i})',f'url(#l{i})',7)+'</g>'
      +f'<circle cx="30" cy="68" r="19" fill="none" stroke="{col}" stroke-width="4.5"/><circle cx="70" cy="68" r="19" fill="none" stroke="{col}" stroke-width="4.5"/>'
      f'<path d="M49 66 Q50 61 51 66" fill="none" stroke="{col}" stroke-width="4.5" stroke-linecap="round"/>'
      f'<path d="M11 64 L4 58 M89 64 L96 58" stroke="{col}" stroke-width="4.5" stroke-linecap="round"/>')
# 3 bolt inside round glasses lens (one lens), cream+blue
def L3(i,dm):
    col=CREAM if dm else NAVY
    return (defs(i)+f'<circle cx="50" cy="50" r="40" fill="{"#10285A" if dm else "#fff"}" stroke="{col}" stroke-width="5"/>'
      f'<path d="M12 36 L4 28 M88 36 L96 28" stroke="{col}" stroke-width="5" stroke-linecap="round"/>'
      f'<g transform="translate(26 22) scale(.5)"><path d="{BOLT}" fill="{NEON}" opacity=".55" filter="url(#g{i})"/>'+bolt(f'url(#l{i})',f'url(#l{i})',8)+'</g>')
M={'1':L1,'2':L2,'3':L3}
lab={'1':'١ برق سايا','2':'٢ برق + نظارة','3':'٣ برق داخل عدسة'}
h='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'SayaAr';src:url('fonts/cairo-arabic-900-normal.woff2');font-weight:900}
@font-face{font-family:'SayaLat';src:url('fonts/cairo-latin-900-normal.woff2');font-weight:900}
*{box-sizing:border-box;margin:0;padding:0}body{width:1200px;font-family:'SayaLat','SayaAr';font-weight:900}
.row{display:flex}.lk{width:600px;height:620px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;position:relative}
.light{background:linear-gradient(165deg,#FFF6EE,#EAF6FF 45%,#BFE3FF)}.night{background:#0B1B3F}
.wm{text-align:center;line-height:1}.wm b{display:block;font-size:80px;letter-spacing:8px;color:#0B1B3F;padding-left:8px}.wm span{display:block;font-size:44px;color:#1E90FF;margin-top:6px}
.night .wm b{color:#F3E3D3}.night .wm span{color:#8FD3FF}
.lab{position:absolute;top:24px;right:30px;font-size:32px;color:#12356E;direction:rtl}.night .lab{color:#8FD3FF}
</style></head><body>'''
i=0
for k in '123':
    h+='<div class="row">'
    for bg,dm in(('light',False),('night',True)):
        h+=f'<div class="lk {bg}"><div class="lab">{lab[k]}</div><svg viewBox="0 0 100 100" width="250" height="250">{M[k](i,dm)}</svg><div class="wm"><b>SAYA</b><span>سايا</span></div></div>';i+=1
    h+='</div>'
open('directions3.html','w').write(h+'</body></html>')
