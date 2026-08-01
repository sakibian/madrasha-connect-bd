/**
 * Typed toast wrapper — the ONE way we surface transient messages.
 *
 * Never import `sonner` directly from feature code. Import from here so we
 * can swap the underlying lib in one place, add analytics, or add i18n keys
 * without touching every call-site.
 *
 * Usage:
 *   import { toast } from '../services/toast';
 *   toast.success('সফলভাবে সংরক্ষিত!');
 *   toast.error(err);
 *   await toast.promise(saveFatwa(x), {
 *     loading: 'সংরক্ষণ হচ্ছে…',
 *     success: 'ফতোয়া প্রকাশিত হয়েছে',
 *     error: 'প্রকাশ ব্যর্থ হয়েছে',
 *   });
 */

import { toast as sonner } from 'sonner';

/** Normalise anything (Error, string, unknown) into a user-safe message. */
function messageOf(input: unknown): string {
  if (!input) return 'কিছু একটা ভুল হয়েছে।';
  if (typeof input === 'string') return input;
  if (input instanceof Error) return input.message || 'কিছু একটা ভুল হয়েছে।';
  if (typeof input === 'object' && 'message' in input) {
    return String((input as { message: unknown }).message);
  }
  return 'কিছু একটা ভুল হয়েছে।';
}

export const toast = {
  success(message: string, description?: string) {
    return sonner.success(message, description ? { description } : undefined);
  },
  error(input: unknown, description?: string) {
    return sonner.error(messageOf(input), description ? { description } : undefined);
  },
  info(message: string, description?: string) {
    return sonner.info?.(message, description ? { description } : undefined)
      ?? sonner(message, description ? { description } : undefined);
  },
  warning(message: string, description?: string) {
    return sonner.warning?.(message, description ? { description } : undefined)
      ?? sonner(message, description ? { description } : undefined);
  },
  loading(message: string) {
    return sonner.loading(message);
  },
  dismiss(id?: string | number) {
    return sonner.dismiss(id);
  },
  /**
   * Attach a toast to a promise — perfect for save/upload/network flows.
   * Auto-shows loading, then swaps to success or error when the promise settles.
   */
  promise<T>(p: Promise<T>, msgs: { loading: string; success: string; error: string }) {
    return sonner.promise(p, msgs);
  },
};

export type Toast = typeof toast;
