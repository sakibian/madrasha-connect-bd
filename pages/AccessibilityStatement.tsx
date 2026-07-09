
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Eye, Keyboard, Monitor, Smartphone } from 'lucide-react';

const AccessibilityStatement: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-fadeIn">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black transition-colors">
        <ArrowLeft size={16} /> হোমে ফিরুন
      </Link>

      <div className="space-y-6">
        <div className="caps-label text-bd-green">Accessibility</div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">প্রবেশযোগ্যতা বিবৃতি</h1>
        <p className="text-lg text-gray-500 font-medium leading-relaxed">
          মাদ্রাসা কানেক্ট সবার জন্য উন্মুক্ত। আমরা সকল ব্যবহারকারীদের — বিশেষত প্রতিবন্ধী ব্যবহারকারীদের — জন্য সমতামূলক অভিজ্ঞতা নিশ্চিত করতে প্রতিশ্রুতিবদ্ধ।
        </p>
      </div>

      <div className="bg-white p-12 minimal-border space-y-8">
        <h2 className="text-xl font-extrabold flex items-center gap-3">
          <ShieldCheck size={20} className="text-bd-green" /> আমাদের প্রতিশ্রুতি
        </h2>
        <p className="text-gray-600 leading-relaxed">
          মাদ্রাসা কানেক্ট WCAG 2.1 লেভেল AA মানদণ্ড অনুসরণ করার চেষ্টা করে। আমরা নিয়মিতভাবে আমাদের প্ল্যাটফর্ম পরীক্ষা করি এবং উন্নতি করি।
        </p>
      </div>

      <div className="bg-white p-12 minimal-border space-y-8">
        <h2 className="text-xl font-extrabold flex items-center gap-3">
          <Eye size={20} className="text-bd-green" /> দৃশ্যমানতা
        </h2>
        <ul className="space-y-3 text-gray-600 leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            সকল টেক্সটে পর্যাপ্ত কন্ট্রাস্ট রেশিও (৪.৫:১ বা তার বেশি)
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            সকল ইমেজে বিকল্প পাঠ্য (alt text) সরবরাহ করা হয়েছে
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            রঙের একমাত্র উপায়ে তথ্য প্রকাশ করা হয়নি
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            ফোকাস ইন্ডিকেটর সকল ইন্টারেক্টিভ উপাদানে দৃশ্যমান
          </li>
        </ul>
      </div>

      <div className="bg-white p-12 minimal-border space-y-8">
        <h2 className="text-xl font-extrabold flex items-center gap-3">
          <Keyboard size={20} className="text-bd-green" /> কীবোর্ড নেভিগেশন
        </h2>
        <ul className="space-y-3 text-gray-600 leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            সকল পৃষ্ঠা কীবোর্ড দিয়ে নেভিগেট করা যায়
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            Skip to content লিংক উপলব্ধ
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            মডাল ও ড্রপডাউনে ফোকাস ট্র্যাপ ব্যবহার করা হয়েছে
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            ESC কী দিয়ে মডাল বন্ধ করা যায়
          </li>
        </ul>
      </div>

      <div className="bg-white p-12 minimal-border space-y-8">
        <h2 className="text-xl font-extrabold flex items-center gap-3">
          <Monitor size={20} className="text-bd-green" /> স্ক্রিন রিডার সাপোর্ট
        </h2>
        <ul className="space-y-3 text-gray-600 leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            ARIA লেবেল ও রোল সকল ইন্টারেক্টিভ উপাদানে প্রয়োগ করা হয়েছে
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            ডায়নামিক কন্টেন্ট আপডেট aria-live অঞ্চলে ঘোষিত হয়
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            বাংলা ভাষার জন্য lang="bn" অ্যাট্রিবিউট সেট করা আছে
          </li>
        </ul>
      </div>

      <div className="bg-white p-12 minimal-border space-y-8">
        <h2 className="text-xl font-extrabold flex items-center gap-3">
          <Smartphone size={20} className="text-bd-green" /> মোবাইল ও রেসপন্সিভ
        </h2>
        <ul className="space-y-3 text-gray-600 leading-relaxed">
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            সকল পৃষ্ঠা মোবাইল, ট্যাবলেট ও ডেস্কটপে সঠিকভাবে প্রদর্শিত হয়
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            টাচ টার্গেট কমপক্ষে ৪৪×৪৪ পিক্সেল
          </li>
          <li className="flex items-start gap-3">
            <span className="text-bd-green mt-1">✓</span>
            PWA সাপোর্ট — অফলাইনেও ব্যবহারযোগ্য
          </li>
        </ul>
      </div>

      <div className="bg-white p-12 minimal-border space-y-8">
        <h2 className="text-xl font-extrabold">যোগাযোগ</h2>
        <p className="text-gray-600 leading-relaxed">
          আপনি যদি কোনো প্রবেশযোগ্যতা সমস্যার সম্মুখীন হন, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:
        </p>
        <div className="bg-gray-50 p-6 rounded-2xl">
          <p className="font-bold text-gray-800">ইমেইল: accessibility@madrasaconnectbd.com</p>
          <p className="text-sm text-gray-500 mt-2">আমরা ৪৮ ঘণ্টার মধ্যে উত্তর দেওয়ার চেষ্টা করব।</p>
        </div>
      </div>

      <div className="text-center pb-12">
        <p className="text-sm text-gray-400 font-medium">শেষ আপডেট: জুলাই ২০২৬</p>
      </div>
    </div>
  );
};

export default AccessibilityStatement;
