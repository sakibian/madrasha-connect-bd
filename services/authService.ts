
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

export const initAuth = async (): Promise<void> => {
  if (initPromise) return initPromise;
  initPromise = (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      currentUser = await fetchUserProfile(session.user.id);
    } else {
      currentUser = null;
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        currentUser = await fetchUserProfile(session.user.id);
      } else {
        currentUser = null;
      }
      window.dispatchEvent(new CustomEvent('auth_change'));
    });
  })();
  return initPromise;
};

export const login = async (email: string, password: string): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return null;

  const profile = await fetchUserProfile(data.user.id);
  if (profile?.banned) {
    await supabase.auth.signOut();
    currentUser = null;
    window.dispatchEvent(new CustomEvent('auth_change'));
    return null;
  }

  currentUser = profile;
  window.dispatchEvent(new CustomEvent('auth_change'));
  return currentUser;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'INSTITUTION';
  institutionName?: string;
}): Promise<User> => {
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

  currentUser = user;
  window.dispatchEvent(new CustomEvent('auth_change'));
  return user;
};

export const logout = async (): Promise<void> => {
  await supabase.auth.signOut();
  currentUser = null;
  window.dispatchEvent(new CustomEvent('auth_change'));
};

export const getCurrentUser = (): User | null => currentUser ?? null;
