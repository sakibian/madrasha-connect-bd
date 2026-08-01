<!--
  PROGRESS.md — single source of truth for engineering work on Madrasa Connect BD.
  Update whenever a task starts, completes, or blocks. This file must be kept
  ACCURATE — it replaces stale sections of README/TRACK.
  Format:
    ✅ DONE   |  🟡 DOING   |  ⚪ TODO   |  🔴 BLOCKED
-->

# Madrasa Connect BD — Live Progress Tracker

> **Purpose:** one file, always up to date, so the founder always knows exactly
> what's shipped, what's in flight, and what's still to build. Every commit
> should either update this file or reference it.
> **Owner:** Engineering | **Founder-visible:** YES.

**Last updated:** 2026-08-01 18:45 UTC · **Latest deploy:** pending push after i18n/SEO batch

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
| Payment integration (bKash) | 🔴 BLOCKED on merchant account | week 4 |
| Admin feedback triage UI | ⚪ TODO | week 1 |
| Mobile app (Expo real screens) | ⚪ TODO | month 2 |
| Real deployment (Supabase + Vercel env vars) | 🔴 BLOCKED on founder | THIS WEEK |
| Scholar onboarding (5 real ones) | 🔴 BLOCKED on founder | THIS MONTH |

---

## ✅ Completed (chronological)

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

When you get blocked:
1. Move to `Blocked` with the reason and who owns unblocking.
