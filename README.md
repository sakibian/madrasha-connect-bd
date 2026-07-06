<div align="center">
<img width="1200" height="200" alt="Madrasa Connect BD Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

<h1 align="center">মাদ্রাসা কানেক্ট — বাংলাদেশ</h1>
<h3 align="center">Connecting Bangladesh's Madrasa Community Through Technology</h3>

<p align="center">
  <a href="./PRD.md"><strong>📋 Product Requirements</strong></a> ·
  <a href="./TRACK.md"><strong>📊 Progress Tracker</strong></a> ·
  <a href="./Docs/"><strong>📚 Technical Docs</strong></a> ·
  <a href="./FUTURE_README_MODEL_PLAN.md"><strong>🔮 Future Vision</strong></a>
</p>

---

## 🎯 Our Mission

A digital ecosystem for Bangladesh's madrasa community — connecting **students, teachers, scholars, and institutions** through a trusted platform for jobs, education, Islamic guidance, and community.

**For the 10,000+ madrasas and 10M+ students across Bangladesh.**

---

## 📊 Where We Are Today

| Dimension | Status | Details |
|-----------|--------|---------|
| **Frontend UI** | 🟢 90% Complete | 30+ pages, Bengali-first, AI integration |
| **Backend** | 🔴 0% Complete | Currently runs in browser (localStorage only) |
| **Security** | 🔴 Critical Fixes Needed | API keys exposed, no real auth |
| **Testing** | 🔴 0% | No tests yet |
| **Production Readiness** | 🟡 ~30% | Great prototype, needs backend + hardening |

### What's Working ✅
- Full Bengali UI for all pages
- Job board with search & filter
- Institution directory
- Fatwa Q&A with AI assistance
- Educational content (Deen-101, Seerah Timeline)
- Marketplace, Audio Library, Tools
- Role-based dashboards (Admin, Institution, User)
- Gemini AI integration (moderation, search, content)

### What's Missing 🔴
- **No backend server** — all data lost when browser clears
- **No real authentication** — anyone can log in as admin
- **Exposed API keys** — security & cost risk
- **No tests** — every change risks breaking things
- **3 built pages not linked** (Community, Events, Sadaqah)

---

## 🗺️ Our Path to Launch: 12 Modules

We've broken the entire journey into **12 engineering modules** — each with clear tasks, dependencies, and acceptance criteria. Full details in [TRACK.md](./TRACK.md).

| Module | What | Effort | For Whom |
|--------|------|--------|----------|
| **M0** 🔒 Foundation & Security | Fix critical holes, switch to real URLs, add error handling | 2-3 days | Users + Team |
| **M1** 🗄️ Backend (Supabase) | Database, auth, storage, serverless functions | 2-3 weeks | Everyone |
| **M2** 🔄 Data Migration | Move from localStorage to real database | 1 week | Users |
| **M3** 🧩 Component Library | Build reusable UI pieces, consistent design | 2 weeks | Team + Users |
| **M4** ⚡ State Management | Replace fragile event system with proper state | 1 week | Team |
| **M5** 🔐 Auth & Roles | Real login, registration, role-based access | 1.5 weeks | Users |
| **M6** 📖 Authentic Knowledge | Source citations, scholar review, moderation pipeline | 2-3 weeks | Trust |
| **M7** ✅ Testing | Tests for critical paths | 2 weeks | Quality |
| **M8** ⚡ Performance & A11y | Fast on 3G, works for everyone | 1 week | Users |
| **M9** 📄 Orphan Pages | Route 3 built-but-hidden pages | 2-3 days | Users |
| **M10** 👥 Community | Forum, badges, profiles, referrals | 2 weeks | Growth |
| **M11** 📱 Mobile App | React Native for Android/iOS | 4-6 weeks | Reach |
| **M12** 🚀 Launch & Scale | Security audit, monitoring, load testing | Ongoing | Sustainability |

> **Estimated MVP launch:** 8-10 weeks from start (M0-M2 + M5 = shippable product for real users)

---

## 📋 Key Documents

| Document | What It Contains | Who Should Read |
|----------|-----------------|-----------------|
| [PRD.md](./PRD.md) | Complete product requirements — features, user stories, success metrics | Everyone |
| [TRACK.md](./TRACK.md) | Engineering module tracker with tasks, status, dependencies | Engineering team |
| [FUTURE_README_MODEL_PLAN.md](./FUTURE_README_MODEL_PLAN.md) | Long-term vision (multi-platform, foundation, global) | Stakeholders |
| [Docs/ARCHITECTURE_REVIEW.md](./Docs/ARCHITECTURE_REVIEW.md) | Current architecture analysis | Engineers |
| [Docs/SECURITY_AUDIT_REPORT.md](./Docs/SECURITY_AUDIT_REPORT.md) | Security vulnerabilities & fixes | All |
| [Docs/component-library-blueprint.md](./Docs/component-library-blueprint.md) | Design system & component plan | Frontend engineers |
| [Docs/zustand-migration-guide.md](./Docs/zustand-migration-guide.md) | State management plan | Frontend engineers |

---

## 🏗️ Architecture (Target)

```
Frontend (React + Vite)
    ↕ HTTPS / WebSocket
Supabase (PostgreSQL + Auth + Storage + Edge Functions + Realtime)
    ↕ 
Gemini AI (content moderation, search, suggestions via Edge Functions)
```

**No custom backend to maintain.** Supabase handles auth, database, storage, and serverless. We focus on the frontend experience.

---

## 🎯 Success Looks Like

| Metric | 6-Month Target |
|--------|---------------|
| Registered Users | 10,000 |
| Active Institutions | 500 |
| Monthly Job Applications | 2,000 |
| Fatwa Answer Time | < 48 hours |
| Course Completion Rate | > 60% |
| Monthly Active Users | 5,000 |
| Platform Uptime | > 99.5% |
| Content Authenticity Score | > 95% |

---

## 🤝 For the Non-Profit Owner

**This is not just a tech project — it's a community trust.** Here's what matters most:

1. **Authenticity is our brand.** Every fatwa, course, and article must trace back to authentic sources. The [Knowledge Base module (M6)](./TRACK.md#m6-authentic-knowledge-base) is our moat.

2. **Launch fast, but launch right.** The fastest path to real-world impact is **Phase 1 (M0-M2)** — get a backend, real auth, and ship the job board + fatwa portal. That alone changes lives.

3. **Costs are minimal.** Supabase free tier + Vercel free tier = $0/mo to start. Premium features (job listings, certifications) can cover costs once we have scale.

4. **We need scholars.** The single biggest risk is content authenticity. Finding 5-10 verified scholars to review fatwas and content is more important than any feature.

5. **Mobile-first.** 80%+ of our users will access via smartphone on 3G. Every decision must optimize for that reality.

---

## 🚀 Quick Start for Developers

```bash
npm install
npm run dev
```

Development server runs on `http://localhost:3000`. See [PRD.md](./PRD.md) for product context, [TRACK.md](./TRACK.md) for what to work on next.

---

<div align="center">
  <p><strong>For the community, by the community.</strong></p>
  <p>মাদ্রাসা কানেক্ট বাংলাদেশ — Authentic Islamic Education, Modern Technology</p>
</div>
