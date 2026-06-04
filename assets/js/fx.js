/* ============================================================
   MG TECH — welcome intro: a living double-helix (scroll-driven)
   A 3-D rotating particle double-helix (brand cyan / red) is the
   hero "living shape". Scrolling spins it faster, widens it and
   lets it bloom outward, then the canvas fades for clean content.
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

  var RED = [255, 72, 88], CYAN = [84, 214, 240], WHITE = [240, 246, 255];
  var TAU = Math.PI * 2;

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0, minDim = 1;
  var stars = [], NPER = 64, TWISTS = 3;
  var pointer = { x: 0, y: 0, px: 0, py: 0 };
  var introTarget = 0, introP = 0, scrollY = 0, vh = 0, introH = 0, t = 0;
  var rafId = null, running = false;

  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, k) { return a + (b - a) * k; }
  function mix(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function easeIO(x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; }

  function build() {
    W = window.innerWidth; H = window.innerHeight; cx = W / 2; cy = H * 0.5;
    minDim = Math.min(W, H);
    var small = W < 760;
    NPER = small ? 46 : 66;                 // particles per strand
    var ns = small ? 70 : 130;
    stars = [];
    for (var i = 0; i < ns; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        z: 0.15 + Math.random() * 0.85, r: Math.random() * 1.2 + 0.2,
        tw: Math.random() * TAU, ts: 0.6 + Math.random() * 1.3,
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

  // brightness multiplier near the vertical text band (keeps the lockup readable)
  function bandFade(u) {
    var d = Math.abs(u - 0.5);
    return d < 0.14 ? 0.12 : d < 0.24 ? lerp(0.12, 1, (d - 0.14) / 0.1) : 1;
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
    var ox = (pointer.px - cx) * 0.03;

    var e = easeIO(introP);
    var R = minDim * 0.13 * lerp(1, 1.9, e);     // helix radius (blooms on scroll)
    var Hh = H * 0.66 * lerp(1, 1.12, e);         // helix height
    var focal = R * 3.4 + 220;
    var phase = t * 0.55 + e * 2.2;               // spins faster as you scroll
    var bloom = 0.55 + 0.45 * e;
    var hx = cx + ox, hy = cy;

    ctx.clearRect(0, 0, W, H);

    // ---- faint starfield for depth ----
    for (var i = 0; i < stars.length; i++) {
      var s = stars[i];
      var tw = 0.4 + 0.6 * Math.abs(Math.sin(s.tw + t * s.ts));
      ctx.fillStyle = rgba(WHITE, tw * (0.18 + 0.4 * s.z));
      ctx.beginPath(); ctx.arc(s.x + ox * s.z * 2, s.y, s.r * (0.6 + s.z), 0, TAU); ctx.fill();
    }

    // ---- core glow behind the lockup ----
    var coreR = minDim * lerp(0.16, 0.26, e);
    var cg = ctx.createRadialGradient(hx, hy, 0, hx, hy, coreR);
    cg.addColorStop(0, rgba(mix(CYAN, RED, 0.5), 0.16 + 0.06 * Math.sin(t)));
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

    // ---- build projected points for both strands ----
    var A = [], B = [], k, u, ang, x3, z3, persp, depth;
    for (k = 0; k < NPER; k++) {
      u = k / (NPER - 1);
      var y = hy + (u - 0.5) * Hh;
      ang = u * TWISTS * TAU + phase;
      // strand A
      x3 = Math.cos(ang) * R; z3 = Math.sin(ang) * R; persp = focal / (focal - z3);
      depth = (z3 + R) / (2 * R);
      A.push({ x: hx + x3 * persp, y: y, d: depth, u: u });
      // strand B (opposite)
      x3 = Math.cos(ang + Math.PI) * R; z3 = Math.sin(ang + Math.PI) * R; persp = focal / (focal - z3);
      depth = (z3 + R) / (2 * R);
      B.push({ x: hx + x3 * persp, y: y, d: depth, u: u });
    }

    // ---- rungs (base pairs) ----
    ctx.lineWidth = 1;
    for (k = 0; k < NPER; k += 3) {
      var a = A[k], b = B[k]; var dd = (a.d + b.d) / 2;
      var bf = bandFade(a.u);
      ctx.strokeStyle = rgba(mix(CYAN, RED, 0.5), 0.16 * dd * bf * bloom);
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }

    // ---- strand particles (back to front) ----
    function drawStrand(arr, col) {
      for (k = 0; k < arr.length; k++) {
        var pt = arr[k], bf = bandFade(pt.u);
        var sz = (0.8 + pt.d * 2.4);
        var al = (0.1 + pt.d * 0.9) * bf * bloom;
        var c = mix(col, WHITE, pt.d * 0.4);
        // soft glow for the closest particles
        if (pt.d > 0.6) {
          var g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, sz * 3.2);
          g.addColorStop(0, rgba(c, al * 0.5)); g.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pt.x, pt.y, sz * 3.2, 0, TAU); ctx.fill();
        }
        ctx.fillStyle = rgba(c, clamp(al, 0, 0.95));
        ctx.beginPath(); ctx.arc(pt.x, pt.y, sz, 0, TAU); ctx.fill();
      }
    }
    drawStrand(A, CYAN);
    drawStrand(B, RED);
  }

  function start() { if (!running && !reduce) { running = true; rafId = requestAnimationFrame(frame); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  if (reduce) {
    resize();
    introP = 0; updateIntroDOM();
    for (var k = 0; k < stars.length; k++) { var st = stars[k]; ctx.fillStyle = rgba(WHITE, 0.4 * st.z); ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, TAU); ctx.fill(); }
    var g0 = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.35);
    g0.addColorStop(0, rgba(mix(CYAN, RED, 0.5), 0.12)); g0.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
    canvas.style.opacity = "0.6";
    return;
  }

  pointer.x = pointer.px = window.innerWidth / 2;
  pointer.y = pointer.py = window.innerHeight / 2;
  resize();
  onScroll();
  start();

  var rT;
  window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(resize, 200); });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", function (ev) { pointer.x = ev.clientX; pointer.y = ev.clientY; }, { passive: true });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();
