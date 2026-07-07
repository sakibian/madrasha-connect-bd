import React, { useState } from 'react';
import {
  History, Star, Shield, Map, Heart, Compass, BookOpen, Search, ArrowRight, Sparkles, User,
  Sword, ScrollText, Flag, ArrowLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Source } from '../types';
import CitationBadge from '../components/CitationBadge';

interface TimelineEvent {
  id: string;
  year: string;
  hijriYear?: string;
  title: string;
  desc: string;
  category: 'Makkah' | 'Madinah' | 'Caliphate';
  icon: React.ReactNode;
  importance: 'High' | 'Medium';
  sources: Source[];
}

const SEERAH_DATA: TimelineEvent[] = [
  {
    id: 'e1',
    year: '৫৭০ খ্রিস্টাব্দ',
    title: 'পবিত্র জন্ম (আমুল ফীল)',
    desc: 'মক্কা নগরীতে কুরাইশ বংশের বনু হাশিম গোত্রে রাসূলুল্লাহ (সা.)-এর শুভ জন্ম। হস্তীবাহিনীর ঘটনার বছর হওয়ায় একে আমুল ফীল বলা হয়।',
    category: 'Makkah',
    icon: <Heart />,
    importance: 'High',
    sources: [
      { id: 's-sirah-1', type: 'book', reference: 'সীরাতে ইবনে হিশাম (১/১৫৮)', text: 'রাসূলুল্লাহ (সা.)-এর জন্মের বিবরণ' },
      { id: 's-raheeq-1', type: 'book', reference: 'আর-রাহীকুল মাখতূম (পৃ. ৪২)', text: 'আমুল ফীল ও নবীর জন্ম' },
    ],
  },
  {
    id: 'e2',
    year: '৫৯৫ খ্রিস্টাব্দ',
    title: 'খাদিজা (রা.)-এর সাথে বিবাহ',
    desc: '২৫ বছর বয়সে মক্কার মহীয়সী নারী খাদিজাতুল কুবরা (রা.)-এর সাথে বিবাহ বন্ধনে আবদ্ধ হন।',
    category: 'Makkah',
    icon: <User />,
    importance: 'Medium',
    sources: [
      { id: 's-bukhari-1', type: 'hadith', reference: 'সহীহ বুখারী (৩৮২০)', text: 'খাদিজা (রা.)-এর বিবাহ' },
      { id: 's-sirah-2', type: 'book', reference: 'সীরাতে ইবনে হিশাম (১/১৮৯)', text: 'নবীর প্রথম বিবাহ' },
    ],
  },
  {
    id: 'e3',
    year: '৬১০ খ্রিস্টাব্দ',
    title: 'নবুওয়াত লাভ ও প্রথম ওহী',
    desc: '৪০ বছর বয়সে হেরা গুহায় জিবরাইল (আ.)-এর মাধ্যমে সূরা আলাকের প্রথম ৫টি আয়াত নাযিল হওয়ার মাধ্যমে নবুওয়াত লাভ।',
    category: 'Makkah',
    icon: <Star />,
    importance: 'High',
    sources: [
      { id: 's-q-096', type: 'quran', reference: 'সূরা আল-আলাক (৯৬:১-৫)', text: 'পড় তোমার প্রভুর নামে যিনি সৃষ্টি করেছেন' },
      { id: 's-bukhari-2', type: 'hadith', reference: 'সহীহ বুখারী (৩)', text: 'ওহীর শুরু সম্পর্কে আয়েশা (রা.)-এর হাদিস' },
    ],
  },
  {
    id: 'e4',
    year: '৬১৫ খ্রিস্টাব্দ',
    title: 'হাবশায় প্রথম হিজরত',
    desc: 'মক্কার কাফেরদের সীমাহীন নির্যাতনের মুখে একদল সাহাবীর ইথিওপিয়া বা হাবশায় হিজরত।',
    category: 'Makkah',
    icon: <Flag />,
    importance: 'Medium',
    sources: [
      { id: 's-sirah-3', type: 'book', reference: 'সীরাতে ইবনে হিশাম (১/৩২১)', text: 'হাবশায় হিজরতের ঘটনা' },
      { id: 's-raheeq-2', type: 'book', reference: 'আর-রাহীকুল মাখতূম (পৃ. ১৩৬)', text: 'প্রথম হিজরতের বিবরণ' },
    ],
  },
  {
    id: 'e5',
    year: '৬১৯ খ্রিস্টাব্দ',
    title: 'আমুল হুজন (দুঃখের বছর)',
    desc: 'রাসূলুল্লাহ (সা.)-এর পরম আশ্রয় চাচা আবু তালিব এবং প্রিয়তমা স্ত্রী খাদিজা (রা.)-এর ইন্তেকাল।',
    category: 'Makkah',
    icon: <Heart />,
    importance: 'High',
    sources: [
      { id: 's-bukhari-3', type: 'hadith', reference: 'সহীহ বুখারী (৩৮৯৪)', text: 'আবু তালিবের মৃত্যু ও আমুল হুজন' },
      { id: 's-sirah-4', type: 'book', reference: 'সীরাতে ইবনে হিশাম (১/৪১৫)', text: 'দুঃখের বছর' },
    ],
  },
  {
    id: 'e6',
    year: '৬২১ খ্রিস্টাব্দ',
    title: 'ইসরা ও মিরাজ',
    desc: 'মক্কা থেকে বায়তুল মুকাদ্দাস এবং সেখান থেকে সপ্তাকাশ ভ্রমণ। এই সফরে পাঁচ ওয়াক্ত নামাজ ফরজ হয়।',
    category: 'Makkah',
    icon: <Sparkles />,
    importance: 'High',
    sources: [
      { id: 's-q-017', type: 'quran', reference: 'সূরা বনী ইসরাঈল (১৭:১)', text: 'সুবহানাল্লাহ যিনি তার বান্দাকে রাতের ভ্রমণ করিয়েছেন' },
      { id: 's-bukhari-4', type: 'hadith', reference: 'সহীহ বুখারী (৩৮৮৭)', text: 'মিরাজের বিস্তারিত বর্ণনা' },
    ],
  },
  {
    id: 'e7',
    year: '৬২২ খ্রিস্টাব্দ',
    hijriYear: '১ হিজরী',
    title: 'মদিনায় হিজরত',
    desc: 'আল্লাহর নির্দেশে মক্কা থেকে ইয়াসরিব (মদিনা) অভিমুখে ঐতিহাসিক হিজরত। ইসলামি ইতিহাসের এক নতুন মোড়।',
    category: 'Madinah',
    icon: <Map />,
    importance: 'High',
    sources: [
      { id: 's-q-009', type: 'quran', reference: 'সূরা আত-তাওবা (৯:৪০)', text: 'আল্লাহ তার সাথে ছিলেন, অতঃপর তিনি তার উপর সাকিনাহ নাযিল করলেন' },
      { id: 's-bukhari-5', type: 'hadith', reference: 'সহীহ বুখারী (৩৬৫২)', text: 'গুহায় আশ্রয় গ্রহণের ঘটনা' },
    ],
  },
  {
    id: 'e8',
    year: '৬২৪ খ্রিস্টাব্দ',
    hijriYear: '২ হিজরী',
    title: 'বদর যুদ্ধ',
    desc: 'ইসলামের ইতিহাসের প্রথম বড় বিজয়। মাত্র ৩১৩ জন সাহাবী হাজারো সৈন্যের কাফের বাহিনীকে পরাজিত করেন।',
    category: 'Madinah',
    icon: <Sword />,
    importance: 'High',
    sources: [
      { id: 's-q-003', type: 'quran', reference: 'সূরা আল-ইমরান (৩:১২৩)', text: 'আল্লাহ বদরে তোমাদের সাহায্য করেছেন' },
      { id: 's-bukhari-6', type: 'hadith', reference: 'সহীহ বুখারী (৩৯৫০)', text: 'বদর যুদ্ধের বর্ণনা' },
    ],
  },
  {
    id: 'e9',
    year: '৬২৭ খ্রিস্টাব্দ',
    hijriYear: '৫ হিজরী',
    title: 'খন্দকের যুদ্ধ (আহযাব)',
    desc: 'মদিনা রক্ষার জন্য মদিনার চারপাশে পরিখা বা গর্ত খনন করে সম্মিলিত কাফের বাহিনীকে প্রতিহত করা।',
    category: 'Madinah',
    icon: <Shield />,
    importance: 'High',
    sources: [
      { id: 's-q-033', type: 'quran', reference: 'সূরা আল-আহযাব (৩৩:৯-১০)', text: 'যখন তারা তোমাদের উপর এসেছিল উপরে ও নিচে থেকে' },
      { id: 's-bukhari-7', type: 'hadith', reference: 'সহীহ বুখারী (৪১০৯)', text: 'খন্দকের যুদ্ধের বিস্তারিত বর্ণনা' },
    ],
  },
  {
    id: 'e10',
    year: '৬২৮ খ্রিস্টাব্দ',
    hijriYear: '৬ হিজরী',
    title: 'হুদায়বিয়ার সন্ধি',
    desc: 'মক্কার কাফেরদের সাথে ১০ বছরের শান্তি চুক্তি। আপাতদৃষ্টিতে পরাজয় মনে হলেও এটি ছিল মহাবিজয়ের দ্বার।',
    category: 'Madinah',
    icon: <ScrollText />,
    importance: 'High',
    sources: [
      { id: 's-q-048', type: 'quran', reference: 'সূরা আল-ফাতহ (৪৮:১-৩)', text: 'নিশ্চয়ই আমি তোমাকে দিয়েছি স্পষ্ট বিজয়' },
      { id: 's-bukhari-8', type: 'hadith', reference: 'সহীহ বুখারী (৪২৫২)', text: 'হুদায়বিয়ার সন্ধির বর্ণনা' },
    ],
  },
  {
    id: 'e11',
    year: '৬৩০ খ্রিস্টাব্দ',
    hijriYear: '৮ হিজরী',
    title: 'মক্কা বিজয়',
    desc: 'কোনো রক্তপাত ছাড়াই দশ হাজার সাহাবীকে নিয়ে মক্কায় প্রবেশ এবং সেখানে তাওহীদের বিজয় নিশান উত্তোলন।',
    category: 'Madinah',
    icon: <Compass />,
    importance: 'High',
    sources: [
      { id: 's-q-110', type: 'quran', reference: 'সূরা আন-নাসর (১১০:১-৩)', text: 'যখন আল্লাহর সাহায্য ও বিজয় আসবে' },
      { id: 's-bukhari-9', type: 'hadith', reference: 'সহীহ বুখারী (৪২৮০)', text: 'মক্কা বিজয়ের ঘটনা' },
    ],
  },
  {
    id: 'e12',
    year: '৬৩২ খ্রিস্টাব্দ',
    hijriYear: '১০ হিজরী',
    title: 'বিদায় হজ ও ইন্তেকাল',
    desc: "আরাফার ময়দানে মানবজাতির জন্য ঐতিহাসিক শেষ ভাষণ প্রদান এবং পরবর্তী কিছুকাল পর রফীকে আ'লার সাথে মিলন।",
    category: 'Madinah',
    icon: <BookOpen />,
    importance: 'High',
    sources: [
      { id: 's-bukhari-10', type: 'hadith', reference: 'সহীহ বুখারী (১৭৪১)', text: 'বিদায় হজের বর্ণনা' },
      { id: 's-muslim-1', type: 'hadith', reference: 'সহীহ মুসলিম (১২১৫)', text: 'বিদায় হজ ও নবীর ইন্তেকাল' },
    ],
  },
];

