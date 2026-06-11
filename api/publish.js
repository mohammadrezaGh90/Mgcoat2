/* MGCoat Studio — secure publish endpoint (Vercel serverless function).
 *
 * Auth model: the admin panel signs the owner in with Google and sends the
 * resulting ID token with every request. This function verifies that token
 * server-side and only proceeds if the verified, email-verified Google
 * account matches ALLOWED_EMAIL. The GitHub token never leaves the server.
 *
 * Required environment variables (set in Vercel → Project → Settings → Environment Variables):
 *   GOOGLE_CLIENT_ID  - the OAuth client ID (also public, used by the panel)
 *   ALLOWED_EMAIL     - the management Gmail allowed to publish (comma-separated for more than one)
 *   GITHUB_TOKEN      - fine-grained PAT with "Contents: Read and write" on the repo
 *   GITHUB_OWNER      - e.g. mohammadrezaGh90
 *   GITHUB_REPO       - e.g. Mgcoat2
 *   GITHUB_BRANCH     - e.g. main  (optional, defaults to main)
 */
const GH = "https://api.github.com";
function env(k) { return process.env[k] || ""; }
function enc(p) { return String(p).split("/").map(encodeURIComponent).join("/"); }

async function gh(path, opts) {
  return fetch(GH + path, Object.assign({}, opts, {
    headers: Object.assign({
      Authorization: "Bearer " + env("GITHUB_TOKEN"),
      Accept: "application/vnd.github+json",
      "User-Agent": "mgcoat-studio",
    }, opts && opts.headers),
  }));
}

module.exports = async function handler(req, res) {
  const owner = env("GITHUB_OWNER"), repo = env("GITHUB_REPO"), branch = env("GITHUB_BRANCH") || "main";

  // Public config (no secrets) so the panel can boot Google Sign-In.
  if (req.method === "GET") {
    return res.status(200).json({
      googleClientId: env("GOOGLE_CLIENT_ID"),
      configured: !!(env("GITHUB_TOKEN") && env("ALLOWED_EMAIL") && env("GOOGLE_CLIENT_ID") && owner && repo),
    });
  }
  if (req.method !== "POST") return res.status(405).json({ error: "method not allowed" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};
  const idToken = body.idToken, action = body.action;
  if (!idToken) return res.status(401).json({ error: "missing token" });

  // --- verify Google identity ---
  let info;
  try {
    const vr = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken));
    info = await vr.json();
  } catch (e) { return res.status(401).json({ error: "token verification failed" }); }

  const allow = env("ALLOWED_EMAIL").toLowerCase().split(",").map(function (s) { return s.trim(); }).filter(Boolean);
  const emailOk = info && (info.email_verified === "true" || info.email_verified === true) &&
                  allow.indexOf(String(info.email || "").toLowerCase()) !== -1;
  if (!info || info.aud !== env("GOOGLE_CLIENT_ID") || !emailOk) {
    return res.status(403).json({ error: "not authorized" });
  }

  try {
    if (action === "get") {
      const r = await gh("/repos/" + owner + "/" + repo + "/contents/" + enc(body.path) + "?ref=" + branch);
      if (r.status === 404) return res.status(200).json({ exists: false });
      const j = await r.json();
      return res.status(200).json({ exists: true, sha: j.sha, text: Buffer.from(j.content, "base64").toString("utf8") });
    }

    if (action === "putText" || action === "putBinary") {
      const path = body.path;
      if (!path) return res.status(400).json({ error: "missing path" });
      let sha;
      const g = await gh("/repos/" + owner + "/" + repo + "/contents/" + enc(path) + "?ref=" + branch);
      if (g.status === 200) { const gj = await g.json(); sha = gj.sha; }
      const content = action === "putText"
        ? Buffer.from(String(body.text), "utf8").toString("base64")
        : String(body.base64);
      const r = await gh("/repos/" + owner + "/" + repo + "/contents/" + enc(path), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: body.message || ("Update " + path + " via MGCoat Studio"), content: content, sha: sha, branch: branch }),
      });
      const j = await r.json();
      if (r.ok) return res.status(200).json({ ok: true, commit: j.commit && j.commit.html_url });
      return res.status(r.status).json({ error: (j && j.message) || "github error" });
    }

    if (action === "commits") {
      const r = await gh("/repos/" + owner + "/" + repo + "/commits?sha=" + branch + "&per_page=8");
      const j = await r.json();
      const list = Array.isArray(j) ? j.map(function (c) {
        return { msg: c.commit.message.split("\n")[0], when: c.commit.author.date, url: c.html_url };
      }) : [];
      return res.status(200).json({ commits: list });
    }

    return res.status(400).json({ error: "unknown action" });
  } catch (e) {
    return res.status(500).json({ error: String((e && e.message) || e) });
  }
};
