/* MGCoat blog generator (JS port of tools/genblog.py).
   Used by the Studio API to build article pages and the blog index from the
   same content/blog/*.json data the Python generator reads, so the site stays
   consistent whether an article is added locally or from the admin panel. */
"use strict";
var SITE = "https://www.mgcoat.com";
var WA = "https://wa.me/905528767973";
var LANGS = ["en", "ru", "tr", "ar", "fa"];
var RTL = { ar: 1, fa: 1 };
var CSSV = "202606141", BLOGJSV = "202606141", SCV = "1";
var FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Vazirmatn:wght@400;500;600;700&display=swap"/>';
function flag(c) { return '<img class="flag" src="/assets/img/flags/' + c + '.svg" alt="" width="22" height="16"/>'; }
var LBL = { en: [flag("gb"), "English"], ru: [flag("ru"), "Русский"], tr: [flag("tr"), "Türkçe"], ar: [flag("sa"), "العربية"], fa: [flag("ir"), "فارسی"] };
var HOME = { en: "Home", ru: "Главная", tr: "Ana sayfa", ar: "الرئيسية", fa: "خانه" };
var BLOGW = { en: "Blog", ru: "Блог", tr: "Blog", ar: "المدونة", fa: "بلاگ" };
var CTA = { en: "Get a quote on WhatsApp", ru: "Запросить цену в WhatsApp", tr: "WhatsApp'tan teklif al", ar: "احصل على عرض سعر عبر واتساب", fa: "دریافت قیمت در واتساپ" };
var MORE = { en: "More articles", ru: "Другие статьи", tr: "Diğer yazılar", ar: "مقالات أخرى", fa: "مقاله‌های بیشتر" };
var READ = { en: "Read article", ru: "Читать", tr: "Oku", ar: "اقرأ المقال", fa: "خواندن مقاله" };
var BLOGTITLE = { en: "Blog & Insights", ru: "Блог и статьи", tr: "Blog ve İçgörüler", ar: "المدونة والمقالات", fa: "بلاگ و مقالات" };
var BLOGLEAD = {
  en: "Practical guides on PCB waterproofing, protective coatings and protecting electronics in harsh environments.",
  ru: "Практические руководства по гидроизоляции плат, защитным покрытиям и защите электроники в тяжёлых условиях.",
  tr: "PCB su yalıtımı, koruyucu kaplamalar ve elektroniğin zorlu ortamlarda korunması üzerine pratik rehberler.",
  ar: "أدلة عملية حول عزل لوحات PCB والطلاءات الواقية وحماية الإلكترونيات في البيئات القاسية.",
  fa: "راهنماهای کاربردی دربارهٔ ضدآب‌سازی بردهای PCB، پوشش‌های محافظ و محافظت از الکترونیک در شرایط سخت.",
};
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function header() {
  return '<header class="site-header"><div class="container nav">' +
    '<a class="brand" href="/" aria-label="MGCoat — home"><picture><source srcset="/assets/img/logo-mark.webp" type="image/webp"/><img src="/assets/img/logo-mark.png" alt="MGCoat logo" width="40" height="40"/></picture><span class="brand-text">MGCoat<small>Electronic Circuit Waterproofing</small></span></a>' +
    '<div class="lang-select"><button class="lang-trigger" type="button" aria-haspopup="listbox" aria-expanded="false" aria-label="Select language"><span class="lt-flag"><img class="flag" src="/assets/img/flags/gb.svg" alt="" width="22" height="16"/></span><span class="lt-name">English</span><span class="lt-chev">▾</span></button>' +
    '<div class="lang-menu" role="listbox">' + LANGS.map(function (l) { return '<button class="lang-btn" type="button" data-lang="' + l + '"><span>' + LBL[l][0] + '</span><span>' + LBL[l][1] + '</span></button>'; }).join("") + '</div></div>' +
    '</div></header>';
}
var BLOGJS = '<script src="/assets/js/site-content.js?v=' + SCV + '" defer></script><script src="/assets/js/blog.js?v=' + BLOGJSV + '"></script>';

