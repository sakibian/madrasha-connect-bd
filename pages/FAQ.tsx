
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, Briefcase, MessageCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-emerald-50 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left hover:text-emerald-700 transition-colors focus:outline-none"
      >
        <span className="font-bold text-gray-800">{question}</span>
        {isOpen ? (
          <ChevronUp className="text-emerald-600 shrink-0" size={20} />
        ) : (
          <ChevronDown className="text-gray-400 shrink-0" size={20} />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed text-sm">
          {answer}
        </p>
      </div>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      category: 'সাধারণ তথ্য',
      icon: <HelpCircle className="text-emerald-600" />,
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
      icon: <Briefcase className="text-blue-600" />,
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
      icon: <BookOpen className="text-orange-600" />,
      items: [
        {
          question: 'কিতাব বা রিসোর্স কীভাবে ডাউনলোড করব?',
          answer: 'নলেজ হাব (Knowledge Hub) এ গিয়ে আপনি বিষয়ভিত্তিক সার্চ করতে পারেন। আপনার প্রয়োজনীয় কিতাবটি খুঁজে পেলে তার পাশের ডাউনলোড বাটনে ক্লিক করুন। ফাইলটি পিডিএফ (PDF) ফরম্যাটে আপনার ডিভাইসে সেভ হবে।'
        }
      ]
    },
    {
      category: 'নিরাপত্তা ও নীতিমালা',
      icon: <ShieldCheck className="text-purple-600" />,
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
    <div className="max-w-4xl mx-auto space-y-10 animate-fadeIn pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold text-gray-900">সাধারণ জিজ্ঞাসা (FAQ)</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          মাদ্রাসা কানেক্ট বিডি প্ল্যাটফর্ম ব্যবহারের নিয়মাবলী এবং সচরাচর জিজ্ঞাসিত প্রশ্নগুলোর উত্তর এখানে পাবেন।
        </p>
      </div>

      <div className="space-y-8">
        {faqData.map((section, sIndex) => (
          <div key={sIndex} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-emerald-50/50 px-6 py-4 flex items-center gap-3 border-b border-emerald-50">
              {section.icon}
              <h2 className="font-black text-emerald-900 uppercase tracking-wide text-sm">{section.category}</h2>
            </div>
            <div className="px-6 divide-y divide-emerald-50">
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

      <div className="bg-emerald-800 rounded-3xl p-8 text-center text-white shadow-xl shadow-emerald-100 mt-12">
        <h2 className="text-2xl font-bold mb-2">আরও কিছু জানতে চান?</h2>
        <p className="text-emerald-100 mb-6">আমাদের সাপোর্ট টিম আপনাকে সাহায্য করতে প্রস্তুত।</p>
        <button className="bg-white text-emerald-800 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2 mx-auto">
          <MessageCircle size={20} /> মেসেজ দিন
        </button>
      </div>
    </div>
  );
};

export default FAQ;
