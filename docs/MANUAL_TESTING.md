<!--
  📖 Manual Browser Test Guide — Role-based playbook
  Owner: Engineering + Founder | Audience: any human running the app in a real browser
  Companion doc: docs/QA_CHECKLIST.md (30-min pre-release smoke built on top of this)
-->

# 📖 Manual Browser Test Guide

> **Purpose.** Give any human (founder, ops volunteer, new engineer) a checkable
> playbook to smoke-test every user role in a real browser before a release.
>
> **How to use.**
>
> 1. Copy the sections you're running into a fresh GitHub issue named `QA — vX.Y.Z`.
> 2. Tick each `[ ]` box as you go. If a step fails, write the failure right below it and open a bug ticket linked to that step.
> 3. Never skip the **cross-role** section — most regressions live there.
> 4. Run on **both** the smallest supported viewport (375 × 667, iPhone SE) **and** a 1280 × 800 desktop.
>
> **Last updated:** 2026-08-01 · **Applies to:** commit `main` @ HEAD

---

## 🧰 Prerequisites

### Environments

| Environment | URL                                     | Purpose            |
| ----------- | --------------------------------------- | ------------------ |
| Local       | http://localhost:3000                   | Development smoke  |
| Staging     | https://staging.madrasa-connect.bd      | Pre-release QA     |
| Production  | https://madrasa-connect.bd              | Post-release verify |

### Browsers to cover (at minimum)

- **Chrome 124+** on Android + Windows.
- **Safari 17+** on iOS + macOS (mobile is our 95% audience).
- **Firefox latest** on desktop (accessibility check).

### Test accounts

Ask the founder for the current staging creds. Every role has one shared test account. If they don't exist yet, run `npm run seed:auth-users` locally.

| Role         | Email suggestion               | Password         |
| ------------ | ------------------------------ | ---------------- |
| Guest        | (no login)                     | —                |
| User         | `user.qa@madrasa-connect.bd`   | `TestUser!2026`  |
| Scholar      | `scholar.qa@madrasa-connect.bd`| `TestScholar!26` |
| Institution  | `inst.qa@madrasa-connect.bd`   | `TestInst!2026`  |
| Admin        | `admin.qa@madrasa-connect.bd`  | `TestAdmin!2026` |

### Tools

- Open Chrome DevTools → **Device Toolbar** (`Ctrl/Cmd+Shift+M`) → iPhone SE preset for mobile checks.
- **Lighthouse** panel for PWA + Performance smoke.
- **Application → Manifest** panel to verify installability.
- **Application → Service Workers** panel to verify SW registration.
- **Application → Local Storage** panel to inspect `pwa-install-dismissed-at`, `notif-primer-dismissed-at`, i18n language, etc.

---

## 🧭 How to read each section

Each role is one **scenario block** organised as:

```
### <role>
Setup: <viewport, login>
Steps:
- [ ] 1. <do this> — Expected: <what should happen>
- [ ] 2. <do this> — Expected: <what should happen>
...
```

Tick the box, or write ❌ + the actual result if it fails.

---

## 👤 ROLE 1 — Guest / Anonymous

**Setup:** Log out. Viewport iPhone SE (375 × 667). Fresh session (`Application → Clear storage → Clear site data`).

### 1.1 Landing page
- [ ] 1. Open `/` — Expected: Landing page loads under 3 s, hero copy in Bengali, no horizontal scroll bar.
- [ ] 2. Language switcher tap → English → Arabic — Expected: content updates, `<html lang>` and `<html dir="rtl">` change; verify with DevTools Elements tab.
- [ ] 3. Scroll to bottom — Expected: footer visible, no clipped elements, all links tap-target ≥ 44×44 px.

