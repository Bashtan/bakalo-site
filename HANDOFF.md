# Bakalo Site — Handoff & Context Document

## What this is

Single-file static portfolio site for **Ivan Bakalo**, an Audit, Risk & Compliance
professional. Primary purpose: NIW (National Interest Waiver) supporting platform,
positioning Ivan as a U.S. Financial Stability / Governance / Systemic Risk expert.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Single HTML file (`index.html`) — vanilla JS + CSS, no framework, no build step |
| Hosting | Cloudflare Pages (`bakalo-capital` project) |
| Database | Cloudflare D1 (`bakalo-db`) — SQLite, accessed via Pages Functions |
| API | Cloudflare Pages Functions (`functions/api/`) — REST endpoints for articles, evidence, engagements, auth |
| Auth | JWT (HS256) via `JWT_SECRET` env var in Cloudflare Pages settings |

---

## Key URLs

| Environment | URL |
|-------------|-----|
| Production | `https://bakalo-capital.pages.dev` |
| Custom domain (pending) | `ivanbakalo.com` (not yet configured) |
| Admin login | Triple-click the navbar **BAKALO** logo |

---

## Repository

**GitHub:** `https://github.com/Bashtan/bakalo-site`  
**Default branch:** `main` (only branch — staging branches are short-lived and deleted after merge)

---

## Credentials & Secrets

> **Never commit credentials.** All secrets live in Cloudflare Pages environment variables.

| Secret | Where |
|--------|-------|
| Admin email | `bakalo.science@gmail.com` |
| Admin password | Stored as PBKDF2 hash in `seed.sql` — ask client directly |
| `JWT_SECRET` | Cloudflare Pages → bakalo-capital → Settings → Environment Variables |
| `CLOUDFLARE_API_TOKEN` | Generate at dash.cloudflare.com → My Profile → API Tokens (needs Pages Edit + D1 Edit) |
| `CLOUDFLARE_ACCOUNT_ID` | `e8eeb644ca96a2d4cb2a9674ea599e79` |

---

## File Structure

```
./
├── index.html                    # ← entire frontend (CSS + JS + HTML, ~1300 lines)
├── CLAUDE.md                     # AI coding instructions & architecture decisions
├── HANDOFF.md                    # this file
├── schema.sql                    # reference schema (not applied directly)
├── seed.sql                      # seed data — run after migrations on fresh DB
├── wrangler.toml                 # Cloudflare config (D1 binding, Pages build dir)
├── functions/
│   └── api/
│       ├── auth.js               # POST /api/auth/login
│       ├── articles.js           # GET/POST /api/articles
│       ├── articles/[id].js      # GET/PUT/DELETE /api/articles/:id
│       ├── evidence.js           # GET/POST /api/evidence
│       ├── evidence/[id].js      # GET/PUT/DELETE /api/evidence/:id
│       ├── engagements.js        # GET/POST /api/engagements
│       ├── engagements/[id].js   # GET/PUT/DELETE /api/engagements/:id
│       └── lib/auth.js           # requireAuth() JWT middleware
├── migrations/
│   ├── 0001_init.sql             # articles + users tables
│   ├── 0002_evidence_engagements.sql
│   └── 0003_category_tabs.sql    # category column on evidence + engagements
└── scripts/
    └── deploy-staging.sh         # full staging deploy (D1 migrate + seed + Pages)
```

---

## Deploy

### Staging (preview branch)

```bash
export CLOUDFLARE_API_TOKEN=<token>   # Pages Edit + D1 Edit permissions
export CLOUDFLARE_ACCOUNT_ID=e8eeb644ca96a2d4cb2a9674ea599e79
BRANCH=fix/your-branch-name bash scripts/deploy-staging.sh
```

Script: creates/reuses D1 DB → applies pending migrations → seeds data → deploys to Pages.
Preview URL pattern: `https://fix-your-branch-name.bakalo-capital.pages.dev`

### Production

```bash
# Merge to main, then:
npx wrangler pages deploy . \
  --project-name bakalo-capital \
  --branch main \
  --commit-message "your message"
```

---

## Site Sections (nav order)

