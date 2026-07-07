
import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Search, 
  Send, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  User,
  Clock,
  ChevronDown,
  // Added missing X icon import
  X
} from 'lucide-react';
import { Fatwa, Source } from '../types';
import { dataService } from '../services/dataService';
import { askScholar } from '../services/geminiService';
import { getCurrentUser } from '../services/authService';
import { addNotification } from '../services/notificationService';
import CitationBadge from '../components/CitationBadge';
import FlagButton from '../components/FlagButton';

const FatwaCenter: React.FC = () => {
  const currentUser = getCurrentUser();
  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isAsking, setIsAsking] = useState(false);
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<Fatwa['category']>('Ibadah');
  const [isLoading, setIsLoading] = useState(false);
  const [answerSources, setAnswerSources] = useState<Record<string, Source[]>>({});

  useEffect(() => {
    const fetchFatwas = async () => {
      const data = await dataService.getFatwas();
      setFatwas(data);
      const answered = data.filter(f => f.answerSources && f.answerSources.length > 0);
      if (answered.length > 0) {
        const allIds = answered.flatMap(f => f.answerSources || []);
        const sources = await dataService.getSourcesByIds(allIds);
        const map: Record<string, Source[]> = {};
        answered.forEach(f => {
          map[f.id] = sources.filter(s => (f.answerSources || []).includes(s.id));
        });
        setAnswerSources(map);
      }
    };
    fetchFatwas();
  }, []);

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

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

      await dataService.saveFatwa(newFatwa);
      await addNotification({
        title: 'আপনার প্রশ্ন জমা হয়েছে',
        message: 'এআই একটি প্রাথমিক উত্তর দিয়েছে। শীঘ্রই একজন মুফতি এটি যাচাই করবেন।',
        type: 'community',
        link: '/fatwa'
      });
      setQuestion('');
      setIsAsking(false);
      setFatwas(await dataService.getFatwas());
    } catch (error) {
      console.error(error);
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
        <button 
          onClick={() => setIsAsking(true)}
          className="bg-black text-white px-8 py-4 font-bold text-sm flex items-center gap-2 hover:bg-gray-800 transition-all"
        >
          <HelpCircle size={20} /> প্রশ্ন করুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1 space-y-8">
           <div className="space-y-4">
              <div className="caps-label text-gray-400">Categories</div>
              <div className="flex flex-col gap-2">
                 {categories.map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-left px-4 py-3 text-sm font-bold transition-all ${activeCategory === cat ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                   >
                     {cat === 'All' ? 'সব বিষয়' : cat}
                   </button>
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
           <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="ফতোয়া বা মাসআলা খুঁজুন..."
                className="w-full pl-16 pr-6 py-5 bg-white minimal-border focus:ring-2 focus:ring-black outline-none transition-all font-medium text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>

           <div className="space-y-6">
              {filteredFatwas.map(fatwa => (
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

      {isAsking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-xl p-12 space-y-10 animate-slideUp">
            <div className="flex justify-between items-center border-b border-gray-100 pb-8">
              <h2 className="text-3xl font-extrabold">আপনার মাসআলা লিখুন</h2>
              <button onClick={() => setIsAsking(false)} className="text-gray-400 hover:text-black"><X size={32} /></button>
            </div>
            <form onSubmit={handleAskQuestion} className="space-y-6">
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
               <button disabled={isLoading} className="w-full py-5 bg-black text-white font-bold text-lg hover:bg-gray-800 transition-all flex items-center justify-center gap-3">
                {isLoading ? <Loader2 className="animate-spin" /> : 'প্রশ্ন জমা দিন'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FatwaCenter;
