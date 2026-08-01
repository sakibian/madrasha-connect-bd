# 🚀 Deploy Runbook — Madrasa Connect BD

> Exact commands to paste-and-launch. Follow **in order**. Every command is
> idempotent — safe to re-run.
>
> **Owner:** Founder + Ops · **Audience:** anyone deploying a build
> **Last updated:** 2026-08-01 · **Applies to:** commit `main` @ HEAD

---

## 0. Prerequisites (one-time setup)

Install the CLIs:

```bash
# Node/npm — already required for the app.
node --version    # ≥ 20

# Supabase CLI — for db push + functions deploy + secrets.
brew install supabase/tap/supabase          # macOS
# or: npm i -g supabase                     # any platform

# Vercel CLI — for the web frontend.
npm i -g vercel

# web-push — one-shot to generate VAPID keys.
npm i -g web-push
```

Log in:

```bash
supabase login
vercel login
```

Link the repo to your Supabase project + Vercel project (one-time):

```bash
supabase link --project-ref <YOUR_PROJECT_REF>
vercel link
```

Where `<YOUR_PROJECT_REF>` is the letters-and-numbers slug in your Supabase dashboard URL.

---

## 1. Apply database migrations

Every migration under `database/migrations/` is idempotent. Push in order:

```bash
supabase db push
```

Or, if you prefer manual review, apply individually via the SQL editor:

```bash
# Recent migrations (2026-08-01 → 2026-08-07):
# 1. bKash personal-account fallback (widens status/provider CHECKs + index)
# 2. Seerah admin overlay table
# 3. Institutions source tracking columns
# 4. Curriculum tables (levels/subjects/lessons/resources)
# 5. content_cache table for the Islamic content API layer
# 6. push_subscriptions for web-push

psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_02_bkash_personal_fallback.sql
psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_03_content_cache.sql
psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_04_seerah_events.sql
psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_05_institutions_source_tracking.sql
psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_06_curriculum.sql
psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_07_push_subscriptions.sql
```

Verify — should return each migration file name:

```bash
psql "$SUPABASE_DB_URL" -c "\dt content_cache seerah_events push_subscriptions curriculum_levels"
```

---

## 2. Deploy Supabase Edge Functions

The app currently ships **7 edge functions**. Deploy them all:

```bash
supabase functions deploy bkash-checkout
supabase functions deploy content-moderation
supabase functions deploy gemini-proxy
supabase functions deploy quran-proxy
supabase functions deploy prayer-proxy
supabase functions deploy hadith-proxy
supabase functions deploy push-send
supabase functions deploy push-subscribe
```

Or all at once:

```bash
for fn in bkash-checkout content-moderation gemini-proxy quran-proxy prayer-proxy hadith-proxy push-send push-subscribe; do
  supabase functions deploy "$fn"
done
```

---

## 3. Set Supabase secrets (server-side env)

Never commit these to git. Set once — Supabase encrypts them at rest.

### 3a. Islamic content APIs (M14.1)

```bash
# Free — request at https://sunnah.com/developers
supabase secrets set SUNNAH_API_KEY=<your-sunnah-com-key>

# No auth needed for Al-Quran Cloud + Aladhan.
```

### 3b. Web Push notifications (M17.3)

Generate a VAPID keypair (one-time):

```bash
npx web-push generate-vapid-keys
# Copy both keys from the output.
```

Then:

```bash
supabase secrets set \
  VAPID_PUBLIC_KEY=<paste-public-key> \
  VAPID_PRIVATE_KEY=<paste-private-key> \
  VAPID_SUBJECT=mailto:you@madrasa-connect.bd
```

### 3c. bKash — MERCHANT mode (when you have merchant credentials)

```bash
supabase secrets set \
  BKASH_APP_KEY=<from-bkash-merchant-portal> \
  BKASH_APP_SECRET=<from-bkash-merchant-portal> \
  BKASH_USERNAME=<from-bkash-merchant-portal> \
  BKASH_PASSWORD=<from-bkash-merchant-portal> \
  BKASH_ENV=sandbox   # switch to 'production' after passing bKash review
```

### 3c-alt. bKash — PERSONAL mode (until merchant is approved)

```bash
supabase secrets set \
  BKASH_MODE=personal \
  BKASH_PERSONAL_NUMBER=017XXXXXXXX \
  BKASH_PERSONAL_ACCOUNT_NAME="Madrasa Connect BD"
```

To switch back to merchant mode later: `supabase secrets unset BKASH_MODE`.

### 3d. Gemini (AI fatwa suggestions)

```bash
supabase secrets set GEMINI_API_KEY=<from-google-ai-studio>
```

### 3e. Verify

```bash
supabase secrets list
```

You should see every key set above with a masked value.

---

## 4. Set Vercel env vars (client-side / build-time)

Client-side envs (all prefixed `VITE_`) live on Vercel, not Supabase.

```bash
vercel env add VITE_SUPABASE_URL production        # your https://xxx.supabase.co
vercel env add VITE_SUPABASE_ANON_KEY production   # anon public key
vercel env add VITE_VAPID_PUBLIC_KEY production    # SAME public key you set in 3b
vercel env add VITE_SENTRY_DSN production          # optional but recommended
vercel env add VITE_POSTHOG_KEY production         # optional
```

Repeat with `preview` and `development` if you want branch previews.

---

## 5. Build + deploy the frontend

```bash
# Preview deploy first — 30-second smoke.
vercel

# Then production.
vercel --prod
```

The output prints a URL like `https://madrasa-connect-bd.vercel.app`.
Point your custom domain to it via Vercel → Settings → Domains.

---

## 6. Post-deploy smoke test (5 minutes)

Run the shortest check from [`docs/QA_CHECKLIST.md`](./QA_CHECKLIST.md).
At minimum verify:

- [ ] `/` loads without console errors.
- [ ] DevTools → Application → Manifest shows theme `#006a4e` + ≥ 2 icons.
- [ ] DevTools → Application → Service Workers → `sw.js` is `activated`.
- [ ] Log in with a test account → header notification bell renders.
- [ ] Ask a fatwa → success toast → push-permission primer appears.

If anything fails, follow [`docs/ROLLBACK_PROCEDURES.md`](./ROLLBACK_PROCEDURES.md).

---

## 7. Rollback (emergency)

```bash
# Roll the frontend back to the previous production deploy.
vercel rollback

# Roll a bad Edge Function back to the previous version.
supabase functions deploy <function-name> --project-ref <YOUR_PROJECT_REF> \
  --file /path/to/previous/version/index.ts

# Roll a bad DB migration back — every migration in database/migrations/
# is idempotent but NOT auto-reversible. Manual reverse SQL required.
# For safety: never deploy a destructive migration without a reverse script
# in ROLLBACK_PROCEDURES.md.
```

Full rollback playbook: [`docs/ROLLBACK_PROCEDURES.md`](./ROLLBACK_PROCEDURES.md).

---

## 8. Follow-ups (do NOT block deploy)

- Run [`docs/QA_CHECKLIST.md`](./QA_CHECKLIST.md) end-to-end.
- Announce the release in your community channel with a link to `PROGRESS.md`.
- Update `NEXT_STEPS.md` if founder-side unblocks changed.

---

## 🔒 Security reminders

- Never commit `.env.local`, `service_role` key, or any secret to git.
- Rotate the `VAPID_PRIVATE_KEY` if a laptop with it is lost.
- Rotate `SUPABASE_SERVICE_ROLE_KEY` immediately if it appears in any log.

---

_Last verified with a live deploy: 2026-08-01. Re-verify after any major
change to `vite.config.ts`, `supabase/config.toml`, or the migrations folder._
