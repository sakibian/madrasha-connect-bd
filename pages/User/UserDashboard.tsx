
import React from 'react';
import { 
  User as UserIcon, 
  Briefcase, 
  BookOpen, 
  Heart, 
  CheckCircle, 
  ArrowRight,
  Clock,
  ExternalLink
} from 'lucide-react';
import { getCurrentUser } from '../../services/authService';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const user = getCurrentUser();

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white p-8 rounded-3xl border border-emerald-100 flex flex-col md:flex-row justify-between items-center gap-6 shadow-sm">
        <div className="flex items-center gap-6">
          <img src={user?.avatar} className="w-20 h-20 rounded-full border-4 border-emerald-50 shadow-sm" alt="Profile" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
            <p className="text-emerald-700 font-medium">ব্যবহারকারী ড্যাশবোর্ড</p>
          </div>
        </div>
        <button className="bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold hover:bg-emerald-800 shadow-xl shadow-emerald-100 transition-all">
           প্রোফাইল আপডেট করুন
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-orange-50 text-orange-600 rounded-2xl"><Briefcase /></div>
          <div>
            <p className="text-2xl font-black text-gray-800">৪টি</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">আবেদনকৃত চাকরি</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><BookOpen /></div>
          <div>
            <p className="text-2xl font-black text-gray-800">৮টি</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">সেভ করা রিসোর্স</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><CheckCircle /></div>
          <div>
            <p className="text-2xl font-black text-gray-800">৭৫%</p>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">প্রোফাইল পূর্ণতা</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Applications */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">আমার আবেদনসমূহ</h2>
              <Link to="/professional" className="text-emerald-700 text-sm font-bold flex items-center gap-1">নতুন খুঁজুন <ArrowRight size={14} /></Link>
           </div>
           <div className="divide-y divide-gray-50">
              <ApplicationItem title="হেফজ শিক্ষক" inst="দারুল উলুম মাদ্রাসা" status="Reviewing" date="২ দিন আগে" />
              <ApplicationItem title="সিনিয়র শিক্ষক" inst="হাটহাজারী মাদ্রাসা" status="Shortlisted" date="৫ দিন আগে" />
              <ApplicationItem title="ইমাম" inst="বায়তুল মোকাররম মসজিদ" status="Rejected" date="১ সপ্তাহ আগে" />
           </div>
        </div>

        {/* Saved Items */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">বুকমার্ক রিসোর্স</h2>
              <Link to="/knowledge" className="text-blue-600 text-sm font-bold flex items-center gap-1">লাইব্রেরি <ExternalLink size={14} /></Link>
           </div>
           <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="flex items-center gap-3">
                    <BookOpen className="text-blue-600" />
                    <div>
                       <p className="font-bold text-gray-800 text-sm">হিদায়াতুন্নাহু (পিডিএফ)</p>
                       <p className="text-xs text-gray-400">আরবি গ্রামার</p>
                    </div>
                 </div>
                 <button className="text-blue-600 hover:underline text-xs font-bold">পড়ুন</button>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="flex items-center gap-3">
                    <Heart className="text-red-500" />
                    <div>
                       <p className="font-bold text-gray-800 text-sm">সীরাত কুইজ মডিউল</p>
                       <p className="text-xs text-gray-400">শিক্ষা রিসোর্স</p>
                    </div>
                 </div>
                 <button className="text-blue-600 hover:underline text-xs font-bold">পড়ুন</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ApplicationItem = ({ title, inst, status, date }: any) => {
  const statusColors: any = {
    Reviewing: 'bg-blue-100 text-blue-700',
    Shortlisted: 'bg-emerald-100 text-emerald-700',
    Rejected: 'bg-red-100 text-red-700'
  };
  return (
    <div className="p-6 flex justify-between items-center hover:bg-gray-50 transition-colors">
       <div>
          <h3 className="font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-500">{inst}</p>
          <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} /> {date}</p>
       </div>
       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${statusColors[status]}`}>{status}</span>
    </div>
  );
};

export default UserDashboard;
