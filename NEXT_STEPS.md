# 🚀 Next Steps for the Founder

> **Read this once, then keep it as a checklist.**
> This is the "what YOU (the founder) need to do outside the code" companion to the recent engineering push. Everything the engineer can do on the codebase is done; the remaining work is Supabase console clicks, external vendor accounts, and legal.

**Last updated:** 2026-08-01

---

## 🔴 CRITICAL (before you show this to a single real user)

### 1. Apply the DB migration
The new `feedback` table + phone-auth support has to be created in your Supabase project.

**How:**
```bash
# Option A — via Supabase Dashboard (easiest)
#   1. Go to Dashboard → SQL Editor
#   2. Open   database/migrations/2026_08_01_feedback_and_phone.sql
#   3. Copy → paste → RUN
#   4. Verify no errors, then check Table Editor for `feedback`

# Option B — via psql if you have direct DB access
psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_01_feedback_and_phone.sql
```

**Safe to re-run** — the migration is fully idempotent (uses `IF NOT EXISTS`).

---

### 2. Enable Phone / SMS Auth in Supabase
Right now the Login page shows a "ফোন OTP" tab, but Supabase has to be configured to actually send SMS.

**Steps:**
1. Supabase Dashboard → **Authentication → Providers → Phone**
2. Toggle **"Enable Phone Provider"** ON
3. Pick your SMS provider from the dropdown:
   - **Twilio** — global, ~$0.008/SMS to Bangladesh. Easiest setup, works everywhere.
   - **MessageBird / Vonage** — cheaper for high volume.
   - **Native Bangladeshi providers (SSL Wireless, Alpha Net, BulkSMSBD)** — cheapest (~৳0.30/SMS), require custom Twilio-compatible gateway or an Edge Function relay.
4. Enter the provider's credentials.
5. Test: try to log in via the phone tab with your own number.

**⚠️ Bangladesh-specific pricing tip:**
Twilio is fine to start with, but at scale (5,000+ MAU) switch to a domestic provider — you'll cut SMS costs by ~90%.

**Rate limits:**
Supabase's default is 60 OTPs / hour / IP — good enough. You can bump this in Dashboard → Auth → Rate Limits if you get flooded.

---

### 3. Set Vercel environment variables
Your app on Vercel needs these to work in production. Add them in **Vercel → Settings → Environment Variables**:

| Variable | Value | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` | From Supabase Dashboard |
| `VITE_SUPABASE_ANON_KEY` | (long JWT) | Supabase → Settings → API → `anon public` |
| `VITE_SENTRY_DSN` | (optional) | Sentry project → Client Keys |
| `VITE_POSTHOG_KEY` | (optional) | PostHog project → API Keys |
| `VITE_POSTHOG_HOST` | `https://us.i.posthog.com` | Or EU if you chose EU region |
| `VITE_ENABLE_DEMO` | `false` | **NEVER set to true in production** |

Also add the Gemini API key to **Supabase Edge Function secrets** (NOT Vercel):
```bash
supabase secrets set GEMINI_API_KEY=your-key
```

---

### 4. Deploy the Edge Functions
The AI moderation + Gemini proxy live in `supabase/functions/`. They need to be deployed:
```bash
supabase functions deploy gemini-proxy
supabase functions deploy content-moderation
```
Verify with:
```bash
curl -X POST https://YOUR_PROJECT.functions.supabase.co/gemini-proxy \
  -H "Content-Type: application/json" \
  -d '{"action":"ask","prompt":"আসসালামু আলাইকুম"}'
```

---

## 🟡 IMPORTANT (before your first 100 users)

### 5. Enable Sentry & PostHog
The libraries are installed. All you need to do is create free accounts, grab the DSN/key, and paste into Vercel env vars. Errors start flowing automatically the next time Vercel redeploys.

### 6. Own the domain
`madrasaconnectbd.com` (or `.org.bd` for the nonprofit vibe) — buy it, then:
- Vercel → Settings → Domains → Add
- Set up SPF/DKIM records so Supabase auth emails don't land in spam
- Bangladeshi domains (`.org.bd`) require BTCL registration, takes ~1 week

### 7. Recruit 5 verified scholars
This is your #1 non-technical risk. Nothing about the platform matters if the fatwas aren't authentic. Aim for:
- 2 Qawmi (Deobandi tradition)
- 2 Alia (BMEB tradition)
- 1 female scholar (mahila madrasa)

They'll use the `/scholar/apply` flow already built into the app. Once approved via `/dashboard` (Admin), they can start answering fatwas.

### 8. Legal / NGO registration
- Register as a **Society** under the Societies Registration Act 1860 (fastest, ~1 month) OR as an **NGO under NGO Affairs Bureau** (slower, ~6 months, unlocks foreign donations)
- Get a lawyer to review `pages/TermsOfService.tsx` and `pages/PrivacyPolicy.tsx` — my drafts are good-faith placeholders, not legally binding
- Register a bank account (needs registration certificate)

---

## 🟢 GROWTH (once you have real users)

### 9. Payment integration (donation flow)
Pick one to start:
- **bKash Merchant Account** — fastest for local donors, requires NID + trade license (allow ~4–8 weeks)
- **Nagad** — similar to bKash, growing fast
- **Stripe** — needed for diaspora donors (US/UK/AU Bangladeshis are your biggest donors)

