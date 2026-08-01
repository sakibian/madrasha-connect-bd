<div align="center">
<img width="1200" height="200" alt="Madrasa Connect BD Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<h1 align="center">মাদ্রাসা কানেক্ট — বাংলাদেশ</h1>
<h3 align="center">Connecting Bangladesh's Madrasa Community Through Technology</h3>

<p align="center">
  <a href="./PROGRESS.md"><strong>📊 Live Progress</strong></a> ·
  <a href="./PLAN.md"><strong>📐 M14 Content Roadmap</strong></a> ·
  <a href="./TODO.md"><strong>✅ Execution List</strong></a> ·
  <a href="./NEXT_STEPS.md"><strong>🚀 Founder Handbook</strong></a> ·
  <a href="./PRD.md"><strong>📋 PRD</strong></a> ·
  <a href="./TRACK.md"><strong>🧭 Module Deep-Dive</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tests-236%20passing-brightgreen" alt="tests" />
  <img src="https://img.shields.io/badge/e2e-8%20specs-brightgreen" alt="e2e" />
  <img src="https://img.shields.io/badge/mobile-first-orange" alt="mobile-first" />
  <img src="https://img.shields.io/badge/PWA-installable-blue" alt="PWA" />
  <img src="https://img.shields.io/badge/design-tokenized-green" alt="design tokens" />
  <img src="https://img.shields.io/badge/toasts-Sonner-black" alt="Sonner" />
  <img src="https://img.shields.io/badge/i18n-bn%20%C2%B7%20en%20%C2%B7%20ar-blue" alt="i18n" />
  <img src="https://img.shields.io/badge/backend-Supabase%20%2B%20RLS-blue" alt="backend" />
  <img src="https://img.shields.io/badge/mobile-Expo%20SDK-purple" alt="mobile" />
</p>

---

## 🎯 Mission

A **non-profit digital ecosystem** for Bangladesh's madrasa community — connecting **students, teachers, scholars, and institutions** through a trusted platform for jobs, education, verified Islamic guidance, and community.

**For the 10,000+ madrasas and 10M+ students across Bangladesh.**

---

## 📊 Current State (2026-08-01)

> **Truth in reporting**: this section is refreshed every time the codebase changes.
> Full detail lives in [`PROGRESS.md`](./PROGRESS.md).

| Dimension | Status |
|-----------|--------|
| **Frontend UI** (30+ pages, Bengali-first) | ✅ Complete |
| **Design system** (brand-consistent, zero off-brand colours) | ✅ Complete |
| **Backend** (Supabase: 33 tables + RLS + Edge Functions) | ✅ Complete |
| **Auth** (Email + Phone/SMS OTP with BD phone normalization) | ✅ Complete (web + mobile) |
| **State management** (9 Zustand stores) | ✅ Complete |
| **Testing** (220 unit tests + 8 Playwright e2e specs) | ✅ Complete |
| **Notification UX** (Sonner toasts + Radix notification centre + permission primer) | ✅ Complete (M18) |
| **Public LanguageSwitcher in Header + IP-geo auto-detect** (dev override `?geo=XX`) | ✅ Complete (M20) |
| **Password show/hide toggle** (all auth forms) + **local `boring-avatars`** (no more DiceBear API) | ✅ Complete (M21) |
| **Manual test playbook** (role-based `docs/MANUAL_TESTING.md` + `docs/QA_CHECKLIST.md`) | ✅ Complete (M19) |
| **Mobile-first UX** (BottomNav + responsive layout + 16 px base + touch-friendly modals) | ✅ Complete (M15) |
| **Unified color system** (`danger-*` / `warning-*` / `info-*` tokens + `<StatusBadge>`) | ✅ Complete (M16) |
| **PWA** (manifest + service worker + install prompt + Web Push scaffold) | ✅ Complete (M17) |
| **Real Islamic content APIs** (Quran / Hadith / Prayer / Hijri via Edge proxies + cache) | ✅ Complete (M14.1) |
| **Qawmi Education System explainer** (`/qawmi-system`, cited data) | ✅ Complete (M14.2) |
| **Seerah dataset** (26 events w/ Quran.com + Sunnah.com citations) | ✅ Data shipped · page rewire pending (M14.3) |
| **Institutions bootstrap** (BMEB/Befaq/IFB/Banbeis importer) | 🟡 Scaffold + dedup ready · real fetchers pending (M14.4) |
| **Deen-101 curriculum** (30-day journey, every lesson sourced) | ✅ Data shipped · page rewire pending (M14.5) |
| **Partnerships registry** (12 BD Islamic apps/NGOs for outreach) | ✅ Complete |
| **Gender-aware avatars** (bn/en/ar name inference) | ✅ Complete |
| **i18n** (Bengali / English / Arabic + RTL) | ✅ Infrastructure complete, core pages translated |
| **SEO + AEO** (Helmet, hreflang, JSON-LD, sitemap, robots, llms.txt) | ✅ Complete infrastructure, per-page rollout ready |
| **Community feedback loop** (floating widget → admin triage) | ✅ Complete end-to-end |
| **Admin panels** (feedback triage, user management, moderation) | ✅ Complete |
| **Legal** (Bengali ToS + Privacy drafts, need lawyer review) | 🟡 Drafted |
| **Notifications** (in-app + Supabase Realtime) | ✅ Complete · Web Push TODO |
| **Payments** (bKash donation flow, dry-run safe) | ✅ Code complete · 🔴 Blocked on merchant account |
| **Mobile app** (Phone/OTP login + core screens) | ✅ Phone/OTP done · other screens TODO |
| **Production Readiness** | ~**39%** — see PROGRESS.md for exact breakdown |

