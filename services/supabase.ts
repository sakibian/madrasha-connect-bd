import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[supabase] FATAL: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not set. ' +
    'Login will not work. Set these in your .env file or Vercel dashboard → Settings → Environment Variables.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
