/* ============================================================
   MG TECH — welcome intro + circuit field (scroll-driven)
   The intro is SCRUBBED by scroll: particles assemble into a
   circuit lattice as you scroll down and disperse as you scroll
   up. After the intro it relaxes into a calm field for the hero,
   then the canvas fades out so content stays clean & minimal.
   Vanilla canvas, no libraries. Honors prefers-reduced-motion.
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
  var introHint = document.querySelector(".intro-hint");

  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var RED = [255, 51, 64], CYAN = [84, 216, 236], WHITE = [235, 244, 255];

  var W = 0, H = 0, DPR = 1, cx = 0, cy = 0;
  var P = [];                 // particles
  var packets = [];           // light packets streaming along links
  var pointer = { x: -9999, y: -9999, active: false };
  var introP = 0, fieldOn = false, scrollY = 0, vh = 0, introH = 0;
  var rafId = null, running = false;

  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeIO(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function count() {
    var base = Math.round((window.innerWidth * window.innerHeight) / 15000);
    var cap = window.innerWidth < 760 ? 64 : 150;
    return Math.max(30, Math.min(cap, base));
  }

  function build() {
    W = window.innerWidth; H = window.innerHeight; cx = W / 2; cy = H * 0.5;
    var n = count(), rings = 4;
    P = [];
    for (var i = 0; i < n; i++) {
      var ring = i % rings;
      var rad = (0.13 + ring * 0.1) * Math.min(W, H) + (Math.random() - 0.5) * 36;
      var ang = Math.random() * Math.PI * 2;
      var z = 0.4 + Math.random() * 0.6;
      P.push({
        sx: Math.random() * W, sy: Math.random() * H,           // scattered start
        tx: Math.cos(ang) * rad, ty: Math.sin(ang) * rad,        // formation (rel. centre)
        x: 0, y: 0, vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
        z: z, r: (0.8 + Math.random() * 1.6) * z, t: Math.random(),
        pulse: Math.random() * 6.28,
      });
    }
    // light packets that stream along the links
    packets = [];
    var pc = window.innerWidth < 760 ? 7 : 14;
    for (var k = 0; k < pc; k++) packets.push(newPacket());
  }

  function newPacket() {
    var a = (Math.random() * P.length) | 0;
    return { a: a, b: pickNear(a), p: Math.random(), speed: 0.005 + Math.random() * 0.012 };
  }
  function pickNear(a) {
    var na = P[a], best = (a + 1) % P.length, bd = 1e9;
    for (var i = 0; i < P.length; i++) {
      if (i === a) continue;
      var dx = P[i].x - na.x, dy = P[i].y - na.y, d = dx * dx + dy * dy;
      if (d < bd && d > 80) { bd = d; best = i; }
    }
    return best;
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

  function measure() {
    vh = window.innerHeight;
    introH = intro ? intro.offsetHeight : vh;
  }

  function onScroll() {
    scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var pin = Math.max(1, introH - vh);
    introP = clamp(scrollY / pin, 0, 1);
    updateIntroDOM();
    updateCanvasFade();
  }

  function updateIntroDOM() {
    if (!introInner) return;
    // Welcome (logo + title) is visible from the very top; scrolling
    // gently scales it while the circuit assembles, then it lifts away.
    var settle = clamp(introP / 0.35, 0, 1);     // small entrance settle
    if (introLogo) {
      introLogo.style.opacity = "1";
      introLogo.style.transform = "scale(" + lerp(0.94, 1.06, easeIO(introP)) + ")";
    }
    if (introTitle) { introTitle.style.opacity = "1"; introTitle.style.transform = "translateY(" + lerp(10, 0, settle) + "px)"; }
    if (introSub) introSub.style.opacity = "1";
    if (introHint) introHint.style.opacity = clamp(1 - introP / 0.3, 0, 1);
    // whole intro lifts away & fades at the end to reveal the site
    var out = clamp((introP - 0.74) / 0.26, 0, 1);
    introInner.style.opacity = String(1 - out);
    introInner.style.transform = "translateY(" + (-out * 44) + "px) scale(" + (1 - out * 0.04) + ")";
  }

  function updateCanvasFade() {
    var fadeStart = introH + vh * 0.4;
    var fadeEnd = introH + vh * 1.5;
    var k = clamp((scrollY - fadeStart) / (fadeEnd - fadeStart), 0, 1);
    canvas.style.opacity = String(lerp(1, 0.06, k));
  }

  function frame() {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    ctx.clearRect(0, 0, W, H);

    var inIntro = introP < 0.999;
    var e = easeIO(introP);
    var link = window.innerWidth < 760 ? 120 : 165, link2 = link * link;
    var col = scrollY < introH ? lerp2(CYAN, RED, introP) : RED;

    var i, j, a, b;

    // glowing core — brightens as the lattice forms
    var coreA = inIntro ? e * 0.5 : 0.12;
    var cr = Math.min(W, H) * (inIntro ? lerp(0.22, 0.46, e) : 0.44);
    var cg = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    cg.addColorStop(0, rgba(lerp2(CYAN, RED, inIntro ? introP : 1), coreA));
    cg.addColorStop(0.5, rgba(col, coreA * 0.35));
    cg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = cg; ctx.fillRect(0, 0, W, H);

    // position update
    if (inIntro) {
      fieldOn = false;
      var sw = (1 - e) * 0.9;                 // swirl: targets spin in as they settle
      var cs = Math.cos(sw), sn = Math.sin(sw);
      for (i = 0; i < P.length; i++) {
        var p = P[i];
        var rx = p.tx * cs - p.ty * sn, ry = p.tx * sn + p.ty * cs;
        p.x = lerp(p.sx, cx + rx, e);
        p.y = lerp(p.sy, cy + ry, e);
        p.pulse += 0.02;
      }
    } else {
      if (!fieldOn) { // handoff: seed live positions from formation
        for (i = 0; i < P.length; i++) { P[i].x = cx + P[i].tx; P[i].y = cy + P[i].ty; }
        fieldOn = true;
      }
      for (i = 0; i < P.length; i++) {
        var q = P[i];
        q.x += q.vx; q.y += q.vy; q.pulse += 0.03;
        if (pointer.active) {
          var dx = q.x - pointer.x, dy = q.y - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < 15000 && d2 > 1) { var f = (15000 - d2) / 15000 * 0.8, inv = 1 / Math.sqrt(d2); q.x += dx * inv * f; q.y += dy * inv * f; }
        }
        if (q.x < -20) q.x = W + 20; else if (q.x > W + 20) q.x = -20;
        if (q.y < -20) q.y = H + 20; else if (q.y > H + 20) q.y = -20;
      }
    }

    // intensity: links/nodes brighten as the lattice forms
    var amp = inIntro ? e : 1;

    // links
    ctx.lineWidth = 1;
    for (i = 0; i < P.length; i++) {
      a = P[i];
      for (j = i + 1; j < P.length; j++) {
        b = P[j];
        var ddx = a.x - b.x, ddy = a.y - b.y, dd = ddx * ddx + ddy * ddy;
        if (dd < link2) {
          ctx.strokeStyle = rgba(col, (1 - dd / link2) * 0.18 * amp * Math.min(a.z, b.z));
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }

    // nodes
    for (i = 0; i < P.length; i++) {
      a = P[i];
      var nc = a.t > 0.62 ? CYAN : col;
      var glow = (0.5 + Math.sin(a.pulse) * 0.22) * amp;
      var rr = a.r * (1.5 + Math.sin(a.pulse) * 0.25);
      var g = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, rr * 4);
      g.addColorStop(0, rgba(nc, glow * a.z)); g.addColorStop(1, rgba(nc, 0));
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(a.x, a.y, rr * 4, 0, 6.2832); ctx.fill();
      ctx.fillStyle = rgba(nc, Math.min(1, glow + 0.2) * a.z); ctx.beginPath(); ctx.arc(a.x, a.y, rr, 0, 6.2832); ctx.fill();
    }

    // light packets streaming along the links
    for (i = 0; i < packets.length; i++) {
      var pk = packets[i];
      a = P[pk.a]; b = P[pk.b];
      if (!a || !b) { packets[i] = newPacket(); continue; }
      pk.p += pk.speed * (inIntro ? amp : 1);
      if (pk.p >= 1) { pk.a = pk.b; pk.b = pickNear(pk.a); pk.p = 0; pk.speed = 0.005 + Math.random() * 0.012; }
      var px = a.x + (b.x - a.x) * pk.p, py2 = a.y + (b.y - a.y) * pk.p;
      var pg = ctx.createRadialGradient(px, py2, 0, px, py2, 6);
      pg.addColorStop(0, rgba(WHITE, 0.95 * amp));
      pg.addColorStop(0.4, rgba(CYAN, 0.7 * amp));
      pg.addColorStop(1, rgba(CYAN, 0));
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py2, 6, 0, 6.2832); ctx.fill();
    }
  }

  function lerp2(a, b, t) { return [Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)), Math.round(lerp(a[2], b[2], t))]; }

  function start() { if (!running && !reduce) { running = true; rafId = requestAnimationFrame(frame); } }
  function stop() { running = false; if (rafId) cancelAnimationFrame(rafId); }

  // ---- reduced motion: calm static frame, no scrub ----
  if (reduce) {
    resize();
    introP = 0; updateIntroDOM();
    var ge = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(W, H) * 0.6);
    ge.addColorStop(0, rgba(RED, 0.06)); ge.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = ge; ctx.fillRect(0, 0, W, H);
    canvas.style.opacity = "0.5";
    return;
  }

  resize();
  onScroll();
  start();

  var rT;
  window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(resize, 200); });
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", function (e) { pointer.x = e.clientX; pointer.y = e.clientY; pointer.active = true; }, { passive: true });
  window.addEventListener("pointerleave", function () { pointer.active = false; });
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
})();