### 1.1.a Language auto-detect (M20)
- [ ] 1a. Clear `localStorage` (`mc_language` + `mc_geo_lang`) via DevTools → Application → Storage → Clear site data.
- [ ] 1b. Refresh — Expected: page loads in `bn` initially, then within ~2 s auto-switches to whatever the geo API decides (usually English on VPN-less staging).
- [ ] 1c. A dismissible Sonner toast appears: **"Showing in <lang> · Tap the language switcher in the header to change."**
- [ ] 1d. Header language switcher visible on **both** mobile and desktop (top-right cluster, next to the notification bell).
- [ ] 1e. Dev override: visit `/?geo=SA` → language becomes **Arabic** and `<html dir="rtl">`.
- [ ] 1f. Dev override: visit `/?geo=BD` → language becomes **Bengali**.
- [ ] 1g. Choose a language manually → refresh — Expected: choice persists, toast does NOT re-appear (user preference wins for good).

### 1.2 Registration & login flows
- [ ] 4. Tap **Sign In** — Expected: `/login` page loads.
- [ ] 5. Tap **নতুন অ্যাকাউন্ট** (or "Register") — Expected: `/register-user` loads.
- [ ] 6. Try Phone/OTP path with a fake `+8801700000000` — Expected: OTP field appears, no unhandled console errors.
- [ ] 7. Try email registration with a fake gmail address — Expected: verification banner appears, no console errors.

### 1.3 Public browse
- [ ] 8. Visit `/institutions` — Expected: list renders (mock or real data), search + filter respond.
- [ ] 9. Visit `/fatwa` — Expected: archive renders + a prominent CTA for logged-out users to log in and ask.
- [ ] 10. Visit `/qawmi-system` — Expected: full page renders with 6 board cards + marhala ladder + citations (external links open in new tab).

### 1.4 PWA & install
- [ ] 11. In DevTools → Application → Manifest — Expected: name = "মাদ্রাসা কানেক্ট বাংলাদেশ", theme = `#006a4e`, ≥ 2 icons, `display: standalone`.
- [ ] 12. Application → Service Workers — Expected: `sw.js` is `activated and running`.
- [ ] 13. Visit 3 different routes → Expected: install prompt appears at bottom (Android/Chrome) or an iOS "Add to Home Screen" hint.
- [ ] 14. Dismiss the prompt — Expected: it does not re-appear (localStorage `pwa-install-dismissed-at` set to today).

### 1.5 Notifications for guests
- [ ] 15. Tap the header bell — Expected: popover opens with "এখনো কোনো বিজ্ঞপ্তি নেই।" empty state (or nothing — guests may have no store).

### 1.6 Feedback widget
- [ ] 16. Tap the floating **Feedback** button (bottom-right) — Expected: modal opens as a bottom-sheet on mobile.
- [ ] 17. Submit "test" as guest — Expected: success toast (Sonner), modal closes, no console error.

---

## 👤 ROLE 2 — General User

**Setup:** Log in with the User test account. Viewport iPhone SE. Then repeat 1–2 critical steps on desktop.

### 2.1 Login & session
- [ ] 1. `/login` with email+password — Expected: redirect to `/dashboard`, header shows user avatar.
- [ ] 2. Refresh page — Expected: session persists (no re-login).
- [ ] 3. BottomNav visible with 5 tabs (Home, Explore, Ask, Learn, Profile); tap each — Expected: correct route, active-tab highlight in `bd-green`.

### 2.2 Ask a fatwa (critical path)
- [ ] 4. Tap **Ask** tab → `/fatwa` — Expected: form loads.
- [ ] 5. Fill title + body in Bengali → Submit — Expected: loading Sonner toast, then success toast, redirect or confirmation.
- [ ] 6. Header bell — Expected: unread badge increments after ~5 s (or refresh); popover shows "Application" or "Community" pill row.

### 2.3 Browse & apply for jobs
- [ ] 7. Tap **Explore** tab → `/institutions` or `/professional` — Expected: real listing, tap a job.
- [ ] 8. Apply — Expected: confirmation toast, application logged to your `/dashboard`.

### 2.4 Donate (bKash)
- [ ] 9. Visit `/sadaqah` → tap **Donate** — Expected: Donation modal (bottom-sheet on mobile).
- [ ] 10. Enter amount 100 BDT → submit — Expected:
       - If merchant creds are set → redirect to bKash sandbox.
       - If `BKASH_MODE=personal` → sees personal-account instructions card with copy-to-clipboard invoice reference.
       - If neither → dry-run notice appears (dev-only).

