import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Book, Quote, X, Check } from 'lucide-react';
import { Source } from '../types';
import { dataService } from '../services/dataService';

interface CitationPickerProps {
  selected: Source[];
  onChange: (sources: Source[]) => void;
  onClose: () => void;
}

const typeTabs = [
  { type: 'all' as const, label: 'সব', icon: Search },
  { type: 'quran' as const, label: 'কুরআন', icon: BookOpen },
  { type: 'hadith' as const, label: 'হাদিস', icon: Book },
  { type: 'scholarly' as const, label: 'গ্রন্থ', icon: Quote },
];

const CitationPicker: React.FC<CitationPickerProps> = ({ selected, onChange, onClose }) => {
  const [sources, setSources] = useState<Source[]>([]);
  const [filtered, setFiltered] = useState<Source[]>([]);
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      const all = await dataService.getSources();
      setSources(all);
      setFiltered(all);
      setLoading(false);
    };
    fetchSources();
  }, []);

  useEffect(() => {
    let result = sources;
    if (activeType !== 'all') {
      result = result.filter(s => s.type === activeType);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        s => s.reference.toLowerCase().includes(q) || (s.text && s.text.toLowerCase().includes(q))
      );
    }
    setFiltered(result);
  }, [search, activeType, sources]);

  const isSelected = (source: Source) => selected.some(s => s.id === source.id);
  const toggleSource = (source: Source) => {
    if (isSelected(source)) {
      onChange(selected.filter(s => s.id !== source.id));
    } else {
      onChange([...selected, source]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-extrabold">সোর্স নির্বাচন করুন</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সোর্স খুঁজুন..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 font-bold text-sm focus:outline-none focus:border-black transition-all"
            />
          </div>
          <div className="flex gap-2 mt-4">
            {typeTabs.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold transition-all border ${
                  activeType === type
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-black'
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="p-8 text-center text-gray-400 font-bold">লোড হচ্ছে...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 font-bold">কোনো সোর্স পাওয়া যায়নি</div>
          ) : (
            filtered.map((source) => (
              <button
                key={source.id}
                onClick={() => toggleSource(source)}
                className={`w-full text-left p-4 flex items-start gap-4 transition-all border-b border-gray-50 hover:bg-gray-50 ${
                  isSelected(source) ? 'bg-bd-green/5' : ''
                }`}
              >
                <div className={`p-2 rounded ${
                  source.type === 'quran' ? 'bg-bd-green/10 text-bd-green' :
                  source.type === 'hadith' ? 'bg-amber-50 text-amber-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  {source.type === 'quran' ? <BookOpen size={18} /> :
                   source.type === 'hadith' ? <Book size={18} /> :
                   <Quote size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{source.reference}</div>
                  {source.text && <div className="text-xs text-gray-500 mt-1 line-clamp-2">{source.text}</div>}
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">
                    {source.type === 'quran' ? 'কুরআন' : source.type === 'hadith' ? 'হাদিস' : source.type === 'scholarly' ? 'গ্রন্থ' : 'অন্যান্য'}
                  </div>
                </div>
                {isSelected(source) && (
                  <div className="p-1 bg-bd-green text-white rounded-full">
                    <Check size={14} />
                  </div>
                )}
              </button>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-sm font-bold text-gray-500">{selected.length} টি নির্বাচিত</span>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all"
          >
            সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};

export default CitationPicker;
