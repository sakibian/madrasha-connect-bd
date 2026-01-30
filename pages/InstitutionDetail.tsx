
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, CheckCircle, ArrowLeft, 
  Phone, Globe, Mail, Info, Award, BookOpen, MessageSquare,
  ArrowRight, Users, Calendar, Building2
} from 'lucide-react';
import { MOCK_INSTITUTIONS } from '../data/mockData';

const InstitutionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const institution = MOCK_INSTITUTIONS.find(i => i.id === id);

  if (!institution) {
    return (
      <div className="text-center py-40 space-y-8">
        <h2 className="text-3xl font-extrabold tracking-tight">প্রতিষ্ঠানটি খুঁজে পাওয়া যায়নি।</h2>
        <Link to="/institutions" className="text-sm font-bold border-b-2 border-black pb-1">ডিরেক্টরি দেখুন</Link>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-fadeIn pb-32">
      {/* Navigation */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-8">
        <Link to="/institutions" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black transition-all">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
        <div className="flex gap-4">
           {institution.verified && (
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-bd-green">
                <CheckCircle size={14} /> Verified Institution
             </div>
           )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 bg-gray-100 minimal-border">
         <div className="lg:col-span-7 bg-white p-12 md:p-16 space-y-12 flex flex-col justify-center">
            <div className="space-y-6">
               <div className="caps-label text-bd-green">{institution.type} • Established {institution.established}</div>
               <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">{institution.name}।</h1>
               <div className="flex items-center gap-2 text-xl text-gray-500 font-medium">
                  <MapPin size={22} className="text-gray-300" /> {institution.location}
               </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-gray-100">
               <div className="space-y-1">
                  <div className="caps-label text-gray-400">Total Students</div>
                  <div className="text-3xl font-extrabold">{institution.studentCount || '৫০০+'}</div>
               </div>
               <div className="space-y-1">
                  <div className="caps-label text-gray-400">District</div>
                  <div className="text-3xl font-extrabold">{institution.district}</div>
               </div>
               <div className="hidden md:block space-y-1">
                  <div className="caps-label text-gray-400">Status</div>
                  <div className="text-3xl font-extrabold text-bd-green">সক্রিয়</div>
               </div>
            </div>
         </div>
         <div className="lg:col-span-5 aspect-square lg:aspect-auto bg-gray-50 overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
            <img src={institution.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={institution.name} />
         </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-16">
          {/* About Section */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-3xl font-extrabold tracking-tight">প্রতিষ্ঠানের বিবরণ</h2>
               <div className="h-px bg-gray-100 flex-1"></div>
            </div>
            <div className="bg-white minimal-border p-10 md:p-12 space-y-8">
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {institution.name} বাংলাদেশের একটি স্বনামধন্য {institution.type} দ্বীনি শিক্ষা প্রতিষ্ঠান। দীর্ঘ সময় ধরে এই প্রতিষ্ঠানটি ইসলামের মৌলিক শিক্ষা ও আদর্শ প্রচারের কেন্দ্রবিন্দু হিসেবে কাজ করছে। বর্তমানে আধুনিক কারিকুলাম ও ধর্মীয় জ্ঞানের সমন্বয়ে এখানে দক্ষ আলেম তৈরি করা হচ্ছে।
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FeatureItem icon={<BookOpen size={20} />} text="বিশাল কিতাবাগার ও লাইব্রেরি সুবিধা" />
                 <FeatureItem icon={<Users size={20} />} text="দক্ষ ও অভিজ্ঞ শিক্ষক মন্ডলী" />
                 <FeatureItem icon={<Building2 size={20} />} text="সুপরিকল্পিত আবাসিক ব্যবস্থা" />
                 <FeatureItem icon={<Award size={20} />} text="জাতীয় পর্যায়ের বিভিন্ন স্বীকৃতি" />
              </div>
            </div>
          </section>

          {/* Jobs/Opportunities from this institution */}
          <section className="space-y-8">
            <div className="flex items-center gap-4">
               <h2 className="text-3xl font-extrabold tracking-tight">নিয়োগ বিজ্ঞপ্তি</h2>
               <div className="h-px bg-gray-100 flex-1"></div>
            </div>
            <div className="bg-gray-100 minimal-border space-y-1">
               <OpportunityRow title="সিনিয়র শিক্ষক প্রয়োজন" type="Teacher" date="২ দিন আগে" />
               <OpportunityRow title="অফিস সহকারী" type="Staff" date="৫ দিন আগে" />
            </div>
            <div className="text-right">
               <Link to="/professional" className="text-sm font-bold border-b-2 border-black pb-0.5">সবগুলো নিয়োগ দেখুন</Link>
            </div>
          </section>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
           <div className="bg-black text-white p-12 space-y-10">
              <div className="caps-label text-bd-green">Contact Details</div>
              <div className="space-y-8">
                 <ContactBlock icon={<Phone size={20} />} label="ফোন নম্বর" value="+৮৮০ ১৭XXXXXXXX" />
                 <ContactBlock icon={<Mail size={20} />} label="ইমেইল অ্যাড্রেস" value="info@madrasa.bd" />
                 <ContactBlock icon={<Globe size={20} />} label="ওয়েবসাইট" value="www.madrasa.bd" />
              </div>
              <button className="w-full py-5 bg-white text-black font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-3">
                 মেসেজ দিন <ArrowRight size={18} />
              </button>
           </div>

           <div className="bg-white minimal-border p-10 space-y-8">
              <div className="caps-label text-gray-400">Quick Actions</div>
              <div className="space-y-4">
                 <SideAction icon={<FileText size={18} />} text="ভর্তি নির্দেশিকা" />
                 <SideAction icon={<MessageSquare size={18} />} text="ফলাফল চেক" />
                 <SideAction icon={<Award size={18} />} text="সাফল্যের গল্প" />
              </div>
           </div>

           <div className="p-10 bg-gray-50 border border-gray-100 space-y-6">
              <div className="caps-label text-gray-400">Institutional Aid</div>
              <h4 className="text-xl font-bold leading-tight">এই মাদ্রাসায় সাদাকাহ প্রদান করুন।</h4>
              <Link to="/marketplace" className="w-full py-4 bg-bd-green text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                 অনদান দিন <ArrowRight size={16} />
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }: any) => (
  <div className="flex items-center gap-4 p-5 border border-gray-100">
    <div className="text-bd-green">{icon}</div>
    <span className="text-sm font-bold text-gray-700">{text}</span>
  </div>
);

const OpportunityRow = ({ title, type, date }: any) => (
  <div className="bg-white p-8 flex justify-between items-center group cursor-pointer hover:bg-gray-50 transition-all">
     <div>
        <h4 className="text-xl font-bold group-hover:text-bd-green transition-colors">{title}</h4>
        <div className="flex items-center gap-4 mt-1">
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{type}</span>
           <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">প্রকাশিত: {date}</span>
        </div>
     </div>
     <ArrowRight size={20} className="text-gray-200 group-hover:text-black transition-all" />
  </div>
);

const ContactBlock = ({ icon, label, value }: any) => (
  <div className="space-y-2">
     <div className="flex items-center gap-3 text-gray-500 uppercase tracking-widest text-[9px] font-black">
        {icon} {label}
     </div>
     <div className="text-lg font-bold">{value}</div>
  </div>
);

const SideAction = ({ icon, text }: any) => (
  <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-all border-b border-gray-50 last:border-none group">
     <div className="text-gray-300 group-hover:text-black">{icon}</div>
     <span className="text-sm font-bold text-gray-600 group-hover:text-black">{text}</span>
  </button>
);

const FileText = ({ size }: any) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
);

export default InstitutionDetail;