### 2.5 Notifications end-to-end
- [ ] 11. Ask another fatwa. Wait for the scholar (see role 3) to answer. Bell should badge; open popover; click row — Expected: navigates to `/fatwa/<id>`, marks as read.
- [ ] 12. Tap "সব পড়া হয়েছে" → Expected: unread badge disappears.

### 2.6 Profile & settings
- [ ] 13. Visit `/profile-builder` → change display name → save — Expected: success toast, avatar/name updates immediately.
- [ ] 14. Change UI language via header/sidebar switcher — Expected: reload not required; all sidebar/nav labels + BottomNav labels update.

### 2.7 Logout
- [ ] 15. Log out from sidebar/profile menu — Expected: redirect to `/` (guest state), header bell disappears.

---

## 🎓 ROLE 3 — Scholar

**Setup:** Log in with the Scholar test account. Desktop viewport recommended for the moderation queue.

### 3.1 Scholar dashboard
- [ ] 1. Login → `/scholar-dashboard` — Expected: page loads, shows pending fatwas + XP.
- [ ] 2. Tap a pending fatwa — Expected: detail drawer / page opens with question body.

### 3.2 Answer a fatwa
- [ ] 3. Compose an answer in the Rich Text Editor → attach a citation via CitationPicker — Expected: citation badge appears above the editor.
- [ ] 4. Click **Publish** — Expected: Sonner loading toast → success; fatwa moves out of the pending list; XP counter increments.
- [ ] 5. The user (Role 2) who asked should receive a notification (bell badge). Confirm on the User account.

### 3.3 Public profile
- [ ] 6. Visit `/profile/<scholar_slug>` — Expected: bio, credentials, list of published fatwas.

### 3.4 Apply for higher tier
- [ ] 7. Visit `/scholar-apply` → submit — Expected: form validates, success toast.

---

## 🏫 ROLE 4 — Institution

**Setup:** Log in with the Institution test account. Desktop viewport for the job-post form.

### 4.1 Institution dashboard
- [ ] 1. Login → `/institution-dashboard` — Expected: my institution profile summary + posted jobs + applicant counts.

### 4.2 Post a job
- [ ] 2. Tap **Post Job** → `/post-job` — Expected: form loads.
- [ ] 3. Fill title, description (Bengali), salary, location → submit — Expected: success toast, job appears in the dashboard list with `active` StatusBadge.
- [ ] 4. Edit the job → change title → save — Expected: success toast, list refreshes.
- [ ] 5. Delete the job — Expected: confirmation modal, then row disappears, danger-styled StatusBadge on soft-delete rows if applicable.

### 4.3 Review applicants
- [ ] 6. Tap the applicant count on a job — Expected: applicant list opens with `pending / approved / rejected` StatusBadges (warning / brand / danger palette).
- [ ] 7. Approve one applicant — Expected: badge flips to `approved`, applicant receives a notification.

### 4.4 Institution profile
- [ ] 8. Edit institution profile → change logo → save — Expected: preview updates, success toast.

---

## 🛡️ ROLE 5 — Admin

**Setup:** Log in with the Admin test account. Desktop viewport strongly recommended.

### 5.1 Admin dashboard
- [ ] 1. Login → `/admin-dashboard` — Expected: overview stats, tabs for Users, Jobs, Products, Institutions, Fatwas, Feedback, Donations.

### 5.2 Users tab
- [ ] 2. Search for a user by email — Expected: list filters as you type.
- [ ] 3. Ban a user → Expected: `banned` StatusBadge appears in `danger` palette, action logged in `audit_logs`.
- [ ] 4. Un-ban → StatusBadge disappears.

### 5.3 Content moderation
- [ ] 5. Fatwas tab — flag a fatwa → status flips to `flagged` (warning palette).
- [ ] 6. Approve or reject — Expected: correct StatusBadge applies + notification is dispatched to the author.

### 5.4 Feedback panel
- [ ] 7. Visit `/admin/feedback` — Expected: list of user feedback with warning/info StatusBadges, ability to mark as reviewed.

