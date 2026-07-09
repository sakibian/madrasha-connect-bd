
import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  BookOpen, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  Clock,
  ExternalLink,
  User as UserIcon,
  Headset,
  History,
  Trophy,
  ChevronRight,
  Share2,
  Users,
  Copy
} from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import { dataService } from '../../services/dataService';
import { Link } from 'react-router-dom';
import ImageWithFallback from '../../components/ui/ImageWithFallback';

const UserDashboard: React.FC = () => {
  const user = getCurrentUser();
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    dataService.getOrCreateReferralCode(user.id).then(setReferralCode);
    dataService.getReferralStats(user.id).then(setReferralStats);
  }, [user]);

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-16 animate-fadeIn">
      {/* Profile Header */}
      <div className="p-12 minimal-border bg-white flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-8">
          <div className="relative">
            <ImageWithFallback src={user?.avatar} name={user?.name} className="w-24 h-24 border-4 border-gray-50 shadow-sm object-cover bg-gray-50" alt="Profile" />
            <div className="absolute -bottom-2 -right-2 bg-black text-white p-1.5"><CheckCircle size={16} /></div>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight">{user?.name}</h1>
            <p className="caps-label text-gray-400">Community Member • {user?.role}</p>
          </div>
        </div>
        <Link to="/profile-builder" className="bg-black text-white px-10 py-5 font-bold text-sm hover:bg-gray-800 transition-all">
           প্রোফাইল আপডেট
        </Link>
      </div>

      {/* Referral Section */}
      {referralCode && (
        <div className="bg-gradient-to-br from-emerald-900 to-teal-900 rounded-[2.5rem] p-10 text-white space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-emerald-400/20 rounded-3xl backdrop-blur-md border border-emerald-400/30">
                <Users size={24} className="text-emerald-400" />
              </div>
              <div>
                <h2 className="text-xl font-black">বন্ধুদের আমন্ত্রণ জানান</h2>
                <p className="text-emerald-300 text-sm font-medium">প্রতিটি সফল আমন্ত্রণে ৩০ CP পান</p>
              </div>
            </div>
            {referralStats.total > 0 && (
              <div className="text-right space-y-1">
                <div className="text-3xl font-black">{referralStats.completed}</div>
                <div className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">সফল আমন্ত্রণ</div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3 bg-white/10 border border-emerald-400/30 rounded-2xl p-4 backdrop-blur-sm">
            <span className="text-sm font-bold text-emerald-200 truncate flex-1">
              {window.location.origin}/register?ref={referralCode}
            </span>
            <button
              onClick={handleCopyReferral}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                copied ? 'bg-white text-emerald-900' : 'bg-emerald-400 text-emerald-900 hover:bg-white'
              }`}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'কপি করা হয়েছে!' : 'লিংক কপি করুন'}
            </button>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
        <StatCard icon={<Briefcase size={20} />} label="আবেদনকৃত চাকরি" value="৪টি" />
        <StatCard icon={<BookOpen size={20} />} label="বুকমার্ক রিসোর্স" value="৮টি" />
        <StatCard icon={<CheckCircle size={20} />} label="প্রোফাইল পূর্ণতা" value="৭৫%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* Recent Applications */}
          <div className="space-y-8">
             <div className="flex justify-between items-end border-b border-gray-100 pb-8">
                <h2 className="text-2xl font-extrabold tracking-tight">আমার আবেদনসমূহ</h2>
                <Link to="/professional" className="text-xs font-bold border-b-2 border-black">নতুন খুঁজুন</Link>
             </div>
             <div className="bg-gray-100 minimal-border space-y-1">
                <ApplicationItem title="হেফজ শিক্ষক" inst="দারুল উলুম মাদ্রাসা" status="Reviewing" date="২ দিন আগে" />
                <ApplicationItem title="সিনিয়র শিক্ষক" inst="হাটহাজারী মাদ্রাসা" status="Shortlisted" date="৫ দিন আগে" />
                <ApplicationItem title="ইমাম ও খতিব" inst="বায়তুল মোকাররম মসজিদ" status="Rejected" date="১ সপ্তাহ আগে" />
             </div>
          </div>

          {/* Quick Access Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Link to="/audio-library" className="p-10 bg-white minimal-border group hover:bg-black hover:text-white transition-all">
                <Headset size={32} className="text-bd-green mb-6 transition-colors group-hover:text-white" />
                <h3 className="text-xl font-bold mb-2">অডিও লাইব্রেরি</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 font-medium">তিলাওয়াত ও বয়ান শুনুন এক জায়গায়।</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold border-b border-black group-hover:border-white w-fit pb-1">লাইব্রেরি দেখুন <ChevronRight size={14} /></div>
             </Link>
             <Link to="/competitions" className="p-10 bg-white minimal-border group hover:bg-black hover:text-white transition-all">
                <Trophy size={32} className="text-bd-green mb-6 transition-colors group-hover:text-white" />
                <h3 className="text-xl font-bold mb-2">প্রতিযোগিতা</h3>
                <p className="text-sm text-gray-500 group-hover:text-gray-400 font-medium">জাতীয় মেধা প্রতিযোগিতায় অংশ নিন।</p>
                <div className="mt-6 flex items-center gap-2 text-xs font-bold border-b border-black group-hover:border-white w-fit pb-1">অংশ নিন <ChevronRight size={14} /></div>
             </Link>
          </div>
        </div>

        {/* Saved Items Sidebar */}
        <div className="space-y-8">
           <div className="flex justify-between items-end border-b border-gray-100 pb-8">
              <h2 className="text-2xl font-extrabold tracking-tight">সংরক্ষিত লাইব্রেরি</h2>
              <Link to="/knowledge" className="text-xs font-bold border-b-2 border-black">লাইব্রেরি দেখুন</Link>
           </div>
           <div className="space-y-4">
              <SavedItem to="/knowledge" title="হিদায়াতুন্নাহু (পিডিএফ)" category="আরবি গ্রামার" type="PDF" />
              <SavedItem to="/deen101" title="সালাত শিক্ষা মডিউল" category="শিক্ষা রিসোর্স" type="INTERACTIVE" />
              <SavedItem to="/knowledge" title="মেশকাত শরিফ (দাওয়াতে হাদিস)" category="বেফাক সিলেবাস" type="PDF" />
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-12 flex flex-col gap-6 group hover:bg-black hover:text-white transition-all">
    <div className="text-bd-green group-hover:text-white transition-colors">{icon}</div>
    <div className="space-y-1">
      <div className="text-4xl font-extrabold tracking-tight">{value}</div>
      <div className="caps-label text-gray-400 group-hover:text-gray-500">{label}</div>
    </div>
  </div>
);

const ApplicationItem = ({ title, inst, status, date }: any) => {
  const statusLabels: any = {
    Reviewing: { label: 'পর্যালোচনায়', color: 'bg-gray-100 text-gray-500' },
    Shortlisted: { label: 'নির্বাচিত', color: 'bg-bd-green text-white' },
    Rejected: { label: 'বাতিল', color: 'bg-red-50 text-red-600' }
  };
  const s = statusLabels[status];
  return (
    <div className="bg-white p-8 flex justify-between items-center group transition-all">
       <div className="space-y-1">
          <h3 className="font-extrabold text-lg group-hover:text-bd-green transition-colors">{title}</h3>
          <p className="text-sm font-bold text-gray-400">{inst}</p>
          <p className="text-[10px] font-bold text-gray-500 uppercase mt-2 flex items-center gap-2"><Clock size={12} /> {date}</p>
       </div>
       <span className={`text-[9px] font-black px-4 py-1.5 uppercase tracking-widest ${s.color}`}>{s.label}</span>
    </div>
  );
};

const SavedItem = ({ to, title, category, type }: any) => (
  <Link to={to} className="block p-8 minimal-border bg-white group hover:bg-black hover:text-white transition-all">
     <div className="flex justify-between items-start mb-6">
        <div className="caps-label text-bd-green group-hover:text-gray-400">{type}</div>
        <button className="text-gray-300 group-hover:text-white"><Heart size={20} fill="currentColor" /></button>
     </div>
     <h4 className="text-xl font-extrabold mb-1">{title}</h4>
     <p className="text-sm font-bold text-gray-500 group-hover:text-gray-400">{category}</p>
     <div className="mt-8 pt-8 border-t border-gray-100 group-hover:border-gray-800 flex items-center justify-between">
        <span className="text-xs font-bold border-b-2 border-black group-hover:border-white pb-0.5 transition-all">এখনই পড়ুন</span>
        <ArrowRight size={18} className="text-gray-200 group-hover:text-white" />
     </div>
  </Link>
);

export default UserDashboard;
