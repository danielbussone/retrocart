# RetroCart ETL

Batch pipeline to ingest No-Intro dat files into the master catalog (scaffold).

## Planned ingestion steps (PRD §7)

1. Download or receive updated No-Intro dat file for a console
2. Parse XML: title, region, ROM name, file size, CRC/SHA1 hash
3. Normalize title → `game` record (dedupe cross-platform where possible)
4. Upsert `rom_release` keyed on `rom_hash` (idempotent)
5. Apply `console_tag` from maintained mapping
6. Log run counts and parse errors

## Genre data (open question)

No-Intro dat files do not include genre. See [docs/OPEN_QUESTIONS.md](../../docs/OPEN_QUESTIONS.md).

## Run locally

```bash
pnpm etl:install
.venv-etl/bin/retrocart-etl --help
```
