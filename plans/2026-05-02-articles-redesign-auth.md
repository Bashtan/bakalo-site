# Plan — Articles Redesign + D1 Backend + Admin Auth

> Created: 2026-05-02  
> Branch: `feature/stakeholders-requirements`  
> PRD: `docs/PRD.md` · GitHub: https://github.com/Bashtan/bakalo-site/issues/1

---

## Modules

| # | Module | Files | Tests |
|---|--------|-------|-------|
| 1 | D1 schema + migrations | `schema.sql`, `migrations/0001_init.sql` | — |
| 2 | Seed data | `seed.sql` | — |
| 3 | Wrangler config | `wrangler.toml` | — |
| 4 | JWT lib | `functions/lib/jwt.js` | ✅ unit |
| 5 | Auth API | `functions/api/auth.js` | ✅ integration |
| 6 | Articles API | `functions/api/articles.js`, `functions/api/articles/[id].js` | ✅ integration |
| 7 | Auth middleware | `functions/lib/auth.js` | ✅ unit |
| 8 | Frontend — remove viewer + reviews | `index.html` (surgical delete) | manual |
| 9 | Frontend — category tabs + featured block | `index.html` | manual |
| 10 | Frontend — async article CRUD client | `index.html` | manual |
| 11 | Frontend — login modal (triple-click logo) | `index.html` | manual |
| 12 | Frontend — admin ordering (↑/↓) | `index.html` | manual |
| 13 | Test setup | `package.json`, `vitest.config.js` | — |

---

## Test Behaviors (TDD order — tracer bullet first)

### JWT lib (Module 4) — deepest, most isolated
1. Sign + verify round-trip returns correct payload
2. Expired token throws on verify
3. Tampered signature throws on verify

### Auth API (Module 5)
4. `POST /api/auth` valid credentials → 200 + JWT
5. `POST /api/auth` wrong password → 401
6. `POST /api/auth` unknown email → 401
7. `POST /api/auth` missing fields → 400

### Auth middleware (Module 7)
8. Valid admin JWT → passes, exposes `{ userId, email, role }`
9. Expired JWT → 401
10. Reviewer JWT on admin-only route → 403
11. No Authorization header → 401

### Articles API (Module 6)
12. `GET /api/articles` → array sorted by `sort_order`, featured first
13. `POST /api/articles` no token → 401
14. `POST /api/articles` valid admin JWT → 201 + article persisted
15. `POST /api/articles` unknown category → 400
16. `PUT /api/articles/:id` updates fields → 200
17. `DELETE /api/articles/:id` → 204, absent from subsequent GET

---

## TDD Loop

Each cycle: RED (write one failing test) → GREEN (minimal code to pass) → repeat.

**Do not write all tests first. One test → one implementation.**

### Cycle 0: Test infrastructure
- `package.json` with `vitest`, `better-sqlite3`
- `vitest.config.js`
- D1 mock helper (`test/helpers/d1.js`) — wraps `better-sqlite3` with D1 interface (`.prepare().all()`, `.bind().first()`, `.bind().run()`)

### Cycle 1 (tracer bullet): JWT sign → verify
```
RED:  jwt.test.js — sign({userId:'1',role:'admin'}) → verify → payload.userId === '1'
GREEN: functions/lib/jwt.js — HMAC-SHA256 via Web Crypto
```

### Cycle 2–3: JWT edge cases
- Expired token
- Tampered signature

### Cycle 4–7: Auth API
- Use D1 mock seeded with one user row (PBKDF2 hashed password)
- Each test creates a fresh in-memory DB

### Cycle 8–11: Auth middleware
- Pure function: `verifyRequest(request, env)` → `{ userId, role }` or throws Response

### Cycle 12–17: Articles API
- Each test creates fresh in-memory DB with articles table
- Tests drive the actual Pages Function handler by passing a mock `Request` + mock `env`

---

## Frontend Change Order (after API tests pass)

1. **Delete** iframe viewer HTML/CSS/JS (lowest risk — pure removal)
2. **Delete** reviews HTML/CSS/JS (pure removal)
3. **Update** article modal — replace tag options with 4 categories, add `is_featured` checkbox
4. **Add** `fetchArticles()` async client, wire `renderArticles()` to API
5. **Add** category filter tabs HTML + JS
6. **Add** featured hero block rendering
7. **Add** ↑/↓ ordering buttons + swap logic
8. **Add** login modal HTML (triple-click on logo trigger)
9. **Wire** login modal to `POST /api/auth`, store JWT, toggle admin controls
10. **Add** Logout button inside admin controls area

---

## File Structure (end state)

```
./
├── index.html                        # single-file site (modified)
├── wrangler.toml                     # D1 binding + Pages project config
├── schema.sql                        # DDL reference
├── seed.sql                          # 7 articles + 1 admin user
├── migrations/
│   └── 0001_init.sql                 # applied via wrangler d1 migrations apply
├── functions/
│   ├── api/
│   │   ├── auth.js                   # POST /api/auth
│   │   ├── articles.js               # GET + POST /api/articles
│   │   └── articles/
│   │       └── [id].js               # GET + PUT + DELETE /api/articles/:id
│   └── lib/
│       ├── jwt.js                    # sign / verify (Web Crypto, zero deps)
│       └── auth.js                   # verifyRequest middleware
├── test/
│   ├── helpers/
│   │   └── d1.js                     # better-sqlite3 D1 mock
│   ├── jwt.test.js
│   ├── auth-api.test.js
│   └── articles-api.test.js
├── docs/
│   └── PRD.md
├── plans/
│   └── 2026-05-02-articles-redesign-auth.md   # this file
├── raw/
│   └── ivanbakalo.com.docx           # stakeholder requirements source
└── CLAUDE.md
```

---

## Decisions Log

| Decision | Choice | Reason |
|----------|--------|--------|
| Iframe viewer | Remove entirely | Always fails (X-Frame-Options: DENY) |
| Reviews | Remove entirely | v2 feature, looks empty now |
| Article URLs | Placeholder `#` | Stakeholder to provide pre-launch |
| Admin ordering | ↑/↓ buttons | Simpler than drag-and-drop for rare use |
| Featured | Admin-flagged `is_featured` | Explicit intent, independent of sort order |
| Category filter | Horizontal tabs | Matches editorial aesthetic, works on mobile |
| Auth credentials | D1 `users` table | Future reviewer role |
| Token format | JWT (Web Crypto) | Stateless, zero deps, fast |
| Client storage | localStorage | Stay logged in across sessions |
| Login trigger | Triple-click navbar logo | Hidden from public, no visible admin UI |
| Logout | Admin controls area only | Not in nav |
| Test framework | Vitest + better-sqlite3 mock | No Miniflare complexity, pure JS |
