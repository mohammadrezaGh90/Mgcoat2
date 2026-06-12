/* MGCoat — flowing silk background.
   Two luminous ribbons made of many fine, turbulent threads that weave and twist
   like cloth dancing under water — dense at the core, frayed at the trailing
   edges, bright where the ribbons cross. Lightweight additive canvas; honors
   reduced-motion, pauses when hidden, caps DPR and thread count for mobile. */
(function () {
  "use strict";
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var cv = document.createElement("canvas");
  cv.id = "flow-bg"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity 1.8s ease";
  (document.body || document.documentElement).insertBefore(cv, (document.body || document.documentElement).firstChild);
  var ctx = cv.getContext("2d", { alpha: true });
  var W, H, DPR, running = true, raf = 0, threads = [], sparks = [], gCool, gWarm, gWhite, glow;

  function grad(rgb) {
    var g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0.00, "rgba(" + rgb + ",0)");
    g.addColorStop(0.16, "rgba(" + rgb + ",0.55)");
    g.addColorStop(0.50, "rgba(" + rgb + ",1)");
    g.addColorStop(0.84, "rgba(" + rgb + ",0.55)");
    g.addColorStop(1.00, "rgba(" + rgb + ",0)");
    return g;
  }
  function makeGlow() {
    var s = 256, c = document.createElement("canvas"); c.width = c.height = s;
    var x = c.getContext("2d"), g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(228,238,255,0.85)"); g.addColorStop(0.3, "rgba(175,205,255,0.28)"); g.addColorStop(1, "rgba(175,205,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, s, s); glow = c;
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.6);
    W = cv.width = Math.round(innerWidth * DPR);
    H = cv.height = Math.round(innerHeight * DPR);
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    gCool = grad("196,214,255"); gWarm = grad("232,186,170"); gWhite = grad("234,243,255");
    makeGlow();
    var K = innerWidth < 640 ? 34 : 72;          // threads per ribbon (dense silky sheet)
    threads = [];
    for (var rib = 0; rib < 2; rib++) {
      for (var k = 0; k < K; k++) {
        var o = (k / (K - 1)) * 2 - 1;             // base position across the sheet
        threads.push({
          rib: rib, o: o,
          f: rnd(1.6, 6.5), p: rnd(0, 6.283), sp: rnd(0.25, 0.7),   // per-thread turbulence
          a: rnd(0.014, 0.04),                        // fray amplitude (fraction of H)
          al: (0.028 + 0.05 * (1 - Math.abs(o))) * rnd(0.7, 1.15),  // brighter toward the core
          col: Math.abs(o) < 0.1 ? gWhite : (Math.random() < 0.1 ? gWarm : gCool)
        });
      }
    }
    var n = innerWidth < 640 ? 70 : 150;
    sparks = [];
    for (var i = 0; i < n; i++) sparks.push({ t: Math.random(), rib: i % 2, sp: rnd(0.012, 0.03), o: rnd(-1.1, 1.1), al: rnd(0.12, 0.5), sz: rnd(0.5, 1.7) * DPR, warm: Math.random() < 0.14 });
  }
  function wave(xf, time) { return Math.sin(xf * 6.2832 + 0.55 * Math.sin(time * 0.4)); }
  function ribbonY(rib, xf, time) {
    var s = rib ? -1 : 1;
    return 0.5 + s * 0.19 * wave(xf, time) + s * 0.024 * Math.sin(xf * 7.0 + time * 0.65);
  }
  function sheet(xf, time) { return 0.055 * Math.abs(wave(xf, time)) + 0.006; }   // tight at crossings, broad at humps

  var t0 = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running) return;
    var time = (now - t0) / 1000, steps = innerWidth < 640 ? 40 : 56, i, j;
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineWidth = Math.max(1, DPR * 0.85);
    for (i = 0; i < threads.length; i++) {
      var th = threads[i];
      ctx.beginPath();
      for (j = 0; j <= steps; j++) {
        var xf = j / steps, x = xf * W, w = wave(xf, time);
        var fray = th.a * Math.sin(xf * th.f * 6.283 + th.p + time * th.sp) * (0.35 + 0.65 * Math.abs(w)); // more fray on the broad parts
        var y = (ribbonY(th.rib, xf, time) + th.o * sheet(xf, time) + fray) * H;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = th.al; ctx.strokeStyle = th.col; ctx.stroke();
    }
    // bright crossings (where the two ribbons meet)
    for (j = 0; j < steps; j++) {
      var cxf = j / steps;
      if (Math.abs(ribbonY(0, cxf, time) - ribbonY(1, cxf, time)) < 0.014) {
        var gx = cxf * W, gy = ribbonY(0, cxf, time) * H, gs = (80 + 55 * Math.sin(time * 1.2 + j)) * DPR, e = Math.sin(Math.PI * cxf);
        ctx.globalAlpha = 0.45 * e * e; ctx.drawImage(glow, gx - gs / 2, gy - gs / 2, gs, gs);
      }
    }
    // fine drifting sparkle along the ribbons
    for (i = 0; i < sparks.length; i++) {
      var s = sparks[i]; s.t += s.sp / 60; if (s.t > 1) s.t -= 1;
      var sx = s.t * W, sy = (ribbonY(s.rib, s.t, time) + s.o * sheet(s.t, time)) * H, se = Math.sin(Math.PI * s.t); se *= se;
      ctx.globalAlpha = s.al * se; ctx.fillStyle = s.warm ? "rgba(236,196,178,1)" : "rgba(228,239,255,1)";
      ctx.beginPath(); ctx.arc(sx, sy, s.sz, 0, 6.283); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  function start() { requestAnimationFrame(function () { cv.style.opacity = "1"; }); raf = requestAnimationFrame(frame); }
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  window.addEventListener("resize", function () { clearTimeout(resize._t); resize._t = setTimeout(resize, 200); });
  resize(); start();
})();
