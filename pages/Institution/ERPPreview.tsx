
import React from 'react';
import { Users, Calendar, Wallet, FileText, ArrowRight, Clock, Plus, ShieldCheck } from 'lucide-react';

const ERPPreview: React.FC = () => {
  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-border pb-12">
        <div className="space-y-4">
          <div className="caps-label text-muted-foreground">Institutional Resource Planning</div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">মাদ্রাসা ম্যানেজমেন্ট <br />ইআরপি (ERP)।</h1>
        </div>
        <div className="bg-primary text-primary-foreground px-6 py-2.5 text-[10px] font-black uppercase tracking-widest">
           Premium Feature Preview
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ERPCard icon={<Users size={20} />} label="মোট ছাত্র" value="১২৫০" />
        <ERPCard icon={<Calendar size={20} />} label="উপস্থিতি (আজ)" value="৯৪%" />
        <ERPCard icon={<Wallet size={20} />} label="মাসিক সংগ্রহ" value="৳ ৮৫,৫০০" />
        <ERPCard icon={<FileText size={20} />} label="বকেয়া তালিকা" value="১২ জন" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-card minimal-border overflow-hidden">
            <div className="p-10 border-b border-border flex justify-between items-center">
               <h3 className="text-2xl font-extrabold tracking-tight">দৈনিক উপস্থিতি ট্র্যাকার</h3>
               <select className="text-[10px] font-black uppercase tracking-widest border border-border p-2 outline-none">
                  <option>সপ্তম শ্রেণী (ক)</option>
                  <option>অষ্টম শ্রেণী (খ)</option>
               </select>
            </div>
            <div className="divide-y divide-gray-100">
               {[1,2,3,4].map(i => (
                 <div key={i} className="flex justify-between items-center p-8 hover:bg-muted transition-all">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-muted flex items-center justify-center font-bold text-muted-foreground">0{i}</div>
                       <div>
                          <p className="text-lg font-bold text-foreground">শিক্ষার্থী {i}</p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">রোল: {100+i} • শাখা: ক</p>
                       </div>
                    </div>
                    <div className="flex gap-6 p-1">
                       <button className="px-6 py-2 bg-card text-foreground font-black text-[10px] uppercase hover:bg-primary hover:text-primary-foreground transition-all">P</button>
                       <button className="px-6 py-2 bg-card text-foreground font-black text-[10px] uppercase hover:bg-primary hover:text-primary-foreground transition-all">A</button>
                    </div>
                 </div>
               ))}
            </div>
            <div className="p-8 bg-muted border-t border-border text-right">
               <button className="text-sm font-bold flex items-center gap-2 justify-end ml-auto">পূর্ণাঙ্গ লিস্ট দেখুন <ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-primary text-primary-foreground p-12 space-y-10 h-full flex flex-col justify-between">
              <div className="space-y-6">
                 <div className="caps-label text-primary-foreground">Fund Management</div>
                 <h3 className="text-3xl font-extrabold leading-tight">সাদাকাহ ও <br />জাকাত পোর্টাল।</h3>
                 <div className="space-y-4 pt-6">
                    <div className="p-6 bg-secondary minimal-border">
                       <p className="caps-label text-primary-foreground mb-2">জাকাত কালেকশন (২০২৫)</p>
                       <p className="text-3xl font-black">৳ ৩,২৫,০০০</p>
                    </div>
                 </div>
              </div>
              <button className="w-full py-5 bg-card text-foreground font-bold text-sm flex items-center justify-center gap-3 hover:bg-muted transition-all">
                 <Plus size={20} /> নতুন রশিদ তৈরি
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ERPCard = ({ icon, label, value }: any) => (
  <div className="bg-card p-10 flex flex-col gap-6 group hover:bg-primary hover:text-primary-foreground transition-all" rounded-lg border border-border>
    <div className="text-foreground group-hover:text-primary-foreground transition-colors">{icon}</div>
    <div className="space-y-1">
      <div className="text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="caps-label text-muted-foreground group-hover:text-muted-foreground">{label}</div>
    </div>
  </div>
);

export default ERPPreview;
