/* MGCoat — live content injector.
   Reads /content/site.json (editable from the /admin panel) and applies
   contact details + an optional announcement bar to the public site.
   Fully additive and fail-safe: if the file is missing or malformed,
   the page is left exactly as authored. */
(function () {
  "use strict";
  try {
    fetch("/content/site.json", { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) apply(d); })
      .catch(function () {});
  } catch (e) {}

  function apply(d) {
    var c = d.contact || {};
    // WhatsApp — rewrite every wa.me / api.whatsapp link to the configured number
    if (c.whatsapp) {
      var num = String(c.whatsapp).replace(/[^0-9]/g, "");
      qsa('a[href*="wa.me/"], a[href*="api.whatsapp.com"]').forEach(function (a) {
        var t = a.getAttribute("href").split("?")[1];
        a.setAttribute("href", "https://wa.me/" + num + (t ? "?" + t : ""));
      });
    }
    // Phone
    if (c.phone) {
      var tel = String(c.phone).replace(/[^0-9+]/g, "");
      qsa('a[href^="tel:"]').forEach(function (a) { a.setAttribute("href", "tel:" + tel); });
    }
    // Email
    if (c.email) {
      qsa('a[href^="mailto:"]').forEach(function (a) { a.setAttribute("href", "mailto:" + c.email); });
    }
    // Instagram
    if (c.instagram) {
      var handle = String(c.instagram).replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/+$/, "");
      qsa('a[href*="instagram.com/"]').forEach(function (a) {
        a.setAttribute("href", "https://www.instagram.com/" + handle);
      });
    }
    // Announcement bar
    var an = d.announcement || {};
    if (an.enabled && an.text && !document.getElementById("mg-announce")) {
      var bar = document.createElement(an.link ? "a" : "div");
      bar.id = "mg-announce";
      if (an.link) { bar.href = an.link; bar.target = "_blank"; bar.rel = "noopener"; }
      bar.textContent = an.text;
      bar.setAttribute("style",
        "display:block;position:relative;z-index:60;text-align:center;text-decoration:none;" +
        "font:600 13px/1.5 Inter,system-ui,sans-serif;color:#fff;padding:9px 16px;" +
        "background:linear-gradient(90deg,#e30613,#ff3340);box-shadow:0 2px 14px rgba(255,51,64,.35)");
      document.body.insertBefore(bar, document.body.firstChild);
    }
  }
  function qsa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }
})();
