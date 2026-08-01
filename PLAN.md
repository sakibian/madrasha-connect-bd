# 📐 PLAN.md — Roadmap to a Production-Ready Islamic Content Platform

> **Owner:** Engineering + Founder
> **Status:** Living document — updated whenever we start / finish a milestone.
> **Companion files:** [`TODO.md`](./TODO.md) (execution list), [`PROGRESS.md`](./PROGRESS.md) (chronological log), [`NEXT_STEPS.md`](./NEXT_STEPS.md) (founder-facing).

**Last updated:** 2026-08-01

---

## 🎯 The gap this plan closes

Sessions 1–4 built the *shell* of the platform (auth, i18n, SEO, payments, admin panels, mobile, tests). All 155 unit tests + 7 Playwright e2e specs pass. But the app has **almost no real content** — mock rows for institutions, 2 stub fatwas, hardcoded Seerah, no Quran/Hadith/Prayer integrations, and no dedicated explainer for the Qawmi education system that our target audience actually cares about.

**A production-ready Islamic platform for teachers/scholars/students/general public means:**
1. Real, cited, up-to-date Islamic content on day 1 (Quran, Hadith, Prayer times, Hijri calendar, Seerah).
2. Bangladesh-specific credibility: Qawmi + Alia system explainers, real institution directory bootstrapped from public government sources.
3. Deep-knowledge curriculum tree (Deen-101, Fiqh, Aqeedah, Seerah, Tazkiyah).
4. Every piece of content shows its **source citation** and links back to the authoritative provider.
5. No hard-coded content — everything either fetched from a public API or seeded from a well-known, permissively-licensed dataset.

---

## 🧭 M14 — Real Content Ingestion (new module)

### M14.1 — Public API Integration Layer (~1 week)

**Objective:** Ship a `services/content/*` layer that fetches Quran, Hadith, Prayer times, and Hijri date from free authoritative APIs, caches responses in Supabase, and exposes typed helpers to the UI.

**Sources (all free, no auth):**
- **Al-Quran Cloud** (`https://api.alquran.cloud/v1/`) — Full Quran, multiple translations (including Bengali `bn.bengali`), audio, tafsir.
- **Sunnah.com API** (`https://api.sunnah.com/v1/`) — Sahih Sittah + Muwatta + others; requires free API key.
- **Aladhan** (`https://api.aladhan.com/v1/`) — Prayer times by city / lat-lon / district; Hijri calendar; Qibla direction.
- **Islamic Network CDN** (`https://cdn.islamic.network/`) — Ayah audio, quran images.

**Deliverables:**
- `services/content/quran.ts` — `getSurahList()`, `getAyah(surah, ayah, translation)`, `search(query)`.
- `services/content/hadith.ts` — `getCollections()`, `getBookChapters()`, `getHadith(id)`.
- `services/content/prayer.ts` — `getPrayerTimesByCity(city, country='BD')`, `getPrayerTimesByCoords()`, `getQibla(lat, lon)`.
- `services/content/hijri.ts` — `getHijriToday()`, `gregorianToHijri(date)`, `hijriToGregorian(date)`.
- **Cache table** — `content_cache(key text primary key, value jsonb, fetched_at timestamptz, expires_at timestamptz)`.
- Edge function `content-refresh` — nightly cron that pre-warms popular queries.
- Unit tests for all clients (mock fetch).

**Acceptance:**
- Every helper returns typed objects, handles offline gracefully (returns stale cache).
- No secrets shipped to the client — Sunnah.com API key lives server-side.
- All Bengali translations available for Quran + at least one hadith collection.

---

### M14.2 — Qawmi Education System Explainer Page (~2 days)

**Objective:** Ship `/qawmi-system` — the single highest-credibility page for our target audience. Explains the 6 Qawmi education boards, the marhala (grade) system, Dawra-e-Hadith equivalence, exam schedule.

**Sources (all publicly available):**
- **Befaqul Madarisil Arabia Bangladesh** — https://wifaqbd.org (main Qawmi board, ~19k madrasas).
- **Ittehadul Madaris Bangladesh** — Chittagong-region board.
- **Anjuman-e-Ittehadul Madaris Bangladesh** — Sylhet-based board.
- **Azad Deeni Edaraye Talim Bangladesh** — Dhaka-based independent board.
- **Tanzeemul Madarisid Deeniyah Bangladesh** — Rajshahi board.
- **Jatiya Deeni Madrasa Shikkha Board** — Barishal board.
- **Al-Haiatul Ulya lil-Jamiatil Qawmia Bangladesh** — federation of all 6 boards (est. 2017).
- Government recognition of Dawra-e-Hadith as Master's equivalent (2018).

