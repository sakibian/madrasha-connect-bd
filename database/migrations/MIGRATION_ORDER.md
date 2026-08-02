# MIGRATION ORDER - Run in This Sequence

## Prerequisites
Your main `database/schema.sql` should already be applied to create base tables.

If not, run `database/schema.sql` first in Supabase SQL Editor.

---

## Migration Sequence

### Step 0: Run Fixes First ✅
```sql
-- File: 000_FIXES_run_first.sql
-- Creates helper functions that other migrations need
```

### Step 1: Donations & Admin Feedback
```sql
-- File: 2026_08_01_donations_and_admin.sql
-- Creates donations table and admin feedback helpers
```

### Step 2: Feedback & Phone
```sql  
-- File: 2026_08_01_feedback_and_phone.sql
-- Adds feedback system and phone auth support
```

### Step 3: bKash Fallback
```sql
-- File: 2026_08_02_bkash_personal_fallback.sql
-- SKIP if you get "provider column doesn't exist" error
-- This is optional - only needed if using personal bKash accounts
```

### Step 4: Content Cache
```sql
-- File: 2026_08_03_content_cache.sql
-- Adds content caching tables
```

### Step 5: Seerah Events
```sql
-- File: 2026_08_04_seerah_events.sql
-- Adds seerah timeline events table
```

### Step 6: Institutions Source Tracking
```sql
-- File: 2026_08_05_institutions_source_tracking.sql
-- Adds source tracking for institution imports
```

### Step 7: Curriculum
```sql
-- File: 2026_08_06_curriculum.sql
-- Adds Deen101 curriculum tables
```

### Step 8: Push Subscriptions
```sql
-- File: 2026_08_07_push_subscriptions.sql
-- Adds web push notification subscriptions
-- Should work now with current_user_id() function
```

### Step 9: Blood Donors (Session 13)
```sql
-- File: 2026_08_01_blood_donors.sql
-- Adds blood donor registration and search
```

### Step 10: Competitions (Session 13)
```sql
-- File: 2026_08_02_competitions.sql
-- Adds competitions and registrations tables
```

### Step 11: Sadaqah Funding (Session 13)
```sql
-- File: 2026_08_02_sadaqah_funding_applications.sql
-- Adds sadaqah funding application system
```

### Step 12: Badge Auto-Awards (Session 14)
```sql
-- File: 2026_08_02_badge_auto_awards.sql (UPDATED VERSION)
-- Adds automatic badge awarding on XP milestones
-- Note: XP column must exist in user_profiles
```

---

## Common Errors & Fixes

### Error: "function current_user_id() does not exist"
**Fix:** Run `000_FIXES_run_first.sql` first

### Error: "column provider does not exist"
**Fix:** Skip the bKash personal fallback migration (optional feature)

### Error: "column xp does not exist"  
**Fix:** Check your user_profiles table structure
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND table_schema = 'public';
```

The XP column might be named:
- `xp` (expected)
- `points` 
- `experience`
- Or might not exist yet

If it doesn't exist, you need to add it:
```sql
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
```

### Error: "column user_id does not exist" in donations
**Fix:** The column is called `donor_id`, not `user_id`
This should be fixed in the migration file already.

---

## Verification

After all migrations, verify tables exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected new tables:
- blood_donors
- competitions
- competition_registrations  
- sadaqah_funding_applications
- user_badges (if not already exists)

---

## Still Having Issues?

1. Check main schema.sql was run first
2. Ensure RLS is enabled on all tables
3. Check Supabase logs for detailed errors
4. Run migrations one at a time, not all at once
