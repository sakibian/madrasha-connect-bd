/**
 * NotificationBell — replaces the plain `<Bell>` icon in the Header.
 *
 * - Live unread count badge (from useNotificationStore).
 * - Radix Popover with scrollable grouped list.
 * - Mark-all-read action.
 * - Empty state.
 * - Click a row → mark read + navigate to n.link.
 *
 * Styling: black/white/gray + semantic tokens (info-*, warning-*, danger-*).
 */

import React, { useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Bell, CheckCheck, Inbox, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotificationStore } from '../stores';
import { handleNotificationClick } from '../services/notificationRouter';
import type { AppNotification } from '../types';

const typePalette: Record<AppNotification['type'], string> = {
  job:         'bg-gray-50   text-black',
  community:   'bg-gray-50    text-gray-900',
  application: 'bg-gray-50 text-gray-900',
};

const NotificationBell: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { notifications, unreadCount, fetch, markRead, markAllRead } = useNotificationStore();

  useEffect(() => {
    // First-load fetch is idempotent; other components may have already loaded.
    fetch().catch(() => { /* ignore */ });
  }, [fetch]);

  const handleRowClick = (n: AppNotification) => {
    if (!n.isRead) markRead(n.id).catch(() => { /* ignore */ });
    const to = handleNotificationClick(n.link);
    navigate(to);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="relative min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-500 hover:text-black transition-colors"
          aria-label={t('notifications.bellLabel', 'Notifications')}
          data-testid="notification-bell"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span
              className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-black text-white text-[10px] font-black rounded-full flex items-center justify-center"
              aria-label={`${unreadCount} unread`}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="w-[92vw] max-w-md bg-white border border-gray-200 shadow-2xl z-50 animate-fadeIn"
          data-testid="notification-panel"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-black" />
              <h3 className="text-sm font-extrabold uppercase tracking-widest">
                {t('notifications.title', 'বিজ্ঞপ্তি')}
              </h3>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-black hover:underline"
              >
                <CheckCheck size={12} />
                {t('notifications.markAllRead', 'সব পড়া হয়েছে')}
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[70vh] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center gap-3">
                <Inbox size={32} className="text-gray-300" />
                <p className="text-sm text-gray-500 font-medium">
                  {t('notifications.empty', 'এখনো কোনো বিজ্ঞপ্তি নেই।')}
                </p>
              </div>
            ) : (
              <ul>
                {notifications.map(n => (
                  <li key={n.id}>
                    <button
                      onClick={() => handleRowClick(n)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors flex gap-3 items-start ${
                        n.isRead ? 'opacity-60' : ''
                      }`}
                    >
                      <span
                        className={`shrink-0 mt-0.5 text-[9px] font-black uppercase tracking-widest px-2 py-1 ${typePalette[n.type]}`}
                      >
                        {n.type}
                      </span>
                      <span className="flex-1 min-w-0 space-y-1">
                        <span className="block text-sm font-bold leading-tight truncate">
                          {n.title}
                        </span>
                        <span className="block text-xs text-gray-600 leading-snug line-clamp-2">
                          {n.message}
                        </span>
                        <span className="block text-[10px] text-gray-400 font-medium">
                          {new Date(n.timestamp).toLocaleString('bn-BD')}
                        </span>
                      </span>
                      {n.link && <ArrowRight size={14} className="shrink-0 text-gray-300 mt-1" />}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default NotificationBell;
