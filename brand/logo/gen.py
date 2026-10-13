import math
S=[(78,20),(38,20),(22,36),(22,38),(34,50),(66,50),(78,62),(78,64),(62,80),(22,80)]
def off(pts,d):
    out=[]
    n=len(pts)
    for i,p in enumerate(pts):
        if i==0 or i==n-1:
            a,b=(pts[0],pts[1]) if i==0 else (pts[-2],pts[-1])
            dx,dy=b[0]-a[0],b[1]-a[1];L=math.hypot(dx,dy);nx,ny=-dy/L,dx/L
            out.append((p[0]+nx*d,p[1]+ny*d));continue
        a,b,c=pts[i-1],p,pts[i+1]
        d1=(b[0]-a[0],b[1]-a[1]);d2=(c[0]-b[0],c[1]-b[1])
        l1=math.hypot(*d1);l2=math.hypot(*d2)
        n1=(-d1[1]/l1,d1[0]/l1);n2=(-d2[1]/l2,d2[0]/l2)
        m=(n1[0]+n2[0],n1[1]+n2[1]);ml=m[0]**2+m[1]**2
        k=2/ml
        out.append((b[0]+m[0]*k*d,b[1]+m[1]*k*d))
    return out
def pl(pts):return ' '.join(f'{x:.1f},{y:.1f}' for x,y in pts)
def node(p,r,col,w):return f'<circle cx="{p[0]}" cy="{p[1]}" r="{r}" fill="none" stroke="{col}" stroke-width="{w}"/>'
NEON='#1E90FF';NAVY='#0B1B3F';LINE='#12356E'
def glowdefs(i):
    return f'<filter id="g{i}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>'
def lit(pts,w,i):
    s=pl(pts)
    return (f'<polyline points="{s}" fill="none" stroke="{NEON}" stroke-width="{w*2.2}" stroke-linecap="round" stroke-linejoin="round" opacity=".55" filter="url(#g{i})"/>'
            f'<polyline points="{s}" fill="none" stroke="{NEON}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
            f'<polyline points="{s}" fill="none" stroke="#fff" stroke-width="{w*.35}" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>')
def dark(pts,w,col,op=1):
    return f'<polyline points="{pl(pts)}" fill="none" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round" opacity="{op}"/>'
# A: bus S (3 traces, centre lit) on white tile
def A(i,darkmode):
    c=LINE if not darkmode else '#8FD3FF'
    t=''.join(dark(off(S,d),2.4,c,.55) for d in(-6,6))+lit(S,3.6,i)
    t+=node((78,20),0,c,0)+node(off(S,-6)[0],2.6,c,1.6)+node(off(S,6)[0],2.6,c,1.6)+node(S[0],3.4,NEON,2)
    t+=node(off(S,-6)[-1],2.6,c,1.6)+node(off(S,6)[-1],2.6,c,1.6)+node(S[-1],3.4,NEON,2)
    return f'<defs>{glowdefs(i)}</defs>'+t
# B: chip S : rounded square with pins, S inside
def B(i,darkmode):
    c=LINE if not darkmode else '#8FD3FF'
    pins=''
    for k in (30,43,57,70):
        for (x1,y1,x2,y2) in((k,6,k,14),(k,86,k,94),(6,k,14,k),(86,k,94,k)):
            pins+=f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{c}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>'
    chip=f'<rect x="14" y="14" width="72" height="72" rx="14" fill="{"#fff" if not darkmode else "#10285A"}" stroke="{c}" stroke-width="3"/>'
    S2=[(x*.6+20,y*.6+20) for x,y in S]
    return f'<defs>{glowdefs(i)}</defs>'+pins+chip+dark(S2,2.4,c,.55)+lit(off(S2,0),3.4,i)+node(S2[0],2.6,NEON,1.8)+node(S2[-1],2.6,NEON,1.8)
# C: single bold trace S inside rounded tile navy with nodes branching
def C(i,darkmode):
    c='#8FD3FF'
    tile=f'<rect x="8" y="8" width="84" height="84" rx="22" fill="{NAVY}"/>'
    br=''
    for p,q in(((38,20),(38,10)),((22,38),(10,38)),((66,50),(66,40)),((62,80),(62,90))):
        br+=f'<polyline points="{p[0]},{p[1]} {q[0]},{q[1]}" stroke="{c}" stroke-width="2" opacity=".5" stroke-linecap="round" fill="none"/>'+node(q,2.2,c,1.4)
    return f'<defs>{glowdefs(i)}</defs>'+tile+br+lit(S,5.5,i)+node(S[0],4,'#fff',2)+node(S[-1],4,'#fff',2)
marks={'A':A,'B':B,'C':C}
names={'A':'حزمة','B':'شريحة','C':'مسار'}
def card(k,bgcls,dm,idx):
    return f'<div class="lk {bgcls}"><svg viewBox="0 0 100 100" width="260" height="260">{marks[k](idx,dm)}</svg><div class="wm"><b>SAYA</b><span>سايا</span></div></div>'
html='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'SayaAr';src:url('fonts/cairo-arabic-900-normal.woff2');font-weight:900}
@font-face{font-family:'SayaLat';src:url('fonts/cairo-latin-900-normal.woff2');font-weight:900}
*{box-sizing:border-box;margin:0;padding:0}body{width:1800px;background:#fff;font-family:'SayaLat','SayaAr';font-weight:900}
.row{display:flex}.lk{width:600px;height:620px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;position:relative}
.light{background:linear-gradient(165deg,#EAF6FF,#CFEBFF 55%,#A9D9FF)}.night{background:#0B1B3F}
.wm{text-align:center;line-height:1}.wm b{display:block;font-size:84px;letter-spacing:10px;color:#0B1B3F;padding-left:10px}.wm span{display:block;font-size:40px;color:#1E90FF;margin-top:6px}
.night .wm b{color:#fff}.night .wm span{color:#8FD3FF}
.lab{position:absolute;top:24px;right:30px;font-size:34px;color:#12356E;direction:rtl}.night .lab{color:#8FD3FF}
</style></head><body>'''
i=0
for k in 'ABC':
    html+='<div class="row">'
    for bg,dm in(('light',False),('night',True)):
        html+=card(k,bg,dm,i).replace('<div class="wm">',f'<div class="lab">{ {"A":"١ حزمة","B":"٢ شريحة","C":"٣ مسار"}[k]}</div><div class="wm">',1);i+=1
    html+='</div>'
# third col: icon only avatar? skip
html+='</body></html>'
html=html.replace('width:1800px','width:1200px')
open('directions.html','w').write(html)
