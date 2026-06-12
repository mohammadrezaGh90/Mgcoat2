/* MGCoat — flowing sine-wave background.
   A set of crisp, luminous sine lines layered over one another, drifting and
   weaving softly like silk. Cool blue/white palette with a rare red accent, a
   light additive glow, soft fade at both ends and a gentle scroll parallax.
   Lightweight, ~45fps cap, pauses when hidden, honors reduced-motion. */
(function () {
  "use strict";
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var cv = document.createElement("canvas");
  cv.id = "flow-bg"; cv.setAttribute("aria-hidden", "true");
  cv.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:-1;pointer-events:none;opacity:0;transition:opacity 2s ease";
  (document.body || document.documentElement).insertBefore(cv, (document.body || document.documentElement).firstChild);
  var ctx = cv.getContext("2d", { alpha: true });
  var glowC = document.createElement("canvas"), gctx = glowC.getContext("2d");
  var canFilter = (function () { try { gctx.filter = "blur(2px)"; var ok = gctx.filter === "blur(2px)"; gctx.filter = "none"; return ok; } catch (e) { return false; } })();

  var W, H, DPR, lines = [], running = true, raf = 0, scrollY = 0, mobile;
  var COOL = "176,202,255", WHITE = "226,238,255", WARM = "232,196,176", RED = "255,86,96";

  function grad(rgb) {
    var g = ctx.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0.00, "rgba(" + rgb + ",0)");
    g.addColorStop(0.16, "rgba(" + rgb + ",0.6)");
    g.addColorStop(0.50, "rgba(" + rgb + ",1)");
    g.addColorStop(0.84, "rgba(" + rgb + ",0.6)");
    g.addColorStop(1.00, "rgba(" + rgb + ",0)");
    return g;
  }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.6);
    mobile = innerWidth < 640;
    W = cv.width = Math.round(innerWidth * DPR);
    H = cv.height = Math.round(innerHeight * DPR);
    cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
    glowC.width = Math.round(W / 4); glowC.height = Math.round(H / 4);
    build();
  }
  function build() {
    var N = mobile ? 9 : 15;                       // several sine lines layered over each other
    lines = [];
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1);                          // 0..1 across the set
      var red = Math.random() < 0.06;
      lines.push({
        amp: (0.05 + Math.random() * 0.13) * (0.7 + 0.5 * Math.sin(t * 3.14)),  // varied sweep sizes
        cyc: 1.2 + Math.random() * 1.8,             // waves across the width
        ph: Math.random() * 6.283,
        sp: (Math.random() < 0.5 ? 1 : -1) * (0.12 + Math.random() * 0.22),     // drift speed/dir
        yoff: (t - 0.5) * 0.06 + (Math.random() - 0.5) * 0.03,                   // vertical spread around centre
        wob: 0.4 + Math.random() * 0.8, wsp: 0.2 + Math.random() * 0.4,         // slow amplitude breathing
        w: (0.8 + Math.random() * (red ? 0.8 : 1.6)),
        al: red ? 0.12 : (0.10 + Math.random() * 0.16),
        rgb: red ? RED : (i % 5 === 0 ? WHITE : (Math.random() < 0.08 ? WARM : COOL))
      });
      lines[i].g = grad(lines[i].rgb);
    }
  }
  function yAt(L, xf, time) {
    var env = Math.pow(Math.sin(Math.PI * xf), 0.6);                 // taper toward the edges
    var amp = L.amp * (0.75 + 0.25 * Math.sin(time * L.wsp + L.ph)) * env;
    return 0.5 + L.yoff + amp * Math.sin(xf * 6.2832 * L.cyc + L.ph + time * L.sp)
                + 0.012 * Math.sin(xf * 13 + time * L.wob);          // fine ripple
  }
  function drawLines(c, time, scale) {
    var steps = mobile ? 48 : 70, sx = c.canvas.width / W, sy = c.canvas.height / H;
    c.clearRect(0, 0, c.canvas.width, c.canvas.height);
    c.globalCompositeOperation = "lighter";
    for (var i = 0; i < lines.length; i++) {
      var L = lines[i];
      c.beginPath();
      for (var j = 0; j <= steps; j++) {
        var xf = j / steps, x = xf * W * sx, y = yAt(L, xf, time) * H * sy;
        if (j === 0) c.moveTo(x, y); else c.lineTo(x, y);
      }
      c.lineWidth = Math.max(1, L.w * DPR * scale);
      c.globalAlpha = L.al;
      c.strokeStyle = scale === 1 ? L.g : L.rgb && ("rgba(" + L.rgb + ",1)");
      c.stroke();
    }
    c.globalAlpha = 1; c.globalCompositeOperation = "source-over";
  }
  var t0 = performance.now(), last = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!running || now - last < 22) return;        // ~45fps
    last = now;
    var time = (now - t0) / 1000, par = (scrollY || 0) * DPR * 0.03;
    ctx.setTransform(1, 0, 0, 1, 0, -par);
    drawLines(ctx, time, 1);                         // crisp lines
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // light additive bloom for a luminous glow (kept subtle so lines stay crisp)
    drawLines(gctx, time, 0.25);
    ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.5;
    if (canFilter) ctx.filter = "blur(" + (3 * DPR) + "px)";
    ctx.drawImage(glowC, 0, -par, W, H);
    if (canFilter) ctx.filter = "none";
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
  }
  function start() { requestAnimationFrame(function () { cv.style.opacity = "1"; }); raf = requestAnimationFrame(frame); }
  document.addEventListener("visibilitychange", function () { running = !document.hidden; });
  window.addEventListener("scroll", function () { scrollY = window.pageYOffset || document.documentElement.scrollTop || 0; }, { passive: true });
  window.addEventListener("resize", function () { clearTimeout(resize._t); resize._t = setTimeout(resize, 200); });
  resize(); start();
})();
