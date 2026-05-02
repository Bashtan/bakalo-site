# PRD — Articles Section Redesign + Cloudflare D1 Backend + Admin Auth

> GitHub Issue: https://github.com/Bashtan/bakalo-site/issues/1  
> Branch: `feature/stakeholders-requirements`  
> Created: 2026-05-02

---

## Problem Statement

The Articles section of ivanbakalo.com has several UX and reliability problems that create a negative first impression for professional visitors:

- **The iframe viewer always fails** — SSRN and Google Scholar send `X-Frame-Options: DENY`, so every article open attempt ends in a "cannot be displayed in embedded frame" error and forces the user to click "Open in new tab" anyway. The overlay adds friction with no benefit.
- **"0 reviews" looks empty and unprofessional** — The site is new. Showing a reviews panel with zero content signals abandonment, not quality.
- **Categories are wrong for the audience** — The existing tags (Audit, Risk, Compliance, Governance, IFRS, Research, Other) don't match the academic publication categories appropriate for an NIW portfolio. The stakeholder needs: U.S. Banking System, Financial Stability, Risk & Regulation, Research & Methodology.
- **No manual ordering** — Articles display alphabetically with no way to curate which papers appear most prominently.
- **No featured paper** — There is one flagship paper (Integrated Financial Security Diagnostics System) that should always appear first as a wider hero card.
- **Data is localStorage-only** — Articles added on one device are invisible on another. There is no persistence across devices or browsers.
- **No authentication** — The admin toggle has zero authentication. Any visitor can toggle admin mode and modify articles.

---

## Solution

Replace the localStorage article store with a Cloudflare D1 (SQLite) database accessed through Cloudflare Pages Functions. Add JWT-based authentication with a hidden login modal (triggered by triple-clicking the navbar logo). Redesign the Articles section to: show a Featured Research hero block at the top, filter tabs with the four new academic categories, clean article cards with no reviews UI, a direct "View Article" button that opens a new tab, and admin-mode up/down ordering controls.

---

## User Stories

1. As a portfolio visitor, I want article categories that reflect the author's research domain (U.S. Banking System, Financial Stability, Risk & Regulation, Research & Methodology), so that I can quickly identify papers relevant to my interests.
2. As a portfolio visitor, I want to filter articles by category using tabs, so that I can browse a focused subset without seeing unrelated papers.
3. As a portfolio visitor, I want clicking "View Article" to open the paper in a new tab immediately, so that I am never shown a broken iframe error.
4. As a portfolio visitor, I want to see a prominent Featured Research card at the top of the Articles section, so that I immediately understand the author's flagship contribution.
5. As a portfolio visitor, I want article cards to show only the title, category, year, and description, so that the list looks polished and complete — not empty with "0 reviews".
6. As a portfolio visitor, I want the article list to load the same regardless of which device or browser I use, so that the portfolio reflects all published work consistently.
7. As a portfolio visitor, I want no admin UI elements visible anywhere on the page, so that the site looks like a clean professional portfolio.
8. As the site author, I want to access the admin login by triple-clicking the navbar logo, so that the admin interface is hidden from casual visitors.
9. As the site author, I want to log in with my email and password, so that only I can modify article content.
10. As the site author, I want my login session to persist across browser restarts, so that I don't have to re-authenticate every visit.
11. As the site author in admin mode, I want to flag one article as "Featured Research", so that it always renders as the hero card above the grid.
12. As the site author in admin mode, I want to reorder articles within a category using ↑ and ↓ buttons, so that I can curate the reading order to tell a coherent story.
13. As the site author in admin mode, I want to add, edit, and delete articles with the four new academic categories, so that the taxonomy matches my publication portfolio.
14. As the site author in admin mode, I want article changes to persist to a backend database, so that updates appear immediately on all devices.
15. As the site author, I want 7 pre-seeded articles with placeholder URLs loaded at launch, so that the site looks complete while I gather the real DOI/SSRN links.
16. As the site author, I want the featured article to always appear above the filter tabs regardless of which category is active, so that the flagship paper is always visible.
17. As a portfolio visitor, I want the filter tabs to include an "All" option, so that I can return to the full list after filtering.
18. As the site author in admin mode, I want a Logout button inside the admin controls area, so that I can end my session without refreshing the page.

