
import { supabase } from './supabase';
import { User } from '../types';

// ---------------------------------------------------------------------------
// Email / password (kept for admin & institutional accounts)
// ---------------------------------------------------------------------------

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
};

export const signUp = async (email: string, password: string, name: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// ---------------------------------------------------------------------------
// Phone / SMS OTP (Bangladesh-first authentication)
//
// Mirrors the web app's authService.ts so users can switch seamlessly
// between mobile and web on the same account.
// ---------------------------------------------------------------------------

/** Accepts "01712345678", "+8801712345678", etc. and returns E.164, or null. */
export const normalizeBdPhone = (raw: string): string | null => {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  if (digits.startsWith('01') && digits.length === 11) return `+88${digits}`;
  if (digits.length === 10 && digits.startsWith('1')) return `+880${digits}`;
  if (digits.startsWith('880') && digits.length === 13) return `+${digits}`;
  if (raw.startsWith('+') && digits.length >= 11) return `+${digits}`;
  return null;
};

export type OtpResult = { ok: boolean; error: string | null };

export const sendPhoneOtp = async (phone: string): Promise<OtpResult> => {
  const e164 = normalizeBdPhone(phone);
  if (!e164) {
    return { ok: false, error: 'সঠিক বাংলাদেশী ফোন নম্বর দিন (উদাহরণ: 01712345678)' };
  }
  const { error } = await supabase.auth.signInWithOtp({
    phone: e164,
    options: { shouldCreateUser: true },
  });
  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true, error: null };
};

export const verifyPhoneOtp = async (
  phone: string,
  code: string,
  fallbackName?: string
): Promise<{ user: User | null; error: string | null }> => {
  const e164 = normalizeBdPhone(phone);
  if (!e164) {
    return { user: null, error: 'সঠিক বাংলাদেশী ফোন নম্বর দিন।' };
  }
  const { data, error } = await supabase.auth.verifyOtp({
    phone: e164,
    token: code.trim(),
    type: 'sms',
  });
  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: 'যাচাইকরণে সমস্যা হয়েছে।' };

  // First-time signup: create profile row (safety-net; the DB trigger will
  // also try, so this is idempotent).
  let profile = await fetchProfile(data.user.id);
  if (!profile) {
    const displayName = fallbackName?.trim() || `ব্যবহারকারী ${e164.slice(-4)}`;
    await supabase.from('user_profiles').upsert(
      { id: data.user.id, name: displayName, role: 'USER', phone: e164 },
      { onConflict: 'id' }
    );
    profile = await fetchProfile(data.user.id);
  }
  if (!profile) {
    return { user: null, error: 'প্রোফাইল তৈরি করা যায়নি।' };
  }
  return { user: profile, error: null };
};

// ---------------------------------------------------------------------------

const fetchProfile = async (userId: string): Promise<User | null> => {
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  const { data: authData } = await supabase.auth.getUser();
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    email: authData.user?.email || '',
    role: data.role,
    avatar: data.avatar_url || undefined,
  };
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return null;
  return fetchProfile(session.user.id);
};
