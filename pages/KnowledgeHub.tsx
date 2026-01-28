
import React from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Search,
  Book,
  FileText,
  Video
} from 'lucide-react';

const KnowledgeHub: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">জ্ঞান ও শিক্ষা (LMS)</h1>
          <p className="text-gray-500">মাদ্রাসার কারিকুলাম, কিতাব এবং শিখন সামগ্রীর ভাণ্ডার।</p>
        </div>
        <div className="flex gap-2">
           <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-blue-100 flex items-center gap-2">
             <Video size={18} /> অনলাইন ক্লাস
           </button>
        </div>
      </div>

      {/* Hero Search */}
      <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100 text-center relative overflow-hidden">
        <h2 className="text-2xl font-bold text-blue-900 mb-4 relative z-10">আপনার প্রয়োজনীয় কিতাব বা সিলেবাস খুঁজুন</h2>
        <div className="max-w-xl mx-auto relative z-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="যেমন: হিদায়া, বেফাক সিলেবাস, তাজবীদ নিয়ম..." 
            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border-2 border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all text-lg shadow-sm"
          />
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2 relative z-10">
          <span className="text-xs font-semibold px-3 py-1 bg-white text-blue-600 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100">বেফাকুল মাদারিস</span>
          <span className="text-xs font-semibold px-3 py-1 bg-white text-blue-600 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100">আলিয়া কারিকুলাম</span>
          <span className="text-xs font-semibold px-3 py-1 bg-white text-blue-600 rounded-full border border-blue-100 cursor-pointer hover:bg-blue-100">খুতবাহ রিসোর্স</span>
        </div>
      </div>

      {/* Main Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Qawmi Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-l-4 border-orange-500 pl-4 py-1">
             <h2 className="text-xl font-bold text-gray-800">কওমি (বেফাক) শিক্ষা</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
            <CurriculumItem title="মারহালাতুদ দাওয়াতিল হাদিস (মাস্টার্স)" year="২০২৪ সিলেবাস" />
            <CurriculumItem title="মারহালাতুল ফজিলাত (ডিগ্রি)" year="২০২৪ সিলেবাস" />
            <CurriculumItem title="মারহালাতুল মুতাওয়াসসিতাহ (নিম্ন মাধ্যমিক)" year="২০২৪ সিলেবাস" />
            <CurriculumItem title="হিফজুল কুরআন বিভাগ" year="নুরানি ও নাজেরা" />
          </div>
        </div>

        {/* Alia Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-l-4 border-emerald-600 pl-4 py-1">
             <h2 className="text-xl font-bold text-gray-800">আলিয়া মাদ্রাসা কারিকুলাম</h2>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y">
            <CurriculumItem title="কামিল (মাস্টার্স)" year="ইসলামি আরবি বিশ্ববিদ্যালয়" />
            <CurriculumItem title="ফাযিল (ডিগ্রি)" year="ইসলামি আরবি বিশ্ববিদ্যালয়" />
            <CurriculumItem title="দাখিল ও আলিম (এসএসসি/এইচএসসি)" year="মাদ্রাসা শিক্ষা বোর্ড" />
            <CurriculumItem title="ইবতেদায়ী (প্রাথমিক)" year="মাদ্রাসা শিক্ষা বোর্ড" />
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
           <Book size={22} className="text-blue-600" />
           জনপ্রিয় রিসোর্সসমূহ
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ResourceCard 
            title="সহজ তাজবীদ গাইড" 
            type="PDF" 
            icon={<FileText className="text-red-500" />} 
            downloadCount="১২কে+" 
          />
          <ResourceCard 
            title="সাপ্তাহিক খুতবাহ মডিউল" 
            type="DOCX" 
            icon={<FileText className="text-blue-500" />} 
            downloadCount="৫কে+" 
          />
          <ResourceCard 
            title="আরবি গ্রামার (নাহু-সরফ)" 
            type="VIDEO" 
            icon={<Video className="text-orange-500" />} 
            downloadCount="৮কে+ ভিউ" 
          />
          <ResourceCard 
            title="বেফাক রেজাল্ট শীট (২০২৩)" 
            type="PDF" 
            icon={<FileText className="text-emerald-500" />} 
            downloadCount="৫০কে+" 
          />
        </div>
      </section>
    </div>
  );
};

const CurriculumItem: React.FC<{ title: string; year: string }> = ({ title, year }) => (
  <div className="p-4 hover:bg-gray-50 flex justify-between items-center group cursor-pointer transition-colors">
    <div>
      <p className="font-bold text-gray-700">{title}</p>
      <p className="text-xs text-gray-400">{year}</p>
    </div>
    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
       <button className="p-2 bg-white rounded-lg border border-gray-100 text-blue-600 hover:shadow-sm"><Download size={16} /></button>
       <button className="p-2 bg-white rounded-lg border border-gray-100 text-gray-500 hover:shadow-sm"><ExternalLink size={16} /></button>
    </div>
  </div>
);

const ResourceCard: React.FC<{ title: string; type: string; icon: React.ReactNode; downloadCount: string }> = ({ title, type, icon, downloadCount }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-center">
    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-bold text-gray-800 text-sm mb-1">{title}</h3>
    <p className="text-[10px] text-gray-400 font-bold uppercase mb-4 tracking-widest">{type}</p>
    <div className="pt-4 border-t border-gray-50 flex items-center justify-between mt-auto">
       <span className="text-xs text-gray-500 font-medium">{downloadCount}</span>
       <button className="text-blue-600 hover:text-blue-700 font-bold text-xs">ডাউনলোড</button>
    </div>
  </div>
);

export default KnowledgeHub;
