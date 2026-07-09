
import React from 'react';
import { Play, Headset, Clock, Search, Heart, Share2, MoreVertical, Disc, ArrowUpRight } from 'lucide-react';

const AudioLibrary: React.FC = () => {
  const tracks = [
    { title: 'সূরা আর-রহমান (তিলাওয়াত)', artist: 'ক্বারী আব্দুল বাসিত', duration: '১৫:৪৫', type: 'TILAWAT' },
    { title: 'সীরাতুন নবী - পর্ব ১', artist: 'মাওলানা তারিক জামিল', duration: '৪৫:০০', type: 'LECTURE' },
    { title: 'সহজ তাজবীদ শিক্ষা', artist: 'ক্বারী সাঈদ বিন নূর', duration: '১২:৩০', type: 'LEARNING' },
    { title: 'আযকার ও মাসনুন দোয়া', artist: 'মুফতি আব্দুল্লাহ', duration: '০৮:২০', type: 'ZIKR' },
  ];

  return (
    <div className="space-y-16 animate-fadeIn pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-4">
          <div className="caps-label text-gray-400">Auditory Resources</div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">অডিও লাইব্রেরি।</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">সেরা ক্বারীগণের তিলাওয়াত এবং আলেমগণের প্রাজ্ঞ বয়ান।</p>
        </div>
        <div className="relative w-full md:w-96">
           <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
           <input className="w-full pl-8 pr-4 py-3 bg-transparent border-none outline-none focus:ring-0 font-bold text-lg" placeholder="বয়ান বা তিলাওয়াত খুঁজুন..." />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-12">
           <div className="bg-black text-white p-12 space-y-8 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <Disc size={48} className="text-bd-green animate-spin-slow" />
                <div className="caps-label text-gray-500">Currently Streaming</div>
                <h3 className="text-2xl font-extrabold leading-tight">কোনো অডিও সেশন চলছে না।</h3>
              </div>
              <p className="text-sm font-bold text-gray-600">নিচের তালিকা থেকে একটি অডিও ট্র‍্যাক নির্বাচন করে শুরু করুন।</p>
           </div>
           
           <div className="space-y-8">
              <div className="caps-label text-gray-400">Library Categories</div>
              <div className="flex flex-col gap-2">
                 <CategoryButton label="কুরআন তিলাওয়াত" active />
                 <CategoryButton label="ইসলামী বয়ান (ওয়াজ)" />
                 <CategoryButton label="হামদ ও নাত" />
                 <CategoryButton label="দোয়া ও যিকির" />
              </div>
           </div>
        </div>

        {/* Track List */}
        <div className="lg:col-span-8 space-y-1 bg-gray-100 minimal-border">
           {tracks.map((track, i) => (
             <div key={i} className="bg-white p-10 flex items-center justify-between group hover:bg-black hover:text-white transition-all cursor-pointer">
                <div className="flex items-center gap-8">
                   <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-bd-green group-hover:bg-bd-green group-hover:text-white transition-all">
                      <Play size={24} fill="currentColor" />
                   </div>
                   <div>
                      <div className="caps-label text-bd-green group-hover:text-gray-400 mb-2">{track.type}</div>
                      <h4 className="text-2xl font-extrabold tracking-tight group-hover:text-white">{track.title}</h4>
                      <p className="text-sm font-bold text-gray-400 group-hover:text-gray-500">{track.artist}</p>
                   </div>
                </div>
                <div className="flex items-center gap-10">
                   <div className="hidden md:flex flex-col items-end">
                      <span className="text-xs font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-600 flex items-center gap-2"><Clock size={12} /> {track.duration}</span>
                   </div>
                   <div className="flex gap-4">
                      <button className="p-3 border border-gray-100 group-hover:border-gray-800 text-gray-300 group-hover:text-white transition-all hover:text-red-500"><Heart size={18} /></button>
                      <button className="p-3 border border-gray-100 group-hover:border-gray-800 text-gray-300 group-hover:text-white transition-all"><MoreVertical size={18} /></button>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

const CategoryButton = ({ label, active }: { label: string, active?: boolean }) => (
  <button className={`w-full text-left px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-gray-50'}`}>
     {label}
  </button>
);

export default AudioLibrary;
