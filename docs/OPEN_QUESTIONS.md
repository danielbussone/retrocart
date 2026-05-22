# Open Questions

Tracked from the RetroCart PRD §9. Resolve before or during relevant milestones.

| # | Question | Impact |
|---|----------|--------|
| 1 | **Genre data source** — No-Intro has no genre. IGDB/GiantBomb API, manual curation, or LLM tagging? | Blocks complete ETL |
| 2 | **CatalogGenre.weight** — explicit sliders at creation vs inferred from `user_signal` history? | Onboarding UX |
| 3 | **Region preference** — default to user locale vs all regions in scoring? | RomRelease scoring |
| 4 | **Auth provider** — Clerk vs Supabase Auth (and hosted DB)? | Infrastructure |
| 5 | **File size disclaimer** — No-Intro sizes are pre-compression; show caveat in UI? | User trust |

## Scaffold decisions (resolved for now)

- **Auth:** deferred; dev seed user only
- **Scope:** schema + health/`me` query; no generator or ETL logic
