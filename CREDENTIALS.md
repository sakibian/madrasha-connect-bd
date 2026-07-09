# Madrasa Connect BD — Integrations & Credentials

> Single source of truth for all external services, API keys, and env configuration.
> **NEVER commit actual secrets to git.** This file tracks what's needed and where.

---

## Services Overview

| # | Service | Purpose | Status | Free Tier |
|---|---------|---------|--------|-----------|
| 1 | Supabase | Database, Auth, Storage, Edge Functions, Realtime | ✅ Active | 500MB DB, 1GB Storage, 50K MAU |
| 2 | Vercel | Web hosting, CI/CD, Serverless | ✅ Active | 100GB bandwidth |
| 3 | Google Gemini | AI moderation, fatwa assistant, search | ⚙️ Needs key | 60 req/min |
| 4 | Sentry | Error monitoring & replay | ⚙️ Needs setup | 5K errors/mo |
| 5 | PostHog | Product analytics | ⚙️ Needs setup | 1M events/mo |
| 6 | Expo | Mobile app build & push notifications | ⚙️ Needs account | Free builds |
| 7 | Better Uptime | Uptime monitoring | ⚙️ Needs setup | 5 monitors |

---

## Environment Variables

### Web App (Vercel / Vite)

| Variable | Where to get it | Value | Status |
|----------|-----------------|-------|--------|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL | `https://qazcxnldkrklxdmunfgj.supabase.co` | ✅ Set in `.env.local` |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public | `eyJ...` (full key in .env.local) | ✅ Set in `.env.local` |
| `VITE_SENTRY_DSN` | Sentry → Project Settings → Client Keys (DSN) | — | ⚙️ Not set |
| `VITE_POSTHOG_KEY` | PostHog → Project Settings → API Keys | — | ⚙️ Not set |
| `VITE_POSTHOG_HOST` | PostHog → Project Settings → API Host | `https://us.i.posthog.com` | ⚙️ Not set |
| `VITE_ENABLE_DEMO` | Feature flag — set to `true` for dev/demo only | `false` | ✅ Default false |

### Mobile App (Expo)

| Variable | Where to get it | Value | Status |
|----------|-----------------|-------|--------|
| `EXPO_PUBLIC_SUPABASE_URL` | Same as `VITE_SUPABASE_URL` | `https://qazcxnldkrklxdmunfgj.supabase.co` | ✅ Set in `.env.example` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Same as `VITE_SUPABASE_ANON_KEY` | (same key) | ✅ Set in `.env.example` |

### Supabase Edge Functions (Deno)

| Variable | Where to get it | Value | Status |
|----------|-----------------|-------|--------|
| `GEMINI_API_KEY` | Google AI Studio → API Keys | — | ⚙️ Not set |

Set via: `supabase secrets set GEMINI_API_KEY=your-key`

---

## Step-by-Step Setup Guide

### Step 1: Supabase (Already done ✅)

Project: `https://qazcxnldkrklxdmunfgj.supabase.co`

- [x] Database schema created
- [x] RLS policies configured
- [x] Auth enabled
- [x] Storage buckets created
- [ ] Run `push_tokens` table migration (from `database/schema.sql`)
- [ ] Set Edge Function secrets:
  ```bash
  supabase secrets set GEMINI_API_KEY=your-gemini-key
  ```

### Step 2: Vercel (Already done ✅)

Project linked to `sakibian/madrasha-connect-bd`

- [x] Auto-deploys from `main` branch
- [x] Security headers configured in `vercel.json`
- [ ] Add env vars in Vercel Dashboard → Settings → Environment Variables:
  ```
  VITE_SUPABASE_URL=https://qazcxnldkrklxdmunfgj.supabase.co
  VITE_SUPABASE_ANON_KEY=<your-anon-key>
  VITE_ENABLE_DEMO=false
  ```

### Step 3: Google Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Click "Create API Key"
3. Copy the key
4. Set in Supabase: `supabase secrets set GEMINI_API_KEY=your-key`
5. The Edge Functions (`gemini-proxy`, `content-moderation`) will use it automatically

### Step 4: Sentry (Error Monitoring)

1. Go to https://sentry.io → Sign up
2. Create new project → React
3. Copy the DSN from project settings
4. Add to Vercel:
   ```
   VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
   ```
5. Errors will start appearing automatically

### Step 5: PostHog (Analytics)

1. Go to https://posthog.com → Sign up
2. Create project → Copy API key
3. Add to Vercel:
   ```
   VITE_POSTHOG_KEY=phc_xxxxx
   VITE_POSTHOG_HOST=https://us.i.posthog.com
   ```
4. Analytics will start tracking automatically

### Step 6: Expo (Mobile Builds)

1. Go to https://expo.dev → Sign up
2. Install CLI: `npm install -g eas-cli`
3. Login: `eas login`
4. Configure: `eas build:configure`
5. Build Android APK: `eas build --platform android --profile preview`
6. Build iOS: `eas build --platform ios --profile preview`

### Step 7: Better Uptime (Optional)

1. Go to https://betterstack.com → Sign up
2. Add monitor for `https://madrasaconnectbd.com`
3. Add monitor for `https://qazcxnldkrklxdmunfgj.supabase.co/rest/v1/`

---

## Quick Reference — Where Keys Live

| Key | Stored in | Gitignored? |
|-----|-----------|-------------|
| Supabase URL | `.env.local`, Vercel env | ✅ Yes |
| Supabase Anon Key | `.env.local`, Vercel env | ✅ Yes |
| Gemini API Key | Supabase Edge Function secrets | ✅ Yes |
| Sentry DSN | Vercel env | ✅ Yes |
| PostHog Key | Vercel env | ✅ Yes |
| Expo Token | `~/.netrc` (local) | ✅ Yes |

---

## Verification Checklist

After setting all env vars, verify:

```bash
# Web app works
npm run dev

# Mobile app works
cd mobile && npx expo start

# Tests pass
npm test

# Build succeeds
npm run build

# Edge functions work
supabase functions serve gemini-proxy
curl -X POST http://localhost:54321/functions/v1/gemini-proxy \
  -H "Content-Type: application/json" \
  -d '{"prompt": "test"}'
```
