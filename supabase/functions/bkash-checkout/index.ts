// ---------------------------------------------------------------------------
// bKash checkout Edge Function
//
// Implements the bKash "Tokenized Checkout" happy path against the sandbox
// (default) or production (when BKASH_ENV=production).
//
//   Actions:
//     - "create"    → creates a payment, returns { paymentID, bkashURL }
//     - "execute"   → confirms after the user redirects back with paymentID
//     - "query"     → looks up status of a payment
//
// Secrets required (set via `supabase secrets set`):
//   BKASH_APP_KEY
//   BKASH_APP_SECRET
//   BKASH_USERNAME
//   BKASH_PASSWORD
//   BKASH_ENV            optional, "sandbox" (default) | "production"
//
// If bKash secrets are missing, the function short-circuits into DRY-RUN mode
// so local devs can iterate on the UI without merchant credentials. Dry-run
// payments record status=failed with failure_reason='dry_run_no_credentials'.
//
// ---------------------------------------------------------------------------
// PERSONAL-ACCOUNT FALLBACK (BKASH_MODE=personal)
// ---------------------------------------------------------------------------
// Bangladesh non-profits often wait 4–8 weeks for a bKash merchant account.
// Until the merchant account is live we allow a supervised "personal account"
// path: the founder publishes a company-owned personal bKash number and users
// send money via bKash "Send Money" (Ref: MCBD-<invoice>). The Edge Function
// records the pledge with status='awaiting_manual_review' and an admin later
// marks it 'completed' from the Admin Donations panel after cross-checking
// the bKash SMS.
//
// Toggle by setting BKASH_MODE=personal + BKASH_PERSONAL_NUMBER=017XXXXXXXX
// (optional BKASH_PERSONAL_ACCOUNT_NAME). If BKASH_MODE is unset the code
// falls back to merchant tokenized checkout as before.
// ---------------------------------------------------------------------------

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.110.0';

const BKASH_APP_KEY     = Deno.env.get('BKASH_APP_KEY') || '';
const BKASH_APP_SECRET  = Deno.env.get('BKASH_APP_SECRET') || '';
const BKASH_USERNAME    = Deno.env.get('BKASH_USERNAME') || '';
const BKASH_PASSWORD    = Deno.env.get('BKASH_PASSWORD') || '';
const BKASH_ENV         = (Deno.env.get('BKASH_ENV') || 'sandbox').toLowerCase();

// Optional personal-account fallback (used until merchant account is approved).
const BKASH_MODE                  = (Deno.env.get('BKASH_MODE') || 'merchant').toLowerCase();
const BKASH_PERSONAL_NUMBER       = Deno.env.get('BKASH_PERSONAL_NUMBER') || '';
const BKASH_PERSONAL_ACCOUNT_NAME = Deno.env.get('BKASH_PERSONAL_ACCOUNT_NAME') || '';
const PERSONAL_MODE = BKASH_MODE === 'personal' && !!BKASH_PERSONAL_NUMBER;

// True only when we have neither merchant creds nor personal-account fallback.
const DRY_RUN =
  !PERSONAL_MODE &&
  !(BKASH_APP_KEY && BKASH_APP_SECRET && BKASH_USERNAME && BKASH_PASSWORD);

const SUPABASE_URL         = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const BKASH_HOST =
  BKASH_ENV === 'production'
    ? 'https://tokenized.pay.bka.sh/v1.2.0-beta'
    : 'https://tokenized.sandbox.bka.sh/v1.2.0-beta';

const admin = SUPABASE_URL && SUPABASE_SERVICE_KEY
  ? createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
  : null;

interface CreateBody {
  action: 'create';
  amount_bdt: number;        // whole Taka (e.g. 500 for ৳500)
  project_id?: string | null;
  donor_name?: string;
  donor_email?: string;
  donor_phone?: string;
  message?: string;
  callback_url: string;      // where bKash should send the user back
}

interface ExecuteBody {
  action: 'execute';
  paymentID: string;
}

