
import { create } from 'zustand';
import { dataService } from '../services/dataService';
import { Course } from '../types';

interface ContentState {
  articles: Course[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set) => ({
  articles: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const courses = await dataService.getCourses();
      set({ articles: courses, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },
}));