### 5.5 Donations queue (M14 bKash personal fallback)
- [ ] 8. If BKASH_MODE=personal in prod:
       - New donations appear with `awaiting_manual_review` status (warning palette).
       - Admin can click **Mark as completed** after verifying the bKash SMS.
       - Status flips to `completed` (brand palette).
- [ ] 9. Failed dry-run donations render with `failed` + reason.

### 5.6 Impersonation & audit
- [ ] 10. Every admin action shows a Sonner toast confirming the change.
- [ ] 11. Refresh the page — state persists (nothing was optimistic-only).

---

## 🔀 CROSS-ROLE — end-to-end scenario

**Setup:** Use two browsers (or one browser + one incognito window).

- [ ] 1. **User** submits fatwa "What is the ruling on X?"
- [ ] 2. **Scholar** (other browser) sees it in the pending queue within ≤ 30 s.
- [ ] 3. **Scholar** publishes an answer.
- [ ] 4. **User** browser bell increments **without page refresh** (via Supabase realtime). Popover shows the notification.
- [ ] 5. **User** clicks the row → deep-links to the fatwa answer.
- [ ] 6. **User** taps "সব পড়া হয়েছে" → badge disappears.

If any step above fails, open a ticket titled `CROSS-ROLE regression — step N`.

---

## 📱 MOBILE-SPECIFIC checks

Run only on a real phone (or DevTools Device Toolbar at iPhone SE).

- [ ] 1. BottomNav sticks to viewport bottom; safe-area padding for iPhone home-indicator.
- [ ] 2. `Header` hamburger on the left, notification bell on the right; both ≥ 44 × 44 px tap targets.
- [ ] 3. Every Modal opens as a **bottom sheet** flush with the viewport bottom edge.
- [ ] 4. FeedbackWidget floats **above** BottomNav (not covered).
- [ ] 5. Landing hero text uses `text-4xl md:text-5xl` — reads at 16 px+ body copy elsewhere; no zoom-on-focus when tapping any form input in iOS Safari.
- [ ] 6. Language switcher works and RTL flips layout when Arabic is selected.

---

## ♿ ACCESSIBILITY spot-checks

Every release should pass at least these:

- [ ] 1. Skip-to-main-content link appears on tab keypress from a fresh page.
- [ ] 2. Sidebar closes on `Escape` key.
- [ ] 3. All images have `alt` attributes (audit with axe DevTools).
- [ ] 4. Lighthouse Accessibility score ≥ 90 on `/`, `/dashboard`, `/qawmi-system`, `/fatwa`.
- [ ] 5. Color contrast — every text/bg pair meets AA (semantic tokens are designed for this; verify only if a custom style is introduced).

---

## 🔒 SECURITY spot-checks

- [ ] 1. Try opening `/admin-dashboard` as `USER` role → Expected: redirect to `/403` or `/`.
- [ ] 2. Try `/post-job` as `USER` → Expected: `ProtectedRoute` blocks it.
- [ ] 3. Devtools → Console: no leaked secrets (search for `KEY`, `SECRET`, `SUPABASE_SERVICE`).
- [ ] 4. Devtools → Network: every Supabase call carries an anon or user JWT — never the service role key.

---

## 🧾 How to file a bug from this playbook

- Include: role, viewport, browser + version, the numbered step that failed, expected vs actual, screenshot / DevTools Console output.
- Label the ticket `qa-regression`.
- Link back to the section of this doc — e.g. `MANUAL_TESTING.md § 2.5 step 11`.

---

## 🗓️ Cadence

- **Every PR that touches auth, payments, notifications, or admin** → run at minimum §1, §2, §5.
- **Every release** → run the full doc (~90 min end-to-end, split across two testers) OR use [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) for a 30-min smoke.
- **Weekly** on staging → full run to catch drift.

---

_See also: [`QA_CHECKLIST.md`](./QA_CHECKLIST.md) for the shorter pre-release smoke, [`TESTING`](../src/test/) for the automated test suite, [`INCIDENT_RUNBOOK.md`](./INCIDENT_RUNBOOK.md) for post-mortem template._
