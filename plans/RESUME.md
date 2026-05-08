# Session Resume — ivanbakalo.com NIW Platform Rebuild
**Date:** 2026-05-08  
**Branch merged:** feature/technical-task → main  
**Production:** https://ivanbakalo.com (Cloudflare Pages, `bakalo-capital` project)

---

## What Was Done This Session

### 1. Full Site Redesign (frontend)
`index.html` completely rebuilt (~1,200 lines). New design system:
- **Palette:** navy `#0a1628` / white / light `#f8f9fb` / accent `#1d4ed8` (replaces warm ink/paper/gold)
- **Typography:** Cormorant Garamond (display) + Inter (UI/body) — replaces DM Mono
- **Nav (8 items):** Home · About · Research · Implementation & Recognition · Professional Engagement · Proposed Endeavor · Research Profiles · Contact

**New sections:**
- **Research** (was Articles): Featured Research card, category tabs, article cards with SSRN/DOI/View Publication buttons, impact tag chips. Reviews removed entirely.
- **Implementation & Recognition**: evidence list from `/api/evidence` — Title / Description / Institution · Year / [View Evidence]
- **Professional Engagement**: engagements list from `/api/engagements` — same format
- **Proposed Endeavor**: rebuilt as NIW petition summary (dark navy, 4-pillar grid)
- **Research Profiles**: SSRN, Google Scholar, ORCID, ResearchGate, LinkedIn cards
- **Contact**: minimal — email, LinkedIn, location only
- **About**: systemic risk focus, CAMBA experience block, memberships
- **Home**: NIW-positioned hero, 3 CTA buttons

**Admin panel:** unified modal for articles / evidence / engagements. Article form adds ssrn_url, doi_url, tags, is_featured, sort_order.

### 2. Backend — New APIs (TDD, 49 tests green)
Migration `0002_evidence_engagements.sql`:
- Adds `ssrn_url`, `doi_url`, `tags` columns to `articles`
- New `evidence` table (Implementation & Recognition items)
- New `engagements` table (Professional Engagement items)

New API modules (Cloudflare Pages Functions):
- `functions/api/evidence.js` + `functions/api/evidence/[id].js` — full CRUD, admin-only writes
- `functions/api/engagements.js` + `functions/api/engagements/[id].js` — full CRUD, admin-only writes
- Articles API updated to handle new fields

### 3. Database — Remote D1 Seeded
D1 database `bakalo-db` (`0f8b90d7-8e9a-434c-b5fa-baf6a7d267b6`) — fully populated:
- 7 articles — executive descriptions, impact tags, is_featured set
- 5 evidence items: Clarivate, Silesian U., Erasmus+, Ostroh Academy, Category B journal
- 6 engagements: Gartner, IMF, Joint Vienna Institute, Deloitte, Banque de France, IIA

### 4. DNS — Fixed
`ivanbakalo.com` zone (`85bb348b63aba16863397d9c20051520`) in Cloudflare:
- `ivanbakalo.com` CNAME → `bakalo-capital.pages.dev` (proxied) — was active, confirmed
- `www.ivanbakalo.com` CNAME → `bakalo-capital.pages.dev` (proxied) — **added this session**
- Both registered as Pages custom domains, SSL active
- GitHub Pages: still technically enabled in repo but Cloudflare routing takes precedence. **TODO: disable GitHub Pages in repo Settings → Pages → set source to None.**

### 5. Cloudflare Pages Project
- **Project:** `bakalo-capital`
- **Account:** `e8eeb644ca96a2d4cb2a9674ea599e79` (Dimabashtan@gmail.com)
- **Production branch:** `main`
- **Production URL:** https://ivanbakalo.com (also https://bakalo-capital.pages.dev)
- **CI:** GitHub Actions on push to `main` or `feature/**` — applies migrations, seeds if empty, deploys

---

## Pending / Next Steps

### High Priority
- [ ] **Disable GitHub Pages** — repo Settings → Pages → Source: None (avoids confusion)
- [ ] **Set JWT_SECRET** in Cloudflare Pages → bakalo-capital → Settings → Environment Variables → Production. Without this, admin login will fail in production. Value: any long random string.
- [ ] **Add real article URLs** — all articles currently have `url: '#'`. Update via admin panel once live: SSRN links, DOI links, publication URLs.
- [ ] **Add real evidence URLs** — evidence_url fields are empty. Upload PDFs/screenshots and add links via admin panel.
- [ ] **Add real engagement URLs** — same as above.
- [ ] **Add Research Profile links** — Research Profiles section has placeholder hrefs. Update in index.html or via admin.

### Medium Priority
- [ ] **Test admin panel end-to-end** on production — triple-click logo → login → add/edit/delete articles, evidence, engagements.
- [ ] **Mobile QA** — test nav hamburger, article cards, evidence list on mobile.
- [ ] **SEO** — meta description and OG tags are in `<head>`, but no real canonical URL is confirmed. Check with Lighthouse.

### Token Reference (for future sessions)
Tokens are stored securely — do not commit them. Retrieve from Cloudflare Dashboard → My Profile → API Tokens.
- **Cloudflare API Token** (Pages + D1 scope): named token in dashboard, set via `export CLOUDFLARE_API_TOKEN=<token>`
- **Cloudflare DNS Token** (Zone DNS Edit for ivanbakalo.com): set via `export CLOUDFLARE_DNS_TOKEN=<token>`

---

## Key File Locations
| File | Purpose |
|------|---------|
| `index.html` | Entire frontend (single file, ~95KB + logo) |
| `functions/api/articles.js` | Articles GET/POST |
| `functions/api/articles/[id].js` | Articles GET/PUT/DELETE by id |
| `functions/api/evidence.js` | Evidence GET/POST |
| `functions/api/evidence/[id].js` | Evidence GET/PUT/DELETE by id |
| `functions/api/engagements.js` | Engagements GET/POST |
| `functions/api/engagements/[id].js` | Engagements GET/PUT/DELETE by id |
| `functions/lib/auth.js` | requireAuth (JWT validation) |
| `migrations/0001_init.sql` | articles + users tables |
| `migrations/0002_evidence_engagements.sql` | ssrn_url/doi_url/tags + evidence + engagements |
| `schema.sql` | Reference schema (source of truth) |
| `seed.sql` | Seed data for all tables |
| `test/articles-api.test.js` | Articles API tests (Vitest) |
| `test/evidence-api.test.js` | Evidence API tests |
| `test/engagements-api.test.js` | Engagements API tests |
| `wrangler.toml` | Cloudflare Pages + D1 config |
| `.github/workflows/*.yml` | CI: migrate + seed + deploy on push |
| `plans/technical-task-prd.md` | Full PRD for this rebuild |

## Run Tests
```bash
npm test   # 49 tests, 5 files, all green
```
