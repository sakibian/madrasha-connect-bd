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

---

## 📱 M15 — Mobile-First Overhaul (**new — critical**)

**Objective:** 95% of our target users access the platform from a phone. The current UI works on mobile but is **not truly mobile-first** — the sidebar-driven navigation, `p-8` mobile padding, `px-10` header, and 14 px body text create a desktop-feeling experience that hurts trust and conversion. M15 restructures the entire mobile experience.

### M15.1 — Layout & spacing (~1 h)

- Reduce mobile page padding: `App.tsx` `p-8 md:p-12` → `px-4 py-6 md:p-12`.
- `Header.tsx` `px-10` → `px-4 md:px-10`; hide the search input on `< md` (accessible via bottom-nav Search tab).
- Ensure the sidebar occupies zero horizontal space on mobile when closed (fixed drawer, not flex column).
- Every interactive element ≥ 44 × 44 px (iOS HIG). Add utility class `.tap-target` where needed.

### M15.2 — Bottom tab navigation (~2 h)

- New `components/ui/BottomNav.tsx` — 5 tabs: **Home · Explore · Ask · Learn · Profile**.
- Visible only `< md`. Sticky bottom with `env(safe-area-inset-bottom)` support.
- Active-tab highlight; ARIA-current on the active link; keyboard focusable.
- Hamburger stays as "More" drawer for less-frequent items (Marketplace, Sadaqah, Tools, Admin…).
- FeedbackWidget must sit above the bottom nav on mobile (bottom offset).

### M15.3 — Typography & readability (~30 min)

- Base font on mobile: `text-base` (16 px) — matches iOS zoom-avoidance threshold + improves Bengali script legibility.
- Bengali text (`lang="bn"`): bump `line-height` to `leading-loose`.
- Card body copy: `text-sm` → `text-base` on mobile, tighten to `text-sm` at `md:` and up.

### M15.4 — Touch-friendly interactions (~1 h)

- Modals: full-screen on mobile (`sm:rounded-none sm:max-h-screen`) instead of centered card.
- Form inputs: `py-3` + `text-base` so iOS Safari does not auto-zoom on focus.
- FeedbackWidget: bottom offset above the bottom nav (`bottom-24 md:bottom-6`).
- Sidebar drawer: swipe-to-close gesture (optional stretch).

### M15.5 — Mobile test coverage (~1 h)

- New Playwright config: viewport 375 × 667 (iPhone SE) + 390 × 844 (iPhone 12).
- Spec `e2e/mobile-nav.spec.ts` — bottom nav renders on mobile, each tab routes correctly, hamburger opens sidebar drawer, FeedbackWidget is not covered.
- Unit test `components/ui/__tests__/BottomNav.test.tsx` — 5 tabs render, active state, aria-current.

**Definition of done for M15:**
- Lighthouse mobile score ≥ 90 for Performance + Accessibility on the Home page.
- No horizontal scroll at any viewport ≥ 320 px.
- Every primary user flow (login, ask fatwa, browse jobs, donate) completes without opening the sidebar drawer.

---

---

## 🎨 M16 — Unified Color System (**new**)

**Objective:** Every accent on every page must trace back to a single tokenised palette. Today `bd-green`, `brand-*`, raw `red-*`, and raw `amber-*` are used inconsistently, causing subtle mismatches between dashboards and landing pages.

**Deliverables:**
- `tailwind.config.js`: extend the palette with **semantic scopes** on top of the existing `brand-*` scale:
  - `danger-*` (destructive actions, error states) — anchored on a single red.
  - `warning-*` (moderation, pending, drafts) — anchored on a single amber.
  - `info-*` (neutral status pills) — anchored on a single slate.
- Replace raw `red-50/500/600/700` and `amber-50/500` in `pages/**/*Dashboard*.tsx` and `components/**/*.tsx` with the new semantic tokens.
- Introduce a `<StatusBadge status="pending|approved|rejected|banned" />` helper so every dashboard uses the same colour and copy for the same state.

