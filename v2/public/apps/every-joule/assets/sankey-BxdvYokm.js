import{ak as D,$ as s,ax as E,x as Q,H as h,C as x,V as B,z as H,q as $,k as J,s as X,a3 as Y}from"./three-PaSYbO4s.js";import{S as F}from"./colors-DgX8emcA.js";import{M as Z,n as ee}from"./cutaway-Dhzn16cq.js";const te=`
attribute vec3 aSide; attribute vec3 aNrm; attribute float aV; attribute float aU; attribute float aW;
uniform float uWidth; uniform float uTime; uniform int uMode; uniform float uTaperIn; uniform float uTaperOut; uniform float uLen;
uniform vec2 uRes; uniform float uMinPx; uniform float uGlow;
varying float vU; varying float vV;
void main() {
  vU = aU; vV = aV;
  float taper = 1.0;
  if (uTaperIn > 0.0) taper *= 0.4 + 0.6 * smoothstep(0.0, uTaperIn, aU);
  if (uTaperOut > 0.0) taper *= 0.4 + 0.6 * smoothstep(1.0, 1.0 - uTaperOut, aU);
  // a band going out (its flow stopped, or the drawing folding away) narrows away in its last half instead of
  // darkening to a black band; at zero width nothing is left (not even the heating waver's sliver)
  float gk = clamp(uGlow * 1.4, 0.0, 1.0) * step(1e-6, uWidth);
  float w = 0.5 * uWidth * aW * taper * gk;
  float s = aU * uLen;
  vec3 c = position;
  vec3 p = position + aSide * aV * w;
  if (uMode == 2) {
    // heating: the band wavers out of its plane and breathes a little, slowly
    float k = (0.35 + 0.12 * uWidth) * smoothstep(0.0, 0.15, aU) * gk;
    p += aNrm * k * sin(s * 0.16 - uTime * 1.3 + aV * 0.8);
    c += aNrm * k * sin(s * 0.16 - uTime * 1.3);
    p += aSide * aV * w * 0.12 * sin(s * 0.11 - uTime * 0.9);
  }
  vec4 ce = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  // a band whose width on screen would be under uMinPx (a small flow seen from afar) is drawn as a line exactly
  // uMinPx across, facing the screen, so a hairline stays a crisp line of full colour instead of a pale smear;
  // the choice is by the band's true width at its distance, so the line never twists where the band would
  if (uMinPx > 0.0 && gk > 0.0) {
    vec4 cc = projectionMatrix * modelViewMatrix * vec4(c, 1.0);
    float pxPerMm = 0.5 * uRes.y * projectionMatrix[1][1] / cc.w;
    if (w * pxPerMm < 0.5 * uMinPx) {
      vec4 ct = projectionMatrix * modelViewMatrix * vec4(c + normalize(cross(aSide, aNrm)), 1.0);
      vec2 sc = cc.xy / cc.w, st = (ct.xy / ct.w - sc) * 0.5 * uRes;
      vec2 perp = normalize(vec2(-st.y, st.x) + vec2(1e-5, 0.0));
      ce = vec4((sc + perp * aV * 0.5 * uMinPx * gk / (0.5 * uRes)) * cc.w, cc.z, cc.w);
    }
  }
  gl_Position = ce;
}`,ae=`
uniform vec3 uA; uniform vec3 uB; uniform float uGlow; uniform float uTime; uniform float uLen; uniform int uMode; uniform float uSpeed;
uniform float uReveal; uniform float uFade; uniform vec4 uClip; uniform float uLanes;
uniform float uSplit; uniform float uSplitSide; uniform int uMode2; uniform vec2 uBlend; uniform float uFadeIn;
varying float vU; varying float vV;
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + 1e-10)), d / (q.x + 1e-10), q.x);
}
vec3 hsv2rgb(vec3 c) { vec3 p = abs(fract(c.xxx + vec3(1.0, 2.0 / 3.0, 1.0 / 3.0)) * 6.0 - 3.0); return c.z * mix(vec3(1.0), clamp(p - 1.0, 0.0, 1.0), c.y); }
void main() {
  if (vU > uReveal) discard;
  // a band carrying two flows side by side (before they divide): the share uSplit on the uSplitSide edge moves
  // with uMode2, the rest with uMode; a fine darker seam between them
  int mode = uMode;
  float seam = 1.0;
  if (uSplit > 0.0) {
    float edge = uSplitSide * vV, cut = 1.0 - 2.0 * uSplit;
    if (edge > cut) mode = uMode2;
    seam = 0.55 + 0.45 * smoothstep(0.0, 0.07, abs(edge - cut));
  }
  float u = vU;
  // hue the short way round at full saturation (an RGB mix of complementary colours goes grey half way); distant
  // hues change over a short stretch, so the band never sweeps through a rainbow
  vec3 ha = rgb2hsv(uA), hb = rgb2hsv(uB);
  float dh = hb.x - ha.x; dh -= floor(dh + 0.5);
  float bm = 0.5 * (uBlend.x + uBlend.y), bh = 0.5 * (uBlend.y - uBlend.x) * mix(1.0, 0.16, clamp(abs(dh) * 3.5, 0.0, 1.0));
  float bt = smoothstep(bm - bh, bm + bh, u);
  vec3 c = hsv2rgb(vec3(fract(ha.x + dh * bt), mix(ha.y, hb.y, bt), mix(ha.z, hb.z, bt)));
  float across = 1.0 - vV * vV;
  float body = 0.66 + 0.34 * across + 0.18 * smoothstep(0.82, 1.0, abs(vV));   // a fuller core, a crisp edge
  float s = u * uLen;
  float f = 1.0;
  if (mode == 0) {
    f = 0.82 + 0.18 * sin((s - uTime * uSpeed) * 0.35 + vV * 0.6);
    // a wide mechanical flow of air or water can be drawn as streamlines side by side
    if (uLanes > 1.5) { float lp = (vV * 0.5 + 0.5) * uLanes, lf = fract(lp); f *= 0.12 + 0.88 * smoothstep(0.08, 0.3, lf) * smoothstep(0.92, 0.7, lf); f *= 0.85 + 0.3 * step(0.5, fract((s - uTime * uSpeed) / 14.0 + floor(lp) * 0.41)); }
  }
  if (mode == 1) { float k = fract((s - uTime * uSpeed * 3.0) / 16.0); f = 0.6 + 1.1 * smoothstep(0.72, 0.96, k) * smoothstep(1.0, 0.96, k); }
  if (mode == 2) {
    // heating: a slow shimmer, with three wavy darker lines running along the band (the thermal store's pattern)
    f = 0.8 + 0.2 * sin((s - uTime * 6.4) * 0.2 + sin(s * 0.07 + uTime) + vV * 1.4);
    float w = (vV * 0.5 + 0.5) * 3.0 + 0.16 * sin(s * 0.42 - uTime * 2.2);
    float d = abs(fract(w) - 0.5);
    f *= 0.72 + 0.28 * smoothstep(0.32, 0.46, d);
  }
  if (mode == 3) {
    // radiation: straight rays of travelling dashes; a wide band is several rays side by side
    float lp = (vV * 0.5 + 0.5) * uLanes, lane = floor(lp), lf = fract(lp);
    float k = fract((s - uTime * 150.0 * 1.6) / (11.0 + 3.0 * fract(lane * 0.618)) + fract(lane * 0.618) * 3.7);
    f = 0.32 + 1.0 * step(0.36, k);
    if (uLanes > 1.5) f = mix(0.18, f, smoothstep(0.0, 0.22, lf) * smoothstep(1.0, 0.78, lf));
  }
  // the front of a flow that is still arriving glows a little brighter
  f *= 1.0 + 0.6 * smoothstep(uReveal - 0.04, uReveal, u) * step(uReveal, 0.999);
  // the far end can fade into the surroundings
  // fading ends blend away into the paper (never toward black)
  float alpha = (1.0 - uFade * smoothstep(0.5, 1.0, u)) * mix(1.0, smoothstep(0.0, 0.5, u), uFadeIn);
  // never darker than the store's own colour: a band going out narrows away (see the vertex shader) rather than
  // dimming toward black
  gl_FragColor = vec4(c * max(uGlow, 1.0) * body * f * seam, alpha);
}`,W={mechanical:0,electrical:1,heating:2,radiation:3},f=new s;new s;const m=new s,d=new s,U=new E;function ie(u,e=null){const t=e?e.clone().normalize():new s(0,1,0).lerp(new s(0,0,1),Math.min(1,Math.abs(u.y)*1.25)).normalize();return m.crossVectors(u,t),m.lengthSq()<1e-6&&m.crossVectors(u,new s(1,0,0)),m.normalize().clone()}class ne{constructor(e,{from:t,to:i=t,pathway:l="mechanical",segments:c=140,widthAt:v=()=>1,twistAt:q=()=>0,face:L=()=>null,taperIn:I=0,taperOut:O=0,fade:y=0,lanes:G=1,tension:N="centripetal",blend:_=[.12,.88],fadeIn:M=0,res:C=null,minPx:j=0}={}){this.curve=new D(e.map(r=>r.clone()),!1,N),this.len=this.curve.getLength(),this.pathway=l,this.power=0,this.mmPerW=.2,this.glow=0,this.on=!0,this.level=0;const p=c,S=[],V=[],T=[],A=[],k=[],z=[],R=[];let w=null;for(let r=0;r<=p;r++){const a=r/p,b=this.curve.getPointAt(a);this.curve.getTangentAt(a,f).normalize();let n=ie(f,L(a));w&&n.dot(w)<0&&n.negate(),w=n.clone();const P=q(a);P&&(U.setFromAxisAngle(f,P),n.applyQuaternion(U)),d.crossVectors(f,n).normalize();for(const K of[-1,1])S.push(b.x,b.y,b.z),V.push(n.x,n.y,n.z),T.push(d.x,d.y,d.z),A.push(K),k.push(a),z.push(v(a))}for(let r=0;r<p;r++){const a=r*2;R.push(a,a+2,a+1,a+1,a+2,a+3)}const o=new Q;o.setAttribute("position",new h(S,3)),o.setAttribute("aSide",new h(V,3)),o.setAttribute("aNrm",new h(T,3)),o.setAttribute("aV",new h(A,1)),o.setAttribute("aU",new h(k,1)),o.setAttribute("aW",new h(z,1)),o.setIndex(R),o.computeBoundingSphere(),o.boundingSphere.radius+=30,this.colFrom=new x(F[t].hex),this.colTo=new x(F[i].hex),this.uniforms={uA:{value:this.colFrom.clone()},uB:{value:this.colTo.clone()},uGlow:{value:0},uTime:{value:Math.random()*10},uLen:{value:this.len},uMode:{value:W[l]},uSpeed:{value:40},uWidth:{value:1},uTaperIn:{value:I},uTaperOut:{value:O},uReveal:{value:1.01},uFade:{value:y},uClip:{value:new H(0,0,0,-1)},uLanes:{value:G},uSplit:{value:0},uSplitSide:{value:1},uMode2:{value:0},uBlend:{value:new B(..._)},uFadeIn:{value:M},uRes:C??{value:new B(1600,900)},uMinPx:{value:j}};const g=y>0||M>0;this.mesh=new $(o,new J({uniforms:this.uniforms,vertexShader:te,fragmentShader:ae,side:X,transparent:g,depthWrite:!g})),g&&(this.mesh.renderOrder=4),this.mesh.frustumCulled=!1,this.group=new Y,this.group.add(this.mesh),this._c=new x}get glowObjects(){return[this.mesh]}carry(e,t,i){this.uniforms.uSplit.value=e,this.uniforms.uSplitSide.value=t,this.uniforms.uMode2.value=W[i]}endFrame(){const e=this.mesh.geometry,t=e.attributes.aSide.count;return{c:this.curve.getPointAt(1),t:this.curve.getTangentAt(1).normalize(),s:new s().fromBufferAttribute(e.attributes.aSide,t-1)}}setPower(e,t=this.mmPerW,i=0){this.power=Math.max(0,e),this.mmPerW=t,this.uniforms.uWidth.value=this.power>1e-9?Math.max(i,this.power*t):0}set reveal(e){this.uniforms.uReveal.value=e>=1?1.01:e}get reveal(){return this.uniforms.uReveal.value}pointAt(e,t=new s){return this.curve.getPointAt(e,t)}lightInfo(e=new s){return this.mesh.localToWorld(e.copy(this.curve.getPointAt(.5))),{pos:e,color:this._c.copy(this.uniforms.uA.value).lerp(this.uniforms.uB.value,.5),strength:this.glow*Math.min(1,.25+this.level)*Math.min(1,this.reveal)}}update(e,t,i=60,l=!1){l=l||Z.still;const c=t&&this.on&&this.power>1e-9;this.glow=l?c?1:0:this.glow+((c?1:0)-this.glow)*(1-Math.exp(-e*7)),this.level=Math.min(1,this.power/Math.max(1e-9,i)),this.group.visible=this.glow>.01;const v=this.pathway==="electrical"?120:this.pathway==="heating"?16:this.pathway==="radiation"?150:26+40*this.level;this.uniforms.uSpeed.value=v,this.uniforms.uTime.value+=ee()?0:e,this.uniforms.uGlow.value=1.5*this.glow}}const ue=(u,e,t)=>{const i=Math.min(1,Math.max(0,(t-u)/(e-u)));return i*i*(3-2*i)};export{ne as R,ue as r};
