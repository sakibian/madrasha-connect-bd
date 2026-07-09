import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';

const mockUser = { id: '1', name: 'Test', email: 'test@test.com', role: 'USER' as const };

vi.mock('../../services/authService', () => ({
  getCurrentUser: vi.fn(() => null),
  logout: vi.fn(),
  login: vi.fn(() => Promise.resolve(mockUser)),
  registerUser: vi.fn(() => Promise.resolve({ user: mockUser, needsVerification: false })),
  initAuth: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../services/dataService', () => ({
  dataService: {},
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: true, initialized: false });
  });

  it('initializes with null user and loading true', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.loading).toBe(true);
    expect(state.initialized).toBe(false);
  });

  it('login sets user', async () => {
    const { login } = useAuthStore.getState();
    const user = await login('test@test.com', 'password');
    expect(user).toEqual(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('logout clears user', async () => {
    useAuthStore.setState({ user: mockUser });
    const { logout } = useAuthStore.getState();
    await logout();
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('register sets user', async () => {
    const { register } = useAuthStore.getState();
    const result = await register({ name: 'Test', email: 'test@test.com', password: 'pass', role: 'USER' });
    expect(result.user).toEqual(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('setUser updates user', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('setUser sets null', () => {
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('init fetches user and sets initialized', async () => {
    const { init } = useAuthStore.getState();
    await init();
    expect(useAuthStore.getState().initialized).toBe(true);
    expect(useAuthStore.getState().loading).toBe(false);
  });
});