**Definition of done:**
- `grep -rE "bg-(red|amber)-[0-9]" pages/ components/` returns **0** hits.
- Only the tokenised palette appears in any file except `tailwind.config.js` / `src/index.css`.

---

## 📲 M17 — PWA Installable + Web Push (**new — critical for 95% mobile users**)

**Objective:** Make the app installable to the home screen, work offline for cached routes, and deliver push notifications so users don't need the store app (yet). The native Expo app remains in mobile/ and will ship later as adoption grows.

### M17.1 — Manifest + icons (~30 min)

- `public/manifest.webmanifest` — full W3C manifest: name (bn + short), theme colour `#006a4e`, background `#ffffff`, `display: standalone`, `start_url: /`, `id: /`, `orientation: portrait`, `icons` for 192 + 512 + maskable.
- Generate raster icons (PNG 192 + 512 + maskable 512) from the existing SVG — placed under `public/icons/`.
- Link the manifest + `apple-touch-icon` + `theme-color` from `index.html`.

### M17.2 — Service worker (~1 h)

- Add `vite-plugin-pwa` with **workbox**.
- Strategy: `NetworkFirst` for HTML/JS, `CacheFirst` (with 30 day expiry) for images/fonts, `StaleWhileRevalidate` for Supabase REST + Islamic content APIs.
- Precache the app shell + top 10 routes.
- Emit a **"new version available — refresh"** toast when the SW detects an update.

### M17.3 — Web Push notifications (~2 h)

- New client helper `services/webPush.ts` — subscribes the browser to `PushManager`, sends `endpoint + keys` to a new Supabase table `push_subscriptions`.
- Migration `2026_08_07_push_subscriptions.sql` — table + RLS (user reads own, service_role writes).
- New Edge Function `supabase/functions/push-send/index.ts` — takes `{ userId, title, body, url }` and fans out to all `push_subscriptions` rows with `web-push` library (VAPID).
- Add `VAPID_PUBLIC_KEY` + `VAPID_PRIVATE_KEY` to Supabase secrets.
- Trigger a push when a fatwa is answered / a job is posted for a saved query (both wired in existing services).

### M17.4 — Install prompt (~1 h)

- `components/PWAInstallPrompt.tsx` — listens to `beforeinstallprompt`, renders a subtle bottom-sheet CTA (Bengali-first) after the user has visited ≥ 3 routes. iOS Safari cannot programmatically install → show the "Add to Home Screen" hint with visual instructions.
- One-tap dismiss + 30-day suppression via `localStorage`.

### M17.5 — Test coverage (~1 h)

- Vitest unit test that parses `public/manifest.webmanifest` and asserts required fields (name, icons ≥ 2, start_url, theme_color, display).
- Vitest unit test for `PWAInstallPrompt` showing/hiding logic.
- Playwright: `e2e/pwa.spec.ts` — asserts manifest link, service worker registration, offline page fallback.

**Definition of done for M17:**
- Lighthouse **PWA** score ≥ 90.
- iOS Safari user can Add to Home Screen and launch as standalone.
- Chrome/Edge shows the browser install prompt.
- A test push notification arrives on a subscribed device.

---

---

## 🔔 M18 — Delightful Notification UX (**new**)

**Objective:** Give users three distinct, beautiful notification surfaces (transient toasts, an in-app notification centre, and a graceful web-push permission flow) that all feel like part of the same brand system.

### M18.1 — Sonner toasts (~30 min)

