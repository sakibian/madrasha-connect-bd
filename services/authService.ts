
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
  });
  if (error) throw error;
  if (!data.user) throw new Error('Registration failed');

  const { error: profileError } = await supabase.from('user_profiles').insert({
    id: data.user.id,
    name: userData.name,
    role: userData.role,
    institution_name: userData.institutionName || null,
  });
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

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  currentUser = null;
  window.dispatchEvent(new CustomEvent('auth_change'));
};

export const getCurrentUser = (): User | null => currentUser ?? null;
