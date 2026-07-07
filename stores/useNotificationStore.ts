
import { create } from 'zustand';
import { AppNotification } from '../types';
import { getNotifications, markAsRead, markAllAsRead, clearNotifications } from '../services/notificationService';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  loading: boolean;
  fetch: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  clear: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetch: async () => {
    set({ loading: true });
    const notifications = await getNotifications();
    set({ notifications, unreadCount: notifications.filter((n) => !n.isRead).length, loading: false });
  },

  markRead: async (id) => {
    await markAsRead(id);
    set((s) => {
      const notifications = s.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return { notifications, unreadCount: notifications.filter((n) => !n.isRead).length };
    });
  },

  markAllRead: async () => {
    await markAllAsRead();
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },

  clear: async () => {
    await clearNotifications();
    set({ notifications: [], unreadCount: 0 });
  },
}));

window.addEventListener('notification_update', () => {
  useNotificationStore.getState().fetch();
});
