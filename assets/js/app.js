/* ============================================================
   MG TECH — interactive layer
   Language switching (lang/dir + URL + storage), scroll reveal,
   progress bar, sticky header state, back-to-top.
   ============================================================ */
(function () {
  "use strict";

  var LANGS = ["en", "ru", "tr", "ar", "fa"];
  var RTL = { ar: true, fa: true };
  var STORAGE_KEY = "mgtech-lang";

  // localized intro (welcome) strings
  var INTRO = {
    en: { sub: "Electronic Circuit Waterproofing", hint: "Scroll" },
    ru: { sub: "Гидроизоляция электронных плат", hint: "Прокрутите" },
    tr: { sub: "Elektronik Devre Su Yalıtımı", hint: "Kaydır" },
    ar: { sub: "عزل مائي للدوائر الإلكترونية", hint: "مرّر للأسفل" },
    fa: { sub: "ضدآب‌سازی مدارهای الکترونیکی", hint: "اسکرول کن" },
  };
  var introSubEl = document.querySelector(".intro-sub");
  var introHintTextEl = document.querySelector(".intro-hint b");

  // localized header navigation labels (data-sec -> label)
  var NAV = {
    en: { overview: "About", technology: "Technology", applications: "Applications", tests: "Tests", contact: "Contact" },
    ru: { overview: "О нас", technology: "Технология", applications: "Применение", tests: "Тесты", contact: "Контакты" },
    tr: { overview: "Hakkında", technology: "Teknoloji", applications: "Uygulamalar", tests: "Testler", contact: "İletişim" },
    ar: { overview: "من نحن", technology: "التقنية", applications: "التطبيقات", tests: "الاختبارات", contact: "اتصل بنا" },
    fa: { overview: "درباره", technology: "تکنولوژی", applications: "کاربردها", tests: "تست‌ها", contact: "تماس" },
  };
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var navToggle = document.querySelector(".nav-toggle");
  var curLang = "en";

  var sections = {};
  LANGS.forEach(function (l) {
    sections[l] = document.getElementById("content-" + l);
  });
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".lang-btn"));

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

    document.documentElement.lang = lang;
    document.documentElement.dir = RTL[lang] ? "rtl" : "ltr";

    var it = INTRO[lang] || INTRO.en;
    if (introSubEl) introSubEl.textContent = it.sub;
    if (introHintTextEl) introHintTextEl.textContent = it.hint;

    var nv = NAV[lang] || NAV.en;
    navLinks.forEach(function (a) {
      var label = nv[a.dataset.sec];
      if (label) a.textContent = label;
    });

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
    b.addEventListener("click", function () { setLang(b.dataset.lang, true); });
  });

  /* ---------- Header navigation ---------- */
  var headerEl = document.querySelector(".site-header");
  function closeMenu() {
    if (headerEl) headerEl.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }
  navLinks.forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var el = document.getElementById(curLang + "-" + a.dataset.sec);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    });
  });
  if (navToggle && headerEl) {
    navToggle.addEventListener("click", function () {
      var open = headerEl.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
})();
