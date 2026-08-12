
import { User } from '../types';
import { supabase } from './supabase';

let currentUser: User | null | undefined = undefined;
let initPromise: Promise<void> | null = null;

const fetchUserProfile = async (userId: string): Promise<User | null> => {
  const [profileResult, authResult] = await Promise.all([
    supabase.from('user_profiles').select('*').eq('id', userId).single(),
    supabase.auth.getUser(),
  ]);
  if (!profileResult.data) return null;
  return {
    id: profileResult.data.id,
    name: profileResult.data.name,
    email: authResult.data?.user?.email || '',
    role: profileResult.data.role as User['role'],
    avatar: profileResult.data.avatar_url || undefined,
    institutionName: profileResult.data.institution_name,
    banned: profileResult.data.banned || false,
  };
};

const withTimeout = <T,>(p: Promise<T>, ms: number, label: string): Promise<T> =>
  Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`[auth] ${label} timed out after ${ms}ms`)), ms)
    ),
  ]);

export const initAuth = async (): Promise<void> => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    try {
      const { data: { session }, error } = await withTimeout(
        supabase.auth.getSession(),
        10000,
        'getSession'
      );
      if (error) {
        console.error('[auth] getSession error:', error.message);
      }
      if (session?.user) {
        currentUser = await fetchUserProfile(session.user.id);
      } else {
        currentUser = null;
      }
    } catch (e) {
      console.error('[auth] initAuth failed:', e);
      currentUser = null;
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          currentUser = await fetchUserProfile(session.user.id);
        } else {
          currentUser = null;
        }
      } catch (e) {
        console.error('[auth] onAuthStateChange error:', e);
        currentUser = null;
      }
      window.dispatchEvent(new CustomEvent('auth_change'));
    });
  })();
  return initPromise;
};

export type LoginResult = {
  user: User | null;
  error: string | null;
  needsConfirmation: boolean;
};

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[auth] signInWithPassword error:', error.message, error);
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return { user: null, error: null, needsConfirmation: true };
    }
    if (error.message.toLowerCase().includes('database') || error.message.toLowerCase().includes('schema') || error.status >= 500) {
      return { user: null, error: 'সার্ভার ত্রুটি। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা সাপোর্টের সাথে যোগাযোগ করুন।', needsConfirmation: false };
    }
    return { user: null, error: error.message, needsConfirmation: false };
  }

  if (!data.user) {
    return { user: null, error: 'ইমেইল বা পাসওয়ার্ড ভুল।', needsConfirmation: false };
  }

  const profile = await fetchUserProfile(data.user.id);

  if (profile === null) {
    // Auth succeeded but the profile row is missing — don't report "wrong password".
    await supabase.auth.signOut();
    currentUser = null;
    window.dispatchEvent(new CustomEvent('auth_change'));
    return {
      user: null,
      error: 'আপনার প্রোফাইল পাওয়া যায়নি। অনুগ্রহ করে সাপোর্টের সাথে যোগাযোগ করুন।',
      needsConfirmation: false,
    };
  }

  if (profile.banned) {
    await supabase.auth.signOut();
    currentUser = null;
    window.dispatchEvent(new CustomEvent('auth_change'));
    return {
      user: null,
      error: 'আপনার অ্যাকাউন্ট বন্ধ করা হয়েছে।',
      needsConfirmation: false,
    };
  }

  currentUser = profile;
  window.dispatchEvent(new CustomEvent('auth_change'));
  return { user: currentUser, error: null, needsConfirmation: false };
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'INSTITUTION';
  institutionName?: string;
}): Promise<{ user: User; needsVerification: boolean }> => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name,
        role: userData.role,
        institution_name: userData.institutionName || null,
      } as Record<string, unknown>,
    }
  });
  if (error) throw error;
  if (!data.user) throw new Error('Registration failed');

  // The handle_new_auth_user trigger creates the user_profiles row automatically.
  // Use UPDATE (not INSERT) because there's no INSERT policy on user_profiles.
  const { error: profileError } = await supabase.from('user_profiles').update({
    name: userData.name,
    role: userData.role,
    institution_name: userData.institutionName || null,
    updated_at: new Date().toISOString(),
  }).eq('id', data.user.id);
  if (profileError) throw profileError;

  const user: User = {
    id: data.user.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    avatar: undefined,
    institutionName: userData.institutionName,
  };

  const needsVerification = !data.session;

  if (!needsVerification) {
    currentUser = user;
    window.dispatchEvent(new CustomEvent('auth_change'));
  }

  return { user, needsVerification };
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });
  if (error) throw error;
};

