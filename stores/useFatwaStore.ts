
import { create } from 'zustand';
import { dataService } from '../services/dataService';
import { Fatwa } from '../types';

interface FatwaState {
  fatwas: Fatwa[];
  pendingFatwas: Fatwa[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  fetchPending: () => Promise<void>;
  ask: (fatwa: Fatwa) => Promise<void>;
  approve: (id: string, answer: string, sourceIds: string[]) => Promise<void>;
  reject: (id: string) => Promise<void>;
}

export const useFatwaStore = create<FatwaState>((set) => ({
  fatwas: [],
  pendingFatwas: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const fatwas = await dataService.getFatwas();
      set({ fatwas, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  fetchPending: async () => {
    try {
      const pendingFatwas = await dataService.getPendingFatwas();
      set({ pendingFatwas });
    } catch (e) {
      set({ error: (e as Error).message });
    }
  },

  ask: async (fatwa) => {
    await dataService.saveFatwa(fatwa);
    set((s) => ({ fatwas: [fatwa, ...s.fatwas] }));
  },

  approve: async (id, answer, sourceIds) => {
    await dataService.approveFatwa(id, answer, sourceIds);
    set((s) => ({
      pendingFatwas: s.pendingFatwas.filter((f) => f.id !== id),
      fatwas: s.fatwas.map((f) => (f.id === id ? { ...f, status: 'ANSWERED' as const, answer } : f)),
    }));
  },

  reject: async (id) => {
    await dataService.rejectFatwa(id);
    set((s) => ({
      pendingFatwas: s.pendingFatwas.filter((f) => f.id !== id),
      fatwas: s.fatwas.map((f) => (f.id === id ? { ...f, status: 'REJECTED' as const } : f)),
    }));
  },
}));
