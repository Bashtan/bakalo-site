# CLAUDE.md — Ivan Bakalo Portfolio Site

## 1. Project Summary

A single-file static portfolio website (`ivan-bakalo.html`) for **Ivan Bakalo**, an Audit, Risk & Compliance professional. The site serves as a professional business card / NIW (National Interest Waiver) supporting portfolio.

The project is currently a **fully functional single HTML file** with no build step, no dependencies, and no server — everything is self-contained including the logo (embedded as base64). It is ready to deploy by dropping `index.html` onto any static host.

### Sections (in order)
| # | Section | Purpose |
|---|---------|---------|
| 1 | Home | Hero with name, subtitle, intro text |
| 2 | About | Background, IFRS/audit skills list |
| 3 | Articles | Dynamic article manager with iframe viewer + reviews |
| 4 | Projects | 4-column impact areas grid |
| 5 | Endeavor | NIW-formatted proposed endeavor (dark section) |
| 6 | Contact | Email, LinkedIn, location |

---

## 2. Technical Decisions

### Single-file architecture
**Decision:** Everything lives in one `.html` file — CSS, JS, logo, content.  
**Reason:** The client has no hosting infrastructure, no build toolchain, and needs to be able to drop the file onto Netlify Drop / GitHub Pages / Tiiny.host instantly. Zero dependencies, zero build step.

### No framework (vanilla JS + CSS)
**Decision:** Plain HTML/CSS/JS, no React, no Vue, no bundler.  
**Reason:** Single-file constraint makes bundled frameworks impractical. The interactivity needed (modals, iframe viewer, localStorage CRUD) is modest and fully achievable with ~200 lines of vanilla JS.

### Logo embedded as base64
**Decision:** The `BAKALO` logo PNG is inlined as a `data:image/png;base64,...` string directly in the `src` attribute of two `<img>` tags (nav bar + home hero).  
**Reason:** Keeps the project truly single-file — no external asset paths to manage or break on different hosting environments.

### localStorage for articles & reviews
**Decision:** Articles and reviews are persisted in `localStorage` under keys `ib_articles_v2` and `ib_reviews_v2`.  
**Reason:** No backend exists. localStorage is sufficient for a portfolio site where the author manages content from their own browser. Data survives page refreshes and browser restarts.  
**Limitation:** Data is browser-local and not shared across devices or visitors. Reviews written by visitors on the live site are not visible to the author unless they use the same browser.

### iframe article viewer with fallback
**Decision:** Articles open in a fullscreen overlay with an `<iframe>` on the left and a reviews panel on the right. If the iframe is blocked by cross-origin headers (common on SSRN, Google Scholar), a fallback UI appears with an "Open in New Tab" button.  
**Reason:** Best-effort embedded reading experience. SSRN and most academic platforms send `X-Frame-Options: DENY`, so the fallback is expected and intentional — not a bug.

### Typography: Cormorant Garamond + DM Mono
**Decision:** Body/headings use `Cormorant Garamond` (Google Fonts); labels, metadata, and UI chrome use `DM Mono`.  
**Reason:** Establishes a premium editorial aesthetic appropriate for a senior professional portfolio. The serif/mono pairing creates clear visual hierarchy without needing heading size variation alone.

### Color palette
```
--ink:        #0e0e0e   (primary dark, hero backgrounds)
--paper:      #f5f2ec   (warm off-white, main background)
--cream:      #ede8df   (slightly darker warm, alternate sections)
--gold:       #b8935a   (primary accent — labels, arrows, borders)
--gold-light: #d4aa72   (lighter gold for dark backgrounds)
--muted:      #7a7468   (secondary text, nav links)
--rule:       #c8c0b0   (dividers, card borders)
```

### Admin mode toggle
**Decision:** Admin features (add/edit/delete articles, delete reviews) are hidden behind an on-page toggle switch labeled "Admin mode". No password.  
**Reason:** The site is a static public file — there is no auth layer. The toggle is a UX convenience to keep the interface clean for visitors, not a security mechanism. If real auth is needed, a backend is required.

---

## 3. Pending Tasks & Known Issues

### High priority
- [ ] **Persistent article data across devices** — currently localStorage only. Consider migrating to a lightweight backend (Supabase free tier, Firebase, or a simple JSON file on the server) so articles added on one device appear everywhere.
- [ ] **Admin password protection** — the admin toggle currently has no authentication. A simple password prompt (`localStorage`-stored hash) would be a meaningful improvement before sharing the URL publicly.
- [ ] **Replace placeholder contact info** — `your@email.com` and `linkedin.com/in/ivan-bakalo` are still placeholder values. Must be updated before publishing.
- [ ] **Add real SSRN / Google Scholar links** — the Publications cards in the Articles section have `href="#"` placeholder links.

