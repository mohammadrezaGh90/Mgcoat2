/* ============================================================
   MG COAT — interactive layer
   Language switching (lang/dir + URL + storage), scroll reveal,
   progress bar, sticky header state, back-to-top.
   ============================================================ */
(function () {
  "use strict";

  // Always open at the very top (the intro), never restore a deep position.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo(0, 0);
  window.addEventListener("load", function () { window.scrollTo(0, 0); });

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var lenis = null;       // smooth-scroll instance (set up below)
  var userTook = false;   // set once the visitor takes manual control of scroll

  var LANGS = ["en", "ru", "tr", "ar", "fa"];
  var RTL = { ar: true, fa: true };
  var STORAGE_KEY = "mgtech-lang";

  // localized intro (welcome) strings
  var INTRO = {
    en: { sub: "Electronic Circuit Waterproofing", tag: "Waterproof · Reinforced · Heat‑free", hint: "Scroll" },
    ru: { sub: "Гидроизоляция электронных плат", tag: "Влагозащита · Усиление · Без нагрева", hint: "Прокрутите" },
    tr: { sub: "Elektronik Devre Su Yalıtımı", tag: "Su yalıtımı · Güçlendirme · Isısız", hint: "Kaydır" },
    ar: { sub: "عزل مائي للدوائر الإلكترونية", tag: "عازل للماء · معزّز · بدون حرارة", hint: "مرّر للأسفل" },
    fa: { sub: "ضدآب‌سازی مدارهای الکترونیکی", tag: "ضدآب · مقاوم · بدون حرارت", hint: "اسکرول کن" },
  };
  var introSubEl = document.querySelector(".intro-sub");
  var introTagEl = document.querySelector(".intro-tag");
  var introHintTextEl = document.querySelector(".intro-hint b");

  // localized header navigation labels (data-sec -> label)
  var NAV = {
    en: { overview: "About", technology: "Technology", applications: "Applications", tests: "Tests", faq: "FAQ", partners: "Partners", contact: "Contact" },
    ru: { overview: "О нас", technology: "Технология", applications: "Применение", tests: "Тесты", faq: "Вопросы", partners: "Партнёрам", contact: "Контакты" },
    tr: { overview: "Hakkında", technology: "Teknoloji", applications: "Uygulamalar", tests: "Testler", faq: "SSS", partners: "İş Ortaklığı", contact: "İletişim" },
    ar: { overview: "من نحن", technology: "التقنية", applications: "التطبيقات", tests: "الاختبارات", faq: "الأسئلة", partners: "الشراكة", contact: "اتصل بنا" },
    fa: { overview: "درباره", technology: "تکنولوژی", applications: "کاربردها", tests: "تست‌ها", faq: "سؤالات", partners: "همکاری با ما", contact: "تماس" },
  };
  var CATW = { en: "Catalogue", ru: "Каталог", tr: "Katalog", ar: "الكتالوج", fa: "کاتالوگ" };
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var navToggle = document.querySelector(".nav-toggle");
  var curLang = "en";

  /* ---------- Scroll-spy: auto-highlight the nav item in view ---------- */
  var spyObserver = null;
  function setActiveNav(sec) {
    navLinks.forEach(function (a) {
      if (a.dataset.sec) a.classList.toggle("active", a.dataset.sec === sec);
    });
  }
  function armSpy(lang) {
    if (!("IntersectionObserver" in window)) return;
    if (spyObserver) spyObserver.disconnect();
    spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) setActiveNav(e.target.id.slice(lang.length + 1));
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    navLinks.forEach(function (a) {
      if (!a.dataset.sec) return;
      var el = document.getElementById(lang + "-" + a.dataset.sec);
      if (el) spyObserver.observe(el);
    });
  }

  var sections = {};
  LANGS.forEach(function (l) {
    sections[l] = document.getElementById("content-" + l);
  });
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".lang-btn"));

  /* ---------- Language dropdown ---------- */
  var langSelect = document.querySelector(".lang-select");
  var langTrigger = document.querySelector(".lang-trigger");
  var ltFlag = document.querySelector(".lt-flag");
  var ltName = document.querySelector(".lt-name");
  var ltLabel = document.querySelector(".lt-label");
  var LANG_INFO = {};
  buttons.forEach(function (b) {
    var sp = b.querySelectorAll("span");
    LANG_INFO[b.dataset.lang] = { flag: sp[0] ? sp[0].textContent : "", name: sp[1] ? sp[1].textContent : b.dataset.lang };
  });
  function closeLangMenu() {
    if (langSelect) langSelect.classList.remove("open");
    if (langTrigger) langTrigger.setAttribute("aria-expanded", "false");
  }
  if (langTrigger && langSelect) {
    langTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = langSelect.classList.toggle("open");
      langTrigger.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", function (e) {
      if (!langSelect.contains(e.target)) closeLangMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLangMenu(); });
  }

  /* ---------- Attention cue: neon flash + in-place language preview ----------
     After the elevator glide finishes (and a 1s beat), glow the language pill
     in red neon for ~3s and softly roll its flag/name through the languages
     (without opening the menu), settling back on the current one. This only
     previews the label — the page language never changes here; it changes
     only when the visitor picks one. Runs at most once per page load. */
  var attractShown = false, attractQueued = false;
  function queueAttract(delay) {
    if (attractQueued || attractShown) return;
    attractQueued = true;
    setTimeout(flashLangSwitcher, delay || 0);
  }
  function flashLangSwitcher() {
    if (attractShown || reduceMotion) return;
    attractShown = true;
    if (!langSelect || !ltLabel || !ltFlag || !ltName) return;
    langSelect.classList.add("attract");
    // roll through the other languages twice, then settle on the current one,
    // spread over ~3s so each name glides in softly and stays readable.
    var others = LANGS.filter(function (l) { return l !== curLang; });
    var seq = others.concat(others).concat(curLang);
    function rollTo(lang) {
      var info = LANG_INFO[lang];
      if (info) { ltFlag.textContent = info.flag; ltName.textContent = info.name; }
      ltLabel.classList.remove("roll");
      void ltLabel.offsetWidth;   // force reflow so the roll animation restarts
      ltLabel.classList.add("roll");
    }
    var i = 0;
    rollTo(seq[i++]);             // first frame immediately
    var iv = setInterval(function () {
      rollTo(seq[i]);
      i++;
      if (i >= seq.length) {
        clearInterval(iv);
        langSelect.classList.remove("attract"); // ends on the real (current) language
      }
    }, 360);
  }

  /* ---------- Reveal-on-scroll ---------- */
  var revealSelector =
    ".section-title, .section-copy, .text-stack, .apps, .badge-row, " +
    ".table-wrap, .visual-card, .video-layout, .statement, .image-box, .social-strip";

  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var el = e.target;
            el.classList.add("is-visible");
            io.unobserve(el);
            // After the blur-in finishes, drop the filter layer so it ends fully
            // crisp (iOS Safari otherwise keeps the card on a blurry/matte layer).
            setTimeout(function () {
              el.classList.add("reveal-done");
              Array.prototype.forEach.call(el.children, function (ch) { ch.style.animation = "none"; });
            }, 850);
          }
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 })
    : null;

  function armReveal(root) {
    var els = root.querySelectorAll(revealSelector);
    Array.prototype.forEach.call(els, function (el) {
      el.classList.add("js-reveal");
      if (io) io.observe(el);
      else el.classList.add("is-visible");
    });
  }

  /* ---------- Language switching ---------- */
  function setLang(lang, push) {
    if (LANGS.indexOf(lang) === -1) lang = "en";
    curLang = lang;

    LANGS.forEach(function (l) {
      if (sections[l]) sections[l].hidden = (l !== lang);
    });
    buttons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    var info = LANG_INFO[lang];
    if (info) { if (ltFlag) ltFlag.textContent = info.flag; if (ltName) ltName.textContent = info.name; }

    document.documentElement.lang = lang;
    document.documentElement.dir = RTL[lang] ? "rtl" : "ltr";

    var it = INTRO[lang] || INTRO.en;
    if (introSubEl) introSubEl.textContent = it.sub;
    if (introTagEl) introTagEl.textContent = it.tag;
    if (introHintTextEl) introHintTextEl.textContent = it.hint;

    var nv = NAV[lang] || NAV.en;
    navLinks.forEach(function (a) {
      var label = nv[a.dataset.sec];
      if (label) a.textContent = label;
    });
    var catLink = document.querySelector('.nav-ext[data-ext="catalog"]');
    if (catLink) catLink.textContent = CATW[lang] || CATW.en;

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    if (push && window.history && history.replaceState) {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      history.replaceState({ lang: lang }, "", url);
    }

    if (sections[lang]) armReveal(sections[lang]);
    armSpy(lang);
  }

  function initialLang() {
    // Always open in English by default. Only an explicit ?lang= URL param
    // (e.g. a shared deep link) overrides — saved/browser language is ignored.
    var p = new URLSearchParams(window.location.search).get("lang");
    if (p && LANGS.indexOf(p) !== -1) return p;
    return "en";
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang, true); closeLangMenu(); });
  });

  /* ---------- Header navigation ---------- */
  var headerEl = document.querySelector(".site-header");
  function closeMenu() {
    if (headerEl) headerEl.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  navLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      if (!a.dataset.sec) return; // external links (e.g. catalogue) navigate normally
      e.preventDefault();
      navLinks.forEach(function (x) { if (x.dataset.sec) x.classList.remove("active"); });
      a.classList.add("active"); // bold neon stays on the chosen item
      var el = document.getElementById(curLang + "-" + a.dataset.sec);
      if (el) { if (lenis) lenis.scrollTo(el, { offset: -64 }); else el.scrollIntoView({ behavior: "smooth", block: "start" }); }
      closeMenu();
    });
  });
  if (navToggle && headerEl) {
    navToggle.addEventListener("click", function () {
      var open = headerEl.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------- WhatsApp order form ---------- */
  Array.prototype.forEach.call(document.querySelectorAll(".wa-form"), function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      function v(n) { var el = f.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; }
      var d = f.dataset, lines = [d.prefix || ""];
      var name = v("name"), phone = v("phone"), need = v("need"), msg = v("message");
      var city = v("city"), country = v("country"), address = v("address"), location = v("location");
      if (name) lines.push(d.lname + ": " + name);
      if (phone) lines.push(d.lphone + ": " + phone);
      if (need && d.lneed) lines.push(d.lneed + ": " + need);
      if (city && d.lcity) lines.push(d.lcity + ": " + city);
      if (country && d.lcountry) lines.push(d.lcountry + ": " + country);
      if (address && d.laddress) lines.push(d.laddress + ": " + address);
      if (location && d.llocation) lines.push(d.llocation + ": " + location);
      if (msg && d.lmsg) lines.push(d.lmsg + ": " + msg);
      window.open("https://wa.me/" + d.wa + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
    });
  });

  /* ---------- Application cards: click selects one (single-select red accent) ---------- */
  var appCards = Array.prototype.slice.call(document.querySelectorAll(".app-card"));
  appCards.forEach(function (c) {
    c.addEventListener("click", function () {
      var was = c.classList.contains("tapped");
      appCards.forEach(function (x) { x.classList.remove("tapped"); });
      if (!was) c.classList.add("tapped"); // only one card keeps the red line
    });
  });

  /* ---------- Animated stat counters ---------- */
  function runCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var valEl = el.querySelector(".val"); if (!valEl) return;
    var start = null, dur = 1400;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      valEl.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var nums = Array.prototype.slice.call(document.querySelectorAll(".stat-num"));
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { cio.observe(n); });
  } else {
    nums.forEach(runCount);
  }

  /* ---------- Background motion video: robust autoplay ----------
     Native autoplay is unreliable on iOS (Low Power Mode, and videos that
     start inside a hidden language section). Drive it from JS: keep it muted
     + inline, play when scrolled into view, pause when out, and retry on the
     first user gesture and on tab refocus. Honors reduced-motion. */
  (function () {
    var vids = Array.prototype.slice.call(document.querySelectorAll(".visual-video video"));
    if (!vids.length) return;

    vids.forEach(function (v) {
      v.muted = true;            // attribute alone isn't always honored before play()
      v.defaultMuted = true;
      v.playsInline = true;
      v.setAttribute("muted", "");
      v.setAttribute("playsinline", "");
    });

    if (reduceMotion) return;    // leave the poster frame for reduced-motion users

    function tryPlay(v) {
      if (!v) return;
      var p = v.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
    }
    function playVisible() {
      vids.forEach(function (v) {
        // a video inside a hidden language section has no layout box
        if (v.offsetParent !== null || v.getClientRects().length) tryPlay(v);
      });
    }

    if ("IntersectionObserver" in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) tryPlay(e.target);
          else if (!e.target.paused) e.target.pause();
        });
      }, { threshold: 0.1 });
      vids.forEach(function (v) { vio.observe(v); });
    } else {
      vids.forEach(tryPlay);
    }

    // iOS blocks muted autoplay until a user gesture — retry once one happens.
    ["touchstart", "pointerdown", "click", "keydown"].forEach(function (ev) {
      window.addEventListener(ev, playVisible, { passive: true, once: true });
    });
    // Resume after returning to the tab (iOS pauses on background).
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) playVisible();
    });
  })();

  setLang(initialLang(), false);

  /* ---------- Scroll progress + header state + back-to-top ---------- */
  var bar = document.getElementById("scroll-progress");
  var header = document.querySelector(".site-header");
  var toTop = document.getElementById("to-top");
  var ticking = false;

  function onScroll() {
    var st = window.pageYOffset || document.documentElement.scrollTop;
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (st / h) * 100 : 0) + "%";
    if (header) header.classList.toggle("scrolled", st > 8);
    if (toTop) {
      var show = st > 600;
      toTop.hidden = false;
      toTop.classList.toggle("show", show);
    }
    // fallback: if the visitor scrolls themselves (so the auto-glide never
    // runs / never fires its onComplete), still cue the pill ~1s after they
    // reach the hero.
    if (st > window.innerHeight * 0.85 && (userTook || !lenis)) queueAttract(1000);
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { window.requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Smooth scrolling (Lenis) ---------- */
  if (window.Lenis && !reduceMotion) {
    lenis = new window.Lenis({
      lerp: 0.085,          // soft easing — fast input still glides down gently
      wheelMultiplier: 0.9,
      smoothWheel: true,
      syncTouch: true,      // also smooth touch/flick scrolling on mobile
      syncTouchLerp: 0.08,
    });
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    lenis.scrollTo(0, { immediate: true });

    /* ---------- "Elevator": auto-glide through the intro if idle ---------- */
    function takeOver() {
      if (userTook) return;
      userTook = true;
      if (lenis) lenis.stop();           // cancel any auto-scroll in progress
      setTimeout(function () { if (lenis) lenis.start(); }, 30);
    }
    ["wheel", "touchstart", "keydown", "pointerdown"].forEach(function (ev) {
      window.addEventListener(ev, takeOver, { passive: true, once: true });
    });
    var introEl = document.getElementById("intro");
    setTimeout(function () {
      if (userTook) return;
      if ((window.pageYOffset || 0) > 12) return;     // already scrolled
      if (!introEl) return;
      // land at the hero/content (end of the intro) — gentle glide so the
      // welcome animation plays out as it descends, with a soft "feathered"
      // landing (quintic ease-in-out: long decelerating tail = calm finish).
      var target = introEl.offsetHeight - window.innerHeight * 0.04;
      lenis.scrollTo(target, {
        duration: 7,
        easing: function (t) {
          return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
        },
        onComplete: function () { queueAttract(1000); }, // 1s beat, then the pill cue
      });
    }, 2000);
  }
})();
