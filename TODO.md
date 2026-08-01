# ✅ TODO.md — M14 Real-Content Execution List

> Actionable, PR-sized todos derived from [`PLAN.md`](./PLAN.md).
> Tick items as you complete them. Every merged PR should tick at least one row here **and** update [`PROGRESS.md`](./PROGRESS.md).
>
> Legend: `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked

**Last updated:** 2026-08-01

---

## 🚚 M14.1 — Public API Integration Layer

### Foundation
- [x] Add `content_cache` table via migration `2026_08_03_content_cache.sql`
- [x] Add `services/content/cache.ts` — read-through cache helper (get/set with TTL, jitter)
- [x] Add typed error class `ContentFetchError` in `services/content/errors.ts`
- [ ] Add rate-limit helper (`services/content/rateLimit.ts`) — polite backoff
- [x] Document all upstream sources + licenses in `docs/CONTENT_SOURCES.md`

### Quran (Al-Quran Cloud)
- [x] `services/content/quran.ts` — `getSurahList`, `getSurah`, `getAyah`, `ayahAudioUrl`
- [x] Supported editions: `quran-uthmani`, `bn.bengali`, `en.sahih`, `ar.alafasy` (audio)
- [x] Edge function `supabase/functions/quran-proxy/index.ts` — hides upstream from browser + caches
- [x] Unit tests

### Hadith (Sunnah.com)
- [x] `services/content/hadith.ts` — `getCollections`, `getBooks`, `getHadith`
- [ ] Add `SUNNAH_API_KEY` to Supabase Edge Function secrets (never client-side)
- [x] Edge function `supabase/functions/hadith-proxy/index.ts`
- [ ] Fallback to iHadis mirror for Bengali translation coverage
- [ ] Unit tests

### Prayer Times + Qibla (Aladhan)
- [x] `services/content/prayer.ts` — `getPrayerTimesByCity`, `getPrayerTimesByCoords`, `getQibla`
- [x] District-first lookup for Bangladesh (Dhaka default)
- [x] Cache with 24h TTL per (city, date) key
- [ ] Unit tests

### Hijri Calendar
- [x] `services/content/hijri.ts` — `getHijriToday`, `gregorianToHijri`, `hijriToGregorian`
- [ ] Return both Umm al-Qura (Saudi) and Bangladesh-adjusted dates
- [ ] Unit tests

### UI wiring
- [x] `components/DailyIslamicWidget.tsx` — Hijri date + next prayer + one ayah of the day
- [ ] Mount widget on `pages/Home.tsx` and `pages/Dashboard.tsx`
- [ ] `pages/Tools.tsx` gets real Qibla direction + prayer schedule
- [ ] Nightly cron: `content-refresh` edge function to pre-warm popular queries

---

## 🇧🇩 M14.2 — Qawmi Education System Explainer

- [x] `data/qawmiBoards.ts` — 6 boards + Al-Haiatul Ulya federation, with source URLs
- [x] `data/marhalaLadder.ts` — 6-level ladder with year counts + Bangla/English/Arabic names
- [x] `pages/QawmiSystem.tsx` — hero, boards grid, marhala visual ladder, Dawra equivalence card, citations
- [x] Route `/qawmi-system` mounted in `App.tsx`
- [ ] Sidebar link under "Knowledge" section
- [x] SEO: Article + BreadcrumbList JSON-LD + Bengali meta
- [ ] i18n keys added to `locales/{bn,en,ar}/common.json` (page ships Bangla-first, en/ar next)
- [ ] Playwright smoke: `qawmi-system-page.spec.ts`
- [ ] Companion: `data/aliaSystem.ts` + `pages/AliaSystem.tsx`
- [ ] Companion: `data/madrasaGlossary.ts` + `pages/MadrasaGlossary.tsx`

---

## 📜 M14.3 — Real Seerah Timeline

- [x] `data/seerah/events.ts` — 26 seed events (Birth → Wafat), typed
- [x] Categories enum: `pre-prophethood | revelation | makkah-era | migration | madinah-era | battles | family | treaty | wafat`
- [x] Migration `2026_08_04_seerah_events.sql` — table for admin overrides + community flags
- [ ] Rewrite `pages/SeerahTimeline.tsx` to render from dataset — next session
- [ ] Optional: Leaflet map view of event locations
- [ ] SEO: Article + speakable per event
- [ ] Playwright smoke: `seerah-timeline.spec.ts`
- [x] Every event has ≥ 1 citation

---

## 🏫 M14.4 — Institutions Bootstrap

- [x] Migration `2026_08_05_institutions_source_tracking.sql` — `source_name`, `source_url`, `source_verified_at`
- [x] `scripts/import-institutions/index.mjs` — orchestrator
- [x] `scripts/import-institutions/sources/bmeb.mjs` — Alia madrasa list (scaffold)
- [x] `scripts/import-institutions/sources/befaq.mjs` — Qawmi (Befaq) madrasa list (scaffold)
- [x] `scripts/import-institutions/sources/ifb.mjs` — IFB mosque list (scaffold)
- [x] `scripts/import-institutions/sources/banbeis.mjs` — Banbeis (scaffold)
- [x] Dedup by `(name_bn + district)` normalised key
- [ ] Insert with `verified=false` until admin re-approves — happens on real fetchAll implementation
- [ ] Admin tab `pages/Admin/InstitutionVerification.tsx`
- [ ] District + Division dropdown filters on `pages/InstitutionDirectory.tsx`
- [ ] Verify against real staging Supabase before running in prod

---

## 📚 M14.5 — Knowledge Hub / Deen-101 Curriculum

- [x] Migration `2026_08_06_curriculum.sql` — 4 tables (levels, subjects, lessons, resources)
- [x] `data/curriculum/deen101.ts` — 30-day general-public journey
- [ ] `data/curriculum/qawmi.ts` — 6-marhala tree with subjects
- [ ] `data/curriculum/alia.ts` — 5-marhala tree with subjects
- [ ] Rewrite `pages/KnowledgeHub.tsx` — tree navigation
- [ ] Rewrite `pages/Deen101.tsx` — 30-day journey
- [ ] Lesson detail component with embed (video/PDF/audio/text)
- [ ] XP integration on lesson complete (writes to `user_xp`)
- [x] Every seed lesson: `titleBn`, `titleEn`, `sourceUrl`, `sourceName`, `license`, `xpReward`

---

## 📱 M15 — Mobile-First Overhaul

### M15.1 — Layout & spacing
- [x] Reduce mobile page padding: `App.tsx` container `p-8 md:p-12` → `px-4 py-6 md:p-12`
- [x] `Header.tsx` `px-10` → `px-4 md:px-10`
- [x] Hide `Header` search input on `<md`; expose via BottomNav "Explore" tab
- [x] Ensure sidebar is `fixed` (not flex) on mobile so it never eats horizontal space
- [x] Add `.tap-target` utility (`min-h-[44px] min-w-[44px]`) and apply to icon buttons

### M15.2 — Bottom tab navigation
- [x] `components/ui/BottomNav.tsx` — 5 tabs (Home, Explore, Ask, Learn, Profile)
- [x] Sticky bottom with `env(safe-area-inset-bottom)`
- [x] `md:hidden` — only visible on phones
- [x] Active-tab highlight + `aria-current="page"`
- [x] Mount in `App.tsx` alongside sidebar
- [x] FeedbackWidget bottom offset `bottom-20 md:bottom-6` so it isn't covered

### M15.3 — Typography & readability
- [x] `src/index.css` — base body font-size: `16px` on mobile
- [x] `[lang="bn"]` selector — `line-height: 1.7`
- [x] `input/select/textarea` `font-size: 16px` (prevents iOS zoom-on-focus)
- [x] Hero titles keep `text-4xl md:text-5xl` (already correct)

### M15.4 — Touch-friendly interactions
- [x] `components/ui/Modal.tsx` — bottom sheet on `<sm`, safe-area-inset padding
- [x] Form inputs: `text-base` (16px) globally — no more iOS zoom-on-focus
- [x] `components/FeedbackWidget.tsx` — bottom offset applied
- [x] Sidebar overlay: tap-outside close already works; Escape via focus trap next

### M15.5 — Mobile test coverage
- [x] `components/ui/__tests__/BottomNav.test.tsx` — 5 tabs + active state + aria-current
- [x] `e2e/mobile-nav.spec.ts` — viewport iPhone SE, nav renders, tabs route, widget above nav
- [ ] Add mobile viewport to `playwright.config.ts` projects list (spec uses `test.use(devices)` inline for now)

---

## 🎨 M16 — Unified Color System

- [x] `tailwind.config.js` — add `danger-*`, `warning-*`, `info-*` semantic scales
- [x] Sweep `pages/Admin/AdminDashboard.tsx` — replace `red-*` / `amber-*` with tokens
- [x] Sweep `pages/User/UserDashboard.tsx`
- [x] Sweep `pages/Institution/InstitutionDashboard.tsx`
- [x] Sweep `pages/**/*.tsx` — 18 pages total swept
- [x] Sweep `components/**/*.tsx` for raw red/amber literals — 11 components swept
- [x] Add `components/ui/StatusBadge.tsx` (pending/approved/rejected/banned/draft/active/archived/flagged)
- [ ] Update `AGENTS.md` — forbid raw `bg-red-*` / `bg-amber-*` in favour of tokens (do next session)

---

## 📲 M17 — PWA Installable + Web Push

### M17.1 — Manifest + icons
- [x] `public/manifest.webmanifest` — bn + en names, theme `#006a4e`, display standalone
- [x] Reused existing SVG icons (192 + 512 + maskable) — raster PNG generation deferred until logo finalised
- [x] `index.html` — link manifest + apple-touch-icon + theme-color + apple-mobile-web-app meta

