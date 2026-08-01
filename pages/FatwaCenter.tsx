
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Clock } from 'lucide-react';
import { Fatwa, Source, XP_ACTIONS } from '../types';
import { dataService } from '../services/dataService';
import { askScholar } from '../services/geminiService';
import { addNotification } from '../services/notificationService';
import { moderateContent } from '../services/moderationService';
import CitationBadge from '../components/CitationBadge';
import FlagButton from '../components/FlagButton';
import { Button, Modal, SearchInput, LoadingSkeleton } from '../components/ui';
import { useAuthStore, useFatwaStore } from '../stores';
import NotificationPermissionPrimer, { isPrimerSuppressed } from '../components/NotificationPermissionPrimer';
import { toast } from '../services/toast';

const FatwaCenter: React.FC = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { fatwas, fetch: fetchFatwas, ask: askFatwa } = useFatwaStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isAsking, setIsAsking] = useState(false);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Fatwa['category']>('Ibadah');
  const [isLoading, setIsLoading] = useState(false);
  const [moderationFeedback, setModerationFeedback] = useState<string | null>(null);
  const [answerSources, setAnswerSources] = useState<Record<string, Source[]>>({});
  const [showPushPrimer, setShowPushPrimer] = useState(false);

  useEffect(() => {
    const init = async () => {
      await fetchFatwas();
      const answered = fatwas.filter(f => f.answerSources && f.answerSources.length > 0);
      if (answered.length > 0) {
        const allIds = answered.flatMap(f => f.answerSources || []);
        const sources = await dataService.getSourcesByIds(allIds);
        const map: Record<string, Source[]> = {};
        answered.forEach(f => {
          map[f.id] = sources.filter(s => (f.answerSources || []).includes(s.id));
        });
        setAnswerSources(map);
      }
      setIsInitialized(true);
      setLoading(false);
    };
    if (!isInitialized) init();
  }, [isInitialized]);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setModerationFeedback(null);
    const modResult = await moderateContent(question, 'fatwa_question');
    if (!modResult.safe) {
      setModerationFeedback(modResult.feedback);
      return;
    }

    setIsLoading(true);

    try {
      const suggestion = await askScholar(question);
      const newFatwa: Fatwa = {
        id: `f-${Date.now()}`,
        question,
        category,
        askedBy: currentUser?.name || 'Anonymous',
        askedAt: 'এইমাত্র',
        aiSuggestion: suggestion,
        status: 'PENDING'
      };

      await askFatwa(newFatwa);
      if (currentUser) dataService.addXP(currentUser.id, XP_ACTIONS.ASK_FATWA.action, XP_ACTIONS.ASK_FATWA.xp);
      await addNotification({
        title: 'আপনার প্রশ্ন জমা হয়েছে',
        message: 'এআই একটি প্রাথমিক উত্তর দিয়েছে। শীঘ্রই একজন মুফতি এটি যাচাই করবেন।',
        type: 'community',
        link: '/fatwa'
      });
      setQuestion('');
      setIsAsking(false);
      fetchFatwas();
      toast.success('আপনার প্রশ্ন জমা হয়েছে', 'একজন মুফতি শীঘ্রই যাচাই করবেন।');

      // Ask for push permission — user just did a high-value action so the
      // reason ("we'll ping you when it's answered") is crystal clear. The
      // primer itself respects a 7-day suppression cooldown.
      if (currentUser && !isPrimerSuppressed()) {
        setShowPushPrimer(true);
      }
    } catch (error) {
      console.error(error);
      toast.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = ['All', 'Ibadah', 'Muamalah', 'Family', 'Social'];
  const filteredFatwas = fatwas.filter(f => {
    const matchesSearch = f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.answer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <div className="caps-label text-gray-400">Fatwa Center</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">ফতোয়া ও জিজ্ঞাসা।</h1>
        </div>
        <Button onClick={() => setIsAsking(true)}>
          প্রশ্ন করুন
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1 space-y-8">
           <div className="space-y-4">
              <div className="caps-label text-gray-400">Categories</div>
               <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <Button
                     key={cat}
                     variant={activeCategory === cat ? 'primary' : 'ghost'}
                     size="md"
                     onClick={() => setActiveCategory(cat)}
                     className="text-left justify-start"
                    >
                      {cat === 'All' ? 'সব বিষয়' : cat}
                    </Button>
                  ))}
               </div>
           </div>
           <div className="p-8 bg-gray-50 space-y-4">
              <Sparkles size={24} className="text-bd-green" />
              <h4 className="font-bold text-lg">এআই আলেম (Alpha)</h4>
              <p className="text-xs text-gray-500 leading-relaxed">আমাদের এআই আপনার প্রশ্নের একটি প্রাথমিক এবং নির্ভরযোগ্য প্রস্তাবনা তৈরি করবে।</p>
           </div>
        </div>

        <div className="md:col-span-3 space-y-8">
           <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="ফতোয়া বা মাসআলা খুঁজুন..."
           />

           <div className="space-y-6">
              {loading ? (
                <LoadingSkeleton variant="card" count={3} />
              ) : filteredFatwas.map(fatwa => (
                <div key={fatwa.id} className="minimal-border p-10 bg-white space-y-8 group">
                    <div className="flex justify-between items-start">
                       <div className="caps-label text-bd-green">{fatwa.category}</div>
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock size={12} /> {fatwa.askedAt}</span>
                          <FlagButton contentType="fatwa" contentId={fatwa.id} />
                       </div>
                    </div>
                   <h3 className="text-2xl font-extrabold leading-tight">প্রশ্ন: {fatwa.question}</h3>
                   
                    {fatwa.answer ? (
                      <div className="pt-8 border-t border-gray-100 space-y-6">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black text-white flex items-center justify-center text-[10px] font-bold">A</div>
                            <span className="text-xs font-extrabold uppercase tracking-widest">মুফতির উত্তর</span>
                         </div>
                         <p className="text-gray-600 leading-relaxed font-medium">{fatwa.answer}</p>
                         {answerSources[fatwa.id] && answerSources[fatwa.id].length > 0 && (
                           <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                             {answerSources[fatwa.id].map(s => (
                               <CitationBadge key={s.id} source={s} />
                             ))}
                           </div>
                         )}
                      </div>
                   ) : (
                     <div className="pt-8 border-t border-gray-100 bg-gray-50/50 p-6 space-y-4">
                        <div className="caps-label text-gray-400">এআই প্রস্তাবনা</div>
                        <p className="text-sm text-gray-500 italic leading-relaxed">{fatwa.aiSuggestion}</p>
                        <div className="text-[9px] font-bold text-gray-400">পর্যালোচনার জন্য অপেক্ষমান।</div>
                     </div>
                   )}
                </div>
              ))}
           </div>
        </div>
      </div>

      <Modal open={isAsking} onClose={() => setIsAsking(false)} title="আপনার মাসআলা লিখুন">
        <form onSubmit={handleAskQuestion} className="space-y-6">
           {moderationFeedback && (
             <div className="p-4 bg-danger-50 border border-danger-200 text-danger-700 text-sm font-medium">
               {moderationFeedback}
             </div>
           )}
           <div className="space-y-4">
              <select className="w-full p-4 border border-gray-100 bg-gray-50 outline-none font-bold text-sm" value={category} onChange={e => setCategory(e.target.value as any)}>
                  <option value="Ibadah">ইবাদাত</option>
                  <option value="Muamalah">মুয়ামালাত</option>
                  <option value="Family">পারিবারিক</option>
                  <option value="Social">সামাজিক</option>
              </select>
              <textarea 
                required 
                placeholder="আপনার প্রশ্নটি বিস্তারিত লিখুন..." 
                className="w-full p-6 border border-gray-100 bg-gray-50 outline-none focus:ring-2 focus:ring-black font-medium min-h-[200px]" 
                value={question} 
                onChange={e => setQuestion(e.target.value)} 
              />
           </div>
           <Button loading={isLoading} size="lg" className="w-full">
            {isLoading ? '' : 'প্রশ্ন জমা দিন'}
          </Button>
        </form>
      </Modal>

      {/* Push permission primer — appears once after a successful fatwa submit
          so users get notified when the answer is published. Respects a
          7-day suppression cooldown on dismiss. */}
      <NotificationPermissionPrimer
        open={showPushPrimer}
        onClose={() => setShowPushPrimer(false)}
        title="উত্তর পেলে জানাতে চান?"
        description="আপনার প্রশ্নের উত্তর প্রস্তুত হলে সাথে সাথে ব্রাউজার নোটিফিকেশনের মাধ্যমে আমরা জানিয়ে দেব।"
        vapidPublicKey={import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined}
      />
    </div>
  );
};

export default FatwaCenter;
