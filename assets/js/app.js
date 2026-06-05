/* ============================================================
   MG TECH — interactive layer
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
  var lenis = null; // smooth-scroll instance (set up below)

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

  /* ---------- Reveal-on-scroll ---------- */
  var revealSelector =
    ".section-title, .section-copy, .text-stack, .apps, .badge-row, " +
    ".table-wrap, .visual-card, .video-layout, .statement, .image-box, .social-strip";

  var io = ("IntersectionObserver" in window)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
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
  }

  function initialLang() {
    var p = new URLSearchParams(window.location.search).get("lang");
    if (p && LANGS.indexOf(p) !== -1) return p;
    try {
      var s = localStorage.getItem(STORAGE_KEY);
      if (s && LANGS.indexOf(s) !== -1) return s;
    } catch (e) {}
    var nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return LANGS.indexOf(nav) !== -1 ? nav : "en";
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
    var userTook = false;
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
      // land at the hero/content (end of the intro) — slow glide so the
      // welcome animation plays out as it descends.
      var target = introEl.offsetHeight - window.innerHeight * 0.04;
      lenis.scrollTo(target, {
        duration: 9,
        easing: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
      });
    }, 4000);
  }
})();
