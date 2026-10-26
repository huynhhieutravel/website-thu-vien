(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,45391,e=>{"use strict";var o=e.i(32369),t=e.i(78424),i=e.i(74795);let r=`
varying vec3 vWorld;
varying vec3 vNormalWorld;
varying float vDepth;

void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    vec4 mvPosition = viewMatrix * world;
    vDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}
`,a=`
uniform float uTime;
uniform float uScan;
uniform float uReveal;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uFog;
uniform vec3 uLow;
uniform vec3 uHigh;
uniform vec3 uLine;
uniform vec3 uGlow;

varying vec3 vWorld;
varying vec3 vNormalWorld;
varying float vDepth;

float contour(float value, float width) {
    float fw = max(fwidth(value), 1e-4);
    float d = abs(fract(value - 0.5) - 0.5);

    return 1.0 - smoothstep(fw * (width - 0.5), fw * (width + 0.5), d);
}

void main() {
    vec3 n = normalize(vNormalWorld);
    vec3 light = normalize(vec3(-0.55, 0.78, 0.32));
    float diffuse = clamp(dot(n, light), 0.0, 1.0);
    float slope = 1.0 - clamp(n.y, 0.0, 1.0);
    float h = vWorld.y;

    vec3 color = mix(uLow, uHigh, 0.22 + 0.78 * diffuse);
    color = mix(color, color * 0.9, slope * 0.45);
    color = mix(color, vec3(0.975, 0.985, 0.99), smoothstep(5.0, 13.0, h) * 0.45 * diffuse);

    float minor = contour(h / 0.5, 1.0);
    float major = contour(h / 2.5, 1.7);
    float halo = contour(h / 0.5, 5.0);

    float shimmer = 0.55 + 0.45 * sin(h * 1.9 - uTime * 1.5 + sin(vWorld.x * 0.19 + uTime * 0.37) * 2.4);
    float pulse = 0.78 + 0.22 * sin(uTime * 0.85);
    float sweep = exp(-pow((vWorld.x - uScan) / 3.4, 2.0));
    float trail = exp(-max(0.0, uScan - vWorld.x) / 14.0) * step(vWorld.x, uScan);

    float lines = (minor * 0.5 + major * 0.95) * (0.42 + 0.58 * shimmer) * pulse;
    lines += (minor + major) * (sweep * 0.9 + trail * 0.25);
    lines *= uReveal;

    color = mix(color, uGlow, halo * 0.2 * (0.35 + 0.65 * shimmer) * uReveal);
    color = mix(color, uLine, clamp(lines, 0.0, 1.0));
    color += uGlow * sweep * 0.1 * uReveal;

    vec2 grid = fract(vWorld.xz * 1.5) - 0.5;
    float dots = 1.0 - smoothstep(0.03, 0.065, length(grid));
    float near = 1.0 - smoothstep(10.0, 34.0, vDepth);

    color = mix(color, uLine * 0.85, dots * 0.2 * near * uReveal);

    float fog = smoothstep(uFogNear, uFogFar, vDepth);

    color = mix(color, uFog, fog);

    gl_FragColor = vec4(color, 1.0);

    #include <colorspace_fragment>
}
`,s=(e,o,t)=>{let i=Math.min(1,Math.max(0,(t-e)/(o-e)));return i*i*(3-2*i)};class l{renderer;scene=new o.Scene;material;geometry;width=0;height=0;projected=new o.Vector3;lookTarget=new o.Vector3;lookDirection=new o.Vector3;rightAxis=new o.Vector3;upAxis=new o.Vector3(0,1,0);camera;peaks=[];constructor(e){this.renderer=new t.WebGLRenderer({canvas:e,alpha:!0,antialias:!0,powerPreference:"high-performance"}),this.renderer.setClearColor(0,0),this.renderer.outputColorSpace=o.SRGBColorSpace,this.camera=new o.PerspectiveCamera(38,1,.5,220);const l=(0,i.createNoise2D)(5),n=(e,o)=>{let t=o-(-9+6*Math.sin(.055*e)+2.4*Math.sin(.13*e+1.3)),r=Math.exp(-(t*t)/200),a=(0,i.ridged)(l,.042*e+10,.042*o-4,6);return 14*Math.pow(a,1.5)*(.28+.72*r)+3.4*(.5*(0,i.fbm)(l,.02*e-7,.02*o+3,4)+.5)-2.6*s(4,34,o)+s(-24,-48,o)*a*6-1.2};this.geometry=new o.PlaneGeometry(112,112,256,256),this.geometry.rotateX(-Math.PI/2),this.geometry.translate(0,0,-8);const h=this.geometry.attributes.position;for(let e=0;e<h.count;e++)h.setY(e,n(h.getX(e),h.getZ(e)));this.geometry.computeVertexNormals();const c=[];for(let e=2;e<255;e+=2)for(let t=2;t<255;t+=2){const i=257*e+t,r=h.getX(i),a=h.getY(i),s=h.getZ(i);if(Math.abs(r)>24||s<-20||s>2)continue;let l=!0;for(let o=-4;o<=4&&l;o++)for(let r=-4;r<=4;r++){const s=(e+o)*257+(t+r);if(!(s<0)&&!(s>=h.count)&&s!==i&&h.getY(s)>a){l=!1;break}}l&&c.push(new o.Vector3(r,a,s))}for(const e of(c.sort((e,o)=>o.y-e.y),c)){if(this.peaks.length>=4)break;this.peaks.some(o=>10>o.position.distanceTo(e))||this.peaks.push({position:e})}const m=[[-12,-8],[-2,-12],[8,-6],[17,-10]];for(;this.peaks.length<4;){const[e,t]=m[this.peaks.length];this.peaks.push({position:new o.Vector3(e,n(e,t),t)})}this.peaks.sort((e,o)=>e.position.x-o.position.x),this.material=new o.ShaderMaterial({vertexShader:r,fragmentShader:a,uniforms:{uTime:{value:0},uScan:{value:-40},uReveal:{value:0},uFogNear:{value:26},uFogFar:{value:96},uFog:{value:new o.Color("#e2eef2")},uLow:{value:new o.Color("#a9b9c1")},uHigh:{value:new o.Color("#eef3f5")},uLine:{value:new o.Color("#b4f2fb")},uGlow:{value:new o.Color("#8fe3f0")}},toneMapped:!1}),this.scene.add(new o.Mesh(this.geometry,this.material))}resize(e,o){if(e===this.width&&o===this.height)return;this.width=e,this.height=o;let t=Math.min(window.devicePixelRatio||1,1.5);this.renderer.setPixelRatio(t),this.renderer.setSize(e,o,!1),this.camera.aspect=e/Math.max(1,o),this.camera.updateProjectionMatrix()}render(e){let o=-(Math.cos(Math.PI*Math.min(1,Math.max(0,e.progress)))-1)/2,t=.5*Math.sin(.12*e.time);this.camera.position.set(-17+29*o+t+.8*e.mouseX,15.5-6.5*o+.25*Math.sin(.17*e.time)-.5*e.mouseY,42-27*o),this.lookTarget.set(-5+13*o+.4*e.mouseX,3.2+.8*o,-4-6*o);let i=(e.yaw??0)*Math.PI/180,r=(e.pitch??0)*Math.PI/180,a=e.dolly??0,s=e.lift??0;if(0!==i||0!==r||0!==a||0!==s){this.lookDirection.subVectors(this.lookTarget,this.camera.position);let e=this.lookDirection.length();this.lookDirection.normalize().applyAxisAngle(this.upAxis,-i),this.rightAxis.crossVectors(this.lookDirection,this.upAxis).normalize(),this.lookDirection.applyAxisAngle(this.rightAxis,r),this.camera.position.addScaledVector(this.lookDirection,a),this.camera.position.y=Math.max(this.camera.position.y+s,4.5),this.lookTarget.copy(this.camera.position).addScaledVector(this.lookDirection,e)}this.camera.lookAt(this.lookTarget);let l=this.material.uniforms;l.uTime.value=e.time,l.uScan.value=6.5*e.time%96-48,l.uReveal.value=e.reveal,l.uFogNear.value=24-8*o,l.uFogFar.value=98-22*o,this.renderer.render(this.scene,this.camera)}project(e){return this.projected.copy(e).project(this.camera),{x:(.5*this.projected.x+.5)*this.width,y:(-(.5*this.projected.y)+.5)*this.height,visible:this.projected.z<1&&this.projected.z>-1}}dispose(){this.geometry.dispose(),this.material.dispose(),this.renderer.dispose()}}e.s(["TerrainScene",0,l])}]);