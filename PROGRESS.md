# MG COAT — Site Progress Log

Living checklist so any future session can pick up exactly where work stopped.
Update this file whenever a task is finished or a new one is requested.

## Site
- Live repo: `mohammadrezaGh90/Mgcoat2` (deployed from `main`)
- Working branch: `claude/github-project-continue-4opmhd` — after each task, fast-forward push to `main` to publish
- Stack: static HTML/CSS/JS, 5 languages (EN/RU/TR/AR/FA), no build step
- Cache busting: bump `?v=` query on `style.css` / `app.js` in `index.html` after each change

## Done
- [x] Multilingual blog (10 articles × 5 languages) + blog index
- [x] Multilingual white paper + per-language PDFs (`/whitepaper`)
- [x] Catalogue page + per-language PDFs (`/catalog`)
- [x] iOS background-video autoplay fix (JS-driven play on view + first gesture)
- [x] Rebrand: MG TECH → **MG COAT** everywhere (text, meta, schema, generator script)
  - Kept as-is on purpose: domain `mgcoat.com`, Instagram `@mgcoatcom`, PDF filenames `MGCoat-*`, schema `alternateName: "MGCoat"`
- [x] Hero: replaced MG TECH logo image with CSS lockup (MG icon + chrome "MG COAT" wordmark)
- [x] Default language: always English (only `?lang=` URL param overrides)
- [x] Elevator auto-glide: 2s initial pause, 7s glide, soft quintic landing
- [x] Language pill attention cue: fires 1s after the elevator lands, 3s red-neon pulse,
      soft vertical roll preview of all languages (page language does NOT change — preview only)
- [x] Hero badges are tappable: localized glass popover (6 badges × 5 langs) + "Learn more" scroll link
- [x] Site assistant: floating bot (bottom-start, above WhatsApp) with localized greeting/chips,
      keyword Q&A over a built-in 12-topic knowledge base × 5 langs, section/blog/catalog links,
      WhatsApp fallback when no match. Static-site only (no server/LLM)

## Remaining / Ideas
- [ ] `assets/img/og-banner.jpg` (social-share image) may still show "MG TECH" — needs redesign (image file, not code)
- [ ] Professional "MG COAT" logo to replace the CSS hero lockup when ready
- [ ] Favicons likely fine (icon-only MG mark) — verify on a real device
- [ ] PR to formally merge the working branch into `main` (currently published via fast-forward pushes)

## Conventions
- Persian replies to the owner; site content stays 5-lingual
- Commit after every completed task and push the branch, then fast-forward `main` to publish
- Never force-push `main`; only fast-forward when the branch contains `origin/main`
