/* ============================================================
   MG TECH — cosmic welcome intro (scroll-driven)
   A dense duotone (cyan / red-orange) particle accretion disk
   swirls around a dark core (the MG lockup sits in the "eye").
   Additive blending gives a luminous, high-graphics galaxy look.
   Scrolling spins + tilts + recedes the disk — like pulling out
   of a star system — then the canvas fades for clean content.
   Progress is damped so it plays smoothly at any scroll speed.
   Vanilla canvas. Honors prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("fx");
  if (!canvas) return;
  var ctx = canvas.getContext("2d", { alpha: true });
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

  var CYAN = [90, 200, 255], RED = [255, 96, 60], WHITE = [255, 244, 235];
  var BG = [6, 8, 14];
  var TAU = Math.PI * 2;

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, minDim = 1;
  var parts = [], stars = [];
  var pointer = { x: 0, y: 0, px: 0, py: 0 };
  var introTarget = 0, introP = 0, scrollY = 0, vh = 0, introH = 0, t = 0;
  var rafId = null, running = false;

  function rgba(c, a) { return "rgba(" + (c[0] | 0) + "," + (c[1] | 0) + "," + (c[2] | 0) + "," + a + ")"; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function easeIO(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function build() {
    W = window.innerWidth; H = window.innerHeight; cx = W / 2; cy = H * 0.44;
    minDim = Math.min(W, H);
    var small = W < 760;
    var inner = minDim * 0.11, outer = minDim * 0.62;

    parts = [];
    var N = small ? 360 : 820;
    for (var i = 0; i < N; i++) {
      // bias density toward the inner edge (accretion glow)
      var rr = Math.pow(Math.random(), 1.7);
      var rad = inner + rr * (outer - inner);
      parts.push({
        rad: rad,
        ang: Math.random() * TAU,
        spd: (0.16 + 0.9 * (inner / rad)) * (Math.random() * 0.4 + 0.8), // faster inside
        sz: 0.6 + Math.random() * 1.5,
        fl: Math.random() * TAU, fs: 0.6 + Math.random() * 1.8,         // flicker
        jit: (Math.random() - 0.5) * minDim * 0.03,                      // radial scatter
      });
    }

    stars = [];
    var ns = small ? 90 : 150;
    for (var j = 0; j < ns; j++) {
      stars.push({ x: Math.random() * W, y: Math.random() * H, z: 0.15 + Math.random() * 0.85, r: Math.random() * 1.2 + 0.2, tw: Math.random() * TAU, ts: 0.6 + Math.random() * 1.3 });
    }
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build(); measure();
  }
  function measure() { vh = window.innerHeight; introH = intro ? intro.offsetHeight : vh; }

  function onScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    introTarget = clamp(scrollY / Math.max(1, introH - vh), 0, 1);
  }

  function updateIntroDOM() {
    if (!introInner) return;
    var e = easeIO(introP), settle = clamp(introP / 0.35, 0, 1);
    if (introLogo) { introLogo.style.opacity = "1"; introLogo.style.transform = "scale(" + lerp(0.92, 1.06, e) + ")"; }
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

  function frame() {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    t += 0.016;

    introP += (introTarget - introP) * 0.085;
    if (Math.abs(introTarget - introP) < 0.0004) introP = introTarget;
    updateIntroDOM();
    updateCanvasFade();

    pointer.px += (pointer.x - pointer.px) * 0.05;
    pointer.py += (pointer.y - pointer.py) * 0.05;
    var ox = (pointer.px - cx) * 0.025, oy = (pointer.py - cy) * 0.02;

    var e = easeIO(introP);
    var scale = lerp(1.12, 0.82, e);             // pull back as you scroll out
    var tilt = lerp(0.62, 0.34, e);              // disk flattens (more edge-on)
    var spin = t * 0.25 + e * 1.6;
    var hx = cx + ox, hy = cy + oy;
    var inner = minDim * 0.11 * scale;

    ctx.clearRect(0, 0, W, H);

    // ---- starfield ----
    var i, s;
    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      var tw = 0.4 + 0.6 * Math.abs(Math.sin(s.tw + t * s.ts));
      ctx.fillStyle = rgba(WHITE, tw * (0.16 + 0.4 * s.z));
      ctx.beginPath(); ctx.arc(s.x + ox * s.z * 2.5, s.y + oy * s.z * 2, s.r * (0.6 + s.z), 0, TAU); ctx.fill();
    }

    // ---- accretion disk (additive glow) ----
    ctx.globalCompositeOperation = "lighter";
    for (i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.ang += p.spd * 0.012 * (1 + e * 0.8);
      var rad = (p.rad + p.jit) * scale;
      var a = p.ang + spin;
      var ca = Math.cos(a), sa = Math.sin(a);
      var x = hx + ca * rad;
      var y = hy + sa * rad * tilt;
      var front = 0.5 + 0.5 * sa;                          // near edge brighter
      var side = (ca + 1) / 2;                             // 0 cyan .. 1 red
      var innerGlow = clamp(1 - (rad / (minDim * 0.62)), 0, 1); // hotter inside
      var col = mix(mix(CYAN, RED, side), WHITE, innerGlow * 0.6);
      var fl = 0.6 + 0.4 * Math.sin(p.fl + t * p.fs);
      var al = (0.10 + 0.5 * innerGlow) * (0.45 + 0.55 * front) * fl;
      ctx.fillStyle = rgba(col, clamp(al, 0, 0.9));
      ctx.beginPath(); ctx.arc(x, y, p.sz * (0.9 + innerGlow * 1.2), 0, TAU); ctx.fill();
    }

    // soft photon-ring glow at the inner edge
    var rg = ctx.createRadialGradient(hx, hy, inner * 0.7, hx, hy, inner * 1.7);
    rg.addColorStop(0, rgba(WHITE, 0.0));
    rg.addColorStop(0.5, rgba(mix(CYAN, RED, 0.5), 0.22 + 0.08 * Math.sin(t * 1.5)));
    rg.addColorStop(1, rgba(mix(CYAN, RED, 0.5), 0));
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hx, hy, inner * 1.7, 0, TAU); ctx.fill();

    // ---- dark core (the void where the logo sits) ----
    ctx.globalCompositeOperation = "source-over";
    var vg = ctx.createRadialGradient(hx, hy, 0, hx, hy, inner * 1.25);
    vg.addColorStop(0, rgba(BG, 1));
    vg.addColorStop(0.72, rgba(BG, 0.95));
    vg.addColorStop(1, rgba(BG, 0));
    ctx.fillStyle = vg; ctx.beginPath(); ctx.arc(hx, hy, inner * 1.25, 0, TAU); ctx.fill();
  }

  function start() { if (!running && !reduce) { running = true; rafId = requestAnimationFrame(frame); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  if (reduce) {
    resize();
    introP = 0; updateIntroDOM();
    for (var k = 0; k < stars.length; k++) { var st = stars[k]; ctx.fillStyle = rgba(WHITE, 0.4 * st.z); ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, TAU); ctx.fill(); }
    var g0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.4);
    g0.addColorStop(0, rgba(mix(CYAN, RED, 0.5), 0.14)); g0.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
    canvas.style.opacity = "0.6";
    return;
  }

  pointer.x = pointer.px = window.innerWidth / 2;
  pointer.y = pointer.py = window.innerHeight * 0.44;
  resize();
  onScroll();
  start();

  var rT;
  window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(resize, 200); });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", function (ev) { pointer.x = ev.clientX; pointer.y = ev.clientY; }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();
