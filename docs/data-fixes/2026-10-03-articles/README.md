# Articles data cleanup — 2026-10-03

One-off production D1 data fix for the Research section (`articles` table). **Not a migration** — do not move into `migrations/`.

| File | Status | What it does |
|------|--------|--------------|
| `00_rollback.sql` | ready | Restores the exact 15-row snapshot taken before the cleanup (idempotent). |
| `01_tier1_apply.sql` | **APPLIED 2026-10-03** | Deletes 3 hidden duplicate rows, one featured paper, blanks 6 dead `#` links, fixes 2 description defects, sets `sort_order`. Idempotent. |
| `02_tier2_apply.sql` | not applied | Impact-area tags, featured description (from SSRN abstract), trims 2 long descriptions. Needs client OK on wording. |
| `03_tier3_apply.sql` | not applied | DOI links in `https://doi.org/…` form. |

Run: `npx wrangler d1 execute bakalo-db --remote --file=docs/data-fixes/2026-10-03-articles/<file>.sql --yes`

Tier 2/3 assume the Tier 1 state. Staging and production share this database, so changes are live immediately.
