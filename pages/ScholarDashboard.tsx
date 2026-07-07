import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, Clock, CheckCircle, X, ArrowRight, BookOpen, User, Loader2, MessageCircle, BadgeCheck, GraduationCap
} from 'lucide-react';
import { Fatwa, Source, Scholar } from '../types';
import { dataService } from '../services/dataService';
import { getCurrentUser } from '../services/authService';
import CitationBadge from '../components/CitationBadge';
import CitationPicker from '../components/CitationPicker';

const ScholarDashboard: React.FC = () => {
  const currentUser = getCurrentUser();
  const [pendingFatwas, setPendingFatwas] = useState<Fatwa[]>([]);
  const [myProfile, setMyProfile] = useState<Scholar | null>(null);
  const [answering, setAnswering] = useState<Fatwa | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [selectedSources, setSelectedSources] = useState<Source[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [fatwas, scholars] = await Promise.all([
        dataService.getPendingFatwas(),
        dataService.getScholars(),
      ]);
      setPendingFatwas(fatwas);
      setMyProfile(scholars.find(s => s.name === currentUser?.name) || null);
      setLoading(false);
    };
    fetch();
  }, []);

  const handleApprove = async () => {
    if (!answering || !answerText.trim()) return;
    setSubmitting(true);
    try {
      await dataService.approveFatwa(answering.id, answerText, selectedSources.map(s => s.id));
      setPendingFatwas(prev => prev.filter(f => f.id !== answering.id));
      setAnswering(null);
      setAnswerText('');
      setSelectedSources([]);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (fatwa: Fatwa) => {
    await dataService.rejectFatwa(fatwa.id);
    setPendingFatwas(prev => prev.filter(f => f.id !== fatwa.id));
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Scholar Portal</div>
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">স্কলার ড্যাশবোর্ড।</h1>
            {myProfile && (
              <div className="flex items-center gap-3 mt-4">
                <BadgeCheck size={18} className="text-bd-green" />
                <span className="font-bold text-gray-600">{myProfile.name}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-sm text-gray-500">{myProfile.specialization}</span>
              </div>
            )}
          </div>
          <Link to="/fatwa" className="text-sm font-bold border-b-2 border-black">ফতোয়া পোর্টাল</Link>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-20 text-center text-gray-400 font-bold">লোড হচ্ছে...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
            <div className="bg-white p-10 flex items-center gap-6">
              <MessageCircle size={24} className="text-bd-green" />
              <div>
                <div className="text-3xl font-extrabold">{pendingFatwas.length}</div>
                <div className="caps-label text-gray-400">পেন্ডিং ফতোয়া</div>
              </div>
            </div>
            <div className="bg-white p-10 flex items-center gap-6">
              <CheckCircle size={24} className="text-bd-green" />
              <div>
                <div className="text-3xl font-extrabold">{myProfile ? 1 : 0}</div>
                <div className="caps-label text-gray-400">উত্তর দেওয়া হয়েছে</div>
              </div>
            </div>
            <div className="bg-white p-10 flex items-center gap-6">
              <GraduationCap size={24} className="text-bd-green" />
              <div>
                <div className="text-3xl font-extrabold">{myProfile?.verified ? 1 : 0}</div>
                <div className="caps-label text-gray-400">ভেরিফিকেশন</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold">পেন্ডিং ফতোয়া</h2>
              <span className="text-[9px] font-black px-2 py-1 bg-gray-100 text-gray-500">{pendingFatwas.length}</span>
            </div>

            {pendingFatwas.length === 0 ? (
              <div className="bg-white p-20 text-center border border-dashed border-gray-200">
                <Shield size={48} className="text-gray-200 mx-auto mb-6" />
                <p className="text-xl font-bold text-gray-400">কোনো পেন্ডিং ফতোয়া নেই</p>
                <p className="text-sm text-gray-400 mt-2">সব ফতোয়ার উত্তর দেওয়া হয়েছে।</p>
              </div>
            ) : (
              <div className="space-y-1 bg-gray-100 minimal-border">
                {pendingFatwas.map(fatwa => (
                  <div key={fatwa.id} className="bg-white p-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="caps-label text-bd-green">{fatwa.category}</div>
                        <h3 className="text-2xl font-extrabold leading-tight">{fatwa.question}</h3>
                        <div className="text-xs font-bold text-gray-400 flex items-center gap-2">
                          <Clock size={12} /> {fatwa.askedAt}
                        </div>
                      </div>
                    </div>

                    {fatwa.aiSuggestion && (
                      <div className="p-6 bg-gray-50 border-l-4 border-gray-300 space-y-2">
                        <div className="caps-label text-gray-400">এআই প্রস্তাবনা</div>
                        <p className="text-sm text-gray-600 italic">{fatwa.aiSuggestion}</p>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => setAnswering(fatwa)}
                        className="px-6 py-3 bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all"
                      >
                        উত্তর দিন
                      </button>
                      <button
                        onClick={() => handleReject(fatwa)}
                        className="px-6 py-3 border border-gray-200 text-red-600 font-bold text-xs hover:bg-red-50 transition-all"
                      >
                        প্রত্যাখ্যান
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {answering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm" onClick={() => setAnswering(null)}>
          <div className="bg-white w-full max-w-2xl p-12 space-y-8 animate-slideUp max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-gray-100 pb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold">ফতোয়ার উত্তর</h2>
                <p className="text-sm text-gray-500 font-medium">{answering.question}</p>
              </div>
              <button onClick={() => setAnswering(null)} className="text-gray-400 hover:text-black"><X size={24} /></button>
            </div>

            {answering.aiSuggestion && (
              <div className="p-4 bg-gray-50 text-sm text-gray-500 italic border-l-4 border-gray-300">
                <div className="caps-label text-gray-400 mb-2">এআই প্রস্তাবনা</div>
                {answering.aiSuggestion}
              </div>
            )}

            <textarea
              value={answerText}
              onChange={e => setAnswerText(e.target.value)}
              placeholder="আপনার উত্তর লিখুন..."
              className="w-full p-6 border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black font-medium min-h-[200px]"
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="caps-label text-gray-400">সোর্স সাইটেশন</span>
                <button
                  onClick={() => setShowPicker(true)}
                  className="text-xs font-bold border border-gray-200 px-4 py-2 hover:bg-black hover:text-white transition-all"
                >
                  + সোর্স যোগ করুন
                </button>
              </div>
              {selectedSources.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedSources.map(s => (
                    <CitationBadge key={s.id} source={s} size="md" />
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-4 border-t border-gray-100">
              <button
                onClick={handleApprove}
                disabled={submitting || !answerText.trim()}
                className="flex-1 py-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all disabled:bg-gray-200 disabled:text-gray-400 flex items-center justify-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                উত্তর প্রকাশ করুন
              </button>
              <button
                onClick={() => setAnswering(null)}
                className="px-8 py-4 border border-gray-200 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all"
              >
                বাতিল
              </button>
            </div>
          </div>
        </div>
      )}

      {showPicker && (
        <CitationPicker
          selected={selectedSources}
          onChange={setSelectedSources}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
};

export default ScholarDashboard;
