/* MGCoat — cinematic flowing-silk background.
   Two luminous ribbons of fine threads woven by an organic flow-noise field,
   rendered in two depth layers (a soft blurred far layer + a crisp near layer)
   with an additive bloom pass, a whisper of brand-red accent, and a gentle
   scroll parallax. Lightweight: half-resolution buffers, ~40fps cap, pauses when
   hidden, honors reduced-motion, scales down on mobile. Falls back gracefully if
   canvas filters are unavailable. */
(function () {
  "use strict";
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var cv = document.createElement("canvas");
  cv.id = "flow-bg"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity 2s ease";
  (document.body || document.documentElement).insertBefore(cv, (document.body || document.documentElement).firstChild);
  var ctx = cv.getContext("2d", { alpha: true });
  var far = document.createElement("canvas"), fctx = far.getContext("2d");
  var near = document.createElement("canvas"), nctx = near.getContext("2d");
  var bloom = document.createElement("canvas"), bctx = bloom.getContext("2d");
  var canFilter = (function () { try { fctx.filter = "blur(2px)"; var ok = fctx.filter === "blur(2px)"; fctx.filter = "none"; return ok; } catch (e) { return false; } })();

  var W, H, DPR, SC, BW, BH, running = true, threads = [], sparks = [], mobile, scrollY = 0;

  // ---- cheap value-noise flow field (organic, non-repeating) ----
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y) { return vnoise(x, y) * 0.6 + vnoise(x * 2.1 + 5.3, y * 2.1) * 0.3 + vnoise(x * 4.3, y * 4.3 + 9.1) * 0.1; }

  function col(rgb, a) { return "rgba(" + rgb + "," + a + ")"; }
  function lineGrad(c, rgb) {
    var g = c.createLinearGradient(0, 0, BW ? far.width : 1, 0);
    g.addColorStop(0.00, col(rgb, 0)); g.addColorStop(0.15, col(rgb, 0.5));
    g.addColorStop(0.50, col(rgb, 1)); g.addColorStop(0.85, col(rgb, 0.5)); g.addColorStop(1.00, col(rgb, 0));
    return g;
  }
  var COOL = "176,202,255", WHITE = "228,240,255", WARM = "232,196,176", RED = "255,86,96";

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    mobile = innerWidth < 640;
    SC = (mobile ? 0.85 : 1) * DPR;                 // internal scale (sub-pixel = soft + fast)
    W = Math.round(innerWidth * SC); H = Math.round(innerHeight * SC);
    cv.width = Math.round(innerWidth * DPR); cv.height = Math.round(innerHeight * DPR);
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    far.width = near.width = W; far.height = near.height = H;
    BW = bloom.width = Math.round(W / 4); BH = bloom.height = Math.round(H / 4);
    buildThreads();
  }
  function buildThreads() {
    var K = mobile ? 22 : 40;                        // per ribbon, per depth
    threads = [];
    for (var depth = 0; depth < 2; depth++) {        // 0 = far (blurred), 1 = near (crisp)
      for (var rib = 0; rib < 2; rib++) {
        for (var k = 0; k < K; k++) {
          var o = (k / (K - 1)) * 2 - 1;
          var redAccent = Math.random() < 0.012;     // a whisper of brand red
          threads.push({
            depth: depth, rib: rib, o: o,
            seed: Math.random() * 40, ns: 0.5 + Math.random() * 0.7,
            amp: (0.018 + Math.random() * 0.03) * (depth ? 1 : 1.5),
            spd: (depth ? 0.55 : 0.9),
            al: (depth ? 0.05 : 0.085) * (0.6 + 0.6 * (1 - Math.abs(o))),
            rgb: redAccent ? RED : (Math.abs(o) < 0.1 ? WHITE : (Math.random() < 0.08 ? WARM : COOL)),
            w: depth ? 1.5 : 1
          });
        }
      }
    }
    var n = mobile ? 60 : 120;
    sparks = [];
    for (var i = 0; i < n; i++) sparks.push({ t: Math.random(), rib: i % 2, sp: 0.012 + Math.random() * 0.022, o: Math.random() * 2.2 - 1.1, al: 0.12 + Math.random() * 0.4, sz: (0.5 + Math.random() * 1.5), warm: Math.random() < 0.12 });
  }
  function wave(xf, t) { return Math.sin(xf * 6.2832 + 0.5 * Math.sin(t * 0.4)); }
  function ribbonY(rib, xf, t) { var s = rib ? -1 : 1; return 0.5 + s * 0.18 * wave(xf, t); }
  function sheet(xf, t) { return 0.05 * Math.abs(wave(xf, t)) + 0.006; }

  function drawThreads(c, depth, time) {
    c.clearRect(0, 0, W, H);
    c.globalCompositeOperation = "lighter";
    var steps = mobile ? 36 : 52, gradCache = {};
    for (var i = 0; i < threads.length; i++) {
      var th = threads[i]; if (th.depth !== depth) continue;
      c.beginPath();
      for (var j = 0; j <= steps; j++) {
        var xf = j / steps, x = xf * W, w = wave(xf, time);
        var turb = (fbm(xf * 3.0 * th.ns + th.seed, time * 0.18 * th.spd + th.seed) - 0.5) * th.amp * (0.4 + 0.9 * Math.abs(w));
        var y = (ribbonY(th.rib, xf, time) + th.o * sheet(xf, time) + turb) * H;
        if (j === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.lineWidth = Math.max(1, th.w * SC);
      c.globalAlpha = th.al;
      c.strokeStyle = gradCache[th.rgb] || (gradCache[th.rgb] = lineGrad(c, th.rgb));
      c.stroke();
    }
    if (depth === 1) {
      for (var s = 0; s < sparks.length; s++) {
        var p = sparks[s]; p.t += p.sp / 60; if (p.t > 1) p.t -= 1;
        var sx = p.t * W, sy = (ribbonY(p.rib, p.t, time) + p.o * sheet(p.t, time)) * H, se = Math.sin(Math.PI * p.t); se *= se;
        c.globalAlpha = p.al * se; c.fillStyle = col(p.warm ? WARM : WHITE, 1);
        c.beginPath(); c.arc(sx, sy, p.sz * SC, 0, 6.283); c.fill();
      }
    }
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  }

  var t0 = performance.now(), lastFrame = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running || now - lastFrame < 24) return;   // ~40fps cap
    lastFrame = now;
    var time = (now - t0) / 1000;
    var par = (scrollY || 0) * SC;                   // scroll parallax (in buffer px)
    drawThreads(fctx, 0, time);
    drawThreads(nctx, 1, time);

    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.globalCompositeOperation = "lighter";
    // far layer — softened + drifts a touch more with scroll (depth)
    if (canFilter) ctx.filter = "blur(" + (1.6 * DPR) + "px)";
    ctx.globalAlpha = 0.85;
    ctx.drawImage(far, 0, -par * 0.05, cv.width, cv.height);
    if (canFilter) ctx.filter = "none";
    // near layer — crisp
    ctx.globalAlpha = 1;
    ctx.drawImage(near, 0, par * 0.02, cv.width, cv.height);
    // bloom — downscale the near layer, blur, add back for a luminous glow
    bctx.clearRect(0, 0, BW, BH);
    bctx.drawImage(near, 0, 0, BW, BH);
    if (canFilter) ctx.filter = "blur(" + (6 * DPR) + "px)";
    ctx.globalAlpha = 0.55;
    ctx.drawImage(bloom, 0, par * 0.02, cv.width, cv.height);
    if (canFilter) ctx.filter = "none";
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  var raf = 0;
  function start() { requestAnimationFrame(function () { cv.style.opacity = "1"; }); raf = requestAnimationFrame(frame); }
  function onScroll() { scrollY = window.pageYOffset || document.documentElement.scrollTop || 0; }
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { clearTimeout(resize._t); resize._t = setTimeout(resize, 200); });
  resize(); onScroll(); start();
})();
