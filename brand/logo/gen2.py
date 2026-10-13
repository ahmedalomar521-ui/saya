NEON='#1E90FF';SKY='#8FD3FF';NAVY='#0B1B3F'
def defs(i):
    return (f'<defs><filter id="g{i}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>'
            f'<linearGradient id="l{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5BB8FF"/><stop offset="1" stop-color="#1E6BFF"/></linearGradient>'
            f'<linearGradient id="n{i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14306B"/><stop offset="1" stop-color="#0B1B3F"/></linearGradient></defs>')
def star(cx,cy,r,fill,extra=''):
    k=r*0.16
    d=f'M{cx} {cy-r} Q{cx+k} {cy-k} {cx+r} {cy} Q{cx+k} {cy+k} {cx} {cy+r} Q{cx-k} {cy+k} {cx-r} {cy} Q{cx-k} {cy-k} {cx} {cy-r}Z'
    return f'<path d="{d}" fill="{fill}" {extra}/>'
# 1 bubble: friendly speech bubble with sparkle + soft glow
def M1(i,dm):
    bub='M50 14 C74 14 90 30 90 50 C90 70 74 84 52 84 L36 84 Q30 84 26 88 L20 94 Q17 97 17 92 L17 74 C12 66 10 58 10 50 C10 30 26 14 50 14Z'
    bub='M50 12 C75 12 92 28 92 49 C92 70 75 84 52 84 H44 L26 95 Q21 98 21 92 V78 C12 70 8 60 8 49 C8 28 25 12 50 12Z'
    fill='#fff' if not dm else f'url(#n{i})'
    st=NEON if not dm else SKY
    return (defs(i)+f'<path d="{bub}" fill="{NEON}" opacity=".45" filter="url(#g{i})"/>'
      f'<path d="{bub}" fill="{fill}" stroke="{st}" stroke-width="4" stroke-linejoin="round"/>'
      +star(50,48,24,f'url(#l{i})')+star(77,26,8,SKY if dm else NEON)+star(26,66,5,SKY if dm else NEON))
# 2 arabic seen
def M2(i,dm):
    d='M88 38 V52 Q88 64 76 64 H70 V40 M70 64 H56 V40 M56 64 H42 V40 M42 64 H34 Q16 64 16 78 Q16 88 28 88 H74'
    d='M84 34 V54 M64 34 V54 M44 34 V54 M84 54 Q84 66 72 66 H34 Q16 66 16 80 Q16 90 30 90 H78'
    col='#fff' if dm else NAVY
    return (defs(i)+f'<path d="{d}" fill="none" stroke="{NEON}" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" opacity=".5" filter="url(#g{i})"/>'
      f'<path d="{d}" fill="none" stroke="url(#l{i})" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>'
      +star(80,16,11,SKY if dm else NEON))
# 3 spark in squircle
def M3(i,dm):
    return (defs(i)+f'<rect x="8" y="8" width="84" height="84" rx="30" fill="url(#l{i})"/>'
      f'<rect x="8" y="8" width="84" height="84" rx="30" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"/>'
      +f'<circle cx="50" cy="50" r="26" fill="#fff" opacity=".18" filter="url(#g{i})"/>'
      +star(48,52,30,'#fff')+star(76,26,10,'#fff')+star(75,74,5,'#fff','opacity=".85"'))
M={'1':M1,'2':M2,'3':M3}
lab={'1':'١ فقاعة','2':'٢ حرف س','3':'٣ شرارة'}
h='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'SayaAr';src:url('fonts/cairo-arabic-900-normal.woff2');font-weight:900}
@font-face{font-family:'SayaLat';src:url('fonts/cairo-latin-900-normal.woff2');font-weight:900}
*{box-sizing:border-box;margin:0;padding:0}body{width:1200px;font-family:'SayaLat','SayaAr';font-weight:900}
.row{display:flex}.lk{width:600px;height:620px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;position:relative}
.light{background:linear-gradient(165deg,#EAF6FF,#CFEBFF 55%,#A9D9FF)}.night{background:#0B1B3F}
.wm{text-align:center;line-height:1}.wm b{display:block;font-size:80px;letter-spacing:8px;color:#0B1B3F;padding-left:8px}.wm span{display:block;font-size:44px;color:#1E90FF;margin-top:6px}
.night .wm b{color:#fff}.night .wm span{color:#8FD3FF}
.lab{position:absolute;top:24px;right:30px;font-size:34px;color:#12356E;direction:rtl}.night .lab{color:#8FD3FF}
</style></head><body>'''
i=0
for k in '123':
    h+='<div class="row">'
    for bg,dm in(('light',False),('night',True)):
        h+=f'<div class="lk {bg}"><div class="lab">{lab[k]}</div><svg viewBox="0 0 100 100" width="250" height="250">{M[k](i,dm)}</svg><div class="wm"><b>SAYA</b><span>سايا</span></div></div>';i+=1
    h+='</div>'
open('directions2.html','w').write(h+'</body></html>')
