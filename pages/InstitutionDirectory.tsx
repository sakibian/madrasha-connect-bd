
import React, { useState } from 'react';
import { Search, MapPin, Building, CheckCircle, ArrowRight, Filter, Users, Calendar } from 'lucide-react';
import { MOCK_INSTITUTIONS } from '../data/mockData';
import { Link } from 'react-router-dom';

const InstitutionDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Qawmi' | 'Alia' | 'Mosque'>('All');

  const filtered = MOCK_INSTITUTIONS.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inst.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'All' || inst.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <div className="caps-label text-gray-400">Directory</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">প্রতিষ্ঠান ডিরেক্টরি</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['All', 'Qawmi', 'Alia', 'Mosque'] as const).map(f => (
            <button 
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2.5 text-xs font-bold transition-all border ${
                activeFilter === f 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-500 border-gray-200 hover:border-black'
              }`}
            >
              {f === 'All' ? 'সব' : f === 'Qawmi' ? 'কওমি' : f === 'Alia' ? 'আলিয়া' : 'মসজিদ'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="প্রতিষ্ঠানের নাম বা এলাকা লিখুন..."
          className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none focus:ring-2 focus:ring-black outline-none transition-all font-medium text-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-100 minimal-border">
        {filtered.map(inst => (
          <div key={inst.id} className="bg-white p-8 group transition-all hover:bg-gray-50">
             <div className="flex flex-col h-full space-y-8">
                <div className="aspect-[16/9] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                   <img src={inst.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={inst.name} />
                </div>
                
                <div className="space-y-4 flex-1">
                   <div className="flex justify-between items-start">
                      <div className="caps-label text-bd-green">{inst.type}</div>
                      {inst.verified && <CheckCircle size={18} className="text-black" />}
                   </div>
                   <h3 className="text-3xl font-extrabold">{inst.name}</h3>
                   <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <MapPin size={16} /> {inst.location}
                   </div>
                   <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-100">
                      <div className="space-y-1">
                         <div className="caps-label text-gray-400">Established</div>
                         <div className="font-bold">{inst.established}</div>
                      </div>
                      <div className="space-y-1">
                         <div className="caps-label text-gray-400">Students</div>
                         <div className="font-bold">{inst.studentCount || 'N/A'}</div>
                      </div>
                   </div>
                </div>

                <Link to={`/institution/${inst.id}`} className="flex items-center justify-between font-bold text-sm border-t border-gray-100 pt-6 group-hover:text-bd-green">
                   বিস্তারিত প্রোফাইল <ArrowRight size={18} />
                </Link>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstitutionDirectory;
