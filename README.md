<div align="center">
<img width="1200" height="200" alt="Madrasa Connect BD Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<h1 align="center">মাদ্রাসা কানেক্ট — বাংলাদেশ</h1>
<h3 align="center">Connecting Bangladesh's Madrasa Community Through Technology</h3>

<p align="center">
  <a href="./PROGRESS.md"><strong>📊 Live Progress</strong></a> ·
  <a href="./NEXT_STEPS.md"><strong>🚀 Founder Handbook</strong></a> ·
  <a href="./PRD.md"><strong>📋 Product Requirements</strong></a> ·
  <a href="./TRACK.md"><strong>🧭 Module Deep-Dive</strong></a>
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
| **Backend** (Supabase: 33 tables + RLS + Edge Functions) | ✅ Wired |
| **Auth** (Email + Phone/SMS OTP with BD phone normalization) | ✅ Complete |
| **State management** (9 Zustand stores) | ✅ Complete |
| **Testing** (142 unit tests passing, e2e coming) | 🟡 In progress |
| **i18n** (Bengali / English / Arabic + RTL) | ✅ Infrastructure done, per-page rollout ongoing |
| **SEO + AEO** (Helmet, hreflang, JSON-LD, sitemap, robots, llms.txt) | ✅ Infrastructure done, per-page rollout ongoing |
| **Community feedback loop** (floating widget, DB-backed) | ✅ Complete |
| **Legal** (Bengali ToS + Privacy drafts, need lawyer review) | 🟡 Draft |
| **Notifications** (in-app + Supabase Realtime) | ✅ Done · Web Push TODO |
| **Payments** (bKash / Nagad donation flow) | 🔴 Blocked on merchant account |
| **Mobile app** (Expo shell scaffolded, screens TODO) | ⚪ Backlog |
| **Production Readiness** | ~**65%** — see PROGRESS.md for exact breakdown |

**MVP soft-launch estimate:** ~2-3 weeks (blocked on founder actions in [`NEXT_STEPS.md`](./NEXT_STEPS.md), not code).

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
npm test                 # unit tests (Vitest — 142 tests, all passing)
npm run test:coverage    # coverage report
npm run build            # production build
npm run preview          # preview the production build
npx playwright test      # e2e tests
```

---

## 📋 Key Documents

| Document | What It Contains | Who Should Read |
|----------|-----------------|-----------------|
| [PROGRESS.md](./PROGRESS.md) | **Live status of every track** — done / doing / blocked | Everyone |
| [NEXT_STEPS.md](./NEXT_STEPS.md) | **Founder handbook** — what to do outside the code | Founder |
| [PRD.md](./PRD.md) | Complete product requirements — features, personas, KPIs | Everyone |
| [TRACK.md](./TRACK.md) | Detailed 12-module engineering deep-dive | Engineers |
| [CREDENTIALS.md](./CREDENTIALS.md) | External services, env vars, and setup steps | Ops |
| [database/schema.sql](./database/schema.sql) | Master schema (33 tables + RLS) | Backend |
| [database/migrations/](./database/migrations/) | Incremental migrations | Backend |

---

## 🤝 For the Founder

**This is not just a tech project — it's a community trust.** Here's what matters most, in priority order:

1. **Do the 4 CRITICAL tasks in [`NEXT_STEPS.md`](./NEXT_STEPS.md)** — 2 hours of your work unlocks a real deploy: run the DB migration, enable Phone Auth, set Vercel env vars, deploy Edge Functions.

2. **Recruit 5-10 verified scholars** — the entire "authenticity" moat depends on this. Aim for 2 Qawmi, 2 Alia, 1 female scholar. Everything else is noise if we don't have this.

3. **Open the bKash merchant account** — 2 weeks of paperwork. Start today so it's ready when the donation flow ships.

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