**MVP soft-launch estimate:** ~1 week (blocked on founder actions in [`NEXT_STEPS.md`](./NEXT_STEPS.md), not code).

---

## 🏗️ Architecture

```
                ┌─────────────────────────────────────────────┐
Vite / React 19 │  Frontend  (bn/en/ar · PWA · React Router)  │
                └────────────────────┬────────────────────────┘
                                     │
                                     │ HTTPS / WebSocket
                                     ▼
                ┌─────────────────────────────────────────────┐
     Supabase   │  Postgres + Auth + Storage + Realtime + RLS │
                └─────────────────────┬───────────────────────┘
                                      │
                                      │ Edge Functions (Deno)
                                      ▼
                ┌─────────────────────────────────────────────┐
    Google AI   │  Gemini 2.5 Flash — moderation + Q&A + search │
                └─────────────────────────────────────────────┘
```

**Zero custom backend to maintain.** Supabase handles database, auth, storage,
realtime, and serverless. We focus on the frontend experience and content.

**Cost profile (starting):** $0/month on free tiers of Supabase + Vercel + Sentry + PostHog. Premium features (job listings, certifications) can eventually cover costs at scale.

---

## 🌍 Tri-Language + SEO/AEO

- 🇧🇩 **বাংলা** (default, LTR) — home audience
- 🇬🇧 **English** (LTR) — diaspora + institutional partners + SEO reach
- 🇸🇦 **العربية** (RTL) — religious credibility + GCC donor reach

Every page ships with:
- Automatic `<html lang>` + `<html dir>` swap on language change
- `hreflang` alternates in `<link>` tags for Google
- Full Open Graph + Twitter Card metadata
- JSON-LD structured data (Organization, WebSite, BreadcrumbList, FAQPage, Article, JobPosting, Course, Event) — with `speakable` markup so voice assistants can read fatwas aloud
- Registered with GPTBot / ClaudeBot / PerplexityBot / Google-Extended via `llms.txt` + `robots.txt` so we appear in AI answers

Adding a 4th language later requires only three file edits — see [`i18n/config.ts`](./i18n/config.ts) for the pattern.

---

## 🚀 Quick Start (Developers)

```bash
git clone https://github.com/sakibian/madrasha-connect-bd.git
cd madrasha-connect-bd
cp .env.example .env.local   # then fill in your Supabase URL + anon key
npm install
npm run dev                  # http://localhost:3000
```

**Commands:**
```bash
npm run dev              # dev server on :3000
npm test                 # unit tests (Vitest — 236 tests, all passing)
npm run test:coverage    # coverage report
npm run build            # production build
npm run preview          # preview the production build
npx playwright test      # e2e tests (7 specs, covers OTP/feedback/i18n/SEO)

# Mobile development
cd mobile && npx expo start   # React Native dev server
```

