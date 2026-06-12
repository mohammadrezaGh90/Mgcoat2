/* MGCoat — flowing silk-ribbon background.
   Two translucent ribbons of fine silky fibers that weave like a slow double
   helix, converging at the edges, broad at the humps and pinched + luminous
   where they cross — matching the reference. Organic fiber turbulence (noise),
   soft end-fade, crossing glow, a few drifting glints. Cool blue/white with a
   faint warm tint and a whisper of red. Lightweight additive canvas; ~40fps,
   pauses when hidden, honors reduced-motion, fades in softly after the intro. */
(function () {
  "use strict";
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var cv = document.createElement("canvas");
  cv.id = "flow-bg"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity .6s ease";
  (document.body || document.documentElement).insertBefore(cv, (document.body || document.documentElement).firstChild);
  var ctx = cv.getContext("2d", { alpha: true });

  var W, H, DPR, mobile, running = true, raf = 0, scrollY = 0, introEl = null, faded = false;
  var threads = [], sparks = [], gCool, gWarm, gWhite, gRed, glow;
  var COOL = "176,206,255", WHITE = "230,240,255", WARM = "232,190,176", RED = "255,96,104";

  // value-noise for organic silk fibers
  function hash(x, y) { var n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n); }
  function vnoise(x, y) {
    var xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
    var u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
    var a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }
  function fbm(x, y) { return vnoise(x, y) * 0.65 + vnoise(x * 2.3 + 4.1, y * 2.3) * 0.25 + vnoise(x * 4.6, y * 4.6 + 7.7) * 0.1; }

  function lineGrad(rgb) {
    var g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0.00, "rgba(" + rgb + ",0)"); g.addColorStop(0.14, "rgba(" + rgb + ",0.55)");
    g.addColorStop(0.50, "rgba(" + rgb + ",1)"); g.addColorStop(0.86, "rgba(" + rgb + ",0.55)"); g.addColorStop(1.00, "rgba(" + rgb + ",0)");
    return g;
  }
  function makeGlow() {
    var s = 256, c = document.createElement("canvas"); c.width = c.height = s;
    var x = c.getContext("2d"), g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(232,242,255,0.85)"); g.addColorStop(0.3, "rgba(180,206,255,0.28)"); g.addColorStop(1, "rgba(180,206,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, s, s); glow = c;
  }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5); mobile = innerWidth < 640;
    W = cv.width = Math.round(innerWidth * DPR); H = cv.height = Math.round(innerHeight * DPR);
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    gCool = lineGrad(COOL); gWarm = lineGrad(WARM); gWhite = lineGrad(WHITE); gRed = lineGrad(RED); makeGlow();
    build();
  }
  function build() {
    var K = mobile ? 30 : 64;                      // fibers per ribbon (dense silky sheet)
    threads = [];
    for (var rib = 0; rib < 2; rib++) {
      for (var k = 0; k < K; k++) {
        var o = (k / (K - 1)) * 2 - 1;
        var red = Math.random() < 0.012;
        threads.push({
          rib: rib, o: o,
          f: 1.6 + Math.random() * 4.4, ph: Math.random() * 30, sp: 0.5 + Math.random() * 0.8,  // fiber turbulence
          amp: 0.016 + Math.random() * 0.03,
          al: (0.03 + 0.06 * (1 - Math.abs(o))) * (0.7 + Math.random() * 0.5),
          col: red ? gRed : (Math.abs(o) < 0.1 ? gWhite : (Math.random() < 0.09 ? gWarm : gCool))
        });
      }
    }
    var n = mobile ? 60 : 130;
    sparks = [];
    for (var i = 0; i < n; i++) sparks.push({ t: Math.random(), rib: i % 2, sp: 0.012 + Math.random() * 0.022, o: Math.random() * 2.2 - 1.1, al: 0.12 + Math.random() * 0.4, sz: (0.5 + Math.random() * 1.5) * DPR, warm: Math.random() < 0.12 });
  }
  function wave(xf, t) { return Math.sin(xf * 6.2832 * 1.5 + 0.5 * Math.sin(t * 0.4)); }   // ~1.5 weaves, slow breathing
  function ribbonY(rib, xf, t) { var s = rib ? -1 : 1; return 0.5 + s * 0.17 * wave(xf, t); }
  function spread(xf, t) { return 0.055 * Math.abs(wave(xf, t)) + 0.006; }                 // broad at humps, pinched at crossings

  var t0 = performance.now(), last = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running || now - last < 24) return;        // ~40fps
    last = now;
    var time = (now - t0) / 1000, par = (scrollY || 0) * DPR * 0.025;
    var steps = mobile ? 42 : 60, i, j;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = Math.max(1, DPR * 0.85);
    for (i = 0; i < threads.length; i++) {
      var th = threads[i];
      ctx.beginPath();
      for (j = 0; j <= steps; j++) {
        var xf = j / steps, x = xf * W, w = wave(xf, time);
        var fray = (fbm(xf * th.f + th.ph, time * 0.16 * th.sp + th.ph) - 0.5) * th.amp * (0.4 + 0.95 * Math.abs(w));
        var y = (ribbonY(th.rib, xf, time) + th.o * spread(xf, time) + fray) * H - par;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = th.al; ctx.strokeStyle = th.col; ctx.stroke();
    }
    // luminous crossings where the ribbons meet
    for (j = 0; j < steps; j++) {
      var cxf = j / steps;
      if (Math.abs(ribbonY(0, cxf, time) - ribbonY(1, cxf, time)) < 0.012) {
        var gx = cxf * W, gy = ribbonY(0, cxf, time) * H - par, gs = (90 + 55 * Math.sin(time * 1.2 + j)) * DPR, e = Math.sin(Math.PI * cxf);
        ctx.globalAlpha = 0.5 * e * e; ctx.drawImage(glow, gx - gs / 2, gy - gs / 2, gs, gs);
      }
    }
    // fine drifting glints
    for (i = 0; i < sparks.length; i++) {
      var p = sparks[i]; p.t += p.sp / 60; if (p.t > 1) p.t -= 1;
      var sx = p.t * W, sy = (ribbonY(p.rib, p.t, time) + p.o * spread(p.t, time)) * H - par, se = Math.sin(Math.PI * p.t); se *= se;
      ctx.globalAlpha = p.al * se; ctx.fillStyle = p.warm ? "rgba(236,200,182,1)" : "rgba(228,240,255,1)";
      ctx.beginPath(); ctx.arc(sx, sy, p.sz, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  function updateFade() {
    if (introEl) {
      var ih = introEl.offsetHeight || innerHeight;
      var o = (scrollY - ih * 0.45) / (ih * 0.5); o = o < 0 ? 0 : (o > 1 ? 1 : o);
      cv.style.opacity = String(o);
    } else if (!faded) { faded = true; cv.style.opacity = "1"; }
  }
  function onScroll() { scrollY = window.pageYOffset || document.documentElement.scrollTop || 0; updateFade(); }
  function startup() { introEl = document.getElementById("intro"); onScroll(); if (!introEl) requestAnimationFrame(function () { cv.style.opacity = "1"; }); raf = requestAnimationFrame(frame); }
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () { clearTimeout(resize._t); resize._t = setTimeout(function () { resize(); updateFade(); }, 200); });
  resize(); startup();
})();
