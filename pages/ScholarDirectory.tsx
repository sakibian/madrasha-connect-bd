
import React, { useState } from 'react';
import { Search, ShieldCheck, MapPin, BookOpen, MessageCircle, Star } from 'lucide-react';

const MOCK_SCHOLARS = [
  { id: 's1', name: 'মুফতি আব্দুল্লাহ আল-মামুন', title: 'মুহাদ্দিস ও ফকিহ', specialization: 'ফিকহ ও ফতোয়া', institution: 'হাটহাজারী মাদ্রাসা', location: 'চট্টগ্রাম', verified: true, image: 'https://picsum.photos/seed/scholar1/400/400' },
  { id: 's2', name: 'ড. এনায়েতুল্লাহ আব্বাসী', title: 'পীর সাহেব জৈনপুরী', specialization: 'সীরাত ও ইতিহাস', institution: 'আব্বাসীয়া কামিল মাদ্রাসা', location: 'ঢাকা', verified: true, image: 'https://picsum.photos/seed/scholar2/400/400' },
  { id: 's3', name: 'মাওলানা সাঈদ বিন নূর', title: 'আরবি প্রভাষক', specialization: 'নাহু ও সরফ', institution: ' সরকারি আলিয়া মাদ্রাসা', location: 'ঢাকা', verified: true, image: 'https://picsum.photos/seed/scholar3/400/400' },
];

const ScholarDirectory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_SCHOLARS.filter(s => 
    s.name.includes(searchTerm) || s.specialization.includes(searchTerm)
  );

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6 border-b border-gray-100 pb-12">
        <div className="space-y-2">
          <div className="caps-label text-gray-400">Scholars</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">আলেম ডিরেক্টরি।</h1>
        </div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 bg-gray-100 minimal-border">
        {filtered.map(scholar => (
          <div key={scholar.id} className="bg-white p-10 group transition-all hover:bg-gray-50 h-full flex flex-col items-center text-center">
            <div className="relative mb-8">
               <div className="w-32 h-32 bg-gray-50 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={scholar.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={scholar.name} />
               </div>
               {scholar.verified && <div className="absolute -bottom-2 -right-2 bg-black text-white p-1.5"><ShieldCheck size={16} /></div>}
            </div>
            
            <div className="space-y-4 flex-1">
               <div className="caps-label text-bd-green">{scholar.title}</div>
               <h3 className="text-2xl font-extrabold">{scholar.name}</h3>
               <p className="text-gray-500 font-medium text-sm leading-relaxed px-4">{scholar.specialization} বিশেষজ্ঞ, {scholar.institution}।</p>
               <div className="flex items-center justify-center gap-2 text-gray-400 text-xs font-bold pt-4">
                  <MapPin size={14} /> {scholar.location}
               </div>
            </div>

            <div className="w-full pt-10 mt-10 border-t border-gray-100 grid grid-cols-2 gap-4">
               <button className="py-3 bg-black text-white font-bold text-xs hover:bg-gray-800 transition-all">জিজ্ঞাসা করুন</button>
               <button className="py-3 border border-gray-200 text-black font-bold text-xs hover:bg-gray-50 transition-all">প্রোফাইল</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarDirectory;
