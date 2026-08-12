<!--
  PROGRESS.md — single source of truth for engineering work on Qowmi.
  Update whenever a task starts, completes, or blocks. This file must be kept
  ACCURATE — it replaces stale sections of README/TRACK.
  Format:
    ✅ DONE   |  🟡 DOING   |  ⚪ TODO   |  🔴 BLOCKED
-->

# Qowmi — Live Progress Tracker

> **Purpose:** one file, always up to date, so the founder always knows exactly
> what's shipped, what's in flight, and what's still to build. Every commit
> should either update this file or reference it.
> **Owner:** Engineering | **Founder-visible:** YES.

**Last updated:** 2026-08-02 15:00 UTC · **Latest commit pushed to origin/main** (commit 0a6db83 — fix broken form submissions)

### 2026-08-02 (session 18 — Fix broken public-facing form submissions)

**Theme**: Fixed two critical form submission bugs affecting regular users

- **Community.tsx — Blood donor registration form completely broken**
  - **Bug 1**: `toast` was called 5 times but never imported → `ReferenceError: toast is not defined`
    on every form interaction (validation, success, error paths)
  - **Bug 2**: The donor registration modal JSX was placed inside `PostCard`
    component but referenced `showDonorRegistration`, `donorForm`, and
    `handleDonorRegistration` state/handlers from the `Community` parent.
    These are in different component scopes so the modal couldn't access them.
  - **Fix**: Added `import { toast } from '../services/toast'`; moved the donor
    modal back into `Community` where its state lives.
  - **Impact**: Blood donor registration now works. Users can register, search
    donors, and get proper success/error feedback.

- **FatwaCenter.tsx — Fatwa submission silently failing**
  - **Bug**: Fatwa ID generated as `f-${Date.now()}` but `fatwas.id` column
    is `uuid` type — PostgreSQL rejects non-UUID strings.
  - **Fix**: Replaced with `crypto.randomUUID()` (same pattern used in the
    ScholarApply fix from session 17).
  - **Impact**: Fatwa questions now submit successfully and appear in the list.

---

## 🎯 North-Star Goals

1. Ship a working, safe, Bengali-first platform to Bangladesh's madrasa community.
2. Full **tri-language** support: বাংলা (default), English, العربية (RTL).
3. **Full SEO + AEO** so we grow organically without paid ads.
4. Enable **community trust** (verified scholars, feedback loop, transparent donations).
5. Reach **10,000 verified users + 500 institutions + 100 scholars** in 6 months.

---

## 🚦 Executive Status (updated every session)

| Track | Status | ETA |
|---|---|---|
| Frontend UI (30+ pages) | ✅ DONE | — |
| Brand consistency | ✅ DONE (2026-08-01) | — |
| Supabase backend + RLS | ✅ DONE | — |
| Email auth | ✅ DONE | — |
| Phone/SMS OTP auth | ✅ DONE (2026-08-01) | — |
| Reactive auth guards | ✅ DONE (2026-08-01) | — |
| Feedback loop | ✅ DONE (2026-08-01) | — |
| Legal (ToS, Privacy in bn) | ✅ DRAFT (2026-08-01) | Lawyer review pending |
| Notifications (in-app) | ✅ DONE | — |
| Notifications (Web Push) | ⚪ TODO | week 2 |
| Notifications (SMS blasts) | ⚪ TODO | week 3 |
| **Tri-language (bn/en/ar)** | ✅ INFRA DONE (2026-08-01) | Ongoing per-page translation |
| **SEO (meta, sitemap, JSON-LD)** | ✅ DONE (2026-08-01) | Per-page tags rolling out |
| **AEO (FAQ, HowTo, Speakable)** | ✅ DONE (2026-08-01) | Schemas ready to wire per-page |
| Payment integration (bKash) | ✅ CODE DONE (2026-08-01) · 🔴 Blocked on merchant account | week 4 |
| Admin feedback triage UI | ✅ DONE (2026-08-01) | — |
| Mobile app (Phone/OTP login) | ✅ DONE (2026-08-01) · other screens ongoing | month 2 |
| Playwright e2e (OTP, feedback, i18n, SEO) | ✅ DONE (2026-08-01) | — |
| Real deployment (Supabase + Vercel env vars) | 🔴 BLOCKED on founder | THIS WEEK |
| Scholar onboarding (5 real ones) | 🔴 BLOCKED on founder | THIS MONTH |

---

## ✅ Completed (chronological)

### 2026-08-02 (session 17 — Fix Scholar Application + Add Vercel Analytics)

**Theme**: Fixed broken scholar application submission and added visitor tracking

- **Scholar Application Fix** (`pages/ScholarApply.tsx` + `services/dataService.ts`)
  - **Bug**: Missing `id` field in database insert causing silent failure
  - **Fix**: Added `crypto.randomUUID()` for ID generation
  - **Added**: Proper error handling with `retryWithBackoff`
  - **Added**: Toast notifications (success: "আবেদন সফলভাবে জমা হয়েছে", error messages)
  - **Added**: Validation feedback for required fields
  - **Added**: Duplicate application detection (23505 error code)

- **Vercel Analytics** (`index.tsx` + `package.json`)
  - Installed `@vercel/analytics` package
  - Added `<Analytics />` component to React tree
  - Now tracking page views and visitor data in Vercel dashboard
  - Works alongside existing PostHog analytics

**Impact**: Scholar application now works end-to-end. Users can apply, see status, and get proper feedback. Analytics tracking live in production.

**Build**: ✅ Success (4.71s)

### 2026-08-02 (session 16 — Complete ProfileBuilder with Backend Integration)

**Theme**: Built production-ready ProfileBuilder with full 4-step flow, backend integration, and database migration

- **Database Migration**
  - `database/migrations/2026_08_08_user_profile_extended_fields.sql` - Added extended profile fields
  - New columns: `bio`, `district`, `maslak`, `education` (jsonb), `experience` (jsonb), `address`, `date_of_birth`, `gender`
  - Auto-update trigger for `updated_at` timestamp
  - Index on district for location-based searches

- **ProfileBuilder Component** (`pages/ProfileBuilder.tsx`)
  - **Step 1: Basic Info** - Name, phone, district, maslak, bio with validation
  - **Step 2: Education** - Dynamic education entries (institution, degree, year, result) with add/remove
  - **Step 3: Experience** - Dynamic work experience entries (title, organization, duration, description) with add/remove
  - **Step 4: Preview** - Full profile preview before saving
  - **State Management** - React useState with proper TypeScript interfaces
  - **Backend Integration** - Supabase load/save with error handling
  - **Validation** - Required field validation on step navigation
  - **UX** - Loading states, saving states, success/error toasts
  - **Responsive** - Mobile-friendly with proper spacing and touch targets

