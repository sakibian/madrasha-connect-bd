# Product Requirements Document: Madrasa Connect BD

> **Status:** Draft v1.0  
> **Last Updated:** July 2026  
> **Owner:** Product Team  
> **Document Purpose:** Define what we build, why, and for whom — single source of truth for all feature decisions.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Target Users & Personas](#3-target-users--personas)
4. [Product Vision & Guiding Principles](#4-product-vision--guiding-principles)
5. [Feature Requirements by Tier](#5-feature-requirements-by-tier)
6. [User Stories by Role](#6-user-stories-by-role)
7. [Authentic Knowledge Base Strategy](#7-authentic-knowledge-base-strategy)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Constraints & Assumptions](#9-constraints--assumptions)
10. [Success Metrics & KPIs](#10-success-metrics--kpis)
11. [Release Criteria](#11-release-criteria)
12. [Glossary](#12-glossary)

---

## 1. Executive Summary

Madrasa Connect BD is a digital ecosystem connecting Bangladesh's madrasa (Islamic seminary) community — students, teachers, scholars, institutions, and job seekers — on a single platform. It replaces fragmented offline processes (word-of-mouth hiring, paper-based fatwa requests, scattered educational resources) with a unified, Bengali-first digital experience.

**Current state:** Frontend MVP with 30+ pages, AI integration (Gemini), Bengali UI. Missing backend infrastructure, real authentication, data persistence, and production hardening.

**Target state:** A production-grade platform with secure backend, real user accounts, authentic knowledge base, and sustainable non-profit operations serving 100K+ monthly users across Bangladesh.

---

## 2. Problem Statement

### Core Problems

| # | Problem | Who Feels It | Current Workaround |
|---|---------|-------------|-------------------|
| P1 | Madrasas can't find qualified teachers/imams nationally | Institution administrators | Word-of-mouth, local mosque networks |
| P2 | Students can't find verified madrasa information | Parents, students | Facebook groups, unreliable directories |
| P3 | No centralized Islamic Q&A with scholarly verification | General public | Asking local imams, unverified online sources |
| P4 | Islamic educational resources are scattered and unverified | Teachers, students | WhatsApp groups, YouTube, uncurated PDFs |
| P5 | No marketplace for Islamic/halal products tailored to BD | General public | Physical markets, Facebook sellers |
| P6 | Madrasa administration has no affordable digital tools | Institution administrators | Paper records, Excel sheets, expensive ERP |

### Why Now

- Bangladesh has **10,000+ registered madrasas** serving **10M+ students**
- Smartphone penetration in BD crossed **55%** in 2025
- No dedicated digital platform serves this community
- Existing generic job/edu platforms don't understand madrasa-specific needs (Qawmi/Alia types, Imam hiring, Islamic calendar)

---

## 3. Target Users & Personas

### Primary Personas

#### 1. Rahim — The Madrasa Graduate Job Seeker
- **Age:** 22-30
- **Location:** Rural/suburban Bangladesh
- **Device:** Budget Android phone, 2GB RAM, slow 3G/4G
- **Tech literacy:** Low-moderate (comfortable with Facebook, basic apps)
- **Goal:** Find an Imam/Teacher position at a reputable madrasa
- **Pain points:** No centralized job board for madrasa roles; relies on word-of-mouth; can't compare opportunities
- **Bengali literacy:** High (reads Bengali comfortably)

#### 2. Farida — The Madrasa Administrator
- **Age:** 35-55
- **Location:** District town
- **Device:** Mid-range Android phone, sometimes a shared computer
- **Tech literacy:** Low (needs simple UI, Bengali-only)
- **Goal:** Post vacancies, manage staff records, find resources
- **Pain points:** Expensive/unavailable ERP; no way to reach national candidate pool; manual record-keeping
- **Bengali literacy:** High (prefers Bengali interface)

#### 3. Yusuf — The Islamic Scholar / Mufti
- **Age:** 40-65
- **Location:** Urban (Dhaka/Chittagong)
- **Device:** Smartphone, sometimes laptop
- **Tech literacy:** Moderate
- **Goal:** Answer fatwa questions, share knowledge, build reputation
- **Pain points:** Time-consuming individual consultations; wants to reach wider audience
- **Bengali literacy:** High (comfortable with Arabic script too)

#### 4. Aisha — The Madrasa Student's Parent
- **Age:** 30-45
- **Location:** Urban/suburban
- **Device:** Smartphone
- **Tech literacy:** Moderate
- **Goal:** Find right madrasa for child, track their progress
- **Pain points:** Hard to verify madrasa quality; no progress tracking
- **Bengali literacy:** High

#### 5. Kabir — The Admin / Non-Profit Operator
- **Age:** 25-40
- **Location:** Dhaka
- **Device:** Laptop + smartphone
- **Tech literacy:** High
- **Goal:** Grow platform, ensure content authenticity, manage community
- **Pain points:** Content moderation burden; ensuring Islamic authenticity; measuring impact for donors
- **Bengali literacy:** Moderate (manages team)

### Secondary Personas

- **Job Poster (Institution):** Needs to post and manage vacancies
- **Marketplace Seller:** Wants to sell Islamic products
- **Donor:** Wants to give zakat/sadaqah through the platform
- **Volunteer Content Reviewer:** Scholars who audit content for authenticity

---

## 4. Product Vision & Guiding Principles

### Vision Statement

> To be Bangladesh's most trusted digital ecosystem for madrasa education — connecting every student, teacher, scholar, and institution to authentic Islamic knowledge and opportunity.

### Mission

- Connect madrasa talent with opportunity through a nationwide job platform
- Provide verified, scholar-reviewed Islamic educational content
- Digitize madrasa administration with affordable tools
- Build a self-sustaining non-profit that serves the community

### Guiding Principles

| Principle | Meaning |
|-----------|---------|
| **Authenticity First** | Every piece of religious content must be traced to authentic sources (Quran, Hadith, verified scholars). No AI-generated fatwa without human review. |
| **Bangladesh-First Design** | Bengali language, Bangladesh madrasa system (Qawmi/Alia/Mosque), local mobile network conditions. |
| **Simplicity Over Features** | Each feature must serve a clear need. If it doesn't solve a top-5 user problem, it doesn't ship. |
| **Privacy & Trust** | User data, especially for religious queries, is sensitive. Encrypt, minimize, never sell. |
| **Sustainable Non-Profit** | Revenue (premium listings, certifications) supports free core services. Never paywall essential features. |
| **Offline-Resilient** | BD has unreliable internet. Core flows must work on slow/offline connections. |

---

## 5. Feature Requirements by Tier

### Tier 1: Foundation (MVP — Must Have for Launch)

| Feature | Priority | Description | Success Criteria |
|---------|----------|-------------|-----------------|
| User Authentication | P0 | Email + phone registration, login, password reset, role-based access (USER, INSTITUTION, ADMIN, SCHOLAR) | 3-role auth flow complete, JWT-based, < 5s registration time |
| Job Board (Career Hub) | P0 | Post, search, filter, apply to madrasa jobs. Admin verification workflow. | 100+ jobs posted in first month, < 24hr verification turnaround |
| Institution Directory | P0 | Searchable directory of madrasas with details (type, location, size, verification status) | 500+ institutions listed at launch |
| Fatwa Q&A Portal | P0 | Submit questions, AI-assisted drafting, scholar review & answer, public archive | < 48hr average answer time, 90% user satisfaction |
| Admin Dashboard | P0 | Content moderation, user management, job/institution verification, analytics | Full CRUD for all content types, basic analytics |
| Login / Registration | P0 | Multi-step registration for users and institutions, Bengali UI | Complete flows, no drop-off > 30% |
| Landing Page | P0 | Public-facing site with mission, features, call-to-action | < 3s load time, clear conversion path |

### Tier 2: Core Experience (High Priority — Ship within 2 Months)

| Feature | Priority | Description | Success Criteria |
|---------|----------|-------------|-----------------|
| Educational Content Hub | P1 | Curated courses (Deen-101, Tajweed, History), structured curriculum, progress tracking | 10+ courses, 70% completion rate for enrolled users |
| Marketplace | P1 | Islamic products (calligraphy, books, modest fashion, sunnah food), admin-managed listings | 50+ products, 500+ monthly visitors |
| Seerah Timeline | P1 | Interactive timeline of Prophet Muhammad's (PBUH) life with sources | 12+ events, all sourced, 10K+ views/month |
| Scholar Directory | P1 | Verified scholar profiles with specializations, location, credentials | 50+ verified scholars |
| Content Moderation Pipeline | P1 | 3-layer moderation (regex → AI → human) for all UGC | < 1% inappropriate content reaching public |
| Notifications | P1 | In-app + email notifications for job applications, fatwa answers, system alerts | < 30s delivery time |
| Search (AI-Powered) | P1 | Semantic search across jobs, institutions, fatwas, courses using Gemini | < 2s response time, relevant results |

### Tier 3: Engagement (Medium Priority — Months 2-4)

| Feature | Priority | Description | Success Criteria |
|---------|----------|-------------|-----------------|
| User Dashboard | P2 | Saved jobs, application tracking, learning progress, bookmark content | 40% of users engage with dashboard weekly |
| Institution Dashboard | P2 | Job posting management, applicant tracking, institution profile management | 80% of institutions use dashboard weekly |
| Community Forum | P2 | Topic-based discussions with scholar moderation | 100+ monthly active posts, < 2hr moderation |
| Sadaqah/Donations | P2 | Donation projects for madrasas, zakat calculator integration, payment gateway | 10+ active projects, BDT 5L+ raised in quarter |
| Events & Calendar | P2 | Islamic calendar (Hijri), event listings, Ramadan features, prayer times | Accurate prayer times, event creation flow |
| Audio Library | P2 | Quran recitations, lectures, nasheeds, categorized and searchable | 50+ audio tracks |
| Competition Listings | P2 | Quran recitation, essay, quiz competitions with registration | 20+ listings, 500+ participants |

### Tier 4: Growth (Nice to Have — 4+ Months)

| Feature | Priority | Description |
|---------|----------|-------------|
| Mobile App (React Native) | P3 | Native Android/iOS experience |
| Advanced ERP Module | P3 | Student records, attendance, fee management, report cards |
| Multi-language Support | P3 | English, Arabic interfaces alongside Bengali |
| API for Third Parties | P3 | Public API for institutions to integrate |
| Advanced Analytics Dashboard | P3 | Donor reports, impact metrics, engagement trends |

---

## 6. User Stories by Role

### As a USER (Student / Job Seeker / General Public)

- [x] I can register with email/phone and create a profile
- [x] I can search and filter jobs by type, location, institution
- [x] I can apply to jobs and track my application status
- [x] I can browse the institution directory and view details
- [x] I can ask a question in the Fatwa center
- [x] I can enroll in courses and track my progress
- [x] I can browse and purchase from the marketplace
- [x] I can save/bookmark content I'm interested in
- [x] I can search across all content types
- [x] I can receive notifications about my activities
- [ ] I can donate to sadaqah projects
- [ ] I can participate in community discussions
- [ ] I can view my learning history and certificates

### As an INSTITUTION (Madrasa / Mosque Administrator)

- [x] I can register my institution with details
- [x] I can post and manage job vacancies
- [x] I can view applicants and manage applications
- [ ] I can update my institution profile
- [ ] I can access basic ERP tools (student records, attendance)
- [ ] I can post sadaqah projects
- [ ] I can view analytics on my listings
- [ ] I can verify my institution (badge)
- [ ] I can manage staff accounts

### As a SCHOLAR (Mufti / Islamic Teacher)

- [ ] I can create a verified scholar profile
- [ ] I can receive and answer fatwa questions
- [ ] I can flag/report inaccurate religious content
- [ ] I can contribute to the knowledge base
- [ ] I can build my following and reputation
- [ ] I can set availability for consultations

### As an ADMIN (Platform Operator)

- [x] I can view all users and manage roles
- [x] I can verify/reject institutions and jobs
- [x] I can moderate fatwa Q&A
- [x] I can manage marketplace listings
- [ ] I can view analytics and export reports
- [ ] I can manage content categories and tags
- [ ] I can review flagged content
- [ ] I can manage scholar verifications
- [ ] I can send system-wide notifications
- [ ] I can audit content authenticity (source tracking)

---

## 7. Authentic Knowledge Base Strategy

This is a **core differentiator** for Madrasa Connect BD. Users trust us because content is authentic.

### Sources of Authenticity

| Source | How It's Used | Verification |
|--------|---------------|--------------|
| **Quran** | Ayat citations in fatwa, courses, articles | Cross-referenced with mushaf, linked to tafsir |
| **Sahih Hadith** (Bukhari, Muslim, etc.) | Fiqh rulings, course content, Seerah | Sourced from verified databases (Sunnah.com API or curated) |
| **Scholarly Consensus (Ijma)** | Fatwa rulings, curriculum design | Reference to 4 major madhabs |
| **Bangladesh Madrasa Board** | Institution verification, curriculum alignment | Manual verification by admin team |
| **Verified Scholars** | Fatwa answers, content review | ID verification + community endorsement |

### Content Moderation Pipeline (3-Layer)

```
User Post → Layer 1: Regex (prohibited keywords)
         → Layer 2: AI (Gemini with Islamic ethics system prompt) 
         → [AUTO-APPROVE if clean]
         → Layer 3: Scholar Review (for religious rulings/fatwa)
```

### Knowledge Base Content Types

| Type | Authenticity Requirement | Review Process |
|------|------------------------|----------------|
| Fatwa Answers | Must cite Quran/Hadith/Scholarly source | Scholar review + source citation required |
| Course Content | Curriculum must map to recognized syllabus | Admin + subject expert review |
| Seerah Timeline | Each event must have a source | Cross-referenced with 2+ sources |
| Articles/Blog | Must not contradict authentic sources | AI review + community flagging |
| Community Posts | General discussion, not religious rulings | AI moderation + admin override |
| Marketplace Items | Products must be halal-appropriate | Category-based approval |

### Sources We Use / Plan to Use

- **Sunnah.com API** — Hadith database
- **Quran.com API** — Quran text & translation
- **Bangladesh Madrasa Education Board** — official curriculum
- **Al-Maktaba al-Shamila** — digital Islamic library (for scholar reference)
- **Verified scholar network** — human reviewers with Islamic credentials

---

## 8. Non-Functional Requirements

### Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Page load (initial) | < 3s on 3G | Lighthouse, WebPageTest |
| Time to interactive | < 5s | Chrome DevTools |
| Search response | < 2s | API monitoring |
| API response time (p95) | < 500ms | Server metrics |
| Bundle size (initial) | < 150KB | Vite build analyzer |
| Lighthouse score | > 85 | Lighthouse CI |

### Security

| Requirement | Implementation |
|-------------|---------------|
| Authentication | JWT with refresh tokens, HTTP-only cookies |
| API Key Protection | All third-party keys server-side only |
| Password Storage | bcrypt hashing |
| Data Encryption | TLS 1.3 in transit, AES-256 at rest |
| Rate Limiting | 100 req/min per IP, 10 req/min for auth |
| Input Sanitization | Server-side validation on all inputs |
| CSRF Protection | SameSite cookies + CSRF tokens |
| Content Security | CSP headers, XSS prevention |

### Accessibility (WCAG 2.1 AA)

- All forms have labels and error announcements
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigable throughout
- Screen reader support (aria-labels, roles)
- Focus indicators visible
- Bengali text uses proper font stack

### Reliability

- Uptime: 99.5% (excl. scheduled maintenance)
- Graceful degradation when AI service is down
- Offline-capable read of cached content
- Auto-save drafts for forms
- Error boundaries on all route-level components

### Scalability

- Support 10K concurrent users at launch
- Support 100K+ registered users within 6 months
- Database handles 1M+ job/institution records
- CDN for static assets and images

---

## 9. Constraints & Assumptions

### Technical Constraints

| Constraint | Impact |
|------------|--------|
| Mobile-first, low-end devices | Minimal JS, small bundle, no heavy animations |
| Unreliable internet (3G/4G in BD) | Offline support, retry logic, optimistic UI |
| Bengali text rendering | Proper font loading, RTL edge cases |
| No dedicated server ops team | Must use managed services (Supabase, Vercel) |
| Budget: $0-200/mo for infrastructure | Free tiers + minimal paid services |

### Business Constraints

| Constraint | Impact |
|------------|--------|
| Non-profit (no VC funding) | Must prioritize revenue-generating features (premium listings) |
| Sensitivity of religious content | Moderation pipeline is non-negotiable |
| Regulatory environment | Must comply with BD digital security act |
| Team size | Small team — must use managed services, avoid custom infra |

### Assumptions

- Target users have at least WhatsApp-level internet connectivity
- Bengali is the primary language for 90%+ of target users
- Institutions are willing to pay small fees for premium job listings
- Scholars will contribute content pro-bono for community benefit
- Mobile-first is more important than desktop experience

---

## 10. Success Metrics & KPIs

### North Star Metric

> **Active Monthly Connections:** Number of successful job applications, fatwa answers, and course enrollments per month.

### Key Results

| KR | Target (6 months) | How to Measure |
|----|-------------------|----------------|
| Registered Users | 10,000 | Auth database count |
| Active Institutions | 500 | Institution profiles with activity in 30 days |
| Monthly Job Applications | 2,000 | Application records |
| Fatwa Answer Rate | < 48hr avg | Time from question to answer |
| Course Completion Rate | > 60% | Progress tracking |
| Monthly Active Users | 5,000 | Unique authenticated sessions |
| User Retention (D30) | > 30% | Cohort analysis |
| Content Authenticity Score | > 95% | Audited content / total content |
| Platform Uptime | > 99.5% | Monitoring |

### Engagement Targets

| Feature | Monthly Target |
|---------|---------------|
| Job searches | 10,000 |
| Fatwa questions submitted | 500 |
| Course enrollments | 1,000 |
| Institution profile views | 25,000 |
| Marketplace visits | 5,000 |
| Community posts | 500 |

### Quality Targets

| Metric | Target |
|--------|--------|
| App Store Rating (future) | 4.5+ |
| User Satisfaction Score | > 85% |
| Page Load Time | < 3s |
| Bug Reports / Week | < 5 |
| Content Moderation Accuracy | > 99% |

---

## 11. Release Criteria

### MVP Launch (v1.0)

**Blocking (must pass):**
- [ ] User can register and login as USER, INSTITUTION, or ADMIN
- [ ] Institution can post a job and it appears in the job board
- [ ] User can search and apply to jobs
- [ ] Fatwa questions can be submitted and answered
- [ ] Institution directory is searchable
- [ ] Admin can moderate content
- [ ] No API keys exposed in client bundle
- [ ] All forms validate input
- [ ] Production build passes with no errors
- [ ] Lighthouse score > 70 on mobile

**Non-blocking (can ship without):**
- [ ] Mobile app
- [ ] Marketplace
- [ ] Community forum
- [ ] Sadaqah/donations
- [ ] Advanced ERP
- [ ] Multi-language support

### v1.0 Go/No-Go Checklist

- [ ] All P0 features are complete and tested
- [ ] No known critical (P0) bugs
- [ ] Security audit passed
- [ ] Performance baseline established
- [ ] Analytics dashboards operational
- [ ] Rollback plan documented
- [ ] Moderation queue staffed
- [ ] Support contact established

---

## 12. Glossary

| Term | Definition |
|------|-----------|
| Madrasa | Islamic seminary/school; in BD context includes Qawmi, Alia, and Mosque-based |
| Qawmi | Non-government madrasa system (Dawra-e-Hadith equivalent to MA) |
| Alia | Government-recognized madrasa system (follows national curriculum + Islamic studies) |
| Fatwa | A non-binding Islamic legal opinion issued by a qualified scholar |
| Mufti | An Islamic scholar qualified to issue fatwas |
| Imam | Prayer leader and religious guide at a mosque |
| Muazzin | Person who calls the adhan (call to prayer) |
| Seerah | Biography of Prophet Muhammad (PBUH) |
| Deen | Islamic way of life/religion |
| Halal | Permissible under Islamic law |
| Sadaqah | Voluntary charity in Islam |
| Zakat | Obligatory alms-giving (one of the Five Pillars) |
| Hijri | Islamic lunar calendar |
| WCAG | Web Content Accessibility Guidelines |

---

> **This is a living document.** Update it as new features are prioritized, user feedback comes in, or the strategic direction evolves. Every team member should read and reference this before building new features.
