import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../../../stores/useAuthStore';

const mockUser = { id: '1', name: 'New User', email: 'new@test.com', role: 'USER' as const };

vi.mock('../../../services/authService', () => ({
  getCurrentUser: vi.fn(() => null),
  logout: vi.fn(),
  login: vi.fn(() => Promise.resolve(mockUser)),
  registerUser: vi.fn(() => Promise.resolve({ user: mockUser, needsVerification: false })),
  initAuth: vi.fn(() => Promise.resolve()),
}));

vi.mock('../../../services/dataService', () => ({
  dataService: {},
}));

describe('Registration Flow', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, loading: true, initialized: false });
  });

  it('completes full registration flow', async () => {
    const { register } = useAuthStore.getState();

    const result = await register({
      name: 'New User',
      email: 'new@test.com',
      password: 'password123',
      role: 'USER',
    });

    expect(result.user).toEqual(mockUser);
    expect(result.needsVerification).toBe(false);
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('logs in after registration', async () => {
    await useAuthStore.getState().register({
      name: 'New User', email: 'new@test.com', password: 'pass', role: 'USER',
    });

    const loginUser = await useAuthStore.getState().login('new@test.com', 'pass');
    expect(loginUser).toEqual(mockUser);
  });

  it('logs out and clears session', async () => {
    useAuthStore.setState({ user: mockUser });

    await useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});