// ---------------------------------------------------------------------------
// Phone / SMS OTP authentication (Supabase Phone Auth)
//
// Why: In Bangladesh, phone-based auth is critical. Millions of madrasa
// students, imams and rural donors don't check email daily but always have a
// mobile phone. Supabase supports this out of the box via Phone Auth — you
// just enable the SMS provider (SSL Wireless / Twilio / MessageBird) in the
// Supabase dashboard.
//
// Phone numbers MUST be sent to Supabase in E.164 format ("+8801XXXXXXXXX").
// This helper normalises Bangladeshi 11-digit ("01XXXXXXXXX") inputs.
// ---------------------------------------------------------------------------

/**
 * Normalise a raw phone string to E.164 format for Bangladesh (+880).
 * Accepts: "01712345678", "1712345678", "+8801712345678", or "8801712345678".
 * Returns null if the number can't be parsed.
 */
export const normalizeBdPhone = (raw: string): string | null => {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  // "01712345678" -> "+8801712345678"
  if (digits.startsWith('01') && digits.length === 11) return `+88${digits}`;
  // "1712345678" -> "+8801712345678"
  if (digits.length === 10 && digits.startsWith('1')) return `+880${digits}`;
  // "8801712345678" -> "+8801712345678"
  if (digits.startsWith('880') && digits.length === 13) return `+${digits}`;
  // Already E.164 (assume caller passed something valid)
  if (raw.startsWith('+') && digits.length >= 11) return `+${digits}`;
  return null;
};

export type OtpResult = { ok: boolean; error: string | null };

/**
 * Send an SMS OTP to a Bangladeshi phone. The number is normalised to E.164.
 * Requires Phone Auth to be enabled in Supabase (Dashboard → Auth → Providers).
 */
export const sendPhoneOtp = async (phone: string): Promise<OtpResult> => {
  const e164 = normalizeBdPhone(phone);
  if (!e164) {
    return { ok: false, error: 'সঠিক বাংলাদেশী ফোন নম্বর দিন (উদাহরণ: 01712345678)' };
  }
  const { error } = await supabase.auth.signInWithOtp({
    phone: e164,
    options: {
      // Create a new auth user automatically if the number is new.
      shouldCreateUser: true,
    },
  });
  if (error) {
    console.error('[auth] sendPhoneOtp error:', error.message);
    return { ok: false, error: error.message };
  }
  return { ok: true, error: null };
};

/**
 * Verify the 6-digit OTP the user received on their phone.
 * On success, Supabase sets a session and our onAuthStateChange listener
 * (in initAuth) will hydrate the profile automatically.
 */
export const verifyPhoneOtp = async (
  phone: string,
  code: string,
  fallbackName?: string
): Promise<LoginResult> => {
  const e164 = normalizeBdPhone(phone);
  if (!e164) {
    return { user: null, error: 'সঠিক বাংলাদেশী ফোন নম্বর দিন।', needsConfirmation: false };
  }
  const { data, error } = await supabase.auth.verifyOtp({
    phone: e164,
    token: code.trim(),
    type: 'sms',
  });
  if (error) {
    return { user: null, error: error.message, needsConfirmation: false };
  }
  if (!data.user) {
    return { user: null, error: 'যাচাইকরণে সমস্যা হয়েছে।', needsConfirmation: false };
  }

  // First-time phone signup — create a default profile row so downstream
  // features (dashboards, notifications) have somewhere to read from.
  let profile = await fetchUserProfile(data.user.id);
  if (!profile) {
    const displayName = (fallbackName?.trim() || `ব্যবহারকারী ${e164.slice(-4)}`);
    await supabase.from('user_profiles').insert({
      id: data.user.id,
      name: displayName,
      role: 'USER',
      phone: e164,
    });
    profile = await fetchUserProfile(data.user.id);
  }

  if (!profile) {
    return {
      user: null,
      error: 'প্রোফাইল তৈরি করা যায়নি। অনুগ্রহ করে সাপোর্টের সাথে যোগাযোগ করুন।',
      needsConfirmation: false,
    };
  }

  if (profile.banned) {
    await supabase.auth.signOut();
    return {
      user: null,
      error: 'আপনার অ্যাকাউন্ট বন্ধ করা হয়েছে।',
      needsConfirmation: false,
    };
  }

  currentUser = profile;
  window.dispatchEvent(new CustomEvent('auth_change'));
  return { user: currentUser, error: null, needsConfirmation: false };
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  currentUser = null;
  window.dispatchEvent(new CustomEvent('auth_change'));
};

export const getCurrentUser = (): User | null => currentUser ?? null;
