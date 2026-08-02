
import { create } from 'zustand';
import { User } from '../types';
import { getCurrentUser, logout as authLogout, login as authLogin, registerUser as authRegister } from '../services/authService';
import { identifyUser, resetUser } from '../services/analytics';
import { dataService } from '../services/dataService';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<User | null>;
  register: (data: { name: string; email: string; password: string; role: 'USER' | 'INSTITUTION'; institutionName?: string }) => Promise<{ user: User; needsVerification: boolean }>;
  logout: () => Promise<void>;
  refreshUser: () => void;
  setUser: (user: User | null) => void;
  cleanup: () => void;
}

let identifiedUserId: string | null = null;

const syncAnalyticsIdentity = (user: User | null) => {
  if (!user) {
    if (identifiedUserId) {
      resetUser();
      identifiedUserId = null;
    }
    return;
  }

  if (identifiedUserId === user.id) return;

  if (identifiedUserId) resetUser();

  identifyUser(user.id, {
    email: user.email,
    name: user.name,
    role: user.role,
  });
  identifiedUserId = user.id;
};

const handleAuthChange = () => {
  useAuthStore.getState().refreshUser();
};

let listenerAttached = false;

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: true,
  initialized: false,

  init: async () => {
    set({ loading: true });
    const { initAuth } = await import('../services/authService');
    await initAuth();
    const user = getCurrentUser();
    syncAnalyticsIdentity(user);
    set({ user, loading: false, initialized: true });

    if (!listenerAttached) {
      window.addEventListener('auth_change', handleAuthChange);
      listenerAttached = true;
    }
  },

  login: async (email: string, password: string) => {
    const result = await authLogin(email, password);
    syncAnalyticsIdentity(result.user);
    set({ user: result.user });
    return result.user;
  },

  register: async (data) => {
    const result = await authRegister(data);
    if (!result.needsVerification) syncAnalyticsIdentity(result.user);
    set({ user: result.user });
    return result;
  },

  logout: async () => {
    await authLogout();
    syncAnalyticsIdentity(null);
    set({ user: null });
  },

  refreshUser: () => {
    const user = getCurrentUser();
    syncAnalyticsIdentity(user);
    set({ user });
  },

  setUser: (user) => {
    syncAnalyticsIdentity(user);
    set({ user });
  },

  cleanup: () => {
    window.removeEventListener('auth_change', handleAuthChange);
    listenerAttached = false;
  },
}));