---

## 📋 Key Documents

| Document | What It Contains | Who Should Read |
|----------|-----------------|-----------------|
| [PROGRESS.md](./PROGRESS.md) | **Live status of every track** — done / doing / blocked | Everyone |
| [PLAN.md](./PLAN.md) | **M14 real-content roadmap** — sources, milestones, DoD | Everyone |
| [TODO.md](./TODO.md) | **PR-sized execution list** with tick boxes per milestone | Engineers |
| [NEXT_STEPS.md](./NEXT_STEPS.md) | **Founder handbook** — what to do outside the code | Founder |
| [PRD.md](./PRD.md) | Complete product requirements — features, personas, KPIs | Everyone |
| [TRACK.md](./TRACK.md) | Detailed 12-module engineering deep-dive | Engineers |
| [CREDENTIALS.md](./CREDENTIALS.md) | External services, env vars, and setup steps | Ops |
| [docs/CONTENT_SOURCES.md](./docs/CONTENT_SOURCES.md) | Registry of every upstream Islamic content provider + licence | Engineers / Legal |
| [docs/MANUAL_TESTING.md](./docs/MANUAL_TESTING.md) | **Role-based browser test playbook** — Guest, User, Scholar, Institution, Admin | Founder / QA / any tester |
| [docs/QA_CHECKLIST.md](./docs/QA_CHECKLIST.md) | 30-minute pre-release smoke test | Founder / QA / release owner |
| [docs/INCIDENT_RUNBOOK.md](./docs/INCIDENT_RUNBOOK.md) | Incident response + post-mortem template | On-call |
| [docs/DEPLOY_RUNBOOK.md](./docs/DEPLOY_RUNBOOK.md) | **Copy-paste deploy commands** — migrations, edge fns, secrets, vercel | Ops / release owner |
| [docs/ROLLBACK_PROCEDURES.md](./docs/ROLLBACK_PROCEDURES.md) | Deploy rollback steps | On-call |
| [database/schema.sql](./database/schema.sql) | Master schema (33 tables + RLS) | Backend |
| [database/migrations/](./database/migrations/) | Incremental migrations (now including content_cache, seerah_events, curriculum) | Backend |

---

## 🤝 For the Founder

**This is not just a tech project — it's a community trust.** Here's what matters most, in priority order:

1. **Do the 4 CRITICAL tasks in [`NEXT_STEPS.md`](./NEXT_STEPS.md)** — 2 hours of your work unlocks a real deploy: run the DB migration, enable Phone Auth, set Vercel env vars, deploy Edge Functions.

2. **Recruit 5-10 verified scholars** — the entire "authenticity" moat depends on this. Aim for 2 Qawmi, 2 Alia, 1 female scholar. Everything else is noise if we don't have this.

3. **Open the bKash merchant account** — 2 weeks of paperwork. The donation flow is already coded (try it on `/sadaqah` — works in dry-run mode), just needs your merchant keys.

4. **Legal review** of `pages/TermsOfService.tsx` + `pages/PrivacyPolicy.tsx` — the drafts are good-faith placeholders; a Bangladesh-qualified lawyer must bless them before real launch.

5. **Costs are essentially zero to start** — Supabase free tier + Vercel free tier + Sentry/PostHog free tiers = $0/month for the first ~50K MAU.

---

## 📈 Success Targets (6 Months)

| Metric | Target |
|--------|--------|
| Verified users | 10,000 |
| Active institutions | 500 |
| Verified scholars | 100 |
| Monthly job applications | 2,000 |
| Median fatwa answer time | < 48h |
| Monthly active users | 5,000 |
| Google organic sessions | > 15,000/mo |
| Total monthly donations | ৳ 100,000 |
| Platform uptime | > 99.5% |

Full KPI table in [`PROGRESS.md`](./PROGRESS.md#-kpis-to-track-after-launch).

---

<div align="center">
  <p><strong>For the community, by the community.</strong></p>
  <p>মাদ্রাসা কানেক্ট বাংলাদেশ — Authentic Islamic Education, Modern Technology</p>
  <p><sub>আল্লাহ আপনাকে তওফিক দিন — build slowly, ship honestly, listen relentlessly.</sub></p>
</div>
