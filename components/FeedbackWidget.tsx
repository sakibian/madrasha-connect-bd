import React, { useState } from 'react';
import { MessageSquarePlus, X, Loader2, CheckCircle, Send } from 'lucide-react';
import { submitFeedback, FeedbackCategory } from '../services/feedbackService';

/**
 * Floating feedback widget. Renders a small round button in the bottom-right
 * corner of every logged-in page. Clicking it opens a compact modal where any
 * user can send us bug reports, ideas, or content concerns.
 *
 * Product rationale:
 *   Non-profits live and die by community trust. The single fastest way to
 *   build trust is to make it obvious that we listen. A "give feedback"
 *   button one click away signals that we're actively soliciting input —
 *   even when we're too small to have a support team.
 *
 * All submissions land in `public.feedback` (see migrations SQL). Admins can
 * triage from the Admin Dashboard once the feedback admin panel is built.
 */

const CATEGORIES: { value: FeedbackCategory; label: string; emoji: string }[] = [
  { value: 'bug',      label: 'কিছু ভেঙে গেছে',           emoji: '🐞' },
  { value: 'idea',     label: 'নতুন আইডিয়া / ফিচার',       emoji: '💡' },
  { value: 'content',  label: 'কন্টেন্ট / ফতোয়া বিষয়ক',    emoji: '📖' },
  { value: 'donation', label: 'সাদাকাহ / দান বিষয়ক',      emoji: '🤲' },
  { value: 'other',    label: 'অন্যান্য',                emoji: '✉️' },
];

const FeedbackWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FeedbackCategory>('idea');
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setCategory('idea');
    setMessage('');
    setContact('');
    setSending(false);
    setSent(false);
    setError(null);
  };

  const close = () => {
    setOpen(false);
    // Give the exit animation a moment before clearing state.
    setTimeout(reset, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    const result = await submitFeedback({ category, message, contact });
    if (result.ok) {
      setSent(true);
    } else {
      setError(result.error);
    }
    setSending(false);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="ফিডব্যাক পাঠান"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-black text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:bg-bd-green hover:scale-105 transition-all"
      >
        <MessageSquarePlus size={18} />
        <span className="text-xs font-bold tracking-widest uppercase hidden sm:inline">ফিডব্যাক</span>
      </button>

      {!open ? null : (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fadeIn"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-title"
        >
          <div
            className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="space-y-1">
                <div className="caps-label text-gray-400">Community Voice</div>
                <h2 id="feedback-title" className="text-2xl font-extrabold tracking-tight">আপনার মতামত পাঠান</h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-2 hover:bg-gray-100 transition-all"
                aria-label="বন্ধ করুন"
              >
                <X size={20} />
              </button>
            </div>

            {sent ? (
              <div className="p-10 text-center space-y-6">
                <div className="w-16 h-16 bg-bd-green/10 flex items-center justify-center mx-auto rounded-full">
                  <CheckCircle size={32} className="text-bd-green" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold">শুকরান!</h3>
                  <p className="text-gray-500 font-medium">
                    আপনার মতামত পাঠানো হয়েছে। আমরা প্রতিটি বার্তা পড়ি এবং প্ল্যাটফর্মকে আরও উপকারী করতে ব্যবহার করি।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="px-8 py-4 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="caps-label text-gray-400">Category</label>
                  <div className="grid grid-cols-1 gap-1 bg-gray-100 minimal-border">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`flex items-center gap-3 px-4 py-3 text-left text-sm font-bold transition-all ${
                          category === c.value ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{c.emoji}</span>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="feedback-message" className="caps-label text-gray-400">Message</label>
                  <textarea
                    id="feedback-message"
                    required
                    minLength={3}
                    maxLength={4000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="আপনার মতামত, বাগ, অথবা নতুন আইডিয়া বিস্তারিত লিখুন..."
                    rows={5}
                    className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium text-base resize-none"
                  />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {message.length} / 4000
                  </p>
                </div>

                <div className="space-y-3">
                  <label htmlFor="feedback-contact" className="caps-label text-gray-400">
                    Contact (optional)
                  </label>
                  <input
                    id="feedback-contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="ইমেইল বা ফোন — আমরা যোগাযোগ করতে পারি"
                    className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-bold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || message.trim().length < 3}
                  className="w-full py-4 bg-black text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {sending ? 'পাঠানো হচ্ছে...' : 'পাঠান'}
                </button>

                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  আপনার মতামত সরাসরি অ্যাডমিন টিমের কাছে যায়।
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;
