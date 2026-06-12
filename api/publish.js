/* MGCoat Studio — secure publish endpoint (Vercel serverless function).
 *
 * The admin panel signs the owner in with Google and sends the ID token with
 * every request. This function verifies it server-side and only proceeds if the
 * verified, email-verified Google account matches ALLOWED_EMAIL. The GitHub
 * token never leaves the server.
 *
 * Env vars (Vercel → Settings → Environment Variables):
 *   GOOGLE_CLIENT_ID, ALLOWED_EMAIL, GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH
 */
var blog = require("./_blog.js");
var GH = "https://api.github.com";
function env(k) { return process.env[k] || ""; }
function enc(p) { return String(p).split("/").map(encodeURIComponent).join("/"); }
function owner() { return env("GITHUB_OWNER"); }
function repo() { return env("GITHUB_REPO"); }
function branch() { return env("GITHUB_BRANCH") || "main"; }

async function gh(path, opts) {
  return fetch(GH + path, Object.assign({}, opts, {
    headers: Object.assign({
      Authorization: "Bearer " + env("GITHUB_TOKEN"),
      Accept: "application/vnd.github+json",
      "User-Agent": "mgcoat-studio",
    }, opts && opts.headers),
  }));
}
async function ghJson(path, method, body) {
  var r = await gh(path, { method: method || "GET", headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  var j = await r.json();
  if (!r.ok) throw new Error((j && j.message) || ("GitHub " + r.status));
  return j;
}
function repoBase() { return "/repos/" + owner() + "/" + repo(); }

// editable text pages (data-mg marked) the panel may write to
var EDITABLE_PAGES = { "index.html": 1, "catalog/index.html": 1, "whitepaper/index.html": 1 };
function escHtml(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
function replaceMarked(htmlText, key, newText) {
  var re = new RegExp('(<[a-zA-Z0-9]+[^>]*\\sdata-mg="' + key.replace(/[^a-zA-Z0-9]/g, "") + '"[^>]*>)([^<]*)(<)');
  return htmlText.replace(re, function (m, a, b, c) { return a + escHtml(newText) + c; });
}

// --- atomic multi-file commit via the Git Data API ---
async function commitFiles(changes, message) {
  var ref = await ghJson("/repos/" + owner() + "/" + repo() + "/git/ref/heads/" + branch());
  var baseSha = ref.object.sha;
  var baseCommit = await ghJson(repoBase() + "/git/commits/" + baseSha);
  var tree = [];
  for (var i = 0; i < changes.length; i++) {
    var c = changes[i];
    if (c.del) { tree.push({ path: c.path, mode: "100644", type: "blob", sha: null }); continue; }
    var enc64 = c.base64 != null ? c.base64 : Buffer.from(c.content, "utf8").toString("base64");
    var blob = await ghJson(repoBase() + "/git/blobs", "POST", { content: enc64, encoding: "base64" });
    tree.push({ path: c.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  var newTree = await ghJson(repoBase() + "/git/trees", "POST", { base_tree: baseCommit.tree.sha, tree: tree });
  var commit = await ghJson(repoBase() + "/git/commits", "POST", { message: message, tree: newTree.sha, parents: [baseSha] });
  await ghJson(repoBase() + "/git/refs/heads/" + branch(), "PATCH", { sha: commit.sha });
  return commit.html_url;
}

// --- read every article JSON ---
async function loadArticles() {
  var r = await gh(repoBase() + "/contents/content/blog?ref=" + branch());
  if (r.status === 404) return [];
  var list = await r.json();
  var out = [];
  for (var i = 0; i < list.length; i++) {
    if (!/\.json$/.test(list[i].name)) continue;
    var f = await ghJson(repoBase() + "/contents/content/blog/" + enc(list[i].name) + "?ref=" + branch());
    try { out.push(JSON.parse(Buffer.from(f.content, "base64").toString("utf8"))); } catch (e) {}
  }
  out.sort(function (a, b) { return (a.order - b.order) || (a.slug < b.slug ? -1 : 1); });
  return out;
}

function sitemapUpsert(xml, slug, add) {
  var loc = "https://www.mgcoat.com/blog/" + slug + ".html";
  var block = "  <url>\n    <loc>" + loc + "</loc>\n    <lastmod>" + new Date().toISOString().slice(0, 10) +
    "</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.70</priority>\n  </url>\n";
  var re = new RegExp("[ \\t]*<url>\\s*<loc>" + loc.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "</loc>[\\s\\S]*?</url>\\n?");
  if (xml.match(re)) xml = xml.replace(re, "");          // remove existing entry
  if (add) xml = xml.replace("</urlset>", block + "</urlset>");
  return xml;
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({
      googleClientId: env("GOOGLE_CLIENT_ID"),
      configured: !!(env("GITHUB_TOKEN") && env("ALLOWED_EMAIL") && env("GOOGLE_CLIENT_ID") && owner() && repo()),
    });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  var body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  if (!body.idToken) return res.status(401).json({ error: "missing token" });

  var info;
  try {
    var vr = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(body.idToken));
    info = await vr.json();
  } catch (e) { return res.status(401).json({ error: "token verification failed" }); }
  var allow = env("ALLOWED_EMAIL").toLowerCase().split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  var emailOk = info && (info.email_verified === "true" || info.email_verified === true) &&
    allow.indexOf(String(info.email || "").toLowerCase()) !== -1;
  if (!info || info.aud !== env("GOOGLE_CLIENT_ID") || !emailOk) return res.status(403).json({ error: "not authorized" });

  var action = body.action;
  try {
    if (action === "get") {
      var r = await gh(repoBase() + "/contents/" + enc(body.path) + "?ref=" + branch());
      if (r.status === 404) return res.status(200).json({ exists: false });
      var j = await r.json();
      return res.status(200).json({ exists: true, sha: j.sha, text: Buffer.from(j.content, "base64").toString("utf8") });
    }

    if (action === "putText" || action === "putBinary") {
      if (!body.path) return res.status(400).json({ error: "missing path" });
      var sha;
      var g = await gh(repoBase() + "/contents/" + enc(body.path) + "?ref=" + branch());
      if (g.status === 200) { sha = (await g.json()).sha; }
      var content = action === "putText" ? Buffer.from(String(body.text), "utf8").toString("base64") : String(body.base64);
      var pr = await gh(repoBase() + "/contents/" + enc(body.path), {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: body.message || ("Update " + body.path + " via Studio"), content: content, sha: sha, branch: branch() }),
      });
      var pj = await pr.json();
      if (pr.ok) return res.status(200).json({ ok: true, commit: pj.commit && pj.commit.html_url });
      return res.status(pr.status).json({ error: (pj && pj.message) || "github error" });
    }

    if (action === "commits") {
      var cr = await gh(repoBase() + "/commits?sha=" + branch() + "&per_page=8");
      var cj = await cr.json();
      var list = Array.isArray(cj) ? cj.map(function (c) { return { msg: c.commit.message.split("\n")[0], when: c.commit.author.date, url: c.html_url }; }) : [];
      return res.status(200).json({ commits: list });
    }

    // ---------------- Blog (CMS) ----------------
    if (action === "listArticles") {
      var arts = await loadArticles();
      return res.status(200).json({ articles: arts.map(function (a) { return { slug: a.slug, order: a.order, date: a.date, title: (a.L && a.L.en && a.L.en.title) || a.slug }; }) });
    }

    if (action === "getArticle") {
      var gr = await gh(repoBase() + "/contents/content/blog/" + enc(body.slug + ".json") + "?ref=" + branch());
      if (gr.status === 404) return res.status(200).json({ exists: false });
      var gjson = await gr.json();
      return res.status(200).json({ exists: true, article: JSON.parse(Buffer.from(gjson.content, "base64").toString("utf8")) });
    }

    if (action === "saveArticle") {
      var art = body.article;
      if (!art || !art.slug || !/^[a-z0-9-]{3,80}$/.test(art.slug)) return res.status(400).json({ error: "invalid slug (use a-z 0-9 - only)" });
      if (!art.L || !art.L.en || !art.L.en.title) return res.status(400).json({ error: "English title is required" });
      var existing = await loadArticles();
      var isNew = !existing.some(function (a) { return a.slug === art.slug; });
      if (!art.order) { var mx = existing.reduce(function (m, a) { return Math.max(m, a.order || 0); }, 0); art.order = mx + 10; }
      if (!art.date) art.date = new Date().toISOString().slice(0, 10);
      // fill missing languages with the English content so all 5 tabs work
      blog.LANGS.forEach(function (l) { if (!art.L[l] || !art.L[l].title) art.L[l] = art.L.en; });
      // rebuild list with this article in place
      var others = existing.filter(function (a) { return a.slug !== art.slug; });
      var all = others.concat([art]).sort(function (a, b) { return (a.order - b.order) || (a.slug < b.slug ? -1 : 1); });
      var jsonStr = JSON.stringify({ slug: art.slug, kw: art.kw || "", order: art.order, date: art.date, L: art.L }, null, 1) + "\n";
      var changes = [
        { path: "content/blog/" + art.slug + ".json", content: jsonStr },
        { path: "blog/" + art.slug + ".html", content: blog.articlePage(art) },
        { path: "blog/index.html", content: blog.indexPage(all) },
      ];
      var smr = await gh(repoBase() + "/contents/sitemap.xml?ref=" + branch());
      if (smr.status === 200) {
        var smx = Buffer.from((await smr.json()).content, "base64").toString("utf8");
        var nx = sitemapUpsert(smx, art.slug, true);
        if (nx !== smx) changes.push({ path: "sitemap.xml", content: nx });
      }
      var url = await commitFiles(changes, "Studio: " + (isNew ? "add" : "update") + " article " + art.slug);
      return res.status(200).json({ ok: true, isNew: isNew, commit: url });
    }

    if (action === "deleteArticle") {
      if (!body.slug) return res.status(400).json({ error: "missing slug" });
      var rem = await loadArticles();
      var keep = rem.filter(function (a) { return a.slug !== body.slug; });
      if (keep.length === rem.length) return res.status(404).json({ error: "article not found" });
      var ch = [
        { path: "content/blog/" + body.slug + ".json", del: true },
        { path: "blog/" + body.slug + ".html", del: true },
        { path: "blog/index.html", content: blog.indexPage(keep) },
      ];
      var sm2 = await gh(repoBase() + "/contents/sitemap.xml?ref=" + branch());
      if (sm2.status === 200) {
        var x2 = Buffer.from((await sm2.json()).content, "base64").toString("utf8");
        var nx2 = sitemapUpsert(x2, body.slug, false);
        if (nx2 !== x2) ch.push({ path: "sitemap.xml", content: nx2 });
      }
      var u2 = await commitFiles(ch, "Studio: delete article " + body.slug);
      return res.status(200).json({ ok: true, commit: u2 });
    }

    if (action === "saveTexts") {
      var page = body.path || "index.html";
      if (!EDITABLE_PAGES[page]) return res.status(400).json({ error: "page not editable" });
      var edits = body.edits || {};
      var keys = Object.keys(edits);
      if (!keys.length) return res.status(200).json({ ok: true, unchanged: true });
      var fr = await gh(repoBase() + "/contents/" + enc(page) + "?ref=" + branch());
      if (fr.status !== 200) return res.status(404).json({ error: "page not found" });
      var fj = await fr.json();
      var htmlText = Buffer.from(fj.content, "base64").toString("utf8");
      keys.forEach(function (k) { htmlText = replaceMarked(htmlText, k, edits[k]); });
      var pr2 = await gh(repoBase() + "/contents/" + enc(page), {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Studio: edit texts on " + page, content: Buffer.from(htmlText, "utf8").toString("base64"), sha: fj.sha, branch: branch() }),
      });
      var pj2 = await pr2.json();
      if (pr2.ok) return res.status(200).json({ ok: true, edited: keys.length, commit: pj2.commit && pj2.commit.html_url });
      return res.status(pr2.status).json({ error: (pj2 && pj2.message) || "github error" });
    }

    return res.status(400).json({ error: "unknown action" });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
