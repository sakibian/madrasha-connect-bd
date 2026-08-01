/**
 * Server-side push notification triggers.
 *
 * Thin wrapper around the `push-send` Edge Function. Feature code (services,
 * stores, admin actions) should never call the Edge Function directly — go
 * through here so:
 *   1. Logging + Sentry error capture happens in one place.
 *   2. We can add rate limiting, batching, or de-dup later without touching
 *      call-sites.
 *   3. Failures are silent from the caller's point of view — a missing push
 *      should never break the primary business flow.
 *
 * Payload contract mirrors the SW `push` event handler in public/sw.js:
 *   { title, body, url? }
 */

import { callEdgeFunction } from './edgeFunctions';

export interface PushPayload {
  /** Target user id (auth.users.id). */
  userId: string;
  title: string;
  body: string;
  /** Optional deep-link — clicked notification navigates here. */
  url?: string;
}

/**
 * Fire-and-forget. Never throws.
 * Returns true on 2xx from the Edge Function, false on any error.
 */
export async function sendPushNotification(payload: PushPayload): Promise<boolean> {
  try {
    const res = await callEdgeFunction<{ ok?: boolean; sent?: number; error?: string }>(
      'push-send',
      payload,
    );
    if (!res) return false;
    if (res.error) {
      // 503 = VAPID not configured; log once so devs notice but don't error-toast.
      console.warn('[pushNotify] push-send:', res.error);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('[pushNotify] transport error:', e);
    return false;
  }
}

/**
 * Convenience helper: fire pushes to many recipients in parallel.
 * Silently swallows individual failures.
 */
export async function sendPushToMany(
  recipients: Array<Omit<PushPayload, 'title' | 'body' | 'url'>>,
  common: Omit<PushPayload, 'userId'>,
): Promise<{ sent: number; failed: number }> {
  const results = await Promise.allSettled(
    recipients.map(r => sendPushNotification({ ...common, userId: r.userId })),
  );
  let sent = 0;
  let failed = 0;
  for (const r of results) {
    if (r.status === 'fulfilled' && r.value) sent++;
    else failed++;
  }
  return { sent, failed };
}
