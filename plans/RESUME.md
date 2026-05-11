# Session Resume — ivanbakalo.com NIW Platform
**Last updated:** 2026-05-11
**Production:** https://ivanbakalo.com (Cloudflare Pages, project `bakalo-capital`)
**Main branch:** `main` @ `0dae624`

---

## What Was Done Across Last Two Sessions

### Session 1 (2026-05-08) — Full NIW Platform Rebuild
`feature/technical-task` → merged to `main`

- Full site redesign: new institutional palette (navy/blue/white), 8-section nav, NIW-positioned copy
- New APIs: `/api/evidence`, `/api/engagements` (full CRUD, JWT-protected writes)
- Migration `0002_evidence_engagements.sql`: adds `ssrn_url`, `doi_url`, `tags` to articles; new `evidence` and `engagements` tables
- D1 database seeded: 7 articles, 5 evidence items, 6 engagements
- DNS fixed: `ivanbakalo.com` + `www` → `bakalo-capital.pages.dev`, SSL active
- CI: GitHub Actions deploys on push to `main` or `feature/**`
- 49 tests green (`npm test`)

Full PRD in `plans/technical-task-prd.md`.

### Session 2 (2026-05-11) — Visual Regression Analysis + Owner Photo

**Color palette investigation:**
- Confirmed the warm gold/paper → navy/blue/white palette change was intentional, instructed by `raw/ivanbakalo.com.docx` §1 GLOBAL DESIGN/UI: *"dark blue / white / gray palette"*
- Full analysis saved to `docs/COLOR_PALETTE_CHANGE.md` (branch `chore/visual-regression-analysis`)

**Owner photo added to homepage hero:**
- Photo source: `raw/ivanbakalo.com.docx` → `image4.jpg` (conference shot, nameplate "Mr. Ivan Bakalo")
- Saved to `assets/ivan-bakalo.jpg`
- Hero restructured into two-column grid: text left (1fr), portrait right (420px)
- Portrait has accent-left border (`var(--accent-lt)`), collapses to single column on mobile ≤768px
- Branch `feature/add-platform-owner-photo` → merged to `main`

**Deployment cleanup:**
- All staging/preview deployments deleted — Cloudflare Pages now has one deployment (production only)
- `wrangler.toml.bak` added to `.gitignore`
- `main` pushed to origin; GitHub Actions CI triggered production deploy

---

## Current Branch State
| Branch | Status |
|--------|--------|
| `main` | Production — up to date with origin |
| `chore/visual-regression-analysis` | Pushed — contains `docs/COLOR_PALETTE_CHANGE.md` only; not merged (informational) |
| `feature/add-platform-owner-photo` | Pushed — merged to main |
| `feature/technical-task` | Pushed — merged to main |
| `feature/stakeholders-requirements` | Pushed — merged to main (older) |

---

## Pending / Next Steps

### High Priority
- [ ] **Set JWT_SECRET in production** — Cloudflare Pages → `bakalo-capital` → Settings → Environment Variables → Production. Without this, admin login fails on the live site.
- [ ] **Disable GitHub Pages** — repo Settings → Pages → Source: None (Cloudflare takes precedence, but cleaner to disable)
- [ ] **Add real article URLs** — all articles have `url: '#'`. Update via admin panel: SSRN links, DOI links, publication URLs.
- [ ] **Add real evidence URLs** — `evidence_url` fields are empty. Upload PDFs/screenshots, add links via admin.
- [ ] **Add real engagement URLs** — same as above.
- [ ] **Add Research Profile links** — Research Profiles section has placeholder hrefs in `index.html`.

### Medium Priority
- [ ] **Test admin panel on production** — triple-click logo → login → add/edit/delete articles, evidence, engagements
- [ ] **Mobile QA** — test nav, article cards, evidence/engagement lists, hero photo collapse on mobile
- [ ] **SEO** — verify meta description and OG tags in `<head>`, Lighthouse audit

---

## Cloudflare Account
- **Account ID:** `e8eeb644ca96a2d4cb2a9674ea599e79` (dimabashtan@gmail.com)
- **Pages project:** `bakalo-capital`
- **D1 database:** `bakalo-db` / `0f8b90d7-8e9a-434c-b5fa-baf6a7d267b6`
- **API Token:** set via `export CLOUDFLARE_API_TOKEN=<token>` (retrieve from Cloudflare Dashboard → My Profile → API Tokens)
- **Deploy to staging:** `bash scripts/deploy-staging.sh` (requires token exported)

---

## Key Files
| File | Purpose |
|------|---------|
| `index.html` | Entire frontend (~95KB + logo + portrait) |
| `assets/ivan-bakalo.jpg` | Owner portrait used in hero |
| `functions/api/articles.js` + `/[id].js` | Articles CRUD |
| `functions/api/evidence.js` + `/[id].js` | Evidence CRUD |
| `functions/api/engagements.js` + `/[id].js` | Engagements CRUD |
| `functions/lib/auth.js` | JWT auth middleware |
| `migrations/0001_init.sql` | articles + users schema |
| `migrations/0002_evidence_engagements.sql` | evidence + engagements + new article columns |
| `seed.sql` | Full seed data |
| `schema.sql` | Reference schema |
| `wrangler.toml` | Cloudflare Pages + D1 config |
| `.github/workflows/deploy.yml` | CI: migrate + seed + deploy on push |
| `docs/COLOR_PALETTE_CHANGE.md` | Color palette investigation report |
| `plans/technical-task-prd.md` | Full PRD for NIW platform rebuild |

## Run Tests
```bash
npm test   # 49 tests, 5 files, all green
```
