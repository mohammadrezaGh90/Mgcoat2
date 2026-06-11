/* MGCoat Studio — admin panel logic.
   Google Sign-In for identity; all writes go through /api/publish, which
   verifies the Google token server-side and commits with the server's
   GitHub token. No secrets live in this file. */
(function () {
  "use strict";
  var API = "/api/publish";
  var idToken = null;
  var settingsSha = null;

  var $ = function (id) { return document.getElementById(id); };
  function show(view) {
    ["login", "settings", "media", "status"].forEach(function (v) {
      var el = $("view-" + v); if (el) el.classList.toggle("hide", v !== view);
    });
    var tabs = $("tabs");
    if (view === "login") { tabs.classList.add("hide"); }
    else {
      tabs.classList.remove("hide");
      Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
        t.classList.toggle("on", t.dataset.view === view);
      });
    }
  }
  function toast(msg, ok) {
    var t = $("toast"); t.textContent = msg;
    t.className = "toast show " + (ok ? "ok" : "err");
    setTimeout(function () { t.className = "toast"; }, 3200);
  }
  function busy(btn, on, label) {
    if (!btn) return;
    btn.disabled = on;
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = label || "Working…"; }
    else if (btn.dataset.label) { btn.textContent = btn.dataset.label; }
  }

  // ---- API ----
  function call(action, extra) {
    var payload = Object.assign({ idToken: idToken, action: action }, extra || {});
    return fetch(API, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    }).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) {
          if (r.status === 401 || r.status === 403) { signOut(); toast("Session expired — sign in again", false); }
          throw new Error((j && j.error) || ("HTTP " + r.status));
        }
        return j;
      });
    });
  }

  // ---- Google Sign-In ----
  function bootGoogle(clientId) {
    function init() {
      if (!window.google || !google.accounts || !google.accounts.id) { return setTimeout(init, 150); }
      google.accounts.id.initialize({
        client_id: clientId,
        callback: function (resp) { idToken = resp.credential; onSignedIn(); },
        auto_select: true,
      });
      google.accounts.id.renderButton($("gbtn"), { theme: "filled_black", size: "large", shape: "pill", text: "signin_with" });
      google.accounts.id.prompt();
    }
    init();
  }

  function decodeEmail(jwt) {
    try {
      var p = JSON.parse(decodeURIComponent(escape(atob(jwt.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")))));
      return p.email || "";
    } catch (e) { return ""; }
  }

  function onSignedIn() {
    sessionStorage.setItem("mg_idtoken", idToken);
    $("who").textContent = decodeEmail(idToken);
    show("settings");
    loadSettings();
  }
  function signOut() {
    idToken = null; sessionStorage.removeItem("mg_idtoken");
    $("who").textContent = "";
    try { if (window.google && google.accounts) google.accounts.id.disableAutoSelect(); } catch (e) {}
    show("login");
  }

  // ---- Settings ----
  function loadSettings() {
    call("get", { path: "content/site.json" }).then(function (r) {
      settingsSha = r.sha || null;
      var d = {};
      if (r.exists && r.text) { try { d = JSON.parse(r.text); } catch (e) {} }
      var c = d.contact || {}, a = d.announcement || {};
      $("s-wa").value = c.whatsapp || "";
      $("s-phone").value = c.phone || "";
      $("s-email").value = c.email || "";
      $("s-ig").value = c.instagram || "";
      $("s-an-on").checked = !!a.enabled;
      $("s-an-text").value = a.text || "";
      $("s-an-link").value = a.link || "";
    }).catch(function (e) { toast("Load failed: " + e.message, false); });
  }
  function saveSettings() {
    var data = {
      contact: {
        whatsapp: $("s-wa").value.replace(/[^0-9]/g, ""),
        phone: $("s-phone").value.trim(),
        email: $("s-email").value.trim(),
        instagram: $("s-ig").value.trim().replace(/^@/, ""),
      },
      announcement: {
        enabled: $("s-an-on").checked,
        text: $("s-an-text").value.trim(),
        link: $("s-an-link").value.trim(),
      },
      updated: new Date().toISOString().slice(0, 10),
    };
    var btn = $("btn-save-settings"); busy(btn, true, "Publishing…");
    call("putText", { path: "content/site.json", text: JSON.stringify(data, null, 2) + "\n", message: "Studio: update site settings" })
      .then(function () { toast("Published ✓ live in 1–2 min", true); })
      .catch(function (e) { toast("Failed: " + e.message, false); })
      .then(function () { busy(btn, false); });
  }

  // ---- Media upload ----
  function uploadFile() {
    var f = $("m-file").files[0];
    var name = $("m-name").value.trim();
    var folder = $("m-folder").value;
    if (!f) { return toast("Choose a file first", false); }
    if (!name) { return toast("Enter a file name", false); }
    if (f.size > 24 * 1024 * 1024) { return toast("File too large (max ~24 MB)", false); }
    var btn = $("btn-upload"); busy(btn, true, "Uploading…");
    var reader = new FileReader();
    reader.onload = function () {
      var b64 = String(reader.result).split(",")[1];
      call("putBinary", { path: folder + "/" + name, base64: b64, message: "Studio: upload " + name })
        .then(function () { toast("Uploaded ✓ live in 1–2 min", true); $("m-file").value = ""; $("m-prev").style.display = "none"; })
        .catch(function (e) { toast("Failed: " + e.message, false); })
        .then(function () { busy(btn, false); });
    };
    reader.onerror = function () { busy(btn, false); toast("Could not read file", false); };
    reader.readAsDataURL(f);
  }

  // ---- Status ----
  function loadStatus() {
    var box = $("st-commits"); box.innerHTML = '<p class="muted">Loading…</p>';
    call("commits").then(function (r) {
      $("st-pill").textContent = "Connected"; $("st-pill").className = "pill ok";
      if (!r.commits || !r.commits.length) { box.innerHTML = '<p class="muted">No recent changes.</p>'; return; }
      box.innerHTML = r.commits.map(function (c) {
        var when = new Date(c.when).toLocaleString();
        return '<div class="commit"><span>' + esc(c.msg) + '</span><span class="when">' + esc(when) + '</span></div>';
      }).join("");
    }).catch(function (e) {
      $("st-pill").textContent = "Error"; $("st-pill").className = "pill warn";
      box.innerHTML = '<p class="muted">' + esc(e.message) + '</p>';
    });
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---- wire up ----
  document.addEventListener("DOMContentLoaded", function () {
    Array.prototype.forEach.call(document.querySelectorAll(".tab"), function (t) {
      t.addEventListener("click", function () {
        var v = t.dataset.view; show(v);
        if (v === "status") loadStatus();
      });
    });
    $("btn-save-settings").addEventListener("click", saveSettings);
    $("btn-upload").addEventListener("click", uploadFile);
    $("btn-signout").addEventListener("click", signOut);
    $("m-file").addEventListener("change", function () {
      var f = this.files[0]; if (!f) return;
      if (!$("m-name").value) $("m-name").value = f.name;
      var p = $("m-prev");
      if (f.type.indexOf("image") === 0) { p.src = URL.createObjectURL(f); p.style.display = "block"; }
      else { p.style.display = "none"; }
    });

    // boot: fetch public config, then Google Sign-In
    fetch(API).then(function (r) { return r.json(); }).then(function (cfg) {
      if (!cfg.configured || !cfg.googleClientId) {
        $("login-note").innerHTML = '<span class="pill warn">Not set up yet</span> — finish <code>STUDIO-SETUP.md</code> first.';
        return;
      }
      bootGoogle(cfg.googleClientId);
    }).catch(function () {
      $("login-note").innerHTML = '<span class="pill warn">Backend offline</span> — the publish API is not reachable.';
    });
  });
})();
