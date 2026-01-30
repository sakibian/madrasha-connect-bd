
import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  ShieldCheck, 
  Briefcase, 
  MessageCircle,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-all ${isOpen ? 'bg-gray-50' : 'bg-white'}`}>
      <button
        onClick={onClick}
        className="w-full py-10 px-8 flex items-center justify-between text-left group focus:outline-none"
      >
        <span className={`text-xl md:text-2xl font-extrabold tracking-tight transition-colors ${isOpen ? 'text-black' : 'text-gray-800 group-hover:text-black'}`}>
          {question}
        </span>
        <div className={`p-2 transition-all ${isOpen ? 'bg-black text-white' : 'text-gray-300 group-hover:text-black'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 pb-10 max-w-3xl">
          <p className="text-lg text-gray-500 leading-relaxed font-medium">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      category: 'সাধারণ তথ্য',
      items: [
        {
          question: 'মাদ্রাসা কানেক্ট বিডি কী?',
          answer: 'মাদ্রাসা কানেক্ট বিডি হলো বাংলাদেশের মাদ্রাসা কমিউনিটির জন্য একটি সমন্বিত ডিজিটাল প্ল্যাটফর্ম। এখানে শিক্ষক, শিক্ষার্থী এবং মাদ্রাসার সংশ্লিষ্ট ব্যক্তিবর্গ একে অপরের সাথে যুক্ত হতে পারেন, চাকরি খুঁজতে পারেন এবং প্রয়োজনীয় শিক্ষা উপকরণ সংগ্রহ করতে পারেন।'
        },
        {
          question: 'এই প্ল্যাটফর্ম ব্যবহার করতে কি কোনো ফি দিতে হয়?',
          answer: 'না, সাধারণ ব্যবহারকারীদের জন্য প্ল্যাটফর্মের মৌলিক ফিচারগুলো (যেমন: চাকরি খোঁজা, রিসোর্স ডাউনলোড) সম্পূর্ণ ফ্রি। তবে বিশেষ কিছু প্রিমিয়াম সার্ভিস ভবিষ্যতে যুক্ত হতে পারে।'
        }
      ]
    },
    {
      category: 'প্রতিষ্ঠান ও চাকরি',
      items: [
        {
          question: 'কীভাবে একটি প্রতিষ্ঠান হিসেবে নিবন্ধন করব?',
          answer: 'রেজিস্ট্রেশন পেজ থেকে "মাদ্রাসা/মসজিদ" অপশনটি সিলেক্ট করে আপনার প্রতিষ্ঠানের প্রয়োজনীয় তথ্য প্রদান করুন। অ্যাডমিন প্যানেল থেকে আপনার তথ্য যাচাই করার পর অ্যাকাউন্টটি সক্রিয় করা হবে।'
        },
        {
          question: 'সার্কুলার পোস্ট করার নিয়ম কী?',
          answer: 'প্রতিষ্ঠান হিসেবে লগইন করার পর "প্রফেশনাল হাব" অথবা ড্যাশবোর্ড থেকে "নতুন সার্কুলার" বাটনে ক্লিক করুন। আমাদের এআই সিস্টেম পোস্টটি চেক করবে এবং অ্যাডমিন অনুমোদনের পর তা সবার জন্য দৃশ্যমান হবে।'
        }
      ]
    },
    {
      category: 'শিক্ষা ও রিসোর্স',
      items: [
        {
          question: 'কিতাব বা রিসোর্স কীভাবে ডাউনলোড করব?',
          answer: 'নলেজ হাব (Knowledge Hub) এ গিয়ে আপনি বিষয়ভিত্তিক সার্চ করতে পারেন। আপনার প্রয়োজনীয় কিতাবটি খুঁজে পেলে তার পাশের ডাউনলোড বাটনে ক্লিক করুন। ফাইলটি পিডিএফ (PDF) ফরম্যাটে আপনার ডিভাইসে সেভ হবে।'
        }
      ]
    },
    {
      category: 'নিরাপত্তা ও নীতিমালা',
      items: [
        {
          question: 'কমিউনিটি নীতিমালা কী?',
          answer: 'আমরা একটি মার্জিত এবং ধর্মীয় পরিবেশ বজায় রাখতে বদ্ধপরিকর। যেকোনো ধরনের ঘৃণা ছড়ানো, উস্কানিমূলক পোস্ট বা অশালীন ভাষা ব্যবহার কঠোরভাবে নিষিদ্ধ। এআই এবং অ্যাডমিন মডারেটররা প্রতিনিয়ত প্ল্যাটফর্মটি পর্যবেক্ষণ করেন।'
        }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-24 animate-fadeIn pb-24">
      {/* Header */}
      <div className="space-y-6 border-b border-gray-100 pb-12">
        <div className="caps-label text-gray-400">Support Center</div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]">সাধারণ জিজ্ঞাসা <br /> (FAQ)।</h1>
        <p className="text-xl text-gray-500 max-w-2xl leading-relaxed font-medium">
          মাদ্রাসা কানেক্ট বিডি প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী এবং সচরাচর জিজ্ঞাসিত প্রশ্নগুলোর উত্তর এখানে পাবেন।
        </p>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-20">
        {faqData.map((section, sIndex) => (
          <div key={sIndex} className="space-y-8">
            <div className="flex items-center gap-4">
               <div className="h-px bg-gray-200 flex-1"></div>
               <h2 className="caps-label text-bd-green whitespace-nowrap">{section.category}</h2>
               <div className="h-px bg-gray-200 flex-1"></div>
            </div>
            
            <div className="bg-white minimal-border overflow-hidden divide-y divide-gray-100">
              {section.items.map((item, iIndex) => {
                const globalIndex = sIndex * 10 + iIndex;
                return (
                  <FAQItem
                    key={iIndex}
                    question={item.question}
                    answer={item.answer}
                    isOpen={openIndex === globalIndex}
                    onClick={() => toggleFAQ(globalIndex)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-black text-white p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 group">
        <div className="space-y-6">
          <div className="caps-label text-bd-green">Help & Contact</div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">আরও কিছু জানতে চান?</h2>
          <p className="text-xl text-gray-400 max-w-md font-medium">
            আমাদের সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত। যেকোনো প্রয়োজনে সরাসরি যোগাযোগ করুন।
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <button className="bg-white text-black px-10 py-5 font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-100 transition-all">
             মেসেজ দিন <MessageCircle size={20} />
          </button>
          <Link to="/about" className="border border-gray-800 text-white px-10 py-5 font-bold text-lg flex items-center justify-center gap-3 hover:bg-gray-900 transition-all">
             লক্ষ্য ও উদ্দেশ্য <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Minimal Footer Info */}
      <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-gray-100 gap-6">
         <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400">
            <ShieldCheck size={14} className="text-bd-green" /> Last Updated: February 2025
         </div>
         <div className="flex gap-8">
            <Link to="/tools" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Terms of Service</Link>
            <Link to="/tools" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black">Privacy Policy</Link>
         </div>
      </div>
    </div>
  );
};

export default FAQ;