---

## Implementation Decisions

### F1 — Cloudflare Pages Functions + D1 Backend

- Replace `localStorage` (`ib_articles_v2`) with Cloudflare D1 SQLite database
- REST API via Pages Functions:
  - `GET /api/articles` — public
  - `POST /api/articles` — admin JWT required
  - `PUT /api/articles/:id` — admin JWT required
  - `DELETE /api/articles/:id` — admin JWT required
- `wrangler.toml` declares D1 binding (`DB`) and Pages project name (`bakalo-capital`)
- Migrations applied via `wrangler d1 migrations apply`

### F2 — Article Categories

- `tag` field renamed to `category`
- Valid values: `"U.S. Banking System"`, `"Financial Stability"`, `"Risk & Regulation"`, `"Research & Methodology"`
- Filter tab bar: **All** | U.S. Banking System | Financial Stability | Risk & Regulation | Research & Methodology
- Featured article always visible when "All" tab is active

### F3 — Featured Research Block

- `is_featured` boolean field per article (D1: INTEGER 0/1)
- Frontend enforces one featured at a time (UI shows first `is_featured=1` article)
- Featured renders above the filter tab bar as a wider hero card with gold "Featured Research" label
- Admin modal gains a "Mark as Featured Research" checkbox

### F4 — Remove Iframe Viewer

- `#articleViewer` overlay HTML deleted (lines 471–514)
- `openViewer()`, `closeViewer()`, `curId` JS deleted
- All `.viewer-*` and `.iframe-fallback` CSS deleted
- "Read →" renamed to "View Article" — calls `window.open(a.url, '_blank')`
- Escape key handler updated to close modal only

### F5 — Remove Reviews UI

- All reviews HTML, JS (`getReviews`, `setReviews`, `renderReviews`, `postReview`, `delReview`), and CSS (`.reviews-panel`, `.star-btn`, etc.) deleted
- `ib_reviews_v2` localStorage key no longer written
- No reviews UI in public or admin mode
- Reviews v2 is a future feature (pending approval workflow design)

### F6 — Admin Article Ordering

- ↑ and ↓ buttons on each article card in admin mode
- ↑ disabled on first article in category; ↓ disabled on last
- Swap: exchanges `sort_order` values between adjacent articles, calls `PUT /api/articles/:id` for both
- Featured article exempt from sort order (always renders first)

### F7 — Seed Data

7 articles, all `url = "#"`:

| Title | Category | is_featured | sort_order |
|-------|----------|-------------|------------|
| Integrated Financial Security Diagnostics System: Concept, Methodological Tools and Verification of Results | Research & Methodology | 1 | 1 |
| Regulatory Architecture and Quantitative Indicators of Financial Security in the U.S. Banking System | U.S. Banking System | 0 | 1 |
| Financial Security of Banking Systems: Conceptual Framework, Indicators, and Evidence from the United States | U.S. Banking System | 0 | 2 |
| Strengthening Financial Security of the U.S. Banking Sector: Regulatory Tools and Practical Risk Mitigation Strategies | U.S. Banking System | 0 | 3 |
| Financial security and stability of the US banking system: comparative analysis and parallels with the Ukrainian experience | U.S. Banking System | 0 | 4 |
| Financial Stability of the Banking System of the European Union: Practical Aspects and Strategic Paradigms | Financial Stability | 0 | 1 |
| Stress Testing of the Banking System of Ukraine: Tools, Scenarios and Results in Wartime Conditions | Financial Stability | 0 | 2 |

### F8 — Admin Authentication

