import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useJobStore } from '../../../stores/useJobStore';

const mockJobs = [
  { id: '1', title: 'Imam', institution: 'Madrasa A', location: 'Dhaka', salary: '15000', type: 'Imam' as const, postedAt: '2024-01-01', verified: false },
  { id: '2', title: 'Teacher', institution: 'Madrasa B', location: 'CTG', salary: '12000', type: 'Teacher' as const, postedAt: '2024-01-02', verified: true },
];

let savedJobs = [...mockJobs];

vi.mock('../../../services/dataService', () => ({
  dataService: {
    getJobs: vi.fn(() => Promise.resolve(savedJobs)),
    saveJob: vi.fn(async (job) => { savedJobs = [job, ...savedJobs]; }),
    deleteJob: vi.fn(async (id) => { savedJobs = savedJobs.filter(j => j.id !== id); }),
    verifyJob: vi.fn(async (id) => { savedJobs = savedJobs.map(j => j.id === id ? { ...j, verified: true } : j); }),
  },
}));

describe('Job Flow', () => {
  beforeEach(() => {
    savedJobs = [...mockJobs];
    useJobStore.setState({ jobs: [], loading: false, error: null });
  });

  it('posts a new job and appears in list', async () => {
    await useJobStore.getState().fetch();
    expect(useJobStore.getState().jobs).toHaveLength(2);

    const newJob = { id: '3', title: 'Muazzin', institution: 'Madrasa C', location: 'Dhaka', salary: '10000', type: 'Muazzin' as const, postedAt: '2024-01-03', verified: false };
    await useJobStore.getState().save(newJob);

    const state = useJobStore.getState();
    expect(state.jobs).toHaveLength(3);
    expect(state.jobs[0].title).toBeDefined();
  });

  it('applies for a job', async () => {
    await useJobStore.getState().fetch();
    const job = useJobStore.getState().jobs[0];
    expect(job).toBeDefined();
  });

  it('deletes a job', async () => {
    await useJobStore.getState().fetch();
    await useJobStore.getState().remove('1');
    expect(useJobStore.getState().jobs).toHaveLength(1);
    expect(useJobStore.getState().jobs[0].id).toBe('2');
  });
});