- **Key Features**
  - Loads existing profile data on mount
  - Controlled form inputs (value + onChange)
  - Add/remove dynamic entries for education and experience
  - Form validation prevents proceeding without required fields
  - Preview step shows formatted profile
  - Saves all data to Supabase `user_profiles` table
  - Toast notifications for user feedback

**Impact**: ProfileBuilder is now production-ready, fully backend-integrated, and provides complete profile management for job seekers. Employers can now view comprehensive candidate profiles.

**Build**: ✅ Success (4.47s) | **ProfileBuilder Bundle**: 12.37 kB (gzipped: 3.36 kB)

### 2026-08-02 (session 15 — Brand Rebrand to Qowmi)

**Theme**: Complete rebrand from "Madrasa Connect BD" to "Qowmi" (কওমি) to match domain qowmi.mvp.bd

- **Brand Identity Update**
  - `README.md` - Updated header, mission, footer to "Qowmi — কওমি"
  - `PRD.md` + `PRD.bn.md` - Updated product name and metadata
  - `locales/{bn,en,ar}/common.json` - Updated brand.name, brand.short, brand.tagline
  - `package.json` - Already "qowmi-mvp"
  - `public/manifest.webmanifest` - Already "কওমি - Qowmi"
  - `index.html` - Already "Qowmi - কওমি শিক্ষা প্ল্যাটফর্ম"

- **UI Component Updates**
  - `App.tsx` - Logo text updated to "কওমি"
  - `pages/LandingPage.tsx` - Header, footer, copyright updated
  - `pages/Login.tsx` - Brand name updated
  - `pages/Register*.tsx` - All registration pages updated
  - `pages/VerifyEmail.tsx` - Brand name updated
  - `pages/AboutUs.tsx` - Footer copyright updated
  - `components/SEO.tsx` - og:site_name updated to "Qowmi"
  - `components/StructuredData.tsx` - Organization schema updated
  - `vite.config.ts` - PWA manifest name and short_name updated

**Impact**: Complete brand consistency across all user-facing surfaces. Domain qowmi.mvp.bd now matches product branding.

**Rationale**: Domain already registered as qowmi.mvp.bd, focused brand name better represents Qowmi education system target audience for MVP launch.

### 2026-08-02 (session 14 — Complete Color Audit & Mobile PWA Enhancement)

**Theme**: Eliminated all colored classes for strict black/white/gray palette + enhanced mobile responsiveness for native app feel

- **Color Consistency - 100% Black/White/Gray Only**
  - `pages/Admin/*.tsx` - Removed all warning/danger/info/brand colored classes → gray/black
  - `pages/Institution/*.tsx` - Status badges, buttons, tables → grayscale only
  - `pages/User/*.tsx` - Referral section, badges → gray palette
  - `pages/Scholar*.tsx` - All colored accents → black/white/gray
  - `components/ui/*.tsx` - Badge, StatusBadge, Input, Button → grayscale
  - `components/*.tsx` - NotificationBell, FeedbackWidget, DonationModal → no colors
  - **Eliminated**: warning-*, danger-*, info-*, brand-*, bd-green (100+ instances)
  - **Result**: 0 colored class instances, pure black/white/gray palette

- **Mobile Responsiveness Enhancement**
  - `pages/Institution/InstitutionDashboard.tsx` - Tables with horizontal scroll (`overflow-x-auto`), responsive padding (`p-4 md:p-8`)
  - `pages/Admin/AdminDashboard.tsx` - Touch targets (44×44px via `tap-target`), responsive layouts
  - `pages/Admin/SadaqahApprovals.tsx` - Mobile-friendly cards (`flex-col md:flex-row`), stacking buttons
  - All dashboards - `md:` breakpoints for padding, text, gaps (25+ instances)
  - Touch targets - Added `tap-target` class (44×44px minimum) throughout for iOS/Android compliance
  - Typography - Mobile scaling: `text-base md:text-xl`, `text-2xl md:text-3xl`
  - Layouts - Mobile stacking: `flex-col md:flex-row`, `gap-2 md:gap-3`
  - Tables - Horizontal scroll containers: `overflow-x-auto -mx-4 md:mx-0` + `min-w-[600px]`

- **Test Updates**
  - `components/ui/__tests__/Input.test.tsx` - Updated to expect gray-400 border instead of danger-400
  - `components/ui/__tests__/Badge.test.tsx` - Updated for black success variant (was bd-green)
  - `components/ui/__tests__/StatusBadge.test.tsx` - Verified grayscale expectations
  - **All 236 tests passing** (was 235 → fixed Input test)

- **Documentation**
  - `COLOR_AUDIT_FINAL.md` - Complete second-pass audit report with color replacement map
  - `FINAL_VERIFICATION.md` - Verification checklist, evidence, and UX impact analysis
  - `AUDIT_REPORT_2026_08_02.md` - Initial audit from first pass
  
