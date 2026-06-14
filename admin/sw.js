/* MGCoat Studio — minimal service worker.
   Caches only the app shell so the panel installs and opens like an app.
   It never caches API calls (always live) — only static shell files. */
var SHELL = "mg-studio-v1";
var FILES = ["/admin/", "/admin/index.html", "/admin/admin.js?v=5", "/assets/img/logo-mark.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(SHELL).then(function (c) { return c.addAll(FILES).catch(function () {}); }));
  self.skipWaiting();
});
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== SHELL; }).map(function (k) { return caches.delete(k); }));
  }));
  self.clients.claim();
});
self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  // Never intercept API or cross-origin (Google) requests — always go to network.
  if (url.pathname.indexOf("/api/") === 0 || url.origin !== self.location.origin) return;
  e.respondWith(
    fetch(e.request).catch(function () { return caches.match(e.request).then(function (m) { return m || caches.match("/admin/index.html"); }); })
  );
});
