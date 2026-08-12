import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[supabase] WARNING: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set. ' +
    'Login and data features will not work. Set these in your Vercel dashboard → Settings → Environment Variables.'
  );
}

// Use placeholder values so the app doesn't crash on import when env vars
// are missing (e.g., during Vercel build before env vars are configured).
// All Supabase calls will fail gracefully with auth errors.
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

export { supabase };
