# RetroCart Generator Service

Internal FastAPI service for catalog generation (scaffold).

## Future responsibilities (PRD §5)

- Scored bin-packing of `RomRelease` rows within storage budget
- Greedy pack after preference scoring
- Reentrant pin flow: reserve pinned ROM sizes, suggest removals, backfill

## Endpoints (scaffold)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Liveness |
| POST | `/internal/generate` | Returns 501 until implemented |

## Run locally

From repo root after `pnpm etl:install`:

```bash
pnpm generator:dev
```