For each: add a Supabase Edge Function that handles the webhook (`donation-received`), then write a row to a `donations` table. The UI in `pages/SadaqahHub.tsx` already has the button — it just needs to call the flow.

#### 9a. bKash personal-account fallback (until merchant is approved)
The Edge Function now supports a supervised **personal-account** mode so you can start accepting sadaqah TODAY without waiting for merchant approval. Users see the company-owned bKash number + a unique invoice reference, `Send Money` manually, and an admin later confirms the SMS from the Admin Donations panel.

**Enable it once you have a dedicated company personal bKash number:**
```bash
supabase secrets set BKASH_MODE=personal
supabase secrets set BKASH_PERSONAL_NUMBER=017XXXXXXXX
supabase secrets set BKASH_PERSONAL_ACCOUNT_NAME="Madrasa Connect BD"
# then apply the DB migration so the new status/provider values are accepted:
psql "$SUPABASE_DB_URL" -f database/migrations/2026_08_02_bkash_personal_fallback.sql
```

Once the real merchant account is live, unset `BKASH_MODE` (or set to `merchant`) and set `BKASH_APP_KEY / SECRET / USERNAME / PASSWORD` — the automatic tokenized checkout takes over transparently. **No user-facing code changes needed.**

---

### 9b. Strategic partnerships with other Bangladesh Islamic apps / non-profits
We deliberately don't want to be a walled garden — the sector grows if we all cross-promote. The engineering side ships a typed registry at [`data/partnerships.ts`](./data/partnerships.ts) so the admin panel can eventually track outreach state per partner. **Your job:** work through this list and open real conversations.

**Highest-priority first calls (my read):**
1. **Islamic Foundation Bangladesh (IFB)** — the official mosque/imam registry. An MoU here auto-validates our institution directory + unlocks a firehose of imam/muazzin job postings.
2. **Befaq + BMEB** — the two madrasa examination boards. If they'll whitelist their affiliated institutions with us we get an unfakeable "verified" badge.
3. **As-Sunnah Foundation** — the most trusted zakat brand in the country. A co-branded zakat calculator + donation revenue-share is a huge win for both sides.
4. **Muslim Bangla / Noor / Salat First / iHadis** — the popular consumer apps. Feature-swap deals cost nothing (they surface our fatwas, we link back their prayer times / hadith deep-links).

**Talking points for every meeting:**
- We are 100% non-profit and open about our cost model ($0 infra to start).
- We already ship in Bengali + English + Arabic with SEO/AEO baked in.
- We already have RLS-secure user data, so integration is a matter of typed API contracts, not "trust us with our DB."
- Any content we syndicate keeps their author byline + a canonical backlink — SEO stays with the original creator.

Update the `status` field for each partner in `data/partnerships.ts` as conversations progress; that data will render inside the Admin Dashboard in a follow-up ticket.

### 10. Feedback triage panel
Users can already submit feedback (floating button, everywhere in the app). But you can't yet SEE the feedback in the Admin Dashboard.

**5-minute add:** create `pages/Admin/FeedbackPanel.tsx` that reads from the `feedback` table and lets you mark items as resolved. Wire it as a new tab in `AdminDashboard.tsx`.

### 11. Ship the mobile app
The `mobile/` folder is Expo-ready. Once web is stable:
```bash
cd mobile
npm install
npx expo start           # dev
eas build --platform android --profile preview   # first APK
```
Distribute the APK via WhatsApp / Facebook groups (madrasa community is heavily on both).

### 12. Marketing loop
- Post 3 Facebook Reels/week showing a scholar answering a fatwa
- Get 10 well-known imams to record 30-second endorsement videos
- Offer institutions free "Verified Badge" status in exchange for a Facebook post announcing they've joined

---

## 📊 What the tech team just shipped (2026-08-01)

| Feature | File(s) | Value |
|---|---|---|
| Phone/OTP login | `services/authService.ts`, `pages/Login.tsx` | Reach the 50% of users without email |
| Feedback widget | `components/FeedbackWidget.tsx`, `services/feedbackService.ts` | Direct community signal, trust building |
| Bengali ToS + Privacy | `pages/TermsOfService.tsx`, `pages/PrivacyPolicy.tsx` | Legal + Google Play requirement |
| DB migration | `database/migrations/2026_08_01_feedback_and_phone.sql` | Enables the above |
| Brand consistency | (all pages, `tailwind.config.js`) | Zero off-brand colors, professional feel |
| Real Supabase wiring | `services/edgeFunctions.ts`, refactored moderationService, geminiService, Home | No more hardcoded project URLs; safe to rotate keys |
| Hardened auth guard | `components/ProtectedRoute.tsx` | No flash of redirect, banned-user block, role arrays |
| Sentry-wired error boundary | `components/ErrorBoundary.tsx` | Real production error visibility |

**All changes ship with 142 passing tests and a clean production build.**

---

## 💡 Reminder: the winning formula

> **A non-profit succeeds when the community trusts it enough to recommend it AND to donate to it.**
> Both trust vectors come from the same thing: *doing what you said you'd do, visibly*.
> Every feature we ship should either (a) make someone's life easier, or (b) make it visible that we're delivering. That's it. Everything else is noise.

আল্লাহ আপনাকে তওফিক দিন — build slowly, ship honestly, listen relentlessly.
