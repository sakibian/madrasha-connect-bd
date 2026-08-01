import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Loader2, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { createBkashDonation } from '../services/donationService';

/**
 * Donation modal — bKash flow.
 *
 * Presents a compact form: amount preset chips + custom amount + optional
 * donor name/phone + message. On submit we call the bkash-checkout Edge
 * Function; if it returns a `bkashURL`, we redirect the browser there.
 *
 * When bKash credentials are missing on the server, the Edge Function
 * returns { dry_run: true } and we show a friendly note so devs know why
 * nothing happened — the donation row is still recorded for audit.
 */

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  projectTitle?: string;
}

const AMOUNT_PRESETS = [100, 500, 1000, 2500, 5000] as const;

const DonationModal: React.FC<Props> = ({ isOpen, onClose, projectId, projectTitle }) => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorPhone, setDonorPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dryRun, setDryRun] = useState(false);
  const [personal, setPersonal] = useState<{
    invoice?: string;
    personal_number?: string;
    account_name?: string | null;
    amount_bdt?: number;
    instructions_bn?: string;
    instructions_en?: string;
  } | null>(null);

  if (!isOpen) return null;

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDryRun(false);
    setPersonal(null);
    if (!(effectiveAmount > 0)) {
      setError('অনুগ্রহ করে বৈধ পরিমাণ দিন');
      return;
    }
    setSubmitting(true);
    const result = await createBkashDonation({
      amountBdt: effectiveAmount,
      projectId,
      donorName: donorName || undefined,
      donorPhone: donorPhone || undefined,
      message: message || undefined,
    });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || 'সাদাকাহ প্রক্রিয়া ব্যর্থ হয়েছে।');
      return;
    }
    if (result.mode === 'personal') {
      setPersonal({
        invoice: result.invoice,
        personal_number: result.personal_number,
        account_name: result.account_name,
        amount_bdt: result.amount_bdt,
        instructions_bn: result.instructions_bn,
        instructions_en: result.instructions_en,
      });
      return;
    }
    if (result.dry_run) {
      setDryRun(true);
      return;
    }
    if (result.bkashURL) {
      // Redirect to bKash's hosted checkout page. When done, bKash sends
      // the user back to /sadaqah?bkash=1&paymentID=... where we can call
      // executeBkashDonation to finalize.
      window.location.href = result.bkashURL;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="donation-title"
    >
      <div
        className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="space-y-1">
            <div className="caps-label text-gray-400">Sadaqah • bKash</div>
            <h2 id="donation-title" className="text-2xl font-extrabold tracking-tight">
              সাদাকাহ দিন
            </h2>
            {projectTitle && (
              <p className="text-sm text-gray-500 font-medium">{projectTitle}</p>
            )}
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100" aria-label="বন্ধ করুন">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="caps-label text-gray-400">পরিমাণ (৳)</label>
            <div className="grid grid-cols-5 gap-1 bg-gray-100 minimal-border">
              {AMOUNT_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { setAmount(preset); setCustomAmount(''); }}
                  className={`py-3 text-sm font-black transition-all ${
                    !customAmount && amount === preset ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  ৳{preset}
                </button>
              ))}
            </div>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              max={500000}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="অথবা কাস্টম পরিমাণ (৳)"
              className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold text-lg"
              aria-label="কাস্টম দান পরিমাণ"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              placeholder="আপনার নাম (ঐচ্ছিক)"
              className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium"
              aria-label="দাতার নাম"
            />
            <input
              type="tel"
              value={donorPhone}
              onChange={(e) => setDonorPhone(e.target.value)}
              placeholder="ফোন (ঐচ্ছিক)"
              className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium"
              aria-label="দাতার ফোন"
            />
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="বার্তা (ঐচ্ছিক) — যেমন 'পিতা মরহুম আব্দুল করিমের নামে'"
            rows={3}
            maxLength={280}
            className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium resize-none"
          />

          {error && (
            <div className="p-4 bg-danger-50 border border-danger-100 text-danger-600 text-sm font-bold">{error}</div>
          )}
          {dryRun && (
            <div className="p-4 bg-warning-50 border border-warning-100 text-warning-700 text-sm font-medium space-y-1">
              <p className="font-bold">Sandbox mode — bKash credentials not set.</p>
              <p className="text-xs">
                Ask ops to run <code>supabase secrets set BKASH_APP_KEY=… BKASH_APP_SECRET=…</code> etc.
                See <a className="underline font-bold" href="/NEXT_STEPS.md">NEXT_STEPS.md</a>.
                Your donation intent was still recorded for audit.
              </p>
            </div>
          )}
          {personal && (
            <div className="p-4 bg-bd-green/10 border border-bd-green/30 text-gray-900 text-sm space-y-3">
              <p className="font-extrabold text-bd-green uppercase tracking-widest text-xs">
                bKash Send Money — ম্যানুয়াল কনফার্মেশন
              </p>
              <p className="text-xs text-gray-600">
                merchant অ্যাকাউন্ট এখনো অনুমোদনের অপেক্ষায় — এই সময়ে অনুগ্রহ করে সংগঠনের
                পারসোনাল bKash নম্বরে <strong>Send Money</strong> করুন। ২৪ ঘণ্টার মধ্যে অ্যাডমিন
                কনফার্ম করবে।
              </p>
              <dl className="grid grid-cols-3 gap-2 text-sm">
                <dt className="col-span-1 font-bold text-gray-500">নম্বর</dt>
                <dd className="col-span-2 font-black text-lg tracking-wider">
                  {personal.personal_number}
                </dd>
                {personal.account_name && (
                  <>
                    <dt className="col-span-1 font-bold text-gray-500">নাম</dt>
                    <dd className="col-span-2 font-bold">{personal.account_name}</dd>
                  </>
                )}
                <dt className="col-span-1 font-bold text-gray-500">পরিমাণ</dt>
                <dd className="col-span-2 font-black">৳{personal.amount_bdt}</dd>
                <dt className="col-span-1 font-bold text-gray-500">Reference</dt>
                <dd className="col-span-2 font-mono font-black bg-white px-2 py-1 border border-gray-200 inline-block">
                  {personal.invoice}
                </dd>
              </dl>
              {personal.invoice && (
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(personal.invoice!)}
                  className="text-xs font-bold underline text-bd-green"
                >
                  Reference কপি করুন
                </button>
              )}
              {personal.instructions_bn && (
                <p className="text-xs text-gray-700 border-t border-bd-green/20 pt-2">
                  {personal.instructions_bn}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            <ShieldCheck size={12} className="text-bd-green" />
            <span>SSL এনক্রিপ্টেড • ১০০% অলাভজনক • কোনো সেবা ফি নেই</span>
          </div>

          <button
            type="submit"
            disabled={submitting || !(effectiveAmount > 0)}
            className="w-full py-5 bg-bd-green text-white font-extrabold text-lg uppercase tracking-widest flex items-center justify-center gap-3 hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <>
                <Heart size={18} /> ৳{effectiveAmount} bKash দিয়ে দিন <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DonationModal;