### M17.2 — Service worker
- [ ] `npm i -D vite-plugin-pwa workbox-window` (deferred — hand-rolled SW ships first)
- [x] `public/sw.js` — hand-rolled service worker with cache strategies + push handler
- [x] `src/pwa/registerSW.ts` — auto-register + `pwa:update-available` custom event
- [x] Called from `index.tsx` on app init

### M17.3 — Web Push
- [x] Migration `2026_08_07_push_subscriptions.sql` (table + RLS)
- [x] `services/webPush.ts` — subscribe / unsubscribe / send-to-server helpers
- [x] `supabase/functions/push-send/index.ts` — VAPID-signed fan-out via `web-push`
- [x] `supabase/functions/push-subscribe/index.ts` — JWT-authenticated upsert
- [x] Add `VITE_VAPID_PUBLIC_KEY` env to `.env.example` + docs
- [ ] Trigger push on new fatwa answer + new relevant job (wire in fatwa/job services next session)

### M17.4 — Install prompt
- [x] `components/PWAInstallPrompt.tsx` — beforeinstallprompt + iOS hint
- [x] Show after 3 route visits, 30-day dismiss cooldown via localStorage
- [x] Bengali copy (English/Arabic i18n keys come with route audit)
- [x] Mounted in `App.tsx` (above BottomNav on mobile)

