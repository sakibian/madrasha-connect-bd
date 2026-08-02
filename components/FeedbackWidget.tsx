import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

// Category emoji keys stay stable across languages; labels come from i18n.
const CATEGORY_KEYS: { value: FeedbackCategory; emoji: string }[] = [
  { value: 'bug',      emoji: '🐞' },
  { value: 'idea',     emoji: '💡' },
  { value: 'content',  emoji: '📖' },
  { value: 'donation', emoji: '🤲' },
  { value: 'other',    emoji: '✉️' },
];

const FeedbackWidget: React.FC = () => {
  const { t } = useTranslation();
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
        aria-label={t('feedback.trigger_aria')}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 flex items-center gap-2 bg-black text-white pl-4 pr-5 py-3 rounded-full shadow-2xl hover:bg-black hover:scale-105 transition-all min-h-[44px]"
      >
        <MessageSquarePlus size={18} />
        <span className="text-xs font-bold tracking-widest uppercase hidden sm:inline">{t('feedback.trigger')}</span>
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
                <h2 id="feedback-title" className="text-2xl font-extrabold tracking-tight">{t('feedback.title')}</h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="p-2 hover:bg-gray-100 transition-all"
                aria-label={t('feedback.close')}
              >
                <X size={20} />
              </button>
            </div>

            {sent ? (
              <div className="p-10 text-center space-y-6">
                <div className="w-16 h-16 bg-black/10 flex items-center justify-center mx-auto rounded-full">
                  <CheckCircle size={32} className="text-black" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-extrabold">{t('feedback.successTitle')}</h3>
                  <p className="text-gray-500 font-medium">{t('feedback.successBody')}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="px-8 py-4 bg-black text-white font-bold text-xs uppercase tracking-widest hover:bg-gray-800 transition-all"
                >
                  {t('feedback.ok')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="space-y-3">
                  <label className="caps-label text-gray-400">{t('feedback.categoryLabel')}</label>
                  <div className="grid grid-cols-1 gap-1 bg-gray-100 minimal-border">
                    {CATEGORY_KEYS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setCategory(c.value)}
                        className={`flex items-center gap-3 px-4 py-3 text-left text-sm font-bold transition-all ${
                          category === c.value ? 'bg-black text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        <span className="text-lg">{c.emoji}</span>
                        {t(`feedback.cat_${c.value}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label htmlFor="feedback-message" className="caps-label text-gray-400">{t('feedback.messageLabel')}</label>
                  <textarea
                    id="feedback-message"
                    required
                    minLength={3}
                    maxLength={4000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('feedback.messagePlaceholder')}
                    rows={5}
                    className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium text-base resize-none"
                  />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {message.length} / 4000
                  </p>
                </div>

                <div className="space-y-3">
                  <label htmlFor="feedback-contact" className="caps-label text-gray-400">
                    {t('feedback.contactLabel')}
                  </label>
                  <input
                    id="feedback-contact"
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder={t('feedback.contactPlaceholder')}
                    className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-medium"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-gray-100 border border-gray-200 text-gray-900 text-sm font-bold">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={sending || message.trim().length < 3}
                  className="w-full py-4 bg-black text-white font-extrabold text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                  {sending ? t('feedback.sending') : t('feedback.send')}
                </button>

                <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  {t('feedback.note')}
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
