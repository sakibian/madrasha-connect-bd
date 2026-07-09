import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, MapPin, BookOpen, BadgeCheck, GraduationCap, ArrowRight, MessageCircle } from 'lucide-react';
import { Scholar } from '../types';
import { dataService } from '../services/dataService';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const ScholarDirectory: React.FC = () => {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const data = await dataService.getScholars();
      const withStats = await Promise.all(data.map(async s => {
        const stats = await dataService.getScholarStats(s.userId);
        return { ...s, answersGiven: stats.answersGiven };
      }));
      setScholars(withStats);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = scholars.filter(s =>
    s.name.includes(searchTerm) || s.specialization.includes(searchTerm) || s.institution.includes(searchTerm)
  );

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <div className="caps-label text-gray-400">Scholars</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">আলেম ডিরেক্টরি।</h1>
        </div>
      </div>

      <div className="bg-gray-50 p-10 minimal-border flex items-center justify-between">
        <div className="space-y-1">
          <p className="font-bold text-lg">আপনি কি একজন আলেম?</p>
          <p className="text-sm text-gray-500 font-medium">আমাদের স্কলার টিমে যোগ দিন এবং ফতোয়া প্রশ্নের উত্তর দিন।</p>
        </div>
        <Link
          to="/scholar/apply"
          className="px-8 py-4 bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          আবেদন করুন <ArrowRight size={16} />
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="বিশেষজ্ঞতা বা নাম দিয়ে খুঁজুন..."
          className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none focus:ring-2 focus:ring-black outline-none transition-all font-medium text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 minimal-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-10 text-center">
              <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto mb-8 animate-pulse" />
              <div className="space-y-3">
                <div className="h-4 w-20 bg-gray-100 animate-pulse mx-auto" />
                <div className="h-6 w-40 bg-gray-100 animate-pulse mx-auto" />
                <div className="h-3 w-32 bg-gray-100 animate-pulse mx-auto" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 minimal-border">
          {filtered.map(scholar => (
            <div key={scholar.id} className="bg-white p-10 group transition-all hover:bg-gray-50 h-full flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="w-32 h-32 bg-gray-50 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <ImageWithFallback src={scholar.image} name={scholar.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={scholar.name} />
                </div>
                {scholar.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-bd-green text-white p-1.5">
                    <BadgeCheck size={16} />
                  </div>
                )}
              </div>

              <div className="space-y-4 flex-1">
                <div className="caps-label text-bd-green">{scholar.title}</div>
                <h3 className="text-2xl font-extrabold">{scholar.name}</h3>

                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
                  <GraduationCap size={14} />
                  <span>{scholar.specialization}</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
                  <BookOpen size={14} />
                  <span>{scholar.institution}</span>
                </div>

                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-400">
                  <MapPin size={14} />
                  <span>{scholar.location}</span>
                </div>

                {scholar.answersGiven !== undefined && (
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-bd-green">
                    <MessageCircle size={14} />
                    <span>{scholar.answersGiven}টি উত্তর</span>
                  </div>
                )}
              </div>

              <div className="mt-8 w-full space-y-2">
                {scholar.verified && (
                  <div className="text-[9px] font-black text-bd-green uppercase tracking-widest flex items-center justify-center gap-1">
                    <ShieldCheck size={12} /> ভেরিফায়েড
                  </div>
                )}
                <Link
                  to={`/profile/${scholar.userId}`}
                  className="w-full py-4 border border-gray-200 font-bold text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <BookOpen size={16} /> প্রোফাইল দেখুন
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ScholarDirectory;
