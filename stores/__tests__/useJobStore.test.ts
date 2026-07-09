import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useJobStore } from '../useJobStore';

const mockJobs = [
  { id: '1', title: 'Imam', institution: 'Madrasa', location: 'Dhaka', salary: '15000', type: 'Imam', postedAt: '2024-01-01', verified: false },
  { id: '2', title: 'Teacher', institution: 'School', location: 'CTG', salary: '12000', type: 'Teacher', postedAt: '2024-01-02', verified: true },
];

vi.mock('../../services/dataService', () => ({
  dataService: {
    getJobs: vi.fn(() => Promise.resolve(mockJobs)),
    saveJob: vi.fn(() => Promise.resolve()),
    deleteJob: vi.fn(() => Promise.resolve()),
    verifyJob: vi.fn(() => Promise.resolve()),
  },
}));

describe('useJobStore', () => {
  beforeEach(() => {
    useJobStore.setState({ jobs: [], loading: false, error: null });
  });

  it('initializes with empty jobs', () => {
    expect(useJobStore.getState().jobs).toEqual([]);
    expect(useJobStore.getState().loading).toBe(false);
    expect(useJobStore.getState().error).toBeNull();
  });

  it('fetch loads jobs', async () => {
    await useJobStore.getState().fetch();
    const state = useJobStore.getState();
    expect(state.jobs).toEqual(mockJobs);
    expect(state.loading).toBe(false);
  });

  it('fetch sets loading state', () => {
    const fetchPromise = useJobStore.getState().fetch();
    expect(useJobStore.getState().loading).toBe(true);
    return fetchPromise;
  });

  it('save refreshes jobs list', async () => {
    await useJobStore.getState().save({ id: '3', title: 'Muazzin', institution: 'Moscow', location: 'Dhaka', salary: '10000', type: 'Muazzin', postedAt: '2024-01-03', verified: false });
    const state = useJobStore.getState();
    expect(state.jobs).toEqual(mockJobs);
  });

  it('remove deletes job from local state', async () => {
    useJobStore.setState({ jobs: mockJobs });
    await useJobStore.getState().remove('1');
    expect(useJobStore.getState().jobs).toEqual([mockJobs[1]]);
  });

  it('verify marks job as verified', async () => {
    useJobStore.setState({ jobs: mockJobs });
    await useJobStore.getState().verify('1');
    const job = useJobStore.getState().jobs.find(j => j.id === '1');
    expect(job?.verified).toBe(true);
  });
});
