# Madrasa Connect BD — Rollback Procedures

## Quick Rollback (Vercel)

### Rollback to Previous Deploy
```bash
# List recent deployments
vercel ls

# Rollback to specific deployment
vercel rollback <deployment-url>

# Force redeploy current code
vercel --prod --force
```

### Rollback via Git
```bash
# Revert last commit
git revert HEAD
git push origin main

# Revert to specific commit
git revert <commit-hash>
git push origin main

# Nuclear option: force push (DANGER — use only if revert fails)
git reset --hard <commit-hash>
git push --force origin main
```

---

## Database Rollback

### Restore from Backup
1. Go to Supabase Dashboard → Database → Backups
2. Select the backup point (daily backups retained 7 days on free tier)
3. Click "Restore" — this will overwrite current data

### Manual Data Rollback
```sql
-- Backup a table before changes
CREATE TABLE jobs_backup AS SELECT * FROM jobs;

-- Restore from backup
DELETE FROM jobs;
INSERT INTO jobs SELECT * FROM jobs_backup;
```

---

## Feature Flag Rollback

If a feature is causing issues, disable it:

1. **Demo credentials:** Set `VITE_ENABLE_DEMO=false` in Vercel env vars
2. **Gemini proxy:** Remove the `VITE_GEMINI_PROXY_URL` env var
3. **PWA:** Remove `vite-plugin-pwa` from vite.config.ts plugins

---

## Pre-Deploy Checklist

Before any deploy:
- [ ] Tests pass locally (`npm test`)
- [ ] Build succeeds (`npm run build`)
- [ ] No new env vars needed (or added to Vercel)
- [ ] Database migrations are backwards-compatible
- [ ] Rollback plan documented

## Post-Deploy Verification

After deploy:
- [ ] Site loads at madrasaconnectbd.com
- [ ] Login works
- [ ] Core flows work (job post, fatwa ask, community post)
- [ ] No Sentry errors spike
- [ ] No performance regression (Lighthouse)
