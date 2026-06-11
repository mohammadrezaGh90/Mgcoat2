# MGCoat Studio — one-time setup (≈10 minutes)

MGCoat Studio is a private control panel at **https://www.mgcoat.com/admin/** that lets
you update the website from your phone (contact details, an announcement bar, and
images/videos). You sign in with Google, and only the authorised account can publish.

Nothing secret is stored in the website code. The three values below live only in
Vercel's encrypted environment variables.

---

## 1. Create a GitHub access token (lets the panel publish)

1. GitHub → your avatar → **Settings** → **Developer settings** → **Fine-grained tokens** → **Generate new token**.
2. **Repository access** → *Only select repositories* → choose **Mgcoat2**.
3. **Permissions** → **Repository permissions** → **Contents** → **Read and write**.
4. Generate, then **copy the token** (starts with `github_pat_…`).

## 2. Create a Google Sign-In client (the login button)

1. Go to <https://console.cloud.google.com/> → create a project (e.g. *MGCoat Studio*).
2. **APIs & Services → OAuth consent screen** → User type **External** → fill app name + your email → Save. Add your management email as a **Test user**.
3. **APIs & Services → Credentials → Create credentials → OAuth client ID** → Application type **Web application**.
4. Under **Authorized JavaScript origins** add:
   - `https://www.mgcoat.com`
   - `https://mgcoat.com`
5. Create, then **copy the Client ID** (ends with `.apps.googleusercontent.com`).

## 3. Add the secrets to Vercel

Vercel → your project → **Settings → Environment Variables** → add these (Production):

| Name | Value |
|------|-------|
| `GOOGLE_CLIENT_ID` | the Client ID from step 2 |
| `ALLOWED_EMAIL` | your management Gmail (the only account allowed to publish) |
| `GITHUB_TOKEN` | the token from step 1 |
| `GITHUB_OWNER` | `mohammadrezaGh90` |
| `GITHUB_REPO` | `Mgcoat2` |
| `GITHUB_BRANCH` | `main` |

> Tip: for more than one manager, set `ALLOWED_EMAIL` to a comma-separated list.

Then **redeploy** (Vercel → Deployments → ⋯ → Redeploy) so the new variables take effect.

## 4. Install the app on your phone

1. Open **https://www.mgcoat.com/admin/** in your phone browser.
2. **iPhone (Safari):** Share → *Add to Home Screen*. **Android (Chrome):** ⋮ → *Install app* / *Add to Home screen*.
3. Open it from the home-screen icon — it runs full-screen like a normal app.
4. Tap **Sign in with Google** and choose your management account.

---

## What you can do today
- **Settings** — WhatsApp number, phone, email, Instagram (applied site-wide), and an optional red announcement bar on the homepage.
- **Media** — upload or replace any image (`assets/img`) or video (`assets/video`). Use the exact existing file name to replace one.
- **Status** — see your recent published changes; the live site updates 1–2 minutes after each publish.

## Security notes
- Only the email in `ALLOWED_EMAIL` can publish; every request is verified server-side.
- The GitHub token stays on Vercel, never in the browser or the public code.
- The `/admin/` page is hidden from search engines (`noindex`).
- If a token is ever lost, revoke it on GitHub and generate a new one — nothing else changes.

## Coming later (not in this version)
- Writing/translating blog articles from the phone.