**Deliverables:**
- `pages/QawmiSystem.tsx` — hero + timeline + boards grid + marhala ladder + Dawra equivalence card + citations.
- `data/qawmiBoards.ts` — typed dataset of the 6 boards + Al-Haiatul Ulya.
- `data/marhalaLadder.ts` — Ibtidaiyyah → Mutawassitah → Sanabiya Amma → Sanabiya Khassa → Fadilah → Dawra-e-Hadith with year counts + subjects.
- Bengali + English + Arabic translations of key labels.
- SEO — Article schema + FAQPage schema, targeted keywords ("কওমি শিক্ষা ব্যবস্থা", "দাওরায়ে হাদিস", "বেফাক").
- Every claim linked to source URL with an accessible `<a target="_blank" rel="noopener">` cite.

**Companion pages (~1 day each, ship after main):**
- `/alia-system` — BMEB Alia system (Ibtidayi → Dakhil → Alim → Fazil → Kamil).
- `/madrasa-glossary` — 60-term Bangla/English/Arabic glossary.

**Acceptance:**
- Every board has: name (bn+en+ar), headquarters, founded year, affiliated madrasa count, official URL, one-line description.
- Marhala ladder rendered as visual timeline (year count + Bengali/English name).
- Page is fully cited (no unattributed claim).

---

### M14.3 — Real Seerah Timeline (~1 week)

**Objective:** Replace the hardcoded `SeerahTimeline.tsx` with a data-driven timeline of the Prophet's ﷺ life — events, dates (Hijri + Gregorian), locations, citations.

**Source:**
- **Ar-Raheeq al-Makhtum** (The Sealed Nectar) by Safi ur-Rahman Mubarakpuri — the standard modern Seerah reference (permissively translated).
- **openseerah.org** and public GitHub datasets for structured JSON.
- Cross-reference with **Ibn Ishaq** and **Ibn Hisham** for authenticity.

**Deliverables:**
- `data/seerah.ts` — typed timeline (~120 events, Birth → Wafat).
- Each event: `{ id, titleBn, titleEn, titleAr, hijriDate, gregorianDate, location, category, description, citations[] }`.
- `pages/SeerahTimeline.tsx` — rewritten to render from data; filter by category (Makkah/Madinah/battles/family/revelation), map view for locations.
- Migration `seerah_events` table for admin overrides + community-flagged corrections.
- SEO — Article + BreadcrumbList + speakable per event.

**Acceptance:**
- Minimum 100 events with citation.
- Bengali translations complete.
- Location map (Leaflet.js — offline tiles) shows Makkah, Madinah, Ta'if, Badr, Uhud, Khaybar, etc.

---

### M14.4 — Real Institutions Directory (~1 week)

**Objective:** Bootstrap `institutions` table with **10,000+ real Bangladeshi madrasas** from public government sources instead of 4 mock rows.

**Sources:**
- **Islamic Foundation Bangladesh** — mosque + imam registry.
- **BMEB** (Bangladesh Madrasah Education Board) — full Alia madrasa list (public CSV/scraper-friendly).
- **Befaq** + 5 other Qawmi boards — affiliated Qawmi madrasa lists.
- **Banbeis** (Bangladesh Bureau of Educational Information & Statistics) — official school/madrasa census.

**Deliverables:**
- `scripts/import-institutions.mjs` — one-shot Node script that:
  - Fetches / parses each source's public data.
  - Normalises to our schema (name bn+en, district, division, type Alia/Qawmi/Mosque, established, verified).
  - Deduplicates via `(name_bn + district)` key.
  - Bulk-inserts into `institutions` with `source_url` + `source_verified_at` fields.
- Migration `2026_08_03_institutions_source_tracking.sql` — add `source_url`, `source_verified_at`, `source_name` columns.
- Admin dashboard tab "Institution Verification" — surface unverified rows with source link for one-click re-verify.
- District/Division dropdown filters on `/institutions` page.

**Acceptance:**
- ≥ 10,000 institutions in production DB.
- Every row has a `source_url` pointing to the authoritative page.
- No duplicate rows (by name+district).

---

