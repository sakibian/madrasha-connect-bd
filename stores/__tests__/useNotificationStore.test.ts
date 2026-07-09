import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useNotificationStore } from '../useNotificationStore';

const mockNotifications = [
  { id: '1', title: 'New Job', message: 'Job posted', timestamp: 1000, isRead: false, type: 'job' as const },
  { id: '2', title: 'Update', message: 'Profile updated', timestamp: 2000, isRead: true, type: 'community' as const },
  { id: '3', title: 'Alert', message: 'New message', timestamp: 3000, isRead: false, type: 'application' as const },
];

vi.mock('../../services/notificationService', () => ({
  getNotifications: vi.fn(() => Promise.resolve(mockNotifications)),
  markAsRead: vi.fn(() => Promise.resolve()),
  markAllAsRead: vi.fn(() => Promise.resolve()),
  clearNotifications: vi.fn(() => Promise.resolve()),
}));

describe('useNotificationStore', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [], unreadCount: 0, loading: false });
  });

  it('initializes with empty notifications', () => {
    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([]);
    expect(state.unreadCount).toBe(0);
  });

  it('fetch loads notifications and counts unread', async () => {
    await useNotificationStore.getState().fetch();
    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual(mockNotifications);
    expect(state.unreadCount).toBe(2);
  });

  it('markRead marks single notification as read', async () => {
    useNotificationStore.setState({ notifications: mockNotifications });
    await useNotificationStore.getState().markRead('1');
    const state = useNotificationStore.getState();
    expect(state.notifications.find(n => n.id === '1')?.isRead).toBe(true);
    expect(state.unreadCount).toBe(1);
  });

  it('markAllRead marks all as read', async () => {
    useNotificationStore.setState({ notifications: mockNotifications, unreadCount: 2 });
    await useNotificationStore.getState().markAllRead();
    const state = useNotificationStore.getState();
    expect(state.notifications.every(n => n.isRead)).toBe(true);
    expect(state.unreadCount).toBe(0);
  });

  it('clear empties notifications', async () => {
    useNotificationStore.setState({ notifications: mockNotifications, unreadCount: 2 });
    await useNotificationStore.getState().clear();
    const state = useNotificationStore.getState();
    expect(state.notifications).toEqual([]);
    expect(state.unreadCount).toBe(0);
  });
});
