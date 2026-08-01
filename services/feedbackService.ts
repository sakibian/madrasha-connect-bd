/**
 * User feedback service.
 *
 * A tiny but critical service — this is how we hear from the community.
 * Every founder needs a "give feedback" button one click away, and every
 * feedback lands in the `feedback` table for admins to triage.
 *
 * We deliberately let anonymous users submit feedback (RLS policy allows
 * anon inserts) so we get raw signal from people who visit but haven't
 * signed up yet.
 */

import { supabase } from './supabase';

export type FeedbackCategory =
  | 'bug'         // "কিছু ভাঙা"
  | 'idea'        // "নতুন আইডিয়া"
  | 'content'     // "বিষয়বস্তু / ফতোয়া"
  | 'donation'    // "সাদাকাহ / দান সংক্রান্ত"
  | 'other';

export interface FeedbackPayload {
  category: FeedbackCategory;
  message: string;
  rating?: number;      // 1-5, optional
  contact?: string;     // email or phone the user leaves for follow-up
  pageUrl?: string;     // where they submitted from
}

export const submitFeedback = async (
  payload: FeedbackPayload
): Promise<{ ok: boolean; error: string | null }> => {
  const trimmed = payload.message.trim();
  if (trimmed.length < 3) {
    return { ok: false, error: 'অনুগ্রহ করে আরও কিছু লিখুন।' };
  }

  const session = (await supabase.auth.getSession()).data.session;

  const { error } = await supabase.from('feedback').insert({
    user_id: session?.user?.id ?? null,
    category: payload.category,
    message: trimmed,
    rating: payload.rating ?? null,
    contact: payload.contact?.trim() || null,
    page_url: payload.pageUrl ?? (typeof window !== 'undefined' ? window.location.pathname : null),
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });

  if (error) {
    console.error('[feedback] insert error:', error.message);
    // Don't surface the raw DB error to users — they don't care.
    return { ok: false, error: 'পাঠানো যায়নি। একটু পরে আবার চেষ্টা করুন।' };
  }
  return { ok: true, error: null };
};
