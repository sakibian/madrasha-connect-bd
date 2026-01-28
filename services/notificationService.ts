
import { AppNotification } from '../types';

const STORAGE_KEY = 'madrasa_connect_notifications';

export const getNotifications = (): AppNotification[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveNotifications = (notifications: AppNotification[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
};

export const addNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
  const notifications = getNotifications();
  const newNotification: AppNotification = {
    ...notification,
    id: `notif-${Date.now()}`,
    timestamp: Date.now(),
    isRead: false,
  };
  const updated = [newNotification, ...notifications].slice(0, 50); // Keep last 50
  saveNotifications(updated);
  
  // Dispatch custom event for real-time UI updates across components
  window.dispatchEvent(new CustomEvent('notification_update'));
  return newNotification;
};

export const markAsRead = (id: string) => {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, isRead: true } : n);
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent('notification_update'));
};

export const markAllAsRead = () => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, isRead: true }));
  saveNotifications(updated);
  window.dispatchEvent(new CustomEvent('notification_update'));
};

export const clearNotifications = () => {
  saveNotifications([]);
  window.dispatchEvent(new CustomEvent('notification_update'));
};