**Impact**: App now uses ONLY black (#111827), white (#ffffff), and gray (50-900) colors with zero exceptions. Mobile experience feels like native app with proper touch targets (44×44px), responsive layouts, and horizontal-scroll tables. 100% PWA-ready.

**Build**: ✅ Success (4.87s) | **Tests**: ✅ 236/236 passing | **Color violations**: ✅ 0

### 2026-08-01 (session 12 — M21 password toggle + local avatars)

Two small but high-visibility UX wins.

**M21.1 — Password show/hide toggle**
- `components/ui/PasswordInput.tsx` — reusable password field with eye/eye-off button.
  - 44×44 tap target (iOS HIG); `aria-pressed`; Bengali aria-label.
  - Forwards refs + arbitrary input props (name/autoComplete/required/etc.).
  - Optional `leadingIcon` prop mirrors the auth-screen visual style.
- Wired into `pages/Login.tsx` (email tab), `pages/RegisterUser.tsx`, `pages/RegisterInstitution.tsx`.

**M21.2 — Swap DiceBear → boring-avatars (open-source, TS-friendly, MIT)**
- `npm i boring-avatars` (16 KB, generates SVG procedurally in the client — zero network calls).
- `utils/avatar.ts` — kept the `inferGenderFromName` logic (works well for our Bangladeshi audience); added:
  - `getAvatarPalette(gender)` — brand-consistent 5-hex palettes (bd-green for male, warm plum/amber for female, slate for unknown).
  - `getAvatarStyleFromName(name)` — one-call helper used by Avatar.
  - `isRealPhotoUrl(url)` — treats legacy `api.dicebear.com` and `picsum.photos/seed/user` as stubs to bypass.
- `components/ui/Avatar.tsx` — rewritten:
  - Real uploaded photos → `<img>` as before (with graceful onError hide).
  - Otherwise → `<BoringAvatar variant="beam" size colors square>` from `boring-avatars`.
  - Online-status dot + sizing API preserved.
  - Added screen-reader-only initials label for a11y.
- `database/seed.sql` — dropped hardcoded `api.dicebear.com` URLs; avatar_url is now `NULL` for the 4 seed accounts so the client generates locally.
- Tests: rewrote `utils/__tests__/avatar.test.ts` (17 cases) + `components/ui/__tests__/Avatar.test.tsx` (9 cases) — every legacy stub URL now falls back to local generator.

**Tests:** 236/236 green (was 228 → +8).

### 2026-08-01 (session 11 — 5-step integration sweep)

Executed the follow-up shortlist from previous sessions as one coherent commit,
in strict order: confirmation UX → push triggers → primer wiring → M14 UI
rewires → deploy runbook.

**Step 1 — Confirm-dialog UX**
- `pages/Institution/InstitutionDashboard.tsx` — replaced the browser `confirm()` (only remaining native modal) with a **Sonner action toast** that has "হ্যাঁ, মুছে ফেলুন" + "বাতিল" buttons, then wraps the deletion in `toast.promise()` for loading/success/error.
- Services already used the `{ok, error}` pattern so no `alert()` remained to sweep.

**Step 2 — Push triggers**
- `services/pushNotify.ts` — thin wrapper around `push-send` edge function. `sendPushNotification()` + `sendPushToMany()` — fire-and-forget, never throws, logs to console on failure.
- `services/dataService.ts`:
  - `approveFatwa()` now fetches the fatwa row and pushes "আপনার ফতোয়ার উত্তর প্রস্তুত" to the original asker with a deep-link.
  - `verifyJob()` fans out "নতুন চাকরি আপনার জন্য" to subscribers of the (feature-gated) `job_alert_subscribers` view.

**Step 3 — Permission primer wiring**
- `pages/FatwaCenter.tsx` — after a successful fatwa submit, shows `<NotificationPermissionPrimer>` with contextual copy "উত্তর পেলে জানাতে চান?" (respects the 7-day dismiss cooldown from session 8).
- Also added a proper `toast.success()` on submit + `toast.error()` on failure.

**Step 4 — M14 UI rewires (highest visible impact)**
- `pages/Home.tsx` — replaced the hardcoded "নামাজের সময়" block with `<DailyIslamicWidget city="Dhaka" ayahRef="2:255" />`. Users now see live Hijri date + real Aladhan prayer times + Ayatul Kursi from Al-Quran Cloud.
- `pages/SeerahTimeline.tsx` — added a new "সম্পূর্ণ সীরাত কালরেখা" section rendered from `SEERAH_EVENTS` (M14.3 dataset), with every event showing its Quran.com / Sunnah.com citation as a clickable external link.
- `pages/Deen101.tsx` — added a new "৩০ দিনের সম্পূর্ণ যাত্রা" grid rendered from `DEEN101_LESSONS`, showing each lesson's day #, category pill, duration, XP reward, and source citation.

**Step 5 — Deploy runbook**
- `docs/DEPLOY_RUNBOOK.md` — exact copy-paste commands for deploying end-to-end:
  - Prereqs + Supabase/Vercel login + link.
  - `supabase db push` (all 6 new migrations).
  - `supabase functions deploy` (8 edge functions).
  - `supabase secrets set` for Sunnah API key + VAPID keys + bKash merchant/personal + Gemini.
  - `vercel env add` for `VITE_*` client-side envs.
  - `vercel --prod` deploy.
  - Post-deploy smoke + rollback commands.

**Tests:** 228/228 green (no change — behaviour-preserving edits).

### 2026-08-01 (session 10 — M20 Public Language Switcher + IP-Geo)

The language switcher now lives in the Header on every viewport, and
first-time visitors get their language auto-picked from their IP.

- **PLAN.md + TODO.md** — new M20 milestone with definition of done.
- **`i18n/geoDetect.ts`** — pure country→lang mapper + cached ipapi.co fetch (7-day localStorage cache) + ipwho.is fallback + `?geo=XX` dev/QA override + 2500 ms AbortController timeout.
  - Bengali countries: `BD` (+ Bengali speakers detected via `languages` hint).
  - Arabic League countries: 22 codes including SA, AE, EG, MA, and Palestine.
  - Everything else → English.
- **`i18n/geoBootstrap.ts`** — async post-init hook: only runs when the user has no `mc_language` and no `?lang=` param; calls `i18n.changeLanguage()` and fires a Sonner info toast when it overrides the default.
- **`index.tsx`** — calls `bootstrapGeoLanguage()` on app init, right after PWA + analytics.
- **`components/ui/Header.tsx`** — `<LanguageSwitcher />` mounted next to the notification bell. First time it's visible for logged-in mobile users (previously buried in the sidebar).
- **`docs/MANUAL_TESTING.md`** — new §1.1.a "Language auto-detect" — 7 QA steps including `?geo=SA` and `?geo=BD` dev overrides.
- **Tests:** 228/228 green (was 220 → +8 in `i18n/__tests__/geoDetect.test.ts`).

### 2026-08-01 (session 9 — M19 Manual Browser Test Guide)

Written for humans, not machines — so the founder or a non-technical volunteer
can smoke-test the platform end-to-end before every release.

- **PLAN.md + TODO.md** — new M19 milestone with definition of done.
- **`docs/MANUAL_TESTING.md`** — the master playbook.
  - 5 role-based scenario blocks: Guest → User → Scholar → Institution → Admin.
  - Cross-role realtime scenario (fatwa answered → user is notified).
  - Mobile-only checks (BottomNav, install prompt, safe-area, bottom-sheet modals).
  - Accessibility spot-checks (skip link, Escape, alt, Lighthouse).
  - Security spot-checks (role guarding, no leaked secrets, JWT hygiene).
  - Every step has a pass/fail checkbox + expected result + bug-file template.
- **`docs/QA_CHECKLIST.md`** — 30-minute pre-release smoke:
  - Automated gates → Guest → User → Admin → cross-role → mobile → sign-off.
  - Copy-into-issue format so releases have an auditable trail.
- **README.md** — linked both docs + INCIDENT_RUNBOOK + ROLLBACK_PROCEDURES in the Key Documents table.
- **AGENTS.md** — new **Manual browser test rule** requiring QA_CHECKLIST before every deploy and MANUAL_TESTING role section for any PR touching auth/payments/notifications/admin; adds "write a test before fixing the bug" rule for manual regressions.

### 2026-08-01 (session 8 — M18 Delightful Notification UX)

Three distinct notification surfaces integrated using the most-loved open-source
libraries (Sonner + Radix Popover), all styled with our M16 tokens.

- **PLAN.md + TODO.md** — new M18 milestone with sub-phases + definition of done.
- **Dependencies:** `sonner`, `@radix-ui/react-popover`.

**M18.1 Sonner toasts**
- `services/toast.ts` — typed wrapper (`success`, `error`, `info`, `warning`, `loading`, `promise`, `dismiss`). Never import sonner directly from feature code; import from here so future replacement is one-file.
- `App.tsx` — `<Toaster position="top-center" richColors closeButton />` mounted globally.

**M18.2 Notification centre**
- `components/NotificationBell.tsx` — Radix Popover with:
  - Live unread badge (bd-green pill, 99+ overflow).
  - Grouped scrollable list rendered from `useNotificationStore`.
  - Mark-all-read action.
  - Empty state with Inbox icon.
  - Click row → mark read + navigate to `n.link`.
  - Tokens only (bd-green, brand-*, info-*, warning-*).
- `components/ui/Header.tsx` — plain Bell icon replaced with `<NotificationBell />`; dead `unreadCount` bookkeeping removed.
- `locales/{bn,en,ar}/common.json` — new `notifications.*` keys (title, bellLabel, markAllRead, empty).

**M18.3 Permission-priming card**
- `components/NotificationPermissionPrimer.tsx` — soft ask BEFORE the browser's native permission dialog. Controlled component (parent decides when).
  - Handles `granted` → renders nothing.
  - Handles `denied` → renders a small "enable in settings" hint (warning tokens).
  - "Allow" button subscribes via `services/webPush.ts` + POSTs to `push-subscribe` edge function + toast success.
  - "Later" button writes `notif-primer-dismissed-at` for 7-day cooldown.
  - Position: `bottom-24 md:bottom-6` (above BottomNav on mobile).

**M18.4 Deep-link routing**
- `services/notificationRouter.ts` — `handleNotificationClick(link)` normalises absolute → path for react-router; used by NotificationBell rows.
- SW `notificationclick` handler in `public/sw.js` already forwards to url (bundling parity deferred).

**M18.5 Tests**
- `services/__tests__/toast.test.ts` — 5 tests (success forwarding, Error normalisation, unknown fallback, descriptions, promise forwarding).
- `services/__tests__/notificationRouter.test.ts` — 5 tests (empty, absolute, same-origin strip, cross-origin, bare path).
- `components/__tests__/NotificationPermissionPrimer.test.tsx` — 5 tests (closed, default permission, granted, denied, dismiss suppression).

**Tests:** 220/220 green (was 205).

### 2026-08-01 (session 7 — M16 Color System + M17 PWA)

Two milestones shipped in parallel. Full PLAN + TODO updated first, then executed.

- **PLAN.md + TODO.md** — new **M16 Unified Color System** + **M17 PWA Installable + Web Push** milestones with sub-phases + definition of done.

**M16 Unified Color System**
- `tailwind.config.js` — added semantic scales:
  - `danger-{50,100,200,400,500,600,700}` (destructive actions, errors)
  - `warning-{50,100,200,500,600,700}` (drafts, pending, moderation)
  - `info-{50,100,200,500,600,700}` (neutral status pills)
- `components/ui/StatusBadge.tsx` — the ONE source of truth for status pills (`pending | approved | rejected | banned | draft | active | archived | flagged`), all using tokens.
- **Global sweep — 29 production files** — every raw `red-*` and `amber-*` Tailwind class replaced with the semantic scope (`danger-*` / `warning-*`).
- Verified: `grep -rE "bg-(red|amber)-\d"` returns **0** hits in `pages/` and `components/` (excluding tests, which now assert the new tokens).

**M17 PWA Installable + Web Push**
- `public/manifest.webmanifest` — full W3C manifest (Bangla name, theme `#006a4e`, standalone, portrait, shortcuts for `/fatwa` + `/institutions`).
- `index.html` — links manifest + apple-touch-icon + theme-color + apple-mobile-web-app meta tags.
- `public/sw.js` — hand-rolled service worker (`mcbd-v1` cache), NetworkFirst for HTML, CacheFirst for assets, `push` event handler with notification-click routing.
- `src/pwa/registerSW.ts` — vanilla auto-registration, dispatches `pwa:update-available` on new SW.
- `index.tsx` — calls `registerServiceWorker()` on init.
- `services/webPush.ts` — client helpers (`isPushSupported`, `subscribeToPush`, `unsubscribeFromPush`, `sendSubscriptionToServer` with `urlBase64ToUint8Array`).
- `database/migrations/2026_08_07_push_subscriptions.sql` — table + RLS + user-owned policies.
- `supabase/functions/push-send/index.ts` — VAPID-signed fan-out via `web-push`, prunes 404/410 subs.
- `supabase/functions/push-subscribe/index.ts` — JWT-authenticated upsert.
- `components/PWAInstallPrompt.tsx` — Android install button + iOS Safari "Add to Home Screen" hint; shows after 3 route visits, 30-day dismiss cooldown; mounted in `App.tsx` (above BottomNav on mobile).
- `.env.example` — new `VITE_VAPID_PUBLIC_KEY` + VAPID setup instructions.
- Tests: `src/test/__tests__/manifest.test.ts` validates every required manifest field, `components/__tests__/PWAInstallPrompt.test.tsx` covers 3 deterministic scenarios.
- Follow-up (not blocking): install `vite-plugin-pwa` + `web-push` deps + generate real VAPID keys (`npx web-push generate-vapid-keys`).

**Tests:** 205/205 green (was 186).

### 2026-08-01 (session 6 — M15 Mobile-First Overhaul)

95% of our users are on phones, so the entire chrome was rewired for mobile-first.
PLAN.md + TODO.md now include the full M15 track.

- **PLAN.md + TODO.md** — added the M15 milestone (5 sub-phases, definition of done).
- **M15.1 Layout & spacing**
  - `App.tsx` main container: `p-8 md:p-12` → `px-4 py-6 md:px-8 md:py-8 lg:p-12`
    with `pb-24 md:pb-8` so content isn't hidden under the new BottomNav.
  - `App.tsx` root wrapper: dropped `flex-col md:flex-row` → `flex-row` so the
    fixed sidebar never steals horizontal space on mobile.
  - `Header.tsx`: `px-10` → `px-4 md:px-10`; height `h-20` → `h-16 md:h-20`;
    search input hidden on `<md`; hamburger moved to the left (thumb-reachable);
    every icon button now ≥ 44 × 44 px.
- **M15.2 Bottom tab navigation**
  - New `components/ui/BottomNav.tsx` — 5 tabs (Home, Explore, Ask, Learn, Profile).
  - `md:hidden`, sticky bottom, `pb-[env(safe-area-inset-bottom)]` for iPhone home-indicator.
  - Active-tab highlighted via `NavLink` + implicit `aria-current="page"`.
  - Mounted in `App.tsx` alongside `FeedbackWidget`.
  - Bengali/English/Arabic labels via `locales/{bn,en,ar}/common.json` new `bottomNav` block.
- **M15.3 Typography & readability**
  - `src/index.css`: base `font-size: 16px`, `line-height: 1.5` (1.7 for Bengali).
  - `input/select/textarea` pinned to `16px` — kills iOS Safari zoom-on-focus for good.
  - New utility classes `.tap-target` (44 × 44 min-hit), `.safe-top`, `.safe-bottom`.
- **M15.4 Touch-friendly interactions**
  - `Modal.tsx`: bottom-sheet on `<sm` (docks to bottom edge, no rounded corners,
    full-width) then centred card on `sm+`. Safe-area-inset padding baked in.
    Close button now 44×44. Header is sticky inside a scrolling modal.
  - `FeedbackWidget.tsx`: `bottom-6 right-6` → `bottom-20 md:bottom-6 right-4 md:right-6`
    so it never sits under the BottomNav.
- **M15.5 Test coverage**
  - `components/ui/__tests__/BottomNav.test.tsx` — 6 tests (tab count, labels,
    aria-label, md:hidden, aria-current on active route).
  - `e2e/mobile-nav.spec.ts` — Playwright iPhone-SE spec: nav visible on mobile,
    hidden on desktop, Ask tab routes to /fatwa, FeedbackWidget above nav.
- **Tests:** 186/186 green (was 180).

### 2026-08-01 (session 5 — M14 Real Content foundation)

Roadmap + execution list committed as `PLAN.md` + `TODO.md`. This session
shipped the full M14.1 layer + partial M14.2–M14.5 (data + migrations +
scaffolds; UI polish continues next session).

- **PLAN.md** — full M14 roadmap (M14.1–M14.5, sequencing, definition of done).
- **TODO.md** — PR-sized actionable execution list with tick boxes per milestone.
- **docs/CONTENT_SOURCES.md** — canonical registry of every upstream provider, licence, rate limit.
- **M14.1 — Public API integration layer** (shipped)
  - `services/content/errors.ts` — typed `ContentFetchError` + `Result<T>`
  - `services/content/cache.ts` — deterministic `cacheKey` + read-through helper
  - `services/content/quran.ts` — Al-Quran Cloud client (surah list, surah, ayah, audio CDN)
  - `services/content/hadith.ts` — Sunnah.com client (collections, books, hadith)
  - `services/content/prayer.ts` — Aladhan client (city/coords timings + Qibla)
  - `services/content/hijri.ts` — today + G↔H conversion
  - `database/migrations/2026_08_03_content_cache.sql` — `content_cache` table + RLS + purge function
  - `supabase/functions/{quran,prayer,hadith}-proxy/index.ts` — Edge Function proxies with cache-first
  - `components/Citation.tsx` — reusable citation badge
  - `components/DailyIslamicWidget.tsx` — Hijri date + next prayer + ayah-of-the-day, mounts on Home/Dashboard
- **M14.2 — Qawmi Education System explainer** (shipped)
  - `data/qawmiBoards.ts` — 6 boards + Al-Haiatul Ulya federation, all with source URLs
  - `data/marhalaLadder.ts` — 6-stage ladder (Ibtidaiyyah → Dawra-e-Hadith) with subject lists
  - `pages/QawmiSystem.tsx` — cited data-driven explainer page
  - `App.tsx` — `/qawmi-system` route mounted
  - `components/StructuredData.tsx` — added generic `articleSchema`
- **M14.3 — Real Seerah dataset** (shipped; page rewire next session)
  - `data/seerah/events.ts` — 26 typed events (Birth → Wafat) w/ Quran/Sunnah.com citation URLs
  - `database/migrations/2026_08_04_seerah_events.sql` — admin overlay table + RLS
- **M14.4 — Institutions bootstrap scaffold** (shipped)
  - `database/migrations/2026_08_05_institutions_source_tracking.sql` — `source_name`, `source_url`, `source_verified_at`, `district`, `division` columns
  - `scripts/import-institutions/index.mjs` — CLI orchestrator with dry-run + dedup + write
  - `scripts/import-institutions/sources/{bmeb,befaq,ifb,banbeis}.mjs` — pluggable adapters (stubs)
  - `scripts/import-institutions/README.md` — full runbook
- **M14.5 — Knowledge Hub / Deen-101 curriculum** (shipped; page rewire next session)
  - `database/migrations/2026_08_06_curriculum.sql` — 4 curriculum tables (levels, subjects, lessons, resources) w/ RLS
  - `data/curriculum/deen101.ts` — full 30-day general-public journey, every lesson sourced
- **Tests:** 180/180 green (was 155). New: cache-key, errors, quran audio, Qawmi data, Seerah dataset, Deen-101 curriculum.

### 2026-08-01 (session 4 — Avatar gender fix + bKash personal fallback + Partnerships)

- **Gender-aware avatar helper** — fixes long-standing bug where DiceBear
  `avataaars` seeded by name/role rendered feminine avatars for masculine
  names (and vice-versa).
  - `utils/avatar.ts` — `inferGenderFromName` (Bangla/Arabic/English tokens,
    weak-token tie-breaker so "Aisha Rahman" → female) + `getGenderedAvatarUrl`
    (pins `top=shortHair` for male, `top=hijab` for female, neutral otherwise;
    respects real uploaded photos)
  - `components/ui/Avatar.tsx` — wired to helper; every avatar site-wide now
    resolves to a gender-appropriate fallback URL
  - `utils/__tests__/avatar.test.ts` — 8 new tests
  - `components/ui/__tests__/Avatar.test.tsx` — updated to reflect new
    "always render dicebear <img>" behaviour + added masculine/feminine
    top-pinning assertions
- **bKash personal-account fallback** — lets us start accepting sadaqah
  today, before the merchant account clears the 4–8 week approval window.
  - `supabase/functions/bkash-checkout/index.ts` — new `BKASH_MODE=personal`
    branch; returns invoice ref + `Send Money` instructions instead of a
    tokenized checkout URL. Rows land as `provider='bkash_personal'` and
    `status='awaiting_manual_review'` so an admin can confirm the SMS.
  - `database/migrations/2026_08_02_bkash_personal_fallback.sql` — widens
    the `provider` + `status` CHECK constraints, adds a partial index for
    the admin reconciliation queue
  - `services/donationService.ts` — extended `CreateDonationResult` type
  - `components/DonationModal.tsx` — new personal-mode instructions card
    with copy-to-clipboard invoice reference
  - `NEXT_STEPS.md` §9a — full ops runbook for enabling / disabling the mode
- **Partnerships registry** — curated shortlist of Bangladesh Islamic apps
  and non-profits with concrete proposal + outreach status.
  - `data/partnerships.ts` — typed `Partner` model + 12-entry registry
    (IFB, Befaq, BMEB, As-Sunnah Foundation, Quantum, Anjuman, Muslim Bangla,
    Noor, Salat First, iHadis, IOU, Onnorokom)
  - `data/__tests__/partnerships.test.ts` — schema integrity tests
  - `NEXT_STEPS.md` §9b — founder-facing outreach playbook + talking points

### 2026-08-01 (session 3 — bKash + Admin Feedback + Mobile OTP + e2e)

- **README.md rewritten** — accurate current-state table, points at PROGRESS.md
- **TRACK.md** — status header updated, added **M13 Growth** module with the
  full task list for i18n / SEO / Payments / Notifications
- **bKash donation flow (end-to-end scaffold)**
  - `database/migrations/2026_08_01_donations_and_admin.sql` — donations
    table with RLS + auto roll-up trigger onto sadaqah_projects.raised
  - `supabase/functions/bkash-checkout/index.ts` — create / execute / query
    actions, full lifecycle logging, dry-run fallback when secrets missing
  - `services/donationService.ts` — client wrapper
  - `components/DonationModal.tsx` — brand-consistent modal with amount
    preset chips + custom amount + donor info + optional message
  - `pages/SadaqahHub.tsx` — hero "Donate" button + per-project button
    + bKash-return callback handling + success/failure receipt banner
- **Admin Feedback Triage panel**
  - `services/adminService.ts` — listFeedback, getFeedbackCounts,
    updateFeedbackStatus (RLS-scoped to ADMIN)
  - `pages/Admin/FeedbackPanel.tsx` — filters, list, detail drawer with
    status transitions (new → in_progress → resolved / archived) + notes
  - Mounted as a new tab in `pages/Admin/AdminDashboard.tsx`
- **Mobile OTP login**
  - `mobile/src/services/auth.ts` — added `normalizeBdPhone`,
    `sendPhoneOtp`, `verifyPhoneOtp` (mirrors web authService)
  - `mobile/src/screens/LoginScreen.tsx` — rewrote as two-tab Phone/Email
    with the same UX as the web
- **Playwright e2e tests** (`e2e/`)
  - `phone-otp-login.spec.ts` — tab defaults, error paths, tab switching
  - `feedback-widget.spec.ts` — modal open, categories, submit gating
  - `i18n-language-switcher.spec.ts` — html lang/dir per language, RTL for ar,
    localStorage persistence
  - `seo-meta.spec.ts` — canonical, hreflang, OG, JSON-LD, robots.txt,
    sitemap.xml, llms.txt

### 2026-08-01 (session 2 — i18n + SEO + AEO)

- **Tri-language infrastructure** — react-i18next + i18next-browser-languagedetector,
  `i18n/config.ts` with detection order (URL param → localStorage → nav → default `bn`)
- **Translation files** — `locales/{bn,en,ar}/common.json` (brand, nav, auth,
  feedback, common; ~85 keys each, tested with a full Arabic RTL pass)
- **`useI18nSideEffects` hook** — live-syncs `<html lang>` + `<html dir>` +
  body classes to the active language; SSR-safe
- **`<LanguageSwitcher />`** — accessible dropdown (aria-haspopup/expanded,
  Escape/outside-click to close). Mounted in Sidebar AND marketing top nav.
- **Sidebar + FeedbackWidget + marketing nav** — fully translated as
  proof-of-concept; every other page can adopt in minutes
- **`<SEO />` component** — title, description, keywords, canonical, hreflang
  alternates for bn/en/ar+x-default, Open Graph, Twitter Card, JSON-LD payload
  slot. Mounted site-wide in App.
- **`StructuredData` factory library** — one function per schema.org type we
  need: Organization/NGO, WebSite (+ SearchAction for sitelinks), BreadcrumbList,
  FAQPage, Article (with `speakable` for voice assistants), JobPosting (Google
  for Jobs eligible), Course, Event.
- **`public/robots.txt`** — permissive to all search + LLM crawlers (GPTBot,
  ClaudeBot, PerplexityBot, Google-Extended). Blocks admin/private routes.
- **`public/sitemap.xml`** — 18 curated public routes with hreflang xhtml:link
  alternates per URL (Google-preferred over Link header)
- **`public/llms.txt`** — new answer-engine convention manifest so ChatGPT,
  Perplexity, Claude know how to cite our content
- **`PROGRESS.md`** — this live tracker replaces stale README/TRACK sections
- **`react-helmet-async`** wired via `<HelmetProvider>` in `index.tsx`

### 2026-08-01 (session 1)

- **M0 Security & Config**
  - Centralized Edge Function URLs (`services/edgeFunctions.ts`) — no more hardcoded Supabase project references
  - Removed 3 hardcoded Supabase URLs from geminiService, moderationService, Home
  - Tightened CSP: blocks direct Gemini calls, removes unused GA, wildcards Supabase
  - Wired Sentry into ErrorBoundary via `componentDidCatch`
  - Expanded `.env.example` with all 6 vars + security warnings
  - Fixed `tsconfig.json` types: added `vite/client`, `vite-plugin-pwa/client`
- **M1 Backend Verified**
  - 33 tables with RLS enabled on every table
  - Supabase client wired end-to-end, dataService reads/writes real tables
  - Edge functions intact (`gemini-proxy`, `content-moderation`)
- **M5 Auth Hardening**
  - `ProtectedRoute` now uses reactive `useAuthStore` (was stale module-level)
  - Shows loader while auth resolves; preserves intended destination on redirect
  - Honors `banned` flag, accepts Role[] arrays, ADMIN = super-user
- **Brand Consistency Sweep** (60+ off-brand color usages eliminated)
  - Added `brand-*` palette (10 shades anchored on bd-green) in Tailwind config
  - Rebranded Admin, Institution, Scholar, User dashboards
  - Community blood-bank section: red → bd-green (health service ≠ danger)
  - Rebranded auth pages, Leaderboard, Forbidden, ERPPreview, AudioLibrary
  - Fixed CitationBadge, CitationPicker, SyncStatus
  - Updated Badge component tests to match new palette
- **Phone / SMS OTP Auth**
  - `services/authService.ts`: `normalizeBdPhone`, `sendPhoneOtp`, `verifyPhoneOtp`
  - `pages/Login.tsx`: two-tab UI (Phone OTP / Email), two-step OTP flow
  - Auto-creates `user_profiles` row on first phone login
- **Community Feedback Loop**
  - `components/FeedbackWidget.tsx`: floating button on every logged-in page
  - `services/feedbackService.ts`: writes to `public.feedback` (anon allowed)
  - Modal with category picker, message, optional contact
- **Bengali Legal Pages** (drafts, need lawyer review)
  - `/terms` — Terms of Service
  - `/privacy` — Privacy Policy
- **DB Migration** — `database/migrations/2026_08_01_feedback_and_phone.sql`
  - `feedback` table + full RLS
  - Unique index on `user_profiles.phone`
  - Trigger `handle_new_auth_user` auto-creates profile rows
  - Fully idempotent
- **Docs**
  - `NEXT_STEPS.md` founder handbook
  - This `PROGRESS.md` tracker (new)
- **Ship**
  - 5 clean commits pushed to `origin/main` on GitHub

---

## 🟡 In Progress

- **Tri-language support** (bn / en / ar)
- **SEO / AEO** (per-page meta, sitemap, structured data)
- **PROGRESS.md** live tracker (this file)

---

## ⚪ Backlog (prioritized)

### Sprint 1 (this week — after i18n + SEO land)

- [ ] Admin **Feedback Triage panel** — read `feedback` table, mark resolved
- [ ] Update `README.md` + `TRACK.md` to point at `PROGRESS.md`
- [ ] Playwright e2e for phone-OTP login + feedback submission

### Sprint 2 (week 2)

- [ ] **Web Push notifications** (Service Worker + Notification API + push_subscription table)
- [ ] Fix pre-existing type errors in mobile/, dataService.ts, older test files
- [ ] Sentry + PostHog DSNs set in Vercel env vars

### Sprint 3 (week 3-4)

- [ ] **bKash donation flow** — Edge Function webhook + donations table + reconciliation UI
- [ ] Nagad + Rocket integrations
- [ ] Diaspora payments (Stripe)
- [ ] Donor receipts (email + PDF)

### Sprint 4 (month 2)

- [ ] **Mobile app real screens** (Home, Fatwa, Login-OTP, Notifications)
- [ ] Push notifications via Expo
- [ ] APK distribution
- [ ] iOS TestFlight

### Sprint 5 (month 2-3)

- [ ] SMS notification blasts (for scholars: new fatwa; for donors: monthly summary)
- [ ] Content authenticity gamification (M6): scholar review workflow, citation gating
- [ ] Referral program with CP rewards

### Sprint 6 (month 3+)

- [ ] Multi-org support (federate other madrasa networks)
- [ ] API for institutions to auto-post jobs from their own systems
- [ ] Advanced analytics dashboard (funnel, cohorts)

---

## 🔴 Blocked (need founder action)

| Item | Blocker | Owner |
|---|---|---|
| Real production deploy | Supabase console: enable Phone Auth, run migration, set Vercel env vars | **Founder** — see `NEXT_STEPS.md` |
| bKash / Nagad integration | Merchant account application (2-week gov paperwork) | **Founder** |
| Live SMS delivery | SMS provider signup (Twilio → later SSL Wireless) | **Founder** |
| Legal launch | Lawyer review of `pages/TermsOfService.tsx` + `pages/PrivacyPolicy.tsx` | **Founder** |
| Content authenticity | Recruit 5 verified scholars (2 Qawmi, 2 Alia, 1 female) | **Founder** |
| Domain | Buy `madrasaconnectbd.com` or `.org.bd` | **Founder** |

---

## 🌍 Internationalization Plan

**Requirement:** 3 languages, easy for a translator to add more.

| Language | Direction | Default? | Notes |
|---|---|---|---|
| বাংলা (bn) | LTR | ✅ Yes | Native audience, primary market |
| English (en) | LTR | — | Diaspora + institutional partners + SEO |
| العربية (ar) | **RTL** | — | Religious credibility, GCC donors |

**Architecture:**
- Library: **react-i18next** (industry standard, tiny, SSR-friendly).
- Files: `locales/{bn,en,ar}/{common,auth,dashboard,fatwa,jobs,legal}.json`.
- Detection order: URL param `?lang=ar` → localStorage → `<html lang>` → default `bn`.
- `<html lang>` and `<html dir>` swap live via a `useI18nSideEffects()` hook.
- Manifest generated per-locale so PWA install prompt is localized too.

---

## 📈 SEO / AEO Plan

**Goal:** rank on Google + Bing + Baidu for "মাদ্রাসা চাকরি", "ফতোয়া অনলাইন", "কওমি মাদ্রাসা তালিকা", etc., AND get cited by ChatGPT / Perplexity / Gemini for religious Q&A.

### On-page SEO
- `react-helmet-async` for per-page `<title>`, `<meta description>`, `<meta keywords>`, canonical
- Open Graph tags (`og:title`, `og:description`, `og:image`, `og:locale`, `og:type`)
- Twitter Card meta
- **`hreflang` links** for bn/en/ar alternates on every page
- Semantic HTML: `<article>`, `<section>`, `<nav>`, `<main>`, proper heading hierarchy
- Alt text on every image (many missing today — sweep needed)

### Structured Data (JSON-LD)
- `Organization` on Home + About (name, logo, sameAs socials, contactPoint)
- `WebSite` with `SearchAction` (enables Google sitelinks search box)
- `JobPosting` per job (Google for Jobs eligible → massive traffic)
- `FAQPage` on FAQ + Fatwa Archive (rich snippets)
- `Article` per fatwa (with `author`, `datePublished`, `about`)
- `BreadcrumbList` on all deep pages
- `Course` on Deen101 + KnowledgeHub modules
- `Event` on EventsHub
- `HowTo` on InstructionalHelp

### AEO (Answer Engine Optimization)
- **`speakable` schema** on fatwas so Google Assistant + Alexa can read answers aloud
- Concise, direct answers in the first 40 words of each fatwa (LLM extraction favors this)
- Q-and-A markup on Community posts
- `llms.txt` at site root (emerging Anthropic/OpenAI convention)

### Infrastructure
- `robots.txt` — allow all crawlers, point to sitemap
- `sitemap.xml` — auto-generated from routes + DB (jobs, fatwas, institutions)
- `manifest.webmanifest` per locale
- Prerender critical routes (`/`, `/fatwa/archive`, `/professional`, `/institutions`) via `vite-plugin-prerender-spa` or SSR
- Fast Core Web Vitals: LCP < 2.5s, CLS < 0.1, INP < 200ms (already good via Vite + PWA)

### Monitoring
- Google Search Console + Bing Webmaster Tools
- Weekly ranking check on 20 target keywords
- PostHog event: `search_engine_referrer` breakdown

---

## 📊 KPIs to Track After Launch

| Metric | Target (M6) | Source |
|---|---|---|
| Verified users | 10,000 | Supabase `user_profiles` |
| Verified institutions | 500 | Supabase `institutions.verified` |
| Verified scholars | 100 | Supabase `scholars.verified` |
| Monthly job applications | 2,000 | Supabase `job_applications` |
| Median fatwa answer time | < 48h | Query on `fatwa_answers` |
| Feedback response time | < 24h | Query on `feedback.status` |
| Monthly active users | 5,000 | PostHog DAU/MAU |
| Google organic sessions | > 15,000/mo | Search Console |
| Total monthly donations | ৳ 100,000 | `donations` table |
| Platform uptime | > 99.5% | Better Uptime |
| Content authenticity score | > 95% | Human audit sample |
| Error rate | < 0.5% | Sentry |

---

<!-- KEEP THIS SECTION AT THE BOTTOM; do NOT delete -->
## 🛠 How to update this file

When you finish work:
1. Move item from `In Progress` → `Completed` (with today's date).
2. Update the Executive Status table if a track's status changed.
3. Add a bullet under today's date in the chronological log.
4. Commit alongside the code with message like `docs: PROGRESS — mark X complete`.

When you start work:
1. Move item from `Backlog` → `In Progress`.
2. Add yourself as owner if multiple people.

### 2026-08-03 (session 19 — USER-role Update/Delete CRUD + form submission tests)

**Theme**: Completed remaining USER-role CRUD operations and added test coverage for all new dataService methods

- **dataService.ts** — Added 6 new methods
  - `updateComment` — edits own comment via `forum_comments` table with `author_id` ownership check
  - `deleteComment` — deletes own comment with auth RLS enforcement
  - `updateFatwa` — edits own fatwa question/category with `asked_by` ownership check
  - `deleteFatwa` — deletes own fatwa with auth RLS enforcement
  - `withdrawJobApplication` — withdraws from a job application with auth check
  - `updateDonorProfile` — updates blood donor profile (blood_group, location, district, phone, public_profile) with camelCase → snake_case mapping

- **database/migrations/2026_08_03_user_crud_policies.sql** — New migration
  - UPDATE/DELETE RLS policies for `forum_posts`, `forum_comments`, `fatwas`, `job_applications`, `blood_donors`, `user_skills`
  - `updated_at` triggers added to all tables for audit trail
  - `forum_comments.id` default fixed: was text PK with no default → `uuid_generate_v4()::text` so INSERTs succeed
  - `forum_comments.author_id` column added (was missing entirely, causing FK failures)

- **pages/Community.tsx** — Wired up UI
  - Edit/delete buttons on own comments in PostCard (inline edit form)
  - Edit/delete handlers wired to `dataService.updateComment` / `dataService.deleteComment`

- **pages/FatwaCenter.tsx** — Wired up UI
  - Delete button on own fatwa cards (only when status is PENDING)
  - Delete handler wired to `dataService.deleteFatwa`
  - JSX syntax error fixed (extra `</div>` at line 197 removed)

- **pages/ProfessionalHub.tsx** — Wired up UI
  - "Withdraw Application" button shows when user has applied for a job
  - Applied-state tracking via `dataService.withdrawJobApplication`

- **src/test/__tests__/dataServiceCrud.test.ts** — New test file (12 tests)
  - All 6 methods tested: happy path (correct Supabase params + auth check)
  - All 6 methods tested: unauthenticated user gets 'Must be logged in' error
  - Total: 248 tests passing (236 original + 12 new)

- **types.ts** — Added `authorId?: string` to `ForumComment` interface; updated `getComments` mapping to extract `author_id`

- **Impact**: USERS can now update and delete their own content (comments, fatwas, job applications, donor profile) with proper RLS enforcement on the database side

### 2026-08-03 (session 20 — Complete partial CRUD UI + ProfileBuilder refactor)

**Theme**: Completed the 4 partial CRUD issues + ProfileBuilder dataService refactor; 255 tests passing

- **dataService.ts** — Hardened existing methods
  - `updatePost`: Added auth check (`Must be logged in to edit`) + `author_id` ownership filter via `.eq('author_id', user.id)`
  - `deletePost`: Added auth check (`Must be logged in`) + `author_id` ownership filter
  - Added `getMyProfile()`: Fetches `user_profiles` row for current user, returns null if not logged in
  - Added `saveMyProfile()`: Updates `user_profiles` with `updated_at` timestamp + auth check

- **pages/Community.tsx** — Completed donor profile edit
  - Added `showDonorEdit`, `donorProfile` state
  - `checkIfDonor` now stores the full donor profile for pre-populating edit form
  - Button changes from "আপনি দাতা" (info only) to "প্রোফাইল এডিট" (opens edit modal)
  - New donor edit modal with blood group, location, district, phone fields
  - `handleDonorEdit` calls `dataService.updateDonorProfile` with snake_case mapping
  - Edit form pre-populates with existing values

- **pages/FatwaCenter.tsx** — Completed fatwa edit UI
  - Added `editingFatwaId`, `editQuestion`, `editCategory`, `savingFatwa` state
  - Added edit button (Edit3 icon) next to delete button on own pending fatwas
  - Inline edit form: textarea for question + select for category + save/cancel buttons
  - `handleSaveFatwaEdit` calls `dataService.updateFatwa` with auth + ownership check

- **pages/ProfileBuilder.tsx** — Removed direct Supabase calls
  - Replaced `import { supabase }` with `import { dataService }`
  - `loadProfile`: Now uses `dataService.getMyProfile()` instead of direct `supabase.from('user_profiles').select().single()`
  - `handleSave`: Now uses `dataService.saveMyProfile()` instead of `supabase.from('user_profiles').update().eq()`

- **src/test/__tests__/dataServiceCrud.test.ts** — Added 7 more tests
  - `updatePost`: ownership check + auth gate
  - `deletePost`: ownership check + auth gate
  - `getMyProfile`: returns null when unauthenticated
  - `saveMyProfile`: updated_at timestamp + auth gate
  - Total: 255 tests passing (248 + 7 new)

### 2026-08-03 (session 21 — Fix blank page on missing env vars)

**Theme**: Prevent total app crash when Supabase env vars are not configured

- **services/supabase.ts** — Replaced `createClient(supabaseUrl, supabaseAnonKey)` (which throws `supabaseKey is required` and crashes the app at module load) with placeholder fallback values so the React UI renders and calls fail gracefully with auth errors instead of a blank white screen
  - Pushed commits `fd79a37` (empty deploy trigger) and `473ee45` (fix) to `origin/main`
  - Total: 255 tests passing, build succeeds

### 2026-08-03 (session 22 — Fix blank site + email validation)

**Theme**: Diagnose live site blank page and registration failure

- **Root cause found**: Env vars in Vercel were working (POST requests reached Supabase at `nkdtlussmrovzjxmquup.supabase.co`), but `.test` TLD emails are rejected by Supabase with `400 Email address is invalid`
- **services/supabase.ts** — Placeholder fallback values prevent blank screen on missing env vars (app renders, calls fail gracefully)
- **pages/RegisterUser.tsx** — Added client-side validation to reject reserved TLDs (`.test`, `.example`, `.invalid`) with helpful Bengali message "একটি বাস্তব ইমেইল (যেমন Gmail) ব্যবহার করুন।" before sending to Supabase
- Pushed commit `5412867` to `origin/main`
- Total: 255 tests passing

When you get blocked:
1. Move to `Blocked` with the reason and who owns unblocking.
