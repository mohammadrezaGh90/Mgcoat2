/* MG COAT blog — language switching (mirrors the main site's choice) */
(function () {
  "use strict";
  var LANGS = ["en", "ru", "tr", "ar", "fa"], RTL = { ar: 1, fa: 1 }, KEY = "mgtech-lang";
  var posts = document.querySelectorAll(".post");
  var buttons = Array.prototype.slice.call(document.querySelectorAll(".lang-btn"));
  var sel = document.querySelector(".lang-select");
  var trigger = document.querySelector(".lang-trigger");
  var ltFlag = document.querySelector(".lt-flag"), ltName = document.querySelector(".lt-name");
  var INFO = {};
  buttons.forEach(function (b) { var s = b.querySelectorAll("span"); INFO[b.dataset.lang] = { flag: s[0] ? s[0].textContent : "", name: s[1] ? s[1].textContent : b.dataset.lang }; });

  function setLang(lang, push) {
    if (LANGS.indexOf(lang) === -1) lang = "en";
    posts.forEach(function (p) { p.hidden = (p.getAttribute("data-lang") !== lang); });
    buttons.forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });
    var i = INFO[lang]; if (i) { if (ltFlag) ltFlag.textContent = i.flag; if (ltName) ltName.textContent = i.name; }
    document.documentElement.lang = lang;
    document.documentElement.dir = RTL[lang] ? "rtl" : "ltr";
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    if (push && window.history && history.replaceState) {
      var u = new URL(window.location.href); u.searchParams.set("lang", lang); history.replaceState({}, "", u);
    }
  }
  function initial() {
    var p = new URLSearchParams(window.location.search).get("lang");
    if (p && LANGS.indexOf(p) !== -1) return p;
    try { var s = localStorage.getItem(KEY); if (s && LANGS.indexOf(s) !== -1) return s; } catch (e) {}
    var n = (navigator.language || "en").slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) !== -1 ? n : "en";
  }
  buttons.forEach(function (b) { b.addEventListener("click", function () { setLang(b.dataset.lang, true); close(); }); });
  function close() { if (sel) sel.classList.remove("open"); if (trigger) trigger.setAttribute("aria-expanded", "false"); }
  if (trigger && sel) {
    trigger.addEventListener("click", function (e) { e.stopPropagation(); var o = sel.classList.toggle("open"); trigger.setAttribute("aria-expanded", String(o)); });
    document.addEventListener("click", function (e) { if (!sel.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }
  setLang(initial(), false);
})();
