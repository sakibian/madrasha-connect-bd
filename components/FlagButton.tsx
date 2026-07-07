import React, { useState } from 'react';
import { Flag, Loader2, X } from 'lucide-react';
import { dataService } from '../services/dataService';

interface FlagButtonProps {
  contentType: string;
  contentId: string;
}

const reasons = [
  'ভুল তথ্য বা বিভ্রান্তিকর',
  'অনুপযুক্ত বা আপত্তিকর বিষয়বস্তু',
  'ভুল সোর্স বা সাইটেশন',
  'অন্যান্য',
];

const FlagButton: React.FC<FlagButtonProps> = ({ contentType, contentId }) => {
  const [open, setOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async () => {
    if (!selectedReason) return;
    setSubmitting(true);
    try {
      await dataService.flagContent(contentType, contentId, selectedReason);
      setDone(true);
      setTimeout(() => { setOpen(false); setDone(false); setSelectedReason(''); }, 1500);
    } catch {
      return;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-gray-300 hover:text-red-500 transition-all"
        title="রিপোর্ট করুন"
      >
        <Flag size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setOpen(false)}>
          <div className="bg-white w-full max-w-md p-8 space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-lg">কন্টেন্ট রিপোর্ট করুন</h3>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-black"><X size={20} /></button>
            </div>

            {done ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-12 h-12 bg-bd-green/10 text-bd-green rounded-full flex items-center justify-center mx-auto">
                  <Flag size={24} />
                </div>
                <p className="font-bold">রিপোর্ট করা হয়েছে</p>
                <p className="text-xs text-gray-500">এডমিন দল শীঘ্রই এটি পর্যালোচনা করবে।</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-gray-500 font-medium">কেন আপনি এই কন্টেন্টটি রিপোর্ট করছেন?</p>
                <div className="space-y-2">
                  {reasons.map(r => (
                    <button
                      key={r}
                      onClick={() => setSelectedReason(r)}
                      className={`w-full text-left p-4 text-sm font-bold border transition-all ${
                        selectedReason === r
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-100 hover:border-black'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={!selectedReason || submitting}
                  className="w-full py-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Flag size={18} />}
                  রিপোর্ট জমা দিন
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FlagButton;
