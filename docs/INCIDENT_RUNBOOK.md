# Madrasa Connect BD — Incident Runbook

## Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **P0 — Critical** | Site down, data loss, security breach | Immediate |
| **P1 — High** | Major feature broken, performance degradation | < 1 hour |
| **P2 — Medium** | Minor feature broken, cosmetic issues | < 4 hours |
| **P3 — Low** | Enhancement, non-urgent fix | Next sprint |

---

## Common Incidents

### 1. Site Down / 502 Error

**Symptoms:** Users can't load the app, Vercel returns 502/503.

**Diagnosis:**
1. Check Vercel dashboard → Deployments → status
2. Check Supabase dashboard → Health → API status
3. Run `curl -I https://madrasaconnectbd.com` to verify

**Resolution:**
- If Vercel issue: wait 5-10 min, redeploy if needed (`vercel --prod --force`)
- If Supabase issue: check status at status.supabase.com, no action possible
- If DNS issue: check Vercel domain settings

---

### 2. Supabase Database Connection Errors

**Symptoms:** "Too many connections", "Connection pool exhausted", slow queries.

**Diagnosis:**
1. Check Supabase Dashboard → Database → Connection pool
2. Check for long-running queries in Database → SQL Editor → Query History

**Resolution:**
- Kill idle connections: `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle' AND query_start < now() - interval '10 minutes';`
- If persistent: Upgrade Supabase plan or reduce connection pool size in client

---

### 3. Authentication Failures

**Symptoms:** Users can't login, "Invalid credentials" errors.

**Diagnosis:**
1. Check Supabase Dashboard → Authentication → Users
2. Check if auth service is running
3. Check browser console for CORS errors

**Resolution:**
- If Supabase Auth is down: wait for recovery
- If CORS issue: check Supabase Auth → Settings → Site URL
- If rate limited: Supabase free tier has 30 requests/min limit

---

### 4. Gemini API Quota Exceeded

**Symptoms:** AI features return errors, moderation fails open.

**Diagnosis:**
1. Check Google AI Studio → Usage
2. Check Edge Function logs in Supabase

**Resolution:**
- If quota exceeded: wait for reset (daily) or upgrade
- If key compromised: rotate key in Google AI Studio → API Keys
- Update `.env` and redeploy

---

### 5. High Error Rate (Sentry Spike)

**Symptoms:** Sentry shows sudden increase in errors.

**Diagnosis:**
1. Open Sentry → Issues → sort by frequency
2. Check if error is new (introduced in recent deploy)
3. Check if error is environmental (Supabase down, network issue)

**Resolution:**
- If deploy-related: rollback to previous deploy
- If environmental: monitor, may resolve automatically
- If code bug: hotfix → commit → push

---

### 6. Slow Performance

**Symptoms:** Pages take > 3s to load, users complain about slowness.

**Diagnosis:**
1. Check Vercel Analytics → Web Vitals
2. Check Supabase Dashboard → Database → Performance
3. Run Lighthouse audit

**Resolution:**
- If bundle size: check recent additions, code-split
- If database: add missing indexes, optimize queries
- If CDN: check Vercel Edge Network status

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| Lead Developer | sakibian |
| Supabase Support | support@supabase.com |
| Vercel Support | vercel.com/support |

## Escalation Path

1. Developer self-resolve (P2/P3)
2. Team lead (P1)
3. External support (P0, infrastructure issues)
