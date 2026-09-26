
import React from 'react';
import { PlayCircle, HelpCircle, Laptop, Smartphone, BookOpen, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import ImageWithFallback from '../components/ui/ImageWithFallback';

const InstructionalHelp: React.FC = () => {
  const tutorials = [
    { title: 'কীভাবে সার্কুলার পোস্ট করবেন?', duration: '৩:৪৫', category: 'প্রতিষ্ঠানের জন্য', icon: <Laptop size={20} /> },
    { title: 'ক্যালিগ্রাফি ডাউনলোড ও প্রিন্ট করার নিয়ম', duration: '২:১৫', category: 'ব্যবহারকারী', icon: <Smartphone size={20} /> },
    { title: 'জাকাত ক্যালকুলেটর ব্যবহারের পদ্ধতি', duration: '৪:১০', category: 'সাধারণ', icon: <HelpCircle size={20} /> },
    { title: 'অনলাইন ক্লাসে যুক্ত হওয়ার গাইড', duration: '৫:০০', category: 'শিক্ষার্থী', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="space-y-24 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-border pb-12">
        <div className="caps-label text-muted-foreground">User Support</div>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">সহায়তা ও টিউটোরিয়াল।</h1>
        <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed font-medium">
          প্ল্যাটফর্মটি ব্যবহারে আপনার যদি কোনো সমস্যা হয়, আমাদের ছোট ভিডিও গাইডগুলো দেখুন। আমরা আপনাকে ডিজিটাল দুনিয়ায় দক্ষ করে তুলতে চাই।
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 bg-muted minimal-border">
        {tutorials.map((video, i) => (
          <div key={i} className="bg-card p-12 group transition-all hover:bg-primary hover:text-primary-foreground">
            <div className="flex items-center justify-between mb-8">
               <div className="caps-label text-foreground group-hover:text-muted-foreground">{video.category}</div>
               <div className="text-xs font-bold text-muted-foreground">ভলিউম ০১</div>
            </div>
            
            <div className="space-y-10">
               <div className="relative aspect-video bg-muted grayscale group-hover:grayscale-0 transition-all duration-700 overflow-hidden">
                   <ImageWithFallback src={`https://picsum.photos/seed/tut${i}/800/450`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt="" />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-16 h-16 bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                        <PlayCircle size={32} className="text-white" fill="currentColor" />
                     </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-primary text-primary-foreground px-3 py-1 text-[9px] font-black tracking-widest uppercase">
                     {video.duration}
                  </div>
               </div>
               
               <div className="space-y-4">
                  <h3 className="text-2xl font-extrabold tracking-tight leading-tight">{video.title}</h3>
                  <button className="text-xs font-bold flex items-center gap-2 group-hover:text-foreground transition-all">
                     এখনই দেখুন <ArrowRight size={18} />
                  </button>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-primary text-primary-foreground p-20 space-y-12">
        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
          <ShieldCheck className="text-primary-foreground" size={32} /> প্রায়শই জিজ্ঞাসিত সহায়তা
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4">
           <HelpRow text="ভেরিফাইড অ্যাকাউন্টের সুবিধা কী কী?" />
           <HelpRow text="পাসওয়ার্ড ভুলে গেলে করণীয় কী?" />
           <HelpRow text="এআই আলেম-এর উত্তরগুলো কতটা নির্ভরযোগ্য?" />
           <HelpRow text="চাকরি প্রার্থী হিসেবে আবেদন করার নিয়ম।" />
        </div>
      </div>
    </div>
  );
};

const HelpRow = ({ text }: { text: string }) => (
  <div className="flex items-center justify-between py-6 border-b border-border hover:border-primary transition-all group cursor-pointer">
    <p className="text-lg font-bold text-muted-foreground group-hover:text-primary-foreground transition-colors">{text}</p>
    <CheckCircle size={20} className="text-foreground group-hover:text-foreground transition-colors" />
  </div>
);

export default InstructionalHelp;
