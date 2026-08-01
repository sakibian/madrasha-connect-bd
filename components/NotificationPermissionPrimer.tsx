/**
 * NotificationPermissionPrimer — soft ask BEFORE the browser's native
 * `Notification.requestPermission()` dialog.
 *
 * Best-practice pattern (Google, Slack, Notion): a native permission
 * prompt only ever fires ONCE, so we prime it with clear value-context
 * first. If the user taps "Not now" we don't call the native API at all
 * — we just wait 7 days and try again.
 *
 * Controlled component: parent decides *when* to show it (typically right
 * after a high-value action like submitting a fatwa or job application).
 */

import React, { useState } from 'react';
import { X, BellRing } from 'lucide-react';
import { isPushSupported, subscribeToPush, sendSubscriptionToServer } from '../services/webPush';
import { toast } from '../services/toast';

const SUPPRESSION_KEY = 'notif-primer-dismissed-at';
const SUPPRESSION_DAYS = 7;

interface Props {
  /** Controlled visibility from parent. */
  open: boolean;
  /** Called when the user dismisses OR accepts. */
  onClose: () => void;
  /** Bengali-first title override. */
  title?: string;
  /** Bengali-first body override. */
  description?: string;
  /** VAPID public key (from `VITE_VAPID_PUBLIC_KEY`). */
  vapidPublicKey?: string;
}

/** Reads suppression cooldown — returns true if we should stay hidden. */
export function isPrimerSuppressed(): boolean {
  try {
    const raw = localStorage.getItem(SUPPRESSION_KEY);
    if (!raw) return false;
    const ageDays = (Date.now() - Date.parse(raw)) / (1000 * 60 * 60 * 24);
    return ageDays < SUPPRESSION_DAYS;
  } catch {
    return false;
  }
}

const NotificationPermissionPrimer: React.FC<Props> = ({
  open,
  onClose,
  title,
  description,
  vapidPublicKey,
}) => {
  const [busy, setBusy] = useState(false);

  if (!open) return null;
  if (typeof window === 'undefined') return null;
  if (!isPushSupported()) return null;
  if (Notification.permission === 'granted') return null; // already subscribed
  if (Notification.permission === 'denied') {
    // Show a small "enable in browser settings" hint instead of the ask.
    return (
      <div
        data-testid="notif-primer-denied"
        className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 bg-white border border-warning-200 p-4 space-y-2"
      >
        <div className="flex justify-between items-start">
          <p className="text-sm font-bold text-warning-700">
            আপনি বিজ্ঞপ্তি ব্লক করেছেন
          </p>
          <button onClick={onClose} aria-label="Dismiss" className="text-gray-400 hover:text-black">
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-gray-600">
          ব্রাউজার সেটিংস থেকে এই সাইটের জন্য "নোটিফিকেশন" অনুমোদন দিন।
        </p>
      </div>
    );
  }

  const handleAllow = async () => {
    if (!vapidPublicKey) {
      toast.error('বিজ্ঞপ্তি সেবা এখনো সেটআপ হয়নি — ব্যবস্থাপককে জানান।');
      onClose();
      return;
    }
    setBusy(true);
    try {
      const sub = await subscribeToPush(vapidPublicKey);
      if (sub) {
        await sendSubscriptionToServer(sub);
        toast.success('বিজ্ঞপ্তি চালু হয়েছে 🎉');
      } else {
        toast.warning('বিজ্ঞপ্তি চালু করা যায়নি।');
      }
    } catch (e) {
      toast.error(e);
    } finally {
      setBusy(false);
      onClose();
    }
  };

  const handleDismiss = () => {
    try {
      localStorage.setItem(SUPPRESSION_KEY, new Date().toISOString());
    } catch { /* ignore */ }
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Enable notifications"
      data-testid="notif-primer"
      className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-40 bg-white border border-gray-200 shadow-2xl p-5 space-y-4 animate-fadeIn"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-bd-green shrink-0">
          <BellRing size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold leading-snug">
            {title ?? 'বিজ্ঞপ্তি চালু করুন'}
          </h3>
          <p className="text-xs text-gray-600 mt-1 leading-relaxed">
            {description ?? 'আপনার ফতোয়ার উত্তর প্রস্তুত হলে বা প্রাসঙ্গিক চাকরি খুললে আমরা আপনাকে জানিয়ে দেব।'}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          className="text-gray-400 hover:text-black -mt-1 -mr-1 min-h-[32px] min-w-[32px] flex items-center justify-center"
        >
          <X size={16} />
        </button>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleAllow}
          disabled={busy}
          className="flex-1 py-3 bg-bd-green text-white font-bold text-sm hover:bg-brand-600 transition-colors disabled:opacity-60"
        >
          {busy ? 'অপেক্ষা করুন…' : 'হ্যাঁ, জানাতে চাই'}
        </button>
        <button
          onClick={handleDismiss}
          className="px-4 py-3 border border-gray-200 text-gray-600 font-bold text-sm hover:bg-info-50 transition-colors"
        >
          পরে
        </button>
      </div>
    </div>
  );
};

export default NotificationPermissionPrimer;
