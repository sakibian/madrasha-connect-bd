
import React, { useState } from 'react';
import { User, GraduationCap, FileText, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { getCurrentUser } from '../services/authService';

const ProfileBuilder: React.FC = () => {
  const user = getCurrentUser();
  const [step, setStep] = useState(1);

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-fadeIn pb-24">
      <div className="space-y-6 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Professional Identity</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">প্রফেশনাল আইডি বিল্ডার।</h1>
        <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
          আপনার ডিজিটাল বায়োডাটা বা সিভি তৈরি করুন। এই তথ্যগুলো নিয়োগকর্তাদের কাছে দৃশ্যমান হবে।
        </p>
      </div>

      <div className="flex flex-wrap gap-1 bg-gray-100 p-1 minimal-border">
        <StepIndicator num={1} label="মৌলিক তথ্য" active={step === 1} />
        <StepIndicator num={2} label="শিক্ষাগত যোগ্যতা" active={step === 2} />
        <StepIndicator num={3} label="অভিজ্ঞতা" active={step === 3} />
        <StepIndicator num={4} label="প্রিভিউ" active={step === 4} />
      </div>

      <div className="bg-white minimal-border p-12 md:p-20">
        {step === 1 && (
          <div className="space-y-12 animate-fadeIn">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
              <User size={28} /> ব্যক্তিগত তথ্য
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Input label="পুরো নাম" value={user?.name || ''} />
              <Input label="মাসলাক / মতাদর্শ" placeholder="উদা: দেওবন্দী / আহলে সুন্নাত" />
              <Input label="স্থায়ী ঠিকানা" placeholder="বিভাগ, জেলা" />
              <Input label="ফোন নম্বর" placeholder="০১XXXXXXXXX" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-12 animate-fadeIn">
            <h2 className="text-3xl font-extrabold tracking-tight flex items-center gap-4">
              <GraduationCap size={28} /> শিক্ষাগত যোগ্যতা (সানাদ)
            </h2>
            <div className="space-y-10">
              <Input label="দাওরায়ে হাদীস (মাস্টার্স)" placeholder="মাদ্রাসার নাম, শিক্ষাবর্ষ, প্রাপ্ত ফলাফল" />
              <Input label="অন্যান্য ডিগ্রি বা তখাস্সুস" placeholder="উদা: মুফতি / আদিব / তাজবীদ" />
            </div>
          </div>
        )}

        <div className="pt-20 mt-20 border-t border-gray-100 flex justify-between items-center">
           <button 
             onClick={() => setStep(s => Math.max(1, s-1))} 
             disabled={step === 1}
             className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${step === 1 ? 'text-gray-200' : 'text-gray-400 hover:text-black'}`}
           >
             <ArrowLeft size={18} /> Back
           </button>
           <button 
             onClick={() => setStep(s => Math.min(4, s+1))} 
             className="bg-black text-white px-12 py-5 font-bold text-sm flex items-center gap-3 hover:bg-gray-800 transition-all"
           >
             {step === 4 ? 'সেভ করুন' : 'পরবর্তী ধাপ'} <ArrowRight size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

const StepIndicator = ({ num, label, active }: any) => (
  <div className={`flex items-center gap-4 px-8 py-4 transition-all ${active ? 'bg-black text-white' : 'text-gray-400 hover:text-black hover:bg-white'} flex-1 justify-center`}>
    <span className={`text-[10px] font-black uppercase tracking-widest`}>{num}. {label}</span>
  </div>
);

const Input = ({ label, placeholder, value }: any) => (
  <div className="space-y-3">
    <label className="caps-label text-gray-400">{label}</label>
    <input 
      defaultValue={value} 
      placeholder={placeholder} 
      className="w-full p-5 bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-black font-bold text-lg" 
    />
  </div>
);

export default ProfileBuilder;
