import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFatwaStore } from '../useFatwaStore';

const mockFatwas = [
  { id: '1', question: 'Question 1', category: 'Ibadah' as const, askedBy: 'user1', askedAt: '2024-01-01', status: 'PENDING' as const },
  { id: '2', question: 'Question 2', category: 'Muamalah' as const, askedBy: 'user2', askedAt: '2024-01-02', status: 'ANSWERED' as const, answer: 'Answer here' },
];
const mockPending = [mockFatwas[0]];

vi.mock('../../services/dataService', () => ({
  dataService: {
    getFatwas: vi.fn(() => Promise.resolve(mockFatwas)),
    getPendingFatwas: vi.fn(() => Promise.resolve(mockPending)),
    saveFatwa: vi.fn(() => Promise.resolve()),
    approveFatwa: vi.fn(() => Promise.resolve()),
    rejectFatwa: vi.fn(() => Promise.resolve()),
  },
}));

describe('useFatwaStore', () => {
  beforeEach(() => {
    useFatwaStore.setState({ fatwas: [], pendingFatwas: [], loading: false, error: null });
  });

  it('initializes with empty state', () => {
    const state = useFatwaStore.getState();
    expect(state.fatwas).toEqual([]);
    expect(state.pendingFatwas).toEqual([]);
  });

  it('fetch loads fatwas', async () => {
    await useFatwaStore.getState().fetch();
    expect(useFatwaStore.getState().fatwas).toEqual(mockFatwas);
  });

  it('fetchPending loads pending fatwas', async () => {
    await useFatwaStore.getState().fetchPending();
    expect(useFatwaStore.getState().pendingFatwas).toEqual(mockPending);
  });

  it('ask adds fatwa to list', async () => {
    const newFatwa = { id: '3', question: 'New Q', category: 'Family' as const, askedBy: 'user3', askedAt: '2024-01-03', status: 'PENDING' as const };
    await useFatwaStore.getState().ask(newFatwa);
    expect(useFatwaStore.getState().fatwas).toContainEqual(newFatwa);
  });

  it('approve moves fatwa from pending to answered', async () => {
    useFatwaStore.setState({ fatwas: mockFatwas, pendingFatwas: mockPending });
    await useFatwaStore.getState().approve('1', 'Approved answer', ['src1']);
    expect(useFatwaStore.getState().pendingFatwas).not.toContainEqual(mockFatwas[0]);
    const approved = useFatwaStore.getState().fatwas.find(f => f.id === '1');
    expect(approved?.status).toBe('ANSWERED');
    expect(approved?.answer).toBe('Approved answer');
  });

  it('reject moves fatwa from pending to rejected', async () => {
    useFatwaStore.setState({ fatwas: mockFatwas, pendingFatwas: mockPending });
    await useFatwaStore.getState().reject('1');
    expect(useFatwaStore.getState().pendingFatwas).not.toContainEqual(mockFatwas[0]);
    const rejected = useFatwaStore.getState().fatwas.find(f => f.id === '1');
    expect(rejected?.status).toBe('REJECTED');
  });
});