- Add **[Sonner](https://sonner.emilkowal.ski/)** — the de-facto React toast lib (used by Vercel, Cal.com, shadcn/ui).
- Mount `<Toaster />` in `App.tsx` with brand-aligned defaults (top-right on desktop, top-centre on mobile, `bd-green` accent, respects RTL).
- Add a small typed wrapper `services/toast.ts` — `toast.success(msg)`, `toast.error(err)`, `toast.info(msg)`, `toast.promise(p, {loading, success, error})` — so we never import Sonner directly from feature code (makes future replacement trivial).
- Replace `alert()` and inline banners across `services/authService.ts`, `donationService.ts`, `feedbackService.ts` with typed toasts.

### M18.2 — In-app notification centre (~1 h)

- New `components/NotificationBell.tsx` — replaces the plain `Bell` icon in `Header.tsx`.
- Radix Popover with:
  - Unread count badge (already tracked in `useNotificationStore`).
  - Scrollable list of past notifications, grouped by day.
  - "Mark all read" action.
  - Empty state with helpful copy.
  - Click a row → deep-link to `n.link` route and mark read.
- Uses `bd-green` + `info-*` + `warning-*` tokens (no raw colours).
- Bengali-first, English + Arabic keys added.

### M18.3 — Permission-priming card (~30 min)

- New `components/NotificationPermissionPrimer.tsx` — shows a small in-app card BEFORE we call the browser's native `Notification.requestPermission()`.
- Triggers on a specific user action (e.g. sending a fatwa) so the ask has clear context.
- Two buttons: "হ্যাঁ, জানাতে চাই" (calls `subscribeToPush`) and "পরে" (dismiss + 7-day suppression).
- Handles `Notification.permission === 'denied'` gracefully with a settings-link explainer.

### M18.4 — Deep-link routing (~15 min)

- Both in-app rows and web-push notification-click events route via a single `handleNotificationClick(url)` helper so we don't duplicate logic.
- Push service worker (`public/sw.js`) already forwards click → URL; we only need the client-side helper.

### M18.5 — Tests (~30 min)

- `services/__tests__/toast.test.ts` — typed helper wraps Sonner correctly.
- `components/__tests__/NotificationBell.test.tsx` — badge count, popover open/close, mark-read action.
- `components/__tests__/NotificationPermissionPrimer.test.tsx` — show / dismiss / suppression logic.

**Definition of done for M18:**
- Zero `alert()` calls remain in `services/`.
- Header bell shows live unread count + opens a Radix popover with brand-styled rows.
- No native browser permission dialog fires until the user first accepts our priming card.

---

---

## 🧪 M19 — Manual Browser Test Guide (Role-Based) (**new**)

**Objective:** Give the founder, the ops person, and every new contributor a single **checkable** document to smoke-test the entire app in a real browser before every release, organised by the five user roles the platform supports.

**Deliverables:**
- `docs/MANUAL_TESTING.md` — the master playbook. Each role has:
  1. A **setup block** (test account credentials + URL + browser + viewport).
  2. A **numbered list of steps** with expected result per step.
  3. A **pass / fail** checkbox next to every step so the tester can copy the section into a GitHub issue for triage.
- `docs/QA_CHECKLIST.md` — a shorter one-page pre-release smoke test built on top of the master playbook (30 min end-to-end).
- Roles covered:
  - **Guest / Anonymous** (landing, register, ask fatwa CTA, PWA install).
  - **General User** (login, ask fatwa, browse jobs, apply, donate, notifications, feedback).
  - **Scholar** (login, review pending fatwas, publish answer, dashboard XP).
  - **Institution** (login, post job, edit profile, review applicants).
  - **Admin** (login, moderation queue, feedback triage, ban user, donations queue including bKash personal-mode manual confirm).
- Cross-role scenarios (fatwa → user is notified → clicks in-app bell → deep-links to answer).

**Definition of done:**
- Every dashboard page + every critical user flow has at least one step.
- Every step has a pass/fail checkbox.
- Founder-approved: the doc can be handed to a non-technical volunteer and they can smoke-test in ≤ 30 min.

---

## ✅ Definition of "production-ready" after M14 + M15 + M16 + M17 + M18 + M19

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
