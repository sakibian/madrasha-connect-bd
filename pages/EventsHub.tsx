
import React from 'react';
import { Calendar, Moon, Star, Bell, Clock, MapPin, Sparkles, ChevronRight } from 'lucide-react';

const EventsHub: React.FC = () => {
  // Calculate Hijri date using Intl
  const today = new Date();
  const hijriFormatter = new Intl.DateTimeFormat('bn-BD-u-ca-islamic-uma', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const hijriDate = hijriFormatter.format(today);

  const upcomingEvents = [
    { title: 'পবিত্র রমজান শুরু (সম্ভাব্য)', date: '০২ মার্চ ২০২৫', type: 'Religious', status: 'শীঘ্রই' },
    { title: 'সালাতুল ইস্তিসকা (বিশেষ দোয়া)', date: '২০ ফেব্রুয়ারি ২০২৫', type: 'Community', status: 'আসছে' },
    { title: 'বার্ষিক ইসলামী মাহফিল', date: '২৫ ফেব্রুয়ারি ২০২৫', type: 'Event', status: 'নিবন্ধিত' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-700 rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20">
             <Moon size={64} className="text-emerald-300" fill="currentColor" />
          </div>
          <div className="space-y-4 text-center md:text-left">
            <h1 className="text-3xl font-black">ইসলামী ক্যালেন্ডার ও ইভেন্ট</h1>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
               <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">আজকের হিজরি তারিখ</p>
                  <p className="text-xl font-bold">{hijriDate}</p>
               </div>
               <div className="bg-white/10 px-4 py-2 rounded-2xl border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">ইংরেজি তারিখ</p>
                  <p className="text-xl font-bold">{today.toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
               </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <Star size={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
            <Bell size={24} className="text-emerald-700" /> আসন্ন ইভেন্টসমূহ
          </h2>
          <div className="space-y-4">
            {upcomingEvents.map((e, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex justify-between items-center group cursor-pointer hover:border-emerald-200 transition-all">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-emerald-600 uppercase">{e.type}</p>
                   <h3 className="font-bold text-gray-800 group-hover:text-emerald-900">{e.title}</h3>
                   <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1 font-bold"><Calendar size={12} /> {e.date}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                   <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black">{e.status}</span>
                   <ChevronRight size={18} className="text-gray-300 group-hover:text-emerald-700" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
           <h2 className="text-2xl font-black text-gray-800">ইবাদত রিমাইন্ডার</h2>
           <div className="space-y-6">
              <ReminderItem icon={<Clock />} title="তাহাজ্জুদ সময়" time="০৩:৩০ AM" />
              <ReminderItem icon={<Sparkles />} title="ইশরাক সময়" time="০৬:৪৫ AM" />
              <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                 <p className="text-amber-900 font-bold mb-2">বিশেষ নসিহত</p>
                 <p className="text-sm text-amber-800 leading-relaxed italic">"রমজানের প্রস্তুতির জন্য এখন থেকেই নফল রোজা ও কুরআন তিলাওয়াতের অভ্যাস গড়ে তুলুন।"</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ReminderItem = ({ icon, title, time }: { icon: React.ReactNode, title: string, time: string }) => (
  <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all">
    <div className="flex items-center gap-4">
      <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">{icon}</div>
      <p className="font-bold text-gray-800">{title}</p>
    </div>
    <p className="text-lg font-black text-emerald-900">{time}</p>
  </div>
);

export default EventsHub;
