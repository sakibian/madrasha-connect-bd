import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useJobStore } from '../../../stores/useJobStore';

let jobs = [
  { id: '1', title: 'Imam', institution: 'Madrasa A', location: 'Dhaka', salary: '15000', type: 'Imam' as const, postedAt: '2024-01-01', verified: false },
  { id: '2', title: 'Teacher', institution: 'Madrasa B', location: 'CTG', salary: '12000', type: 'Teacher' as const, postedAt: '2024-01-02', verified: false },
];

vi.mock('../../../services/dataService', () => ({
  dataService: {
    getJobs: vi.fn(() => Promise.resolve(jobs)),
    verifyJob: vi.fn(async (id) => { jobs = jobs.map(j => j.id === id ? { ...j, verified: true } : j); }),
    deleteJob: vi.fn(),
  },
}));

describe('Admin Verification Workflow', () => {
  beforeEach(() => {
    jobs = [
      { id: '1', title: 'Imam', institution: 'Madrasa A', location: 'Dhaka', salary: '15000', type: 'Imam' as const, postedAt: '2024-01-01', verified: false },
      { id: '2', title: 'Teacher', institution: 'Madrasa B', location: 'CTG', salary: '12000', type: 'Teacher' as const, postedAt: '2024-01-02', verified: false },
    ];
    useJobStore.setState({ jobs: [], loading: false, error: null });
  });

  it('admin verifies a job listing', async () => {
    await useJobStore.getState().fetch();
    expect(useJobStore.getState().jobs[0].verified).toBe(false);

    await useJobStore.getState().verify('1');
    expect(useJobStore.getState().jobs[0].verified).toBe(true);
  });

  it('admin verifies multiple jobs', async () => {
    await useJobStore.getState().fetch();
    await useJobStore.getState().verify('1');
    await useJobStore.getState().verify('2');

    const allVerified = useJobStore.getState().jobs.every(j => j.verified);
    expect(allVerified).toBe(true);
  });

  it('admin deletes a job listing', async () => {
    await useJobStore.getState().fetch();
    await useJobStore.getState().remove('1');
    expect(useJobStore.getState().jobs).toHaveLength(1);
    expect(useJobStore.getState().jobs[0].id).toBe('2');
  });
});
