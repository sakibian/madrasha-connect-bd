/**
 * BMEB (Bangladesh Madrasah Education Board) Alia madrasa source adapter.
 *
 * ⚠️  This is a SCAFFOLD. Real implementation must:
 *   1. Respect BMEB's rate limits (1 req/sec).
 *   2. Paginate through their institution search endpoint.
 *   3. Normalise to the shared row shape:
 *        {
 *          name_bn, name_en, type: 'ALIA',
 *          district, division, established_year,
 *          verified: false,
 *          source_name: 'BMEB',
 *          source_url: 'http://bmeb.gov.bd/institution/<id>',
 *          source_verified_at: new Date().toISOString(),
 *        }
 *
 * Until a real scraper is wired, `fetchAll()` returns an empty array so
 * the orchestrator can still exercise the dedup + write path in dry-run.
 */

export async function fetchAll() {
  // TODO: implement real BMEB fetch. See sibling ifb.mjs / befaq.mjs.
  return [];
}
