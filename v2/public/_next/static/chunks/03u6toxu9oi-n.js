(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,35313,45729,e=>{"use strict";var t=e.i(32369),i=e.i(72497);let a={gloss:{roughness:.2,clearcoat:.55,coatRoughness:.08},satin:{roughness:.44,clearcoat:.12,coatRoughness:.3},matte:{roughness:.74,clearcoat:.02,coatRoughness:.6}};var r=e.i(71853),o=e.i(70628),n=e.i(14299);let s=`
varying vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,l=`
uniform float uOpacity;
varying vec2 vUv;

void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = (1.0 - smoothstep(0.12, 1.0, d)) * uOpacity;
    gl_FragColor = vec4(0.12, 0.09, 0.07, a);
}
`,h=(e,i,a)=>new t.Vector3(Math.sin(e)*i,a,Math.cos(e)*i);e.s(["createPieceModel",0,e=>{var c,u;let d,m,g,f,p=(0,n.buildPieceForm)(e.form),v=new t.Group,w=new t.Group;v.add(w);let M=new i.LatheBuilder(n.PIECE_PROFILE_COUNT,112);M.update(p.profile,p.modifier),(0,i.flipWinding)(M.geometry);let z=113*n.PIECE_PROFILE_COUNT,y=new Float32Array(z),x=n.N_OUTER+Math.floor(n.N_CAP/2);for(let e=0;e<z;e++)y[e]=+(Math.floor(e/113)>=x);M.geometry.setAttribute("aInner",new t.BufferAttribute(y,1)),M.geometry.computeBoundingSphere();let{material:C}=(d=a[(c={glaze:e.glazeColor,rim:e.rimColor,finish:e.finish,speckled:e.speckled,rimFrom:p.top-("cup"===p.name?.07:"bowl"===p.name?.045:.04),footTo:"plate"===p.name?.02:.035,height:p.top,innerGloss:"jug"===p.name}).finish]??a.satin,m=c.innerGloss?a.gloss:d,g={uGlaze:{value:new t.Color(c.glaze)},uRim:{value:new t.Color(c.rim??c.glaze)},uClay:{value:new t.Color("#9E7152")},uSpeckleColor:{value:new t.Color("#4A382B")},uSpeckle:{value:+!!c.speckled},uRimFrom:{value:c.rimFrom},uRimOn:{value:+!!c.rim},uFootTo:{value:c.footTo},uRings:{value:.16},uHeight:{value:Math.max(c.height,.1)},uBaseRough:{value:d.roughness},uInnerRough:{value:m.roughness},uCoat:{value:d.clearcoat},uInnerCoat:{value:m.clearcoat}},(f=new t.MeshPhysicalMaterial({color:0xffffff,roughness:d.roughness,metalness:0,clearcoat:1,clearcoatRoughness:d.coatRoughness,envMapIntensity:.38,side:t.DoubleSide})).onBeforeCompile=e=>{Object.assign(e.uniforms,g),e.vertexShader=e.vertexShader.replace("#include <common>","#include <common>\nattribute float aInner;\nvarying vec3 vGlazeObj;\nvarying float vInner;").replace("#include <begin_vertex>","#include <begin_vertex>\nvGlazeObj = position;\nvInner = aInner;"),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vGlazeObj;
varying float vInner;
uniform vec3 uGlaze;
uniform vec3 uRim;
uniform vec3 uClay;
uniform vec3 uSpeckleColor;
uniform float uSpeckle;
uniform float uRimFrom;
uniform float uRimOn;
uniform float uFootTo;
uniform float uRings;
uniform float uHeight;
uniform float uBaseRough;
uniform float uInnerRough;
uniform float uCoat;
uniform float uInnerCoat;

float glazeHash(vec3 p) {
    p = fract(p * 0.1031);
    p += dot(p, p.zyx + 31.32);
    return fract((p.x + p.y) * p.z);
}

float glazeNoise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
        mix(mix(glazeHash(i), glazeHash(i + vec3(1.0, 0.0, 0.0)), f.x), mix(glazeHash(i + vec3(0.0, 1.0, 0.0)), glazeHash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
        mix(mix(glazeHash(i + vec3(0.0, 0.0, 1.0)), glazeHash(i + vec3(1.0, 0.0, 1.0)), f.x), mix(glazeHash(i + vec3(0.0, 1.0, 1.0)), glazeHash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
        f.z
    );
}

float glazeDots(vec3 p, float scale, float density, float size) {
    vec3 cell = floor(p * scale);
    vec3 local = fract(p * scale);
    if (glazeHash(cell + 7.13) > density) return 0.0;
    vec3 center = vec3(glazeHash(cell + 17.1), glazeHash(cell + 41.7), glazeHash(cell + 73.3)) * 0.5 + 0.25;
    return 1.0 - smoothstep(size * 0.55, size, length(local - center));
}`).replace("#include <color_fragment>",`#include <color_fragment>
float gy = vGlazeObj.y;
float ringPhase = gy * 92.0 + 0.9 * sin(gy * 4.7 + 1.3) + 0.45 * sin(gy * 11.3 + 0.4);
float ringEnv = uRings * (0.62 + 0.38 * sin(gy * 6.1 + 0.7));
float groove = (0.5 - 0.5 * sin(ringPhase)) * ringEnv;
float mottle = glazeNoise(vGlazeObj * 3.1) * 0.6 + glazeNoise(vGlazeObj * 8.7) * 0.4;

// Glaze body: soft mottling, pooling deeper in the grooves and toward the base
vec3 glazeBody = uGlaze * (1.0 + (mottle - 0.5) * 0.16);
glazeBody *= 1.0 - groove * 0.55;
glazeBody *= mix(0.94, 1.0, smoothstep(0.0, uHeight * 0.35, gy));
float speck = uSpeckle * max(glazeDots(vGlazeObj, 27.0, 0.5, 0.14), glazeDots(vGlazeObj + 3.7, 63.0, 0.32, 0.18) * 0.85);
glazeBody = mix(glazeBody, uSpeckleColor, speck);

// Rim: glaze breaks into the rim colour with an uneven, hand-finished edge
float rimEdge = uRimFrom + (glazeNoise(vGlazeObj * 14.0) - 0.5) * 0.03;
float rimMask = uRimOn * smoothstep(rimEdge - 0.018, rimEdge + 0.018, gy);
vec3 glazed = mix(glazeBody, uRim * (0.92 + 0.16 * glazeNoise(vGlazeObj * 22.0)), rimMask);

// Bare foot ring on the outside
float footMask = (1.0 - smoothstep(uFootTo - 0.008, uFootTo + 0.008, gy)) * (1.0 - vInner);
vec3 bare = uClay * (0.88 + 0.22 * glazeNoise(vGlazeObj * 24.0));
diffuseColor.rgb = mix(glazed, bare, footMask);`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(uBaseRough, uInnerRough, vInner);
roughnessFactor = mix(roughnessFactor, max(roughnessFactor, 0.62), rimMask * 0.6);
roughnessFactor = mix(roughnessFactor, 0.86, footMask);
roughnessFactor += (mottle - 0.5) * 0.06;`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
{
    vec3 upView = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
    vec3 ringTangent = upView - dot(upView, normal) * normal;
    float ringLength = length(ringTangent);
    if (ringLength > 0.0001) {
        ringTangent /= ringLength;
        normal = normalize(normal - ringTangent * cos(ringPhase) * ringEnv * 0.5);
    }
}`).replace("#include <clearcoat_normal_fragment_begin>",`#include <clearcoat_normal_fragment_begin>
#ifdef USE_CLEARCOAT
clearcoatNormal = normalize(mix(clearcoatNormal, normal, 0.6));
#endif`).replace("#include <lights_physical_fragment>",`#include <lights_physical_fragment>
#ifdef USE_CLEARCOAT
material.clearcoat = mix(uCoat, uInnerCoat, vInner) * (1.0 - footMask) * (1.0 - rimMask * 0.7);
#endif`)},{material:f,uniforms:g}),R=new t.Mesh(M.geometry,C);w.add(R);let b=[R],S=null,E=null;if(p.handle){S=new t.CatmullRomCurve3(n.HANDLE_POINTS.map(([e,i,a])=>new t.Vector3(e,i,a))),(E=new t.TubeGeometry(S,64,.068,14,!1)).setAttribute("aInner",new t.BufferAttribute(new Float32Array(E.attributes.position.count),1));let e=new t.Mesh(E,C);w.add(e),b.push(e)}let O=new t.PlaneGeometry(1,1),G=new t.ShaderMaterial({vertexShader:s,fragmentShader:l,transparent:!0,depthWrite:!1,uniforms:{uOpacity:{value:.34}}}),_=new t.Mesh(O,G),P=p.radius;return _.rotation.x=-Math.PI/2,_.position.y=.003,_.scale.set(2.6*P,2.6*P,1),_.renderOrder=-1,v.add(_),{piece:e,form:p,root:v,spinner:w,height:p.height,radius:P,tilt:p.tilt,hotspots:(u=S,(r.HOTSPOTS[p.name]??[]).flatMap(e=>{let i=e.anchor;switch(i.kind){case"outer":{let a=i.at*p.top,r=i.angle*o.DEG,n=(p.radiusAt(a+.02)-p.radiusAt(a-.02))/.04,s=new t.Vector3(Math.sin(r),-n,Math.cos(r)).normalize();return[{spec:e,position:h(r,p.radiusAt(a)+.004,a),normal:s,angle:r}]}case"inner":{let a=Math.max(p.floor+.03,i.at*p.top),r=i.angle*o.DEG,n=Math.max(p.radiusAt(a)-p.wall-.004,.02),s=new t.Vector3(-Math.sin(r),.35,-Math.cos(r)).normalize();return[{spec:e,position:h(r,n,a),normal:s,angle:r}]}case"rim":{let a=i.angle*o.DEG,r=new t.Vector3(.45*Math.sin(a),.9,.45*Math.cos(a)).normalize();return[{spec:e,position:h(a,p.rimRadius,p.top+.4*p.wall),normal:r,angle:a}]}case"foot":{let a=i.angle*o.DEG,r=new t.Vector3(Math.sin(a),-.1,Math.cos(a)).normalize();return[{spec:e,position:h(a,p.radiusAt(.02)+.006,.02),normal:r,angle:a}]}case"floor":return[{spec:e,position:new t.Vector3(0,p.floor+.01,.25*p.rimRadius),normal:new t.Vector3(0,1,0),angle:null}];case"spout":{let i=p.top-.06;return[{spec:e,position:new t.Vector3(0,i,1.2*p.radiusAt(i)+.01),normal:new t.Vector3(0,.35,1).normalize(),angle:0}]}case"handle":{if(!u)return[];let a=u.getPoint(i.at);return a.z-=.07,[{spec:e,position:a,normal:new t.Vector3(0,.25,-1).normalize(),angle:Math.PI}]}default:return[]}})),setOpacity:e=>{let t=e>=.999;C.transparent=!t,C.opacity=t?1:Math.max(0,e),C.depthWrite=t||e>.5,G.uniforms.uOpacity.value=.34*Math.max(0,Math.min(1,e))},setCastShadow:e=>{for(let t of b)t.castShadow=e,t.receiveShadow=e},dispose:()=>{M.dispose(),C.dispose(),E?.dispose(),O.dispose(),G.dispose()}}},"framePiece",0,(e,i,a,r=0,n)=>{let s=(e.tilt+r)*o.DEG,l=Math.max((e.height*Math.cos(s)+2*e.radius*Math.sin(s))/a,2*e.radius/(1.05*a*Math.max(i,.2)))/2/Math.tan(10*o.DEG),h=n??{target:new t.Vector3,distance:0,elevation:0};return h.target.set(0,.46*e.height,0),h.distance=l,h.elevation=s,h},"placeCamera",0,(e,t,i)=>{let{target:a,distance:r,elevation:o}=t;e.fov=20,e.aspect=i,e.position.set(a.x,a.y+Math.sin(o)*r,a.z+Math.cos(o)*r),e.near=Math.max(.05,.2*r),e.far=4*r+20,e.lookAt(a),e.updateProjectionMatrix()},"presenceFor",0,e=>Math.min(.8,Math.max(.58,.48+.13*Math.max(e.height,2*e.radius)))],35313);var c=e.i(78424),u=e.i(77104);let d=[-3.2,5.2,4.2],m=new WeakMap;e.s(["configureRenderer",0,e=>{e.toneMapping=t.NeutralToneMapping,e.toneMappingExposure=1},"createStudioLights",0,(e=2.7)=>{let i=new t.Group,a=new t.DirectionalLight("#fff0dc",e);a.position.set(...d);let r=new t.HemisphereLight("#f6eee2","#b8946f",1.05),o=new t.DirectionalLight("#fff3e4",.9);return o.position.set(3.4,3,-4.6),i.add(a,a.target,r,o),{group:i,key:a}},"getStudioEnvironment",0,e=>{let t=m.get(e);if(t)return t;let i=new c.PMREMGenerator(e),a=new u.RoomEnvironment,r=i.fromScene(a,.04).texture;return a.dispose(),i.dispose(),m.set(e,r),r},"releaseStudioEnvironment",0,e=>{let t=m.get(e);t&&(t.dispose(),m.delete(e))}],45729)},68418,e=>{"use strict";var t=e.i(32369),i=e.i(78424),a=e.i(35313),r=e.i(45729);class o{renderer;canvas;scene=new t.Scene;camera=new t.PerspectiveCamera(20,1,.05,100);models=new Map;framing;views=[];hovered=null;width=1;height=1;ratio=1;disposed=!1;constructor(e,a=1.75){this.canvas=e,this.renderer=new i.WebGLRenderer({canvas:e,antialias:!0,alpha:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(0,0),this.renderer.autoClear=!1,(0,r.configureRenderer)(this.renderer),this.scene.environment=(0,r.getStudioEnvironment)(this.renderer),this.scene.add((0,r.createStudioLights)().group),this.framing={target:new t.Vector3,distance:1,elevation:0},this.ratio=Math.min(window.devicePixelRatio||1,a)}modelFor(e){let t=this.models.get(e.id);return t||((t=(0,a.createPieceModel)(e)).root.visible=!1,this.scene.add(t.root),this.models.set(e.id,t)),t}setEntries(e){if(this.disposed)return;let t=new Map(this.views.map(e=>[e.key,e])),i=new Set;for(let[r,o]of(this.views=e.map((e,r)=>{let o=this.modelFor(e.piece);i.add(e.piece.id);let n=t.get(e.key);return{key:e.key,pieceId:e.piece.id,element:e.element,clip:e.clip??null,fill:e.fill??(0,a.presenceFor)(o),dim:e.dim??0,angle:n?.angle??1.3*r+.6,speed:n?.speed??.32}}),this.models))i.has(r)||(this.scene.remove(o.root),o.dispose(),this.models.delete(r))}setHovered(e){this.hovered=e}resize(){if(this.disposed)return;let e=this.canvas.getBoundingClientRect(),t=Math.max(1,Math.round(e.width)),i=Math.max(1,Math.round(e.height));(t!==this.width||i!==this.height)&&(this.width=t,this.height=i,this.renderer.setPixelRatio(this.ratio),this.renderer.setSize(t,i,!1))}render(e,t){if(this.disposed)return;let i=this.renderer,a=this.canvas.getBoundingClientRect();for(let r of((Math.round(a.width)!==this.width||Math.round(a.height)!==this.height)&&this.resize(),i.setScissorTest(!1),i.clear(),i.setScissorTest(!0),this.views)){let i=t?r.key===this.hovered?1.9:.32:0;r.speed+=(i-r.speed)*(1-Math.exp(-(2.6*e))),r.angle+=r.speed*e,this.drawView(r,a)}}drawView(e,t){let i=this.models.get(e.pieceId);if(!i)return!1;let r=e.element.getBoundingClientRect();if(r.width<2||r.height<2)return!1;let o=Math.max(r.top,t.top),n=Math.min(r.bottom,t.bottom),s=Math.max(r.left,t.left),l=Math.min(r.right,t.right);if(e.clip){let t=e.clip.getBoundingClientRect();o=Math.max(o,t.top),n=Math.min(n,t.bottom),s=Math.max(s,t.left),l=Math.min(l,t.right)}if(l-s<1||n-o<1)return!1;let h=r.left-t.left,c=t.bottom-r.bottom;for(let e of this.models.values())e.root.visible=e===i;i.spinner.rotation.y=e.angle,i.setOpacity(1-e.dim);let u=r.width/r.height;return(0,a.framePiece)(i,u,e.fill,0,this.framing),(0,a.placeCamera)(this.camera,this.framing,u),this.renderer.setViewport(h,c,r.width,r.height),this.renderer.setScissor(s-t.left,t.bottom-n,l-s,n-o),this.renderer.render(this.scene,this.camera),!0}snapshot(e){if(this.disposed)return null;let t=this.views.find(t=>t.key===e);if(!t)return null;let i=this.canvas.getBoundingClientRect(),a=t.element.getBoundingClientRect();if(this.renderer.setScissorTest(!1),this.renderer.clear(),this.renderer.setScissorTest(!0),!this.drawView(t,i))return null;try{let e=document.createElement("canvas");e.width=160,e.height=160;let t=e.getContext("2d");if(!t)return null;let r=this.canvas.width/Math.max(i.width,1),o=Math.min(a.width,a.height),n=(a.left-i.left+(a.width-o)/2)*r,s=(a.top-i.top+(a.height-o)/2)*r;return t.drawImage(this.canvas,n,s,o*r,o*r,0,0,160,160),e.toDataURL("image/png")}catch{return null}}dispose(){if(!this.disposed){for(let e of(this.disposed=!0,this.models.values()))e.dispose();this.models.clear(),(0,r.releaseStudioEnvironment)(this.renderer),this.renderer.dispose(),this.renderer.forceContextLoss()}}}e.s(["PieceGallery",0,o])}]);