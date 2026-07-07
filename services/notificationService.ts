
import { AppNotification } from '../types';
import { supabase } from './supabase';

let realtimeChannel: any = null;

export const initNotifications = async (userId: string) => {
  if (realtimeChannel) {
    await supabase.removeChannel(realtimeChannel);
  }

  realtimeChannel = supabase
    .channel('notifications')
    .on('postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      () => {
        window.dispatchEvent(new CustomEvent('notification_update'));
      }
    )
    .subscribe();
};

export const cleanupNotifications = async () => {
  if (realtimeChannel) {
    await supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
};

export const getNotifications = async (): Promise<AppNotification[]> => {
  const user = (await supabase.auth.getSession()).data.session?.user;
  if (!user) return [];

  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return [];

  return data.map(n => ({
    id: n.id,
    title: n.title,
    message: n.message,
    timestamp: new Date(n.created_at).getTime(),
    isRead: n.is_read,
    type: n.type as AppNotification['type'],
    link: n.link || undefined,
  }));
};

export const addNotification = async (notification: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
  const user = (await supabase.auth.getSession()).data.session?.user;
  if (!user) return;

  await supabase.from('notifications').insert({
    user_id: user.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    link: notification.link || null,
  });
};

export const markAsRead = async (id: string) => {
  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);
  window.dispatchEvent(new CustomEvent('notification_update'));
};

export const markAllAsRead = async () => {
  const user = (await supabase.auth.getSession()).data.session?.user;
  if (!user) return;

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .is('is_read', false);
  window.dispatchEvent(new CustomEvent('notification_update'));
};

export const clearNotifications = async () => {
  const user = (await supabase.auth.getSession()).data.session?.user;
  if (!user) return;

  await supabase
    .from('notifications')
    .delete()
    .eq('user_id', user.id);
  window.dispatchEvent(new CustomEvent('notification_update'));
};
