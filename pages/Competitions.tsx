
import React from 'react';
import { Trophy, Star, Award, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const Competitions: React.FC = () => {
  const activeCompetitions = [
    { 
      title: 'জাতীয় আরবি ক্যালিগ্রাফি প্রতিযোগিতা ২০২৫', 
      prize: '৳ ২০,০০০ + সনদ', 
      deadline: '১০ মার্চ ২০২৫', 
      entries: '২৫০+', 
      image: 'https://picsum.photos/seed/comp1/800/600' 
    },
    { 
      title: 'হিফজুল কুরআন (কিশোর বিভাগ)', 
      prize: 'ওমরাহ টিকেট', 
      deadline: '১৫ মার্চ ২০২৫', 
      entries: '৫০০+', 
      image: 'https://picsum.photos/seed/comp2/800/600' 
    },
  ];

  return (
    <div className="space-y-24 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Events & Talent</div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">মেধা অন্বেষণ ও <br />সম্মাননা।</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
          মাদ্রাসার শিক্ষার্থীদের প্রতিভা বিকাশের জন্য আমরা আয়োজন করছি বিশেষ সব ইভেন্ট এবং জাতীয় স্তরের প্রতিযোগিতা।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-gray-100 minimal-border">
        {activeCompetitions.map((comp, i) => (
          <div key={i} className="bg-white p-12 group transition-all hover:bg-gray-50 flex flex-col h-full">
            <div className="aspect-[16/9] mb-10 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
               <ImageWithFallback src={comp.image} name={comp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={comp.title} />
            </div>
            
            <div className="space-y-8 flex-1 flex flex-col">
               <div className="flex justify-between items-start">
                  <div className="caps-label text-bd-green">OPEN REGISTRATION</div>
                  <div className="text-[10px] font-black bg-black text-white px-3 py-1 uppercase tracking-widest">{comp.deadline}</div>
               </div>
               
               <h3 className="text-3xl font-extrabold tracking-tight leading-tight flex-1">{comp.title}</h3>
               
               <div className="pt-10 mt-auto border-t border-gray-100 space-y-8">
                  <div className="flex justify-between items-center">
                     <div className="space-y-1">
                        <div className="caps-label text-gray-400">Prize Pool</div>
                        <div className="text-xl font-black">{comp.prize}</div>
                     </div>
                     <div className="text-right space-y-1">
                        <div className="caps-label text-gray-400">Participants</div>
                        <div className="text-xl font-black">{comp.entries}</div>
                     </div>
                  </div>
                  <button className="w-full py-5 bg-black text-white font-bold text-sm flex items-center justify-center gap-3 hover:bg-bd-green transition-all">
                     অংশগ্রহণ করুন <ArrowRight size={20} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black text-white p-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
         <div className="space-y-8">
            <div className="w-16 h-16 bg-white text-black flex items-center justify-center font-bold text-2xl">H</div>
            <h2 className="text-5xl font-extrabold tracking-tight leading-tight">হল অফ ফেম (Hall of Fame)।</h2>
            <p className="text-xl text-gray-500 font-medium leading-relaxed">
              বিগত বছরের সেরা ফলাফলকারী শিক্ষার্থী ও সফল শিক্ষকদের সম্মাননা তালিকা এবং তাদের সাফল্যের গল্পসমূহ।
            </p>
            <button className="text-sm font-bold border-b-2 border-white pb-0.5 hover:text-bd-green hover:border-bd-green transition-all">বিজয়ীদের তালিকা দেখুন</button>
         </div>
         <div className="grid grid-cols-2 gap-1 bg-gray-900 minimal-border">
            {[1,2,3,4].map(i => (
              <div key={i} className="bg-black p-10 flex flex-col items-center text-center space-y-4 border border-gray-900">
                 <div className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-full"></div>
                 <div className="space-y-1">
                    <p className="text-sm font-black uppercase tracking-widest text-bd-green">RANK #{i}</p>
                    <p className="text-xs font-bold text-gray-400">মাওলানা সাঈদ বিন নূর</p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default Competitions;
