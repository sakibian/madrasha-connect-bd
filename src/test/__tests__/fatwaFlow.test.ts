import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFatwaStore } from '../../../stores/useFatwaStore';

const mockFatwas = [
  { id: '1', question: 'Is this halal?', category: 'Ibadah' as const, askedBy: 'user1', askedAt: '2024-01-01', status: 'PENDING' as const },
  { id: '2', question: 'What about that?', category: 'Muamalah' as const, askedBy: 'user2', askedAt: '2024-01-02', status: 'ANSWERED' as const, answer: 'It is permissible.' },
];

let fatwas = [...mockFatwas];
let pendingFatwas = [mockFatwas[0]];

vi.mock('../../../services/dataService', () => ({
  dataService: {
    getFatwas: vi.fn(() => Promise.resolve(fatwas)),
    getPendingFatwas: vi.fn(() => Promise.resolve(pendingFatwas)),
    saveFatwa: vi.fn(async (f) => { fatwas = [f, ...fatwas]; }),
    approveFatwa: vi.fn(async (id, answer) => {
      pendingFatwas = pendingFatwas.filter(f => f.id !== id);
      fatwas = fatwas.map(f => f.id === id ? { ...f, status: 'ANSWERED' as const, answer } : f);
    }),
    rejectFatwa: vi.fn(async (id) => {
      pendingFatwas = pendingFatwas.filter(f => f.id !== id);
      fatwas = fatwas.map(f => f.id === id ? { ...f, status: 'REJECTED' as const } : f);
    }),
  },
}));

describe('Fatwa Flow', () => {
  beforeEach(() => {
    fatwas = [...mockFatwas];
    pendingFatwas = [mockFatwas[0]];
    useFatwaStore.setState({ fatwas: [], pendingFatwas: [], loading: false, error: null });
  });

  it('asks a fatwa and appears in list', async () => {
    const newFatwa = { id: '3', question: 'New question?', category: 'Family' as const, askedBy: 'user3', askedAt: '2024-01-03', status: 'PENDING' as const };
    await useFatwaStore.getState().ask(newFatwa);
    expect(useFatwaStore.getState().fatwas).toContainEqual(newFatwa);
  });

  it('moderator sees pending fatwas', async () => {
    await useFatwaStore.getState().fetchPending();
    expect(useFatwaStore.getState().pendingFatwas).toHaveLength(1);
    expect(useFatwaStore.getState().pendingFatwas[0].question).toBe('Is this halal?');
  });

  it('scholar approves fatwa with answer', async () => {
    await useFatwaStore.getState().fetch();
    await useFatwaStore.getState().fetchPending();
    await useFatwaStore.getState().approve('1', 'Yes, it is halal.', ['src1']);

    const state = useFatwaStore.getState();
    expect(state.pendingFatwas).toHaveLength(0);
    const approved = state.fatwas.find(f => f.id === '1');
    expect(approved?.status).toBe('ANSWERED');
    expect(approved?.answer).toBe('Yes, it is halal.');
  });

  it('scholar rejects fatwa', async () => {
    await useFatwaStore.getState().fetch();
    await useFatwaStore.getState().fetchPending();
    await useFatwaStore.getState().reject('1');

    const state = useFatwaStore.getState();
    expect(state.pendingFatwas).toHaveLength(0);
    const rejected = state.fatwas.find(f => f.id === '1');
    expect(rejected?.status).toBe('REJECTED');
  });
});
