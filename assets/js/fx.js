/* ============================================================
   MGCoat — WebGL cosmic welcome intro (scroll-driven)
   Thousands of GPU particles form a luminous duotone (cyan / red)
   accretion disk swirling around a dark core (the MG lockup sits
   in the eye), over a parallax starfield. Additive blending gives
   the film-grade glow. Scroll spins / tilts / pulls the disk back.
   Progress is damped for smooth playback at any scroll speed.
   Raw WebGL (no libraries). Honors prefers-reduced-motion, with a
   2-D canvas fallback if WebGL is unavailable.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("fx");
  if (!canvas) return;

  var intro = document.getElementById("intro");
  var introInner = document.querySelector(".intro-inner");
  var introLogo = document.querySelector(".intro-logo");
  var introTitle = document.querySelector(".intro-title");
  var introSub = document.querySelector(".intro-sub");
  var introTag = document.querySelector(".intro-tag");
  var introHint = document.querySelector(".intro-hint");
  var introProg = document.querySelector(".intro-progress i");

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function easeIO(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  var introTarget = 0, introP = 0, scrollY = 0, vh = 0, introH = 0;

  function measure() { vh = window.innerHeight; introH = intro ? intro.offsetHeight : vh; }
  function onScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    introTarget = clamp(scrollY / Math.max(1, introH - vh), 0, 1);
  }
  function updateIntroDOM() {
    if (!introInner) return;
    var e = easeIO(introP), settle = clamp(introP / 0.35, 0, 1);
    if (introLogo) { introLogo.style.opacity = "1"; introLogo.style.transform = "scale(" + lerp(0.92, 1.07, e) + ")"; }
    if (introTitle) { introTitle.style.opacity = "1"; introTitle.style.transform = "translateY(" + lerp(10, 0, settle) + "px)"; }
    if (introSub) introSub.style.opacity = "1";
    if (introTag) introTag.style.opacity = clamp((introP - 0.42) / 0.26, 0, 1);
    if (introProg) introProg.style.width = (introP * 100).toFixed(1) + "%";
    if (introHint) introHint.style.opacity = clamp(1 - introP / 0.3, 0, 1);
    var out = clamp((introP - 0.74) / 0.26, 0, 1);
    introInner.style.opacity = String(1 - out);
    introInner.style.transform = "translateY(" + (-out * 46) + "px) scale(" + (1 - out * 0.05) + ")";
  }
  function updateCanvasFade() {
    var k = clamp((scrollY - (introH + vh * 0.4)) / (vh * 1.1), 0, 1);
    canvas.style.opacity = String(lerp(1, 0.05, k));
  }

  // The intro is rendered with the universal Canvas-2D path on EVERY device so the
  // look is identical worldwide — Canvas 2D is supported on every browser/OS, while
  // WebGL is blocked or behaves differently on some (in-app browsers, locked-down
  // phones, certain GPUs). The baked dust disk below looks the same everywhere.
  var FORCE_2D = false;
  var gl = null;
  if (!FORCE_2D) {
    try {
      gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: true, depth: false })
        || canvas.getContext("experimental-webgl", { alpha: true, premultipliedAlpha: false });
    } catch (e) { gl = null; }
  }

  // ---------------- 2-D fallback (no WebGL) ----------------
  // Some in-app browsers (e.g. Instagram / Facebook webview) refuse a WebGL
  // context. Instead of a flat gradient we draw a real animated duotone
  // particle galaxy on a 2-D canvas so the intro always looks rich.
  if (!gl) {
    var c2 = canvas.getContext("2d");
    var DPR2 = Math.min(1.5, window.devicePixelRatio || 1);
    var W2 = 0, H2 = 0;

    // Bake a DENSE, fine dust disk ONCE (tens of thousands of tiny points → a smooth
    // luminous disk like the WebGL version) into an offscreen canvas. Per frame we
    // only move/scale this baked texture, so it stays fluid even on the weak phones
    // and in-app browsers that fall back here — drawing 70k points every frame on the
    // CPU would freeze them.
    var DUST = document.createElement("canvas"), DS = 680; DUST.width = DUST.height = DS;
    (function bakeDust() {
      var x = DUST.getContext("2d"); x.globalCompositeOperation = "lighter";
      var cx = DS / 2, cy = DS / 2, RR = DS * 0.47;
      // soft inner halo for depth (the luminous core of the disk)
      var hg = x.createRadialGradient(cx, cy, 0, cx, cy, RR * 0.9);
      hg.addColorStop(0, "rgba(150,196,255,0.10)"); hg.addColorStop(0.45, "rgba(120,160,230,0.06)"); hg.addColorStop(1, "rgba(120,160,230,0)");
      x.fillStyle = hg; x.fillRect(0, 0, DS, DS);
      var N = 90000;
      for (var i = 0; i < N; i++) {
        var rr = 0.12 + Math.pow(Math.random(), 0.72) * 0.88;          // radial spread, void in the centre
        var ang = Math.random() * 6.2831853;
        var px = cx + Math.cos(ang) * rr * RR, py = cy + Math.sin(ang) * rr * RR;
        var glow = 1 - (rr - 0.12) / 0.88;                              // brighter toward the inner disk
        x.globalAlpha = (0.09 + 0.20 * glow) * (0.4 + 0.6 * Math.random());   // visible fine grain
        x.fillStyle = Math.random() < 0.8 ? "rgba(160,200,255,1)" : "rgba(236,108,118,1)";
        var s = 0.6 + Math.random() * 0.9;
        x.fillRect(px - s / 2, py - s / 2, s, s);
      }
      x.globalAlpha = 1;
    })();

    var ST = [];   // a handful of live sparkles on top for motion
    for (var sj = 0; sj < 70; sj++) ST.push({ rad: 0.15 + Math.random() * 0.82, base: Math.random() * 6.2831853, spd: 0.1 + Math.random() * 0.5, s: Math.random() });

    function fbResize() {
      W2 = canvas.width = Math.floor(window.innerWidth * DPR2);
      H2 = canvas.height = Math.floor(window.innerHeight * DPR2);
      canvas.style.width = window.innerWidth + "px"; canvas.style.height = window.innerHeight + "px";
      measure();
    }
    function fbCenter() {
      var cx = W2 * 0.5, cy = H2 * 0.42;
      if (introLogo) { var r = introLogo.getBoundingClientRect(); if (r.width) { cx = (r.left + r.width / 2) * DPR2; cy = (r.top + r.height / 2) * DPR2; } }
      return [cx, cy];
    }
    var ft0 = performance.now();
    function fbFrame(drawOnly) {
      var sy = window.pageYOffset || document.documentElement.scrollTop || 0;
      var e = clamp(sy / Math.max(1, introH - vh), 0, 1);
      introP = e; updateIntroDOM(); scrollY = sy; updateCanvasFade();
      if (!drawOnly && sy > introH + vh) return;
      var t = (performance.now() - ft0) / 1000;
      var ctr = fbCenter(), cx = ctr[0], cy = ctr[1];
      var baseR = Math.min(W2, H2) * 0.52, grow = 1 + e * 1.25, fade = 1 - e * 0.78;
      c2.clearRect(0, 0, W2, H2);
      c2.globalCompositeOperation = "lighter";
      // two gently drifting layers of the baked dust (vertical squash → disk) for depth & life
      function layer(scale, rot, dy, alpha) {
        var dw = baseR * 2 * scale * grow, dh = dw * 0.6;
        c2.save(); c2.translate(cx, cy + dy); c2.rotate(rot);
        c2.globalAlpha = alpha * fade; c2.drawImage(DUST, -dw / 2, -dh / 2, dw, dh);
        c2.restore();
      }
      layer(1.00, Math.sin(t * 0.05) * 0.05, Math.sin(t * 0.3) * 4 * DPR2, 0.9);
      layer(1.07, -Math.sin(t * 0.04) * 0.045, -Math.sin(t * 0.24) * 4 * DPR2, 0.5);
      // live sparkles
      for (var s = 0; s < ST.length; s++) {
        var p = ST[s], ang = p.base + t * p.spd + e * 1.4;
        var rx = cx + Math.cos(ang) * p.rad * baseR, ry = cy + Math.sin(ang) * p.rad * baseR * 0.6;
        var tw = 0.4 + 0.6 * Math.sin(t * 2 + p.s * 6.2831853);
        c2.globalAlpha = (0.10 + 0.26 * p.s) * tw * fade;
        c2.fillStyle = "rgba(220,235,255,1)";
        var z = (0.6 + p.s * 1.5) * DPR2;
        c2.beginPath(); c2.arc(rx, ry, z, 0, 6.2831853); c2.fill();
      }
      c2.globalAlpha = 1; c2.globalCompositeOperation = "source-over";
    }
    var fbRun = false;
    function fbLoop() { if (!fbRun) return; requestAnimationFrame(fbLoop); fbFrame(false); }
    fbResize();
    window.addEventListener("resize", function () { fbResize(); fbFrame(true); });
    window.addEventListener("load", function () { fbResize(); fbFrame(true); });
    if (reduce) { fbFrame(true); canvas.style.opacity = "0.8"; }
    else { fbRun = true; requestAnimationFrame(fbLoop);
      document.addEventListener("visibilitychange", function () { fbRun = !document.hidden; if (fbRun) requestAnimationFrame(fbLoop); }); }
    return;
  }

  // ---------------- shaders ----------------
  var VS = [
    "precision highp float;",
    "attribute float aType;",   // 0 disk, 1 star
    "attribute float aSeed;",
    "attribute float aR1;",      // radius rand
    "attribute float aR2;",      // angle rand
    "attribute float aR3;",      // misc
    "uniform float uTime;",
    "uniform float uScroll;",
    "uniform vec2 uRes;",
    "uniform vec2 uPtr;",
    "uniform vec2 uCenter;",
    "varying vec3 vColor;",
    "varying float vAlpha;",
    "const float TAU=6.2831853;",
    "void main(){",
    "  float e=uScroll;",
    "  float aspect=uRes.x/uRes.y;",
    "  if(aType>0.5){",            // STAR
    "    float sx=aR1*2.0-1.0;",
    "    float sy=aR2*2.0-1.0;",
    "    sx+=uPtr.x*0.04*(0.3+aR3);",
    "    sy+=uPtr.y*0.03*(0.3+aR3);",
    "    gl_Position=vec4(sx,sy,0.0,1.0);",
    "    float tw=0.5+0.5*sin(uTime*1.5+aSeed*TAU);",
    "    vAlpha=(0.10+0.35*aR3)*tw;",
    "    vColor=vec3(0.85,0.92,1.0);",
    "    gl_PointSize=(1.0+aR3*1.6)*(uRes.y/900.0);",
    "    return;",
    "  }",
    "  vec2 center=uCenter;",
    "  float rec=smoothstep(0.0,0.78,e);",
    "  float bloom=smoothstep(0.8,1.0,e);",
    "  float inner=0.17, outer=0.98;",
    "  float rad=mix(inner,outer,pow(aR1,0.7));",
    "  float spd=0.16+0.8*(inner/rad);",
    "  float ang=aR2*TAU+rad*2.6+uTime*spd+e*1.6+bloom*2.4;",
    "  float thick=(aR3-0.5)*0.05;",
    "  float x=cos(ang)*rad;",
    "  float z=sin(ang)*rad;",
    "  float scale=mix(1.06,0.52,rec)*(1.0+bloom*5.0);",
    "  scale*=1.0+clamp(aspect-0.72,0.0,1.2)*0.62;",
    "  float tilt=mix(0.62,0.30,rec);",
    "  float xs=x*scale;",
    "  float ys=(z*tilt+thick)*scale;",
    "  float depth=(z+1.0)*0.5;",
    "  vec2 pos=center+vec2(xs/aspect,ys)+uPtr*0.02;",
    "  gl_Position=vec4(pos,0.0,1.0);",
    "  float innerGlow=clamp(1.0-(rad-inner)/(outer-inner),0.0,1.0);",
    "  innerGlow=pow(innerGlow,1.3);",
    "  gl_PointSize=(1.1+depth*2.3+innerGlow*3.4)*(uRes.y/900.0);",
    "  float side=(cos(ang)+1.0)*0.5;",
    "  vec3 cyan=vec3(0.30,0.74,1.0);",
    "  vec3 red=vec3(1.0,0.32,0.22);",
    "  vec3 col=mix(cyan,red,side);",
    "  col=mix(col,vec3(0.90,0.96,1.0),innerGlow*0.55);",
    "  vColor=col;",
    "  float flick=0.65+0.35*sin(uTime*2.0+aSeed*TAU*3.0);",
    "  float below=smoothstep(center.y-0.32,center.y-0.05,pos.y);",
    "  vAlpha=(0.34+0.55*innerGlow)*(0.55+0.45*depth)*flick*(0.78+0.22*e)*mix(0.45,1.0,below)*(1.0-bloom*0.92);",
    "}"
  ].join("\n");

  var FS = [
    "precision mediump float;",
    "varying vec3 vColor;",
    "varying float vAlpha;",
    "void main(){",
    "  vec2 d=gl_PointCoord-0.5;",
    "  float r=length(d);",
    "  float core=smoothstep(0.5,0.0,r);",       // soft glassy falloff
    "  float spec=pow(core,6.0);",                // tight crystalline highlight
    "  vec3 col=vColor+vec3(0.80,0.90,1.0)*spec*0.7;", // icy white-hot centre
    "  gl_FragColor=vec4(col,core*vAlpha);",
    "}"
  ].join("\n");

  function sh(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); }
    return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // ---------------- particle buffer ----------------
  var DISK = window.innerWidth < 760 ? 70000 : 200000;
  var STAR = window.innerWidth < 760 ? 1500 : 3000;
  var N = DISK + STAR;
  var data = new Float32Array(N * 5); // type, seed, r1, r2, r3
  for (var i = 0; i < N; i++) {
    var o = i * 5;
    data[o] = i < DISK ? 0 : 1;
    data[o + 1] = Math.random();
    data[o + 2] = Math.random();
    data[o + 3] = Math.random();
    data[o + 4] = Math.random();
  }
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  var stride = 5 * 4;
  ["aType", "aSeed", "aR1", "aR2", "aR3"].forEach(function (name, k) {
    var loc = gl.getAttribLocation(prog, name);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 1, gl.FLOAT, false, stride, k * 4);
  });

  var uTime = gl.getUniformLocation(prog, "uTime");
  var uScroll = gl.getUniformLocation(prog, "uScroll");
  var uRes = gl.getUniformLocation(prog, "uRes");
  var uPtr = gl.getUniformLocation(prog, "uPtr");
  var uCenter = gl.getUniformLocation(prog, "uCenter");

  // clip-space centre of the disk = centre of the logo (the void)
  var centerX = 0, centerY = 0.12;
  function calcCenter() {
    if (!introLogo) return;
    var r = introLogo.getBoundingClientRect();
    if (!r.width) return;
    var px = r.left + r.width / 2, py = r.top + r.height / 2;
    centerX = (px / window.innerWidth) * 2 - 1;
    centerY = -((py / window.innerHeight) * 2 - 1);
  }

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);   // additive

  var DPR = 1, ptr = { x: 0, y: 0, px: 0, py: 0 };
  function resize() {
    DPR = Math.min(1.5, window.devicePixelRatio || 1);
    canvas.width = Math.floor(window.innerWidth * DPR);
    canvas.height = Math.floor(window.innerHeight * DPR);
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    gl.viewport(0, 0, canvas.width, canvas.height);
    measure();
    calcCenter();
  }

  var t0 = performance.now(), running = false, rafId = null;
  function render() {
    if (!running) return;
    rafId = requestAnimationFrame(render);
    var t = (performance.now() - t0) / 1000;

    introP += (introTarget - introP) * 0.16;
    if (Math.abs(introTarget - introP) < 0.0004) introP = introTarget;
    updateIntroDOM();
    updateCanvasFade();

    // Once scrolled past the intro the canvas is faded out — stop the heavy
    // particle draw so reading content stays perfectly smooth (no jank).
    if (scrollY > introH + vh * 1.35) return;

    ptr.px += (ptr.x - ptr.px) * 0.05; ptr.py += (ptr.y - ptr.py) * 0.05;
    calcCenter();   // keep the disk locked on the logo even if it lays out late

    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, t);
    gl.uniform1f(uScroll, introP);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform2f(uPtr, ptr.px, ptr.py);
    gl.uniform2f(uCenter, centerX, centerY);
    gl.drawArrays(gl.POINTS, 0, N);
  }
  function start() { if (!running && !reduce) { running = true; rafId = requestAnimationFrame(render); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  resize();
  onScroll();
  updateIntroDOM();

  if (reduce) {
    // single static frame
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, 2.0); gl.uniform1f(uScroll, 0.0);
    gl.uniform2f(uRes, canvas.width, canvas.height); gl.uniform2f(uPtr, 0, 0); gl.uniform2f(uCenter, centerX, centerY);
    gl.drawArrays(gl.POINTS, 0, N);
    canvas.style.opacity = "0.7";
  } else {
    start();
  }

  var rT;
  window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(resize, 200); });
  // Re-measure once images/fonts settle so the disk centres on the final logo box.
  window.addEventListener("load", function () { resize(); onScroll(); });
  // Recover gracefully if the (in-app) browser drops the GL context.
  canvas.addEventListener("webglcontextlost", function (ev) { ev.preventDefault(); stop(); }, false);
  canvas.addEventListener("webglcontextrestored", function () { resize(); start(); }, false);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", function (ev) {
    ptr.x = (ev.clientX / window.innerWidth) * 2 - 1;
    ptr.y = -((ev.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();
