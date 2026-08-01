/**
 * Notification click handler — the ONE routing logic used by:
 *   1. The in-app `<NotificationBell />` list rows.
 *   2. The service worker `notificationclick` handler in `public/sw.js`
 *      (via `clients.openWindow(url)` — same logic, different runtime).
 *
 * Keeping it in one place means we can add analytics, deep-link parsing,
 * or auth-gated routes without touching either surface.
 */

export function handleNotificationClick(link?: string): string {
  if (!link) return '/';
  // If it's an absolute URL to our own origin, extract the path so react-router can pick it up.
  try {
    const u = new URL(link, window.location.origin);
    if (u.origin === window.location.origin) return u.pathname + u.search + u.hash;
    return link;
  } catch {
    return link.startsWith('/') ? link : `/${link}`;
  }
}
