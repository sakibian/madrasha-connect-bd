# ✅ QA Checklist — 30-minute pre-release smoke

> The **shortest possible** checklist that catches 90% of release regressions.
> Full role-based playbook: [`MANUAL_TESTING.md`](./MANUAL_TESTING.md).
>
> **Cadence:** run before every deploy to `main`. Copy into a GitHub issue titled `QA smoke vX.Y.Z` and tick as you go.

**Environments to test:** local + staging (skip prod unless releasing).
**Browsers:** iPhone SE viewport (Chrome DevTools Device Toolbar) + one desktop viewport.

---

## 1. Automated gates (2 min)

- [ ] `npm test` — all Vitest units pass.
- [ ] `npm run build` — production build succeeds with no warnings.
- [ ] `npx playwright test` — all e2e specs pass locally (skip if flaky infra).

---

## 2. Guest journey (5 min)

- [ ] `/` loads under 3 s, hero in Bengali, no horizontal scroll on 375 × 667.
- [ ] Language switcher → Arabic → `<html dir="rtl">` flips.
- [ ] `/institutions` renders a list.
- [ ] `/qawmi-system` renders 6 board cards + marhala ladder + external cite links.
- [ ] PWA manifest present (DevTools → Application → Manifest).
- [ ] Service worker registered (DevTools → Application → Service Workers).
- [ ] Feedback widget: submit "smoke test" as guest → success Sonner toast.

---

## 3. User journey (10 min)

- [ ] Login with the User test account.
- [ ] BottomNav visible with 5 tabs; each routes correctly; active tab highlighted in `bd-green`.
- [ ] `/fatwa` → submit a question → success toast → header bell badge increments within 30 s (may need refresh in staging).
- [ ] Open bell popover → shows the notification → click row → deep-links to fatwa; badge decrements.
- [ ] `/sadaqah` → donate 100 BDT → correct flow fires (merchant / personal / dry-run).
- [ ] `/profile-builder` → edit name → save → success toast + immediate UI update.
- [ ] Logout → redirect to `/`; header bell disappears.

---

## 4. Admin journey (5 min)

- [ ] Login with Admin test account.
- [ ] `/admin-dashboard` overview loads.
- [ ] Ban a user → `banned` StatusBadge (danger palette) appears; unban reverses.
- [ ] Feedback panel → mark one as reviewed → status flips.
- [ ] Donations tab → any `awaiting_manual_review` rows show correctly (bKash personal-mode).
- [ ] Every admin action produces a Sonner confirmation toast.

---

## 5. Cross-role realtime (3 min)

Open two browsers (one incognito).

- [ ] User submits fatwa.
- [ ] Scholar (other browser) sees it in the pending queue.
- [ ] Scholar publishes an answer.
- [ ] User bell badge increments without page refresh.
- [ ] User clicks notification → deep-links to answer.

---

## 6. Mobile-only checks (3 min)

- [ ] BottomNav sticks to viewport bottom with iPhone home-indicator safe-area padding.
- [ ] Header hamburger on left (≥ 44 × 44 px); notification bell on right.
- [ ] Every modal opens as a bottom sheet flush with viewport bottom on `< sm`.
- [ ] FeedbackWidget floats above BottomNav (not covered).
- [ ] No iOS Safari zoom-on-focus when tapping any form input.

---

## 7. Sign-off

- [ ] All boxes above ticked or exception documented.
- [ ] Any regression → open a bug ticket linked to the failing section.
- [ ] Release notes written; commit signed by:

**Tester:** ____________________  **Date:** ____________  **Build SHA:** ____________________

---

_If this smoke passes and no P0/P1 open bugs remain, you're clear to deploy._
