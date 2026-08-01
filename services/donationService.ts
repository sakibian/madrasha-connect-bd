/**
 * Donation service — thin client wrapper around the bkash-checkout Edge
 * Function + the `donations` table.
 *
 * The heavy lifting (talking to bKash, updating status, running the completion
 * trigger) all lives server-side. The client's job is:
 *   1. call createBkashDonation() → get { bkashURL }
 *   2. window.open(bkashURL) so user pays
 *   3. bKash redirects back with ?paymentID=…&status=…
 *   4. call executeBkashDonation({ paymentID })
 *   5. show a receipt / thanks page
 */

import { callEdgeFunction } from './edgeFunctions';
import { supabase } from './supabase';

export interface CreateDonationInput {
  amountBdt: number;              // whole Taka (integer)
  projectId?: string;
  donorName?: string;
  donorEmail?: string;
  donorPhone?: string;
  message?: string;
  callbackUrl?: string;           // defaults to current origin /sadaqah?bkash=1
}

export interface CreateDonationResult {
  ok: boolean;
  paymentID?: string;
  bkashURL?: string;
  donation_id?: string;
  dry_run?: boolean;
  error?: string;
}

const defaultCallback = (): string => {
  if (typeof window === 'undefined') return '';
  return `${window.location.origin}/sadaqah?bkash=1`;
};

export const createBkashDonation = async (
  input: CreateDonationInput
): Promise<CreateDonationResult> => {
  if (!(input.amountBdt > 0)) {
    return { ok: false, error: 'অনুগ্রহ করে বৈধ পরিমাণ দিন' };
  }

  const res = await callEdgeFunction<{
    paymentID?: string;
    bkashURL?: string;
    donation_id?: string;
    dry_run?: boolean;
    error?: string;
  }>('bkash-checkout', {
    action: 'create',
    amount_bdt: Math.round(input.amountBdt),
    project_id: input.projectId ?? null,
    donor_name: input.donorName,
    donor_email: input.donorEmail,
    donor_phone: input.donorPhone,
    message: input.message,
    callback_url: input.callbackUrl ?? defaultCallback(),
  });

  if (!res) return { ok: false, error: 'সাদাকাহ সেবা এখন সাময়িকভাবে অনুপলব্ধ।' };
  if (res.error) return { ok: false, error: res.error };
  return { ok: true, ...res };
};

export const executeBkashDonation = async (paymentID: string) => {
  return callEdgeFunction<{ ok: boolean; execRes?: unknown; error?: string }>(
    'bkash-checkout',
    { action: 'execute', paymentID }
  );
};

/** Get the current user's own donation history (RLS enforces ownership). */
export const listMyDonations = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select('id, amount_minor, currency, provider, status, created_at, completed_at, message, project_id')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) return [];
  return data;
};