### Medium priority
- [ ] **Mobile reviews panel** — on screens <768px the viewer splits vertically (iframe top, reviews bottom). The iframe gets ~50vh which is cramped for reading. Consider a tab switcher (Read / Reviews) on mobile instead of the vertical split.
- [ ] **Article card image/thumbnail** — cards are text-only. Adding an optional thumbnail URL field to the article form would improve scannability.
- [ ] **Export/import articles** — a JSON export/import button would let the author back up articles and transfer them to a new device or a backend.
- [ ] **SEO meta tags** — `<meta name="description">`, Open Graph tags, and `<link rel="canonical">` are missing. Needed before publishing for professional visibility.

### Low priority / Nice to have
- [ ] **Dark mode toggle** — the dark hero and endeavor sections are already dark; a site-wide dark mode would be a small CSS variable swap.
- [ ] **Article sort order** — currently newest-first (insertion order). A sort dropdown (newest / oldest / alphabetical) would be useful once there are 10+ articles.
- [ ] **Review moderation** — currently any visitor can post a review. A simple "pending approval" flag (admin approves before display) would be cleaner for public use.
- [ ] **Animations on article cards** — cards render statically after filtering. A subtle fade-in on render would match the scroll-animation aesthetic of the rest of the site.

### Known bugs
- [ ] **iframe load detection is imperfect** — the fallback triggers after a 5-second timeout by catching cross-origin errors. On slow connections a valid iframe may falsely show the fallback. A more robust approach would check `Content-Security-Policy` headers server-side before attempting the embed.
- [ ] **Star hover state** — the star buttons use both a CSS `.lit` class and inline `style.color` overrides for hover. This dual approach can leave stars in a visually incorrect state if the mouse exits rapidly. Should be unified to CSS-only using `:hover` sibling selectors.

---

## 4. Build & Run Commands

This is a **zero-build project**. There is no `package.json`, no compiler, no bundler.

### Run locally
```bash
# Option 1 — Python (available on any macOS/Linux)
python3 -m http.server 8080
# then open http://localhost:8080/ivan-bakalo.html

# Option 2 — Node (if installed)
npx serve .
# then open http://localhost:3000/ivan-bakalo.html

# Option 3 — just open the file directly
open ivan-bakalo.html        # macOS
start ivan-bakalo.html       # Windows
xdg-open ivan-bakalo.html    # Linux
```

> Note: Opening directly as `file://` works for all features except the iframe viewer, which may behave differently due to browser same-origin restrictions on `file://` URLs. Use a local server for accurate testing.

### Deploy (static hosting)
```bash
# Netlify Drop — no CLI needed
# 1. Rename: cp ivan-bakalo.html index.html
# 2. Drag index.html onto https://app.netlify.com/drop

# Netlify CLI
npm install -g netlify-cli
cp ivan-bakalo.html index.html
netlify deploy --prod --dir .

# GitHub Pages
# 1. Create repo at github.com
# 2. cp ivan-bakalo.html index.html
# 3. git init && git add index.html && git commit -m "init"
# 4. git remote add origin https://github.com/USERNAME/REPO.git
# 5. git push -u origin main
# 6. Enable Pages in repo Settings → Pages → Deploy from branch: main
```

### Regenerate logo embed (if logo PNG changes)
```bash
python3 -c "
import base64, re
with open('logo.png','rb') as f:
    b64 = base64.b64encode(f.read()).decode()
data_uri = f'data:image/png;base64,{b64}'
with open('ivan-bakalo.html','r') as f:
    html = f.read()
# Replace existing base64 logo (both occurrences)
html = re.sub(r'data:image/png;base64,[A-Za-z0-9+/=]+', data_uri, html)
with open('ivan-bakalo.html','w') as f:
    f.write(html)
print('Logo updated.')
"
```

---

## 5. File Structure

```
./
├── ivan-bakalo.html      # ← entire site (single file, ~113KB with logo)
├── deploy-guide.html     # deployment instructions (Ukrainian)
└── CLAUDE.md             # this file
```

---

## 6. If Moving to a Multi-file Project

If Claude Code refactors this into a proper project structure, the recommended split is:

```
./
├── index.html
├── assets/
│   └── logo.png          # extract from base64
├── css/
│   └── style.css         # extract <style> block
├── js/
│   ├── articles.js       # CRUD + localStorage layer
│   ├── viewer.js         # iframe viewer logic
│   ├── reviews.js        # reviews logic
│   └── main.js           # nav, animations, init
└── CLAUDE.md
```

A Vite or Parcel setup would then bundle these back into a single optimized file for deployment.