### M17.5 — Test coverage
- [x] `src/test/__tests__/manifest.test.ts` — parses + validates manifest.webmanifest
- [x] `components/__tests__/PWAInstallPrompt.test.tsx` — 3 deterministic scenarios
- [ ] `e2e/pwa.spec.ts` — manifest link, SW registration (do in follow-up session)

---

## 🔔 M18 — Delightful Notification UX

### M18.1 — Sonner toasts
- [x] `npm i sonner` (install)
- [x] `services/toast.ts` — typed wrapper: success/error/info/warning/loading/promise/dismiss
- [x] Mount `<Toaster />` in `App.tsx` (top-centre, richColors, closeButton)
- [ ] Replace `alert()` and inline error banners in `services/{authService,donationService,feedbackService}.ts` (do next session)

### M18.2 — Notification centre
- [x] `npm i @radix-ui/react-popover` (install)
- [x] `components/NotificationBell.tsx` — Radix Popover with unread badge + list + mark-all-read + empty state
- [x] Replace plain `<Bell>` icon in `Header.tsx` with `<NotificationBell />`
- [x] i18n keys under `notifications.*` for bn/en/ar

### M18.3 — Permission primer
- [x] `components/NotificationPermissionPrimer.tsx` — pre-native prompt card
- [ ] Trigger on high-value actions (fatwa submit, application submit) — controlled component, wire in parents next session
- [x] 7-day suppression via localStorage (`isPrimerSuppressed()`)
- [x] Bengali copy shipped; en/ar copy via later i18n pass

### M18.4 — Deep-link routing
- [x] `services/notificationRouter.ts` — `handleNotificationClick(url)` helper
- [x] Used in `NotificationBell` row click
- [ ] Wire into `public/sw.js` `notificationclick` (already has openWindow — just needs to call helper if we compile SW; deferred)

### M18.5 — Tests
- [x] `services/__tests__/toast.test.ts` — 5 tests
- [x] `services/__tests__/notificationRouter.test.ts` — 5 tests
- [x] `components/__tests__/NotificationPermissionPrimer.test.tsx` — 5 tests

---

## 🛠️ Cross-cutting

- [x] `components/Citation.tsx` — reusable citation badge (`source`, `url`, `verifiedAt`)
- [ ] Update `AGENTS.md` — every new page must ship citations + i18n + SEO + tests together
- [ ] Update `PROGRESS.md` after every merged PR
- [ ] Run `npm run sync-readme` before every push
- [ ] `docs/CONTENT_SOURCES.md` — list of every upstream API/dataset, license, rate limit, last verified

---

## 🧪 Testing gate for M14

Every PR under M14 must satisfy:
- [ ] `npx vitest run` — full suite green
- [ ] New service? → unit test with mocked fetch
- [ ] New page? → Playwright smoke that at minimum loads the route
- [ ] New DB table/column? → migration is idempotent + adds RLS
- [ ] New user-facing string? → present in `bn`, `en`, `ar`
- [ ] New public route? → added to `public/sitemap.xml`

---

## 📌 Note on ordering

Do **M14.1 (foundation) → M14.2 (Qawmi page) → M14.3 (Seerah) → M14.4 (Institutions) → M14.5 (Curriculum)** in that order. M14.3–M14.4 can be parallelised across contributors because they touch disjoint files.
