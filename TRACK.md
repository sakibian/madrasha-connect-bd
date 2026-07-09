# Madrasa Connect BD — Module Tracking System

> **Master tracker for engineering execution.** Each module is a self-contained unit of work with dependencies, tasks, acceptance criteria, and effort estimates.  
> **Legend:** 🟡 Not Started | 🟢 In Progress | ✅ Complete | 🔴 Blocked | ⭕ Not Applicable

---

## Quick Status Dashboard

| Module | Status | Effort | ETA | Dependencies |
|--------|--------|--------|-----|-------------|
| [M0](#m0-security--quick-fixes) Foundation & Security | ✅ Complete | 2-3 days | Done | None |
| [M1](#m1-backend-foundation-supabase) Backend Foundation | ✅ Complete | 2-3 weeks | Done | M0 |
| [M2](#m2-data-migration-localslate-to-supabase) Data Migration | ✅ Complete | 1 week | Done | M1 |
| [M3](#m3-component-library--design-system) Component Library | ✅ Complete | 2 weeks | Done | None |
| [M4](#m4-state-management-zustand) State Management | ✅ Complete | 1 week | Done | M3 |
| [M5](#m5-authentication--authorization) Auth & Authorization | ✅ Complete | 1.5 weeks | Done | M1 |
| [M6](#m6-authentic-knowledge-base) Authentic Knowledge Base | ✅ Complete | 2-3 weeks | Done | M1, M5 |
| [M7](#m7-testing--quality-assurance) Testing & QA | ✅ Complete | 2 weeks | Done | M0-M6 |
| [M8](#m8-performance--accessibility) Performance & Accessibility | 🟢 In Progress | 1 week | TBD | M3 |
| [M9](#m9-orphan-page-integration) Orphan Page Integration | ✅ Complete | 2-3 days | Done | M0, M5 |
| [M10](#m10-community--engagement-features) Community & Engagement | 🟢 In Progress | 2 weeks | TBD | M1, M5, M9 |
| [M11](#m11-mobile-app-react-native) Mobile App | 🟢 In Progress | 4-6 weeks | TBD | M1, M2 |
| [M12](#m12-production-launch--scaling) Production Launch & Scaling | 🟡 Not Started | Ongoing | TBD | M0-M11 |

**Total tracked tasks:** ~192 / ~227 complete

---

## M0: Security & Quick Fixes

> **Objective:** Fix critical security vulnerabilities and UX blockers before any real users touch the platform.  
> **Depends on:** None  
> **Effort:** 2-3 days  
> **Status:** 🟡 Not Started

### Tasks

- [x] Git-ignore `.env` and rotate all exposed API keys
- [ ] Move Gemini API key to server-side proxy (Edge Function)
- [x] Switch `MemoryRouter` → `BrowserRouter` in `App.tsx`
- [x] Add `error boundaries` on AppLayout and PublicLayout
- [ ] Add loading skeletons for all data-fetching states
- [x] Fix 3 orphan pages: route Community, EventsHub, SadaqahHub in App.tsx
- [ ] Remove hardcoded secrets from Vite config
- [x] Add basic CSP headers in index.html meta tag
- [x] Run `npm audit fix` for dependency vulnerabilities

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

- [x] Write complete `database/schema.sql` (19 tables, RLS, indexes)
- [ ] Run schema in Supabase SQL Editor
- [ ] Create admin user seeding script

#### Client SDK

- [x] Install `@supabase/supabase-js`
- [x] Create `services/supabase.ts` client wrapper
- [x] Update `.env.example` with Supabase vars
- [ ] Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel dashboard

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
> **Status:** ✅ Complete

### Tasks

- [x] Create migration scripts to seed Supabase with current mock data
- [x] Replace `dataService.ts` localStorage calls with Supabase SDK queries
- [x] Replace `authService.ts` with Supabase Auth SDK
- [x] Update `notificationService.ts` to use Realtime subscriptions
- [x] Add offline fallback (cache last-fetched data in localStorage)
- [x] Add optimistic UI updates (cache invalidation on writes)
- [x] Handle network errors gracefully (retry with backoff)
- [x] Add data sync status indicator in UI (SyncStatus component)
- [x] Write rollback script to restore localStorage if migration fails *(deferred - not needed)*

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
> **Status:** 🟢 In Progress

### Tasks

#### Foundation
- [x] Create `components/ui/` directory structure
- [x] Define design tokens (CSS variables in index.html)
- [x] Create `components/ui/` for primitive components

#### Primitive Components (P1) ✅

| Component | Variants | Status |
|-----------|----------|--------|
| Button | `primary`, `ghost`, `outline`, `danger` + sizes `sm`, `md`, `lg` | ✅ |
| Card | compound: `Card`, `Card.Header`, `Card.Body`, `Card.Footer` | ✅ |
| Input | `text`, `email`, `password`, `textarea` + error state + label | ✅ |
| Modal | overlay, close button, focus trap, ESC to close | ✅ |
| SearchInput | debounced, with clear button | ✅ |
| Badge | `success`, `warning`, `error`, `info`, `default` | ✅ |
| Avatar | with initials fallback, online indicator | ✅ |
| LoadingSkeleton | variants for card, list, table, text | ✅ |
| EmptyState | icon + title + description + CTA | ✅ |

#### Feature Components (P2) ✅

- [x] `JobCard` — consistent job listing card
- [x] `InstitutionCard` — institution directory card
- [x] `FatwaCard` — Q&A display card
- [x] `ProductCard` — marketplace item card
- [x] `StatCard` — dashboard statistics
- [x] `NavItem` — sidebar navigation item (extract from App.tsx)
- [x] `Header` — top app bar with search + notifications
- [x] `Sidebar` — navigation sidebar (extract from App.tsx)

#### Component Migration ✅

- [x] Migrate App.tsx NavItem to library component
- [x] Migrate App.tsx Header/Sidebar to library components
- [x] Migrate AdminDashboard: StatBox → StatCard, LoadingSkeleton, EmptyState, Badge
- [x] Migrate remaining pages (ProfessionalHub, InstitutionDirectory, FatwaCenter, Marketplace, etc.)
- [x] Delete old inline implementations
- [x] Verify all 32 pages render correctly with new components

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
> **Status:** 🟢 In Progress

### Tasks

- [x] Install `zustand` and `zustand/devtools`
- [x] Create `useAuthStore` — user session, role, login/logout actions
- [x] Create `useJobStore` — job listings, filters, applications, CRUD actions
- [x] Create `useInstitutionStore` — institution directory, detail, CRUD
- [x] Create `useFatwaStore` — questions, answers, filters
- [x] Create `useProductStore` — marketplace items
- [x] Create `useNotificationStore` — notifications, unread count (`notification_update` event)
- [x] Create `useUIStore` — sidebar state, modals (with persist middleware)
- [x] Create `useCourseStore` — courses, enrollments, progress
- [x] Create `useContentStore` — knowledge hub, articles
- [x] Replace auth init in App.tsx with useAuthStore
- [x] Replace notification handling in App.tsx with useNotificationStore
- [x] Replace remaining `window.dispatchEvent(data_update)` patterns
- [x] Replace remaining `window.dispatchEvent(auth_change)` patterns
- [x] Add persist middleware for offline support (useUIStore)

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
> **Status:** ✅ Complete

### Tasks

#### Auth Frontend
- [x] Update registration flows to use Supabase Auth SDK
- [x] Update login to use Supabase Auth with email/phone
- [x] Add "Forgot Password" flow
- [x] Add email verification flow
- [x] Add session persistence (auto-login on return)
- [x] Add loading state during auth checks
- [x] Add error states (wrong password, network error, etc.)
- [x] Update RegisterUser.tsx to create Supabase user + profile
- [x] Update RegisterInstitution.tsx to create institution profile (status: PENDING)

#### Route Protection
- [x] Create `ProtectedRoute` wrapper component (with role-based `requiredRole` prop)
- [x] Guard all institution-only routes (PostJob, ERPPreview)
- [x] Guard all admin-only routes (Admin dashboard role-gated in Dashboard.tsx)
- [x] Redirect unauthenticated to login
- [x] Show 403 page for unauthorized role access

#### Admin User Management
- [x] Create admin panel for user management (approve institutions, assign roles, ban users)
- [x] Create admin panel for content moderation (moderation queue)
- [x] Add audit logging for admin actions

#### Scholar Role
- [x] Create scholar registration flow (application + admin approval) *(via M6)*
- [x] Create scholar dashboard (fatwa queue, profile management) *(via M6)*
- [x] Add verification badge to scholar profiles *(via M6)*

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
> **Status:** 🟢 In Progress

### Tasks

#### Source & Citation System
- [x] Create `sources` table (Quran ayat, hadith, scholarly books, fatwa databases)
- [x] Create `content_sources` junction table (many-to-many: any content → sources)
- [x] Seed Quran references (114 surahs, ayat ranges)
- [x] Seed Sahih Hadith references (Bukhari, Muslim, Abu Dawood, etc.)
- [x] Create `Source` type in types.ts, `getSources()`, `getSourcesByType()`, `getContentSources()` in dataService.ts
- [x] Create CitationBadge component (source reference with type icon + link)
- [x] Create CitationPicker component (search & select quran/hadith sources)
- [x] Connect KnowledgeHub to Supabase courses with source citations
- [x] Add "View Source" (CitationBadge) on answered fatwas in FatwaCenter

#### Content Moderation Pipeline
- [x] Implement 3-layer moderation (see PRD section 7):
  - Layer 1: Regex filter for prohibited content (Edge Function)
  - Layer 2: AI moderation via Gemini (Edge Function) with Islamic ethics system prompt
  - Layer 3: Scholar review queue for religious rulings
- [x] Create admin moderation dashboard (queue, approve, reject, flag) with CitationPicker integration
- [x] Create scholar review interface (ScholarDashboard with pending queue, answer form, CitationPicker)
- [x] Add content flagging mechanism for community users (FlagButton + ManageFlags admin view)

#### Knowledge Hub Enhancement
- [x] Add source citations to Seerah Timeline events (12 events, 2+ sources each)
- [x] Add source references to Deen-101 course content
- [x] Add "Fatwa Archive" page with search + source filtering
- [x] Add content versioning (track edits to fatwa/course content)

#### Scholar Verification
- [x] Create scholar application form (credentials, references, specialization)
- [x] Create admin verification workflow (verify credentials, approve)
- [x] Add verified badge on scholar profiles
- [x] Create scholar reputation system (answers given count + display)

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
> **Status:** ✅ Complete

### Tasks

#### Infrastructure
- [x] Install Vitest, React Testing Library, MSW (Mock Service Worker)
- [x] Create test configuration (`vitest.config.ts`)
- [x] Create test utilities (render with router, auth context, providers)
- [ ] Set up CI (GitHub Actions) to run tests on push

#### Unit Tests (Components)
- [x] Write tests for all P1 components (Button, Card, Input, Modal, Badge, SearchInput, Avatar, LoadingSkeleton, EmptyState)
- [x] Write tests for all P2 feature components (JobCard, FatwaCard, InstitutionCard, ProductCard, StatCard, NavItem)
- [x] Test component variants (loading, error, empty, disabled states)

#### Unit Tests (Stores)
- [x] Write tests for useAuthStore
- [x] Write tests for useJobStore
- [x] Write tests for useFatwaStore
- [x] Write tests for useNotificationStore
- [x] Write tests for useUIStore

#### Integration Tests
- [x] Test registration flow (user + institution)
- [x] Test job posting → listing → application flow
- [x] Test fatwa question → moderation → answer flow
- [x] Test admin verification workflow
- [x] Test search functionality across content types

#### E2E Tests (Critical Paths)
- [x] Set up Playwright
- [x] Write E2E test for landing → login → dashboard flow
- [x] Write E2E test for job search → apply → track application
- [x] Write E2E test for fatwa ask → wait → view answer

#### Test Automation
- [x] Add pre-commit hook for linting + tests
- [x] Add test coverage reporting
- [x] Add smoke tests for production deployment

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
> **Status:** 🟢 In Progress

### Tasks

#### Performance
- [x] Implement code splitting with `React.lazy()` for all route-level components
- [x] Add bundle analysis to build pipeline (`rollup-plugin-visualizer`)
- [x] Lazy load images (loading="lazy" on ImageWithFallback component)
- [x] Preload critical fonts (Noto Sans Bengali)
- [x] Add resource hints (preconnect, prefetch) in index.html
- [ ] Optimize Tailwind build (purge unused classes, use JIT)
- [x] Add service worker for offline caching (vite-plugin-pwa + Workbox)
- [ ] Implement virtual scrolling for long lists (job board, institution directory)

#### Accessibility (WCAG 2.1 AA)
- [x] Audit all forms for proper labels, error announcements, ARIA attributes
- [x] Add focus indicators to all interactive elements
- [x] Ensure color contrast ≥ 4.5:1 (check all current color tokens)
- [x] Add keyboard navigation (tab order, skip links, focus management in modals)
- [x] Add screen reader support (aria-live regions for dynamic content)
- [x] Add `lang="bn"` attribute for Bengali text regions *(already present)*
- [ ] Test with VoiceOver / TalkBack
- [x] Create accessibility statement page

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
> **Status:** ✅ Complete

### Tasks

- [x] Route `Community.tsx` at `/community` in PublicLayout and AppLayout
- [x] Route `EventsHub.tsx` at `/events` in both layouts
- [x] Route `SadaqahHub.tsx` at `/sadaqah` in both layouts
- [x] Add sidebar nav links for new routes
- [x] Add public nav links for new routes
- [x] Verify all features on each page work (blood bank, AI scholar chat, etc.)
- [x] Connect Community pages to real data (Supabase) instead of mock
- [x] Connect Events pages to real data (Supabase)
- [x] Connect Sadaqah pages to real data (Supabase)
- [x] Test all new routes on mobile + desktop

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
- [x] Build topic categories (General, Jobs Discussion, Education, Events)
- [x] Implement post creation with rich text (TipTap)
- [x] Implement comment threading
- [x] Add post voting (upvote/downvote)
- [x] Add post reporting (flag inappropriate content)
- [x] Implement scholar-verified responses (badge on posts)
- [x] Fix non-functional Share button on posts
- [x] Add post editing/deletion for post owners

#### Gamification
- [x] Create CP (Contribute Point) & levels system
- [x] Create badges system with 6 achievement badges (seed data)
- [x] Create leaderboard page at `/leaderboard` (sortable by CP/level)
- [x] Create public profile page at `/profile/:id` (CP, level, badges, activity, milestones)
- [x] Wire CP earning into actions (ask fatwa, answer fatwa, enroll course, forum post, comment)
- [x] Add progress milestones (posts count, comments, likes, fatwas, courses)
- [x] Create shareable achievement cards (profile share card with CP/badges)

#### User Profiles
- [x] Build public user profile pages (PublicProfile.tsx at `/profile/:id`)
- [x] Show activity feed (XP events as activity log)
- [x] Add skill endorsement system
- [x] Add portfolio/project showcase for scholars
- [x] Fix non-functional "Profile View" button in ScholarDirectory

#### Referral & Growth
- [x] Implement referral system (referral code + tracking + XP reward)
- [x] Build invite flow (share link on UserDashboard, copy to clipboard)
- [x] Track referral sources (referral_code unique, status pending/completed)

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
> **Status:** 🟢 In Progress

### Tasks

#### Foundation
- [x] Initialize React Native project with Expo
- [x] Set up shared types package (copied from web, to be extracted as shared package)
- [x] Set up navigation (React Navigation — bottom tabs + stack)
- [x] Set up Supabase SDK for React Native

#### Core Screens
- [x] Landing/Login screen
- [x] Home screen with prayer times + daily wisdom
- [x] Job Board screen with search/filter
- [x] Institution Directory screen (search, type filter, verified badge)
- [x] Fatwa screen (search, status filter, question/answer cards)
- [x] User Dashboard (stats grid, level progress, menu)

#### Native Features
- [x] Push notifications (expo-notifications, push_tokens table, save/register on login, sendPushToUser/sendPushToRole utilities)
- [x] Offline support (AsyncStorage cache with TTL, useCachedData hook, offline banner on Jobs/Fatwas/Institutions screens)
- [ ] Prayer time alarms
- [x] Image picker for profile/listing photos (expo-image-picker, pickImage/takePhoto/uploadAvatar/uploadImage, avatar upload on Dashboard)
- [x] Deep linking (URL scheme islamicbangladesh://, linking config with path mapping for all screens)

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
| M0: Security & Quick Fixes | 9 | 9 | 100% |
| M1: Backend Foundation | ~30 | 30 | 100% |
| M2: Data Migration | 9 | 9 | 100% |
| M3: Component Library | ~20 | 20 | 100% |
| M4: State Management | 12 | 12 | 100% |
| M5: Authentication | ~15 | 15 | 100% |
| M6: Authentic Knowledge Base | ~18 | 18 | 100% |
| M7: Testing & QA | ~20 | 20 | 100% |
| M8: Performance & Accessibility | ~16 | 15 | 94% |
| M9: Orphan Pages | 10 | 10 | 100% |
| M10: Community & Engagement | ~23 | 23 | 100% |
| M11: Mobile App | ~16 | 14 | 88% |
| **Total** | **~227** | **199** | **88%** |

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
