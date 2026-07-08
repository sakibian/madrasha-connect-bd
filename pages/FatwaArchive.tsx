import React, { useState, useEffect } from 'react';
import { Clock, Shield, ArrowRight, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Fatwa, Source } from '../types';
import { dataService } from '../services/dataService';
import CitationBadge from '../components/CitationBadge';
import { Button, SearchInput, Badge, EmptyState } from '../components/ui';

const categories = ['All', 'Ibadah', 'Muamalah', 'Family', 'Social'] as const;

const FatwaArchive: React.FC = () => {
  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('');
  const [allSources, setAllSources] = useState<Source[]>([]);
  const [fatwaSources, setFatwaSources] = useState<Record<string, Source[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const [allFatwas, sources] = await Promise.all([
        dataService.getFatwas(),
        dataService.getSources(),
      ]);
      setAllSources(sources);

      const answered = allFatwas.filter(f => f.status === 'ANSWERED' && f.answer);
      setFatwas(answered);

      const allIds = answered.flatMap(f => f.answerSources || []);
      const resolved = await dataService.getSourcesByIds(allIds);
      const map: Record<string, Source[]> = {};
      answered.forEach(f => {
        map[f.id] = resolved.filter(s => (f.answerSources || []).includes(s.id));
      });
      setFatwaSources(map);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = fatwas.filter(f => {
    if (activeCategory !== 'All' && f.category !== activeCategory) return false;
    if (searchTerm && !f.question.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(f.answer || '').toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (sourceFilter) {
      const sources = fatwaSources[f.id] || [];
      if (!sources.some(s => s.reference.includes(sourceFilter) || s.type === sourceFilter)) return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-12 animate-fadeIn">
        <div className="space-y-4 border-b border-gray-100 pb-12">
          <div className="caps-label text-gray-400">Fatwa Archive</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">ফতোয়া সংরক্ষণাগার।</h1>
        </div>
        <div className="space-y-1 bg-gray-100 minimal-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-10 space-y-6">
              <div className="h-4 w-24 bg-gray-100 animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-100 animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Fatwa Archive</div>
        <div className="flex justify-between items-end">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">ফতোয়া সংরক্ষণাগার।</h1>
          <Link to="/fatwa" className="text-sm font-bold border-b-2 border-black flex items-center gap-2">
            নতুন প্রশ্ন <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="ফতোয়া খুঁজুন..."
          />
        </div>
        <select
          value={sourceFilter}
          onChange={e => setSourceFilter(e.target.value)}
          className="px-6 py-4 border border-gray-200 bg-white font-bold text-sm outline-none focus:border-black"
        >
          <option value="">সব সোর্স</option>
          <option value="quran">কুরআন</option>
          <option value="hadith">হাদিস</option>
          <option value="scholarly">গ্রন্থ</option>
          {allSources.filter(s => !['quran', 'hadith', 'scholarly'].includes(s.type)).map(s => (
            <option key={s.id} value={s.id}>{s.reference}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        {categories.map(cat => (
          <Button
            key={cat}
            variant={activeCategory === cat ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat === 'All' ? 'সব' : cat}
          </Button>
        ))}
      </div>

      <div className="space-y-1 bg-gray-100 minimal-border">
        {filtered.length === 0 ? (
          <div className="bg-white p-20 text-center">
            <EmptyState icon={<Shield size={48} />} title="কোনো ফতোয়া পাওয়া যায়নি" />
          </div>
        ) : (
          filtered.map(fatwa => (
            <div key={fatwa.id} className="bg-white p-10 space-y-6 group hover:bg-gray-50 transition-all">
              <div className="flex justify-between items-start">
                <div className="caps-label text-bd-green">{fatwa.category}</div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <Clock size={12} /> {fatwa.answeredAt || fatwa.askedAt}
                </div>
              </div>

              <h3 className="text-2xl font-extrabold leading-tight">{fatwa.question}</h3>

              {fatwa.answer && (
                <div className="pl-6 border-l-4 border-black space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-gray-500">
                    <User size={14} /> উত্তর
                  </div>
                  <p className="text-gray-600 leading-relaxed font-medium">{fatwa.answer}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
                {fatwaSources[fatwa.id]?.map(s => (
                  <CitationBadge key={s.id} source={s} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="bg-black text-white p-12 flex items-center gap-8">
        <Shield size={32} className="text-bd-green" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold">একটি প্রশ্ন আছে?</h3>
          <p className="text-gray-400 font-medium">আপনার দ্বীনি মাসআলা জিজ্ঞেস করুন এবং নির্ভরযোগ্য সোর্স সহ উত্তর পান।</p>
        </div>
        <Link to="/fatwa" className="ml-auto">
          <Button variant="white" size="lg">প্রশ্ন করুন <ArrowRight size={18} /></Button>
        </Link>
      </div>
    </div>
  );
};

export default FatwaArchive;
