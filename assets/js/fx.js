/* ============================================================
   MG TECH — cinematic background FX
   A living "circuit field": glowing nodes linked by traces, with
   energy packets travelling the links. Reacts to scroll + pointer.
   Vanilla canvas, no libraries. Honors prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";

  var canvas = document.getElementById("fx");
  if (!canvas) return;
  var ctx = canvas.getContext("2d", { alpha: true });

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var RED = [255, 45, 63];
  var CYAN = [56, 224, 255];
  var BLUE = [75, 107, 255];

  var W = 0, H = 0, DPR = 1;
  var nodes = [], packets = [];
  var pointer = { x: -9999, y: -9999, active: false };
  var scrollP = 0;          // 0..1 scroll progress
  var parallax = 0;         // px offset from scroll
  var rafId = null, running = false;

  function mix(a, b, t) {
    return [
      Math.round(a[0] + (b[0] - a[0]) * t),
      Math.round(a[1] + (b[1] - a[1]) * t),
      Math.round(a[2] + (b[2] - a[2]) * t),
    ];
  }
  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }

  function nodeCount() {
    var area = window.innerWidth * window.innerHeight;
    var base = Math.round(area / 14000);
    var cap = window.innerWidth < 760 ? 64 : 175;
    return Math.max(28, Math.min(cap, base));
  }

  function makeNodes() {
    nodes = [];
    var n = nodeCount();
    for (var i = 0; i < n; i++) {
      var z = 0.35 + Math.random() * 0.65;            // depth
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22 * z,
        vy: (Math.random() - 0.5) * 0.22 * z,
        z: z,
        r: (0.7 + Math.random() * 1.8) * z,
        t: Math.random(),                              // colour mix seed
        pulse: Math.random() * Math.PI * 2,
      });
    }
    // energy packets travelling between random nodes
    packets = [];
    var pc = window.innerWidth < 760 ? 5 : 11;
    for (var k = 0; k < pc; k++) packets.push(newPacket());
  }

  function newPacket() {
    var a = (Math.random() * nodes.length) | 0;
    return { a: a, b: pickNear(a), p: Math.random(), speed: 0.004 + Math.random() * 0.01 };
  }
  function pickNear(a) {
    var na = nodes[a], best = -1, bd = 1e9;
    for (var i = 0; i < nodes.length; i++) {
      if (i === a) continue;
      var dx = nodes[i].x - na.x, dy = nodes[i].y - na.y, d = dx * dx + dy * dy;
      if (d < bd && d > 100) { bd = d; best = i; }
    }
    return best < 0 ? (a + 1) % nodes.length : best;
  }

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    makeNodes();
  }

  var LINK = 0;            // squared link distance, set in resize-dependent draw
  function frame() {
    if (!running) return;
    rafId = requestAnimationFrame(frame);

    LINK = (window.innerWidth < 760 ? 128 : 188);
    var link2 = LINK * LINK;
    ctx.clearRect(0, 0, W, H);

    // scene colour: red -> cyan -> blue across the scroll
    var sceneA = scrollP < 0.5 ? mix(RED, CYAN, scrollP / 0.5)
                               : mix(CYAN, BLUE, (scrollP - 0.5) / 0.5);
    var flow = 0.15 + scrollP * 0.5;          // downward drift grows with scroll
    var py = -parallax * 0.04;                 // gentle parallax

    var i, j, n, m;
    // update
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      n.x += n.vx;
      n.y += n.vy + flow * n.z * 0.25;
      n.pulse += 0.03 + n.z * 0.02;

      // pointer repulsion
      if (pointer.active) {
        var dx = n.x - pointer.x, dy = n.y - (pointer.y), d2 = dx * dx + dy * dy;
        if (d2 < 16000 && d2 > 0.1) {
          var f = (16000 - d2) / 16000 * 0.9;
          var inv = 1 / Math.sqrt(d2);
          n.x += dx * inv * f; n.y += dy * inv * f;
        }
      }
      // wrap
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
    }

    // links
    ctx.lineWidth = 1;
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      for (j = i + 1; j < nodes.length; j++) {
        m = nodes[j];
        var ddx = n.x - m.x, ddy = (n.y - m.y), dist2 = ddx * ddx + ddy * ddy;
        if (dist2 < link2) {
          var a = (1 - dist2 / link2) * 0.24 * Math.min(n.z, m.z);
          ctx.strokeStyle = rgba(sceneA, a);
          ctx.beginPath();
          ctx.moveTo(n.x, n.y + py); ctx.lineTo(m.x, m.y + py);
          ctx.stroke();
        }
      }
    }

    // nodes (glow dots)
    for (i = 0; i < nodes.length; i++) {
      n = nodes[i];
      var c = mix(sceneA, n.t > 0.6 ? CYAN : RED, 0.35);
      var glow = 0.55 + Math.sin(n.pulse) * 0.25;
      var rad = n.r * (1.6 + Math.sin(n.pulse) * 0.3);
      var g = ctx.createRadialGradient(n.x, n.y + py, 0, n.x, n.y + py, rad * 4);
      g.addColorStop(0, rgba(c, glow * n.z));
      g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(n.x, n.y + py, rad * 4, 0, 6.2832); ctx.fill();
      ctx.fillStyle = rgba(c, Math.min(1, glow + 0.25) * n.z);
      ctx.beginPath(); ctx.arc(n.x, n.y + py, rad, 0, 6.2832); ctx.fill();
    }

    // energy packets riding the links
    for (i = 0; i < packets.length; i++) {
      var pk = packets[i];
      var na = nodes[pk.a], nb = nodes[pk.b];
      if (!na || !nb) { packets[i] = newPacket(); continue; }
      pk.p += pk.speed;
      if (pk.p >= 1) { pk.a = pk.b; pk.b = pickNear(pk.a); pk.p = 0; pk.speed = 0.004 + Math.random() * 0.01; }
      var px = na.x + (nb.x - na.x) * pk.p;
      var pyy = na.y + (nb.y - na.y) * pk.p + py;
      var pg = ctx.createRadialGradient(px, pyy, 0, px, pyy, 7);
      pg.addColorStop(0, rgba([255, 255, 255], 0.9));
      pg.addColorStop(0.4, rgba(CYAN, 0.7));
      pg.addColorStop(1, rgba(CYAN, 0));
      ctx.fillStyle = pg;
      ctx.beginPath(); ctx.arc(px, pyy, 7, 0, 6.2832); ctx.fill();
    }
  }

  function start() { if (!running && !reduce) { running = true; rafId = requestAnimationFrame(frame); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  function onScroll() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    parallax = st;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    scrollP = h > 0 ? Math.min(1, st / h) : 0;
  }

  // ---- init ----
  if (reduce) {
    // static, calm fallback: one gentle paint
    resize();
    var g0 = ctx.createRadialGradient(W * 0.2, 0, 0, W * 0.2, 0, H);
    g0.addColorStop(0, rgba(RED, 0.10)); g0.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g0; ctx.fillRect(0, 0, W, H);
    return;
  }

  resize();
  onScroll();
  start();

  var rT;
  window.addEventListener("resize", function () {
    clearTimeout(rT); rT = setTimeout(resize, 200);
  });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", function (e) {
    pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true;
  }, { passive: true });
  window.addEventListener("pointerleave", function () { pointer.active = false; });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop(); else start();
  });
})();
