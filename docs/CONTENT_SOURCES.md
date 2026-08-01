# 📚 Content Sources — Madrasa Connect BD

> A single source of truth for every external Islamic content provider we
> integrate with. Update this file whenever we add / remove / re-license a
> source.

**Last verified:** 2026-08-01

---

## Quran (text + translations + audio)

| Field | Value |
|---|---|
| **Provider** | Al-Quran Cloud |
| **API base** | https://api.alquran.cloud/v1 |
| **Auth** | None (public) |
| **CORS** | Open |
| **Editions used** | `quran-uthmani`, `bn.bengali`, `en.sahih`, `ar.alafasy` (audio) |
| **Rate limit** | Fair-use (undocumented). We cache 30d for immutable rows. |
| **Attribution** | "Data from alquran.cloud" — shown via `<Citation>` component. |
| **Client** | `services/content/quran.ts` |
| **Edge proxy** | `supabase/functions/quran-proxy/index.ts` |

---

## Hadith (Sahih Sittah + more)

| Field | Value |
|---|---|
| **Provider** | Sunnah.com |
| **API base** | https://api.sunnah.com/v1 |
| **Auth** | `X-API-Key` header (free — request at https://sunnah.com/developers) |
| **CORS** | Blocked (must go via edge) |
| **Rate limit** | Fair-use; 100 req/min from single key is safe. |
| **Attribution** | "Data from sunnah.com" — shown via `<Citation>` component. |
| **Client** | `services/content/hadith.ts` |
| **Edge proxy** | `supabase/functions/hadith-proxy/index.ts` |
| **Secret** | `SUNNAH_API_KEY` (via `supabase secrets set`) |

---

## Prayer times + Qibla + Hijri

| Field | Value |
|---|---|
| **Provider** | Aladhan |
| **API base** | https://api.aladhan.com/v1 |
| **Auth** | None (public) |
| **CORS** | Open |
| **Default calc method** | 3 (Muslim World League) — safe for Bangladesh |
| **Rate limit** | Fair-use. Cache 24h for daily timings, 1y for Qibla. |
| **Attribution** | "Data from aladhan.com" — shown via `<Citation>` component. |
| **Clients** | `services/content/prayer.ts`, `services/content/hijri.ts` |
| **Edge proxy** | `supabase/functions/prayer-proxy/index.ts` |

---

## Cache layer

- **Table:** `public.content_cache` (migration `2026_08_03_content_cache.sql`)
- **Read policy:** anon role may `select` non-expired rows only.
- **Write policy:** only service_role (Edge Functions) may write.
- **Housekeeping:** `public.purge_stale_content_cache()` PL/pgSQL func —
  can be scheduled via a nightly cron or run ad-hoc.

---

## Bangladeshi institutional sources (planned — see M14.4)

These are being bootstrapped into the `institutions` table, not queried at
runtime. Each row carries a `source_url` + `source_verified_at`.

| Source | URL | Coverage |
|---|---|---|
| Islamic Foundation Bangladesh | https://www.islamicfoundation.gov.bd | Mosques, imams |
| Bangladesh Madrasah Education Board (BMEB) | http://bmeb.gov.bd | Alia madrasas |
| Wifaq / Befaq | https://wifaqbd.org | Qawmi (largest board) |
| Banbeis | http://data.banbeis.gov.bd | Overall madrasa census |

---

## Deep-knowledge sources (planned — see M14.5)

| Source | URL | Use |
|---|---|---|
| International Open University | https://iou.edu.gm | Free Bengali-subtitled courses |
| Yaqeen Institute | https://yaqeeninstitute.org | Advanced articles (CC-BY-NC) |
| Bayyinah TV | https://bayyinah.tv | Video courses (partner agreement needed) |
| iHadis | https://ihadis.com | Bengali hadith translations |
| Muslim Bangla / Noor | (see partnerships registry) | Cross-linked content |

---

## Licence hygiene

- Every embedded video / PDF / audio ships with its licence field populated
  on the `curriculum_lessons.license` column (e.g. `CC-BY-4.0`, `all-rights-reserved-with-permission`).
- We **never** rehost paywalled or copyright-restricted content — we embed
  or deep-link with attribution.

*Re-verify every source URL quarterly.*
