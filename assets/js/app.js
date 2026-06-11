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
      cancelAttract();   // user is interacting with the switcher — stop the preview
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
  var attractShown = false, attractQueued = false, attractIv = null;
  function queueAttract(delay) {
    if (attractQueued || attractShown) return;
    attractQueued = true;
    setTimeout(flashLangSwitcher, delay || 0);
  }
  // cancel the preview and lock the pill onto the real current language
  function cancelAttract() {
    attractShown = true;                 // never run/replay after this
    if (attractIv) { clearInterval(attractIv); attractIv = null; }
    if (langSelect) langSelect.classList.remove("attract");
    if (ltLabel) ltLabel.classList.remove("roll");
    var info = LANG_INFO[curLang] || LANG_INFO.en;
    if (info && ltFlag && ltName) { ltFlag.textContent = info.flag; ltName.textContent = info.name; }
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
    attractIv = setInterval(function () {
      rollTo(seq[i]);
      i++;
      if (i >= seq.length) {
        clearInterval(attractIv); attractIv = null;
        langSelect.classList.remove("attract"); // ends on the real (current) language
      }
    }, 360);
  }
  // lock the pill width to the widest language so it never resizes mid-preview
  function fixLangPillWidth() {
    var view = document.querySelector(".lt-view");
    if (!view || !ltLabel || !ltFlag || !ltName) return;
    var keepF = ltFlag.textContent, keepN = ltName.textContent, max = 0;
    LANGS.forEach(function (l) {
      var info = LANG_INFO[l]; if (!info) return;
      ltFlag.textContent = info.flag; ltName.textContent = info.name;
      if (ltLabel.offsetWidth > max) max = ltLabel.offsetWidth;
    });
    ltFlag.textContent = keepF; ltName.textContent = keepN;
    if (max) view.style.minWidth = max + "px";
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
      // real anchors (not href="#") — correct fallback/SEO and a11y
      if (a.dataset.sec) a.setAttribute("href", "#" + lang + "-" + a.dataset.sec);
    });
    var catLink = document.querySelector('.nav-ext[data-ext="catalog"]');
    if (catLink) catLink.textContent = CATW[lang] || CATW.en;
    if (typeof updateTiltLabel === "function") updateTiltLabel(lang);

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}

    if (push && window.history && history.replaceState) {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      history.replaceState({ lang: lang }, "", url);
    }

    if (sections[lang]) armReveal(sections[lang]);
    armSpy(lang);
    closeBadgePop();      // badge popover holds old-language text
    syncAssist(lang);     // assistant greeting/chips follow the language
  }

  function initialLang() {
    // Always open in English by default. Only an explicit ?lang= URL param
    // (e.g. a shared deep link) overrides — saved/browser language is ignored.
    var p = new URLSearchParams(window.location.search).get("lang");
    if (p && LANGS.indexOf(p) !== -1) return p;
    return "en";
  }

  buttons.forEach(function (b) {
    b.addEventListener("click", function () { cancelAttract(); setLang(b.dataset.lang, true); closeLangMenu(); });
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

  /* ============================================================
     Tappable hero badges — small localized popover per badge
     ============================================================ */
  var BADGE_SEC = ["technology", "technology", "technology", "tests", "tests", "technology"];
  var BADGE_TIPS = {
    en: { more: "Learn more →", tips: [
      "A liquid nano-engineered layer that bonds to the board surface, sealing every trace and joint against water, humidity and corrosion.",
      "Applies and cures at room temperature — no oven, no pre-heating. Safe even for heat-sensitive components and field repairs.",
      "Layers stack perfectly: build from a thin film up to a thick reinforced barrier on edges, cable entries and repair zones.",
      "Designed for 10+ years of protection under correct application and full curing — a long-term shield, not a temporary fix.",
      "With proper sealing the system can be engineered for continuous immersion at 100 m depth and beyond. See our real water tests.",
      "The non-transparent layer hides components and traces, making visual copying and reverse engineering far harder."
    ]},
    ru: { more: "Подробнее →", tips: [
      "Жидкий наноструктурированный слой сцепляется с поверхностью платы, герметизируя дорожки и соединения от воды, влаги и коррозии.",
      "Наносится и отверждается при комнатной температуре — без печи и нагрева. Безопасно даже для термочувствительных компонентов.",
      "Слои идеально совмещаются: от тонкой плёнки до усиленного барьера на кромках, кабельных вводах и зонах ремонта.",
      "Рассчитано на 10+ лет защиты при правильном нанесении и полном отверждении — долговременный щит, а не временное решение.",
      "При правильной герметизации система рассчитана на постоянное погружение на глубину 100 м и более. Смотрите наши тесты.",
      "Непрозрачный слой скрывает компоненты и дорожки, заметно усложняя копирование и реверс-инжиниринг."
    ]},
    tr: { more: "Daha fazla →", tips: [
      "Sıvı nano katman kart yüzeyine bağlanır; tüm hatları ve bağlantıları suya, neme ve korozyona karşı mühürler.",
      "Oda sıcaklığında uygulanır ve kurur — fırın yok, ısıtma yok. Isıya duyarlı bileşenler için bile güvenlidir.",
      "Katmanlar üst üste mükemmel uyum sağlar: ince filmden, kenarlarda ve kablo girişlerinde kalın güçlendirilmiş bariyere.",
      "Doğru uygulama ve tam kürlenmeyle 10+ yıl koruma hedefiyle tasarlandı — geçici değil, uzun vadeli bir kalkan.",
      "Doğru sızdırmazlıkla sistem, 100 m ve üzeri derinlikte sürekli daldırma için tasarlanabilir. Gerçek su testlerimize bakın.",
      "Opak katman bileşenleri ve hatları gizler; görsel kopyalamayı ve tersine mühendisliği çok zorlaştırır."
    ]},
    ar: { more: "اعرف المزيد ←", tips: [
      "طبقة نانوية سائلة تلتصق بسطح اللوحة وتُحكم إغلاق المسارات والوصلات ضد الماء والرطوبة والتآكل.",
      "تُطبَّق وتجفّ في درجة حرارة الغرفة — بلا فرن ولا تسخين. آمنة حتى للمكوّنات الحسّاسة للحرارة.",
      "الطبقات تتراكب بتوافق تام: من غشاء رقيق إلى حاجز سميك معزّز على الحواف ومداخل الكابلات ومناطق الإصلاح.",
      "مصمَّم لحماية تتجاوز 10 سنوات مع التطبيق الصحيح والجفاف الكامل — درع طويل الأمد لا حلّ مؤقت.",
      "مع الإحكام الصحيح يمكن هندسة النظام للغمر المستمر حتى عمق 100 متر وأكثر. شاهد اختبارات الماء الحقيقية.",
      "الطبقة غير الشفافة تخفي المكوّنات والمسارات، فتجعل النسخ والهندسة العكسية أصعب بكثير."
    ]},
    fa: { more: "بیشتر بدانید ←", tips: [
      "لایه‌ای نانومهندسی‌شده و مایع که به سطح برد می‌چسبد و تمام مسیرها و اتصالات را در برابر آب، رطوبت و خوردگی مهروموم می‌کند.",
      "در دمای اتاق اجرا و خشک می‌شود — بدون کوره و حرارت. حتی برای قطعات حساس به گرما و تعمیرات میدانی امن است.",
      "لایه‌ها روی هم می‌نشینند: از یک فیلم نازک تا سپر ضخیم و تقویت‌شده روی لبه‌ها، ورودی کابل و نقاط تعمیر.",
      "برای ۱۰ سال+ محافظت طراحی شده (با اجرای صحیح و خشک‌شدن کامل) — یک سپر بلندمدت، نه راه‌حل موقت.",
      "با آب‌بندی صحیح، سیستم برای غوطه‌وری دائم تا عمق ۱۰۰ متر و بیشتر قابل مهندسی است. تست‌های واقعی آب را ببینید.",
      "لایهٔ غیرشفاف قطعات و مسیرها را پنهان می‌کند و کپی‌برداری و مهندسی معکوس را بسیار دشوار می‌سازد."
    ]}
  };
  var badgePop = document.createElement("div");
  badgePop.className = "badge-pop";
  document.body.appendChild(badgePop);
  var badgeOpenEl = null;
  function closeBadgePop() {
    badgePop.classList.remove("show");
    if (badgeOpenEl) { badgeOpenEl.classList.remove("open"); badgeOpenEl = null; }
  }
  function scrollToSec(sec) {
    var el = document.getElementById(curLang + "-" + sec);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -64 }); else el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function openBadgePop(span) {
    var row = span.parentElement;
    var idx = Array.prototype.indexOf.call(row.children, span);
    var pack = BADGE_TIPS[curLang] || BADGE_TIPS.en;
    var tip = pack.tips[idx];
    if (!tip) return;
    badgePop.innerHTML = "";
    var p = document.createElement("p"); p.textContent = tip; badgePop.appendChild(p);
    var more = document.createElement("button");
    more.type = "button"; more.className = "bp-more"; more.textContent = pack.more;
    more.addEventListener("click", function () { closeBadgePop(); scrollToSec(BADGE_SEC[idx] || "technology"); });
    badgePop.appendChild(more);
    var r = span.getBoundingClientRect();
    var pw = Math.min(300, window.innerWidth * 0.86);
    var left = Math.max(12, Math.min(r.left + window.pageXOffset, document.documentElement.clientWidth - pw - 12));
    badgePop.style.left = left + "px";
    badgePop.style.top = (r.bottom + window.pageYOffset + 10) + "px";
    badgePop.classList.add("show");
    badgeOpenEl = span; span.classList.add("open");
  }
  Array.prototype.forEach.call(document.querySelectorAll(".badge-row span"), function (s) {
    s.setAttribute("role", "button"); s.setAttribute("tabindex", "0");
    s.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); s.click(); }
    });
  });
  document.addEventListener("click", function (e) {
    var span = e.target.closest ? e.target.closest(".badge-row span") : null;
    if (span) {
      if (badgeOpenEl === span) { closeBadgePop(); return; }
      closeBadgePop(); openBadgePop(span); return;
    }
    if (!badgePop.contains(e.target)) closeBadgePop();
  });
  window.addEventListener("resize", closeBadgePop);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeBadgePop(); });

  /* ============================================================
     Site assistant — search + keyword Q&A over a built-in
     knowledge base (static site: no server, so matching is
     keyword-based; WhatsApp is the human fallback)
     ============================================================ */
  var WA_URL = "https://wa.me/905528767973";
  // Optional AI backend (Cloudflare Worker). When set, the assistant sends the
  // question to a real model for an open-ended answer; when empty or on error,
  // it falls back to the built-in keyword knowledge base below.
  var ASSIST_API = ""; // e.g. "https://mgcoat-assistant.<your>.workers.dev"
  var assistHistory = [];   // [{role:"user"|"assistant", content:"..."}]
  var assistBusy = false;
  var ASSIST_UI = {
    en: { title: "MG COAT Assistant", hi: "Hi! 👋 I'm the MG COAT assistant. Ask me anything about the coating — or tap a question below.",
          ph: "Ask or search…", no: "I don't have an exact answer for that yet — our team replies fast on WhatsApp!", wa: "Chat on WhatsApp",
          chips: ["What is MG COAT?", "Does it work underwater?", "How is it applied?", "How can I order?"] },
    ru: { title: "Ассистент MG COAT", hi: "Здравствуйте! 👋 Я ассистент MG COAT. Спросите что угодно о покрытии — или нажмите на вопрос ниже.",
          ph: "Спросите или найдите…", no: "Точного ответа пока нет — наша команда быстро отвечает в WhatsApp!", wa: "Написать в WhatsApp",
          chips: ["Что такое MG COAT?", "Работает под водой?", "Как наносится?", "Как заказать?"] },
    tr: { title: "MG COAT Asistanı", hi: "Merhaba! 👋 MG COAT asistanıyım. Kaplama hakkında her şeyi sorabilirsiniz — veya aşağıdaki sorulara dokunun.",
          ph: "Sorun veya arayın…", no: "Bunun için net bir cevabım yok — ekibimiz WhatsApp'tan hızla yanıtlıyor!", wa: "WhatsApp'tan yazın",
          chips: ["MG COAT nedir?", "Su altında çalışır mı?", "Nasıl uygulanır?", "Nasıl sipariş verilir?"] },
    ar: { title: "مساعد MG COAT", hi: "مرحباً! 👋 أنا مساعد MG COAT. اسألني أي شيء عن الطلاء — أو اضغط على سؤال أدناه.",
          ph: "اسأل أو ابحث…", no: "ليس لديّ إجابة دقيقة بعد — فريقنا يرد سريعاً على واتساب!", wa: "تواصل عبر واتساب",
          chips: ["ما هو MG COAT؟", "هل يعمل تحت الماء؟", "كيف يُطبَّق؟", "كيف أطلب؟"] },
    fa: { title: "دستیار MG COAT", hi: "سلام! 👋 من دستیار MG COAT هستم. هر سؤالی دربارهٔ پوشش داری بپرس — یا یکی از سؤال‌های زیر را لمس کن.",
          ph: "بپرس یا جستجو کن…", no: "هنوز جواب دقیقی برای این ندارم — تیم ما در واتساپ سریع پاسخ می‌دهد!", wa: "گفتگو در واتساپ",
          chips: ["MG COAT چیست؟", "زیر آب کار می‌کند؟", "چطور اجرا می‌شود؟", "چطور سفارش بدهم؟"] }
  };
  /* entries: k = keywords (substring match), a = answer, l = links [{s:sectionId}|{h:href}, t:label] */
  var ASSIST_KB = {
    en: [
      { k: ["what is", "about", "product", "mg coat", "mgcoat", "coating", "liquid"], a: "MG COAT Liquid PCB Plastic Coating is an industrial, plastic-based nano protective coating that waterproofs PCBs, sensors and electronic circuits — a strong, non-transparent, mechanically resistant layer, with no heat needed.", l: [{ s: "overview", t: "About →" }, { s: "technology", t: "Technology →" }] },
      { k: ["heat", "oven", "cure", "curing", "temperature", "bake"], a: "No heat at all — it applies and fully cures at room temperature, so it's safe for heat-sensitive components and field repair.", l: [{ s: "technology", t: "Technology →" }] },
      { k: ["water", "underwater", "immersion", "depth", "waterproof", "100", "sea", "rain", "humidity", "moisture", "ip68"], a: "Yes — with correct sealing and full curing the system can be engineered for continuous immersion at 100 m and beyond. We show real water tests on the site.", l: [{ s: "tests", t: "Tests →" }, { s: "video", t: "Watch the test →" }] },
      { k: ["apply", "spray", "dip", "brush", "how to use", "install", "masking"], a: "Three methods: dipping for full coverage, spraying for even layers, and brush for local reinforcement (edges, cable entries, repair zones). Connectors and serviceable parts should be masked first.", l: [{ s: "technology", t: "Technology →" }, { h: "/blog/how-to-waterproof-a-pcb.html", t: "Guide: waterproof a PCB" }] },
      { k: ["price", "cost", "quote", "order", "buy", "purchase", "payment", "ship"], a: "Send your request via the order form or WhatsApp — we reply quickly with pricing and details for your exact use case.", l: [{ s: "contact", t: "Order form →" }, { h: WA_URL, t: "WhatsApp" }] },
      { k: ["ecu", "car", "automotive", "drone", "fpv", "cctv", "camera", "led", "marine", "boat", "solar", "ev", "bms", "telecom", "motorcycle", "use case"], a: "It protects automotive ECUs, drones/FPV, CCTV, LED boards, marine sensors, EV/BMS, solar inverters, telecom units, power supplies and repair-shop work.", l: [{ s: "applications", t: "Applications →" }] },
      { k: ["remove", "removal", "repair", "rework", "solvent", "fix", "service"], a: "Yes — it's removable with a dedicated solvent, so boards stay serviceable: rework one point, then re-coat to restore full protection.", l: [{ h: "/blog/how-to-remove-conformal-coating-pcb.html", t: "Guide: removing the coating" }] },
      { k: ["color", "colour", "black", "white", "gray", "grey"], a: "Black, white and gray are standard; custom colors are available for industrial and private-label orders. The layer is non-transparent by design.", l: [{ s: "technology", t: "Technology →" }] },
      { k: ["catalog", "catalogue", "brochure", "pdf", "download"], a: "The full catalogue is available in 5 languages as PDF:", l: [{ h: "/catalog/", t: "Catalogue ↓" }] },
      { k: ["white paper", "whitepaper", "datasheet", "technical doc", "specification", "spec", "paper"], a: "Our technical white paper (EN/RU/TR/AR/FA) covers the science, comparisons and test framework:", l: [{ h: "/whitepaper/", t: "White paper ↓" }] },
      { k: ["partner", "reseller", "distributor", "wholesale", "agency", "represent"], a: "We welcome partners in sales, repair and industry — become the MG COAT reseller in your region.", l: [{ s: "partners", t: "Partnership →" }] },
      { k: ["durab", "year", "lifetime", "long", "warranty", "scratch", "strength", "mechanical", "hard"], a: "After full curing it forms a hard, scratch-resistant layer with a 10-year-plus design target under correct application and conditions.", l: [{ s: "tests", t: "Tests →" }] },
      { k: ["phone", "call", "number", "contact", "reach", "telephone", "whatsapp"], a: "You can reach us directly — our phone is the same as our WhatsApp: +90 552 876 7973. Tap to chat:", l: [{ h: WA_URL, t: "WhatsApp / Call" }, { s: "contact", t: "Contact →" }] },
      { k: ["address", "location", "where", "based", "office", "country", "city", "istanbul", "turkey"], a: "We're based in Istanbul, Turkey, and serve customers there, in Iran and worldwide.", l: [{ s: "contact", t: "Contact →" }, { h: WA_URL, t: "WhatsApp" }] }
    ],
    ru: [
      { k: ["что такое", "о продукте", "mg coat", "mgcoat", "покрытие", "продукт"], a: "MG COAT Liquid PCB Plastic Coating — промышленное наноз­ащитное покрытие на пластиковой основе: гидроизолирует платы, датчики и схемы, образуя прочный непрозрачный механически стойкий слой без нагрева.", l: [{ s: "overview", t: "О нас →" }, { s: "technology", t: "Технология →" }] },
      { k: ["нагрев", "печь", "температур", "отвержд", "запек"], a: "Нагрев не нужен — наносится и полностью отверждается при комнатной температуре. Безопасно для термочувствительных компонентов.", l: [{ s: "technology", t: "Технология →" }] },
      { k: ["вода", "под водой", "погружен", "глубин", "гидроизоляц", "влага", "дожд", "море", "100"], a: "Да — при правильной герметизации и полном отверждении система рассчитана на постоянное погружение на 100 м и более. На сайте есть реальные тесты с водой.", l: [{ s: "tests", t: "Тесты →" }, { s: "video", t: "Смотреть тест →" }] },
      { k: ["нанес", "распыл", "окунан", "кист", "как использ", "примен", "маскир"], a: "Три способа: окунание для полного покрытия, распыление для равномерных слоёв, кисть для локального усиления (кромки, кабельные вводы, зоны ремонта). Разъёмы предварительно маскируются.", l: [{ s: "technology", t: "Технология →" }] },
      { k: ["цена", "стоимост", "заказ", "купить", "оплат", "прайс", "доставк"], a: "Отправьте запрос через форму заказа или WhatsApp — мы быстро ответим с ценой и деталями под вашу задачу.", l: [{ s: "contact", t: "Форма заказа →" }, { h: WA_URL, t: "WhatsApp" }] },
      { k: ["эбу", "ecu", "авто", "дрон", "fpv", "камер", "светодиод", "led", "морск", "солнечн", "телеком", "мото"], a: "Защищает автомобильные ЭБУ, дроны/FPV, камеры видеонаблюдения, LED-платы, морские датчики, EV/BMS, солнечные инверторы, телеком-блоки и ремонтные работы.", l: [{ s: "applications", t: "Применение →" }] },
      { k: ["снять", "удал", "ремонт", "растворител", "довод"], a: "Да — покрытие снимается специальным растворителем, платы остаются ремонтопригодными: доработайте точку и нанесите слой заново.", l: [{ h: "/blog/how-to-remove-conformal-coating-pcb.html", t: "Гид: удаление покрытия" }] },
      { k: ["цвет", "чёрн", "черн", "бел", "сер"], a: "Стандартные цвета: чёрный, белый, серый; для промышленных и private-label заказов возможны свои цвета. Слой непрозрачный по дизайну.", l: [{ s: "technology", t: "Технология →" }] },
      { k: ["каталог", "брошюр", "pdf", "скачать"], a: "Полный каталог доступен на 5 языках в PDF:", l: [{ h: "/catalog/", t: "Каталог ↓" }] },
      { k: ["white paper", "технич", "документ", "даташит", "спецификац"], a: "Наш технический white paper (EN/RU/TR/AR/FA) — наука, сравнения и методика испытаний:", l: [{ h: "/whitepaper/", t: "White paper ↓" }] },
      { k: ["партн", "дилер", "дистриб", "опт", "представит"], a: "Мы открыты к партнёрству в продажах, ремонте и промышленности — станьте реселлером MG COAT в своём регионе.", l: [{ s: "partners", t: "Партнёрам →" }] },
      { k: ["долговечн", "срок", "лет", "гарант", "царапин", "прочн", "механ"], a: "После полного отверждения образуется твёрдый, стойкий к царапинам слой с расчётным сроком службы 10+ лет при правильном нанесении.", l: [{ s: "tests", t: "Тесты →" }] },
      { k: ["телефон", "звон", "номер", "контакт", "связ", "whatsapp", "ватсап"], a: "Свяжитесь с нами напрямую — телефон совпадает с WhatsApp: +90 552 876 7973. Нажмите, чтобы написать:", l: [{ h: WA_URL, t: "WhatsApp / Звонок" }, { s: "contact", t: "Контакты →" }] },
      { k: ["адрес", "где наход", "локац", "город", "страна", "стамбул", "турци", "офис"], a: "Мы находимся в Стамбуле (Турция) и работаем с клиентами там, в Иране и по всему миру.", l: [{ s: "contact", t: "Контакты →" }, { h: WA_URL, t: "WhatsApp" }] }
    ],
    tr: [
      { k: ["nedir", "hakkında", "mg coat", "mgcoat", "kaplama", "ürün"], a: "MG COAT Liquid PCB Plastic Coating; PCB'leri, sensörleri ve devreleri su geçirmez yapan, plastik esaslı endüstriyel bir nano koruyucu kaplamadır — ısı gerektirmeyen, güçlü, opak ve mekanik dirençli bir katman.", l: [{ s: "overview", t: "Hakkında →" }, { s: "technology", t: "Teknoloji →" }] },
      { k: ["ısı", "fırın", "sıcaklık", "kürlen", "pişir"], a: "Hiç ısı gerekmez — oda sıcaklığında uygulanır ve tamamen kürlenir. Isıya duyarlı bileşenler için bile güvenlidir.", l: [{ s: "technology", t: "Teknoloji →" }] },
      { k: ["su", "su altı", "daldırma", "derinlik", "su geçirmez", "nem", "yağmur", "deniz", "100"], a: "Evet — doğru sızdırmazlık ve tam kürlenmeyle sistem 100 m ve üzeri sürekli daldırma için tasarlanabilir. Sitede gerçek su testleri var.", l: [{ s: "tests", t: "Testler →" }, { s: "video", t: "Testi izle →" }] },
      { k: ["uygula", "püskürt", "daldır", "fırça", "nasıl kullan", "maskele"], a: "Üç yöntem: tam kaplama için daldırma, eşit katmanlar için püskürtme, lokal güçlendirme için fırça (kenarlar, kablo girişleri, onarım bölgeleri). Konektörler önce maskelenmeli.", l: [{ s: "technology", t: "Teknoloji →" }] },
      { k: ["fiyat", "maliyet", "teklif", "sipariş", "satın", "ödeme", "kargo"], a: "Talebinizi sipariş formundan veya WhatsApp'tan gönderin — kullanım senaryonuza göre fiyat ve detaylarla hızla dönüyoruz.", l: [{ s: "contact", t: "Sipariş formu →" }, { h: WA_URL, t: "WhatsApp" }] },
      { k: ["ecu", "araç", "araba", "drone", "fpv", "kamera", "led", "deniz", "güneş", "telekom", "motosiklet"], a: "Araç ECU'ları, drone/FPV, güvenlik kameraları, LED kartları, deniz sensörleri, EV/BMS, güneş inverterleri, telekom üniteleri ve tamirhane işlerini korur.", l: [{ s: "applications", t: "Uygulamalar →" }] },
      { k: ["çıkar", "söküm", "onar", "çözücü", "rework", "tamir"], a: "Evet — özel bir çözücüyle sökülebilir; kartlar servis edilebilir kalır: tek noktayı reworklayıp yeniden kaplayın.", l: [{ h: "/blog/how-to-remove-conformal-coating-pcb.html", t: "Rehber: kaplama söküm" }] },
      { k: ["renk", "siyah", "beyaz", "gri"], a: "Standart renkler siyah, beyaz ve gri; endüstriyel ve private-label siparişler için özel renkler üretilebilir. Katman tasarım gereği opaktır.", l: [{ s: "technology", t: "Teknoloji →" }] },
      { k: ["katalog", "broşür", "pdf", "indir"], a: "Tam katalog 5 dilde PDF olarak mevcut:", l: [{ h: "/catalog/", t: "Katalog ↓" }] },
      { k: ["white paper", "teknik dok", "datasheet", "şartname"], a: "Teknik white paper'ımız (EN/RU/TR/AR/FA) bilimi, karşılaştırmaları ve test çerçevesini kapsar:", l: [{ h: "/whitepaper/", t: "White paper ↓" }] },
      { k: ["bayi", "partner", "distribütör", "toptan", "temsilci", "iş ortak"], a: "Satış, tamir ve sanayide iş ortaklarına açığız — bölgenizin MG COAT bayisi olun.", l: [{ s: "partners", t: "İş Ortaklığı →" }] },
      { k: ["dayanıklı", "yıl", "ömür", "garanti", "çizik", "mukavemet", "mekanik", "sert"], a: "Tam kürlenmeden sonra sert, çizilmeye dayanıklı bir katman oluşur; doğru uygulamayla 10+ yıl hedef dayanım.", l: [{ s: "tests", t: "Testler →" }] },
      { k: ["telefon", "ara", "numara", "iletişim", "ulaş", "whatsapp"], a: "Bize doğrudan ulaşın — telefonumuz WhatsApp ile aynı: +90 552 876 7973. Yazmak için dokunun:", l: [{ h: WA_URL, t: "WhatsApp / Ara" }, { s: "contact", t: "İletişim →" }] },
      { k: ["adres", "konum", "nerede", "şehir", "ülke", "istanbul", "türkiye", "ofis"], a: "İstanbul, Türkiye'deyiz; Türkiye, İran ve tüm dünyaya hizmet veriyoruz.", l: [{ s: "contact", t: "İletişim →" }, { h: WA_URL, t: "WhatsApp" }] }
    ],
    ar: [
      { k: ["ما هو", "عن المنتج", "mg coat", "mgcoat", "طلاء", "منتج"], a: "‏MG COAT Liquid PCB Plastic Coating طلاء حماية نانوي صناعي قائم على البلاستيك يعزل لوحات PCB والحساسات والدوائر عن الماء — طبقة قوية غير شفافة مقاومة ميكانيكياً وبدون حرارة.", l: [{ s: "overview", t: "من نحن ←" }, { s: "technology", t: "التقنية ←" }] },
      { k: ["حرارة", "فرن", "تسخين", "تجفيف", "درجة"], a: "لا حاجة لأي حرارة — يُطبَّق ويجفّ تماماً في درجة حرارة الغرفة، فهو آمن للمكوّنات الحسّاسة للحرارة والإصلاح الميداني.", l: [{ s: "technology", t: "التقنية ←" }] },
      { k: ["ماء", "تحت الماء", "غمر", "عمق", "عازل", "رطوبة", "مطر", "بحر", "100"], a: "نعم — مع الإحكام الصحيح والجفاف الكامل يمكن هندسة النظام للغمر المستمر حتى 100 متر وأكثر. على الموقع اختبارات ماء حقيقية.", l: [{ s: "tests", t: "الاختبارات ←" }, { s: "video", t: "شاهد الاختبار ←" }] },
      { k: ["تطبيق", "رش", "غمس", "فرشاة", "كيف يستخدم", "إخفاء", "تقنيع"], a: "ثلاث طرق: الغمس لتغطية كاملة، الرش لطبقات متساوية، والفرشاة للتقوية الموضعية (الحواف ومداخل الكابلات ومناطق الإصلاح). يجب تقنيع الموصلات أولاً.", l: [{ s: "technology", t: "التقنية ←" }] },
      { k: ["سعر", "تكلفة", "عرض", "طلب", "شراء", "دفع", "شحن"], a: "أرسل طلبك عبر نموذج الطلب أو واتساب — نرد سريعاً بالسعر والتفاصيل حسب حالتك.", l: [{ s: "contact", t: "نموذج الطلب ←" }, { h: WA_URL, t: "واتساب" }] },
      { k: ["سيارة", "ecu", "درون", "طائرة", "كاميرا", "مراقبة", "led", "بحري", "شمسي", "اتصالات", "دراجة"], a: "يحمي وحدات ECU للسيارات، الدرونز/FPV، كاميرات المراقبة، لوحات LED، الحساسات البحرية، EV/BMS، عواكس الطاقة الشمسية، وحدات الاتصالات وأعمال الورش.", l: [{ s: "applications", t: "التطبيقات ←" }] },
      { k: ["إزالة", "ازالة", "إصلاح", "اصلاح", "مذيب", "صيانة"], a: "نعم — يُزال بمذيب مخصص فتبقى اللوحات قابلة للصيانة: أصلح نقطة واحدة ثم أعد الطلاء لاستعادة الحماية.", l: [{ h: "/blog/how-to-remove-conformal-coating-pcb.html", t: "دليل: إزالة الطلاء" }] },
      { k: ["لون", "ألوان", "الوان", "أسود", "اسود", "أبيض", "ابيض", "رمادي"], a: "الألوان القياسية: أسود وأبيض ورمادي؛ وتتوفر ألوان مخصّصة للطلبات الصناعية والعلامات الخاصة. الطبقة غير شفافة بالتصميم.", l: [{ s: "technology", t: "التقنية ←" }] },
      { k: ["كتالوج", "كتيب", "pdf", "تحميل", "تنزيل"], a: "الكتالوج الكامل متاح بخمس لغات بصيغة PDF:", l: [{ h: "/catalog/", t: "الكتالوج ↓" }] },
      { k: ["white paper", "ورقة", "وثيقة", "مواصفات", "تقني"], a: "ورقتنا التقنية (EN/RU/TR/AR/FA) تغطي العلم والمقارنات وإطار الاختبار:", l: [{ h: "/whitepaper/", t: "الورقة التقنية ↓" }] },
      { k: ["وكيل", "موزع", "شراكة", "جملة", "ممثل"], a: "نرحّب بالشركاء في البيع والإصلاح والصناعة — كن موزّع MG COAT في منطقتك.", l: [{ s: "partners", t: "الشراكة ←" }] },
      { k: ["متانة", "سنوات", "عمر", "ضمان", "خدش", "قوة", "ميكانيك", "صلب"], a: "بعد الجفاف الكامل تتكوّن طبقة صلبة مقاومة للخدش بهدف تصميمي يتجاوز 10 سنوات مع التطبيق الصحيح.", l: [{ s: "tests", t: "الاختبارات ←" }] },
      { k: ["هاتف", "اتصال", "رقم", "تواصل", "واتساب", "واتس"], a: "تواصل معنا مباشرة — هاتفنا هو نفسه واتساب: ‎+90 552 876 7973. اضغط للمحادثة:", l: [{ h: WA_URL, t: "واتساب / اتصال" }, { s: "contact", t: "اتصل بنا ←" }] },
      { k: ["عنوان", "موقع", "أين", "اين", "مدينة", "دولة", "إسطنبول", "اسطنبول", "تركيا", "مكتب"], a: "مقرّنا في إسطنبول، تركيا، ونخدم العملاء هناك وفي إيران وحول العالم.", l: [{ s: "contact", t: "اتصل بنا ←" }, { h: WA_URL, t: "واتساب" }] }
    ],
    fa: [
      { k: ["چیست", "چیه", "درباره", "mg coat", "mgcoat", "محصول", "پوشش چ"], a: "‏MG COAT Liquid PCB Plastic Coating یک پوشش محافظ نانویی صنعتی بر پایهٔ پلاستیک است که بردها، سنسورها و مدارها را ضدآب می‌کند — لایه‌ای قوی، غیرشفاف و مقاوم مکانیکی، بدون نیاز به حرارت.", l: [{ s: "overview", t: "درباره ←" }, { s: "technology", t: "تکنولوژی ←" }] },
      { k: ["حرارت", "گرما", "دما", "کوره", "پخت", "خشک"], a: "اصلاً حرارت نمی‌خواهد — در دمای اتاق اجرا و کاملاً خشک می‌شود؛ برای قطعات حساس به گرما و تعمیر میدانی امن است.", l: [{ s: "technology", t: "تکنولوژی ←" }] },
      { k: ["آب", "ضدآب", "ضد آب", "غوطه", "عمق", "دریا", "باران", "رطوبت", "زیر آب", "100", "۱۰۰"], a: "بله — با آب‌بندی صحیح و خشک‌شدن کامل، سیستم برای غوطه‌وری دائم تا عمق ۱۰۰ متر و بیشتر قابل مهندسی است. تست‌های واقعی آب در سایت هست.", l: [{ s: "tests", t: "تست‌ها ←" }, { s: "video", t: "دیدن تست ←" }] },
      { k: ["اجرا", "اعمال", "اسپری", "غوطه‌وری", "قلم", "نحوه", "روش", "استفاده", "ماسک"], a: "سه روش: غوطه‌وری برای پوشش کامل، اسپری برای لایه‌های یکنواخت، و قلم‌مو برای تقویت موضعی (لبه‌ها، ورودی کابل، نقاط تعمیر). کانکتورها اول باید ماسک شوند.", l: [{ s: "technology", t: "تکنولوژی ←" }, { h: "/blog/how-to-waterproof-a-pcb.html", t: "راهنما: ضدآب‌کردن PCB" }] },
      { k: ["قیمت", "هزینه", "خرید", "سفارش", "فاکتور", "پرداخت", "ارسال", "تهیه"], a: "درخواستت را از فرم سفارش یا واتساپ بفرست — سریع با قیمت و جزئیاتِ متناسب با کاربردت جواب می‌دهیم.", l: [{ s: "contact", t: "فرم سفارش ←" }, { h: WA_URL, t: "واتساپ" }] },
      { k: ["ایسیو", "ecu", "خودرو", "ماشین", "پهپاد", "درون", "دوربین", "مداربسته", "ال‌ای‌دی", "led", "دریایی", "خورشیدی", "مخابرات", "موتور"], a: "از ایسیوی خودرو، پهپاد/FPV، دوربین مداربسته، بردهای LED، سنسورهای دریایی، EV/BMS، اینورتر خورشیدی، تجهیزات مخابراتی و کارهای تعمیرگاهی محافظت می‌کند.", l: [{ s: "applications", t: "کاربردها ←" }] },
      { k: ["پاک", "حذف", "برداشتن", "تعمیر", "حلال", "سرویس"], a: "بله — با حلال مخصوص قابل برداشتن است؛ برد قابل‌سرویس می‌ماند: یک نقطه را تعمیر کن و دوباره پوشش بده.", l: [{ h: "/blog/how-to-remove-conformal-coating-pcb.html", t: "راهنما: برداشتن پوشش" }] },
      { k: ["رنگ", "مشکی", "سفید", "خاکستری"], a: "رنگ‌های استاندارد: مشکی، سفید و خاکستری؛ برای سفارش‌های صنعتی و برند اختصاصی رنگ سفارشی هم تولید می‌شود. لایه عمداً غیرشفاف است.", l: [{ s: "technology", t: "تکنولوژی ←" }] },
      { k: ["کاتالوگ", "بروشور", "pdf", "دانلود"], a: "کاتالوگ کامل به ۵ زبان به‌صورت PDF موجود است:", l: [{ h: "/catalog/", t: "کاتالوگ ↓" }] },
      { k: ["وایت", "white paper", "دیتاشیت", "سند فنی", "مشخصات", "مقاله فنی"], a: "وایت‌پیپر فنی ما (EN/RU/TR/AR/FA) علم، مقایسه‌ها و چارچوب تست را پوشش می‌دهد:", l: [{ h: "/whitepaper/", t: "وایت‌پیپر ↓" }] },
      { k: ["نمایندگی", "همکاری", "پخش", "عاملیت", "عمده", "نماینده"], a: "در فروش، تعمیر و صنعت از شریک استقبال می‌کنیم — نمایندهٔ MG COAT در منطقهٔ خودت باش.", l: [{ s: "partners", t: "همکاری با ما ←" }] },
      { k: ["ماندگاری", "دوام", "سال", "عمر", "خش", "مقاومت", "گارانتی", "سخت"], a: "بعد از خشک‌شدن کامل، لایه‌ای سخت و مقاوم به خش تشکیل می‌شود با هدف طراحی ۱۰ سال+ در شرایط اجرای صحیح.", l: [{ s: "tests", t: "تست‌ها ←" }] },
      { k: ["تلفن", "شماره", "تماس", "زنگ", "واتساپ", "واتس", "ارتباط"], a: "مستقیم با ما در تماس باش — شماره تلفن همان واتساپ است: ‎+90 552 876 7973. برای گفتگو بزن:", l: [{ h: WA_URL, t: "واتساپ / تماس" }, { s: "contact", t: "تماس ←" }] },
      { k: ["آدرس", "مکان", "کجا", "کجاست", "شهر", "کشور", "استانبول", "ترکیه", "دفتر", "محل"], a: "ما در استانبولِ ترکیه هستیم و به مشتریان آنجا، ایران و سراسر دنیا خدمت می‌دهیم.", l: [{ s: "contact", t: "تماس ←" }, { h: WA_URL, t: "واتساپ" }] }
    ]
  };
  var fabStack = document.getElementById("fab-stack");
  var fabMain = document.getElementById("fab-main");
  var assistFab = document.getElementById("fab-chat");   // chat action opens the panel
  var assistPanel = document.getElementById("assist");
  var assistBody = document.getElementById("assist-body");
  var assistChips = document.getElementById("assist-chips");
  var assistForm = document.getElementById("assist-form");
  var assistInput = document.getElementById("assist-input");
  var assistTitle = assistPanel ? assistPanel.querySelector(".assist-title") : null;
  var assistStatus = document.getElementById("assist-status");
  var ASSIST_STATUS = {
    en: "Online · replies in seconds", ru: "Онлайн · ответит за секунды",
    tr: "Çevrimiçi · saniyede yanıt", ar: "متصل · يرد خلال ثوانٍ", fa: "آنلاین · پاسخ در چند ثانیه"
  };
  var FAB_CHAT_LABEL = { en: "Chat", ru: "Чат", tr: "Sohbet", ar: "محادثة", fa: "گفتگو" };
  var fabChatLabelEl = document.querySelector(".fab-chat-label");
  function assistNorm(s) {
    return (s || "").toLowerCase().replace(/[ي]/g, "ی").replace(/[ك]/g, "ک").replace(/[ًٌٍَُِّْ]/g, "");
  }
  function assistMsg(kind, text, links) {
    var m = document.createElement("div");
    m.className = "assist-msg " + kind;
    m.appendChild(document.createTextNode(text));
    if (links && links.length) {
      var row = document.createElement("div"); row.className = "am-links";
      links.forEach(function (lk) {
        var el;
        if (lk.h) {
          el = document.createElement("a"); el.href = lk.h;
          if (/^https?:/.test(lk.h)) { el.target = "_blank"; el.rel = "noopener"; }
        } else {
          el = document.createElement("button"); el.type = "button";
          el.addEventListener("click", function () { hideAssist(); scrollToSec(lk.s); });
        }
        el.className = "am-link"; el.textContent = lk.t;
        row.appendChild(el);
      });
      m.appendChild(row);
    }
    assistBody.appendChild(m);
    assistBody.scrollTop = assistBody.scrollHeight;
  }
  // keyword knowledge base — used as the offline fallback and when no AI backend
  function assistAnswerKB(q) {
    var ui = ASSIST_UI[curLang] || ASSIST_UI.en;
    var kb = ASSIST_KB[curLang] || ASSIST_KB.en;
    var nq = assistNorm(q);
    var best = null, bestScore = 0;
    kb.forEach(function (e) {
      var score = 0;
      e.k.forEach(function (kw) { if (nq.indexOf(assistNorm(kw)) !== -1) score += kw.length > 4 ? 2 : 1; });
      if (score > bestScore) { bestScore = score; best = e; }
    });
    if (best) assistMsg("bot", best.a, best.l);
    else assistMsg("bot", ui.no, [{ h: WA_URL, t: ui.wa }]);
  }
  // typing indicator
  function assistTyping(on) {
    var ex = assistBody.querySelector(".assist-typing");
    if (on) {
      if (ex) return;
      var t = document.createElement("div");
      t.className = "assist-msg bot assist-typing";
      t.innerHTML = "<span></span><span></span><span></span>";
      assistBody.appendChild(t);
      assistBody.scrollTop = assistBody.scrollHeight;
    } else if (ex) { ex.parentNode.removeChild(ex); }
  }
  function assistAnswer(q) {
    if (!ASSIST_API) { assistAnswerKB(q); return; }   // no backend → keyword mode
    if (assistBusy) return;
    assistBusy = true;
    var ui = ASSIST_UI[curLang] || ASSIST_UI.en;
    assistHistory.push({ role: "user", content: q });
    assistTyping(true);
    fetch(ASSIST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lang: curLang, messages: assistHistory.slice(-10) })
    }).then(function (r) {
      if (!r.ok) throw new Error("bad status " + r.status);
      return r.json();
    }).then(function (data) {
      assistTyping(false);
      var reply = (data && data.reply ? String(data.reply) : "").trim();
      if (!reply) throw new Error("empty reply");
      assistHistory.push({ role: "assistant", content: reply });
      assistMsg("bot", reply, [{ h: WA_URL, t: ui.wa }]);
    }).catch(function () {
      assistTyping(false);
      assistHistory.pop();              // drop the unanswered turn
      assistAnswerKB(q);                // graceful fallback to keyword mode
    }).then(function () { assistBusy = false; });
  }
  function syncAssist(lang) {
    if (!assistPanel) return;
    var ui = ASSIST_UI[lang] || ASSIST_UI.en;
    if (assistTitle) assistTitle.textContent = ui.title;
    if (assistStatus) assistStatus.textContent = ASSIST_STATUS[lang] || ASSIST_STATUS.en;
    if (fabChatLabelEl) { var cl = FAB_CHAT_LABEL[lang] || FAB_CHAT_LABEL.en; fabChatLabelEl.textContent = cl; if (assistFab) assistFab.setAttribute("aria-label", cl); }
    if (assistInput) { assistInput.placeholder = ui.ph; assistInput.setAttribute("aria-label", ui.ph); }
    assistHistory = [];   // a language switch starts a fresh conversation
    assistBody.innerHTML = "";
    assistMsg("bot", ui.hi);
    assistChips.innerHTML = "";
    ui.chips.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "assist-chip"; b.textContent = c;
      b.addEventListener("click", function () { assistMsg("user", c); assistAnswer(c); });
      assistChips.appendChild(b);
    });
  }
  /* ---------- speed-dial (one button → WhatsApp + Chat) ---------- */
  function openFabStack() {
    if (!fabStack) return;
    fabStack.classList.add("open");
    if (fabMain) fabMain.setAttribute("aria-expanded", "true");
  }
  function closeFabStack() {
    if (!fabStack) return;
    fabStack.classList.remove("open");
    if (fabMain) fabMain.setAttribute("aria-expanded", "false");
  }
  if (fabMain && fabStack) {
    fabMain.addEventListener("click", function (e) {
      e.stopPropagation();
      if (fabStack.classList.contains("open")) closeFabStack();
      else { hideAssist(); openFabStack(); }
    });
    document.addEventListener("click", function (e) {
      if (fabStack.classList.contains("open") && !fabStack.contains(e.target)) closeFabStack();
    });
  }

  function showAssist() {
    if (!assistPanel) return;
    closeFabStack();
    assistPanel.hidden = false;
    requestAnimationFrame(function () { assistPanel.classList.add("show"); });
    if (assistFab) assistFab.setAttribute("aria-expanded", "true");
    if (assistInput && window.innerWidth > 700) assistInput.focus();
  }
  function hideAssist() {
    if (!assistPanel) return;
    assistPanel.classList.remove("show");
    if (assistFab) assistFab.setAttribute("aria-expanded", "false");
    setTimeout(function () { assistPanel.hidden = true; }, 250);
  }
  if (assistFab && assistPanel) {
    assistFab.addEventListener("click", function (e) {
      e.stopPropagation();
      if (assistPanel.hidden) showAssist(); else hideAssist();
    });
    assistPanel.querySelector(".assist-close").addEventListener("click", hideAssist);
    assistForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = assistInput.value.trim();
      if (!q) return;
      assistInput.value = "";
      assistMsg("user", q);
      assistAnswer(q);
    });
    document.addEventListener("click", function (e) {
      if (!assistPanel.hidden && !assistPanel.contains(e.target) && (!fabStack || !fabStack.contains(e.target))) hideAssist();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { hideAssist(); closeFabStack(); } });
  }

  /* ============================================================
     Tilt-to-scroll (mobile/tablet) — opt-in toggle.
     Tilt the device forward to scroll down, back to scroll up.
     Speed is proportional to the tilt past a neutral baseline.
     iOS needs sensor permission, requested on the tap that turns it on.
     ============================================================ */
  var tiltBtn = null;
  var TILT_LABEL = { en: "Tilt scroll", ru: "Скролл наклоном", tr: "Eğerek kaydır", ar: "تمرير بالإمالة", fa: "اسکرول با حرکت" };
  function updateTiltLabel(lang) {
    if (!tiltBtn) return;
    var span = tiltBtn.querySelector(".tt-text");
    if (span) span.textContent = TILT_LABEL[lang] || TILT_LABEL.en;
  }
  (function () {
    var isTouch = ("ontouchstart" in window) || (navigator.maxTouchPoints > 0);
    if (!isTouch || !window.DeviceOrientationEvent) return;   // desktop / no sensors → skip

    tiltBtn = document.createElement("button");
    tiltBtn.type = "button";
    tiltBtn.className = "tilt-toggle";
    tiltBtn.setAttribute("aria-pressed", "false");
    tiltBtn.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M12 3l-4 4M12 3l4 4M12 21l-4-4M12 21l4-4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '<span class="tt-text"></span>';
    document.body.appendChild(tiltBtn);
    updateTiltLabel(curLang);

    var active = false, baseline = null, speed = 0, rafId = null;
    var DEAD = 5;        // degrees of neutral dead-zone
    var SCALE = 2.2;     // larger = slower
    var MAXV = 30;       // max pixels per frame

    function onTilt(e) {
      if (e.beta == null) return;
      if (baseline === null) baseline = e.beta;          // capture neutral on first reading
      var d = e.beta - baseline;
      var mag = Math.abs(d) - DEAD;
      if (mag <= 0) { speed = 0; return; }
      var v = Math.min(mag / SCALE, MAXV);
      speed = (d > 0 ? 1 : -1) * v;                      // tilt forward → scroll down
    }
    function loop() {
      if (!active) return;
      if (speed) {
        // Lenis owns the scroll; when it's running, drive it directly so the
        // page actually moves. Otherwise fall back to native scrolling.
        if (lenis && typeof lenis.scrollTo === "function") {
          var cur = (typeof lenis.actualScroll === "number") ? lenis.actualScroll
                  : (typeof lenis.scroll === "number") ? lenis.scroll
                  : (window.pageYOffset || 0);
          lenis.scrollTo(cur + speed, { immediate: true, force: true });
        } else {
          window.scrollBy(0, speed);
        }
      }
      rafId = requestAnimationFrame(loop);
    }
    function start() {
      active = true; baseline = null; speed = 0;
      window.addEventListener("deviceorientation", onTilt, true);
      rafId = requestAnimationFrame(loop);
      tiltBtn.classList.add("on");
      tiltBtn.setAttribute("aria-pressed", "true");
    }
    function stop() {
      active = false; speed = 0;
      window.removeEventListener("deviceorientation", onTilt, true);
      if (rafId) cancelAnimationFrame(rafId);
      tiltBtn.classList.remove("on");
      tiltBtn.setAttribute("aria-pressed", "false");
    }
    tiltBtn.addEventListener("click", function () {
      if (active) { stop(); return; }
      // iOS 13+: must request permission inside the user gesture
      var DOE = window.DeviceOrientationEvent;
      if (DOE && typeof DOE.requestPermission === "function") {
        DOE.requestPermission().then(function (res) {
          if (res === "granted") start();
        }).catch(function () {});
      } else {
        start();
      }
    });
  })();

  setLang(initialLang(), false);
  // lock the language pill to the widest name once fonts are ready (avoids resize)
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fixLangPillWidth);
  else setTimeout(fixLangPillWidth, 400);

  // let inner scroll areas (wide tables, chat body, language menu) scroll natively
  // instead of being hijacked by Lenis smooth-scroll.
  Array.prototype.forEach.call(
    document.querySelectorAll(".table-wrap, .assist-body, .lang-menu"),
    function (el) { el.setAttribute("data-lenis-prevent", ""); }
  );

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
