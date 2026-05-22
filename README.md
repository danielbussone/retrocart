# RetroCart

Personal retro game collection curator (scaffold). Stack: **pnpm monorepo**, **Expo** (iOS · Android · Web), **GraphQL API** (Yoga + Pothos), **PostgreSQL** (Flyway), **Python** generator + ETL stubs.

**Scaffold boundary:** schema + dev health/`me` query only. No catalog generator, No-Intro ETL, or auth provider yet.

## Prerequisites

- Node 20+
- pnpm 9+
- Docker Desktop (for Postgres + Flyway)
- Python 3.11+ (optional, for generator/ETL stubs)

## Ports

| Service    | Host port |
|------------|-----------|
| Postgres   | 5434      |
| GraphQL API| 4000      |
| Generator  | 8001      |
| Expo       | 8081 (default) |

## Quick start

```bash
cp .env.example .env
docker compose up -d db
pnpm db:migrate
pnpm install
pnpm dev
```

- GraphQL: http://localhost:4000/graphql
- Expo: follow terminal QR / press `w` for web

### Dev user (auth deferred)

In development, the API resolves `me` from `DEV_USER_ID` in `.env` or the `X-Dev-User-Id` header. This is **not** production auth — see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

### Optional: Python services

```bash
pnpm etl:install
pnpm generator:dev
curl http://localhost:8001/health
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | API + Expo |
| `pnpm db:migrate` | Flyway migrations |
| `pnpm db:repair` | Flyway repair |
| `pnpm generator:dev` | FastAPI generator stub |
| `pnpm etl:install` | Python venv + editable etl/generator |

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Open questions](docs/OPEN_QUESTIONS.md)
