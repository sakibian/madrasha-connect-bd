
import React, { useState, useEffect } from 'react';
import { Heart, Droplets, Book, Home, Sparkles, ArrowRight, CheckCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';
import { SadaqahProject } from '../types';

const SadaqahHub: React.FC = () => {
  const [projects, setProjects] = useState<SadaqahProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const data = await dataService.getSadaqahProjects();
    setProjects(data);
    setLoading(false);
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="space-y-4 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Donations</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">সাদাকাহ ও জারিয়া।</h1>
      </div>

      <div className="bg-black text-white p-16 space-y-8">
         <div className="caps-label text-bd-green">Digital Sadaqah</div>
         <h2 className="text-5xl font-extrabold leading-tight">আপনার দান, <br /> মাদ্রাসার সমৃদ্ধি।</h2>
         <p className="text-gray-400 text-xl max-w-2xl font-medium">আমরা সরাসরি দাতাদের সাথে প্রতিষ্ঠানের যোগাযোগ করিয়ে দিই। কোনো অতিরিক্ত ফি ছাড়াই আপনার পূর্ণ দান পৌঁছাবে কাঙ্ক্ষিত লক্ষ্যে।</p>
         <div className="flex gap-4 pt-6">
            <button className="bg-white text-black px-10 py-5 font-bold text-lg hover:bg-gray-100 transition-all">অনদান দিন</button>
            <button className="border border-gray-700 text-white px-10 py-5 font-bold text-lg hover:bg-gray-900 transition-all">তহবিল আবেদন</button>
         </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 size={32} className="animate-spin text-gray-300" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-32 text-gray-400 font-medium">
          এখনো কোনো সাদাকাহ প্রকল্প নেই
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
          {projects.map(proj => {
            const progress = Math.min(100, (proj.raised / proj.goal) * 100);
            return (
              <div key={proj.id} className="bg-white p-10 flex flex-col group h-full">
                  <div className="aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700 mb-8">
                     <img src={proj.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={proj.title} />
                  </div>
                  <div className="space-y-6 flex-1 flex flex-col">
                     <div className="flex justify-between items-start">
                        <div className="caps-label text-gray-400">{proj.category}</div>
                        <CheckCircle size={16} className="text-bd-green" />
                     </div>
                     <h3 className="text-2xl font-extrabold leading-tight">{proj.title}</h3>
                     <p className="text-sm text-gray-500">{proj.institution}</p>
                     <div className="space-y-4 pt-4 mt-auto">
                        <div className="w-full h-1 bg-gray-100">
                           <div className="h-full bg-bd-green transition-all duration-1000" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between items-end">
                           <div className="space-y-1">
                              <div className="caps-label text-gray-400">সংগৃহীত</div>
                              <div className="text-2xl font-extrabold">৳{proj.raised.toLocaleString()}</div>
                           </div>
                           <div className="text-xs font-bold text-gray-400">লক্ষ্য: ৳{proj.goal.toLocaleString()}</div>
                        </div>
                     </div>
                     <button className="w-full py-4 mt-4 bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                        অংশ নিন <ArrowRight size={18} />
                     </button>
                  </div>
               </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default SadaqahHub;