**D1 Schema addition:**
```sql
CREATE TABLE users (
  id            TEXT PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL CHECK(role IN ('admin', 'reviewer')),
  created_at    TEXT NOT NULL
);
```

**`POST /api/auth`** (public):
- Body: `{ email, password }`
- Looks up user by email in D1
- Verifies password against stored PBKDF2 hash using Web Crypto API
- On match: returns `{ token }` (200) — JWT signed with `JWT_SECRET` env var (HMAC-SHA256)
- JWT payload: `{ userId, email, role, exp: now + 7 days }`
- On failure: `{ error: "Invalid credentials" }` (401)
- Missing fields: 400

**Protected endpoint middleware:**
- Extracts `Authorization: Bearer <jwt>` header
- Verifies signature + expiry
- Checks `role === "admin"` for write operations; reviewer JWT → 403

**Login UI (index.html):**
- No visible Login link or button anywhere in the public UI
- **Triple-click on the BAKALO navbar logo** opens the auth modal
- Auth modal styled identically to the article modal (`.modal-overlay` pattern, same CSS)
- Fields: Email input, Password input, "Sign In" button, inline error (no `alert()`)
- On success: JWT stored in `localStorage`, admin controls become visible
- **Logout button appears inside the admin controls area only** (not in nav)
- Logout: clears `localStorage` JWT, hides admin controls
- On page load: expired JWT cleared silently

**Seed:** One admin user seeded via migration (email/password hash set by stakeholder before deploy).

---

## API Contract

```
POST   /api/auth               → 200 { token }                       (public)
GET    /api/articles           → 200 Article[]                       (public)
POST   /api/articles           → 201 Article      Bearer admin JWT
PUT    /api/articles/:id       → 200 Article      Bearer admin JWT
DELETE /api/articles/:id       → 204              Bearer admin JWT
```

**Article shape:**
```json
{
  "id": "string",
  "title": "string",
  "url": "string",
  "category": "U.S. Banking System | Financial Stability | Risk & Regulation | Research & Methodology",
  "description": "string",
  "year": 2024,
  "is_featured": 0,
  "sort_order": 1,
  "created_at": "2026-05-02T00:00:00.000Z"
}
```

---

## Testing Decisions

Good tests verify external behavior through public interfaces — what the API returns, not how it's implemented internally. Tests must survive internal refactors.

**Modules to test:**

### Pages Functions API (Vitest + D1 mock backed by better-sqlite3)
- `GET /api/articles` returns articles sorted by `sort_order`, featured first
- `POST /api/articles` without token → 401
- `POST /api/articles` with valid admin JWT → 201 + article in DB
- `POST /api/articles` with unknown category → 400
- `PUT /api/articles/:id` updates `sort_order` correctly
- `DELETE /api/articles/:id` → 204, article absent from subsequent GET

### Auth API (same framework)
- `POST /api/auth` valid credentials → 200 + JWT
- `POST /api/auth` wrong password → 401
- `POST /api/auth` unknown email → 401
- `POST /api/auth` missing fields → 400
- Protected endpoint with valid admin JWT → succeeds
- Protected endpoint with expired JWT → 401
- Protected endpoint with reviewer JWT → 403

### JWT module (pure unit — no HTTP)
- Valid token round-trips (sign → verify → payload matches)
- Expired token throws on verify

---

## Out of Scope

- Reviews v2 (approval workflow, display, moderation)
- Reviewer role UI
- Password reset / email verification
- Rate limiting on auth endpoint
- Real article URLs (stakeholder to provide pre-launch)
- SEO meta tags
- Article thumbnail images
- Export/import articles JSON
- Dark mode

---

## Pre-launch Checklist (not in this PR)

- [ ] Replace all `url: "#"` placeholders with real SSRN/DOI links
- [ ] Seed admin user with real email + password hash
- [ ] Replace placeholder contact info (`your@email.com`, LinkedIn URL)
- [ ] Add SEO meta tags (`og:`, `description`, `canonical`)