const SeerahTimeline: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Makkah' | 'Madinah' | 'Caliphate'>('All');
  const [activeSource, setActiveSource] = useState<string | null>(null);

  const filteredEvents = SEERAH_DATA.filter(event => {
    const matchesSearch = event.title.includes(searchTerm) || event.desc.includes(searchTerm);
    const matchesTab = activeTab === 'All' || event.category === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-24 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">History & Heritage</div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">সীরাত ও ইসলামি <br /> ইতিহাসের কালরেখা।</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
          রাসূলুল্লাহ (সা.)-এর পবিত্র জীবন এবং খুলাফায়ে রাশেদীনের সোনালী অধ্যায়সমূহ নির্ভরযোগ্য সূত্রের আলোকে।
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 sticky top-20 z-20 bg-white py-6 border-b border-gray-100">
        <div className="relative flex-1">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="ঘটনা বা বছর লিখে খুঁজুন..."
            className="w-full pl-8 pr-4 py-3 bg-transparent outline-none focus:ring-0 font-bold text-lg border-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {(['All', 'Makkah', 'Madinah', 'Caliphate'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest transition-all border ${
                activeTab === tab
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-400 border-gray-200 hover:border-black'
              }`}
            >
              {tab === 'All' ? 'সম্পূর্ণ' : tab === 'Makkah' ? 'মক্কা যুগ' : tab === 'Madinah' ? 'মদিনা যুগ' : 'খিলাফাহ'}
            </button>
          ))}
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-[1px] h-full bg-gray-200"></div>

        <div className="space-y-32">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className={`relative flex flex-col md:flex-row items-start md:items-center gap-12 ${index % 2 === 0 ? 'md:flex-row-reverse md:text-right' : 'md:flex-row'}`}
              >
                <div className="flex-1 w-full pl-20 md:pl-0">
                  <div className={`p-10 minimal-border bg-white hover:bg-black hover:text-white transition-all group h-full`}>
                    <div className={`flex items-center gap-4 mb-6 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      {event.importance === 'High' && (
                        <div className="p-1 bg-bd-green text-white">
                          <Star size={10} fill="currentColor" />
                        </div>
                      )}
                      <div className="caps-label text-bd-green group-hover:text-gray-400">
                        {event.category === 'Makkah' ? 'MAKKAH PHASE' : event.category === 'Madinah' ? 'MADINAH PHASE' : 'CALIPHATE'}
                      </div>
                    </div>

                    <h3 className="text-3xl font-extrabold mb-4 leading-tight">
                      {event.title}
                    </h3>

                    <p className="text-gray-500 group-hover:text-gray-300 leading-relaxed font-medium text-lg">
                      {event.desc}
                    </p>

                    <div className={`mt-6 flex flex-wrap gap-1.5 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      {event.sources.map(s => (
                        <div key={s.id} className="group-hover:opacity-90 transition-opacity">
                          <CitationBadge source={s} />
                        </div>
                      ))}
                    </div>

                    <div className={`mt-8 pt-8 border-t border-gray-100 group-hover:border-gray-800 flex items-center gap-4 ${index % 2 === 0 ? 'md:justify-end' : 'md:justify-start'}`}>
                      <button className="text-sm font-bold flex items-center gap-2 group-hover:text-bd-green transition-all">
                        বিস্তারিত <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="absolute left-8 md:left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
                  <div className="w-12 h-12 bg-white minimal-border flex items-center justify-center group">
                    <div className="text-black group-hover:text-bd-green transition-colors">
                      {React.cloneElement(event.icon as React.ReactElement, { size: 24 })}
                    </div>
                  </div>
                  <div className="mt-4 bg-black text-white px-4 py-1 text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                    {event.year}
                    {event.hijriYear && <span className="block text-[8px] text-gray-500">({event.hijriYear})</span>}
                  </div>
                </div>

                <div className="hidden md:block flex-1"></div>
              </div>
            ))
          ) : (
            <div className="text-center py-40 bg-gray-50 border border-dashed border-gray-200">
              <History size={48} className="text-gray-200 mx-auto mb-6" />
              <p className="text-xl font-bold text-gray-400">ম্যাচিং ইভেন্ট খুঁজে পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-black text-white p-16 flex flex-col md:flex-row items-center gap-12">
        <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-2xl">S</div>
        <div className="flex-1 space-y-4">
          <div className="caps-label text-gray-500">Sources & Research</div>
          <h3 className="text-2xl font-bold">নির্ভরযোগ্য তথ্য সূত্র।</h3>
          <p className="text-gray-400 font-medium leading-relaxed">
            উক্ত কালরেখার তথ্যাবলী প্রধানত 'আর-রাহীকুল মাখতূম' (সফিউর রহমান মুবারকপুরী) এবং 'সীরাতে ইবনে হিশাম' থেকে সংগৃহীত। প্রতিটি ঘটনা কুরআন ও সহীহ হাদিস দ্বারা সমর্থিত।
          </p>
        </div>
      </div>
    </div>
  );
};

export default SeerahTimeline;
