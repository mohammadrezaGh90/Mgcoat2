/* MGCoat — twisted silk veils background (matched to the reference video).
   Three independent, irregular ribbons of fine silky fibers, each twisting like
   smoky cloth: broad and dim where the sheet faces us, pinched and bright where
   seen edge-on. Crossings and highlights fall at organic, asymmetric spots.
   Cool steel-blue/white with faint warm hints and a whisper of red, on near-black.
   Additive canvas, ~40fps, soft end-fade, intro-aware fade-in, scroll parallax,
   pauses when hidden, honors reduced-motion. */
(function () {
  "use strict";
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var cv = document.createElement("canvas");
  cv.id = "flow-bg"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity .6s ease";
  (document.body || document.documentElement).insertBefore(cv, (document.body || document.documentElement).firstChild);
  var ctx = cv.getContext("2d", { alpha: true });

  var W, H, DPR, mobile, running = true, raf = 0, scrollY = 0, introEl = null, faded = false;
  var ribbons = [], gCool, gWarm, gWhite, gRed, glow;
  var COOL = "172,202,250", WHITE = "230,240,255", WARM = "234,196,186", RED = "255,96,104";

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
    g.addColorStop(0.00, "rgba(" + rgb + ",0)"); g.addColorStop(0.13, "rgba(" + rgb + ",0.5)");
    g.addColorStop(0.50, "rgba(" + rgb + ",1)"); g.addColorStop(0.87, "rgba(" + rgb + ",0.5)"); g.addColorStop(1.00, "rgba(" + rgb + ",0)");
    return g;
  }
  function makeGlow() {
    var s = 256, c = document.createElement("canvas"); c.width = c.height = s;
    var x = c.getContext("2d"), g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(230,240,255,0.8)"); g.addColorStop(0.3, "rgba(178,205,255,0.25)"); g.addColorStop(1, "rgba(178,205,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, s, s); glow = c;
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5); mobile = innerWidth < 640;
    W = cv.width = Math.round(innerWidth * DPR); H = cv.height = Math.round(innerHeight * DPR);
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    gCool = lineGrad(COOL); gWarm = lineGrad(WARM); gWhite = lineGrad(WHITE); gRed = lineGrad(RED); makeGlow();
    build();
  }
  function build() {
    var R = 3, K = mobile ? 20 : 38;                 // ribbons × fibers per ribbon
    var offs = [-0.085, 0.01, 0.09];                  // vertical placement (overlapping mid band)
    ribbons = [];
    for (var r = 0; r < R; r++) {
      var rb = {
        yoff: offs[r] + rnd(-0.015, 0.015),
        // irregular path: two sine components, unrelated frequencies/phases/speeds
        a1: rnd(0.08, 0.12), f1: rnd(8.0, 11.0), p1: rnd(0, 6.283), s1: rnd(0.16, 0.30) * (r % 2 ? -1 : 1),
        a2: rnd(0.025, 0.045), f2: rnd(15.0, 21.0), p2: rnd(0, 6.283), s2: rnd(0.3, 0.5),
        // independent twist (pinch) wave → highlights at organic spots
        ft: rnd(9.0, 13.0), pt: rnd(0, 6.283), st: rnd(0.18, 0.3),
        seed: rnd(0, 50), fibers: []
      };
      for (var k = 0; k < K; k++) {
        var o = (k / (K - 1)) * 2 - 1;
        var red = Math.random() < 0.01;
        rb.fibers.push({
          o: o,
          f: rnd(1.8, 5.6), ph: rnd(0, 30), sp: rnd(0.5, 1.2),
          amp: rnd(0.012, 0.026),
          al: (0.05 + 0.07 * (1 - Math.abs(o) * 0.6)) * rnd(0.65, 1.2) * (Math.abs(o) > 0.86 ? 1.5 : 1), // membrane edges a touch brighter
          col: red ? gRed : (Math.abs(o) < 0.12 ? gWhite : (Math.random() < 0.10 ? gWarm : gCool))
        });
      }
      ribbons.push(rb);
    }
  }
  function centerY(rb, xf, t) {
    return 0.5 + rb.yoff
      + rb.a1 * Math.sin(xf * rb.f1 + rb.p1 + t * rb.s1)
      + rb.a2 * Math.sin(xf * rb.f2 + rb.p2 - t * rb.s2);
  }
  function twist(rb, xf, t) {                          // sheet width: broad faces, pinched edges
    var w = Math.abs(Math.sin(xf * rb.ft + rb.pt + t * rb.st));
    return 0.012 + 0.052 * Math.pow(w, 1.25);
  }

  var t0 = performance.now(), last = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running || now - last < 24) return;          // ~40fps
    last = now;
    var time = (now - t0) / 1000, par = (scrollY || 0) * DPR * 0.025;
    var steps = mobile ? 44 : 62, r, i, j;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = Math.max(1, DPR * 0.8);
    for (r = 0; r < ribbons.length; r++) {
      var rb = ribbons[r];
      for (i = 0; i < rb.fibers.length; i++) {
        var fb = rb.fibers[i];
        ctx.beginPath();
        for (j = 0; j <= steps; j++) {
          var xf = j / steps, x = xf * W;
          var sp = twist(rb, xf, time);
          var fray = (fbm(xf * fb.f + fb.ph, time * 0.15 * fb.sp + fb.ph) - 0.5) * fb.amp * (0.5 + 8 * sp);
          var y = (centerY(rb, xf, time) + fb.o * sp + fray) * H - par;
          if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.globalAlpha = fb.al; ctx.strokeStyle = fb.col; ctx.stroke();
      }
      // soft highlights where this ribbon pinches (edge-on cloth catches the light)
      for (j = 2; j < steps - 2; j++) {
        var pxf = j / steps;
        if (twist(rb, pxf, time) < 0.017) {
          var gx = pxf * W, gy = centerY(rb, pxf, time) * H - par, e = Math.sin(Math.PI * pxf);
          var gs = (70 + 40 * Math.sin(time * 1.1 + j + r * 2)) * DPR;
          ctx.globalAlpha = 0.34 * e * e;
          ctx.drawImage(glow, gx - gs / 2, gy - gs / 2, gs, gs);
        }
      }
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