function articlePage(a) {
  var adate = a.date || "2026-06-04";
  var posts = "", lds = [];
  LANGS.forEach(function (l) {
    var d = a.L[l]; var dirv = RTL[l] ? "rtl" : "ltr";
    var body = (d.secs || []).map(function (s) { return "<h2>" + esc(s[0]) + "</h2><p>" + esc(s[1]) + "</p>"; }).join("");
    posts += '<article class="post" data-lang="' + l + '" lang="' + l + '" dir="' + dirv + '" hidden>' +
      '<nav class="crumbs"><a href="/">' + HOME[l] + '</a> / <a href="/blog/">' + BLOGW[l] + '</a></nav>' +
      "<h1>" + esc(d.title) + '</h1><p class="article-meta">MGCoat · ' + adate + "</p>" +
      '<p class="lead-p">' + esc(d.intro) + "</p>" + body + "<p>" + esc(d.close) + "</p>" +
      '<div class="article-cta"><a class="btn red" href="' + WA + '" rel="noopener" target="_blank">' + CTA[l] + '</a> <a class="btn" href="/blog/">' + MORE[l] + "</a></div></article>";
    lds.push({ "@type": "Article", headline: d.title, description: d.desc, inLanguage: l, datePublished: adate, dateModified: adate, author: { "@type": "Organization", name: "MGCoat" }, publisher: { "@type": "Organization", name: "MGCoat", logo: { "@type": "ImageObject", url: SITE + "/assets/img/logo-mark.png" } }, mainEntityOfPage: SITE + "/blog/" + a.slug + ".html", image: SITE + "/assets/img/og-banner.jpg" });
  });
  var en = a.L.en;
  var hreflang = LANGS.map(function (l) { return '<link rel="alternate" hreflang="' + l + '" href="' + SITE + "/blog/" + a.slug + '.html?lang=' + l + '"/>'; }).join("") + '<link rel="alternate" hreflang="x-default" href="' + SITE + "/blog/" + a.slug + '.html"/>';
  return '<!DOCTYPE html>\n<html lang="en" dir="ltr">\n<head>\n' +
    '<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>\n' +
    "<title>" + esc(en.title) + " | MGCoat</title>\n" +
    '<meta name="description" content="' + esc(en.desc) + '"/>\n' +
    '<meta name="keywords" content="' + esc(a.kw) + '"/>\n' +
    '<meta name="robots" content="index, follow"/>\n' +
    '<link rel="canonical" href="' + SITE + "/blog/" + a.slug + '.html"/>\n' +
    hreflang + "\n" +
    '<meta property="og:type" content="article"/><meta property="og:title" content="' + esc(en.title) + '"/>\n' +
    '<meta property="og:description" content="' + esc(en.desc) + '"/><meta property="og:url" content="' + SITE + "/blog/" + a.slug + '.html"/>\n' +
    '<meta property="og:image" content="' + SITE + '/assets/img/og-banner.jpg"/><meta name="theme-color" content="#070910"/>\n' +
    '<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png"/>\n' +
    FONTS + "\n" +
    '<link rel="stylesheet" href="/assets/css/style.css?v=' + CSSV + '"/>\n' +
    '<script type="application/ld+json">' + JSON.stringify({ "@context": "https://schema.org", "@graph": lds }) + "</script>\n" +
    "</head>\n<body>\n" + header() + '\n<main class="article"><div class="container prose">\n' + posts + "\n</div></main>\n" +
    '<footer>© M.Ghanbari — MGCoat · Liquid PCB Plastic Coating. <a href="/">mgcoat.com</a></footer>\n' +
    BLOGJS + "\n</body></html>";
}

function indexPage(articles) {
  var posts = "";
  LANGS.forEach(function (l) {
    var dirv = RTL[l] ? "rtl" : "ltr";
    var cards = articles.map(function (a) {
      return '<a class="blog-card" href="/blog/' + a.slug + '.html"><h2>' + esc(a.L[l].title) + "</h2><p>" + esc(a.L[l].desc) + '</p><span class="blog-more">' + READ[l] + " →</span></a>";
    }).join("");
    posts += '<div class="post" data-lang="' + l + '" lang="' + l + '" dir="' + dirv + '" hidden>' +
      "<h1>" + esc(BLOGTITLE[l]) + '</h1><p class="lead-p">' + esc(BLOGLEAD[l]) + "</p>" +
      '<div class="blog-grid">' + cards + "</div></div>";
  });
  var hreflang = LANGS.map(function (l) { return '<link rel="alternate" hreflang="' + l + '" href="' + SITE + '/blog/?lang=' + l + '"/>'; }).join("") + '<link rel="alternate" hreflang="x-default" href="' + SITE + '/blog/"/>';
  return '<!DOCTYPE html>\n<html lang="en" dir="ltr">\n<head>\n' +
    '<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>\n' +
    "<title>Blog — PCB Waterproofing & Protective Coating | MGCoat</title>\n" +
    '<meta name="description" content="Guides on waterproofing PCBs, conformal vs plastic coatings and protecting electronics — in English, Russian, Turkish, Arabic and Persian."/>\n' +
    '<meta name="robots" content="index, follow"/>\n' +
    '<link rel="canonical" href="' + SITE + '/blog/"/>\n' + hreflang + "\n" +
    '<meta property="og:type" content="website"/><meta property="og:title" content="MGCoat Blog"/>\n' +
    '<meta property="og:image" content="' + SITE + '/assets/img/og-banner.jpg"/><meta name="theme-color" content="#070910"/>\n' +
    '<link rel="icon" href="/favicon.ico" sizes="any"/><link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png"/>\n' +
    FONTS + "\n" +
    '<link rel="stylesheet" href="/assets/css/style.css?v=' + CSSV + '"/>\n' +
    "</head>\n<body>\n" + header() + '\n<main class="article"><div class="container prose">\n' + posts + "\n</div></main>\n" +
    '<footer>© M.Ghanbari — MGCoat · Liquid PCB Plastic Coating. <a href="/">mgcoat.com</a></footer>\n' +
    BLOGJS + "\n</body></html>";
}

module.exports = { articlePage: articlePage, indexPage: indexPage, LANGS: LANGS };
