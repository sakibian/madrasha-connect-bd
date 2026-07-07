
import { create } from 'zustand';
import { dataService } from '../services/dataService';
import { Job } from '../types';

interface JobState {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  fetch: () => Promise<void>;
  save: (job: Job) => Promise<void>;
  remove: (id: string) => Promise<void>;
  verify: (id: string) => Promise<void>;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  loading: false,
  error: null,

  fetch: async () => {
    set({ loading: true, error: null });
    try {
      const jobs = await dataService.getJobs();
      set({ jobs, loading: false });
    } catch (e) {
      set({ error: (e as Error).message, loading: false });
    }
  },

  save: async (job) => {
    await dataService.saveJob(job);
    const jobs = await dataService.getJobs();
    set({ jobs });
  },

  remove: async (id) => {
    await dataService.deleteJob(id);
    set((s) => ({ jobs: s.jobs.filter((j) => j.id !== id) }));
  },

  verify: async (id) => {
    await dataService.verifyJob(id);
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, verified: true } : j)),
    }));
  },
}));
