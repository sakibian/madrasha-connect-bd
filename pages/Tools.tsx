
import React, { useState } from 'react';
import { Calculator, BookOpen, Clock, CheckCircle, ArrowRight, DollarSign, Wallet, Star, Search, FileText, Loader2, ArrowUpRight } from 'lucide-react';

const Tools: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'zakat' | 'khutbah' | 'results'>('zakat');

  return (
    <div className="space-y-16 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Management & Utilities</div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">ইউটিলিটি টুলস।</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
          আপনার দৈনন্দিন দ্বীনি ও দাপ্তরিক কাজগুলো সহজ করতে আমাদের বিশেষ ডিজিটাল সরঞ্জামসমূহ।
        </p>
      </div>

      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 minimal-border w-fit">
        <ToolTab active={activeTool === 'zakat'} onClick={() => setActiveTool('zakat')} icon={<Calculator size={18} />} label="জাকাত ক্যালকুলেটর" />
        <ToolTab active={activeTool === 'khutbah'} onClick={() => setActiveTool('khutbah')} icon={<BookOpen size={18} />} label="খুতবাহ প্ল্যানার" />
        <ToolTab active={activeTool === 'results'} onClick={() => setActiveTool('results')} icon={<FileText size={18} />} label="বোর্ড রেজাল্ট" />
      </div>

      <div className="animate-fadeIn">
        {activeTool === 'zakat' && <ZakatCalculator />}
        {activeTool === 'khutbah' && <KhutbahPlanner />}
        {activeTool === 'results' && <ResultChecker />}
      </div>
    </div>
  );
};

const ToolTab = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-8 py-4 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-3 ${active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-white'}`}
  >
    {icon} {label}
  </button>
);

const ResultChecker = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setLoading(false);
      setResult({
        name: 'মোহাম্মদ সালমান',
        board: 'বেফাকুল মাদারিস',
        class: 'দাওরায়ে হাদীস',
        year: '২০২৩',
        status: 'Mumtaz (A+)',
        marks: '৬৫০/৭০০'
      });
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-gray-100 minimal-border">
       <div className="bg-white p-12 md:p-16 space-y-12">
          <div className="space-y-4">
            <div className="caps-label text-bd-green">Portal Entrance</div>
            <h2 className="text-3xl font-extrabold tracking-tight">বোর্ড রেজাল্ট পোর্টাল।</h2>
            <p className="text-gray-500 font-medium">বেফাক ও মাদ্রাসা শিক্ষা বোর্ডের ফলাফল দেখুন এখানে।</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-8">
            <div className="space-y-6">
              <SelectInput label="বোর্ড নির্বাচন করুন">
                 <option>বেফাকুল মাদারিসিল আরাবিয়া (BEFAQ)</option>
                 <option>মাদ্রাসা শিক্ষা বোর্ড (Alia)</option>
              </SelectInput>
              <div className="grid grid-cols-2 gap-6">
                <SelectInput label="পরীক্ষার বছর">
                   <option>২০২৪</option>
                   <option>২০২৩</option>
                </SelectInput>
                <InputField label="রোল নম্বর" placeholder="১২২৩৪৫" />
              </div>
              <InputField label="রেজিস্ট্রেশন নম্বর" placeholder="৯৮৭৬৫৪" />
            </div>
            <button className="w-full py-6 bg-black text-white font-bold text-lg flex items-center justify-center gap-4 hover:bg-gray-800 transition-all">
               {loading ? <Loader2 className="animate-spin" /> : <><Search size={24} /> ফলাফল দেখুন</>}
            </button>
          </form>
       </div>
       
       <div className="bg-white p-12 md:p-16 flex flex-col items-center justify-center text-center">
          {result ? (
            <div className="space-y-10 animate-fadeIn w-full max-w-sm">
               <div className="space-y-4">
                  <div className="caps-label text-bd-green">Student Profile</div>
                  <h3 className="text-4xl font-extrabold tracking-tight">{result.name}</h3>
                  <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">{result.board} • {result.year}</p>
               </div>
               
               <div className="p-10 minimal-border bg-gray-50 space-y-2">
                  <div className="caps-label text-gray-400 mb-2">Final Result</div>
                  <p className="text-4xl font-black text-black">{result.status}</p>
                  <p className="text-sm font-bold text-gray-400 mt-4">শ্রেণী: {result.class}</p>
                  <p className="text-xs font-bold text-bd-green mt-1">মোট নম্বর: {result.marks}</p>
               </div>
               
               <button className="text-xs font-black uppercase tracking-widest border-b-2 border-black pb-1 hover:text-gray-500 hover:border-gray-500 transition-all">
                 ডাউনলোড মার্কশিট (PDF)
               </button>
            </div>
          ) : (
            <div className="space-y-6 opacity-30 grayscale">
               <FileText size={80} className="mx-auto" />
               <p className="text-xl font-bold tracking-tight">সঠিক তথ্য দিয়ে সার্চ করুন।</p>
            </div>
          )}
       </div>
    </div>
  );
};

