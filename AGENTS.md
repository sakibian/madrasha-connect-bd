# 🤖 Agent Instructions

> **For AI assistants working on this codebase.**
> 
> These are permanent rules that apply to every engineering session. Follow them
> automatically — don't ask permission, and remind the user if they conflict.

---

## 📝 README.md Sync Rule (CRITICAL)

**The README.md must ALWAYS reflect the actual current state of the codebase.**

### Automated Process
- **Pre-commit hook**: `scripts/sync-readme.js` runs automatically on every commit
- **Manual sync**: `npm run sync-readme` 
- **What it does**: Updates the "Current State" table + production readiness % based on `PROGRESS.md`

### Manual Updates Required
When you ship **major features** (new auth methods, payment flows, admin panels, etc.), you MUST manually update these README sections:

1. **Current State table** — mark new dimensions as ✅ Complete
2. **Commands section** — add new `npm run` scripts if you created any
3. **Architecture diagram** — if you added new external services
4. **For the Founder section** — update priority if blockers are resolved
5. **Quick Start** — if setup steps changed

### What Gets Auto-Synced
- Current State section timestamp
- Production readiness percentage (calculated from PROGRESS.md)
- MVP launch estimate (when readiness > 80%)

---

## 🧪 Testing Rule

**Every commit must pass the full test suite.**

- Pre-commit hook runs `npx vitest run --reporter=verbose --changed`
- If you add new features, add tests (unit for logic, e2e for critical flows)
- 220+ unit tests + 8 Playwright e2e specs must all pass
- Never commit broken tests — fix them or mark as `.skip()` with a TODO

### Manual browser test rule

- **Every release** (deploy to `main` on Vercel/production) must be preceded by a run of [`docs/QA_CHECKLIST.md`](./docs/QA_CHECKLIST.md) — the 30-minute smoke.
- **Every PR that touches auth / payments / notifications / admin** must also run the relevant role section from [`docs/MANUAL_TESTING.md`](./docs/MANUAL_TESTING.md).
- If a manual regression is found, add a Vitest or Playwright test that would have caught it BEFORE fixing the bug.

---

## 📊 PROGRESS.md Update Rule

**Every significant work session gets a chronological log entry in PROGRESS.md.**

Format:
```markdown
### YYYY-MM-DD (session N — brief theme)

- **Feature name**
  - file1.ts — what it does
  - file2.tsx — what it does
  - Brief impact summary
```

Update the Executive Status table when tracks transition from TODO → IN PROGRESS → DONE.

---

## 🔒 Security Rules

- **Never commit secrets** — all API keys go in `.env.local` (gitignored) or Supabase Edge Function secrets
- **All data access goes through RLS** — every Supabase table must have row-level security policies
- **All user inputs are validated** — both client-side (UX) and server-side (security)
- **CSP is enforced** — `index.html` Content-Security-Policy blocks unsafe resources

---

## 📱 Mobile-Web Parity Rule

**Auth and core flows must work identically on web and mobile.**

- `services/authService.ts` (web) and `mobile/src/services/auth.ts` must mirror each other
- Phone normalization, OTP flows, user profile creation must be identical
- Same session tokens work across both platforms

---

## 🌍 i18n Rules

**All user-facing strings go through the translation system.**

- Hard-coded Bengali → `t('key')` with entries in `locales/{bn,en,ar}/common.json`
- New strings get added to ALL 3 language files
- Arabic content triggers `dir="rtl"` automatically

---

## 💿 Database Rules

**All schema changes go through migrations.**

- Never edit `database/schema.sql` directly
- Add `database/migrations/YYYY_MM_DD_description.sql` for new changes
- Migrations must be idempotent (safe to re-run)
- Every new table gets RLS enabled + appropriate policies

---

## 🚫 What NOT to Do

- ❌ Don't edit README manually without updating PROGRESS.md first
- ❌ Don't commit failing tests
- ❌ Don't hardcode Supabase project URLs — use env vars
- ❌ Don't use off-brand colors (anything other than bd-green, brand-*, black, white, gray, amber for warnings, red for destructive)
- ❌ Don't create `.md` files unless explicitly requested by the user
- ❌ Don't make write operations (Jira tickets, Confluence pages, git commits/pushes) without user confirmation

---

## ✅ What TO Do Every Session

1. **Start by reading PROGRESS.md** to understand current state
2. **Update PROGRESS.md** when you complete work
3. **Run `npm run sync-readme`** before final commit if major features shipped
4. **Test the full critical path** for any auth/payment/mobile changes
5. **Ask the founder** about next priorities rather than assuming

---

*Last updated: 2026-08-01*