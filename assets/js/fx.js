/* ============================================================
   MG TECH — cosmic welcome intro (scroll-driven)
   A duotone (brand red / cyan) particle galaxy swirls around the
   MG core over a deep starfield. Scrolling tilts and expands the
   disk and lifts a glowing ring/crescent — like emerging from a
   star system — then the canvas fades so content stays clean.
   Progress is smoothed (damped) so it plays naturally at any
   scroll speed. Vanilla canvas. Honors prefers-reduced-motion.
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

  var RED = [255, 70, 86], CYAN = [86, 214, 240], WHITE = [240, 246, 255];

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, minDim = 1;
  var stars = [], disk = [];
  var pointer = { x: 0, y: 0, px: 0, py: 0 };
  var introTarget = 0, introP = 0, scrollY = 0, vh = 0, introH = 0, t = 0;
  var rafId = null, running = false;

  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function easeIO(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function counts() {
    var small = window.innerWidth < 760;
    return { stars: small ? 90 : 170, disk: small ? 120 : 220 };
  }

  function build() {
    W = window.innerWidth; H = window.innerHeight; cx = W / 2; cy = H * 0.46;
    minDim = Math.min(W, H);
    var c = counts(), i;

    stars = [];
    for (i = 0; i < c.stars; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        z: 0.15 + Math.random() * 0.85,
        r: Math.random() * 1.3 + 0.2,
        tw: Math.random() * 6.28, ts: 0.6 + Math.random() * 1.4,
      });
    }

    disk = [];
    for (i = 0; i < c.disk; i++) {
      var rr = Math.pow(Math.random(), 0.65);              // denser toward the ring
      var rad = (0.06 + rr * 0.46) * minDim;
      var z = 0.35 + Math.random() * 0.65;
      disk.push({
        ang: Math.random() * 6.28,
        rad: rad,
        z: z,
        spd: (0.0012 + 0.0042 * (1 - rad / (0.52 * minDim))) * (0.6 + 0.4 * z),
        sz: (0.8 + Math.random() * 1.5) * z,
        tw: Math.random() * 6.28, ts: 0.8 + Math.random() * 1.6,
      });
    }
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = window.innerWidth * DPR;
    canvas.height = window.innerHeight * DPR;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    build();
    measure();
  }
  function measure() { vh = window.innerHeight; introH = intro ? intro.offsetHeight : vh; }

  function onScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    introTarget = clamp(scrollY / Math.max(1, introH - vh), 0, 1);
  }

  function updateIntroDOM() {
    if (!introInner) return;
    var e = easeIO(introP), settle = clamp(introP / 0.35, 0, 1);
    if (introLogo) { introLogo.style.opacity = "1"; introLogo.style.transform = "scale(" + lerp(0.9, 1.08, e) + ")"; }
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

    // smoothed progress -> natural playback at any scroll speed
    introP += (introTarget - introP) * 0.085;
    if (Math.abs(introTarget - introP) < 0.0005) introP = introTarget;
    updateIntroDOM();
    updateCanvasFade();

    // gentle pointer parallax
    pointer.px += (pointer.x - pointer.px) * 0.05;
    pointer.py += (pointer.y - pointer.py) * 0.05;
    var ox = (pointer.px - cx) * 0.02, oy = (pointer.py - cy) * 0.02;

    var e = easeIO(introP);
    var expand = lerp(1, 1.5, e);
    var tilt = lerp(0.92, 0.34, e);          // flatten the disk as we pull out
    var dcx = cx + ox, dcy = cy + oy - e * H * 0.04;

    ctx.clearRect(0, 0, W, H);

    // ---- starfield (parallax with progress) ----
    var i, s, a;
    var drift = t * 6;
    for (i = 0; i < stars.length; i++) {
      s = stars[i];
      var sx = s.x + (ox * 3 + e * 40) * s.z;
      var sy = s.y + (oy * 3) * s.z + (drift * s.z * 0.0);
      var tw = 0.45 + 0.55 * Math.abs(Math.sin(s.tw + t * s.ts));
      ctx.fillStyle = rgba(WHITE, tw * (0.25 + 0.6 * s.z));
      ctx.beginPath(); ctx.arc(sx, sy, s.r * (0.6 + s.z), 0, 6.2832); ctx.fill();
    }

    // ---- bright core (the gravitational centre) ----
    var coreR = minDim * lerp(0.10, 0.20, e);
    var cg = ctx.createRadialGradient(dcx, dcy, 0, dcx, dcy, coreR);
    var coreCol = mix(WHITE, mix(CYAN, RED, 0.5), 0.35);
    cg.addColorStop(0, rgba(coreCol, 0.55 + 0.25 * Math.sin(t * 1.2)));
    cg.addColorStop(0.4, rgba(mix(CYAN, RED, 0.5), 0.16));
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg; ctx.beginPath(); ctx.arc(dcx, dcy, coreR, 0, 6.2832); ctx.fill();

    // ---- duotone particle galaxy ----
    for (i = 0; i < disk.length; i++) {
      var d = disk[i];
      d.ang += d.spd;
      var rad = d.rad * expand;
      var ca = Math.cos(d.ang), sa = Math.sin(d.ang);
      var x = dcx + ca * rad;
      var y = dcy + sa * rad * tilt;
      var side = (ca + 1) / 2;                         // 0 = cyan, 1 = red
      var col = mix(CYAN, RED, side);
      var front = 0.55 + 0.45 * sa;                    // brighter on the near edge
      var tw = 0.5 + 0.5 * Math.sin(d.tw + t * d.ts);
      var alpha = (0.18 + 0.5 * tw) * d.z * front * (0.6 + 0.4 * e);
      ctx.fillStyle = rgba(col, clamp(alpha, 0, 0.9));
      ctx.beginPath(); ctx.arc(x, y, d.sz * (0.9 + 0.3 * tw), 0, 6.2832); ctx.fill();
    }

    // ---- glowing ring / crescent (reveals as we pull out) ----
    var ringA = e * 0.5;
    if (ringA > 0.01) {
      var rr = 0.46 * minDim * expand;
      ctx.lineWidth = 2;
      ctx.save();
      ctx.shadowBlur = 18;
      for (var h = 0; h < 2; h++) {
        var c2 = h === 0 ? CYAN : RED;
        ctx.strokeStyle = rgba(c2, ringA);
        ctx.shadowColor = rgba(c2, ringA);
        ctx.beginPath();
        ctx.ellipse(dcx, dcy, rr, rr * tilt, 0, h ? -1.0 : 2.14, h ? 2.14 : 5.28);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function start() { if (!running && !reduce) { running = true; rafId = requestAnimationFrame(frame); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  // ---- reduced motion: a calm static cosmos ----
  if (reduce) {
    resize();
    introP = 0; updateIntroDOM();
    for (var k = 0; k < stars.length; k++) {
      var st = stars[k];
      ctx.fillStyle = rgba(WHITE, 0.4 * st.z);
      ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, 6.2832); ctx.fill();
    }
    var g0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.4);
    g0.addColorStop(0, rgba(mix(CYAN, RED, 0.5), 0.12)); g0.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
    canvas.style.opacity = "0.6";
    return;
  }

  pointer.x = pointer.px = window.innerWidth / 2;
  pointer.y = pointer.py = window.innerHeight * 0.46;
  resize();
  onScroll();
  start();

  var rT;
  window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(resize, 200); });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", function (ev) { pointer.x = ev.clientX; pointer.y = ev.clientY; }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();
