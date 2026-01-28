
import React from 'react';
import { 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Star,
  Users,
  Briefcase,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <section className="relative overflow-hidden bg-emerald-800 rounded-3xl p-8 md:p-12 text-white">
        <div className="relative z-10 md:w-2/3">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            বাংলাদেশের মাদ্রাসা কমিউনিটির <br /> ডিজিটাল ইকোসিস্টেম
          </h1>
          <p className="text-emerald-100 text-lg mb-8 max-w-lg">
            ইমাম, শিক্ষক, শিক্ষার্থী এবং সাধারণ মুমিনদের জন্য একটি সমন্বিত প্ল্যাটফর্ম। আপনার জ্ঞান এবং ক্যারিয়ার এগিয়ে নিন।
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/professional" className="bg-white text-emerald-800 px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center gap-2">
              চাকরি খুঁজুন <ArrowRight size={20} />
            </Link>
            <Link to="/knowledge" className="bg-emerald-700 border border-emerald-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors">
              শিক্ষা কার্যক্রম
            </Link>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4 rotate-45 border-[20px] border-white rounded-full"></div>
      </section>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={<TrendingUp className="text-emerald-600" />} label="সক্রিয় মাদ্রাসা" value="২,৫০০+" />
        <StatCard icon={<Users className="text-blue-600" />} label="নিবন্ধিত ছাত্র" value="১৫০কে+" />
        <StatCard icon={<Briefcase className="text-orange-600" />} label="বর্তমান চাকরি" value="৪৩০+" />
        <StatCard icon={<Star className="text-yellow-500" />} label="ভেরিফাইড আলেম" value="৫০০+" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Briefcase size={22} className="text-emerald-700" />
              সাম্প্রতিক নিয়োগ বিজ্ঞপ্তি
            </h2>
            <Link to="/professional" className="text-emerald-700 text-sm font-semibold hover:underline">সবগুলো দেখুন</Link>
          </div>
          <JobMiniCard title="সিনিয়র মুহাদ্দিস প্রয়োজন" institution="দারুল উলুম মাদ্রাসা, চট্টগ্রাম" salary="৳ ২৫,০০০ - ৩০,০০০" time="২ ঘণ্টা আগে" />
          <JobMiniCard title="খতিব ও ইমাম নিয়োগ" institution="বায়তুল মামুর মসজিদ, ঢাকা" salary="৳ ১৮,০০০+" time="৫ ঘণ্টা আগে" />
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-50">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-blue-600" /> কুইক লার্নিং
            </h2>
            <div className="space-y-3">
              <div className="p-3 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-emerald-100 cursor-pointer">
                <p className="text-sm font-semibold text-gray-700">বেফাকুল মাদারিস সিলেবাস (২০২৪)</p>
                <p className="text-xs text-gray-500">ডিজিটাল কারিকুলাম দেখুন</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center">
    <div className="p-2 bg-gray-50 rounded-xl mb-2">{icon}</div>
    <p className="text-xl font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const JobMiniCard: React.FC<{ title: string; institution: string; salary: string; time: string }> = ({ title, institution, salary, time }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
    <div>
      <h3 className="font-bold text-gray-800 text-lg mb-1">{title}</h3>
      <p className="text-sm text-gray-600 flex items-center gap-1">{institution} <CheckCircle size={14} className="text-blue-500" /></p>
      <div className="flex gap-4 mt-2">
        <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">{salary}</span>
        <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> {time}</span>
      </div>
    </div>
    <Link to="/professional" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-all">আবেদন</Link>
  </div>
);

export default Home;
