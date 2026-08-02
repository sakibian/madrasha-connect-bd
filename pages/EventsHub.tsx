
import React, { useState, useEffect } from 'react';
import { Calendar, Moon, Star, Bell, Clock, MapPin, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { dataService } from '../services/dataService';

const EventsHub: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    const data = await dataService.getEvents();
    setEvents(data);
    setLoading(false);
  };

  // Calculate Hijri date using Intl
  const today = new Date();
  const hijriFormatter = new Intl.DateTimeFormat('bn-BD-u-ca-islamic-uma', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const hijriDate = hijriFormatter.format(today);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const eventTypeLabels: Record<string, string> = {
    competition: 'প্রতিযোগিতা',
    seminar: 'সেমিনার',
    workshop: 'ওয়ার্কশপ',
    other: 'অন্যান্য',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      {/* Hero: black bg + black accents + minimal-border (M23 brand refresh) */}
      <div className="bg-black text-white p-10 border border-gray-900 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white/5 flex items-center justify-center border border-white/10">
             <Moon size={64} className="text-black" fill="currentColor" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tight">ইসলামী ক্যালেন্ডার ও ইভেন্ট</h1>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <div className="bg-white/5 px-4 py-2 border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black">আজকের হিজরি তারিখ</p>
                  <p className="text-xl font-bold">{hijriDate}</p>
               </div>
               <div className="bg-white/5 px-4 py-2 border border-white/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-black">ইংরেজি তারিখ</p>
                  <p className="text-xl font-bold">{today.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <Star size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Bell size={24} className="text-black" /> আসন্ন ইভেন্টসমূহ
          </h2>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 size={32} className="animate-spin text-gray-300" />
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-medium">
                কোনো ইভেন্ট পাওয়া যায়নি
              </div>
            ) : (
              events.map((e: any) => (
                <div key={e.id} className="bg-white p-6 border border-gray-100 flex justify-between items-center group cursor-pointer hover:border-black transition-all">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-black uppercase">{eventTypeLabels[e.type] || e.type}</p>
                     <h3 className="font-bold text-gray-800 group-hover:text-black">{e.title}</h3>
                     <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1 font-bold"><Calendar size={12} /> {formatDate(e.event_date)}</span>
                        {e.location && <span className="flex items-center gap-1 font-bold"><MapPin size={12} /> {e.location}</span>}
                     </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                     <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">আসছে</span>
                     <ChevronRight size={18} className="text-gray-300 group-hover:text-black" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white p-8 border border-gray-100 space-y-8">
           <h2 className="text-2xl font-black text-gray-800">ইবাদত রিমাইন্ডার</h2>
           <div className="space-y-6">
              <ReminderItem icon={<Clock />} title="তাহাজ্জুদ সময়" time="০৩:৩০ AM" />
              <ReminderItem icon={<Sparkles />} title="ইশরাক সময়" time="০৬:৪৫ AM" />
              <div className="p-6 bg-gray-50 border border-gray-200">
                 <p className="text-gray-900 font-bold mb-2">বিশেষ নসিহত</p>
                 <p className="text-sm text-gray-900 leading-relaxed italic">"রমজানের প্রস্তুতির জন্য এখন থেকেই নফল রোজা ও কুরআন তিলাওয়াতের অভ্যাস গড়ে তুলুন।"</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ReminderItem = ({ icon, title, time }: { icon: React.ReactNode, title: string, time: string }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-black/10 text-black">{icon}</div>
      <p className="font-bold text-gray-800">{title}</p>
    </div>
    <p className="text-lg font-black text-black">{time}</p>
  </div>
);

export default EventsHub;
