
import { create } from 'zustand';
import { User } from '../types';
import { getCurrentUser, logout as authLogout, login as authLogin, registerUser as authRegister } from '../services/authService';
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
    set({ user, loading: false, initialized: true });

    if (!listenerAttached) {
      window.addEventListener('auth_change', handleAuthChange);
      listenerAttached = true;
    }
  },

  login: async (email: string, password: string) => {
    const user = await authLogin(email, password);
    set({ user });
    return user;
  },

  register: async (data) => {
    const result = await authRegister(data);
    set({ user: result.user });
    return result;
  },

  logout: async () => {
    await authLogout();
    set({ user: null });
  },

  refreshUser: () => {
    const user = getCurrentUser();
    set({ user });
  },

  setUser: (user) => set({ user }),

  cleanup: () => {
    window.removeEventListener('auth_change', handleAuthChange);
    listenerAttached = false;
  },
}));