const SelectInput = ({ label, children }: any) => (
  <div className="space-y-2">
    <label className="caps-label text-gray-400">{label}</label>
    <select className="w-full p-4 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold text-sm">
      {children}
    </select>
  </div>
);

const ZakatCalculator = () => {
  const [cash, setCash] = useState<number>(0);
  const [gold, setGold] = useState<number>(0);
  const [silver, setSilver] = useState<number>(0);
  const [debts, setDebts] = useState<number>(0);

  const total = (cash + gold + silver) - debts;
  const zakat = total > 0 ? (total * 0.025) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 bg-gray-100 minimal-border">
      <div className="bg-white p-12 md:p-16 space-y-12">
        <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
           <Wallet size={32} /> সম্পদ বিবরণী
        </h2>
        <div className="space-y-10">
          <InputField label="নগদ সঞ্চয় (৳)" value={cash} onChange={setCash} />
          <InputField label="স্বর্ণের মূল্য (৳)" value={gold} onChange={setGold} />
          <InputField label="রুপার মূল্য (৳)" value={silver} onChange={setSilver} />
          <InputField label="ঋণ ও বকেয়া (৳)" value={debts} onChange={setDebts} negative />
        </div>
      </div>
      <div className="bg-black text-white p-12 md:p-20 flex flex-col items-center justify-center text-center space-y-10">
        <div className="space-y-4">
           <div className="caps-label text-bd-green">Estimator</div>
           <p className="text-lg font-bold text-gray-500">আপনার প্রদেয় জাকাত (আনুমানিক)</p>
           <h3 className="text-6xl md:text-7xl font-black tracking-tight">৳ {zakat.toLocaleString()}</h3>
        </div>
        <p className="text-sm text-gray-600 max-w-xs font-medium leading-relaxed">
           এটি একটি সাধারণ হিসাব। সঠিক নিসাব এবং জাকাত পরিশোধের জন্য ফকিহ বা আলেমদের সরাসরি পরামর্শ নিন।
        </p>
        <button className="bg-white text-black px-12 py-5 font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-3">
           জাকাত প্রদান করুন (সাদাকাহ) <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

const InputField = ({ label, value, onChange, negative, placeholder }: any) => (
  <div className="space-y-3">
    <label className="caps-label text-gray-400">{label}</label>
    <div className="relative">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 font-bold text-gray-500 text-2xl">{negative ? '−' : '৳'}</span>
      <input 
        type="number" 
        placeholder={placeholder}
        className={`w-full pl-10 pr-4 py-4 bg-transparent border-b-2 border-gray-100 focus:border-black outline-none transition-all font-black text-3xl`}
        value={value || ''}
        onChange={(e) => onChange ? onChange(Number(e.target.value)) : null}
      />
    </div>
  </div>
);

const KhutbahPlanner = () => (
  <div className="space-y-12">
    <div className="p-12 minimal-border bg-white flex justify-between items-center">
      <div className="space-y-2">
         <h2 className="text-3xl font-extrabold tracking-tight">আসন্ন জুমুআহ এর বিষয়বস্তু।</h2>
         <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">১৫ ফেব্রুয়ারি ২০২৫ • শুক্রবার</p>
      </div>
      <button className="text-xs font-black uppercase tracking-widest border border-gray-200 px-6 py-3 hover:bg-black hover:text-white transition-all">গাইডলাইন ডাউনলোড</button>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-gray-100 minimal-border">
      <KhutbahCard title="পবিত্রতা ও ঈমানের মজবুতি" board="বেফাক অনুমোদিত" active />
      <KhutbahCard title="ব্যবসায় ইসলামি আদর্শ" board="ইসলামিক ফাউন্ডেশন" />
      <KhutbahCard title="সামাজিক সম্প্রীতি" board="সাধারণ বিষয়বস্তু" />
    </div>
  </div>
);

const KhutbahCard = ({ title, board, active }: any) => (
  <div className={`p-12 flex flex-col justify-between group transition-all h-[350px] cursor-pointer ${active ? 'bg-black text-white' : 'bg-white hover:bg-gray-50'}`}>
    <div className="space-y-6">
       <Star size={32} className={active ? 'text-bd-green' : 'text-gray-100 group-hover:text-black'} fill="currentColor" />
       <div className="space-y-2">
          <div className="caps-label text-gray-500">{board}</div>
          <h4 className="text-2xl font-extrabold tracking-tight leading-tight">{title}</h4>
       </div>
    </div>
    <div className="pt-8 border-t border-gray-100 group-hover:border-gray-800 flex items-center justify-between">
       <span className="text-[10px] font-black uppercase tracking-widest">Select Theme</span>
       <ArrowUpRight size={20} className="text-gray-300 group-hover:text-bd-green" />
    </div>
  </div>
);

export default Tools;
