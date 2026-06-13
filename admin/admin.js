/* MGCoat Studio — panel logic (trilingual UI, settings, media, blog CMS). */
(function () {
  "use strict";
  var API = "/api/publish";
  var idToken = null;
  var ui = localStorage.getItem("mg_ui") || "fa";
  var ALL = ["en", "ru", "tr", "ar", "fa"];
  var LANGNAME = { en: "English", ru: "Русский", tr: "Türkçe", ar: "العربية", fa: "فارسی" };
  var $ = function (id) { return document.getElementById(id); };

  // ---------- i18n ----------
  var T = {
    fa: {
      "login.title": "ورود", "login.hint": "فقط حساب مدیریتیِ مجاز می‌تواند وارد شود و سایت را تغییر دهد.",
      "login.setup": "راه‌اندازی اولیه (یک‌بار)", "login.setupbody": "این پنل به یک کلاینت ورود گوگل و چند کلید محرمانه در Vercel نیاز دارد. راهنمای ۱۰ دقیقه‌ای در فایل STUDIO-SETUP.md است.",
      "set.contact": "اطلاعات تماس", "set.contactwhere": "📍 در کل سایت (دکمه‌های واتساپ، تماس، اینستاگرام)", "set.contacthint": "این شماره‌ها و آدرس‌ها بعد از انتشار، در همهٔ صفحات به‌روز می‌شوند.",
      "set.wa": "شمارهٔ واتساپ (فقط رقم)", "set.phone": "تلفن", "set.email": "ایمیل (اختیاری)", "set.ig": "آیدی اینستاگرام",
      "set.announce": "نوار اعلان", "set.announcewhere": "📍 نوار قرمز بالای صفحهٔ اصلی", "set.announcehint": "یک پیام کوتاه (مثل تخفیف یا خبر) که بالای سایت نشان داده می‌شود.",
      "set.show": "نمایش اعلان", "set.text": "متن", "set.link": "لینک (اختیاری)", "btn.publish": "انتشار تغییرات",
      "media.title": "آپلود عکس یا ویدئو", "media.hint": "یک عکس یا ویدئو را جایگزین یا اضافه کن. برای جایگزینی، همان نام فایلِ موجود را بگذار.",
      "media.folder": "پوشهٔ مقصد", "media.imgfolder": "assets/img — عکس‌ها (لوگو، گالری، پس‌زمینه)", "media.vidfolder": "assets/video — ویدئوها (ویدئوی تست، موشن)",
      "media.file": "انتخاب فایل", "media.name": "ذخیره با نام", "media.guide": "کدام فایل کجاست؟",
      "media.guidebody": "• mgcoat-demo.mp4 = ویدئوی تستِ صفحهٔ کاتالوگ. • motion.webm = ویدئوی متحرکِ صفحهٔ اصلی. • logo-mark.png = لوگو. • og-banner.jpg = تصویر اشتراک‌گذاری.",
      "media.publish": "انتشار فایل",
      "blog.title": "مقاله‌های وبلاگ", "blog.where": "📍 صفحهٔ /blog — هر مقاله یک صفحهٔ جدا با سئو", "blog.hint": "مقالهٔ جدید بساز یا یک مقالهٔ موجود را ویرایش/حذف کن. هر مقاله به ۵ زبان منتشر می‌شود.",
      "blog.new": "+ مقالهٔ جدید", "blog.loading": "در حال بارگذاری…",
      "status.title": "وضعیت", "status.hint": "هر تغییر = یک نسخه. برای بازگشت به هر نسخهٔ قبلی، روی «بازگردانی» بزن. سایت ۱–۲ دقیقه بعد به‌روز می‌شود.", "status.open": "باز کردن سایت زنده ↗", "status.signout": "خروج",
      "tab.settings": "تنظیمات", "tab.media": "رسانه", "tab.blog": "وبلاگ", "tab.status": "وضعیت",
      // editor
      "ed.slug": "نشانی مقاله (انگلیسی، فقط a-z 0-9 -)", "ed.slughint": "بخشی از آدرس صفحه می‌شود و بعداً قابل تغییر نیست.",
      "ed.kw": "کلمات کلیدی سئو (با کاما جدا کن)", "ed.lang": "زبانِ در حال ویرایش", "ed.langhint": "حداقل انگلیسی را کامل کن؛ زبان‌های خالی از انگلیسی پر می‌شوند.",
      "ed.title": "عنوان", "ed.desc": "توضیح کوتاه (متا)", "ed.intro": "مقدمه", "ed.secs": "بخش‌ها", "ed.heading": "تیتر بخش", "ed.para": "متن بخش",
      "ed.addsec": "+ افزودن بخش", "ed.close": "جمله‌بندی پایانی", "ed.save": "انتشار مقاله", "ed.cancel": "انصراف", "ed.delete": "حذف مقاله",
      "ed.delconfirm": "این مقاله حذف شود؟ قابل بازگشت نیست.", "ed.needen": "عنوان و مقدمهٔ انگلیسی لازم است.", "ed.needslug": "نشانی نامعتبر است (فقط a-z 0-9 -).",
      "msg.published": "منتشر شد ✓ تا ۱–۲ دقیقه دیگر زنده می‌شود", "msg.failed": "خطا: ", "msg.loadfail": "بارگذاری نشد: ",
      "msg.choosefile": "اول یک فایل انتخاب کن", "msg.needname": "نام فایل را وارد کن", "msg.toobig": "فایل خیلی بزرگ است (حداکثر ~۲۴ مگابایت)",
      "msg.expired": "نشست منقضی شد — دوباره وارد شو", "msg.deleted": "حذف شد ✓", "blog.none": "هنوز مقاله‌ای نیست.",
      "st.connected": "متصل", "st.error": "خطا", "edit": "ویرایش", "del": "حذف", "st.current": "نسخهٔ فعلی", "st.restore": "بازگردانی", "st.restored": "به نسخهٔ قبلی برگشت ✓ تا ۱–۲ دقیقه زنده می‌شود", "st.alreadythere": "همین الان روی این نسخه‌ای", "st.restoreconfirm": "سایت به این نسخه برگردد؟ یک نسخهٔ جدید ساخته می‌شود، پس همین کار هم قابل‌بازگشت است.",
      "tab.texts": "متن‌ها", "texts.title": "متن‌های صفحهٔ اصلی", "texts.where": "📍 متنِ همهٔ بخش‌های صفحهٔ اصلی، به‌تفکیک",
      "texts.hint": "زبان را انتخاب کن، بخش را باز کن و هر متنی را ویرایش کن. فقط متن‌های تغییرکرده منتشر می‌شوند.",
      "texts.save": "انتشار تغییرات", "texts.nochange": "تغییری برای انتشار نیست", "group.hero": "بخش معرفی (بالای صفحه)",
      "role.title": "عنوان اصلی", "role.sectitle": "عنوان بخش", "role.heading": "زیرعنوان", "role.question": "سؤال متداول",
      "role.intro": "متن معرفی", "role.seccopy": "توضیح بخش", "role.stat": "برچسب آمار", "role.text": "متن",
    },
    en: {
      "login.title": "Sign in", "login.hint": "Only the authorised management account can sign in and publish changes.",
      "login.setup": "First-time setup (one time)", "login.setupbody": "This panel needs a Google sign-in client and a few secret keys set in Vercel. See STUDIO-SETUP.md for the 10-minute guide.",
      "set.contact": "Contact details", "set.contactwhere": "📍 Across the whole site (WhatsApp, phone, Instagram)", "set.contacthint": "These apply across all pages after publishing.",
      "set.wa": "WhatsApp number (digits only)", "set.phone": "Phone", "set.email": "Email (optional)", "set.ig": "Instagram handle",
      "set.announce": "Announcement bar", "set.announcewhere": "📍 Red bar at the top of the homepage", "set.announcehint": "A short message (offer/news) shown at the top of the site.",
      "set.show": "Show announcement", "set.text": "Text", "set.link": "Link (optional)", "btn.publish": "Publish changes",
      "media.title": "Upload image or video", "media.hint": "Replace or add a picture/video. To replace one, use its exact existing file name.",
      "media.folder": "Destination folder", "media.imgfolder": "assets/img — pictures (logo, gallery, backgrounds)", "media.vidfolder": "assets/video — videos (test video, motion)",
      "media.file": "Choose file", "media.name": "Save as", "media.guide": "Which file is where?",
      "media.guidebody": "• mgcoat-demo.mp4 = catalog test video. • motion.webm = homepage motion video. • logo-mark.png = logo. • og-banner.jpg = social share image.",
      "media.publish": "Publish file",
      "blog.title": "Blog articles", "blog.where": "📍 The /blog page — each article is its own SEO page", "blog.hint": "Create a new article, or edit/delete an existing one. Each is published in 5 languages.",
      "blog.new": "+ New article", "blog.loading": "Loading…",
      "status.title": "Status", "status.hint": "Each change is a version. Tap Restore on any earlier version to roll the site back. Live in 1–2 min.", "status.open": "Open live site ↗", "status.signout": "Sign out",
      "tab.settings": "Settings", "tab.media": "Media", "tab.blog": "Blog", "tab.status": "Status",
      "ed.slug": "Article URL (English, a-z 0-9 - only)", "ed.slughint": "Becomes part of the page address; cannot be changed later.",
      "ed.kw": "SEO keywords (comma separated)", "ed.lang": "Editing language", "ed.langhint": "Fill English at least; empty languages fall back to English.",
      "ed.title": "Title", "ed.desc": "Short description (meta)", "ed.intro": "Intro", "ed.secs": "Sections", "ed.heading": "Section heading", "ed.para": "Section text",
      "ed.addsec": "+ Add section", "ed.close": "Closing line", "ed.save": "Publish article", "ed.cancel": "Cancel", "ed.delete": "Delete article",
      "ed.delconfirm": "Delete this article? This cannot be undone.", "ed.needen": "English title and intro are required.", "ed.needslug": "Invalid URL (a-z 0-9 - only).",
      "msg.published": "Published ✓ live in 1–2 min", "msg.failed": "Failed: ", "msg.loadfail": "Load failed: ",
      "msg.choosefile": "Choose a file first", "msg.needname": "Enter a file name", "msg.toobig": "File too large (max ~24 MB)",
      "msg.expired": "Session expired — sign in again", "msg.deleted": "Deleted ✓", "blog.none": "No articles yet.",
      "st.connected": "Connected", "st.error": "Error", "edit": "Edit", "del": "Delete", "st.current": "current", "st.restore": "Restore", "st.restored": "Restored ✓ live in 1–2 min", "st.alreadythere": "Already on this version", "st.restoreconfirm": "Restore the site to this version? A new version is created, so this is undoable too.",
      "tab.texts": "Texts", "texts.title": "Homepage texts", "texts.where": "📍 The text of every homepage section, organised",
      "texts.hint": "Pick a language, open a section and edit any text. Only changed texts are published.",
      "texts.save": "Publish changes", "texts.nochange": "Nothing changed to publish", "group.hero": "Intro (top of page)",
      "role.title": "Main title", "role.sectitle": "Section title", "role.heading": "Sub-heading", "role.question": "FAQ question",
      "role.intro": "Intro text", "role.seccopy": "Section intro", "role.stat": "Stat label", "role.text": "Text",
    },
    tr: {
      "login.title": "Giriş", "login.hint": "Yalnızca yetkili yönetim hesabı giriş yapıp yayınlayabilir.",
      "login.setup": "İlk kurulum (bir kez)", "login.setupbody": "Bu panel bir Google giriş istemcisi ve Vercel'de birkaç gizli anahtar gerektirir. 10 dakikalık rehber için STUDIO-SETUP.md dosyasına bakın.",
      "set.contact": "İletişim bilgileri", "set.contactwhere": "📍 Tüm sitede (WhatsApp, telefon, Instagram)", "set.contacthint": "Yayınladıktan sonra tüm sayfalarda geçerli olur.",
      "set.wa": "WhatsApp numarası (sadece rakam)", "set.phone": "Telefon", "set.email": "E-posta (isteğe bağlı)", "set.ig": "Instagram kullanıcı adı",
      "set.announce": "Duyuru çubuğu", "set.announcewhere": "📍 Ana sayfanın üstündeki kırmızı çubuk", "set.announcehint": "Sitenin üstünde gösterilen kısa bir mesaj (kampanya/haber).",
      "set.show": "Duyuruyu göster", "set.text": "Metin", "set.link": "Bağlantı (isteğe bağlı)", "btn.publish": "Değişiklikleri yayınla",
      "media.title": "Görsel veya video yükle", "media.hint": "Bir resim/video değiştir veya ekle. Değiştirmek için mevcut dosya adını kullanın.",
      "media.folder": "Hedef klasör", "media.imgfolder": "assets/img — resimler (logo, galeri, arka plan)", "media.vidfolder": "assets/video — videolar (test videosu, motion)",
      "media.file": "Dosya seç", "media.name": "Farklı kaydet", "media.guide": "Hangi dosya nerede?",
      "media.guidebody": "• mgcoat-demo.mp4 = katalog test videosu. • motion.webm = ana sayfa motion videosu. • logo-mark.png = logo. • og-banner.jpg = paylaşım görseli.",
      "media.publish": "Dosyayı yayınla",
      "blog.title": "Blog yazıları", "blog.where": "📍 /blog sayfası — her yazı kendi SEO sayfası", "blog.hint": "Yeni yazı oluştur veya mevcut bir yazıyı düzenle/sil. Her biri 5 dilde yayınlanır.",
      "blog.new": "+ Yeni yazı", "blog.loading": "Yükleniyor…",
      "status.title": "Durum", "status.hint": "Her değişiklik bir sürümdür. Eski bir sürümü geri yüklemek için Geri yükle'ye dokunun. 1–2 dk içinde canlı.", "status.open": "Canlı siteyi aç ↗", "status.signout": "Çıkış",
      "tab.settings": "Ayarlar", "tab.media": "Medya", "tab.blog": "Blog", "tab.status": "Durum",
      "ed.slug": "Yazı adresi (İngilizce, a-z 0-9 -)", "ed.slughint": "Sayfa adresinin parçası olur; sonradan değiştirilemez.",
      "ed.kw": "SEO anahtar kelimeleri (virgülle)", "ed.lang": "Düzenlenen dil", "ed.langhint": "En az İngilizceyi doldurun; boş diller İngilizceden alınır.",
      "ed.title": "Başlık", "ed.desc": "Kısa açıklama (meta)", "ed.intro": "Giriş", "ed.secs": "Bölümler", "ed.heading": "Bölüm başlığı", "ed.para": "Bölüm metni",
      "ed.addsec": "+ Bölüm ekle", "ed.close": "Kapanış cümlesi", "ed.save": "Yazıyı yayınla", "ed.cancel": "İptal", "ed.delete": "Yazıyı sil",
      "ed.delconfirm": "Bu yazı silinsin mi? Geri alınamaz.", "ed.needen": "İngilizce başlık ve giriş gerekli.", "ed.needslug": "Geçersiz adres (a-z 0-9 -).",
      "msg.published": "Yayınlandı ✓ 1–2 dk içinde canlı", "msg.failed": "Hata: ", "msg.loadfail": "Yüklenemedi: ",
      "msg.choosefile": "Önce bir dosya seçin", "msg.needname": "Dosya adı girin", "msg.toobig": "Dosya çok büyük (en fazla ~24 MB)",
      "msg.expired": "Oturum doldu — tekrar giriş yapın", "msg.deleted": "Silindi ✓", "blog.none": "Henüz yazı yok.",
      "st.connected": "Bağlı", "st.error": "Hata", "edit": "Düzenle", "del": "Sil", "st.current": "güncel", "st.restore": "Geri yükle", "st.restored": "Geri yüklendi ✓ 1–2 dk içinde canlı", "st.alreadythere": "Zaten bu sürümdesin", "st.restoreconfirm": "Site bu sürüme geri yüklensin mi? Yeni bir sürüm oluşturulur, bu da geri alınabilir.",
      "tab.texts": "Metinler", "texts.title": "Ana sayfa metinleri", "texts.where": "📍 Her ana sayfa bölümünün metni, düzenli",
      "texts.hint": "Bir dil seçin, bir bölümü açın ve herhangi bir metni düzenleyin. Yalnızca değişen metinler yayınlanır.",
      "texts.save": "Değişiklikleri yayınla", "texts.nochange": "Yayınlanacak değişiklik yok", "group.hero": "Giriş (sayfanın üstü)",
      "role.title": "Ana başlık", "role.sectitle": "Bölüm başlığı", "role.heading": "Alt başlık", "role.question": "SSS sorusu",
      "role.intro": "Giriş metni", "role.seccopy": "Bölüm girişi", "role.stat": "İstatistik etiketi", "role.text": "Metin",
    },
  };
  function t(k) { return (T[ui] && T[ui][k]) || (T.en[k]) || k; }
  function applyI18n() {
    document.body.dir = (ui === "fa") ? "rtl" : "ltr";
    document.documentElement.lang = ui;
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    Array.prototype.forEach.call(document.querySelectorAll(".langsw button"), function (b) {
      b.classList.toggle("on", b.dataset.ui === ui);
    });
    if (!$("blog-editor").classList.contains("hide")) { /* re-render editor labels */ if (editing) renderEditor(editing, editorIsNew, true); }
  }

  // ---------- view nav ----------
  function show(view) {
    ["login", "settings", "media", "blog", "texts", "status"].forEach(function (v) {
      var el = $("view-" + v); if (el) el.classList.toggle("hide", v !== view);
    });
    var tabs = $("tabs");
    if (view === "login") tabs.classList.add("hide");
    else { tabs.classList.remove("hide"); Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (tb) { tb.classList.toggle("on", tb.dataset.view === view); }); }
  }
  function toast(msg, ok) { var el = $("toast"); el.textContent = msg; el.className = "toast show " + (ok ? "ok" : "err"); setTimeout(function () { el.className = "toast"; }, 3400); }
  function busy(btn, on, label) { if (!btn) return; btn.disabled = on; if (on) { btn.dataset.lbl = btn.textContent; btn.textContent = label || "…"; } else if (btn.dataset.lbl) btn.textContent = btn.dataset.lbl; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---------- API ----------
  function call(action, extra) {
    return fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.assign({ idToken: idToken, action: action }, extra || {})) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) { if (r.status === 401 || r.status === 403) { signOut(); toast(t("msg.expired"), false); } throw new Error((j && j.error) || ("HTTP " + r.status)); } return j; }); });
  }

  // ---------- Google ----------
  function bootGoogle(clientId) {
    (function init() {
      if (!window.google || !google.accounts || !google.accounts.id) return setTimeout(init, 150);
      google.accounts.id.initialize({ client_id: clientId, callback: function (resp) { idToken = resp.credential; onSignedIn(); }, auto_select: true });
      google.accounts.id.renderButton($("gbtn"), { theme: "filled_black", size: "large", shape: "pill", text: "signin_with" });
      google.accounts.id.prompt();
    })();
  }
  function emailOf(jwt) { try { return JSON.parse(decodeURIComponent(escape(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))))).email || ""; } catch (e) { return ""; } }
  function onSignedIn() { sessionStorage.setItem("mg_idtoken", idToken); $("who").textContent = emailOf(idToken); show("settings"); loadSettings(); }
  function signOut() { idToken = null; sessionStorage.removeItem("mg_idtoken"); $("who").textContent = ""; try { google.accounts.id.disableAutoSelect(); } catch (e) {} show("login"); }

  // ---------- Settings ----------
  function loadSettings() {
    call("get", { path: "content/site.json" }).then(function (r) {
      var d = {}; if (r.exists && r.text) { try { d = JSON.parse(r.text); } catch (e) {} }
      var c = d.contact || {}, a = d.announcement || {};
      $("s-wa").value = c.whatsapp || ""; $("s-phone").value = c.phone || ""; $("s-email").value = c.email || ""; $("s-ig").value = c.instagram || "";
      $("s-an-on").checked = !!a.enabled; $("s-an-text").value = a.text || ""; $("s-an-link").value = a.link || "";
    }).catch(function (e) { toast(t("msg.loadfail") + e.message, false); });
  }
  function saveSettings() {
    var data = { contact: { whatsapp: $("s-wa").value.replace(/[^0-9]/g, ""), phone: $("s-phone").value.trim(), email: $("s-email").value.trim(), instagram: $("s-ig").value.trim().replace(/^@/, "") },
      announcement: { enabled: $("s-an-on").checked, text: $("s-an-text").value.trim(), link: $("s-an-link").value.trim() }, updated: new Date().toISOString().slice(0, 10) };
    var b = $("btn-save-settings"); busy(b, true, "…");
    call("putText", { path: "content/site.json", text: JSON.stringify(data, null, 2) + "\n", message: "Studio: update site settings" })
      .then(function () { toast(t("msg.published"), true); }).catch(function (e) { toast(t("msg.failed") + e.message, false); }).then(function () { busy(b, false); });
  }

  // ---------- Media ----------
  function uploadFile() {
    var f = $("m-file").files[0], name = $("m-name").value.trim(), folder = $("m-folder").value;
    if (!f) return toast(t("msg.choosefile"), false);
    if (!name) return toast(t("msg.needname"), false);
    if (f.size > 24 * 1024 * 1024) return toast(t("msg.toobig"), false);
    var b = $("btn-upload"); busy(b, true, "…");
    var rd = new FileReader();
    rd.onload = function () { call("putBinary", { path: folder + "/" + name, base64: String(rd.result).split(",")[1], message: "Studio: upload " + name })
      .then(function () { toast(t("msg.published"), true); $("m-file").value = ""; $("m-prev").style.display = "none"; }).catch(function (e) { toast(t("msg.failed") + e.message, false); }).then(function () { busy(b, false); }); };
    rd.onerror = function () { busy(b, false); toast(t("msg.failed"), false); };
    rd.readAsDataURL(f);
  }

  // ---------- Status ----------
  function loadStatus() {
    var box = $("st-commits"); box.innerHTML = '<p class="muted">…</p>';
    call("commits").then(function (r) {
      $("st-pill").textContent = t("st.connected"); $("st-pill").className = "pill ok";
      var cs = r.commits || [];
      if (!cs.length) { box.innerHTML = '<p class="muted">—</p>'; return; }
      box.innerHTML = cs.map(function (c, i) {
        var when = new Date(c.when).toLocaleString();
        var right = (i === 0)
          ? '<span class="pill ok" style="white-space:nowrap">' + t("st.current") + "</span>"
          : '<button class="btn sm" data-restore="' + esc(c.sha) + '" style="white-space:nowrap">↩ ' + t("st.restore") + "</button>";
        return '<div class="commit"><span style="flex:1">' + esc(c.msg) + '<br><span class="when">' + esc(when) + "</span></span>" + right + "</div>";
      }).join("");
    }).catch(function (e) { $("st-pill").textContent = t("st.error"); $("st-pill").className = "pill warn"; box.innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
  }
  function restoreVersion(sha) {
    if (!confirm(t("st.restoreconfirm"))) return;
    var box = $("st-commits"); box.style.opacity = ".5";
    call("restore", { sha: sha }).then(function (r) {
      toast(r && r.noop ? t("st.alreadythere") : t("st.restored"), true);
      setTimeout(loadStatus, 1200);
    }).catch(function (e) { toast(t("msg.failed") + e.message, false); }).then(function () { box.style.opacity = "1"; });
  }

  // ---------- Blog CMS ----------
  var editing = null, editorIsNew = false, editLang = "en";
  function loadBlogList() {
    var box = $("blog-list"); box.innerHTML = '<p class="muted">' + t("blog.loading") + "</p>";
    call("listArticles").then(function (r) {
      var a = r.articles || [];
      if (!a.length) { box.innerHTML = '<p class="muted">' + t("blog.none") + "</p>"; return; }
      box.innerHTML = a.map(function (x) {
        return '<div class="art"><span class="t">' + esc(x.title) + '</span>' +
          '<button class="btn sm" data-edit="' + esc(x.slug) + '">' + t("edit") + '</button>' +
          '<button class="btn sm" data-del="' + esc(x.slug) + '" style="color:var(--red)">' + t("del") + "</button></div>";
      }).join("");
    }).catch(function (e) { box.innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
  }
  function blankArticle() { var L = {}; ALL.forEach(function (l) { L[l] = { title: "", desc: "", intro: "", secs: [["", ""]], close: "" }; }); return { slug: "", kw: "", L: L }; }

  function renderEditor(art, isNew, keepLang) {
    editing = art; editorIsNew = isNew; if (!keepLang) editLang = "en";
    $("blog-list-view").classList.add("hide");
    var ed = $("blog-editor"); ed.classList.remove("hide");
    var langtabs = ALL.map(function (l) {
      var filled = art.L[l] && art.L[l].title ? " filled" : "";
      return '<button data-el="' + l + '"' + (l === editLang ? ' class="on' + filled + '"' : ' class="' + filled.trim() + '"') + ">" + LANGNAME[l] + "</button>";
    }).join("");
    ed.innerHTML =
      '<div class="card">' +
        '<button class="btn sm" id="ed-cancel" style="float:inline-end">' + t("ed.cancel") + "</button>" +
        "<h2>" + (isNew ? t("blog.new") : t("edit")) + "</h2>" +
        "<label>" + t("ed.slug") + "</label>" +
        '<input id="ed-slug" autocapitalize="off" autocorrect="off" spellcheck="false" ' + (isNew ? "" : "disabled") + ' value="' + esc(art.slug) + '" placeholder="my-new-article"/>' +
        '<p class="muted">' + t("ed.slughint") + "</p>" +
        "<label>" + t("ed.kw") + "</label>" +
        '<input id="ed-kw" value="' + esc(art.kw || "") + '" placeholder="waterproof pcb, coating, …"/>' +
        "<label>" + t("ed.lang") + "</label>" +
        '<p class="muted">' + t("ed.langhint") + "</p>" +
        '<div class="langtabs" id="ed-langtabs">' + langtabs + "</div>" +
        '<div id="ed-fields"></div>' +
      "</div>" +
      '<button class="btn red" id="ed-save">' + t("ed.save") + "</button>" +
      (isNew ? "" : '<button class="btn" id="ed-delete" style="color:var(--red);margin-top:8px">' + t("ed.delete") + "</button>");
    renderLangFields();
    $("ed-cancel").onclick = closeEditor;
    $("ed-save").onclick = saveArticle;
    if ($("ed-delete")) $("ed-delete").onclick = deleteArticle;
    $("ed-langtabs").onclick = function (e) { var b = e.target.closest("button[data-el]"); if (!b) return; collectLang(); editLang = b.dataset.el; renderEditor(editing, editorIsNew, true); };
  }
  function renderLangFields() {
    var d = editing.L[editLang] || { secs: [["", ""]] };
    if (!d.secs || !d.secs.length) d.secs = [["", ""]];
    var secs = d.secs.map(function (s, i) {
      return '<div class="sec"><button class="rm" data-rm="' + i + '">×</button>' +
        "<label>" + t("ed.heading") + "</label><input data-h=\"" + i + "\" value=\"" + esc(s[0]) + "\"/>" +
        "<label>" + t("ed.para") + "</label><textarea data-p=\"" + i + "\">" + esc(s[1]) + "</textarea></div>";
    }).join("");
    $("ed-fields").innerHTML =
      "<label>" + t("ed.title") + "</label><input id=\"f-title\" value=\"" + esc(d.title || "") + "\"/>" +
      "<label>" + t("ed.desc") + "</label><textarea id=\"f-desc\">" + esc(d.desc || "") + "</textarea>" +
      "<label>" + t("ed.intro") + "</label><textarea id=\"f-intro\">" + esc(d.intro || "") + "</textarea>" +
      "<label>" + t("ed.secs") + "</label>" + secs +
      '<button class="btn sm" id="f-addsec" style="margin-top:8px">' + t("ed.addsec") + "</button>" +
      "<label>" + t("ed.close") + "</label><textarea id=\"f-close\">" + esc(d.close || "") + "</textarea>";
    $("f-addsec").onclick = function () { collectLang(); editing.L[editLang].secs.push(["", ""]); renderLangFields(); };
    $("ed-fields").onclick = function (e) { var b = e.target.closest("button[data-rm]"); if (!b) return; collectLang(); editing.L[editLang].secs.splice(+b.dataset.rm, 1); if (!editing.L[editLang].secs.length) editing.L[editLang].secs = [["", ""]]; renderLangFields(); };
  }
  function collectLang() {
    if (!$("f-title")) return;
    var secs = [];
    Array.prototype.forEach.call(document.querySelectorAll("#ed-fields [data-h]"), function (h) {
      var i = h.getAttribute("data-h"); var p = document.querySelector('#ed-fields [data-p="' + i + '"]');
      secs.push([h.value, p ? p.value : ""]);
    });
    editing.L[editLang] = { title: $("f-title").value, desc: $("f-desc").value, intro: $("f-intro").value, secs: secs, close: $("f-close").value };
  }
  function closeEditor() { $("blog-editor").classList.add("hide"); $("blog-editor").innerHTML = ""; $("blog-list-view").classList.remove("hide"); editing = null; }
  function saveArticle() {
    collectLang();
    editing.slug = ($("ed-slug").value || "").trim().toLowerCase();
    editing.kw = $("ed-kw").value.trim();
    if (!/^[a-z0-9-]{3,80}$/.test(editing.slug)) return toast(t("ed.needslug"), false);
    var en = editing.L.en || {};
    if (!en.title || !en.intro) return toast(t("ed.needen"), false);
    // drop empty languages so the server fills them from English
    var L = {}; ALL.forEach(function (l) { var x = editing.L[l]; if (x && x.title) { x.secs = (x.secs || []).filter(function (s) { return s[0] || s[1]; }); L[l] = x; } });
    var payload = { slug: editing.slug, kw: editing.kw, order: editing.order, date: editing.date, L: L };
    var b = $("ed-save"); busy(b, true, "…");
    call("saveArticle", { article: payload }).then(function () { toast(t("msg.published"), true); closeEditor(); loadBlogList(); })
      .catch(function (e) { toast(t("msg.failed") + e.message, false); }).then(function () { busy(b, false); });
  }
  function deleteArticle() {
    if (!confirm(t("ed.delconfirm"))) return;
    var b = $("ed-delete"); busy(b, true, "…");
    call("deleteArticle", { slug: editing.slug }).then(function () { toast(t("msg.deleted"), true); closeEditor(); loadBlogList(); })
      .catch(function (e) { toast(t("msg.failed") + e.message, false); }).then(function () { busy(b, false); });
  }
  function openEdit(slug) { call("getArticle", { slug: slug }).then(function (r) { if (r.exists) { var a = r.article; ALL.forEach(function (l) { if (!a.L[l]) a.L[l] = { title: "", desc: "", intro: "", secs: [["", ""]], close: "" }; }); renderEditor(a, false); } }).catch(function (e) { toast(t("msg.loadfail") + e.message, false); }); }

  // ---------- Texts (homepage sections) ----------
  var textsData = null, textsLang = "fa", textsPath = "index.html";
  function roleOf(el) {
    var tag = el.tagName.toLowerCase(), cl = el.className || "";
    if (tag === "h1") return "title";
    if (tag === "h2" && /section-title/.test(cl)) return "sectitle";
    if (tag === "h3") return "heading";
    if (tag === "summary") return "question";
    if (tag === "div" && /stat-label/.test(cl)) return "stat";
    if (tag === "p" && /(lead|hero-text)/.test(cl)) return "intro";
    if (tag === "p" && /section-copy/.test(cl)) return "seccopy";
    return "text";
  }
  function loadTexts() {
    var box = $("texts-groups"); box.innerHTML = '<p class="muted">' + t("blog.loading") + "</p>";
    renderTextsLangtabs();
    call("get", { path: textsPath }).then(function (r) {
      if (!r.exists) { box.innerHTML = "—"; return; }
      var doc = new DOMParser().parseFromString(r.text, "text/html");
      textsData = {}; ALL.forEach(function (l) { textsData[l] = []; });
      var els = doc.querySelectorAll("[data-mg]");
      var lastLang = null, grp = "__hero__";
      Array.prototype.forEach.call(els, function (el) {
        var ls = el.closest("[data-lang]"); var lang = ls ? ls.getAttribute("data-lang") : null;
        if (!lang || ALL.indexOf(lang) === -1) return;
        if (lang !== lastLang) { grp = "__hero__"; lastLang = lang; }
        var role = roleOf(el);
        if (role === "sectitle") { grp = (el.textContent || "").trim() || grp; }
        var txt = el.textContent || "";
        textsData[lang].push({ key: el.getAttribute("data-mg"), role: role, group: grp, orig: txt, cur: txt });
      });
      renderTextsGroups();
    }).catch(function (e) { box.innerHTML = '<p class="muted">' + esc(e.message) + "</p>"; });
  }
  function renderTextsLangtabs() {
    var c = $("texts-langtabs");
    c.innerHTML = ALL.map(function (l) { return '<button data-tl="' + l + '"' + (l === textsLang ? ' class="on"' : "") + ">" + LANGNAME[l] + "</button>"; }).join("");
    c.onclick = function (e) { var b = e.target.closest("button[data-tl]"); if (!b) return; collectTexts(); textsLang = b.dataset.tl; renderTextsLangtabs(); renderTextsGroups(); };
  }
  function renderTextsGroups() {
    if (!textsData) return;
    var fields = textsData[textsLang] || [];
    var groups = [], map = {};
    fields.forEach(function (f) { if (!map[f.group]) { map[f.group] = { name: f.group, items: [] }; groups.push(map[f.group]); } map[f.group].items.push(f); });
    $("texts-groups").innerHTML = groups.map(function (g, gi) {
      var gname = g.name === "__hero__" ? t("group.hero") : g.name;
      return '<details class="card"' + (gi === 0 ? " open" : "") + '><summary style="font-weight:600;color:var(--ink);cursor:pointer">' + esc(gname) + "</summary>" +
        g.items.map(function (f) { return '<label>' + t("role." + f.role) + "</label><textarea data-tk=\"" + f.key + "\">" + esc(f.cur) + "</textarea>"; }).join("") + "</details>";
    }).join("");
  }
  function collectTexts() {
    if (!textsData) return;
    Array.prototype.forEach.call(document.querySelectorAll("#texts-groups [data-tk]"), function (ta) {
      var k = ta.getAttribute("data-tk"), arr = textsData[textsLang] || [];
      for (var i = 0; i < arr.length; i++) { if (arr[i].key === k) { arr[i].cur = ta.value; break; } }
    });
  }
  function saveTexts() {
    collectTexts();
    var edits = {};
    ALL.forEach(function (l) { (textsData[l] || []).forEach(function (f) { if (f.cur !== f.orig) edits[f.key] = f.cur; }); });
    if (!Object.keys(edits).length) { toast(t("texts.nochange"), true); return; }
    var b = $("btn-save-texts"); busy(b, true, "…");
    call("saveTexts", { path: textsPath, edits: edits }).then(function () {
      ALL.forEach(function (l) { (textsData[l] || []).forEach(function (f) { f.orig = f.cur; }); });
      toast(t("msg.published"), true);
    }).catch(function (e) { toast(t("msg.failed") + e.message, false); }).then(function () { busy(b, false); });
  }

  // ---------- wire ----------
  document.addEventListener("DOMContentLoaded", function () {
    applyI18n();
    Array.prototype.forEach.call(document.querySelectorAll(".langsw button"), function (b) {
      b.onclick = function () { ui = b.dataset.ui; localStorage.setItem("mg_ui", ui); applyI18n(); };
    });
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (tb) {
      tb.onclick = function () { var v = tb.dataset.view; show(v); if (v === "status") loadStatus(); if (v === "blog") { closeEditor(); loadBlogList(); } if (v === "texts") loadTexts(); };
    });
    $("btn-save-settings").onclick = saveSettings;
    $("btn-upload").onclick = uploadFile;
    $("btn-signout").onclick = signOut;
    $("st-commits").onclick = function (e) { var b = e.target.closest("button[data-restore]"); if (b) restoreVersion(b.dataset.restore); };
    $("btn-new-article").onclick = function () { renderEditor(blankArticle(), true); };
    $("btn-save-texts").onclick = saveTexts;
    $("blog-list").onclick = function (e) {
      var ed = e.target.closest("button[data-edit]"), dl = e.target.closest("button[data-del]");
      if (ed) openEdit(ed.dataset.edit);
      else if (dl) { editing = { slug: dl.dataset.del }; if (confirm(t("ed.delconfirm"))) call("deleteArticle", { slug: dl.dataset.del }).then(function () { toast(t("msg.deleted"), true); loadBlogList(); }).catch(function (er) { toast(t("msg.failed") + er.message, false); }); }
    };
    $("m-file").onchange = function () { var f = this.files[0]; if (!f) return; if (!$("m-name").value) $("m-name").value = f.name; var p = $("m-prev"); if (f.type.indexOf("image") === 0) { p.src = URL.createObjectURL(f); p.style.display = "block"; } else p.style.display = "none"; };

    fetch(API).then(function (r) { return r.json(); }).then(function (cfg) {
      if (!cfg.configured || !cfg.googleClientId) { $("login-note").innerHTML = '<span class="pill warn">setup needed</span>'; return; }
      bootGoogle(cfg.googleClientId);
    }).catch(function () { $("login-note").innerHTML = '<span class="pill warn">backend offline</span>'; });
  });
})();