interface QueryBody {
  action: 'query';
  paymentID: string;
}

type Body = CreateBody | ExecuteBody | QueryBody;

// -- bKash auth (grant + refresh not implemented in this stub; each call
// -- fetches a fresh id_token because ttl is 1h and functions are stateless) --
async function grantToken(): Promise<string> {
  const res = await fetch(`${BKASH_HOST}/tokenized/checkout/token/grant`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      username: BKASH_USERNAME,
      password: BKASH_PASSWORD,
    },
    body: JSON.stringify({ app_key: BKASH_APP_KEY, app_secret: BKASH_APP_SECRET }),
  });
  const body = await res.json();
  if (!res.ok || !body.id_token) {
    throw new Error(`bKash grant failed: ${body.statusMessage || res.statusText}`);
  }
  return body.id_token;
}

async function bkashCall(path: string, token: string, payload: unknown) {
  const res = await fetch(`${BKASH_HOST}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      authorization: token,
      'x-app-key': BKASH_APP_KEY,
    },
    body: JSON.stringify(payload),
  });
  return res.json();
}

// ---------------------------------------------------------------------------
serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }
  if (!admin) {
    return json({ error: 'Supabase admin client not configured' }, 500);
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  try {
    // --- CREATE ------------------------------------------------------------
    if (body.action === 'create') {
      const amount = Math.round(Number(body.amount_bdt));
      if (!(amount > 0 && amount <= 500000)) {
        return json({ error: 'amount_bdt must be between 1 and 500000' }, 400);
      }

      const invoiceNumber = `MCBD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

      // 1. Insert an "initiated" row so we always have an audit trail even if
      //    the bKash create call fails.
      const authHeader = req.headers.get('authorization') || '';
      const userId = await resolveUserId(authHeader);
      const { data: donation, error: insertErr } = await admin
        .from('donations')
        .insert({
          user_id: userId,
          project_id: body.project_id ?? null,
          amount_minor: amount * 100,
          currency: 'BDT',
          provider: 'bkash',
          provider_ref: invoiceNumber,
          donor_name: body.donor_name ?? null,
          donor_email: body.donor_email ?? null,
          donor_phone: body.donor_phone ?? null,
          message: body.message ?? null,
          ip_addr: req.headers.get('x-forwarded-for') ?? null,
          user_agent: req.headers.get('user-agent') ?? null,
          status: 'initiated',
        })
        .select('id')
        .single();
      if (insertErr || !donation) {
        console.error('[bkash] insert donation:', insertErr);
        return json({ error: 'Could not record donation' }, 500);
      }

      // 2a. Personal-account fallback: no merchant API call, we just return
      //     the personal bKash number + invoice ref for the user to send money
      //     to manually. An admin later marks the donation completed after
      //     matching the bKash SMS.
      if (PERSONAL_MODE) {
        await admin
          .from('donations')
          .update({
            status: 'awaiting_manual_review',
            provider: 'bkash_personal',
            provider_response: {
              mode: 'personal',
              personal_number: BKASH_PERSONAL_NUMBER,
              account_name: BKASH_PERSONAL_ACCOUNT_NAME || null,
              invoice: invoiceNumber,
              instructions_bn:
                `bKash অ্যাপ খুলুন → Send Money → ${BKASH_PERSONAL_NUMBER} → ` +
                `টাকার পরিমাণ ${amount} → Reference: ${invoiceNumber}`,
              instructions_en:
                `Open bKash app → Send Money → ${BKASH_PERSONAL_NUMBER} → ` +
                `amount ${amount} BDT → Reference: ${invoiceNumber}`,
            },
          })
          .eq('id', donation.id);
        return json({
          mode: 'personal',
          donation_id: donation.id,
          invoice: invoiceNumber,
          personal_number: BKASH_PERSONAL_NUMBER,
          account_name: BKASH_PERSONAL_ACCOUNT_NAME || null,
          amount_bdt: amount,
          instructions_bn:
            `bKash অ্যাপে Send Money করুন — নম্বর ${BKASH_PERSONAL_NUMBER}, ` +
            `পরিমাণ ৳${amount}, Reference কোড: ${invoiceNumber}`,
          instructions_en:
            `Send money via bKash to ${BKASH_PERSONAL_NUMBER} — ৳${amount} — ` +
            `use reference ${invoiceNumber}. An admin will confirm within 24 hours.`,
        });
      }

      // 2b. Dry-run short-circuit for local dev / missing credentials.
      if (DRY_RUN) {
        await admin
          .from('donations')
          .update({ status: 'failed', failure_reason: 'dry_run_no_credentials' })
          .eq('id', donation.id);
        return json({
          dry_run: true,
          message: 'BKASH credentials not configured; recorded a stub failure.',
          donation_id: donation.id,
        });
      }

      // 3. Real bKash create call.
      const token = await grantToken();
      const createRes = await bkashCall('/tokenized/checkout/create', token, {
        mode: '0011',
        payerReference: body.donor_phone ?? invoiceNumber,
        callbackURL: body.callback_url,
        amount: String(amount),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: invoiceNumber,
      });

      if (createRes.statusCode !== '0000' || !createRes.paymentID) {
        await admin
          .from('donations')
          .update({
            status: 'failed',
            failure_reason: createRes.statusMessage || 'bkash create failed',
            provider_response: createRes,
          })
          .eq('id', donation.id);
        return json({ error: 'bKash create failed', detail: createRes }, 502);
      }

      await admin
        .from('donations')
        .update({
          status: 'pending',
          provider_payment_id: createRes.paymentID,
          provider_response: createRes,
        })
        .eq('id', donation.id);

      return json({
        donation_id: donation.id,
        paymentID: createRes.paymentID,
        bkashURL: createRes.bkashURL,
      });
    }

    // --- EXECUTE -----------------------------------------------------------
    if (body.action === 'execute') {
      if (!body.paymentID) return json({ error: 'paymentID required' }, 400);
      if (PERSONAL_MODE) {
        // Personal mode is manual — nothing to execute automatically.
        return json({
          mode: 'personal',
          message:
            'Personal-account mode: donation stays in awaiting_manual_review ' +
            'until an admin confirms the bKash SMS.',
        });
      }
      if (DRY_RUN) return json({ error: 'DRY_RUN: cannot execute without credentials' }, 400);

      const token = await grantToken();
      const execRes = await bkashCall('/tokenized/checkout/execute', token, {
        paymentID: body.paymentID,
      });

      const isSuccess = execRes.statusCode === '0000' && execRes.transactionStatus === 'Completed';

      await admin
        .from('donations')
        .update({
          status: isSuccess ? 'completed' : 'failed',
          failure_reason: isSuccess ? null : (execRes.statusMessage || 'execute failed'),
          provider_response: execRes,
          completed_at: isSuccess ? new Date().toISOString() : null,
        })
        .eq('provider_payment_id', body.paymentID);

      return json({ ok: isSuccess, execRes });
    }

    // --- QUERY -------------------------------------------------------------
    if (body.action === 'query') {
      if (!body.paymentID) return json({ error: 'paymentID required' }, 400);
      if (DRY_RUN) return json({ error: 'DRY_RUN: cannot query without credentials' }, 400);

      const token = await grantToken();
      const queryRes = await bkashCall('/tokenized/checkout/payment/status', token, {
        paymentID: body.paymentID,
      });
      return json(queryRes);
    }

    return json({ error: 'Unknown action' }, 400);
  } catch (e) {
    console.error('[bkash] fatal:', e);
    return json({ error: String(e) }, 500);
  }
});

// ---------------------------------------------------------------------------
function json(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function resolveUserId(authHeader: string): Promise<string | null> {
  if (!admin || !authHeader.startsWith('Bearer ')) return null;
  try {
    const jwt = authHeader.slice(7);
    const { data } = await admin.auth.getUser(jwt);
    return data.user?.id ?? null;
  } catch {
    return null;
  }
}
