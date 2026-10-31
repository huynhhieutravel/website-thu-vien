(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,7856,e=>{"use strict";var t=e.i(1398),a=e.i(5863),n=e.i(5769);e.i(461);var o=e.i(1788),i=e.i(2450);let r=.84- -1,l=[".###...###.","###########","###########","###########",".#########.","..#######..","...#####...","....###....",".....#....."],s=l[0].length,h=l.length,d=2.05+.72+.92+.4+.75,c=2.05+.72+.92+.4+.75+2.1+.8,p="#050506",m="#F4F1EA",f=e=>e<0?0:e>1?1:e,x=(e,t,a)=>e<t?t:e>a?a:e,u=(e,t,a)=>e+(t-e)*a,g=e=>1-Math.pow(1-e,4),w=e=>e*e*e*(e*(6*e-15)+10);function y(e){let t=e>>>0;return()=>{let e=Math.imul((t=t+0x6d2b79f5>>>0)^t>>>15,1|t);return(((e=e+Math.imul(e^e>>>7,61|e)^e)^e>>>14)>>>0)/0x100000000}}function b({className:e}){let a=(0,o.useRef)(null),n=(0,o.useRef)(null),[v,M]=(0,o.useState)(!1),[T,k]=(0,o.useState)({open:!1,photo:-1}),j=(0,o.useRef)(null);(0,o.useEffect)(()=>{if(!a.current||!n.current)return;let e=a.current,t=n.current,o=t.getContext("2d",{alpha:!1});if(!o)return;let b=window.matchMedia("(prefers-reduced-motion: reduce)").matches,v=null,T=Math.min(2,window.devicePixelRatio||1),S=!1,O=0,E=-1,z=0,N=-1,A=0,I=-1,P=0,C={x:0,y:0},R=0,D=0,L=new Map,F=new Map,H=0;for(let e of i.PHOTOS)!function(e){let t=new Image;t.decoding="async",t.onload=()=>{H++,L.set(e,t);let a=document.createElement("canvas");a.width=32,a.height=40;let n=a.getContext("2d");n&&(n.drawImage(t,0,0,32,40),F.set(e,a))},t.onerror=()=>H++,t.src=i.IMG_BASE+e,L.set(e,t)}(e);function U(e,t,a){let n=e/t<.9?"tall":"wide",o=x(Math.min(.056*e,.1*t),38,88),c=t=>{let o=.655*t*a,i=1.06*o,r=e*("tall"===n?.9:.94)*a;return i>r&&(o=(i=r)/1.06),{bh:o,bw:i}},p=t,{bh:m,bw:g}=c(p),w=(e-g)/2>=3.2*o+.026*e+24;w||(p=.72*t,{bh:m,bw:g}=c(p));let b=.5*e,v=(p-m)/2,M=[1,1,.655,.575,.52,.41,.32,.3,.17],T=M.length,k=[1,0,1,1,0,0,0,0,0],j=Math.max(1.5,.006*m),S=M.reduce((e,t)=>e+t,0),O=m/S,E=[],z=v;for(let e=0;e<T;e++){let t=O*M[e];E.push({y0:z,y1:z+t,ch:t,cw:t/1.16}),z+=t}let N=Math.min(2,T-1),A=E[N].y0,I=E[N].ch,P=E[N].cw,C=b-P/2,R=s/h,D=.9*P,L=D/R;L>.9*I&&(D=(L=.9*I)*R);let F=[],H=y(0x13527d1);for(let e=0;e<T;e++){let{y0:t,ch:a,cw:n}=E[e],o=e===N,i=F.length,l=.84-(t+a/2-v)/m*r,s=1===k[e],h=Math.ceil(g/n)+2;h%2==+!s&&h++;for(let i=0;i<h;i++){let r=b+(i-(h-1)/2)*n;if(!function(e,t){let a,n,o,i=Math.abs(e);return i<=(n=.5>Math.abs(a=t-.34)?.62+Math.sqrt(.25-a*a):0,a>0?n:Math.max(n,1.12*Math.pow((t+1)/1.34,.59)))&&i>=((o=t-.34)<=0||o>=.5?0:Math.max(0,.62-Math.sqrt(.25-o*o)))}((r-b)/g*2.24,l))continue;let s=r-n/2;o&&Math.min(s+n,C+P)-Math.max(s,C)>0&&Math.max(Math.max(0,C-s),Math.max(0,s+n-(C+P)))<.38*n||F.push({x:s+j/2,y:t+j/2,w:n-j,h:a-j,row:e,p:0,delay:0,drop:0,spin:0,fx:0,fy:0,fw:0,fh:0,fdelay:0,ftilt:0,fz:0,fdepth:0})}if(e===T-1&&F.length-i>2){let e=F.splice(i);for(let t of(e.sort((e,t)=>Math.abs(e.x+e.w/2-b)-Math.abs(t.x+t.w/2-b)),e.slice(0,2).sort((e,t)=>e.x-t.x)))F.push(t)}}let U=1.15/Math.max(1,T-1),q=[];for(let e of F)q[e.row]=(q[e.row]??0)+1;let _=[];F.forEach((e,a)=>{e.p=a%i.PHOTOS.length;let n=q[e.row]??1,o=_[e.row]??0;_[e.row]=o+1,e.delay=.34+e.row*U+(n>1?o/(n-1):0)*U*.55,e.drop=t*(.4+.35*H()),e.spin=(H()-.5)*.5});let W=F.length,X=Math.max(1,e*("tall"===n?.165:.098)/D),$=D*X,B=L*X,G=e/2,Y=t/2+.18*B,K=1.2*e,V=1.2*t,J=-(K-e)/2,Q=-(V-t)/2,Z=Math.max(3,Math.round(Math.sqrt(e/t*W))),ee=Math.ceil(W/Z),et=[];for(let e=0;e<8;e++){let e=K/Z,t=V/ee;et=[];for(let a=0;a<ee;a++)for(let n=0;n<Z;n++){let o=Q+a*t+t/2;Math.abs(J+n*e+e/2-G)<$/2+.12*e&&Math.abs(o-Y)<B/2+.12*t||et.push({gx:n,gy:a})}if(et.length>=W)break;Z+=1,ee=Math.ceil(1.15*W/Z)}let ea=K/Z,en=V/ee,eo=.22*Math.min(ea,en),ei=Math.max(12,Math.min(ea-eo,(en-eo)/1.16));for(let e=et.length-1;e>0;e--){let t=Math.floor(H()*(e+1));[et[e],et[t]]=[et[t],et[e]]}let er=F.map((e,t)=>t);for(let e=er.length-1;e>0;e--){let t=Math.floor(H()*(e+1));[er[e],er[t]]=[er[t],er[e]]}er.forEach((a,n)=>{let o=F[a],i=et[n%et.length],r=Math.pow(H(),1.8);o.fdepth=r,o.fw=ei*u(.42,1,r),o.fh=1.16*o.fw;let l=Math.max(0,(ea-eo-o.fw)/2),s=Math.max(0,(en-eo-o.fh)/2),h=J+(i.gx+.5)*ea,c=Q+(i.gy+.5)*en;o.fx=h+(2*H()-1)*l,o.fy=c+(2*H()-1)*s;let p=.012*Math.min(e,t),w=$/2+o.fw/2+p-Math.abs(o.fx-G),y=B/2+o.fh/2+p-Math.abs(o.fy-Y);if(w>0&&y>0)if(w<=y){let e=o.fx>=G?1:-1;o.fx=x(o.fx+e*w,h-l,h+l)}else{let e=o.fy>=Y?1:-1;o.fy=x(o.fy+e*y,c-s,c+s)}o.ftilt=(H()-.5)*.05,o.fz=r;let M=Math.hypot(o.x+o.w/2-b,o.y+o.h/2-(v+.45*m))/Math.max(g,m);o.fdelay=d+.8*f(M)}),F.sort((e,t)=>e.fz-t.fz);let el=D/s,es=el*s,eh=el*h,ed=C+(P-es)/2,ec=A+(I-eh)/2,ep=[],em=y(77003);for(let e=0;e<h;e++)for(let t=0;t<s;t++){if("#"!==l[e][t])continue;let a=ed+(t+.5)*el,n=ec+(e+.5)*el,o=F.length?F[Math.floor(em()*F.length)]:null;ep.push({x:a-el/2,y:n-el/2,s:el,delay:2.05+Math.hypot(a-(ed+es/2),n-(ec+eh/2))/Math.max(es,eh)*.72+.1*em(),fx:o?o.x+o.w/2:b,fy:o?o.y+o.h/2:A,p:o?o.p:0,cyc:3.4+3.4*em(),phase:em(),seed:Math.floor(65536*em())})}let ef=Math.min(e*("tall"===n?.66:.3),.42*t),ex=1.4*ef,eu=t/2-ex/2;return{w:e,h:t,mode:n,gut:eo,flank:w,copyTop:p,cx:b,top:v,hw:g,hh:m,cells:F,vx:C,vy:A,vw:P,vh:I,pix:ep,kx:G,ky:Y,kw:$,kh:B,kscale:X,cdx:e/2-ef/2,cdy:eu,cdw:ef,cdh:ex}}function q(){let a=e.clientWidth||window.innerWidth,n=e.clientHeight||window.innerHeight;t.width=Math.round(a*(T=Math.min(2,window.devicePixelRatio||1))),t.height=Math.round(n*T),t.style.width=a+"px",t.style.height=n+"px",o.setTransform(T,0,0,T,0,0),v=function(e,t){let a=e/t<.9?"tall":"wide",n=e*("tall"===a?.9:.94),o=1,i=U(e,t,1);for(let a=0;a<3&&i.cells.length;a++){let a=1/0,r=-1/0;for(let e of i.cells)e.x<a&&(a=e.x),e.x+e.w>r&&(r=e.x+e.w);let l=r-a;if(l<=n)break;o*=n/l*.998,i=U(e,t,o)}return i}(a,n),e.style.setProperty("--am-heart-top",`${v.top}px`),e.style.setProperty("--am-heart-bot",`${v.top+v.hh}px`),e.style.setProperty("--am-copy-top",`${v.copyTop}px`),e.style.setProperty("--am-cardw",`${v.cdw}px`),e.style.setProperty("--am-cardh",`${v.cdh}px`),e.dataset.copy=v.flank?"side":"under",e.dataset.rail=(v.w-v.cdw)/2>=108?"side":"under"}function _(e,t,a,n,o,i,r,l){let s=Math.max(r/a,l/n),h=r/s,d=l/s;e.drawImage(t,(a-h)/2,(n-d)*.36,h,d,o,i,r,l)}function W(e,t){if(!v)return{x:0,y:0};let a=t*R*(1-w(A));if(a<=.002)return{x:0,y:0};let n=C.x-e.fx,o=C.y-e.fy,i=Math.hypot(n,o),r=.3*Math.min(v.w,v.h);if(i>=r||i<1)return{x:0,y:0};let l=1-i/r,s=.45*v.gut*(l*l*(3-2*l))*a*u(.6,1,e.fdepth);return{x:n/i*s,y:o/i*s}}let X=performance.now(),$=0,B=!1,G=()=>b?c:$;function Y(t){let a;O=requestAnimationFrame(Y);let n=Math.min(.05,(t-X)/1e3);if(X=t,S||0)return;$+=n,(a=G()>d+.15)!==B&&(B=a,e.dataset.spread=a?"1":"");let r=1-Math.exp(-(11*n));z+=((E>=0)-z)*r;let l=1-Math.exp(-(5.4*n));A+=((N>=0)-A)*l;let s=1-Math.exp(-(9*n));C.x+=(ee.x-C.x)*s,C.y+=(ee.y-C.y)*s,R+=(D-R)*(1-Math.exp(-(4.5*n))),P+=(0-P)*l,I>=0&&P<.004&&(P=0,I=-1),function(e){if(!v)return;let{w:t,h:a}=v;function n(n,r){if(!v)return;let l=f((e-n.delay)/1.18);if(l<=0)return;let s=g(l),h=f(2.2*l),d=f((e-n.fdelay)/2.1),c=w(d),m=n.x+n.w/2,x=n.y+n.h/2+(1-s)*n.drop,y=W(n,c),b=u(m,n.fx,c)+y.x,M=u(x,n.fy,c)+y.y,T=u(n.w,n.fw,c),k=u(n.h,n.fh,c),j=r>1e-4?w(r):0;j>1e-4&&(b=u(b,v.cdx+v.cdw/2,j),M=u(M,v.cdy+v.cdh/2,j),T=u(T,v.cdw,j),k=u(k,v.cdh,j));let S=u(.86,1,s),O=E>=0&&v.cells[E]===n&&d>.99?z:0,N=i.PHOTOS[n.p],I=L.get(N),C=F.get(N);if(o.save(),c<.001&&n.x<v.vx+v.vw&&n.x+n.w>v.vx&&n.y<v.vy+v.vh&&n.y+n.h>v.vy&&(o.beginPath(),o.rect(0,0,t,a),o.rect(v.vx,v.vy,v.vw,v.vh),o.clip("evenodd")),o.globalAlpha=h,o.translate(b,M),n.spin&&o.rotate(n.spin*(1-s)),n.ftilt&&o.rotate(n.ftilt*c*(.55+.8*n.fdepth)*(1-j)),j>1e-4){let e=10*j;o.beginPath(),o.moveTo(-T/2+e,-k/2),o.arcTo(T/2,-k/2,T/2,k/2,e),o.arcTo(T/2,k/2,-T/2,k/2,e),o.arcTo(-T/2,k/2,-T/2,-k/2,e),o.arcTo(-T/2,-k/2,T/2,-k/2,e),o.closePath(),o.clip()}o.scale(S*(1+.06*O),S*(1+.06*O));let R=c*Math.pow(1-n.fdepth,1.7);R*=1-j,C&&_(o,C,32,40,-T/2,-k/2,T,k),I&&I.complete&&I.naturalWidth&&(o.globalAlpha=h*(1-Math.pow(1-f((l-.25)/.6),2))*(1-.4*R),_(o,I,I.naturalWidth,I.naturalHeight,-T/2,-k/2,T,k)),R>.004&&(o.globalAlpha=Math.min(1,.34*R),o.fillStyle=p,o.fillRect(-T/2,-k/2,T,k),o.globalAlpha=h);let D=(1-j)*Math.max(A,P)*.72;D>.002&&(o.globalAlpha=Math.min(1,D),o.fillStyle=p,o.fillRect(-T/2,-k/2,T,k)),o.restore()}o.fillStyle=p,o.fillRect(0,0,t,a);for(let e=0;e<v.cells.length;e++)e!==N&&e!==I&&n(v.cells[e],0);let r=w(f((e-d)/1.785)),l=v.vx+v.vw/2,s=v.vy+v.vh/2,h=1+r*(v.kscale-1);o.save(),o.translate(u(l,v.kx,r),u(s,v.ky,r)),o.scale(h,h),o.translate(-l,-s);let c=1-.72*Math.max(A,P);for(let t of v.pix){if(c<=.002)break;let a=f((e-t.delay)/.92);if(a<=0)continue;let n=g(a),r=u(t.fx,t.x,n),l=u(t.fy,t.y,n),s=Math.max(.75,.1*t.s)/h,d=Math.max(1,Math.max(1,t.s-s)*u(.25,1,n)),p=r+(t.s-d)/2,x=l+(t.s-d)/2;o.globalAlpha=f(2.4*a)*c;let w=(e-t.delay)/t.cyc+t.phase,y=Math.floor(w),b=(w-y)*t.cyc,v=0;if(b<.55?v=b/.55:b<2.05?v=1:b<2.65&&(v=1-(b-.55-1.5)/.6),v=f(v),o.fillStyle=m,o.fillRect(p,x,d,d),v>.004){let e=(t.seed^0x9e3779b1*y)>>>0;e^=e>>>15,e=Math.imul(e,0x2c1b3c6d)>>>0,e^=e>>>12;let n=i.PHOTOS[e%i.PHOTOS.length],r=F.get(n)??L.get(n);if(r){let e=r instanceof HTMLCanvasElement?r.width:r.naturalWidth,t=r instanceof HTMLCanvasElement?r.height:r.naturalHeight;e&&t&&(o.globalAlpha=f(2.4*a)*c*v,_(o,r,e,t,p,x,d,d))}}}o.restore(),o.globalAlpha=1,I>=0&&v.cells[I]&&n(v.cells[I],P),N>=0&&v.cells[N]&&n(v.cells[N],A)}(G())}function K(e,t){if(!v||G()<c)return -1;for(let a=v.cells.length-1;a>=0;a--){let n=v.cells[a],o=W(n,1),i=e-(n.fx+o.x),r=t-(n.fy+o.y);if(Math.abs(i)<=n.fw/2&&Math.abs(r)<=n.fh/2)return a}return -1}function V(){N<0||(I=N,P=A,N=-1,A=0)}function J(t){!v||t<0||t>=v.cells.length||(t===I?(A=P,P=0,I=-1):(V(),A=0),N=t,E=-1,e.dataset.hit="",k({open:!0,photo:v.cells[t].p}),e.dataset.open="1")}function Q(){N<0||(V(),k({open:!1,photo:-1}),e.dataset.open="",E=K(ee.x,ee.y),e.dataset.hit=E>=0?"1":"")}function Z(t){v&&!(N<0)&&(N=(N+t+v.cells.length)%v.cells.length,k({open:!0,photo:v.cells[N].p}),e.dataset.open="1")}let ee={x:-9999,y:-9999},et=t=>{let a=e.getBoundingClientRect();ee.x=t.clientX-a.left,ee.y=t.clientY-a.top,b||(0===D&&(C.x=ee.x,C.y=ee.y),D=1);let n=N>=0?-1:K(ee.x,ee.y);n!==E&&(E=n,e.dataset.hit=n>=0?"1":"")},ea=()=>{E=-1,e.dataset.hit="",D=0},en=t=>{if(N>=0)return;let a=e.getBoundingClientRect(),n=K(t.clientX-a.left,t.clientY-a.top);n>=0&&J(n)},eo=e=>{N<0||("Escape"===e.key?(Q(),e.preventDefault()):"ArrowRight"===e.key?(Z(1),e.preventDefault()):"ArrowLeft"===e.key&&(Z(-1),e.preventDefault()))};e.addEventListener("pointermove",et),e.addEventListener("pointerleave",ea),e.addEventListener("click",en),window.addEventListener("keydown",eo),j.current={close:Q,step:Z,open:J},q(),M(!0);let ei=new ResizeObserver(()=>q());ei.observe(e);let er=new IntersectionObserver(e=>{(S=!e[0].isIntersecting)||(X=performance.now())},{threshold:.01});er.observe(e);let el=()=>{document.hidden?cancelAnimationFrame(O):(X=performance.now(),O=requestAnimationFrame(Y))};return document.addEventListener("visibilitychange",el),O=requestAnimationFrame(Y),()=>{cancelAnimationFrame(O),e.removeEventListener("pointermove",et),e.removeEventListener("pointerleave",ea),e.removeEventListener("click",en),window.removeEventListener("keydown",eo),j.current=null,ei.disconnect(),er.disconnect(),document.removeEventListener("visibilitychange",el),L.clear(),F.clear()}},[]);let S=T.photo>=0?i.META[T.photo]??null:null;return(0,t.jsxs)("div",{ref:a,className:`am-root ${e??""}`,"data-ready":v?"1":void 0,"aria-label":"A heart assembled from photographs",children:[(0,t.jsx)("canvas",{ref:n,className:"am-cv","aria-hidden":!0}),(0,t.jsx)("header",{className:"am-bar",children:(0,t.jsxs)("span",{className:"am-mark",children:[(0,t.jsx)("i",{"aria-hidden":!0,children:"✳"}),i.STUDIO.mark]})}),(0,t.jsxs)("h2",{className:"am-head am-head-l",children:[(0,t.jsx)("span",{children:i.STUDIO.headLeft[0]}),(0,t.jsx)("em",{children:i.STUDIO.headLeft[1]})]}),(0,t.jsxs)("h2",{className:"am-head am-head-r",children:[(0,t.jsx)("span",{children:i.STUDIO.headRight[0]}),(0,t.jsx)("em",{children:i.STUDIO.headRight[1]})]}),(0,t.jsxs)("p",{className:"am-note",children:[i.STUDIO.note," ",(0,t.jsx)("a",{href:"#!",children:i.STUDIO.noteAccent})]}),T.open&&S&&(0,t.jsxs)("div",{className:"am-view",role:"dialog","aria-modal":"true","aria-label":S.name,children:[(0,t.jsx)("button",{type:"button",className:"am-scrim","aria-label":"Close",onClick:()=>j.current?.close()}),(0,t.jsxs)("button",{type:"button",className:"am-collect",children:[(0,t.jsx)("i",{"aria-hidden":!0,children:"+"})," ",i.STUDIO.collect]}),(0,t.jsxs)("div",{className:"am-rail","aria-hidden":!0,children:[(0,t.jsx)("span",{className:"am-railbtn",children:"♡"}),(0,t.jsx)("span",{className:"am-railbtn",children:"↗"})]}),(0,t.jsxs)("figure",{className:"am-card","aria-label":S.name,children:[(0,t.jsxs)("span",{className:"am-seg","aria-hidden":!0,children:[(0,t.jsx)("b",{}),(0,t.jsx)("b",{}),(0,t.jsx)("b",{})]}),(0,t.jsxs)("figcaption",{children:[(0,t.jsxs)("h3",{children:[S.name,(0,t.jsxs)("svg",{viewBox:"0 0 16 16","aria-hidden":!0,children:[(0,t.jsx)("circle",{cx:"8",cy:"8",r:"8"}),(0,t.jsx)("path",{d:"M4.6 8.2l2.2 2.2 4.6-4.6"})]})]}),(0,t.jsx)("ul",{children:S.tags.map(e=>(0,t.jsx)("li",{children:e},e))})]}),(0,t.jsxs)("span",{className:"am-acts","aria-hidden":!0,children:[(0,t.jsx)("b",{children:"⤢"}),(0,t.jsx)("b",{children:"↓"})]})]}),(0,t.jsxs)("p",{className:"am-hint",children:["Press ",(0,t.jsx)("kbd",{children:"←"})," ",(0,t.jsx)("kbd",{children:"→"})," ",i.STUDIO.hint]})]}),(0,t.jsx)("style",{children:`
        .am-root {
          position: absolute;
          inset: 0;
          overflow: hidden;
          background: ${p};
          color: ${m};
          -webkit-tap-highlight-color: transparent;
          font-family: var(--font-geist-sans), system-ui, sans-serif;
        }
        .am-cv { position: absolute; inset: 0; display: block; }

        /* All chrome resolves out of the same black the photographs come out
           of, a beat after them — the stage is empty first, and nothing is
           allowed to be on it before the heart starts. */
        .am-root > *:not(.am-cv) {
          opacity: 0;
          transform: translateY(10px);
          filter: blur(6px);
        }
        .am-root[data-ready="1"] > *:not(.am-cv) {
          opacity: 1;
          transform: none;
          filter: none;
          transition: opacity .9s cubic-bezier(.16,1,.3,1) .35s,
                      transform 1.1s cubic-bezier(.16,1,.3,1) .35s,
                      filter .9s cubic-bezier(.16,1,.3,1) .35s;
        }
        .am-root[data-ready="1"] .am-head { transition-delay: 1.5s; }
        .am-root[data-ready="1"] .am-note { transition-delay: 1.9s; }

        /* THE COLUMN IS NAMED, not left to auto-placement. The bar holds one
           thing — the wordmark — on a three-column grid whose outer columns are
           empty, which is what puts the mark on the SECTION'S centre line. A
           lone auto-placed child would take column one and sit at the left
           edge instead. Naming it is also what let the CTA that used to sit in
           column three be taken out without moving anything else. */
        .am-bar {
          position: absolute; top: 0; left: 0; right: 0; z-index: 4;
          display: grid; grid-template-columns: 1fr auto 1fr;
          align-items: center; gap: 16px;
          padding: 2.2vh 2.4vw;
        }
        .am-mark {
          grid-column: 2;
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; letter-spacing: .3em; text-transform: uppercase;
          font-weight: 500;
        }
        .am-mark i { font-style: normal; opacity: .8; font-size: 12px; }
        /* The headline is SPLIT around the heart — it is the frame the shape
           sits in, so it never competes for the middle of the stage. */
        .am-head {
          position: absolute; bottom: 8vh; z-index: 3;
          display: flex; flex-direction: column;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-weight: 400; line-height: .92; letter-spacing: -.01em;
          margin: 0;
        }
        /* Sized off BOTH axes. Width alone put 88px type in a 400px-tall
           landscape phone, where the copy then took a third of the frame —
           a vw alone cannot see that the frame is short. The two ratios are the same
           ratio (3.6/5.6 = 6.4/10), so the pair keeps its proportion whichever
           axis is doing the limiting. */
        .am-head span { font-size: clamp(28px, min(3.6vw, 6.4vh), 58px); opacity: .5; }
        .am-head em {
          font-style: normal;
          font-size: clamp(38px, min(5.6vw, 10vh), 88px);
        }
        /* THE COPY STOPS DRIFTING AT A MAX WIDTH. Pinned to the viewport's own
           edge it kept walking outward on a wide monitor — on an ultrawide the
           headline sat seven hundred pixels from the heart it is supposed to be
           framing, one word marooned in each corner. Past 1800 the page is
           treated as 1800 and the margin grows around it instead. */
        .am-head-l { left: max(2.6vw, calc((100vw - 1800px) / 2)); }
        .am-head-r {
          right: max(2.6vw, calc((100vw - 1800px) / 2));
          text-align: right;
        }

        /* Centred with left/right + text-align, NOT translateX(-50%). The
           entrance rule below resolves every child to transform:none, which
           silently cancels any transform used for POSITIONING — the note was
           sitting half a screen right of where it belonged on every viewport
           because of it. Nothing here may lean on transform to place itself. */
        .am-note {
          position: absolute; left: 0; right: 0; bottom: 9vh;
          z-index: 3; margin: 0; text-align: center; white-space: nowrap;
          font-size: 11.5px; letter-spacing: .04em; opacity: .62;
        }
        .am-note a { color: inherit; text-underline-offset: 4px; }

        /* ── the copy, STACKED ────────────────────────────────────────────
           Used when the canvas has told us the headline will not fit beside
           the heart (data-copy="under"). It is not a phone rule: a 1000x900
           window lands here too, and a 844x390 phone in landscape does not.

           The --am-copy-top property is the canvas's own band edge in pixels, so type
           starts exactly where the heart's room stops. The second line is
           offset by the FIRST line's measured height — two line boxes at .92
           plus a gap — rather than by a flat slice of the viewport, which is
           what let the two halves of the sentence collide on a 320-wide phone
           where the type had bottomed out at its clamp but the slice had
           not. */
        .am-root[data-copy="under"] {
          --am-h-span: clamp(22px, 6vw, 34px);
          --am-h-em: clamp(30px, 9vw, 50px);
        }
        .am-root[data-copy="under"] .am-head {
          bottom: auto; top: var(--am-copy-top, 72%);
          left: 6vw; right: auto; text-align: left;
        }
        .am-root[data-copy="under"] .am-head span { font-size: var(--am-h-span); }
        .am-root[data-copy="under"] .am-head em { font-size: var(--am-h-em); }
        .am-root[data-copy="under"] .am-head-r {
          top: calc(
            var(--am-copy-top, 72%) +
            0.92 * (var(--am-h-span) + var(--am-h-em)) +
            0.45 * var(--am-h-em)
          );
        }
        .am-root[data-copy="under"] .am-note {
          bottom: 4vh; left: 6vw; right: 6vw;
          white-space: normal; font-size: 10.5px; line-height: 1.6;
        }

        /* the wall is only pointable once it IS a wall */
        .am-root[data-hit="1"] { cursor: pointer; }
        /* the copy belongs to the heart; it leaves when the wall arrives */
        .am-root[data-spread="1"] .am-head,
        .am-root[data-spread="1"] .am-note {
          opacity: 0; pointer-events: none;
          transition: opacity .55s ease;
        }
        /* the page chrome steps aside for the card */
        .am-root[data-open="1"] .am-head,
        .am-root[data-open="1"] .am-note { opacity: 0; pointer-events: none; }

        /* ── the detail card ──────────────────────────────────────────── */
        /* ONE source for the card's width, because the pill above it and the
           rail beside it are both positioned off the card's edges. Written out
           twice by hand they drift the moment the card is resized — which is
           exactly what happened: the pill was placed against a guessed half-
           height and ended up sitting ON the photograph. */
        /* The card's size comes from the CANVAS SOLVE, handed over as custom
           properties — the same numbers the travelling frame flies to. Two
           definitions of this box is one too many: the stylesheet's version
           and the canvas's version drifted by a few pixels at some viewport
           sizes and the handover jumped. */
        .am-view {
          position: absolute; inset: 0; z-index: 20;
          --cardw: var(--am-cardw, min(30vw, 42vh));
          --cardh: var(--am-cardh, calc(var(--cardw) * 1.4));
        }
        .am-scrim {
          position: absolute; inset: 0; width: 100%; height: 100%;
          border: 0; padding: 0; background: transparent; cursor: zoom-out;
          animation: amFade .3s ease both;
        }
        @keyframes amFade { from { opacity: 0 } }

        .am-card {
          position: absolute; left: 50%; top: 50%;
          margin: 0; width: var(--cardw); height: var(--cardh);
          transform: translate(-50%, -50%);
          border-radius: 10px; overflow: hidden;
          box-shadow: 0 40px 90px rgba(0,0,0,.7), 0 0 0 1px rgba(255,255,255,.07);
          /* The chrome CROSS-FADES IN as the frame lands — it does not travel
             with it. Type sliding and scaling across the screen for half a
             second is unreadable, so the photograph makes the journey and the
             words simply arrive once it has stopped. */
          animation: amChrome .3s ease .28s both;
          pointer-events: none;
        }
        @keyframes amChrome { from { opacity: 0 } }
        @keyframes amCard {
          from { opacity: 0; transform: translate(-50%,-46%) scale(.94); }
        }
        /* the caption sits ON the photograph, so it needs its own ground */
        .am-card figcaption {
          position: absolute; left: 0; right: 0; bottom: 0;
          padding: 34px 16px 14px;
          background: linear-gradient(to top, rgba(6,6,8,.86), rgba(6,6,8,0));
        }
        .am-card h3 {
          margin: 0 0 8px; display: flex; align-items: center; gap: 6px;
          font-family: var(--font-instrument-serif), Georgia, serif;
          font-weight: 400; font-size: clamp(17px, 1.5vw, 24px); line-height: 1;
        }
        .am-card h3 svg { width: 13px; height: 13px; flex: none; }
        .am-card h3 svg circle { fill: #4ea3ff; }
        .am-card h3 svg path { fill: none; stroke: #fff; stroke-width: 1.7; }
        .am-card ul {
          display: flex; flex-wrap: wrap; gap: 5px; margin: 0; padding: 0;
          list-style: none;
        }
        .am-card li {
          padding: 3px 8px; border-radius: 999px;
          background: rgba(255,255,255,.13);
          font-size: 9px; letter-spacing: .04em;
        }
        .am-seg {
          position: absolute; top: 12px; right: 12px; display: flex; gap: 3px;
        }
        .am-seg b { width: 12px; height: 2px; border-radius: 2px; background: rgba(255,255,255,.34); }
        .am-seg b:first-child { background: #fff; width: 18px; }
        .am-acts {
          position: absolute; right: 12px; bottom: 14px;
          display: flex; flex-direction: column; gap: 8px;
        }
        .am-acts b {
          width: 26px; height: 26px; border-radius: 50%;
          display: grid; place-items: center; font-weight: 400; font-size: 11px;
          background: rgba(255,255,255,.16); backdrop-filter: blur(6px);
        }

        .am-collect, .am-rail, .am-hint { position: absolute; z-index: 2; }
        .am-collect {
          left: 50%; top: calc(50% - var(--cardh) / 2 - 46px);
          transform: translateX(-50%);
          display: inline-flex; align-items: center; gap: 7px;
          padding: 8px 15px; border-radius: 999px;
          border: 1px solid rgba(244,241,234,.2);
          background: rgba(20,20,24,.7); backdrop-filter: blur(10px);
          color: inherit; font-size: 11px; cursor: pointer;
          animation: amCard .42s cubic-bezier(.16,1,.3,1) .34s both;
        }
        .am-collect i { font-style: normal; opacity: .7; }
        .am-rail {
          left: calc(50% - var(--cardw) / 2 - 52px); top: 50%;
          transform: translateY(-50%);
          display: flex; flex-direction: column; gap: 6px; padding: 7px 6px;
          border-radius: 999px; background: rgba(20,20,24,.6);
          border: 1px solid rgba(244,241,234,.12);
          animation: amCard .42s cubic-bezier(.16,1,.3,1) .4s both;
        }
        .am-railbtn {
          width: 24px; height: 24px; border-radius: 50%;
          display: grid; place-items: center; font-size: 12px; opacity: .75;
        }
        .am-hint {
          left: 0; right: 0; bottom: 5vh; margin: 0; text-align: center;
          font-size: 10.5px; letter-spacing: .04em; opacity: .5;
          animation: amCard .42s cubic-bezier(.16,1,.3,1) .46s both;
        }
        .am-hint kbd {
          display: inline-grid; place-items: center;
          min-width: 17px; height: 17px; padding: 0 4px; margin: 0 1px;
          border-radius: 4px; border: 1px solid rgba(244,241,234,.24);
          font: inherit; font-size: 9.5px;
        }

        /* On a phone the card takes the width and the side rail has nowhere
           to go, so it moves under the collect pill rather than off-screen. */
        /* ── the rail, MOVED UNDER THE CARD ───────────────────────────────
           Same reasoning as the stacked copy: the question is whether there is
           a column left beside the card, which only the canvas can answer
           because the canvas is what sized the card. On the aspect query it
           used to answer wrong on a portrait tablet — the card was two-thirds
           of 768 and the rail, sent below by the query, came down across its
           own bottom edge. */
        .am-root[data-rail="under"] .am-collect {
          top: calc(50% - var(--cardh) / 2 - 44px);
        }
        .am-root[data-rail="under"] .am-rail {
          left: 50%; top: auto; bottom: 8vh;
          transform: translateX(-50%); flex-direction: row;
        }

        /* Keyed to ASPECT, the same test the canvas uses to pick its solve —
           a width query would put the phone chrome on a landscape tablet.
           What is LEFT in here is only what is genuinely about the shape of the
           screen: the bar's columns, and a hint about keys on a screen that
           has none. Everything that depends on how big the heart or the card
           came out has moved to the data attributes above, where it can be
           measured instead of guessed. */
        @media (max-aspect-ratio: 9/10) {
          /* no centre column on a phone: the wordmark takes the left edge */
          .am-bar { grid-template-columns: 1fr; padding: 2.4vh 5vw; }
          .am-mark { grid-column: 1; }
          .am-hint { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .am-root > *:not(.am-cv) { transition-duration: .01s !important; transition-delay: 0s !important; }
        }
      `})]})}e.s(["default",0,()=>(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Seo,{}),(0,t.jsxs)("main",{className:"relative h-dvh w-full overflow-hidden bg-[#050506] text-[#F4F1EA]",children:[(0,t.jsx)(b,{}),(0,t.jsx)(n.StageNav,{active:"/",floating:!0})]})]})],7856)},5075,(e,t,a)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/",()=>e.r(7856)]),t.hot&&t.hot.dispose(function(){window.__NEXT_P.push(["/"])})}]);