# Madrasa Connect BD — Module Tracking System

> **Master tracker for engineering execution.** Each module is a self-contained unit of work with dependencies, tasks, acceptance criteria, and effort estimates.  
> **Legend:** 🟡 Not Started | 🟢 In Progress | ✅ Complete | 🔴 Blocked | ⭕ Not Applicable

---

## Quick Status Dashboard

| Module | Status | Effort | ETA | Dependencies |
|--------|--------|--------|-----|-------------|
| [M0](#m0-security--quick-fixes) Foundation & Security | 🟡 Not Started | 2-3 days | TBD | None |
| [M1](#m1-backend-foundation-supabase) Backend Foundation | 🟡 Not Started | 2-3 weeks | TBD | M0 |
| [M2](#m2-data-migration-localslate-to-supabase) Data Migration | 🟡 Not Started | 1 week | TBD | M1 |
| [M3](#m3-component-library--design-system) Component Library | 🟡 Not Started | 2 weeks | TBD | None |
| [M4](#m4-state-management-zustand) State Management | 🟡 Not Started | 1 week | TBD | M3 |
| [M5](#m5-authentication--authorization) Auth & Authorization | 🟡 Not Started | 1.5 weeks | TBD | M1 |
| [M6](#m6-authentic-knowledge-base) Authentic Knowledge Base | 🟡 Not Started | 2-3 weeks | TBD | M1, M5 |
| [M7](#m7-testing--quality-assurance) Testing & QA | 🟡 Not Started | 2 weeks | TBD | M0-M6 |
| [M8](#m8-performance--accessibility) Performance & Accessibility | 🟡 Not Started | 1 week | TBD | M3 |
| [M9](#m9-orphan-page-integration) Orphan Page Integration | 🟡 Not Started | 2-3 days | TBD | M0, M5 |
| [M10](#m10-community--engagement-features) Community & Engagement | 🟡 Not Started | 2 weeks | TBD | M1, M5, M9 |
| [M11](#m11-mobile-app-react-native) Mobile App | 🟡 Not Started | 4-6 weeks | TBD | M1, M2 |
| [M12](#m12-production-launch--scaling) Production Launch & Scaling | 🟡 Not Started | Ongoing | TBD | M0-M11 |

**Total tracked tasks:** 0 / ~200 complete

---

## M0: Security & Quick Fixes

> **Objective:** Fix critical security vulnerabilities and UX blockers before any real users touch the platform.  
> **Depends on:** None  
> **Effort:** 2-3 days  
> **Status:** 🟡 Not Started

### Tasks

- [ ] Git-ignore `.env` and rotate all exposed API keys
- [ ] Move Gemini API key to server-side proxy (Edge Function)
- [x] Switch `MemoryRouter` → `BrowserRouter` in `App.tsx`
- [ ] Add `error boundaries` on AppLayout and PublicLayout
- [ ] Add loading skeletons for all data-fetching states
- [ ] Fix 3 orphan pages: route Community, EventsHub, SadaqahHub in App.tsx
- [ ] Remove hardcoded secrets from Vite config
- [ ] Add basic CSP headers in index.html meta tag
- [ ] Run `npm audit fix` for dependency vulnerabilities

### Acceptance Criteria

- [ ] `git status` shows no committed `.env` or secrets
- [ ] API key not extractable from DevTools network tab
- [ ] Browser URL changes on navigation; back/forward buttons work
- [ ] Uncaught errors show fallback UI instead of white screen
- [ ] All 32+ pages accessible without error
- [ ] Orphan pages (Community, EventsHub, SadaqahHub) reachable via URL

### Effort Breakdown

| Task | Hours | Owner |
|------|-------|-------|
| API key fix | 2 | Backend |
| BrowserRouter | 1 | Frontend |
| Error boundaries | 3 | Frontend |
| Loading states | 4 | Frontend |
| Orphan pages | 2 | Frontend |
| Security hardening | 2 | DevOps |

---

## M1: Backend Foundation (Supabase)

> **Objective:** Establish persistent, scalable backend infrastructure — database, authentication, storage, and serverless functions.  
> **Depends on:** M0  
> **Effort:** 2-3 weeks  
> **Status:** 🟡 Not Started

### Architecture Decision

**✅ Chosen: Supabase** (PostgreSQL + Auth + Storage + Edge Functions + Realtime)  
Why: Free tier covers launch needs, handles auth out-of-box, PostgreSQL for relational data, built-in Edge Functions for Gemini proxy, scales to 100K users without ops burden.

| Option | Verdict | Reason |
|--------|---------|--------|
| Supabase | ✅ Chosen | Free tier sufficient; auth, DB, storage, serverless all-in-one |
| Custom Node.js + Express | ❌ Too much ops | No dedicated ops team; supabase handles infra |
| Firebase | ❌ Wrong DB | Firestore is NoSQL; our data is highly relational |
| PocketBase | ❌ Too niche | Small community, uncertain long-term |

### Tasks

#### Database Schema (Supabase PostgreSQL)

- [ ] Create `users` table (extends Supabase auth.users)
- [ ] Create `institutions` table with verification workflow
- [ ] Create `jobs` table with status lifecycle (draft → pending → verified → closed)
- [ ] Create `job_applications` table with status tracking
- [ ] Create `fatwas` table with moderation pipeline
- [ ] Create `fatwa_answers` table (separate from questions for audit)
- [ ] Create `products` table for marketplace
- [ ] Create `courses` and `enrollments` tables
- [ ] Create `scholars` table with verification
- [ ] Create `notifications` table
- [ ] Create `sadaqah_projects` and `donations` tables
- [ ] Create `forum_posts` and `forum_comments` tables
- [ ] Create `events` table
- [ ] Create `audit_log` table for content moderation history
- [ ] Enable Row-Level Security (RLS) on all tables
- [ ] Create indexes for searchable columns (name, title, location, category)

#### Auth (Supabase Auth)

- [ ] Configure email + password auth provider
- [ ] Add phone auth (SMS) for BD users
- [ ] Create custom `user_profiles` table extending auth.users
- [ ] Implement role-based access (USER, INSTITUTION, SCHOLAR, ADMIN)
- [ ] Create admin user seeding script
- [ ] Set up email templates for verification, password reset

#### Storage (Supabase Storage)

- [ ] Configure storage buckets (avatars, institution-logos, job-attachments, fatwa-docs)
- [ ] Set RLS policies for each bucket
- [ ] Create image optimization pipeline (compress on upload)

#### Edge Functions (Gemini Proxy)

- [ ] Create `moderate-content` function (Gemini text moderation)
- [ ] Create `search-semantic` function (Gemini embeddings for search)
- [ ] Create `generate-fatwa-suggestion` function (AI-assisted draft)
- [ ] Create `generate-daily-wisdom` function
- [ ] Add rate limiting (100 req/hr per user)
- [ ] Add request logging & monitoring

#### Realtime & Notifications

- [ ] Configure Supabase Realtime for live updates
- [ ] Create notification triggers (on job apply, fatwa answer, etc.)
- [ ] Set up email notifications via Resend or Supabase built-in

### Acceptance Criteria

- [ ] All tables created with RLS policies
- [ ] Auth works: register, login, password reset, role assignment
- [ ] Edge Functions respond < 2s (p95)
- [ ] Gemini API keys not exposed to client
- [ ] Storage uploads/downloads work with proper permissions
- [ ] Notifications delivered via Realtime subscriptions
- [ ] Seed script creates demo data (10 jobs, 5 institutions, 3 fatwas)

### Effort Breakdown

| Area | Hours |
|------|-------|
| Schema design & migration | 16 |
| Auth setup | 8 |
| Storage & RLS | 6 |
| Edge Functions | 20 |
| Realtime & notifications | 8 |
| Testing & debugging | 12 |

---

## M2: Data Migration (localStorage → Supabase)

> **Objective:** Move all mock data and operational data from browser localStorage to Supabase without data loss.  
> **Depends on:** M1  
> **Effort:** 1 week  
> **Status:** 🟡 Not Started

### Tasks

- [ ] Create migration scripts to seed Supabase with current mock data
- [ ] Replace `dataService.ts` localStorage calls with Supabase SDK queries
- [ ] Replace `authService.ts` with Supabase Auth SDK
- [ ] Update `notificationService.ts` to use Realtime subscriptions
- [ ] Add offline fallback (cache last-fetched data in localStorage)
- [ ] Add optimistic UI updates for all write operations
- [ ] Handle network errors gracefully (retry with backoff)
- [ ] Add data sync status indicator in UI
- [ ] Write rollback script to restore localStorage if migration fails

### File Change Map

| Current File | New Approach |
|-------------|-------------|
| `services/dataService.ts` | Supabase `.from('table').select()` queries |
| `services/authService.ts` | `supabase.auth.signIn()` / `signUp()` |
| `services/notificationService.ts` | `supabase.channel('notifications').subscribe()` |
| `services/geminiService.ts` | Fetch to Edge Function URLs |
| `types.ts` | Keep types, add Supabase generated types |

### Acceptance Criteria

- [ ] All CRUD operations hit Supabase, not localStorage
- [ ] Auth flow uses Supabase Auth (real sessions)
- [ ] Notifications update in real-time across tabs
- [ ] Offline reads work from cache
- [ ] All existing UI pages work identically after migration
- [ ] No data loss during migration

---

## M3: Component Library & Design System

> **Objective:** Eliminate duplicate UI code (Button, Card, Input, Modal exist 20+ times each) by building a shared component library.  
> **Depends on:** None (can parallelize with M1)  
> **Effort:** 2 weeks  
> **Status:** 🟡 Not Started

### Tasks

#### Foundation
- [ ] Create `src/components/` directory structure
- [ ] Define design tokens (colors, spacing, typography, shadows) in Tailwind config
- [ ] Create `src/components/ui/` for primitive components

#### Primitive Components (P1)

| Component | Variants | Current Duplicates |
|-----------|----------|-------------------|
| Button | `primary`, `ghost`, `outline`, `danger` + sizes `sm`, `md`, `lg` | ~15 instances |
| Card | compound: `Card`, `Card.Header`, `Card.Body`, `Card.Footer` | ~12 instances |
| Input | `text`, `email`, `password`, `textarea` + error state + label | ~10 instances |
| Modal | overlay, close button, focus trap, ESC to close | ~5 instances |
| SearchInput | debounced, with clear button | ~4 instances |
| Badge | `success`, `warning`, `error`, `info` | ~6 instances |
| Avatar | with initials fallback, online indicator | ~4 instances |
| LoadingSkeleton | variants for card, list, table, text | ~0 (new) |
| EmptyState | icon + title + description + CTA | ~3 instances |

#### Feature Components (P2)

- [ ] `JobCard` — consistent job listing card across all pages
- [ ] `InstitutionCard` — institution directory card
- [ ] `FatwaCard` — Q&A display card
- [ ] `ProductCard` — marketplace item card
- [ ] `StatCard` — dashboard statistics
- [ ] `NavItem` — sidebar navigation item (extract from App.tsx)
- [ ] `Header` — top app bar with search + notifications
- [ ] `Sidebar` — navigation sidebar (extract from App.tsx)

#### Component Migration

- [ ] Migrate all P1 components into existing pages (remove inline implementations)
- [ ] Migrate all P2 components
- [ ] Delete old inline implementations
- [ ] Verify all 32 pages render correctly with new components

### Acceptance Criteria

- [ ] All 5 P1 components implemented with full TypeScript props
- [ ] All P2 feature components implemented
- [ ] 0 duplicate Button/Card/Input/Modal implementations remain
- [ ] Components follow design tokens (no arbitrary colors/spacing)
- [ ] Storybook or equivalent for visual documentation
- [ ] Bundle size reduced by removing duplicate code

---

## M4: State Management (Zustand)

> **Objective:** Replace 87+ scattered `useState`/`useEffect` and `window.dispatchEvent` pub/sub with centralized Zustand stores.  
> **Depends on:** M3 (components)  
> **Effort:** 1 week  
> **Status:** 🟡 Not Started

### Tasks

- [ ] Install `zustand` and `zustand/devtools`
- [ ] Create `useAuthStore` — user session, role, login/logout actions
- [ ] Create `useJobStore` — job listings, filters, applications, CRUD actions
- [ ] Create `useInstitutionStore` — institution directory, detail, CRUD
- [ ] Create `useFatwaStore` — questions, answers, filters
- [ ] Create `useProductStore` — marketplace items
- [ ] Create `useNotificationStore` — notifications, unread count
- [ ] Create `useUIStore` — sidebar state, theme (future), modals
- [ ] Create `useCourseStore` — courses, enrollments, progress
- [ ] Create `useContentStore` — knowledge hub, articles
- [ ] Replace all `window.dispatchEvent(new CustomEvent('data_update'))` patterns
- [ ] Add Zustand devtools for debugging
- [ ] Add persist middleware for offline support

### Store Map

| Store | Data | Source | Used By |
|-------|------|--------|---------|
| `useAuthStore` | User, session, role | Supabase Auth | AppLayout, Dashboard, Nav |
| `useJobStore` | Jobs[], filters, applications | Supabase `jobs` | ProfessionalHub, PostJob, Dashboard |
| `useInstitutionStore` | Institutions[], detail | Supabase `institutions` | InstitutionDirectory, Detail |
| `useFatwaStore` | Fatwas[], answer, filters | Supabase `fatwas` | FatwaCenter, Admin |
| `useProductStore` | Products[], cart | Supabase `products` | Marketplace |
| `useNotificationStore` | Notifications[], unread | Supabase Realtime | Header, Bell icon |
| `useUIStore` | Sidebar, theme, modals | Local state | AppLayout, components |
| `useCourseStore` | Courses[], enrollments | Supabase `courses` | KnowledgeHub, Deen101 |

### Acceptance Criteria

- [ ] All stores replace corresponding useState/useEffect patterns
- [ ] 0 `window.dispatchEvent` calls remain
- [ ] DevTools show store state changes in real-time
- [ ] Data persists across navigation
- [ ] Offline reads work via Zustand persist middleware

---

## M5: Authentication & Authorization

> **Objective:** Replace fake localStorage auth with real Supabase Auth, add role-based access control, and secure all protected routes.  
> **Depends on:** M1 (backend)  
> **Effort:** 1.5 weeks  
> **Status:** 🟡 Not Started

### Tasks

#### Auth Frontend
- [ ] Update registration flows to use Supabase Auth SDK
- [ ] Update login to use Supabase Auth with email/phone
- [ ] Add "Forgot Password" flow
- [ ] Add email verification flow
- [ ] Add session persistence (auto-login on return)
- [ ] Add loading state during auth checks
- [ ] Add error states (wrong password, network error, etc.)
- [ ] Update RegisterUser.tsx to create Supabase user + profile
- [ ] Update RegisterInstitution.tsx to create institution profile (status: PENDING)

#### Route Protection
- [ ] Create `ProtectedRoute` wrapper component
- [ ] Create `RoleRoute` wrapper (e.g., `RoleRoute role="ADMIN"`)
- [ ] Guard all institution-only routes (PostJob, ERPPreview)
- [ ] Guard all admin-only routes (Admin dashboard CRUD)
- [ ] Redirect unauthenticated to login
- [ ] Show 403 page for unauthorized role access

#### Admin User Management
- [ ] Create admin panel for user management (approve institutions, assign roles)
- [ ] Create admin panel for content moderation (moderation queue)
- [ ] Add audit logging for admin actions

#### Scholar Role
- [ ] Create scholar registration flow (application + admin approval)
- [ ] Create scholar dashboard (fatwa queue, profile management)
- [ ] Add verification badge to scholar profiles

### Acceptance Criteria

- [ ] Auth flow works end-to-end: register → verify → login → session persist
- [ ] Password reset works via email
- [ ] INSTITUTION role can't access ADMIN routes (and vice versa)
- [ ] Unauthenticated users redirected to `/login`
- [ ] Scholar registration requires admin approval
- [ ] Institution registration starts as PENDING; approved by admin

---

## M6: Authentic Knowledge Base

> **Objective:** Build the content authenticity infrastructure — source tracking, scholar review workflow, content moderation pipeline, and citation management. This is our core differentiator.  
> **Depends on:** M1 (Supabase), M5 (Auth/Roles)  
> **Effort:** 2-3 weeks  
> **Status:** 🟡 Not Started

### Tasks

#### Source & Citation System
- [ ] Create `sources` table (Quran ayat, hadith, scholarly books, fatwa databases)
- [ ] Create `content_sources` junction table (many-to-many: any content → sources)
- [ ] Seed Quran references (114 surahs, ayat ranges)
- [ ] Seed Sahih Hadith references (Bukhari, Muslim, Abu Dawood, etc.) via Sunnah.com API
- [ ] Create citation picker UI component (search & select quran/hadith references)
- [ ] Add "View Source" link on all authenticated knowledge content

#### Content Moderation Pipeline
- [ ] Implement 3-layer moderation (see PRD section 7):
  - Layer 1: Regex filter for prohibited content (server-side Edge Function)
  - Layer 2: AI moderation via Gemini (Edge Function) with Islamic ethics system prompt
  - Layer 3: Scholar review queue for religious rulings
- [ ] Create admin moderation dashboard (queue, approve, reject, flag)
- [ ] Create scholar review interface (for fatwa answers, course content)
- [ ] Add content flagging mechanism for community users
- [ ] Create automated weekly content audit report

#### Knowledge Hub Enhancement
- [ ] Add source citations to Seerah Timeline events
- [ ] Add source references to Deen-101 course content
- [ ] Add "Fatwa Archive" with search + source filtering
- [ ] Create scholar attribution system (content → answering scholar)
- [ ] Add content versioning (track edits to fatwa/course content)

#### Scholar Verification
- [ ] Create scholar application form (credentials, references, specialization)
- [ ] Create admin verification workflow (verify credentials, approve)
- [ ] Add verified badge on scholar profiles
- [ ] Create scholar reputation system (answers given, helpful votes)

### Acceptance Criteria

- [ ] Quran and Hadith citation database searchable and usable
- [ ] All Seerah events cite at least 2 authentic sources
- [ ] Fatwa answers require source citation before publishing
- [ ] 3-layer moderation pipeline operational
- [ ] Scholar review queue < 48hr turnaround
- [ ] Content audit shows > 95% authenticity score

---

## M7: Testing & Quality Assurance

> **Objective:** Establish testing infrastructure and achieve > 80% coverage for critical paths.  
> **Depends on:** M0-M6 (runs in parallel with implementation)  
> **Effort:** 2 weeks  
> **Status:** 🟡 Not Started

### Tasks

#### Infrastructure
- [ ] Install Vitest, React Testing Library, MSW (Mock Service Worker)
- [ ] Create test configuration (`vitest.config.ts`)
- [ ] Create test utilities (render with router, auth context, providers)
- [ ] Set up CI (GitHub Actions) to run tests on push

#### Unit Tests (Components)
- [ ] Write tests for all P1 components (Button, Card, Input, Modal, Badge)
- [ ] Write tests for all P2 feature components (JobCard, FatwaCard, etc.)
- [ ] Test component variants (loading, error, empty, disabled states)

#### Unit Tests (Stores)
- [ ] Write tests for useAuthStore
- [ ] Write tests for useJobStore
- [ ] Write tests for useFatwaStore
- [ ] Write tests for useNotificationStore
- [ ] Write tests for useUIStore

#### Integration Tests
- [ ] Test registration flow (user + institution)
- [ ] Test job posting → listing → application flow
- [ ] Test fatwa question → moderation → answer flow
- [ ] Test admin verification workflow
- [ ] Test search functionality across content types

#### E2E Tests (Critical Paths)
- [ ] Set up Playwright
- [ ] Write E2E test for landing → login → dashboard flow
- [ ] Write E2E test for job search → apply → track application
- [ ] Write E2E test for fatwa ask → wait → view answer

#### Test Automation
- [ ] Add pre-commit hook for linting + tests
- [ ] Add test coverage reporting
- [ ] Add smoke tests for production deployment

### Coverage Targets

| Area | Target |
|------|--------|
| P1 Components | 100% |
| P2 Components | 80% |
| Zustand Stores | 100% |
| Auth flows | 100% |
| CRUD operations | 90% |
| Overall project | > 70% |

---

## M8: Performance & Accessibility

> **Objective:** Ship a fast, inclusive experience that works on low-end devices in rural Bangladesh.  
> **Depends on:** M3 (components)  
> **Effort:** 1 week  
> **Status:** 🟡 Not Started

### Tasks

#### Performance
- [ ] Implement code splitting with `React.lazy()` for all route-level components
- [ ] Add bundle analysis to build pipeline (`rollup-plugin-visualizer`)
- [ ] Lazy load images (Intersection Observer)
- [ ] Preload critical fonts (Noto Sans Bengali)
- [ ] Add resource hints (preconnect, prefetch) in index.html
- [ ] Optimize Tailwind build (purge unused classes, use JIT)
- [ ] Add service worker for offline caching
- [ ] Implement virtual scrolling for long lists (job board, institution directory)

#### Accessibility (WCAG 2.1 AA)
- [ ] Audit all forms for proper labels, error announcements, ARIA attributes
- [ ] Add focus indicators to all interactive elements
- [ ] Ensure color contrast ≥ 4.5:1 (check all current color tokens)
- [ ] Add keyboard navigation (tab order, skip links, focus management in modals)
- [ ] Add screen reader support (aria-live regions for dynamic content)
- [ ] Add `lang="bn"` attribute for Bengali text regions
- [ ] Test with VoiceOver / TalkBack
- [ ] Create accessibility statement page

### Acceptance Criteria

- [ ] Lighthouse score > 85 (mobile)
- [ ] Initial bundle < 150KB
- [ ] Time to interactive < 5s on simulated 3G
- [ ] All interactive elements keyboard accessible
- [ ] Color contrast checker passes all pages
- [ ] Screen reader can navigate main flows
- [ ] Offline page shows cached content

---

## M9: Orphan Page Integration

> **Objective:** Route and integrate 3 fully-built orphan pages (Community, EventsHub, SadaqahHub) into the main app.  
> **Depends on:** M0 (route fixes), M5 (auth guards)  
> **Effort:** 2-3 days  
> **Status:** 🟡 Not Started

### Tasks

- [ ] Route `Community.tsx` at `/community` in PublicLayout and AppLayout
- [ ] Route `EventsHub.tsx` at `/events` in both layouts
- [ ] Route `SadaqahHub.tsx` at `/sadaqah` in both layouts
- [ ] Add sidebar nav links for new routes
- [ ] Add public nav links for new routes
- [ ] Verify all features on each page work (blood bank, AI scholar chat, etc.)
- [ ] Connect Community pages to real data (Supabase) instead of mock
- [ ] Connect Events pages to Hijri calendar logic
- [ ] Connect Sadaqah pages to donation data
- [ ] Test all new routes on mobile + desktop

### Acceptance Criteria

- [ ] Community page reachable at `/community`
- [ ] EventsHub page reachable at `/events`
- [ ] SadaqahHub page reachable at `/sadaqah`
- [ ] Sidebar shows links to all 3 new pages
- [ ] Public nav shows links (where appropriate)
- [ ] All features on each page work end-to-end

---

## M10: Community & Engagement Features

> **Objective:** Build community features that drive retention, user-generated content, and organic growth.  
> **Depends on:** M1 (backend), M5 (auth), M9 (Community page)  
> **Effort:** 2 weeks  
> **Status:** 🟡 Not Started

### Tasks

#### Community Forum
- [ ] Build topic categories (General, Jobs Discussion, Education, Events)
- [ ] Implement post creation with rich text (TipTap or similar)
- [ ] Implement comment threading
- [ ] Add post voting (upvote/downvote)
- [ ] Add post reporting (flag inappropriate content)
- [ ] Implement scholar-verified responses (badge on posts)

#### Gamification
- [ ] Create badges system (First Job, Top Scholar, Course Complete, etc.)
- [ ] Create leaderboard (helpful scholars, active job seekers)
- [ ] Add progress milestones (profile completion, applications sent)
- [ ] Create shareable achievement cards

#### User Profiles
- [ ] Build public user profile pages
- [ ] Show activity feed (jobs applied, fatwas asked, courses taken)
- [ ] Add skill endorsement system
- [ ] Add portfolio/project showcase for scholars

#### Referral & Growth
- [ ] Implement referral system (refer a madrasa, refer a job seeker)
- [ ] Build invite flow (share link → register → both get benefit)
- [ ] Track referral sources

### Acceptance Criteria

- [ ] Community forum has 5+ active categories
- [ ] User can create post, comment, vote, report
- [ ] Badges awarded and displayed on profiles
- [ ] Public profiles viewable at `/profile/:id`
- [ ] Referral flow tracks 100% of sign-ups

---

## M11: Mobile App (React Native)

> **Objective:** Build native Android/iOS app sharing types and API with the web app.  
> **Depends on:** M1 (backend), M2 (data migration)  
> **Effort:** 4-6 weeks  
> **Status:** 🟡 Not Started

### Tasks

#### Foundation
- [ ] Initialize React Native project with TypeScript
- [ ] Set up shared types package (shared with web)
- [ ] Set up navigation (React Navigation — bottom tabs + stack)
- [ ] Set up Supabase SDK for React Native

#### Core Screens
- [ ] Landing/Login screen
- [ ] Home screen with prayer times + daily wisdom
- [ ] Job Board screen with search/filter
- [ ] Institution Directory screen
- [ ] Fatwa screen
- [ ] User Dashboard

#### Native Features
- [ ] Push notifications (via Supabase Realtime → FCM/APNs)
- [ ] Offline support (AsyncStorage + SQLite)
- [ ] Prayer time alarms
- [ ] Image picker for profile/listing photos
- [ ] Deep linking

#### Release
- [ ] Android APK build
- [ ] iOS build (if Mac available)
- [ ] Beta testing via TestFlight / Play Console
- [ ] App store listing (Bengali + English)

### Acceptance Criteria

- [ ] All core web features available in mobile app
- [ ] Push notifications arrive < 10s
- [ ] App works offline (reads cached data)
- [ ] Bundle size < 40MB
- [ ] App store listing published

---

## M12: Production Launch & Scaling

> **Objective:** Launch safely, monitor aggressively, and scale based on real usage patterns.  
> **Depends on:** M0-M11  
> **Effort:** Ongoing  
> **Status:** 🟡 Not Started

### Tasks

#### Pre-Launch
- [ ] Complete full security audit
- [ ] Load test with 1000 concurrent users (k6 or Locust)
- [ ] Set up error monitoring (Sentry free tier)
- [ ] Set up uptime monitoring (Better Uptime or similar)
- [ ] Set up analytics (PostHog free tier)
- [ ] Create runbook for common incidents
- [ ] Document rollback procedures
- [ ] Set up staging environment

#### Launch
- [ ] Soft launch (invite-only 100 institutions)
- [ ] Hard launch (public, marketing campaign)
- [ ] Monitor error rates, response times, user feedback
- [ ] Staff moderation queue (24/7 coverage for first week)

#### Post-Launch
- [ ] Collect user feedback (in-app survey)
- [ ] Prioritize feature requests from real users
- [ ] Optimize based on analytics data
- [ ] Monthly content authenticity audits
- [ ] Quarterly impact reports for donors

#### Scaling
- [ ] Add CDN (Cloudflare) for static assets
- [ ] Add database read replicas if needed
- [ ] Implement Redis caching for prayer times, search results
- [ ] Optimize Edge Function cold starts
- [ ] Consider microservices only if traffic demands it

### Launch Criteria (Go/No-Go)

- [ ] All P0 and P1 features complete and tested
- [ ] No critical (P0) bugs open
- [ ] Security audit passed
- [ ] Load test passes (1000 concurrent users, < 2s response)
- [ ] Moderation queue staffed
- [ ] Support email/contact established
- [ ] Rollback plan documented
- [ ] Analytics dashboards live
- [ ] Legal review completed (privacy policy, terms)

---

## Completion Tracker

| Module | Total Tasks | Completed | Progress |
|--------|-------------|-----------|----------|
| M0: Security & Quick Fixes | 9 | 0 | 0% |
| M1: Backend Foundation | ~30 | 0 | 0% |
| M2: Data Migration | 9 | 0 | 0% |
| M3: Component Library | ~20 | 0 | 0% |
| M4: State Management | 12 | 0 | 0% |
| M5: Authentication | ~15 | 0 | 0% |
| M6: Authentic Knowledge Base | ~18 | 0 | 0% |
| M7: Testing & QA | ~18 | 0 | 0% |
| M8: Performance & Accessibility | ~15 | 0 | 0% |
| M9: Orphan Pages | 10 | 0 | 0% |
| M10: Community & Engagement | ~12 | 0 | 0% |
| M11: Mobile App | ~14 | 0 | 0% |
| M12: Production Launch | ~15 | 0 | 0% |
| **Total** | **~200** | **0** | **0%** |

---

## How to Use This Tracker

1. **Start with M0** — no dependencies, quick wins, security fixes
2. **Parallel tracks:** M1 (backend) + M3 (components) can run simultaneously
3. **Update status** by changing `🟡` to `🟢` (in progress) or `✅` (complete)
4. **Blocked items** should have `🔴` + a comment explaining why next to the task
5. **Check acceptance criteria** before marking any module complete
6. **Update the completion tracker** at the bottom when tasks change
7. **Revisit PRD.md** before starting each module to ensure alignment

> **Pro tip:** Use GitHub Issues + Projects for individual task assignment. This TRACK.md serves as the master blueprint. Each module can be converted into a GitHub Milestone.
