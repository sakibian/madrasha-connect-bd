import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Privacy Policy — Bengali-first, aligned with Bangladesh Data Protection Act
 * (draft) and Google Play requirements. Written as a good-faith draft; must
 * be reviewed by a lawyer before real launch.
 */
const PrivacyPolicy: React.FC = () => (
  <article className="max-w-3xl mx-auto space-y-10 animate-fadeIn">
    <header className="space-y-4 border-b border-gray-100 pb-10">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black"
      >
        <ArrowLeft size={14} /> হোমপেজে ফিরুন
      </Link>
      <div className="caps-label text-gray-400">Legal • Last Updated: 01 Aug 2026</div>
      <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">গোপনীয়তা নীতি।</h1>
      <p className="text-gray-500 font-medium leading-relaxed">
        মাদ্রাসা কানেক্ট বাংলাদেশ আপনার ব্যক্তিগত তথ্যের গোপনীয়তার প্রতি সর্বোচ্চ গুরুত্ব দেয়। এই নীতিতে বর্ণিত আছে যে আমরা
        কোন তথ্য সংগ্রহ করি, কীভাবে ব্যবহার করি, এবং আপনার নিয়ন্ত্রণাধীন অধিকারসমূহ।
      </p>
    </header>

    <Section title="১. আমরা কী কী তথ্য সংগ্রহ করি">
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-500">
        <li><strong className="text-black">অ্যাকাউন্ট তথ্য:</strong> নাম, ইমেইল, ফোন নম্বর, প্রতিষ্ঠানের নাম (যদি প্রযোজ্য), প্রোফাইল ছবি</li>
        <li><strong className="text-black">প্রোফাইল ও কন্ট্রিবিউশন:</strong> ফতোয়া, ফোরাম পোস্ট, চাকরির আবেদন, রিভিউ ইত্যাদি</li>
        <li><strong className="text-black">ডিভাইস ও ব্যবহার:</strong> ব্রাউজার, অপারেটিং সিস্টেম, IP ঠিকানা, ভিজিট করা পেজ</li>
        <li><strong className="text-black">যোগাযোগ:</strong> ফিডব্যাক ফর্ম, সাপোর্ট মেসেজ</li>
      </ul>
    </Section>

    <Section title="২. তথ্য ব্যবহারের উদ্দেশ্য">
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-500">
        <li>অ্যাকাউন্ট তৈরি, লগইন, এবং সেবা প্রদান</li>
        <li>ইমেইল ও SMS নোটিফিকেশন পাঠানো (চাকরি, ফতোয়া, কমিউনিটি আপডেট)</li>
        <li>প্ল্যাটফর্মের নিরাপত্তা ও কন্টেন্ট মডারেশন</li>
        <li>বেনামী পরিসংখ্যান তৈরি করে সেবার মান উন্নয়ন</li>
      </ul>
    </Section>

    <Section title="৩. তথ্য শেয়ারিং">
      আমরা আপনার ব্যক্তিগত তথ্য কখনো বিক্রি করি না। শুধুমাত্র নিম্নলিখিত ক্ষেত্রে সীমিত তথ্য তৃতীয় পক্ষের সাথে শেয়ার হতে পারে:
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-500">
        <li><strong className="text-black">Supabase (হোস্টিং):</strong> ডাটাবেজ, প্রমাণীকরণ, স্টোরেজ</li>
        <li><strong className="text-black">Google Gemini (AI):</strong> কন্টেন্ট মডারেশন — শুধু কন্টেন্ট পাঠানো হয়, ব্যক্তিগত তথ্য নয়</li>
        <li><strong className="text-black">SMS প্রদানকারী:</strong> ওটিপি পাঠানোর সময় শুধু ফোন নম্বর</li>
        <li><strong className="text-black">bKash / Nagad (দান):</strong> লেনদেনের সময় প্রয়োজনীয় তথ্য</li>
        <li>আইনগত বাধ্যবাধকতার ক্ষেত্রে বাংলাদেশের কর্তৃপক্ষের অনুরোধে</li>
      </ul>
    </Section>

    <Section title="৪. তথ্য সংরক্ষণের সময়সীমা">
      সক্রিয় অ্যাকাউন্টের তথ্য যতদিন অ্যাকাউন্ট বহাল থাকে ততদিন সংরক্ষণ করি। অ্যাকাউন্ট মুছে ফেলার অনুরোধ পাওয়ার ৯০ দিনের মধ্যে
      আমরা সমস্ত ব্যক্তিগত তথ্য মুছে ফেলি (আইনগত বাধ্যবাধকতা ব্যতীত)।
    </Section>

    <Section title="৫. আপনার অধিকার">
      আপনি যেকোনো সময়:
      <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-500">
        <li>আপনার সংরক্ষিত তথ্য দেখতে পারেন (Profile Builder থেকে)</li>
        <li>আপনার তথ্য সংশোধন করতে পারেন</li>
        <li>অ্যাকাউন্ট এবং সমস্ত তথ্য মুছে ফেলার অনুরোধ করতে পারেন</li>
        <li>নোটিফিকেশন প্রেফারেন্স পরিবর্তন করতে পারেন</li>
      </ul>
      অনুরোধের জন্য <a className="font-bold text-black underline" href="mailto:privacy@madrasaconnectbd.org">privacy@madrasaconnectbd.org</a> এ ইমেইল করুন।
    </Section>

    <Section title="৬. নিরাপত্তা">
      সমস্ত ডেটা HTTPS এনক্রিপশনের মাধ্যমে ট্রান্সমিট হয়। ডাটাবেজ পর্যায়ে Row-Level Security (RLS) নিশ্চিত করে যে ব্যবহারকারীরা
      শুধু তাদের নিজস্ব তথ্য পড়তে ও পরিবর্তন করতে পারে। পাসওয়ার্ড bcrypt দ্বারা হ্যাশ করা হয়।
    </Section>

    <Section title="৭. শিশুদের গোপনীয়তা">
      আমাদের সেবা ১৩ বছরের নিচের শিশুদের জন্য নয়। শিক্ষার্থী অ্যাকাউন্টের জন্য প্রতিষ্ঠান বা অভিভাবকের নিবন্ধন প্রয়োজন।
    </Section>

    <Section title="৮. পরিবর্তন">
      এই নীতিতে পরিবর্তন হলে আমরা প্ল্যাটফর্মে নোটিফিকেশনের মাধ্যমে জানিয়ে দেব। বড় পরিবর্তনের ক্ষেত্রে নতুন সম্মতির অনুরোধ করা হবে।
    </Section>

    <footer className="pt-10 border-t border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-widest">
      এই দস্তাবেজ একটি খসড়া। প্রকৃত আইনি চূড়ান্ত সংস্করণ প্রকাশের পূর্বে আইনজীবী দ্বারা পর্যালোচিত হবে।
    </footer>
  </article>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-extrabold tracking-tight">{title}</h2>
    <div className="text-gray-600 leading-relaxed font-medium">{children}</div>
  </section>
);

export default PrivacyPolicy;
