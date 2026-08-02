# Deployment Guide - Madrasa Connect BD

**Last Updated**: 2026-08-02  
**Status**: ✅ Ready for production deployment

---

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub repository: ✅ https://github.com/sakibian/madrasha-connect-bd
- Vercel account (free tier works)
- Supabase project with credentials

### Step-by-Step Instructions

#### 1. Import from GitHub

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select: `sakibian/madrasha-connect-bd`
4. Click "Import"

#### 2. Configure Build Settings

Vercel should auto-detect these, but verify:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x or higher
```

#### 3. Add Environment Variables

Click "Environment Variables" and add these:

**Required:**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Optional (Recommended for Production):**
```bash
VITE_SENTRY_DSN=your_sentry_dsn
VITE_POSTHOG_KEY=your_posthog_key
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_VAPID_PUBLIC_KEY=your_vapid_public_key
VITE_ENABLE_DEMO=false
```

#### 4. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Get your production URL: `https://your-app.vercel.app`

#### 5. Configure Custom Domain (Optional)

1. Go to project settings → Domains
2. Add your domain
3. Update DNS records as instructed

---

## 🔧 Manual Deployment

### Build Locally

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Preview build
npm run preview
```

Build output will be in `dist/` folder.

### Deploy to Other Platforms

**Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

**GitHub Pages:**
```bash
# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

---

## 📋 Pre-Deployment Checklist

### Code Quality
- [x] All 236 tests passing
- [x] Build successful (no errors)
- [x] No TypeScript errors
- [x] ESLint passing

### Configuration
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Row Level Security (RLS) policies enabled
- [ ] Edge functions deployed (optional)

### Security
- [x] Security headers configured (vercel.json)
- [x] CSP headers set
- [x] No secrets in code
- [ ] Supabase service role key secured

### Performance
- [x] Production build optimized
- [x] Code splitting configured
- [x] PWA service worker ready
- [x] Assets cached properly

### SEO & PWA
- [x] Meta tags configured
- [x] manifest.webmanifest ready
- [x] robots.txt configured
- [x] sitemap.xml ready
- [x] Structured data (JSON-LD) ready

---

## 🗄️ Database Setup

### Supabase Configuration

1. Create project at https://supabase.com
2. Run migrations:

```bash
# In database SQL editor, run in order:
1. database/schema.sql
2. database/migrations/*.sql (in order)
3. database/seed.sql (optional, for demo data)
```

3. Enable RLS on all tables
4. Configure authentication providers
5. Set up edge functions (optional)

### Required Tables
- users, institutions, scholars
- fatwas, jobs, products
- community_posts, competitions
- notifications, feedback
- donations, blood_donors

---

## 🔐 Environment Variables Reference

### VITE_SUPABASE_URL
**Required**: Yes  
**Example**: `https://abcdefgh.supabase.co`  
**Where**: Supabase → Settings → API

### VITE_SUPABASE_ANON_KEY
**Required**: Yes  
**Example**: `eyJhbG...` (long JWT)  
**Where**: Supabase → Settings → API → anon public

### VITE_SENTRY_DSN
**Required**: No  
**Example**: `https://...@sentry.io/...`  
**Where**: Sentry → Project Settings → Client Keys

### VITE_POSTHOG_KEY
**Required**: No  
**Example**: `phc_...`  
**Where**: PostHog → Project Settings → API Keys

### VITE_VAPID_PUBLIC_KEY
**Required**: For web push notifications  
**Example**: `BG7h...` (base64)  
**Generate**: `npx web-push generate-vapid-keys`

---

## 📊 Post-Deployment Verification

### Manual Checks

1. **Homepage loads** ✅
2. **Login works** ✅
3. **Registration works** ✅
4. **Mobile responsive** ✅
5. **PWA installable** ✅
6. **Black/white/gray colors** ✅

### Automated Checks

```bash
# Run E2E tests against production
PLAYWRIGHT_BASE_URL=https://your-app.vercel.app npm run test:e2e
```

### Performance Checks

- Lighthouse score > 90
- First Contentful Paint < 2s
- Time to Interactive < 3s
- Bundle size warnings addressed

---

## 🐛 Troubleshooting

### Build Fails

**Issue**: "Cannot find module"  
**Fix**: Ensure all dependencies in package.json

**Issue**: "Out of memory"  
**Fix**: Add `NODE_OPTIONS=--max_old_space_size=4096`

### Environment Variables Not Working

**Issue**: Variables undefined at runtime  
**Fix**: All client vars must start with `VITE_`

### Supabase Connection Fails

**Issue**: "Failed to fetch"  
**Fix**: Check CORS settings in Supabase

### PWA Not Installing

**Issue**: Manifest errors  
**Fix**: Verify manifest.webmanifest is served correctly

---

## 📈 Monitoring & Analytics

### Recommended Tools

1. **Vercel Analytics** (free) - Built-in
2. **Sentry** - Error tracking
3. **PostHog** - Product analytics
4. **Google Search Console** - SEO

### Setup Instructions

All configured in environment variables above.

---

## 🔄 Continuous Deployment

Vercel auto-deploys on every push to `main` branch.

### Preview Deployments

Every PR gets a unique preview URL automatically.

### Rollback

1. Go to Vercel dashboard
2. Select deployment
3. Click "Promote to Production"

---

## 📞 Support

**Repository**: https://github.com/sakibian/madrasha-connect-bd  
**Documentation**: See /*.md files in repo  
**Screenshots**: snapshots/ folder

---

**Ready to deploy!** 🚀