| Section | ID | Notes |
|---------|----|-------|
| Home | `#home` | Hero, portrait photo, 3 CTA buttons |
| About | `#about` | Skills list, background |
| Research | `#research` | Articles grid with category tabs; featured article block |
| Implementation & Recognition | `#implementation` | Evidence cards with 6 filter tabs |
| Professional Engagement | `#engagement` | Engagement cards with 6 filter tabs |
| Proposed Endeavor | `#endeavor` | NIW petition summary, 4 pillars |
| Research Profiles | `#profiles` | 5 platform cards (SSRN, Scholar, ORCID, RG, LinkedIn) |
| Contact | `#contact` | Email + LinkedIn + location |

---

## Admin Mode

- **Trigger:** Triple-click the `BAKALO` logo in the nav bar
- **Login:** `bakalo.science@gmail.com` / (password — ask client)
- **Capabilities:** Add/edit/delete articles, evidence entries, engagement entries
- **Logout:** "Logout" button appears in the Research section header when active

---

## Database (D1)

**Database name:** `bakalo-db`  
**Database ID:** `0f8b90d7-8e9a-434c-b5fa-baf6a7d267b6`

Tables: `users`, `articles`, `evidence`, `engagements`

Run migrations manually if needed:
```bash
npx wrangler d1 migrations apply bakalo-db --remote
```

Re-seed:
```bash
npx wrangler d1 execute bakalo-db --remote --file=seed.sql
```

---

## Content Data Model

### Articles (Research section)
Categories: `U.S. Banking System` · `Financial Stability` · `Risk & Regulation` · `Research & Methodology`  
Fields: title, url, ssrn_url, doi_url, category, description, year, tags, is_featured, sort_order

### Evidence (Implementation & Recognition)
Categories: `Recognition` · `Professional Development` · `Certifications` · `Implementation` · `Academic Participation`  
Fields: title, category, description, institution, year, evidence_url, sort_order

### Engagements (Professional Engagement)
Categories: `AI Governance` · `Audit & Cybersecurity` · `Governance Discussions` · `Continuing Education` · `Memberships`  
Fields: title, category, description, organization, year, evidence_url, sort_order

---

## Design Tokens

```css
--accent:   #b8935a   /* gold — primary accent, labels, buttons */
--paper:    #f5f2ec   /* warm off-white — main background */
--light:    #ede8df   /* cream — alternate section background */
--navy:     #0e0e0e   /* near-black — headings, hero */
--slate:    #7a7468   /* muted — secondary text, nav links */
--border:   #c8c0b0   /* warm grey — card borders, dividers */
```

Typography: `Cormorant Garamond` (body/headings) + `DM Mono` (UI labels, metadata)

**Do not** switch to a navy/blue palette — client explicitly reverted to warm gold (5/11/26).

---

## Pending Work (from CLAUDE.md)

### High priority
- Replace `href="#"` placeholder links on publication cards with real SSRN / DOI URLs
- Admin password protection is currently a client-side check only — no real security
- Cross-device article sync (currently D1 backend handles this, but confirm working)

### Medium priority
- Mobile reviews panel is cramped on small screens
- Article card thumbnails (optional image URL field)
- Export/import articles as JSON

### Known bugs
- Star hover state on reviews uses dual CSS+inline approach — can leave stuck state
- iframe fallback triggers after 5s timeout (may false-positive on slow connections)

---

## Recent Work (this session — 2026-05-22/23)

1. **Category filter tabs** on Implementation & Recognition and Professional Engagement sections
   - DB migration `0003_category_tabs.sql` adds `category` column to both tables
   - Admin forms updated with Category dropdowns
   - Client-side filtering — no new API calls

2. **Research Profile icons** replaced with official Simple Icons SVG paths
   - SSRN, Google Scholar (graduation cap), ORCID, ResearchGate, LinkedIn
   - All sourced from `simpleicons.org` canonical 24×24 paths

---

## Raw Stakeholder Document

`raw/ivanbakalo.com.docx` — client's running brief/feedback document (Ukrainian + English).  
Always diff against previous version before starting work to identify new requirements.
