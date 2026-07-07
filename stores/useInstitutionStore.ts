
import { create } from 'zustand';
import { dataService } from '../services/dataService';
import { Institution } from '../types';

interface InstitutionState {
  institutions: Institution[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useInstitutionStore = create<InstitutionState>((set) => ({
  institutions: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const institutions = await dataService.getInstitutions();
      set({ institutions, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
