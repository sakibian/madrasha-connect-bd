
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Star,
  Users,
  Briefcase,
  BookOpen,
  CheckCircle,
  Sun,
  Moon,
  CloudSun,
  Sunrise,
  Sunset,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
const EDGE_FN_URL = 'https://qazcxnldkrklxdmunfgj.functions.supabase.co/gemini-proxy';

const Home: React.FC = () => {
  const [dailyDeen, setDailyDeen] = useState<{ text: string; source: string } | null>(null);

  useEffect(() => {
    const fetchDailyDeen = async () => {
      try {
        const res = await fetch(EDGE_FN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'daily',
            prompt: 'আজকের জন্য একটি ছোট এবং অনুপ্রেরণামূলক হাদিস বা কুরআনের আয়াত নির্বাচন করুন। শুধুমাত্র বাংলা অনুবাদ এবং রেফারেন্স প্রদান করুন।',
          }),
        });
        const data = await res.json();
        const text = data.text || "ধৈর্যের মাধ্যমেই আল্লাহ সাহায্য করেন।";
        setDailyDeen({ text, source: "দৈনিক নসিহত" });
      } catch (e) {
        setDailyDeen({ text: "আল্লাহর সাহায্য অতি নিকটেই।", source: "কুরআন ২:২১৪" });
      }
    };
    fetchDailyDeen();
  }, []);

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Welcome Header */}
      <div className="space-y-4">
        <div className="caps-label text-gray-400">Internal Portal</div>
        <h1 className="text-5xl font-extrabold tracking-tight">আসসালামু আলাইকুম।</h1>
      </div>

      {/* Daily Deen: Minimalist Banner */}
      <section className="bg-black text-white p-12 space-y-6">
        <div className="flex items-center gap-3">
          <Sparkles className="text-bd-green" size={20} />
          <div className="caps-label text-gray-400">Daily Wisdom</div>
        </div>
        <div className="max-w-3xl space-y-4">
          <p className="text-3xl font-extrabold leading-tight">
             {dailyDeen ? dailyDeen.text : "লোড হচ্ছে..."}
          </p>
          <p className="text-sm font-bold text-gray-500">— {dailyDeen?.source}</p>
        </div>
      </section>

      {/* Grid: Prayer & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-gray-100 minimal-border">
         {/* Prayer Times Widget */}
         <div className="lg:col-span-8 bg-white p-12 space-y-10">
            <div className="flex justify-between items-center">
               <h2 className="text-3xl font-extrabold">নামাজের সময়</h2>
               <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">ঢাকা • ১৫ ফেব্রুয়ারি ২০২৫</div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               <PrayerCard label="ফজর" time="৫:১৬" icon={<Sunrise size={18} />} />
               <PrayerCard label="জোহর" time="১২:১২" icon={<Sun size={18} />} />
               <PrayerCard label="আসর" time="৪:১৩" icon={<CloudSun size={18} />} />
               <PrayerCard label="মাগরিব" time="৫:৫৬" icon={<Sunset size={18} />} />
               <PrayerCard label="এশা" time="৭:১১" icon={<Moon size={18} />} />
            </div>
         </div>
         {/* Simple Stats */}
         <div className="lg:col-span-4 bg-gray-50 p-12 flex flex-col justify-between">
            <div className="space-y-8">
               <div className="caps-label text-gray-400">Platform Activity</div>
               <div className="space-y-6">
                  <SmallStat label="সক্রিয় মাদ্রাসা" value="২,৫০০+" />
                  <SmallStat label="নিবন্ধিত ছাত্র" value="১৫০কে+" />
                  <SmallStat label="চাকরি বিজ্ঞপ্তি" value="৪৩০+" />
               </div>
            </div>
            <Link to="/professional" className="text-sm font-bold flex items-center gap-2 pt-10">
               ক্যারিয়ার হাব দেখুন <ArrowUpRight size={18} />
            </Link>
         </div>
      </div>

      {/* Recent Jobs: Strict List */}
      <section className="space-y-8">
         <div className="flex justify-between items-end border-b border-gray-100 pb-8">
            <h2 className="text-3xl font-extrabold">সাম্প্রতিক নিয়োগ</h2>
            <Link to="/professional" className="text-sm font-bold border-b-2 border-black">সবগুলো দেখুন</Link>
         </div>
         <div className="space-y-1 bg-gray-100 minimal-border">
            <JobRow title="সিনিয়র মুহাদ্দিস প্রয়োজন" inst="দারুল উলুম মাদ্রাসা, চট্টগ্রাম" salary="৳ ২৫,০০০ - ৩০,০০০" />
            <JobRow title="খতিব ও ইমাম নিয়োগ" inst="বায়তুল মামুর মসজিদ, ঢাকা" salary="৳ ১৮,০০০+" />
            <JobRow title="হেফজ শিক্ষক" inst="জামেয়া কাসেমিয়া কামিল মাদ্রাসা" salary="৳ ১৫,০০০+" />
         </div>
      </section>
    </div>
  );
};

const PrayerCard = ({ label, time, icon }: any) => (
  <div className="space-y-4 text-center p-6 minimal-border hover:bg-black hover:text-white transition-all group">
    <div className="flex justify-center text-bd-green group-hover:text-white">{icon}</div>
    <div className="space-y-1">
      <div className="text-xl font-extrabold">{time}</div>
      <div className="caps-label text-gray-400 group-hover:text-gray-500">{label}</div>
    </div>
  </div>
);

const SmallStat = ({ label, value }: any) => (
  <div className="space-y-1">
    <div className="text-3xl font-extrabold">{value}</div>
    <div className="caps-label text-gray-400">{label}</div>
  </div>
);

const JobRow = ({ title, inst, salary }: any) => (
  <div className="bg-white p-8 flex justify-between items-center hover:bg-gray-50 transition-all group">
     <div className="space-y-1">
        <h4 className="text-xl font-bold">{title}</h4>
        <p className="text-sm text-gray-500 font-medium">{inst}</p>
     </div>
     <div className="flex items-center gap-8">
        <span className="text-sm font-bold">{salary}</span>
        <button className="w-10 h-10 bg-black text-white flex items-center justify-center hover:bg-bd-green transition-all"><ArrowUpRight size={18} /></button>
     </div>
  </div>
);

export default Home;