### M14.5 — Knowledge Hub / Deen-101 Curriculum Tree (~2 weeks)

**Objective:** Build a structured, sourced curriculum tree that maps the Qawmi + Alia marhala levels to actual content (video, PDF, audio, text).

**Sources:**
- **International Open University (IOU)** — free Bengali-subtitled courses.
- **Bayyinah TV / Yaqeen Institute** — permissively-licensed content for advanced learners.
- **iHadis / Muslim Bangla / Noor** — text content with attribution.
- **Al-Kawthar / Peace TV Bangla** — video khutbah archive.
- Public YouTube channels of known Bangladeshi scholars (with content-partner agreement — see partnerships registry).

**Deliverables:**
- Migration `2026_08_04_curriculum.sql` — `curriculum_levels`, `curriculum_subjects`, `curriculum_lessons`, `lesson_resources` tables.
- Seed data covering:
  - **Ibtidaiyyah**: Arabic alphabet, basic Quran recitation, salah steps, aqeedah basics.
  - **Deen-101 (adult general public)**: Iman & Aqeedah, Salah, Zakat & Fasting, Hajj, Family & Manners, Halal Living.
  - **Advanced**: Fiqh (4 schools), Usul al-Fiqh, Aqeedah (Ash'ari/Maturidi/Athari), Nahwu/Sarf, Balaghah, Hadith Sciences.
- `pages/KnowledgeHub.tsx` — rewritten with breadcrumb navigation of the tree.
- `pages/Deen101.tsx` — 30-day "start here" journey.
- Each lesson: title (bn/en/ar), source URL, source name, license, XP reward.
- Track user progress via existing `user_xp` table.

**Acceptance:**
- ≥ 200 lessons seeded with sources.
- Progress persists across sessions.
- Every lesson shows its source + license.

---

## 🗺️ Cross-cutting concerns for all M14 milestones

1. **Content authenticity gate** — every fetched piece of content must have a `source_url` and `source_verified_at`. Admin panel surfaces stale rows.
2. **Caching layer** — never hit upstream APIs from the browser; always go through Supabase Edge Function + `content_cache` table. Respect upstream rate limits.
3. **Attribution UI** — a reusable `<Citation source="…" url="…" />` component appears next to every fetched fact.
4. **i18n** — every new page ships bn/en/ar keys added to `locales/{bn,en,ar}/common.json` at the same time as the code.
5. **SEO** — every new page ships `<SEO>` + JSON-LD in the same PR.
6. **Tests** — every new service gets unit tests; every new page gets a Playwright smoke.
7. **Rate limits & fair use** — respect upstream ToS; document licences in `docs/CONTENT_SOURCES.md`.

---

## 📅 Sequencing (why in this order)

1. **M14.1 first** — unlocks Quran/Hadith/Prayer times for every downstream page. Highest reuse.
2. **M14.2 next** — Qawmi explainer is a 2-day, high-credibility ship that immediately makes the platform *feel* legitimate to our target audience.
3. **M14.3 in parallel with M14.4** — different owners (content vs data-import); no shared files.
4. **M14.5 last** — depends on M14.1 (embed Quran/Hadith) and M14.2 (align to marhala levels).

**Rough calendar:** all of M14 = ~4–5 weeks of focused work, largely parallelisable.

---

## ✅ Definition of "production-ready" after M14

- Landing page shows today's Hijri date + local prayer times from real APIs.
- `/quran` reads any surah with Bengali translation, live from Al-Quran Cloud.
- `/hadith` browses Sahih Sittah with Bengali translation.
- `/qawmi-system` and `/alia-system` published with citations.
- `/seerah` shows 100+ real events with sources.
- `/institutions` lists 10k+ real Bangladeshi madrasas filterable by district.
- `/knowledge` + `/deen101` have real, sourced curriculum.
- No page in the app displays hardcoded mock content to end users.

---

## 🔗 References baked into this plan

- Al-Quran Cloud API: https://alquran.cloud/api
- Sunnah.com API: https://sunnah.com/developers
- Aladhan Prayer API: https://aladhan.com/prayer-times-api
- Wifaq (Befaq) Bangladesh: https://wifaqbd.org
- Islamic Foundation Bangladesh: https://www.islamicfoundation.gov.bd
- BMEB: http://bmeb.gov.bd
- Banbeis: http://data.banbeis.gov.bd
- IOU: https://iou.edu.gm

*Last verified: 2026-08-01. Re-verify quarterly.*
