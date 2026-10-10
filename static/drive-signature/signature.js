/* Standalone Drive-inspired nameplate. No network or external dependencies. */
class DriveSignature extends HTMLElement {
  static get observedAttributes() { return ['name','level','insignia','period','variant','font','speed','intensity','paused']; }
  constructor() {
    super();
    this.attachShadow({mode:'open'}).innerHTML = `<style>:host{display:block;width:100%;aspect-ratio:960/260}canvas{display:block;height:100%;max-width:100%;margin-inline:auto}</style><canvas role="img"></canvas>`;
    this.canvas=this.shadowRoot.querySelector('canvas'); this.ctx=this.canvas.getContext('2d');
    this.artCanvas=document.createElement('canvas');this.artCtx=this.artCanvas.getContext('2d');
    this.fontRefresh=()=>this.resize();
    this.time=0; this.last=0; this.frame=0;
    this.reduced=matchMedia('(prefers-reduced-motion: reduce)');
    this.tick=this.tick.bind(this);
  }
  connectedCallback() {
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this);
    document.fonts.addEventListener('loadingdone',this.fontRefresh);
    this.resize(); this.last=0; this.frame=requestAnimationFrame(this.tick);
  }
  disconnectedCallback(){cancelAnimationFrame(this.frame);this.resizeObserver?.disconnect();document.fonts.removeEventListener('loadingdone',this.fontRefresh);}
  attributeChangedCallback(){this.updateLabel();if(this.ctx)this.draw();}
  progress(){
    if(this.hasAttribute('period')){const n=Math.floor(this.number('period',1,1,60));return {level:['I','II','III','IV','V','VI'][(n-1)%6],gold:Math.floor((n-1)/6)};}
    return {level:['I','II','III','IV','V','VI'].includes(this.getAttribute('level'))?this.getAttribute('level'):'I',gold:Math.floor(this.number('insignia',0,0,9))};
  }
  updateLabel(){const p=this.progress();this.canvas?.setAttribute('aria-label',`${this.getAttribute('name')||'血律'}，${this.getAttribute('variant')||'purple'} 竞逐特签 ${p.level}，${p.gold} 枚金色标记`);}
  resize(){this.draw();this.updateLabel();}
  // Keep the artwork at a consistent physical height. Only its middle section changes width.
  draw(){
    const surface=this.canvas,output=this.ctx;
    if(!surface||!output)return;
    const scale=Math.max(1,this.clientWidth)/960,dpr=Math.min(devicePixelRatio||1,3);
    const raster=scale*dpr;
    const aw=Math.max(1,Math.round(960*raster)),ah=Math.max(1,Math.round(260*raster));
    if(this.artCanvas.width!==aw||this.artCanvas.height!==ah){this.artCanvas.width=aw;this.artCanvas.height=ah;}
    const variant=this.getAttribute('variant')||'purple';
    const name=Array.from(this.getAttribute('name')||'血律').slice(0,32).join('');
    this.contentLayout(variant);
    const x=(variant==='purple'?248:variant==='blue'?225:260)*this.contentScale+this.contentShift;
    output.font=this.nameFont(84);
    const measured=output.measureText(name).width;
    // Preserve the left assembly (0–400) and complete right cap (770–960).
    const width=Math.min(960,Math.max(780,Math.ceil(x+measured+235)));
    this.canvas=this.artCanvas;this.ctx=this.artCtx;
    try{this.drawArtwork(width);}finally{this.canvas=surface;this.ctx=output;}
    const pixels=Math.max(1,Math.round(width*raster));
    if(surface.width!==pixels||surface.height!==ah){surface.width=pixels;surface.height=ah;}
    surface.style.width=`${width/960*100}%`;
    output.setTransform(1,0,0,1,0,0);output.clearRect(0,0,pixels,ah);
    const cut1=Math.round(400*aw/960),cut2=Math.round(770*aw/960);
    const rightWidth=aw-cut2,midWidth=Math.max(0,pixels-cut1-rightWidth);
    if(variant==='purple'){
      output.drawImage(this.artCanvas,0,0,pixels,ah,0,0,pixels,ah);
    }else{
    output.drawImage(this.artCanvas,0,0,cut1,ah,0,0,cut1,ah);
    // Fit the full middle gradient between the fixed ornaments without color jumps.
    if(midWidth)output.drawImage(this.artCanvas,cut1,0,cut2-cut1,ah,cut1,0,midWidth,ah);
    output.drawImage(this.artCanvas,cut2,0,rightWidth,ah,pixels-rightWidth,0,rightWidth,ah);
    }
    output.setTransform(raster,0,0,raster,0,0);
    const available=width-135-x,size=Math.min(84,84*available/Math.max(1,measured));
    output.font=this.nameFont(size);output.fillStyle='#fff7ff';output.textBaseline='middle';
    output.shadowColor=variant==='purple'?'#3c075e':'#0b1237';output.shadowOffsetY=2;output.shadowBlur=2;
    output.fillText(name,x,127);output.shadowOffsetY=0;output.shadowBlur=0;
    this.layout={width,fontSize:size,textWidth:measured*size/84,available};
  }
  number(key,def,min,max){const v=Number(this.getAttribute(key)??def);return Number.isFinite(v)?Math.min(max,Math.max(min,v)):def;}
  tick(now){if(this.last && !this.hasAttribute('paused')&&!this.reduced.matches&&this.getClientRects().length){this.time+=Math.min((now-this.last)/1000,.05)*this.number('speed',1,0,3);this.draw();}this.last=now;this.frame=requestAnimationFrame(this.tick);}
  contentLayout(variant){
    const left={purple:71,blue:82,red:69,wing:18,orb:47,diamond:52}[variant]??71;
    const columns=Math.ceil(this.progress().gold/2);
    const required=42+Math.max(0,columns-1)*18;
    this.contentShift=columns?Math.max(0,(required-left)/(1-left/960)):0;
    this.contentScale=(960-this.contentShift)/960;
    this.insigniaX=left*this.contentScale+this.contentShift-17;
  }
  drawArtwork(width=960){
    const c=this.ctx;if(!c||!this.canvas.width)return;
    c.setTransform(this.canvas.width/960,0,0,this.canvas.height/260,0,0);c.clearRect(0,0,960,260);
    const t=this.time, glow=this.number('intensity',1,0,2);
    const poly=(points,fill,stroke,line=1)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=line;c.stroke();}};
    const grad=(x,y,x2,y2,stops)=>{let g=c.createLinearGradient(x,y,x2,y2);stops.forEach(([p,v])=>g.addColorStop(p,v));return g;};
    const circle=(x,y,r,fill,stroke,line=1)=>{c.beginPath();c.arc(x,y,r,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.lineWidth=line;c.stroke();}};
    const variant=this.getAttribute('variant')||'purple';
    this.contentLayout(variant);
    const {contentShift,contentScale}=this;
    c.translate(contentShift,0);c.scale(contentScale,1);
    if(['blue','red','wing','orb','diamond'].includes(variant)){
      this.drawVariant(c,t,glow,variant,{poly,grad,circle});return;
    }
    // Rebuild the purple body and its lighting at the final length; no bitmap seam.
    const end=870-(960-width)/contentScale;
    const body=[[189,48],[end-30,48],[end-30,56],[end-15,56],[end-15,68],[end,80],[end,176],[end-16,191],[end-27,191],[end-27,199],[190,199]];
    c.save();c.shadowColor=`rgba(188,20,255,${.35*glow})`;c.shadowBlur=22*glow;poly(body,grad(190,0,end,0,[[0,'#ed32fa'],[.35,'#b916ed'],[.75,'#8106ce'],[1,'#6508aa']]));c.restore();
    c.save();poly(body);c.clip();
    c.fillStyle=grad(0,48,0,200,[[0,'#ffffff24'],[.15,'#ff43ff05'],[.75,'#17003a08'],[1,'#23004277']]);c.fillRect(180,48,700,160);
    let haze=c.createRadialGradient(280+70*Math.sin(t*.6),120,0,280,120,390);haze.addColorStop(0,'#ff6dff50');haze.addColorStop(1,'#b900ff00');c.fillStyle=haze;c.fillRect(180,48,700,160);
    // A triangular mesh with travelling illumination rather than moving the whole plate.
    const dx=76,dy=44,shift=(t*12)%dx;
    c.lineWidth=1.25;
    for(let col=-1;col<11;col++)for(let row=-1;row<5;row++){
      let x=208+col*dx+shift,y=52+row*dy;
      let a=(.07+.18*(.5+.5*Math.sin(col*1.2+row*.8-t*1.3)))*glow;
      c.strokeStyle=`rgba(255,174,255,${a})`;c.beginPath();c.moveTo(x,y);c.lineTo(x,y+dy*2);c.moveTo(x,y);c.lineTo(x+dx,y+dy);c.lineTo(x,y+dy*2);c.stroke();
    }
    const sweep=220+(t*.19%1)*780;
    c.fillStyle=grad(sweep-100,0,sweep+100,0,[[0,'#fff0'],[.5,`rgba(255,199,255,${.13*glow})`],[1,'#fff0']]);c.fillRect(190,48,680,151);
    for(let i=0;i<5;i++){
      let x=280+i*119+Math.sin(i*3)*23,y=70+((i*57)%110),a=Math.pow(Math.max(0,Math.sin(t*1.55+i*2.1)),9)*glow;
      c.save();c.globalAlpha=Math.min(1,a);c.translate(x,y);c.shadowColor='#ffc2ff';c.shadowBlur=10;
      poly([[0,-17],[1.6,-2],[19,0],[1.6,2],[0,17],[-1.6,2],[-19,0],[-1.6,-2]],'#ffeaff');circle(0,0,2.2,'#fff');c.restore();
    }
    c.restore();
    c.save();c.shadowColor='#fc6bff';c.shadowBlur=5*glow;poly([[200,48],[end-30,48],[end-30,52],[200,53]],'#fd92ff99');poly([[200,195],[end-27,195],[end-27,199],[200,199]],'#fc72ff77');c.restore();
    // Fade the mesh, edge highlights and glow together before drawing the metal.
    c.save();c.globalCompositeOperation='destination-in';
    c.fillStyle=grad(end-210,0,end+25,0,[[0,'#fff'],[.35,'#fffffff0'],[.7,'#ffffff88'],[1,'#ffffff00']]);
    c.fillRect(-contentShift/contentScale-30,-40,1100,340);c.restore();
    // Upper and lower metal fins. The dark bevels give the frame depth at small sizes.
    poly([[153,30],[364,30],[345,47],[276,49],[260,57],[186,57]],'#51576b');
    poly([[153,28],[366,28],[345,44],[277,44],[262,53],[184,53]],grad(0,27,0,57,[[0,'#f7ffff'],[.38,'#cbd5d9'],[.7,'#a1aeb6'],[1,'#e5ecee']]));
    poly([[162,29],[355,29],[343,33],[171,33]],'#fff');
    poly([[180,199],[261,197],[279,187],[336,187],[367,218],[163,218],[149,207]],'#4e5266');
    poly([[179,197],[260,194],[278,184],[336,184],[368,215],[164,215],[151,204]],grad(0,184,0,217,[[0,'#f4f7fa'],[.35,'#abb8c3'],[.7,'#e2e9e9'],[1,'#8997a5']]));
    poly([[279,186],[334,186],[350,201],[274,201],[260,208],[166,208],[165,202],[260,199]],'#f7ffffb0');
    const cx=150,cy=124;
    const outer=[[115,49],[184,49],[226,91],[226,157],[184,199],[115,199],[75,158],[75,90]];
    poly(outer,'#31333f','#191323',3);
    poly([[114,47],[184,47],[224,89],[224,155],[183,197],[115,197],[73,156],[73,89]],grad(76,50,225,192,[[0,'#fcffff'],[.22,'#e7eff1'],[.38,'#929ca9'],[.54,'#edf4f5'],[.8,'#99a5b6'],[1,'#eef4f6']]));
    const corners=[[[115,47],[184,47],[193,62],[180,73],[121,73],[106,63]],[[224,89],[224,155],[208,163],[195,150],[195,95],[208,80]],[[184,197],[115,197],[106,181],[121,171],[179,171],[194,182]],[[73,156],[73,89],[89,81],[104,96],[104,149],[88,165]]];
    corners.forEach((p,i)=>poly(p,grad(0,p[0][1]-8,0,p[0][1]+35,[[0,'#fff'],[.5,'#d1dce1'],[1,'#929fae']]),'#ffffff65',1.3));
    [[106,63,121,73],[193,62,180,73],[208,80,195,95],[208,163,195,150],[194,182,179,171],[106,181,121,171],[88,165,104,149],[89,81,104,96]].forEach(p=>{c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(p[2],p[3]);c.strokeStyle='#596371';c.lineWidth=3;c.stroke();});
    circle(cx,cy,62,'#262230','#fbffff',1.5);
    c.save();c.shadowColor='#ed38ff';c.shadowBlur=8*glow;circle(cx,cy,57.5,null,'#ed55fc',4);c.restore();
    circle(cx,cy,53,'#525367','#1f162d',3);
    circle(cx,cy,49.5,grad(105,80,177,173,[[0,'#f3f6f3'],[.3,'#d3d9d9'],[.6,'#aab1b8'],[1,'#858e9b']]),'#e1e7e9',2);
    c.beginPath();c.arc(cx,cy,45,Math.PI*1.1,Math.PI*1.9);c.strokeStyle='#ffffff88';c.lineWidth=2;c.stroke();
    this.drawNumeral(c,cx,cy+2,'#535766');
    this.drawIdentity(c,248,127,'#3c075e',glow,{poly,grad});
  }
  nameFont(size){
    const font=this.getAttribute('font')||'noodle';
    if(font==='custom')return `400 ${size}px "DriveUserFont", "Microsoft YaHei", sans-serif`;
    if(font==='system')return `400 ${size}px "Microsoft YaHei", sans-serif`;
    // Do not force Latin glyphs onto Chinese names; game fallback often applies to the full ID.
    const cjk=/[\u2e80-\u9fff\uac00-\ud7af]/u.test(this.getAttribute('name')||'血律');
    return cjk?`400 ${size}px "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`:`400 ${size}px "DriveNoodleOblique", "BigNoodleTooOblique", "BigNoodleTitlingOblique", Impact, sans-serif`;
  }
  drawNumeral(c,x,y,color,size=35){c.save();c.font=`500 ${size}px Georgia, serif`;c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.shadowColor='#0006';c.shadowBlur=1;c.fillText(this.progress().level,x,y);c.restore();}
  drawIdentity(c,x,y,shadow,glow,{poly,grad}){
    const gold=this.progress().gold;
    c.save();c.scale(1/this.contentScale,1);c.translate(-this.contentShift,0);
    for(let i=0;i<gold;i++){
      // Fill each two-item column vertically, then extend left. A lone item is centered.
      const col=Math.floor(i/2),count=Math.min(2,gold-col*2);
      const x=this.insigniaX-col*18,y=124+(i%2-(count-1)/2)*24;c.save();c.shadowColor='#ffbe39';c.shadowBlur=5*glow;
      poly([[x,y-10],[x+6,y-4],[x+6,y+4],[x,y+10],[x-6,y+4],[x-6,y-4]],'#62401a','#f3bf50',1);
      poly([[x,y-8],[x+4,y],[x,y+8],[x-4,y]],grad(x-4,y-8,x+4,y+8,[[0,'#fff1a7'],[.5,'#ffc847'],[1,'#c8771b']]));c.restore();
    }
    c.restore();
  }
  drawVariant(c,t,glow,v,{poly,grad,circle}){
    const cx=155,cy=124;
    const palettes={blue:['#2426b7','#29bbe7'],red:['#530207','#0a070d'],wing:['#10dbea','#ed16f4'],orb:['#130a6b','#9448cc'],diamond:['#049da8','#002331']};
    const [left,right]=palettes[v];
    let body;
    if(['wing','orb'].includes(v)){c.beginPath();c.roundRect(170,48,700,151,[0,76,76,0]);body=null;}
    else {body=v==='diamond'?[[200,49],[790,49],[870,124],[790,199],[200,199]]:[[180,49],[835,49],[858,65],[862,82],[862,170],[855,185],[837,199],[180,199]];poly(body);}
    c.save();c.clip();c.fillStyle=grad(180,0,870,0,[[0,left],[1,right]]);c.fillRect(170,47,705,154);
    c.fillStyle=grad(0,49,0,200,[[0,'#fff2'],[.2,'#fff0'],[1,'#0003']]);c.fillRect(170,48,705,152);
    if(v==='blue'){
      for(let col=0;col<12;col++)for(let row=-1;row<4;row++){
        let x=260+col*54,y=72+row*62+(col%2)*31;
        c.globalAlpha=(.05+.16*(.5+.5*Math.sin(col*.7-t)))*glow;
        poly(Array.from({length:6},(_,i)=>[x+35*Math.cos(i*Math.PI/3),y+35*Math.sin(i*Math.PI/3)]),null,'#acfaff',2);
      }c.globalAlpha=1;
    }
    if(v==='red'){
      for(let x=242;x<820;x+=14)for(let y=57;y<199;y+=14){let a=Math.max(0,1-Math.abs(x-(380+(t*60)%320))/150)*(.25+.65*(.5+.5*Math.sin(x*.02+y*.015-t*2)))*glow;c.fillStyle=`rgba(255,35,34,${a})`;c.fillRect(x,y,11,11);}
    }
    if(v==='wing'){
      for(let y=56;y<200;y+=5){c.strokeStyle='#b9faff25';c.lineWidth=1;c.beginPath();c.moveTo(230,y);c.lineTo(870,y);c.stroke();}
      for(let i=0;i<45;i++){const x=250+(i*97+t*(80+i%4*10))%615,y=56+(i*31)%137;c.fillStyle=`rgba(238,255,255,${(.15+.55*(.5+.5*Math.sin(t*3+i)))*glow})`;c.fillRect(x,y,i%3?8:25,1.5);}
    }
    if(v==='orb'){
      for(let i=0;i<26;i++){let x=260+(i*97+t*10)%590,y=66+(i*53)%125,rot=t*.2+i;c.save();c.translate(x,y);c.rotate(rot);c.globalAlpha=(.07+.15*(.5+.5*Math.sin(t+i)))*glow;poly([[-9,-14],[17,-5],[-1,12]],'#ddd0ff', '#bca7ff66',1);c.restore();}
    }
    if(v==='diamond'){
      for(let i=0;i<5;i++){const x=230+(i*115+t*24)%580;c.strokeStyle=`rgba(134,255,248,${.06*glow})`;c.lineWidth=2;c.beginPath();c.moveTo(x+90,55);c.lineTo(x+20,55);c.lineTo(x-40,124);c.lineTo(x+20,193);c.lineTo(x+90,193);c.stroke();}
    }
    c.restore();
    // A fine lit edge remains visible over light backgrounds.
    c.save();c.shadowColor=left;c.shadowBlur=7*glow;c.strokeStyle=v==='red'?'#8c0d17':'#a9eaff70';c.lineWidth=2;
    if(body)poly(body,null,c.strokeStyle,2);else{c.beginPath();c.roundRect(170,48,700,151,[0,76,76,0]);c.stroke();}c.restore();
    if(v==='blue'){
      poly([[135,32],[270,32],[276,47],[270,66],[195,66],[168,84],[168,166],[196,184],[270,184],[277,203],[264,218],[135,218],[84,170],[84,80]],'#343c50','#657b89',2);
      poly([[144,40],[268,40],[270,57],[193,57],[153,85],[153,164],[192,193],[270,193],[267,208],[145,208],[103,164],[103,84]],grad(100,40,240,218,[[0,'#e5f3f7'],[.35,'#a5c3cf'],[1,'#617683']]),'#c2deeb',2);
      poly([[147,92],[164,98],[164,148],[147,156],[130,147],[130,101]],'#ffc43b','#332b25',3);
      this.drawNumeral(c,147,124,'#795311',24);
      for(const y of [61,184]){poly([[223,y],[288,y-8],[306,y-4],[308,y+10],[241,y+12]],grad(0,y-8,0,y+12,[[0,'#cedee8'],[1,'#43545c']]),'#677685',2);}
      c.strokeStyle='#6edbfc';c.lineWidth=3;c.beginPath();c.moveTo(88,99);c.lineTo(88,149);c.stroke();
    } else if(v==='red'){
      poly([[154,25],[270,25],[284,39],[353,39],[337,56],[195,56]],grad(0,25,0,57,[[0,'#ffe4af'],[1,'#9a6136']]));
      poly([[173,194],[277,186],[299,208],[179,218]],grad(0,185,0,218,[[0,'#ffe5a1'],[1,'#a66b3d']]));
      c.save();c.shadowColor='#f9232a';c.shadowBlur=15*glow;circle(cx,cy,82,'#412516','#ca9865',5);circle(cx,cy,73,grad(80,50,210,200,[[0,'#ffe6b9'],[.5,'#b77541'],[1,'#edc087']]));circle(cx,cy,61,'#19080c','#8c3f26',2);circle(cx,cy,57,null,'#f02e28',3);c.restore();
      for(let i=0;i<6;i++){c.save();c.translate(cx,cy);c.rotate(i*Math.PI/3);c.beginPath();c.arc(0,0,68,.07,.78);c.lineWidth=5;c.strokeStyle='#4d251f';c.stroke();c.restore();}
      circle(cx,cy,34,'#280a0e','#d22422',2);circle(cx,cy,27,null,'#be2428',1.5);
      for(let i=0;i<3;i++){circle(cx-17+i*17,cy-44,3,'#f33038');circle(cx-17+i*17,cy+44,3,'#f33038');}this.drawNumeral(c,cx,cy,'#f0343a',34);
    } else if(v==='wing'){
      c.save();c.translate(cx-15,cy);for(const flip of [-1,1]){c.save();c.scale(1,flip);c.beginPath();c.moveTo(-22,-7);c.bezierCurveTo(-89,-29,-114,-72,-120,-88);c.bezierCurveTo(-70,-99,-15,-82,13,-33);c.closePath();c.fillStyle='#c8fffa';c.fill();c.beginPath();c.moveTo(-31,-18);c.bezierCurveTo(-67,-35,-89,-57,-90,-70);c.bezierCurveTo(-57,-76,-23,-60,-9,-33);c.closePath();c.fillStyle='#28717b';c.fill();c.restore();}c.restore();
      poly([[178,28],[290,28],[277,49],[229,49],[200,85],[200,164],[236,194],[278,194],[290,219],[178,219]],grad(0,28,0,219,[[0,'#fff'],[.35,'#cad5ed'],[.65,'#a4a0c7'],[1,'#e1ecf6']]));
      circle(cx,cy,83,grad(70,40,235,200,[[0,'#efffff'],[.4,'#a1aecf'],[.65,'#bf8aa7'],[1,'#ddddea']]),'#fbffff',2);
      circle(cx,cy,66,'#8b6b9b','#d8c5f3',4);circle(cx,cy,59,'#ec84cf');
      c.save();c.shadowColor='#24f3ed';c.shadowBlur=18*glow;circle(cx,cy,51,grad(0,75,0,174,[[0,'#96fff5'],[.45,'#20e8df'],[1,'#008eae']]),'#8fffff',2);c.restore();circle(cx,cy,24,'#183749','#70fffc',2);this.drawNumeral(c,cx,cy,'#affff8',28);
      for(const y of [165,175]){c.beginPath();c.roundRect(244,y,14,5,3);c.fillStyle='#b4fa82';c.fill();}
    } else if(v==='orb'){
      poly([[190,38],[346,38],[339,52],[205,58]],grad(0,36,0,58,[[0,'#a8b8fa'],[1,'#2928ba']]));poly([[202,195],[338,191],[348,212],[194,212]],grad(0,190,0,214,[[0,'#c6d6ff'],[1,'#4940dd']]));
      circle(cx-15,cy,90,grad(65,30,200,210,[[0,'#7e9ddd'],[.5,'#424075'],[1,'#8aa5e5']]),'#a3baf188',2);circle(cx,cy,82,'#0d1237','#5e68ab',5);
      for(let i=0;i<8;i++){const a=i*Math.PI/4+.1;c.save();c.translate(cx+74*Math.cos(a),cy+74*Math.sin(a));c.rotate(a);poly([[-14,-15],[10,-15],[18,-4],[12,13],[-15,12]],grad(0,-15,0,15,[[0,'#778ecf'],[1,'#4d4c87']]),'#a2ace14d',1.5);c.restore();}
      const pulse=.8+.2*Math.sin(t*2);c.save();c.shadowColor='#6355ff';c.shadowBlur=32*glow;
      let core=c.createRadialGradient(cx,cy,5,cx,cy,58);core.addColorStop(0,'#111137');core.addColorStop(.35,'#251263');core.addColorStop(.48,'#aac6ff');core.addColorStop(.58,'#547aff');core.addColorStop(.8,'#7227d488');core.addColorStop(1,'#4224ca00');circle(cx,cy,58*pulse,core);c.restore();this.drawNumeral(c,cx,cy,'#f0edff',32);
      for(let i=0;i<6;i++){const a=i*1.1+t*.18;poly([[cx+96*Math.cos(a),cy+96*Math.sin(a)],[cx+101*Math.cos(a+.07),cy+101*Math.sin(a+.07)],[cx+105*Math.cos(a),cy+105*Math.sin(a)],[cx+100*Math.cos(a-.06),cy+100*Math.sin(a-.06)]],'#666ccb');}
    } else {
      for(const flip of [-1,1]){c.save();c.translate(0,cy);c.scale(1,flip);poly([[166,-76],[215,-105],[362,-105],[341,-83],[263,-83],[244,-65],[211,-65],[192,-41]],grad(0,-105,0,-40,[[0,'#b7c6c6'],[.45,'#706c5a'],[1,'#d2b79c']]),'#857d6e',2);poly([[214,-91],[250,-91],[242,-84],[216,-84],[194,-62],[187,-65]],'#6ef5f6aa');c.restore();}
      poly([[cx,22],[cx+101,cy],[cx,226],[cx-101,cy]],grad(70,30,230,210,[[0,'#d9c1ad'],[.5,'#76626c'],[1,'#b6947f']]),'#cbb4a5',2);
      poly([[cx,43],[cx+80,cy],[cx,205],[cx-80,cy]],'#244e56','#83b9bb',2);
      c.save();c.shadowColor='#43f7f3';c.shadowBlur=19*glow;let core=c.createRadialGradient(cx,cy,3,cx,cy,72);core.addColorStop(0,'#7efffc');core.addColorStop(.35,'#22c6d3');core.addColorStop(1,'#22606b');circle(cx,cy,65,core,'#9de2dd88',2);c.restore();
      poly([[cx,85],[cx+39,cy],[cx,163],[cx-39,cy]],null,'#10586d',4);poly([[cx,97],[cx+27,cy],[cx,151],[cx-27,cy]],null,'#8bfffd',2);this.drawNumeral(c,cx,cy,'#efffff',27);
      for(let i=0;i<4;i++){c.save();c.translate(cx,cy);c.rotate(i*Math.PI/2);poly([[-13,-78],[0,-92],[13,-78],[0,-66]],'#153b46','#bcae9c',2);poly([[-7,-78],[0,-85],[7,-78],[0,-72]],'#2eeefa');c.restore();}
    }
    this.drawIdentity(c,v==='blue'?225:260,127,'#0b1237',glow,{poly,grad});
  }
  exportPNG(){this.draw();return this.canvas.toDataURL('image/png');}
}
customElements.define('drive-signature',DriveSignature);
