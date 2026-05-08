---
# Color Palette Change — Investigation Report

**Branch investigated:** `chore/visual-regression-analysis`  
**Commit that introduced the change:** `65430ef` — `feat: NIW platform rebuild — new design, evidence/engagements APIs, TDD`  
**Compared against:** `16adf0d` — `feat: articles redesign, D1 backend, JWT auth (stakeholder requirements)`

## Verdict: Intentional — instructed by client brief

The color palette change was not a regression or accident. It was explicitly mandated by the client document `raw/ivanbakalo.com.docx` under the section **"1. GLOBAL DESIGN / UI"**:

> **СТИЛЬ — Використовувати (USE):**
> - clean institutional design
> - executive style
> - мінімалізм
> - **dark blue / white / gray palette**
> - professional typography
> - strong section hierarchy

> **НЕ ВИКОРИСТОВУВАТИ (DO NOT USE):**
> - яскраві gradients
> - excessive animations
> - gallery of certificates
> - visual clutter
> - student/research hobby style

## Token-by-Token Comparison

| Token | Old (warm editorial) | Old hex | New (institutional) | New hex |
|---|---|---|---|---|
| Background | `--paper` | `#f5f2ec` | `--light` | `#f8f9fb` |
| Alt background | `--cream` | `#ede8df` | `--white` | `#ffffff` |
| Primary dark | `--ink` | `#0e0e0e` | `--navy` | `#0a1628` |
| Dark-2 | — | — | `--navy-mid` | `#1e3a5f` |
| Primary accent | `--gold` | `#b8935a` | `--accent` | `#1d4ed8` |
| Accent light | `--gold-light` | `#d4aa72` | `--accent-lt` | `#3b82f6` |
| Muted text | `--muted` | `#7a7468` | `--slate` | `#64748b` |
| Borders | `--rule` | `#c8c0b0` | `--border` | `#e2e8f0` |
| Error/danger | `--red` | `#8b2020` | `--red` | `#dc2626` |

## Rationale

The PRD (`plans/technical-task-prd.md`, commit `65430ef`) documents the design intent:

> Transform ivanbakalo.com from a "personal professional portfolio" into a **Professional NIW-Oriented Expert Platform** positioning Ivan Bakalo as a Financial Stability / Governance / Systemic Risk expert. Site must read to a USCIS officer as: governance & systemic risk expert, not a certificate gallery or academic hobby page.

The warm gold/paper editorial palette was appropriate for a personal portfolio but inconsistent with institutional credibility required for a NIW petition. The navy/blue/white palette aligns with the visual language of financial regulators, law firms, and government agencies.

## CSS Variable Renaming

All variable names were also renamed (not just the values), breaking backward compatibility with any CSS that referenced the old names. This was intentional — the old names (`--ink`, `--paper`, `--cream`, `--gold`) encoded the wrong semantic meaning for the new design direction.
