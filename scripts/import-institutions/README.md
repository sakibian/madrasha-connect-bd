# 🏫 Institution Bootstrap Importer

One-shot Node script that populates the `institutions` table from **public
authoritative sources**. Every row lands with `source_name`, `source_url`,
and `source_verified_at` populated so an admin can one-click re-verify.

## Sources

| Source | Coverage | Fetch strategy |
|---|---|---|
| **BMEB** (`bmeb.gov.bd`) | Alia madrasas | HTML scrape → normalise |
| **Wifaq/Befaq** (`wifaqbd.org`) | Qawmi (~19k madrasas) | Public annual listing PDF → parse |
| **IFB** (`islamicfoundation.gov.bd`) | Mosques + imams | HTML listing → normalise |
| **Banbeis** (`data.banbeis.gov.bd`) | Overall madrasa census | CSV download |

## Usage

```bash
# Dry run (writes to ./_import_output.json, DOES NOT touch DB):
node scripts/import-institutions/index.mjs --dry-run

# Import a single source, writing to DB (requires SUPABASE_SERVICE_ROLE_KEY):
node scripts/import-institutions/index.mjs --source=bmeb

# Import all sources:
node scripts/import-institutions/index.mjs --source=all
```

## Deduplication

Rows are keyed by `normalise(name_bn) + '|' + district`. When a duplicate is
detected the row with the **more authoritative source** wins (BMEB > Wifaq > IFB > community).

## Rate-limit hygiene

- 1 request/sec ceiling per source.
- Automatic exponential backoff on 429 / 5xx.
- Never scrape from CI — this is a manual, human-supervised job.

## Legal

- All sources listed above publish their data in the public interest.
- We store only the fields necessary to help end users find institutions.
- On removal request from an institution owner, we honour delete within 24 h.

## Files

- `index.mjs` — CLI orchestrator (`--dry-run`, `--source=…`).
- `sources/bmeb.mjs` — BMEB Alia madrasa scraper.
- `sources/befaq.mjs` — Wifaq/Befaq Qawmi list scraper.
- `sources/ifb.mjs` — IFB mosque list scraper.
- `sources/banbeis.mjs` — Banbeis CSV importer.
- `normalise.mjs` — shared normalisation helpers.
