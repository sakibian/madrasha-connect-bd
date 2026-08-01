/**
 * Admin-only service.
 *
 * All queries here rely on the ADMIN role check enforced by RLS policies
 * (see database/migrations/*.sql). If a non-admin call reaches these
 * functions, Supabase returns empty rows / permission errors — never a
 * silent data leak.
 */

import { supabase } from './supabase';

// --- Feedback types --------------------------------------------------------
export type FeedbackStatus = 'new' | 'in_progress' | 'resolved' | 'archived';

export type FeedbackCategoryCode = 'bug' | 'idea' | 'content' | 'donation' | 'other';

export interface FeedbackRow {
  id: string;
  user_id: string | null;
  category: FeedbackCategoryCode;
  message: string;
  rating: number | null;
  contact: string | null;
  page_url: string | null;
  user_agent: string | null;
  status: FeedbackStatus;
  admin_notes: string | null;
  created_at: string;
  resolved_at: string | null;
}

// --- Feedback queries ------------------------------------------------------

export interface ListFeedbackOptions {
  status?: FeedbackStatus | 'all';
  category?: FeedbackCategoryCode | 'all';
  limit?: number;
}

export const listFeedback = async (
  opts: ListFeedbackOptions = {}
): Promise<FeedbackRow[]> => {
  let q = supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(opts.limit ?? 200);

  if (opts.status && opts.status !== 'all') q = q.eq('status', opts.status);
  if (opts.category && opts.category !== 'all') q = q.eq('category', opts.category);

  const { data, error } = await q;
  if (error) {
    console.error('[admin] listFeedback:', error.message);
    return [];
  }
  return (data ?? []) as FeedbackRow[];
};

export interface FeedbackCounts {
  total: number;
  new: number;
  in_progress: number;
  resolved: number;
  archived: number;
}

export const getFeedbackCounts = async (): Promise<FeedbackCounts> => {
  const { data, error } = await supabase.from('feedback').select('status');
  if (error || !data) {
    return { total: 0, new: 0, in_progress: 0, resolved: 0, archived: 0 };
  }
  const counts: FeedbackCounts = { total: data.length, new: 0, in_progress: 0, resolved: 0, archived: 0 };
  for (const row of data) {
    const s = (row as { status: FeedbackStatus }).status;
    if (s in counts) (counts as unknown as Record<string, number>)[s]++;
  }
  return counts;
};

export const updateFeedbackStatus = async (
  id: string,
  status: FeedbackStatus,
  adminNotes?: string
): Promise<boolean> => {
  const patch: Record<string, unknown> = { status };
  if (adminNotes !== undefined) patch.admin_notes = adminNotes;
  if (status === 'resolved') patch.resolved_at = new Date().toISOString();
  else patch.resolved_at = null;

  const { error } = await supabase.from('feedback').update(patch).eq('id', id);
  if (error) {
    console.error('[admin] updateFeedbackStatus:', error.message);
    return false;
  }
  return true;
};
