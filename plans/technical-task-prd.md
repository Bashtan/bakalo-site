# PRD: Professional NIW-Oriented Expert Platform Rebuild
**Branch:** feature/technical-task  
**Date:** 2026-05-08

---

## Goal
Transform ivanbakalo.com from a "personal professional portfolio" into a **Professional NIW-Oriented Expert Platform** positioning Ivan Bakalo as a Financial Stability / Governance / Systemic Risk expert. Site must read to a USCIS officer as: governance & systemic risk expert, not a certificate gallery or academic hobby page.

---

## Design System Change

| Token | Old (warm editorial) | New (institutional) |
|---|---|---|
| Primary bg | `#f5f2ec` paper | `#ffffff` white |
| Alt bg | `#ede8df` cream | `#f8f9fb` light |
| Dark | `#0e0e0e` ink | `#0a1628` navy |
| Dark-2 | — | `#1e2d4a` navy-light |
| Accent | `#b8935a` gold | `#1d4ed8` blue |
| Muted | `#7a7468` | `#64748b` slate |
| Border | `#c8c0b0` | `#e2e8f0` |

Typography: keep Cormorant Garamond for display headings; replace DM Mono UI chrome with **IBM Plex Sans** (clean institutional).

---

## Navigation (8 items)

```
Home | About | Research | Implementation & Recognition |
Professional Engagement | Proposed Endeavor | Research Profiles | Contact
```

Removed: Articles, Projects

---

## Page-by-Page Spec

### 1. Home — Full Rebuild
- **Remove:** "Professional Portfolio" subtitle, compliance-generic copy
- **Title:** Ivan Bakalo
- **Positioning line:** Financial Stability · Governance · Systemic Risk
- **Subtitle:** Risk-Based Governance, Financial Stability, and Institutional Resilience
- **Body:** My work focuses on strengthening financial stability, governance, and institutional resilience through risk-based methodologies, regulatory compliance frameworks, and systemic risk analysis. My proposed endeavor supports the long-term stability and integrity of the United States financial system — an area of substantial merit and national importance.
- **CTAs:** View Research | Implementation & Recognition | Research Profiles

### 2. About — Rebuild
- Replace current IFRS/audit skills list with systemic risk / governance focus
- Add **Professional Experience block:**  
  Senior Accountant, Fiscal Audit — CAMBA, Inc. · Brooklyn, New York  
  – audit and compliance analysis · financial reporting review · internal control evaluation · regulatory compliance assessment · risk-based audit procedures

### 3. Research (was Articles) — Rebuild
- Remove: reviews, "0 reviews", reader reviews block
- Rename section label to "Research"
- **Featured Research block** (dark navy card, full-width, top): one featured article flagged via `is_featured=1`
- **Category tabs:** U.S. Banking System | Financial Stability | Risk & Regulation | Research & Methodology
- **Article card fields:**  
  - Title  
  - Short executive summary (description, ≤3–5 lines)  
  - Impact Tags (chips from `tags` column)  
  - Buttons: SSRN (links to `ssrn_url`) | DOI (links to `doi_url`) | View Publication (links to `url`)  
  - Only show a button if the URL field is non-empty
- Rename "Read" button → "View Article" (view publication button)
- Button style: outline institutional (not rounded, not heavy)

### 4. Implementation & Recognition — New Section
- **Purpose:** show implementation evidence, institutional engagement, practical impact
- **Data source:** `evidence` table (new)
- **Card format:**  
  Title | Short description | Institution · Year | [View Evidence] button (links to `evidence_url`)
- **Admin:** add/edit/delete evidence items
- **Include strong evidence only** (Erasmus+, Silesian U, Ostroh Academy, Category B journal, acts of implementation, Clarivate reviewer, letters of appreciation)
- **NOT a gallery** — text-based list format

### 5. Professional Engagement — New Section
- **Purpose:** ongoing professional engagement, governance, AI risk, webinars
- **Data source:** `engagements` table (new)
- **Card format:**  
  Title | Short summary | Organization · Year | [View Evidence] button
- **Admin:** add/edit/delete engagement items
- **Include:** Gartner webinar, IIA webinars, AI governance, IMF/Deloitte/Banque de France/Joint Vienna Institute training

### 6. Professional Memberships — Small block (within About or standalone)
- All-Ukrainian Association of International Economics
- Ukrainian Association of Teachers and Researchers of European Integration
- **Small list, no separate page**

### 7. Proposed Endeavor — Rebuild
- Format as NIW petition summary (not a generic description)
- Positioning: U.S. financial system, institutional resilience, governance, regulatory compliance, systemic stability, national importance
- Keep dark section treatment

### 8. Research Profiles — New Section
- SSRN | Google Scholar | ORCID | ResearchGate | LinkedIn
- Icon + platform name + short description + external link button
- Visually unified (same card style)

### 9. Contact — Simplify
- Keep: professional email, LinkedIn, location
- Remove: forms, generic placeholders

---

## Database Changes

### Migration 0002: articles table additions
```sql
ALTER TABLE articles ADD COLUMN ssrn_url TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN doi_url  TEXT NOT NULL DEFAULT '';
ALTER TABLE articles ADD COLUMN tags     TEXT NOT NULL DEFAULT '';
```

### Migration 0002 (continued): new tables
```sql
CREATE TABLE IF NOT EXISTS evidence (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  institution  TEXT NOT NULL DEFAULT '',
  year         INTEGER,
  evidence_url TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS engagements (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL DEFAULT '',
  organization TEXT NOT NULL DEFAULT '',
  year         INTEGER,
  evidence_url TEXT NOT NULL DEFAULT '',
  sort_order   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL
);
```

---

## New API Endpoints

### `/api/evidence`
- `GET` — list all evidence (public), ordered by sort_order ASC
- `POST` — create (admin only)
- `PUT /api/evidence/:id` — update (admin only)
- `DELETE /api/evidence/:id` — delete (admin only)

### `/api/engagements`
- `GET` — list all engagements (public), ordered by sort_order ASC
- `POST` — create (admin only)
- `PUT /api/engagements/:id` — update (admin only)
- `DELETE /api/engagements/:id` — delete (admin only)

### Updated `/api/articles`
- Accept/return new fields: `ssrn_url`, `doi_url`, `tags`

---

## Admin Panel Changes
- Articles form: add SSRN URL, DOI URL, Tags fields
- New "Evidence" tab: add/edit/delete Implementation & Recognition items
- New "Engagements" tab: add/edit/delete Professional Engagement items
- Admin access: existing triple-click logo → JWT login flow (unchanged)

---

## SEO
- Add `<meta name="description">` focused on financial stability / NIW positioning
- Add Open Graph tags (og:title, og:description, og:type=website)
- Add canonical link

---

## Out of Scope (This PR)
- PDF/image upload (requires object storage — Phase 2)
- Mobile tab switcher for Research viewer (Phase 2)
- Dark mode toggle
- Review moderation flow
