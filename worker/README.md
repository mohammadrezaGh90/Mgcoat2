# MG COAT — AI Assistant deploy guide

This turns the site's assistant into a real AI that answers any question as an
MG COAT product expert, in the customer's language. The API key stays safe
inside Cloudflare and is never exposed in the website.

`mgcoat-assistant.js` supports **both Claude (Anthropic) and DeepSeek** — pick
one with the `PROVIDER` variable. Default is Claude (`claude-haiku-4-5`).

---

## What you need
1. An API key — from `platform.claude.com` (Claude) **or** `platform.deepseek.com` (DeepSeek).
2. A free Cloudflare account — `dash.cloudflare.com`.

> Do NOT paste the key into the website or share it in chat. It only goes into
> Cloudflare as a Secret (steps below).

---

## Deploy (no command line — all in the Cloudflare dashboard)

1. **Cloudflare → Workers & Pages → Create → Workers → Create Worker.**
   Give it a name, e.g. `mgcoat-assistant`. Click **Deploy** (default code is fine for now).
2. Open the worker → **Edit code.** Delete everything, paste the full contents of
   `mgcoat-assistant.js`, then **Deploy**.
3. Worker → **Settings → Variables and Secrets**:
   - Add **Secret** (encrypted):
     - For Claude: name `ANTHROPIC_API_KEY`, value = your `sk-ant-...` key.
     - For DeepSeek: name `DEEPSEEK_API_KEY`, value = your `sk-...` key.
   - Add **Variable** (plain text):
     - `PROVIDER` = `claude` (default) or `deepseek`
     - *(optional)* `MODEL` = `claude-haiku-4-5` / `claude-sonnet-4-6` / `deepseek-chat`
     - *(optional)* `ALLOW_ORIGIN` = `https://www.mgcoat.com`
   - **Deploy** again so the variables take effect.
4. Copy the worker URL (looks like `https://mgcoat-assistant.<your-subdomain>.workers.dev`).
5. Open `assets/js/app.js`, set:
   ```js
   var ASSIST_API = "https://mgcoat-assistant.<your-subdomain>.workers.dev";
   ```
   (Tell me the URL and I'll set it + bump the cache version + deploy — or edit it yourself.)

That's it. If `ASSIST_API` is empty or the worker is unreachable, the site
automatically falls back to the built-in keyword answers, so nothing ever breaks.

---

## Keep costs safe
- In the Anthropic console set a **monthly spend limit** (Billing → Limits).
- The worker caps each reply at 600 tokens.
- Optional: in Cloudflare add a **Rate limiting rule** on the worker route to block abuse.

## Switching provider/model later
Just change the `PROVIDER` / `MODEL` variables in Cloudflare and Deploy — no code change.
